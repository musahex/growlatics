# Growlatics v2: launch readiness (Hostinger, https://growlatics.us)

2026-10-09, final audit pass (gl-audit-final), branch `v2-audit-final`. Evidence: `PRELAUNCH_SEO_AEO_AUDIT.md`. Nothing here has been deployed, pushed or merged to `main`.

## 1. Three separate gates

| Gate | State | What it rests on |
|---|---|---|
| **Technical readiness** | **READY** | Production build, tsc, lint, crawl (0 problems), sitemap, JSON-LD, axe (40 runs, 0 violations), Lighthouse (desktop 100; mobile lab 94–97), WebKit/Firefox/Chromium smoke, `.htaccess` on Apache: all PASS. No open P0. Production-only checks (§5 step 9) still to run after upload. |
| **Business / legal approval** | **NOT GIVEN** | `OWNER_VERIFY.md` 1, 2, 3, 5 open (claims shown on live pages). Privacy/Terms unapproved (excluded from the build, so not published). Visual sign-off of v2. |
| **Deploy permission** | **NOT GIVEN** | No owner instruction to upload to Hostinger or merge to `main`. |

## 2. Owner blockers and interim decisions (2026-10-09)

**Remaining owner blockers** (HAG-21, ASK ME board):

| # | Blocker | Where |
|---|---|---|
| 1 | Business/service claims: BPO scope incl. "order processing"; engagement models (Dedicated team / Campaign / Overflow); "Who owns the leads and data? You do."; where delivery teams work | `OWNER_VERIFY.md` 1, 2, 3, 5 |
| 2 | Privacy and Terms legal approval (entity name, governing law, retention, effective date; incl. the marked UTM/sessionStorage sentence), or a decision to launch without them on legal advice | `OWNER_VERIFY.md` 4, `content/legal.ts` |
| 3 | Real-device testing and visual sign-off: Safari macOS, iPhone, iPad, mid-range Android, on the live preview | `GLASS_HANDOFF.md` §17, `LAUNCH.md` §5 |
| 4 | Final production deployment approval (Hostinger upload, merge `v2` → `main`) | §5 below |

**Interim decisions (owner, 2026-10-09)** — in force until changed:

| Topic | Decision |
|---|---|
| Delivery location | Wording stays neutral ("distributed execution") until team locations are confirmed |
| HSTS | Deferred until production HTTPS is validated (`audit/tech-seo.md` TECH-04) |
| AI crawlers | AI-search discoverability kept; AI-training crawler policy pending, robots unchanged (all allowed) |
| Analytics / ads | No GA4, GTM or advertising trackers until consent/privacy approval; vendor-free event layer only |
| Facebook | Stays removed until the correct profile URL is supplied |
| Enquiries | Email (mailto to ahsan@growlatics.com) flow stays for now; webhook/booking later |
| Deploy | No Hostinger deploy, no merge into `main` |
| GitHub Pages | Intentionally serves the audited v2 preview (noindex); keep published until the owner says otherwise |

Not blocking launch: Search Console + Bing submission (§5 step 10, after go-live).

## 3. Before uploading

1. Owner answers §2 items 1–3, 5, 6 and 13 (and any others they want at launch).
2. god merges `v2-audit-final` → `v2`. Do **not** revert the preview commits (superseded 2026-10-12; reverting restores a production-to-Pages workflow): the preview workflows are manual-only and guarded, see `docs/deployment/CI_CD.md` §11. Never push `main` while remote `main` is `8925b85` other than by merging `v2` (fast-forward, replaces the old push-to-Pages `deploy.yml`). Hostinger deploys are now GitHub Actions: `docs/deployment/OWNER_SETUP.md`.
3. On the release commit: `npm ci && npm run build` (plain build, no `NEXT_PUBLIC_SITE_ENV`; set any `NEXT_PUBLIC_LEAD_*` / `NEXT_PUBLIC_BOOKING_URL` in the same shell first; `NEXT_PUBLIC_LEGAL_APPROVED=1` only after legal approval).
4. Check `out/`: `node scripts/seo-crawl.mjs` → `0 problem(s)`; `ls -a out` shows `.htaccess`, `404.html`, `index.html`, `_next/`, `robots.txt`, `sitemap.xml`; no `lab`, `privacy`, `terms`.

## 4. Legal pages (only after approval)

Replace every `OWNER.*` placeholder in `content/legal.ts`, remove the `[DRAFT, OWNER/LEGAL TO REVIEW]` tag, drop the draft notice and `noindex` in `app/privacy|terms/page.tsx`, add both to `nav.legal` and `sitemapRoutes` (`lib/seo.ts`), then build with `NEXT_PUBLIC_LEGAL_APPROVED=1`.

## 5. Hostinger deploy steps

1. **Back up.** hPanel → Files → File Manager → `public_html/` → select all (show hidden files on) → Compress → download the zip. Or hPanel → Backups → files backup. Keep it at least a week.
2. Empty `public_html/` (old `_next/` chunks must not linger). Touch nothing outside it. No DNS change.
3. Zip the **contents** of `out/` locally, upload into `public_html/`, Extract, delete the zip.
4. File Manager → show hidden files: `public_html/.htaccess` exists and contains `ErrorDocument 404`, the www rewrite, the `mod_headers` blocks and the `mod_filter` compression block.
5. hPanel → Security → SSL: active for `growlatics.us` (and `www`), force HTTPS on.
6. Header check:
   ```sh
   curl -sI https://growlatics.us/ | grep -iE 'x-content|referrer|x-frame|permissions|content-security|cache-control|content-encoding'
   curl -sI -H 'Accept-Encoding: br,gzip' https://growlatics.us/ | grep -i content-encoding     # br or gzip
   curl -sI "https://growlatics.us/$(curl -s https://growlatics.us/ | grep -o '_next/static/[^"]*\.js' | head -1)" | grep -i cache-control   # max-age=31536000, immutable
   curl -sI https://www.growlatics.us/about/    # 301 → https://growlatics.us/about/
   curl -sI https://growlatics.us/about         # 301 → /about/ (note if it takes two hops)
   curl -sI https://growlatics.us/nope/         # 404
   ```
7. Smoke (private window, desktop and phone): the 9 routes; branded 404 on `/nope/`; header nav, Services dropdown, mobile menu; light/dark toggle persists; 3D network on desktop home; fonts load; `/robots.txt` (`Allow: /` + sitemap) and `/sitemap.xml` (9 URLs); no console errors; OG preview via a link-preview checker.
8. Contact: complete the flow, send the email, confirm it lands at ahsan@growlatics.com (or the configured provider).
9. If headers break anything (3D, fonts): remove the `mod_headers` blocks from `public_html/.htaccess` and re-upload only that file.
10. Search Console: Domain property `growlatics.us` (DNS TXT), submit `https://growlatics.us/sitemap.xml`, request indexing for `/`, `/services/` and the four service pages. Bing Webmaster Tools: import from Search Console. Then Rich Results Test on `/` and `/services/sales-bpo/`.

## 6. Rollback

1. hPanel File Manager → empty `public_html/` → upload the step-1 backup zip → Extract → delete the zip.
2. Confirm `https://growlatics.us/` serves the old site and `public_html/.htaccess` is the old one.
3. Partial rollback (headers only): restore `.htaccess` to `ErrorDocument 404 /404.html` alone.

## 7. Remove the GitHub Pages preview (after owner review of v2)

1. GitHub → Settings → Pages → **Unpublish site** (or `gh api -X DELETE repos/musahex/growlatics/pages`). Check https://musahex.github.io/growlatics/ returns 404.
2. Settings → Environments → `github-pages` → Deployment branches: delete `v2`.
3. Delete `deploy.yml` and `preview-pages.yml` in a normal PR; do not revert the preview commits (§3 step 2).
Current state: the preview was redeployed from `v2` 9f8788a (2026-10-09, run 37850920277) and serves the audited build (robots `Allow`, every page noindex, no legal drafts). Keep it published until the owner decides; these steps are for later.

## 8. Blockers

Technical: none (0 P0). Remaining owner blockers: (1) business/service claims confirmation, (2) Privacy and Terms legal approval, (3) real-device testing and visual sign-off, (4) final production deployment approval.

LAUNCH_READY = NO (blockers: 1 business/service claims confirmation; 2 Privacy and Terms legal approval; 3 real-device testing and visual sign-off; 4 final production deployment approval)
