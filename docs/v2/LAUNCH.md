# Growlatics v2 — Launch runbook (owner steps)

Production is **Hostinger, https://growlatics.us** (static export in `out/`). No Vercel, no DNS change. Nothing here is done by the agents: deploy only after owner review. Open owner items: `docs/v2/OWNER_VERIFY.md`.

## 1. Preview locally

From the repo root (`/Users/moses/Growlatics`), on the branch to review:

| What | Command | URL |
|---|---|---|
| Dev server (hot reload, not the shipped files) | `npm run dev` | http://localhost:3000/ |
| The exact static export that ships | `npm run build && python3 -m http.server 4173 --directory out` | http://localhost:4173/ |

Always build with `npm run build`, never `npx next build`: the `postbuild` step (`scripts/postbuild.mjs`) removes `out/lab/` and the unapproved legal drafts (`out/privacy/`, `out/terms/`). To review the drafts locally, build with `NEXT_PUBLIC_LEGAL_APPROVED=1 npm run build` (never upload that build until the text is approved), then open http://localhost:4173/privacy/ and /terms/. The Python preview has no `.htaccess`, so a bad URL shows Python's plain 404, not the branded one; check the branded 404 at http://localhost:4173/404.html.

## 2. Turn off the old GitHub Pages copy (musahex.github.io/growlatics)

It is a stale second live site. The workflow `.github/workflows/deploy.yml` is already **manual-only** (`on: workflow_dispatch`, on `main` and `v2`), so pushes no longer redeploy it, but the last deployment stays online until Pages is switched off.

1. Open https://github.com/musahex/growlatics → **Settings** → **Pages** (left sidebar, under "Code and automation"). Needs repo admin.
2. Under **Build and deployment → Source**:
   - If it says **GitHub Actions**: click **Unpublish site** in the "Your site is live at…" box at the top (⋯ menu or button), and confirm.
   - If it says **Deploy from a branch** (e.g. `gh-pages`): set the branch to **None** and **Save**. That unpublishes the site.
3. Wait 1–10 minutes, then open https://musahex.github.io/growlatics/ in a private window: it must return GitHub's 404.
4. Optional cleanup: **Settings → Environments → github-pages** → delete the environment; delete a `gh-pages` branch if one exists. Leave `deploy.yml` as is (manual-only) or delete it in a later commit; never re-add `push:` to it.

## 3. Hostinger upload checklist (in order)

1. Owner signs off `docs/v2/OWNER_VERIFY.md` (claims, legal placeholder) and the visual review.
2. god merges the release into `v2` → `main`. Push only after step 2 above is done.
3. On the merged commit: `npm ci && npm run build`. Set any `NEXT_PUBLIC_*` lead variables (§4) in the same shell **before** building; they are baked in at build time.
4. Check the output: `ls -a out/` shows `.htaccess`, `404.html`, `index.html`, `_next/`; `out/lab` does **not** exist. About 80 files, ~4 MB (list: `docs/v2/FINAL_QA.md` §4).
5. **Back up first.** Hostinger hPanel → **Files → File Manager** → `public_html/` → select all → **Compress** → download the zip (that is the live v1 site). Or hPanel → **Backups** → generate/download a files backup. Keep it until v2 has run cleanly for a week.
6. Empty `public_html/` (so old `_next/` chunks do not linger). Do not touch anything outside `public_html/`.
7. Upload the **contents** of `out/` (not the folder itself) into `public_html/`. Easiest: zip the contents of `out/` locally, upload the zip, **Extract** in File Manager, delete the zip.
8. **Confirm `.htaccess` arrived**: it is a dotfile and many tools skip it. In File Manager enable "Show hidden files"; `public_html/.htaccess` must contain `ErrorDocument 404 /404.html`, the www → apex redirect, the security headers and the cache/compression blocks (see `docs/v2/LAUNCH_READINESS.md` for the curl checks).
9. HTTPS: hPanel → **Security → SSL** shows active for growlatics.us; force HTTPS on. Do not change DNS.
10. Smoke test live (private window, desktop and phone): the 9 routes (`/`, `/services/`, the 4 service pages, `/work/`, `/about/`, `/contact/`); a bad URL (e.g. `/nope/`) shows the branded 404; light/dark toggle; `/robots.txt`; `/sitemap.xml`; OG preview (paste the URL into a link-preview checker).
11. Contact flow: send one real request end to end; confirm it lands in ahsan@growlatics.com (or the configured provider).
12. Search Console: add/verify the `growlatics.us` property and submit `https://growlatics.us/sitemap.xml`.
13. Rollback if needed: empty `public_html/` and extract the step-5 backup.

## 4. Leads and booking (lib/leads)

Default, no config: **prefilled email to ahsan@growlatics.com** (the visitor's mail app opens with their answers; they press send). Change the destination with build-time variables:

| Goal | Set before `npm run build` |
|---|---|
| Email (default) | nothing, or `NEXT_PUBLIC_LEAD_PROVIDER=mailto` |
| CRM form endpoint, Zapier / Make / n8n, any webhook | `NEXT_PUBLIC_LEAD_PROVIDER=webhook` and `NEXT_PUBLIC_LEAD_WEBHOOK_URL=https://…` (receives a JSON POST of the answers plus `submittedAt`, `source`; must allow CORS from https://growlatics.us). On failure the visitor is offered the email fallback. |
| Calendly or Cal.com booking after a request | `NEXT_PUBLIC_BOOKING_URL=https://calendly.com/…` or `https://cal.com/…` (shown after a successful webhook send, with `name` and `email` prefilled as query params) |
| HubSpot (no Zapier) | add a `hubspot` entry to `providers` in `lib/leads/index.ts` that POSTs `{ fields: [{ name, value }…] }` to `https://api.hsforms.com/submissions/v3/integration/submit/<portalId>/<formGuid>`, then set `NEXT_PUBLIC_LEAD_PROVIDER=hubspot`. ~10 lines; no SDK. |

Any new provider is one function `(lead) => Promise<LeadResult>` added to `providers`; the form UI does not change. After changing a provider, update the Privacy draft section "How your request reaches us" to name it. Check: `node -e "require('jiti')(process.cwd()+'/', {alias:{'@':process.cwd()}})('./lib/leads/selfcheck.ts')"`.

## 5. Real-device QA checklist (before and after go-live)

Devices: a 2020-era MacBook Air (Safari + Chrome), an iPad in portrait (Safari), an iPhone (Safari), a mid-range Android (Chrome). On each:

- [ ] Home scrolls smoothly through all nine acts; no stutter when the 3D network is on screen; the header glass stays readable over it.
- [ ] Frame rate feels steady (Chrome: DevTools → Rendering → Frame rendering stats on the MacBook; elsewhere by eye). Note any act that drops.
- [ ] Device stays cool and the page stays responsive after 2 minutes on Home.
- [ ] Header: floating, not touching edges; mobile menu opens and closes; every link reachable by touch; CTA visible.
- [ ] iPad portrait: the fixed stage and text do not overlap; nothing is cut off at the sides.
- [ ] iPhone: safe areas respected (notch, home bar); no horizontal scroll on any page.
- [ ] Reduced motion (iOS: Settings → Accessibility → Motion → Reduce Motion; macOS: System Settings → Accessibility → Display): no scroll-driven animation, content fully readable.
- [ ] Light and dark theme on each page; the choice persists after reload.
- [ ] Contact: complete the flow; the email app opens with the answers filled in (phones: default mail app); "Copy my answers" works.
- [ ] Phone link (`+1 (470) 755-6472`) opens the dialler; email links open mail.
- [ ] Branded 404 on a bad URL (live site only).
- [ ] Rotate phone and tablet mid-page: layout recovers without reload.
- [ ] Slow network (Chrome DevTools → Network → Slow 4G): text appears first, the page works before the 3D loads.
