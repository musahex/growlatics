# Owner setup checklist: Hostinger auto-deploy

Do these in order. Nothing deploys until step 5. Details: [CI_CD.md](CI_CD.md). Never paste a private key into chat, an issue or a commit.

## 0. Where things stand (2026-10-12)

Labels: **[hPanel]** confirmed by the owner in hPanel · **[SSH]** confirmed by authenticated SSH (nothing yet) · **[GitHub]** configured and verified in GitHub (god, API) · **[owner]** waiting for the owner · **[approval]** needs separate production approval.

| Item | State |
|---|---|
| SSH host `141.136.33.243`, port `65002`, user `u604656931`, server1860 UK, upload folder `public_html` | [hPanel] |
| Doc root `/home/u604656931/domains/growlatics.us/public_html` | expected, **not verified** [SSH pending] |
| SSH keys can be added in hPanel | [hPanel] |
| Deploy public key installed in hPanel | **unconfirmed** [owner] |
| Host key fingerprint | candidate ED25519 `SHA256:dvH7tK5YZQ+Fv5mVgokf4EGLSsOte3P4ilNU5vUWl7M`, **UNVERIFIED** [owner]: Hostinger AI support could not confirm; escalated to human support |
| Environment `production`, branches = `main` only | [GitHub] |
| Secrets `HOSTINGER_SSH_HOST`, `_PORT`, `_USER` | set [GitHub] |
| Secrets `HOSTINGER_SSH_PRIVATE_KEY`, `HOSTINGER_SSH_KNOWN_HOSTS` | **not set** [owner] |
| Variables `PRODUCTION_DEPLOY_ENABLED=false`, `PRODUCTION_URL` | set [GitHub] |
| Variable `HOSTINGER_DEPLOY_PATH` | unset on purpose until SSH discovery confirms the doc root |
| Reconcile the manual lovelace release into `v2` | prepared, not applied ([RECONCILE_LOVELACE.md](RECONCILE_LOVELACE.md)) [approval] |
| First production deploy | [approval] |

**Next, in this order:**
1. [owner] Install the deploy public key in hPanel › SSH Access and confirm it is listed.
2. [owner] Verify the host key by one of the methods in [CI_CD.md §5a](CI_CD.md#5a-host-key-verification): human Hostinger support first, else the hPanel Cron Jobs one-off (`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub > $HOME/hostkey.txt 2>&1`, read it in File Manager, then delete the file and the cron job), else multi-vantage scans as your recorded risk decision. Never `StrictHostKeyChecking=no`.
3. [owner] Add `HOSTINGER_SSH_PRIVATE_KEY` and `HOSTINGER_SSH_KNOWN_HOSTS` (the verified key only) to the `production` environment.
4. god runs read-only discovery (`hive/agents/god/briefs/gl-ssh-discover.sh`) to confirm the doc root, tools and contents; only then is `HOSTINGER_DEPLOY_PATH` set.
5. [approval] Reconcile the lovelace branch into `v2`, then the Phase B activation in §4.

## 1. Read from hPanel (discovery)
- [ ] Plan name; hPanel › Advanced › **SSH Access** is available and enabled.
- [ ] SSH **host/IP**, **port** (use hPanel's value; often 65002) and **username**.
- [ ] The exact **document root** of growlatics.us (hPanel › Websites › growlatics.us › File Manager; often `/home/<user>/domains/growlatics.us/public_html`, but confirm it).
- [ ] Log in once over SSH from your own computer and run, then keep the output:
  ```sh
  cd <document root> && pwd && ls -la && du -sh . && df -h . && command -v rsync bash sha256sum
  ```
  Note any entry that is not part of the website (another site's folder, `.well-known`, `.user.ini`, `cgi-bin`). Those you want kept go into `HOSTINGER_PRESERVE`.
- [ ] The server **host key fingerprint** from a trusted source ([CI_CD.md §5a](CI_CD.md#5a-host-key-verification)), not from the first connection prompt or `ssh-keyscan` alone.

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
- [ ] Repository variables (Secrets and variables › Actions › Variables): `HOSTINGER_DEPLOY_PATH` = the document root, `PRODUCTION_URL` = `https://growlatics.us`. Leave `PRODUCTION_DEPLOY_ENABLED` **unset or `false`** (currently `false`).
- [ ] Optional variables: `HOSTINGER_PRESERVE` (default `.well-known`), `HOSTINGER_KEEP_RELEASES` (default 5), `NEXT_PUBLIC_LEGAL_APPROVED=1` only after legal approval, lead/booking settings.
- [ ] Branch protection on `main`: require a PR and the "CI / Build and validate" check; block force-push and deletion; allow yourself to bypass for emergency hotfixes.
- [ ] Delete the local key file once it is stored in GitHub (or keep it in a password manager).

## 4. First activation (Phase B, only after launch approval: claims, legal, device QA, deploy go-ahead)
- [ ] hPanel › Files › Backups: take a files backup of the current site (the pipeline also tars it, this is the second copy).
- [ ] Confirm the lovelace reconciliation is in `v2` ([RECONCILE_LOVELACE.md](RECONCILE_LOVELACE.md)), otherwise the Houston address and the Voice AI Testing page disappear on the first deploy.
- [ ] Merge `v2` into `main` (fast-forward; replaces the old Pages `deploy.yml`). With the switch unset, this push only builds and validates; check the run is green and shows "Deploy disabled".
- [ ] Set `HOSTINGER_V1_REVIEWED=true` (you reviewed the `ls -la` from step 1) and `PRODUCTION_DEPLOY_ENABLED=true`.
- [ ] Trigger the first deploy by pushing a commit to `main` (e.g. a docs change) with someone watching. If you set required reviewers, approve it in the run.
- [ ] Run summary: release id, upload/switch success, smoke **PASS**.
- [ ] Browser pass (not automated): every page (10 once the lovelace merge is in, incl. `/services/voice-ai-testing/`), mobile menu, 3D on desktop home, theme toggle, 404 page, contact flow. Inbox delivery: send one real enquiry and confirm it arrives.
- [ ] If anything is wrong: Actions › "Roll back production (Hostinger)" with `confirm=ROLLBACK` (empty id = previous; the first deploy's previous is the old site `v1-…`).
- [ ] Optional after a good deploy: remove `HOSTINGER_V1_REVIEWED` (only needed once), remove required reviewers for unattended deploys (Phase C).

## 5. Emergency disable
Delete the repository variable `PRODUCTION_DEPLOY_ENABLED`. Pushes keep building; nothing reaches Hostinger until it is `true` again. Roll back with the rollback workflow, which works while deploys are disabled.
