#!/usr/bin/env bash
# Runner side of the Hostinger deploy. Uploads to staging, verifies, then switches; never writes into the live doc root.
#   deploy.sh release <out_dir> <git_sha>   preflight → stage → rsync → verify → activate   (prints id=, previous=)
#   deploy.sh rollback [release_id]         switch back (default: the previous release)
#   deploy.sh prune | list
# Env: GL_TARGET   ssh host alias written by ssh-setup.sh (gl-prod), or "local" (selftest.sh: doc root on this machine)
#      GL_DOCROOT  absolute doc root of growlatics.us on the host (repo variable HOSTINGER_DEPLOY_PATH)
#      GL_MODE GL_KEEP GL_PRESERVE GL_V1_REVIEWED   passed through to remote.sh (see its header)
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
: "${GL_TARGET:?GL_TARGET unset}" "${GL_DOCROOT:?GL_DOCROOT unset (HOSTINGER_DEPLOY_PATH)}"
out() { [ -n "${GITHUB_OUTPUT:-}" ] && echo "$1" >> "$GITHUB_OUTPUT"; echo "$1"; }

remote() {
  set -- "$1" "$GL_DOCROOT" "${@:2}"
  local env; env=$(printf 'GL_MODE=%q GL_KEEP=%q GL_PRESERVE=%q GL_V1_REVIEWED=%q' \
    "${GL_MODE:-swap}" "${GL_KEEP:-5}" "${GL_PRESERVE:-.well-known}" "${GL_V1_REVIEWED:-}")
  if [ "$GL_TARGET" = local ]; then bash "$HERE/remote.sh" "$@"   # GL_* come from this environment
  else ssh "$GL_TARGET" "$env bash -s -- $(printf '%q ' "$@")" < "$HERE/remote.sh"; fi
}
# rsync with retries: a dropped connection resumes into the same staging dir, which never goes live unverified.
push() {
  local dest=$2; [ "$GL_TARGET" = local ] || dest="$GL_TARGET:$2"
  for i in 1 2 3; do rsync -rlt --delete --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r "$1" "$dest" && return 0; echo "rsync attempt $i failed" >&2; sleep $((i * 5)); done
  return 1
}
if command -v sha256sum >/dev/null; then sha() { sha256sum "$@"; }; else sha() { shasum -a 256 "$@"; }; fi

case "${1:-}" in
release)
  src=${2:?out dir}; sha=${3:?git sha}
  [[ "$sha" =~ ^[0-9a-f]{40}$ ]] || { echo "sha must be a full commit hash" >&2; exit 1; }
  node "$HERE/validate-export.mjs" "$src"
  id="$(date -u +%Y%m%dT%H%M%SZ)-${sha:0:12}"
  tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
  mkdir "$tmp/rel" && cp -pR "$src/." "$tmp/rel/"
  printf '%s\n%s\n' "$id" "$sha" > "$tmp/rel/deploy-release.txt"
  (cd "$tmp/rel" && find . -type f | LC_ALL=C sort | while read -r f; do sha "$f"; done) > "$tmp/$id.sha256"
  need_kb=$(du -sk "$tmp/rel" | cut -f1)
  remote preflight "$need_kb"
  stage=$(remote stage "$id" | tail -n1)
  push "$tmp/rel/" "$stage/"
  push "$tmp/$id.sha256" "$stage.sha256"
  remote verify "$id"
  out "id=$id"
  remote activate "$id" | while read -r l; do out "$l"; done
  ;;
rollback) remote rollback "${2:-}" | while read -r l; do out "$l"; done ;;
prune|list) remote "$1" ;;
*) echo "usage: deploy.sh release <out_dir> <sha> | rollback [id] | prune | list" >&2; exit 2 ;;
esac
