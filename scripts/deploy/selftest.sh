#!/usr/bin/env bash
# Local proof of the deploy pipeline: a temp directory stands in for Hostinger (no network, no credentials).
#   npm run build && bash scripts/deploy/selftest.sh
# Covers: export validation, fail-closed preflight, staging → verify → switch, v1 backup, preserved .well-known,
# no stale _next chunks, partial upload never goes live, rollback (previous, v1, by id), prune, symlink mode, smoke.
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd); OUT=${1:-out}
[ -f "$OUT/index.html" ] || { echo "build first: npm run build" >&2; exit 1; }
T=$(mktemp -d); PORT=$((20000 + RANDOM % 20000)); SRV=
cleanup() { [ -n "$SRV" ] && { kill "$SRV"; wait "$SRV"; } 2>/dev/null || true; rm -rf "$T"; }; trap cleanup EXIT
pass=0
ok() { pass=$((pass + 1)); echo "  ok  $*"; }
fail() { echo "  FAIL $*" >&2; exit 1; }
live() { head -n1 "$GL_DOCROOT/deploy-release.txt" 2>/dev/null || echo none; }
deploy() { bash "$HERE/deploy.sh" "$@"; }
export GL_TARGET=local GL_KEEP=2

v1site() {  # a pre-CI site as Hostinger might hold it
  mkdir -p "$1/_next/static/old" "$1/.well-known/acme-challenge"
  echo '<html>v1</html>' > "$1/index.html"; echo 'ErrorDocument 404 /404.html' > "$1/.htaccess"
  echo old > "$1/_next/static/old/stale.js"; echo token > "$1/.well-known/acme-challenge/t"
}

echo "1. export validation"
node "$HERE/validate-export.mjs" --self-test >/dev/null && ok "validate-export self-test"
node "$HERE/validate-export.mjs" "$OUT" >/dev/null && ok "build output $OUT passes"

echo "2. preflight fails closed"
export GL_DOCROOT="$T/home/u1/domains/growlatics.us/public_html"
mkdir -p "$GL_DOCROOT"; echo x > "$GL_DOCROOT/readme.txt"
deploy release "$OUT" "$(printf 'a%.0s' {1..40})" 2>/dev/null && fail "deployed into a doc root with no index" || ok "refuses a doc root that is not a website"
rm "$GL_DOCROOT/readme.txt"; v1site "$GL_DOCROOT"
deploy release "$OUT" "$(printf 'a%.0s' {1..40})" 2>/dev/null && fail "retired an unreviewed v1" || ok "refuses unreviewed v1 entries without HOSTINGER_V1_REVIEWED"
[ "$(cat "$GL_DOCROOT/index.html")" = '<html>v1</html>' ] && ok "v1 untouched after refusals"
GL_DOCROOT=relative/path deploy release "$OUT" "$(printf 'a%.0s' {1..40})" 2>/dev/null && fail "relative path" || ok "refuses a relative doc root"

echo "3. first deploy (swap mode)"
SHA1=$(printf '1%.0s' {1..40}); SHA2=$(printf '2%.0s' {1..40}); SHA3=$(printf '3%.0s' {1..40})
GL_V1_REVIEWED=true deploy release "$OUT" "$SHA1" > "$T/r1"
ID1=$(sed -n 's/^id=//p' "$T/r1"); BASE="$(dirname "$GL_DOCROOT")/.growlatics-deploy"
[ "$(live)" = "$ID1" ] && ok "release $ID1 live"
V1=$(sed -n 's/^previous=//p' "$T/r1"); [[ $V1 == v1-* ]] && [ -d "$BASE/releases/$V1" ] && ok "pre-CI site kept as releases/$V1"
tar tzf "$BASE/backups/$V1.tar.gz" | grep -q index.html && ok "v1 tarball backup"
[ ! -e "$GL_DOCROOT/_next/static/old" ] && ok "no stale _next chunks from v1"
[ -f "$GL_DOCROOT/.well-known/acme-challenge/t" ] && ok ".well-known carried over"
[ -f "$GL_DOCROOT/.htaccess" ] && cmp -s "$OUT/.htaccess" "$GL_DOCROOT/.htaccess" && ok ".htaccess deployed"
[ "$(find "$GL_DOCROOT" -type f | wc -l)" -ge "$(find "$OUT" -type f | wc -l)" ] && ok "all files incl. dotfiles uploaded"
perm=$(ls -l "$GL_DOCROOT/index.html" | cut -c1-10); [ "$perm" = "-rw-r--r--" ] && ok "file mode 644"

echo "4. smoke test against the switched doc root"
node -e '
const http=require("http"),fs=require("fs"),path=require("path");const root=process.argv[1];
http.createServer((q,s)=>{let p=path.join(root,decodeURIComponent(q.url.split("?")[0]));
 try{if(fs.statSync(p).isDirectory())p=path.join(p,"index.html");s.writeHead(200);s.end(q.method==="HEAD"?"":fs.readFileSync(p))}
 catch{s.writeHead(404);s.end(fs.readFileSync(path.join(root,"404.html")))}}).listen(+process.argv[2],"127.0.0.1")' "$GL_DOCROOT" "$PORT" &
SRV=$!; sleep 1
node "$HERE/smoke.mjs" "http://127.0.0.1:$PORT" "$ID1" --local > "$T/smoke1" && ok "smoke (HTTP, local) passes for $ID1" || { cat "$T/smoke1"; fail smoke; }
node "$HERE/smoke.mjs" "http://127.0.0.1:$PORT" "wrong-id" --basic --local > /dev/null 2>&1 && fail "smoke passed a wrong release" || ok "smoke fails on a wrong release marker"

echo "5. second deploy, foreign file, partial upload"
sleep 1; deploy release "$OUT" "$SHA2" > "$T/r2"; ID2=$(sed -n 's/^id=//p' "$T/r2")
[ "$(live)" = "$ID2" ] && grep -qx "previous=$ID1" "$T/r2" && ok "release $ID2 live, $ID1 kept"
echo hacked > "$GL_DOCROOT/dropped-by-hand.php"
deploy release "$OUT" "$SHA3" 2>/dev/null && fail "deployed over a hand-added file" || ok "refuses when the doc root has a file no release put there"
rm "$GL_DOCROOT/dropped-by-hand.php"
PID="$(date -u +%Y%m%dT%H%M%SZ)-333333333333"; stage=$(bash "$HERE/remote.sh" stage "$GL_DOCROOT" "$PID")
cp "$OUT/index.html" "$stage/"; echo "$PID" > "$stage/deploy-release.txt"
(cd "$OUT" && find . -type f | head -20 | while read -r f; do shasum -a 256 "$f"; done) > "$stage.sha256"
bash "$HERE/remote.sh" verify "$GL_DOCROOT" "$PID" 2>/dev/null && fail "verified a partial upload" || ok "partial upload rejected at verify"
bash "$HERE/remote.sh" activate "$GL_DOCROOT" "$PID" 2>/dev/null && fail "activated an unverified release" || ok "unverified release cannot be activated"
[ "$(live)" = "$ID2" ] && ok "live still $ID2"

echo "6. rollback"
deploy rollback > "$T/rb1"; [ "$(live)" = "$ID1" ] && ok "rollback (default) → $ID1"
node "$HERE/smoke.mjs" "http://127.0.0.1:$PORT" "$ID1" --basic > /dev/null && ok "rollback verified by smoke --basic"
deploy rollback "$V1" > /dev/null; [ "$(live)" = "$V1" ] && grep -q v1 "$GL_DOCROOT/index.html" && ok "rollback → pre-CI site $V1"
[ -f "$GL_DOCROOT/.well-known/acme-challenge/t" ] && ok ".well-known still served after rollback"
deploy rollback "$ID2" > /dev/null; [ "$(live)" = "$ID2" ] && ok "rollback by id → $ID2"
deploy rollback "20990101T000000Z-deadbeefdead" 2>/dev/null && fail "rolled back to a missing release" || ok "missing release id refused, live unchanged ($(live))"
deploy rollback '../../etc' 2>/dev/null && fail "path in id" || ok "path-like release id refused"

echo "7. prune (GL_KEEP=2)"
for s in 4 5 6; do sleep 1; deploy release "$OUT" "$(printf "$s%.0s" {1..40})" > /dev/null; done
deploy prune > /dev/null
n=$(find "$BASE/releases" -mindepth 1 -maxdepth 1 ! -name 'v1-*' | wc -l | tr -d ' '); [ "$n" = 2 ] && ok "2 previous releases kept"
[ -d "$BASE/releases/$V1" ] && ok "v1 never pruned"
[ -z "$(ls "$BASE/incoming")" ] && ok "staging emptied"

echo "8. layout marker"
GL_DOCROOT2="$(dirname "$GL_DOCROOT")/public_html2"; mkdir -p "$GL_DOCROOT2"; v1site "$GL_DOCROOT2"
GL_DOCROOT=$GL_DOCROOT2 GL_V1_REVIEWED=true deploy release "$OUT" "$SHA1" 2>/dev/null && fail "used another doc root's layout" || ok "BASE/ROOT mismatch refused"

echo "9. symlink mode"
export GL_DOCROOT="$T/sym/public_html" GL_MODE=symlink; mkdir -p "$GL_DOCROOT"; v1site "$GL_DOCROOT"
GL_V1_REVIEWED=true deploy release "$OUT" "$SHA1" > "$T/s1"; S1=$(sed -n 's/^id=//p' "$T/s1")
[ -L "$GL_DOCROOT" ] && [ "$(live)" = "$S1" ] && ok "doc root is now a symlink to $S1"
sleep 1; deploy release "$OUT" "$SHA2" > /dev/null; deploy rollback > /dev/null; [ "$(live)" = "$S1" ] && ok "symlink rollback → $S1"
GL_MODE=swap deploy release "$OUT" "$SHA3" 2>/dev/null && fail "swap on a symlink" || ok "mode mismatch refused"

echo "selftest: $pass checks passed"
