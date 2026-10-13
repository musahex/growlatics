#!/usr/bin/env bash
# Runs ON the host (Hostinger) over SSH: ssh gl-prod "GL_...=... bash -s -- <cmd> <docroot> [arg]" < remote.sh
# scripts/deploy/lib.sh calls it; scripts/deploy/selftest.sh runs it against a local directory. See docs/deployment/CI_CD.md.
#
# Layout (BASE is a sibling of the doc root, so outside it and on the same filesystem):
#   <docroot>                       live site (swap mode: a real directory; symlink mode: a symlink into releases/)
#   <parent>/.growlatics-deploy/
#     ROOT                          the doc root this BASE belongs to (layout marker, checked on every run)
#     incoming/<id>/  <id>.sha256   upload staging; never served
#     releases/<id>/                verified releases (v1-<ts> = the site that was live before the first deploy)
#     meta/<id>.entries             top-level names each release put in the doc root
#     backups/v1-<ts>.tar.gz        tarball of the pre-CI site, taken on the first activation
#     history                       one activated id per line
#     lock/                         held while switching
# Commands: preflight <need_kb> | stage <id> | verify <id> | activate <id> | rollback [id] | prune | list
# Env: GL_MODE=swap|symlink (default swap), GL_KEEP (default 5), GL_PRESERVE (default ".well-known"),
#      GL_V1_REVIEWED=true (required once, to retire a doc root this tool never deployed).
set -euo pipefail
umask 022
shopt -s dotglob nullglob

CMD=${1:?command}; DOCROOT=${2:?docroot}; ARG=${3:-}
MODE=${GL_MODE:-swap}; KEEP=${GL_KEEP:-5}; PRESERVE=${GL_PRESERVE:-.well-known}
MARKER=deploy-release.txt
die() { echo "REMOTE FAIL: $*" >&2; exit 1; }
log() { echo "remote: $*" >&2; }

# ---- fail-closed input checks -------------------------------------------------------------------
case "$DOCROOT" in /*) ;; *) die "doc root must be an absolute path" ;; esac
DOCROOT=${DOCROOT%/}
case "$DOCROOT/" in */../*|*/./*|*//*) die "doc root has . / .. / // segments: $DOCROOT" ;; esac
[ "$DOCROOT" != "${HOME%/}" ] && [ "$(dirname "$DOCROOT")" != / ] || die "refusing doc root $DOCROOT"
[[ "$MODE" == swap || "$MODE" == symlink ]] || die "GL_MODE must be swap or symlink"
[[ "$KEEP" =~ ^[0-9]+$ ]] && [ "$KEEP" -ge 2 ] || die "GL_KEEP must be a number >= 2"
for p in $PRESERVE; do [[ "$p" =~ ^[A-Za-z0-9._-]+$ && "$p" != . && "$p" != .. ]] || die "bad GL_PRESERVE entry: $p"; done
valid_id() { [[ "$1" =~ ^([0-9]{8}T[0-9]{6}Z-[0-9a-f]{7,40}|v1-[0-9]{8}T[0-9]{6}Z)$ ]]; }

PARENT=$(dirname "$DOCROOT"); BASE="$PARENT/.growlatics-deploy"
REL="$BASE/releases"; INC="$BASE/incoming"; META="$BASE/meta"

# GNU (Linux hosts) vs BSD (macOS, used by selftest.sh) differences.
if stat -c %d / >/dev/null 2>&1; then dev() { stat -c %d "$1"; }; else dev() { stat -f %d "$1"; }; fi
if command -v sha256sum >/dev/null; then shacheck() { sha256sum -c --quiet "$1"; }; else shacheck() { shasum -a 256 -c --quiet "$1"; }; fi
if mv --version 2>/dev/null | grep -q GNU; then mvlink() { mv -Tf "$1" "$2"; }; else mvlink() { mv -fh "$1" "$2"; }; fi

current_id() { [ -f "$DOCROOT/$MARKER" ] && head -n1 "$DOCROOT/$MARKER" || echo none; }
entries() { local f; for f in "$1"/*; do [ "${f##*/}" = "$MARKER" ] || echo "${f##*/}"; done; }
# Names in the live doc root that the current release did not put there and that are not preserved.
foreign() {
  # Pure bash: Hostinger's CageFS has no /dev/fd, so process substitution fails there and grep -f <(…) matched nothing.
  local known="$META/$1.entries" n skip=$'\n'"$MARKER"$'\n'
  [ -f "$known" ] && skip+="$(cat "$known")"$'\n'
  for n in $PRESERVE; do skip+="$n"$'\n'; done
  entries "$DOCROOT" | while IFS= read -r n; do [[ "$skip" == *$'\n'"$n"$'\n'* ]] || echo "$n"; done
}

require_layout() {
  [ -d "$BASE" ] && [ -f "$BASE/ROOT" ] || die "no deploy layout at $BASE (run preflight first)"
  [ "$(cat "$BASE/ROOT")" = "$DOCROOT" ] || die "$BASE/ROOT names $(cat "$BASE/ROOT"), not $DOCROOT"
}
lock() { mkdir "$BASE/lock" 2>/dev/null || die "locked: $BASE/lock exists (another deploy running, or a crashed one: inspect, then rmdir it)"; trap 'rmdir "$BASE/lock" 2>/dev/null || true' EXIT; }

# Copy preserved names (e.g. .well-known for SSL renewal) from the live doc root into the target release.
carry() { local t=$1 p; for p in $PRESERVE; do [ -e "$DOCROOT/$p" ] || continue; rm -rf "${t:?}/$p"; cp -pR "$DOCROOT/$p" "$t/$p"; done; }

# Make release $1 live. The current live site is kept as releases/<its id>.
switch_to() {
  local target=$1 cur; cur=$(current_id)
  [ -d "$REL/$target" ] || die "release $target not found"
  carry "$REL/$target"
  if [ "$cur" = none ]; then
    # First activation: the pre-CI site. Tarball it, then keep it intact as release v1-<ts>.
    cur="v1-$(date -u +%Y%m%dT%H%M%SZ)"; mkdir -p "$BASE/backups"
    tar czf "$BASE/backups/$cur.tar.gz" -C "$DOCROOT" . || die "v1 backup failed; nothing switched"
    log "backed up pre-CI site to $BASE/backups/$cur.tar.gz"
  fi
  if [ -L "$DOCROOT" ]; then
    [ "$MODE" = symlink ] || die "doc root is a symlink but GL_MODE=swap"
    ln -sfn "$REL/$target" "$BASE/.newlink"; mvlink "$BASE/.newlink" "$DOCROOT"      # one atomic rename
  else
    # Real directory. Two renames on one filesystem: the gap between them is microseconds.
    [ ! -e "$REL/$cur" ] || die "releases/$cur already exists; refusing to overwrite it"
    mv "$DOCROOT" "$REL/$cur"
    if [ "$MODE" = symlink ]; then
      ln -sfn "$REL/$target" "$BASE/.newlink" && mvlink "$BASE/.newlink" "$DOCROOT" || { mv "$REL/$cur" "$DOCROOT"; die "switch failed, restored $cur"; }
    else
      mv "$REL/$target" "$DOCROOT" || { mv "$REL/$cur" "$DOCROOT"; die "switch failed, restored $cur"; }
    fi
    if [[ $cur == v1-* ]] && [ ! -f "$REL/$cur/$MARKER" ]; then
      entries "$REL/$cur" > "$META/$cur.entries"; echo "$cur" > "$REL/$cur/$MARKER"
    fi
  fi
  [ "$(current_id)" = "$target" ] || die "after switch the doc root reports $(current_id), expected $target"
  echo "$target" >> "$BASE/history"
  echo "previous=$cur"; echo "active=$target"
}

case "$CMD" in
preflight)
  need=${ARG:?need_kb}; [[ "$need" =~ ^[0-9]+$ ]] || die "need_kb must be a number"
  [ -d "$DOCROOT" ] || die "doc root $DOCROOT does not exist or is not a directory"
  [ -w "$PARENT" ] || die "$PARENT is not writable by $(id -un)"
  [ "$(dev "$PARENT")" = "$(dev "$DOCROOT/.")" ] || die "doc root and $PARENT are on different filesystems; renames would not be atomic"
  if [ -L "$DOCROOT" ] && [ "$MODE" = swap ]; then die "doc root is a symlink; set GL_MODE=symlink"; fi
  if [ -f "$BASE/ROOT" ]; then
    require_layout
  else
    [ -e "$BASE" ] && die "$BASE exists without a ROOT marker; inspect it by hand"
    # First run: the doc root must look like a website, and the owner must have reviewed it (OWNER_SETUP.md).
    [ -e "$DOCROOT/index.html" ] || [ -e "$DOCROOT/index.php" ] || [ -e "$DOCROOT/.htaccess" ] || die "$DOCROOT has no index.html/index.php/.htaccess; is it really the growlatics.us doc root?"
  fi
  cur=$(current_id); f=$(foreign "$cur")
  if [ -n "$f" ]; then
    log "in the doc root but not from the current release ($cur):"; printf '  %s\n' $f >&2
    if [ "$cur" = none ] && [ "${GL_V1_REVIEWED:-}" = true ]; then log "accepted: first deploy, owner reviewed (they stay in releases/v1-* and the v1 tarball)"
    else die "unexpected entries in the doc root; add them to HOSTINGER_PRESERVE or remove them by hand (first deploy: set HOSTINGER_V1_REVIEWED=true after reviewing)"; fi
  fi
  live_kb=$(du -sk "$DOCROOT/" | cut -f1); free_kb=$(df -Pk "$PARENT" | awk 'NR==2{print $4}')
  want=$((need * 2 + live_kb + 51200))
  [ "$free_kb" -ge "$want" ] || die "only ${free_kb}KB free in $PARENT, want ${want}KB"
  if [ ! -f "$BASE/ROOT" ]; then mkdir -p "$REL" "$INC" "$META"; echo "$DOCROOT" > "$BASE/ROOT"; log "created $BASE"; fi
  [ -e "$BASE/lock" ] && die "locked: $BASE/lock exists"
  echo "current=$cur"; echo "free_kb=$free_kb"; echo "mode=$MODE"
  ;;
stage)
  require_layout; valid_id "$ARG" || die "bad release id"
  [ ! -e "$REL/$ARG" ] || die "release $ARG already exists"
  rm -rf "${INC:?}/$ARG" "$INC/$ARG.sha256"; mkdir -p "$INC/$ARG"   # left over from a dropped upload
  echo "$INC/$ARG"
  ;;
verify)
  require_layout; valid_id "$ARG" || die "bad release id"
  d="$INC/$ARG"; [ -d "$d" ] && [ -f "$d.sha256" ] || die "staging $d or its manifest is missing"
  (cd "$d" && shacheck "$d.sha256") || die "checksum mismatch in staging"
  want=$(grep -c . "$d.sha256"); have=$(cd "$d" && find . -type f | wc -l | tr -d ' ')
  [ "$want" = "$have" ] || die "staging has $have files, manifest lists $want"
  [ "$(head -n1 "$d/$MARKER")" = "$ARG" ] || die "staging marker does not match $ARG"
  entries "$d" > "$META/$ARG.entries"; mv "$d" "$REL/$ARG"; rm -f "$d.sha256"
  echo "verified=$ARG files=$have"
  ;;
activate)
  require_layout; valid_id "$ARG" || die "bad release id"; lock
  cur=$(current_id); f=$(foreign "$cur")
  [ -z "$f" ] || { [ "$cur" = none ] && [ "${GL_V1_REVIEWED:-}" = true ]; } || die "doc root changed since preflight: $f"
  [ "$cur" != "$ARG" ] || die "$ARG is already live"
  switch_to "$ARG"
  ;;
rollback)
  require_layout; lock
  cur=$(current_id); target=$ARG
  if [ -z "$target" ]; then   # the newest history entry before the live one that still exists
    target=$(awk '{a[NR]=$0} END {for (i = NR; i > 0; i--) print a[i]}' "$BASE/history" 2>/dev/null | grep -vx "$cur" |
      while read -r t; do [ -d "$REL/$t" ] && { echo "$t"; break; }; done || true)
    if [ -z "$target" ]; then for t in "$REL"/v1-*; do target=${t##*/}; done; fi
  fi
  [ -n "$target" ] || die "no release to roll back to"
  valid_id "$target" || die "bad release id $target"; [ "$target" != "$cur" ] || die "$target is already live"
  f=$(foreign "$cur"); [ -z "$f" ] || die "doc root has entries no release put there: $f"
  switch_to "$target"
  ;;
prune)
  require_layout; lock; cur=$(current_id)
  rm -rf "${INC:?}"/* 2>/dev/null || true
  # Keep the newest $KEEP deployed releases besides the live one. v1-* (the pre-CI site) is never pruned.
  for d in "$REL"/*; do n=${d##*/}; if [[ $n =~ ^[0-9]{8}T[0-9]{6}Z- && $n != "$cur" ]]; then echo "$n"; fi; done | sort -r | tail -n +"$((KEEP + 1))" | while read -r old; do
    rm -rf "${REL:?}/$old" "$META/$old.entries"; log "pruned $old"; done
  echo "kept=$(entries "$REL" | tr '\n' ' ')"
  ;;
list)
  require_layout
  echo "live=$(current_id) mode=$([ -L "$DOCROOT" ] && echo symlink || echo swap)"
  for r in $(entries "$REL"); do echo "release $r $(du -sk "$REL/$r" | cut -f1)KB"; done
  echo "history: $(tail -n 10 "$BASE/history" 2>/dev/null | tr '\n' ' ')"
  ;;
*) die "unknown command $CMD" ;;
esac
