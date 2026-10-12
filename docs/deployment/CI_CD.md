# CI/CD: GitHub Actions → Hostinger (https://growlatics.us)

Status (2026-10-12): **IMPLEMENTED and TESTED locally; AWAITING CREDENTIALS and LAUNCH APPROVAL.** Nothing has deployed to Hostinger. It is not automatic or operational until a real push-to-main deploy has passed its smoke test. Owner steps: [OWNER_SETUP.md](OWNER_SETUP.md).

## 1. Architecture

```
feature/* ──PR──▶ main ──push──▶ deploy-production.yml
                   │               ├─ build (= ci.yml): npm ci · tsc · lint · self-checks · plain build · SEO crawl · export validation · site.tgz
                   │               └─ deploy  (only if PRODUCTION_DEPLOY_ENABLED == 'true', environment "production")
                   │                    newest-commit check · re-validate · ssh (pinned host key) · refuse older commit
                   │                    preflight (fails closed) → upload to staging → checksum verify → switch → HTTP smoke
                   │                    smoke fails → automatic rollback → rollback verified by smoke --basic
                   └─ PR: ci.yml (no secrets, publishes nothing)
v2 / feature branches: no deploy.   GitHub Pages preview: manual only, noindex build, never Hostinger.
```

Why this shape: the site is a static export (`out/`), Hostinger is shared hosting (no Node, no Docker), so the deploy is files over SSH + rsync. The live doc root is never written into: a full release is uploaded beside it, checksummed, and only then swapped in, so a dropped connection or partial upload can never go live.

| Branch / event | Environment | What runs |
|---|---|---|
| PR into `main` | none | `ci.yml` (no secrets) |
| push to `main` | `production` | `deploy-production.yml`: build always; deploy only when enabled |
| push to `v2` / feature branches | none | nothing |
| manual | `production` | `rollback-production.yml` |
| manual | `github-pages` | `deploy.yml` → `preview-pages.yml` (noindex preview at musahex.github.io/growlatics) |

## 2. Files

| File | Role |
|---|---|
| `.github/workflows/deploy-production.yml` | push to `main` only; concurrency `growlatics-production`, `cancel-in-progress: false` |
| `.github/workflows/ci.yml` | PR CI; also the build job of the production workflow (same checks, cannot drift) |
| `.github/workflows/rollback-production.yml` | manual rollback, typed `ROLLBACK` confirmation |
| `.github/workflows/deploy.yml`, `preview-pages.yml` | Pages preview, manual only (see §11) |
| `scripts/deploy/validate-export.mjs` | artifact checks: required files, 9 routes, canonicals, no noindex, no `/growlatics/` paths, no lab/legal drafts, robots/sitemap, `.htaccess`. `--self-test` |
| `scripts/deploy/check-workflows.mjs` | guards the prod/preview split, SHA pinning, secrets placement. `--self-test` |
| `scripts/deploy/deploy.sh` | runner side: `release`, `rollback [id]`, `prune`, `list` |
| `scripts/deploy/remote.sh` | host side (piped over SSH): `preflight`, `stage`, `verify`, `activate`, `rollback`, `prune`, `list` |
| `scripts/deploy/ssh-setup.sh` | writes the `gl-prod` ssh alias from secrets; host key from `HOSTINGER_SSH_KNOWN_HOSTS` only |
| `scripts/deploy/smoke.mjs` | HTTP smoke test (`--basic` for rollback verification) |
| `scripts/deploy/selftest.sh` | local end-to-end proof: a temp dir plays the host |
| `.nvmrc` | Node version (20) for every workflow |

All actions are pinned to commit SHAs (checkout v4.2.2, setup-node v4.1.0, upload-artifact v4.4.3, download-artifact v4.1.8, upload-pages-artifact v3.0.1, deploy-pages v4.0.5). To bump one, resolve the tag with `git ls-remote https://github.com/actions/<name> refs/tags/<tag>` and replace the SHA and comment.

## 3. Triggers and safety switches

- **Exact trigger:** `on: push: branches: [main]`. That covers merged PRs, direct commits, hotfixes and reverts. No `pull_request`, no `workflow_dispatch`, no other branch.
- **Kill switch:** the deploy job has `if: vars.PRODUCTION_DEPLOY_ENABLED == 'true'`. It must be a **repository** variable (environment variables are not visible to a job's `if`). Unset = every push to `main` builds and validates but sends nothing to Hostinger; the run shows a "Deploy disabled" job.
- **Emergency disable:** Settings › Secrets and variables › Actions › Variables › delete `PRODUCTION_DEPLOY_ENABLED` (or set it to anything but `true`). Takes effect for every run that has not started its deploy job. A run already deploying finishes (or rolls back) on its own. Do not cancel a run during "Upload, verify, switch": in swap mode a kill between the two renames could leave no doc root; if it happens, run the rollback workflow with `release_id=list`, then roll back to the last good id.
- **Stale code:** concurrency keeps one production run at a time and GitHub keeps only the newest pending run, so a superseded queued commit is dropped. The deploy job also skips itself if `main` has moved on, and refuses any commit that is an ancestor of the live commit (e.g. re-running an old run). Redeploying an old release is the rollback workflow's job.

## 4. GitHub settings (owner)

- Environment `production`: deployment branches = `main` only; URL https://growlatics.us. Required reviewers optional (Phase B: yes for the first run; Phase C: none, so pushes deploy unattended).
- Environment secrets (production): `HOSTINGER_SSH_PRIVATE_KEY`, `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_USER`, `HOSTINGER_SSH_PORT`, `HOSTINGER_SSH_KNOWN_HOSTS`.
- Repository variables:

| Variable | Value | Default if unset |
|---|---|---|
| `PRODUCTION_DEPLOY_ENABLED` | `true` to allow deploys | unset = deploy off |
| `HOSTINGER_DEPLOY_PATH` | absolute doc root of growlatics.us, from hPanel | none (deploy fails) |
| `PRODUCTION_URL` | `https://growlatics.us` | `https://growlatics.us` |
| `HOSTINGER_V1_REVIEWED` | `true` once the owner has listed the current doc root (first deploy only) | unset = first deploy refuses |
| `HOSTINGER_DEPLOY_MODE` | `swap` or `symlink` (§6) | `swap` |
| `HOSTINGER_KEEP_RELEASES` | releases kept besides the live one (≥ 2) | `5` |
| `HOSTINGER_PRESERVE` | space-separated names in the doc root to carry into every release | `.well-known` |
| `NEXT_PUBLIC_LEGAL_APPROVED` | `1` only after legal sign-off of Privacy/Terms | unset = drafts excluded |
| `NEXT_PUBLIC_LEAD_PROVIDER`, `NEXT_PUBLIC_LEAD_WEBHOOK_URL`, `NEXT_PUBLIC_BOOKING_URL` | lead/booking config (`lib/leads`) | unset = mailto flow |

- Branch protection on `main` (recommended): require PR + status check "CI / Build and validate", no force pushes, no deletion. Emergency hotfix path: an admin may bypass ("Allow specified actors to bypass"), push the fix to `main`, and the normal deploy runs; open a follow-up PR if the check was skipped.

## 5. Hostinger: what is known and what the deploy verifies itself

| Fact | Status |
|---|---|
| Plan type, SSH availability, host, port, user | **Unknown** (no access). Owner reads them in hPanel › Advanced › SSH Access. Port is often 65002; use hPanel's value. |
| Exact doc root of growlatics.us | **Unknown**. Never assumed to be `~/public_html` (addon domains live under `~/domains/<domain>/public_html`). Owner confirms in hPanel › Files › File Manager / Websites › Dashboard. |
| rsync on the host | **Unknown**; required (Hostinger's SSH plans normally ship it). If missing, see §13. |
| Symlinked doc root followed by the web server | **Unknown**; hence default `swap` mode. |
| Disk space, ownership | Checked at runtime by `preflight`. |
| HTTPS / CDN | HTTPS via Hostinger CDN verified 2026-10-09 (`public/.htaccess`). CDN caching behaviour after a deploy unknown; smoke uses cache-busting queries. |

Connection: SSH with a dedicated ed25519 deploy key (public half in hPanel only). Host key from `HOSTINGER_SSH_KNOWN_HOSTS` with `StrictHostKeyChecking yes`; never `ssh-keyscan` in CI. SFTP fallback was considered and not built: it gives no checksum verify or atomic rename and would need a different tool; plaintext FTP is never acceptable.

**Preflight (fails closed, writes nothing until all pass):** doc root is absolute, has no `.`/`..`, is not `/`'s child or `$HOME`; exists; parent writable; doc root and its parent on one filesystem (renames atomic); mode matches what is on disk; on later runs `.growlatics-deploy/ROOT` names exactly this doc root; on the first run the doc root must contain `index.html`, `index.php` or `.htaccess` and the owner must set `HOSTINGER_V1_REVIEWED=true`; nothing in the doc root that the live release did not put there (other than `HOSTINGER_PRESERVE`); free space ≥ 2 × release + live site + 50 MB; no deploy lock held.

## 6. Release layout and switch

```
<parent>/public_html                    live doc root (HOSTINGER_DEPLOY_PATH)
<parent>/.growlatics-deploy/            outside the doc root, same filesystem
  ROOT  history  lock/
  incoming/<id>/ + <id>.sha256          upload staging (never served)
  releases/<id>/                        verified releases; v1-<ts> = the pre-CI site
  meta/<id>.entries   backups/v1-<ts>.tar.gz
```
Release id = `<UTC yyyymmddThhmmssZ>-<sha12>`. Each release carries `deploy-release.txt` (id + full SHA), served at `/deploy-release.txt` so the smoke test proves which release is live.

- **swap (default):** the doc root stays a real directory. Switch = `mv public_html releases/<current>` then `mv releases/<new> public_html`: two renames on one filesystem, a gap of microseconds in which a request can get a 404. Honest limit: not strictly atomic, but works on any shared host and never serves a partial release.
- **symlink:** the doc root becomes a symlink into `releases/`, switched with one atomic `rename()`. Use only after confirming the web server follows a symlinked doc root (test: the first deploy in swap mode, then set `HOSTINGER_DEPLOY_MODE=symlink`; the next deploy converts it, and a failed smoke test rolls it back automatically).
- Every release is a complete fresh copy (rsync with `--delete` scoped to its own staging directory), so no old `_next` chunks linger. Modes: dirs 755, files 644. Dotfiles (`.htaccess`) included. Names in `HOSTINGER_PRESERVE` (default `.well-known`, for SSL renewal challenges) are copied from the live doc root into each release at switch time.
- Retention: `prune` after a passed smoke test keeps the newest `HOSTINGER_KEEP_RELEASES` deployed releases besides the live one, and never deletes `v1-*`.

## 7. Build configuration

`npm run build` with no `NEXT_PUBLIC_SITE_ENV` (so no basePath/assetPrefix, no noindex), `postbuild` drops `lab/` and the legal drafts unless `NEXT_PUBLIC_LEGAL_APPROVED=1`. Same build in PR CI and production (`ci.yml` is called by the deploy workflow). Artifact = `out/` packed as `site.tgz` (keeps `.htaccess`).

## 8. Deploy steps (what a run does)

1. Build job (see §1); fails the run on any tsc, lint, self-check, crawl or export problem.
2. Deploy job (only when enabled): newest-commit check → download + re-validate artifact → `ssh-setup.sh` → refuse older commit → `deploy.sh release`: preflight → stage → rsync (3 attempts, resumes into staging) → `verify` (sha256 of every file, file count, marker) → `activate` (v1 backup on the first run, then switch, then re-read the marker).
3. `smoke.mjs` against `PRODUCTION_URL` (HTTP only, labelled): release marker (retries ~60 s for CDN), 9 routes 200 + canonical + no noindex + no `/growlatics/`, branded 404, robots, sitemap (9 URLs), every asset referenced by `/` and `/contact/`, contact CTA wiring (form + mailto present; **inbox delivery is never checked**), security headers, HTML `no-cache`, `_next/static` immutable, http→https, www→apex 301.
4. Failure after the switch → automatic rollback to the previous release → `smoke.mjs --basic` must pass before anyone may call the rollback successful.
5. Job summary: SHA, branch, URL, release id, previous id, upload/switch, smoke and rollback outcomes.

No browser test is automated. The first activation includes a manual browser pass (OWNER_SETUP.md §4).

## 9. Backups

First activation: the existing v1 doc root is tarred to `backups/v1-<ts>.tar.gz`, then kept intact as `releases/v1-<ts>` (never pruned). Owner also takes an hPanel backup before the first run (OWNER_SETUP.md). Every later release stays in `releases/` until pruned.

## 10. Rollback

- **Automatic:** when the smoke test fails after a switch (see §8).
- **Manual (workflow):** Actions › "Roll back production (Hostinger)" › Run workflow on `main`: `confirm=ROLLBACK`, `release_id` empty for the previous release, an id for a specific one, or `list` (with any confirm) to print releases only. CLI: `gh workflow run rollback-production.yml --ref main -f confirm=ROLLBACK [-f release_id=<id>]`.
- **Manual (SSH, if Actions is down):** from a checkout, with an ssh alias `gl-prod` set up like `ssh-setup.sh` does: `GL_TARGET=gl-prod GL_DOCROOT=<doc root> bash scripts/deploy/deploy.sh list` then `... rollback [<id>]`.
- **Back to the pre-CI site:** roll back to `v1-<ts>`.
- **Redeploy a previous release:** same as rollback with its id. Re-running an old workflow run is refused on purpose.
- Verified locally (selftest.sh): previous, by id, to v1, missing id refused, path-like id refused, `.well-known` kept.

## 11. GitHub Pages preview isolation

- Remote `main` (8925b85) still has the old `deploy.yml` that publishes to Pages on every push. `main` is an ancestor of `v2`, so merging `v2` into `main` fast-forwards and replaces it with the manual-only wrapper. Until then: never push `main`.
- **Do not revert the two preview commits** (`docs/v2/PREVIEW.md` and `LAUNCH_READINESS.md` used to say so). Reverting them would restore the 5fbd96c `deploy.yml`, a dispatchable job that publishes an indexable production build to Pages, and would conflict with later code. To retire the preview: unpublish Pages and remove the `v2` rule from the `github-pages` environment (PREVIEW.md "Remove it"), then delete `deploy.yml` and `preview-pages.yml` in a normal PR.
- Enforced by `check-workflows.mjs` in every CI and deploy run: only `deploy-production.yml` may run on push and only for `main` with the kill switch; Pages workflows must be dispatch/call only, use no Hostinger secrets and publish only the `NEXT_PUBLIC_SITE_ENV: preview` build (preview-pages.yml also refuses an export without `noindex`); Hostinger secrets only in the two production workflows and only in the `production` environment; every action SHA-pinned. Its self-test proves the old `deploy.yml`, a removed kill switch, a `v2` trigger, an unpinned action, `cancel-in-progress: true` and a production build to Pages are all caught.

## 12. Rerun, troubleshooting

- **Rerun:** "Re-run failed jobs" on the latest `main` run. A rerun of an older run is refused if `main` moved on.
- `REMOTE FAIL: unexpected entries in the doc root` → someone added files by hand. Inspect; remove them or add their names to `HOSTINGER_PRESERVE`.
- `locked: .../lock exists` → a deploy crashed mid-switch. Check `deploy.sh list`, then `rmdir <parent>/.growlatics-deploy/lock`.
- `different filesystems` → the doc root is a mount; swap/symlink cannot be atomic there. Stop and ask.
- `HOSTINGER_SSH_KNOWN_HOSTS has no key for [host]:port` → the known_hosts line must use `[host]:port` when the port is not 22.
- Smoke: marker mismatch while everything else passes → CDN serving the old release; purge Hostinger CDN cache (hPanel › Performance › CDN) and re-run.
- Build: `next/font` failing to fetch Google Fonts is transient network; re-run.
- Local proof: `npm run build && bash scripts/deploy/selftest.sh` (35 checks; macOS and Linux).

## 13. SSH key rotation and fallbacks

Rotation: generate a new key pair (OWNER_SETUP.md §2), add the new public key in hPanel, replace `HOSTINGER_SSH_PRIVATE_KEY`, run the rollback workflow with `release_id=list` to prove the connection, then delete the old public key in hPanel. If the host key changes, re-read the fingerprint in hPanel/support before updating `HOSTINGER_SSH_KNOWN_HOSTS`; never accept it blindly.

No rsync on the host or no SSH on the plan: the pipeline stops at `ssh-setup.sh` or the first upload and nothing changes on the host. The fallback would be SFTP (`lftp mirror` over SFTP into a staging dir, then renames via SFTP `rename`), without checksum verification on the host. Not implemented; decide after discovery.
