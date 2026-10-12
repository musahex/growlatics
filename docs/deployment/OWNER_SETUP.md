# Owner setup checklist: Hostinger auto-deploy

Do these in order. Nothing deploys until step 5. Details: [CI_CD.md](CI_CD.md). Never paste a private key into chat, an issue or a commit.

## 1. Read from hPanel (discovery)
- [ ] Plan name; hPanel › Advanced › **SSH Access** is available and enabled.
- [ ] SSH **host/IP**, **port** (use hPanel's value; often 65002) and **username**.
- [ ] The exact **document root** of growlatics.us (hPanel › Websites › growlatics.us › File Manager; often `/home/<user>/domains/growlatics.us/public_html`, but confirm it).
- [ ] Log in once over SSH from your own computer and run, then keep the output:
  ```sh
  cd <document root> && pwd && ls -la && du -sh . && df -h . && command -v rsync bash sha256sum
  ```
  Note any entry that is not part of the website (another site's folder, `.well-known`, `.user.ini`, `cgi-bin`). Those you want kept go into `HOSTINGER_PRESERVE`.
- [ ] The server **host key fingerprint** from a trusted source (hPanel SSH page or Hostinger support), not from the first connection prompt alone.

## 2. Deploy key (on your computer)
```sh
ssh-keygen -t ed25519 -N "" -C "github-actions-growlatics" -f ~/.ssh/growlatics_deploy
cat ~/.ssh/growlatics_deploy.pub      # paste into hPanel › SSH Access › SSH keys
ssh -i ~/.ssh/growlatics_deploy -p <port> <user>@<host> true   # compare the fingerprint shown with step 1
grep -F "[<host>]:<port>" ~/.ssh/known_hosts   # this line (or lines) is HOSTINGER_SSH_KNOWN_HOSTS; port 22 → just <host>
```
- [ ] Public key added in hPanel. Only the `.pub` goes to Hostinger.

## 3. GitHub (Settings of musahex/growlatics)
- [ ] Environments › New `production` › Deployment branches: **Selected branches → `main`**. Optional for the first run: Required reviewers = you.
- [ ] `production` environment secrets: `HOSTINGER_SSH_PRIVATE_KEY` (contents of `~/.ssh/growlatics_deploy`), `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_USER`, `HOSTINGER_SSH_PORT`, `HOSTINGER_SSH_KNOWN_HOSTS`.
- [ ] Repository variables (Secrets and variables › Actions › Variables): `HOSTINGER_DEPLOY_PATH` = the document root, `PRODUCTION_URL` = `https://growlatics.us`. Leave `PRODUCTION_DEPLOY_ENABLED` **unset**.
- [ ] Optional variables: `HOSTINGER_PRESERVE` (default `.well-known`), `HOSTINGER_KEEP_RELEASES` (default 5), `NEXT_PUBLIC_LEGAL_APPROVED=1` only after legal approval, lead/booking settings.
- [ ] Branch protection on `main`: require a PR and the "CI / Build and validate" check; block force-push and deletion; allow yourself to bypass for emergency hotfixes.
- [ ] Delete the local key file once it is stored in GitHub (or keep it in a password manager).

## 4. First activation (Phase B, only after launch approval: claims, legal, device QA, deploy go-ahead)
- [ ] hPanel › Files › Backups: take a files backup of the current site (the pipeline also tars it, this is the second copy).
- [ ] Merge `v2` into `main` (fast-forward; replaces the old Pages `deploy.yml`). With the switch unset, this push only builds and validates; check the run is green and shows "Deploy disabled".
- [ ] Set `HOSTINGER_V1_REVIEWED=true` (you reviewed the `ls -la` from step 1) and `PRODUCTION_DEPLOY_ENABLED=true`.
- [ ] Trigger the first deploy by pushing a commit to `main` (e.g. a docs change) with someone watching. If you set required reviewers, approve it in the run.
- [ ] Run summary: release id, upload/switch success, smoke **PASS**.
- [ ] Browser pass (not automated): the 9 pages, mobile menu, 3D on desktop home, theme toggle, 404 page, contact flow. Inbox delivery: send one real enquiry and confirm it arrives.
- [ ] If anything is wrong: Actions › "Roll back production (Hostinger)" with `confirm=ROLLBACK` (empty id = previous; the first deploy's previous is the old site `v1-…`).
- [ ] Optional after a good deploy: remove `HOSTINGER_V1_REVIEWED` (only needed once), remove required reviewers for unattended deploys (Phase C).

## 5. Emergency disable
Delete the repository variable `PRODUCTION_DEPLOY_ENABLED`. Pushes keep building; nothing reaches Hostinger until it is `true` again. Roll back with the rollback workflow, which works while deploys are disabled.
