# Growlatics v2: launch readiness (Hostinger, https://growlatics.us)

2026-10-09, final audit pass (gl-audit-final), branch `v2-audit-final`. Evidence: `PRELAUNCH_SEO_AEO_AUDIT.md`. Nothing here has been deployed, pushed or merged to `main`.

## 1. Three separate gates

| Gate | State | What it rests on |
|---|---|---|
| **Technical readiness** | **READY** | Production build, tsc, lint, crawl (0 problems), sitemap, JSON-LD, axe (40 runs, 0 violations), Lighthouse (desktop 100; mobile lab 94–97), WebKit/Firefox/Chromium smoke, `.htaccess` on Apache: all PASS. No open P0. Production-only checks (§5 step 9) still to run after upload. |
| **Business / legal approval** | **NOT GIVEN** | `OWNER_VERIFY.md` 1, 2, 3, 5 open (claims shown on live pages). Privacy/Terms unapproved (excluded from the build, so not published). Visual sign-off of v2. |
| **Deploy permission** | **NOT GIVEN** | No owner instruction to upload to Hostinger or merge to `main`. |

## 2. Owner decisions still open

| # | Decision | Default if no answer | Where |
|---|---|---|---|
| 1 | BPO task scope ("order processing" etc.) | must be answered: copy is live | `OWNER_VERIFY.md` 1 |
| 2 | Engagement models (Dedicated team / Campaign / Overflow; "named people") | must be answered | `OWNER_VERIFY.md` 2 |
| 3 | "Who owns the leads and data? You do." | must be answered | `OWNER_VERIFY.md` 3 |
| 4 | Legal entity name, governing law, retention, effective date; approve Privacy + Terms (incl. the marked UTM/sessionStorage sentence) | pages stay out of the export | `OWNER_VERIFY.md` 4, `content/legal.ts` |
| 5 | Say where delivery teams work, or keep "Distributed execution" | keep vague | `OWNER_VERIFY.md` 5 |
| 6 | Launch without a published privacy notice, or wait for #4 (take legal advice: the site invites personal data by email) | — | owner + counsel |
| 7 | HSTS after a clean week on https | not set | `audit/tech-seo.md` TECH-04 |
| 8 | AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot…): allow or block. Search/answer crawlers stay allowed | all allowed | `audit/tech-seo.md` §5 |
| 9 | Analytics: GTM + GA4 IDs, consent platform (UK opt-in, US opt-out) | no tags, no banner | `CONVERSION_TRACKING_PLAN.md` O-2, O-3 |
| 10 | Lead delivery: keep mailto or set a webhook/CRM; booking URL (Calendly/Cal.com) | mailto to ahsan@growlatics.com, no scheduler | `CONVERSION_TRACKING_PLAN.md` O-1, O-5; `LAUNCH.md` §4 |
| 11 | Real Facebook page URL (the share short-link was removed; nothing invented) | no Facebook link | `content/site.ts` `social` |
| 12 | Search Console + Bing Webmaster Tools access | not submitted | §5 step 10 |
| 13 | Real-device QA: Safari macOS, iPhone, iPad portrait, mid-range Android | not done | `LAUNCH.md` §5 |

## 3. Before uploading

1. Owner answers §2 items 1–3, 5, 6 and 13 (and any others they want at launch).
2. god merges `v2-audit-final` → `v2`. Before `v2` goes to `main`: revert the two preview commits ("Add manual GitHub Pages preview deployment", "Run the Pages preview through deploy.yml"), see `PREVIEW.md` "Remove it". Never push `main` while remote `main` is `8925b85`.
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
3. On `v2`, revert the two preview commits before merging into `main` (§3 step 2).
Until then the live preview still serves the pre-audit build (old `Disallow` robots, legal drafts present); a redeploy needs owner approval.

## 8. Blockers

Technical: none. Business/legal: `OWNER_VERIFY` 1, 2, 3, 5 unanswered; no decision on launching without an approved privacy notice (§2 item 6); real-device QA on Safari macOS/iOS and Android not done (§2 item 13). Deploy: no owner permission to upload to Hostinger or merge to `main`.

LAUNCH_READY = NO (blockers: OWNER_VERIFY 1, 2, 3, 5 unanswered; owner/legal decision on launching without an approved privacy notice; real-device QA on Safari macOS/iOS and Android not done; no Hostinger deploy permission)
