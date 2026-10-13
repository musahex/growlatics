# First automated production release: 2026-10-13

Owner-authorised first rollout of the GitHub Actions → Hostinger pipeline (HAG-36), after reconciling the manual urgent release (HAG-38).

## Trust and access
- SSH: `u604656931@141.136.33.243:65002`, dedicated ED25519 deploy key `growlatics_github_deploy` (public key in hPanel; private key only on the owner's Mac and in the `production` environment secret).
- Host key: **owner-approved TOFU**, ED25519 `SHA256:dvH7tK5YZQ+Fv5mVgokf4EGLSsOte3P4ilNU5vUWl7M`, pinned in `HOSTINGER_SSH_KNOWN_HOSTS`; strict reconnect verified. Not Hostinger-certified (see CI_CD.md §5a).

## Read-only discovery (authenticated SSH)
| Check | Result |
|---|---|
| Doc root | `/home/u604656931/domains/growlatics.us/public_html`, a real directory (not a symlink) |
| Parent `domains/growlatics.us` | writable by the deploy user; same filesystem as the doc root (renames are same-device) |
| Tools | GNU coreutils 8.32 (`mv -T`), rsync 3.2.5, tar, gzip, sha256sum, flock, realpath, stat, df |
| `.well-known` | absent (SSL handled by Hostinger); `GL_PRESERVE` keeps it if it appears |
| Disk | ample (multi-TB volume) |
| Other files in parent | two old upload zips and `DO_NOT_UPLOAD_HERE`; the deploy never touches them |
| `/dev/fd` | **missing** (CageFS): process substitution fails. Fixed in `remote.sh` (fa0163b) after the real-server preflight exposed it |

## Backups of the replaced release (manual urgent release, source `d2dbe47`)
- `~/growlatics-backups/growlatics-prod-d2dbe47-20261013T102650Z.tar.gz` on the server (outside every web root, mode 700 dir), sha256 `5a01fc3a…6bc20c01`, plus a copy on the owner's Mac in `~/GrowlaticsBackups/`.
- Pipeline's own: `.growlatics-deploy/backups/v1-20261013T104042Z.tar.gz` and the intact release `.growlatics-deploy/releases/v1-20261013T104042Z` (rollback target).

## The run
- Sequence: PR #2 (v2 → main) CI green → `HOSTINGER_V1_REVIEWED=true` and `PRODUCTION_DEPLOY_ENABLED=true` set → PR merged (main `d556fac`) → run 38384727796.
- Result: build + validate ✓, preflight ✓, stage + checksum verify ✓, switch ✓ (`previous=v1-20261013T104042Z`, `active=20261013T104028Z-d556fac1da06`), smoke PASS.
- Independent checks: 10 routes 200, no `noindex`, self canonicals on growlatics.us, sitemap 10 URLs, robots Allow + sitemap; `/privacy/`, `/terms/`, `/lab/system/` 404; HTTP and www → apex 301; security headers present; `_next/static` immutable; Houston address and `/services/voice-ai-testing/` live; browser: nav and mobile menu at 1440/1024/820/390, no console errors; Growth Engine footer test 16/16 clean.

## Rollback
GitHub › Actions › **Rollback production** (type `ROLLBACK`) or `deploy.sh rollback` restores `v1-20261013T104042Z` (the manual urgent release). Emergency stop: set `PRODUCTION_DEPLOY_ENABLED` to anything but `true`.
