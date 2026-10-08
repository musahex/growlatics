# Technical SEO, security headers and preview separation — audit (gl-audit-tech, 2026-10-09)

Branch `v2-audit-tech` (worktree branch `agent/worker-gl-audit-tech`), base `v2` 51da8b9. Brief §4, 5, 6 (assets touched only where SEO-relevant), 9.4, 9.6, 9.7, 10, 16.
Evidence labels: **SRC** source inspection · **LOCAL** local export (`out/`, served by Apache 2.4.62 with `public/.htaccess` and by Chromium via playwright-core, channel `chrome`) · **PREVIEW** public preview https://musahex.github.io/growlatics/ (still the pre-fix build) · **PROD** production-only (https://growlatics.us currently serves the OLD site).
WebKit and Firefox: **NOT RUN** (only Chromium builds are installed in `~/Library/Caches/ms-playwright`).

## 1. What changed on this branch

| File | Change |
|---|---|
| `scripts/postbuild.mjs` (new, replaces `scripts/preview-postbuild.mjs` and the inline `node -e` in `package.json`) | Removes `out/lab`; removes `out/privacy`, `out/terms` and their chunks unless `NEXT_PUBLIC_LEGAL_APPROVED=1`; preview builds now write `robots.txt` = `Allow: /` (was `Disallow: /`). |
| `public/.htaccess` | www → apex 301, five security headers (below). `ErrorDocument 404` kept. |
| `lib/seo.ts` | `pageJsonLd()` = WebPage + BreadcrumbList graph (replaces `breadcrumbJsonLd`); Home graph gains WebPage; WebSite gets `inLanguage`; Service gets `mainEntityOfPage`; `areaServed` is now `Country` objects instead of bare codes. |
| `app/**/page.tsx` (6 files) | Call `pageJsonLd(route, seo)` / `homeJsonLd(seo)`. Metadata exports unchanged. |
| `scripts/seo-crawl.mjs` | New checks: unique title/description, `lang="en"`, production page not noindex, preview page must be noindex, preview links carry basePath, no `/growlatics/` paths in production HTML, `#fragment` targets exist, JSON-LD `@id` references resolve, legal drafts absent from `out/` without the flag, sitemap shape, robots.txt has no `Disallow: /`. |

Validation (LOCAL, final production build): `npm run build` OK · `npx tsc --noEmit` OK · `npm run lint` 0 warnings · `node scripts/seo-crawl.mjs` 0 problems · preview build + `NEXT_PUBLIC_SITE_ENV=preview node scripts/seo-crawl.mjs` 0 problems · `xmllint --noout out/sitemap.xml` OK. Negative test: an `out/privacy` dir makes the crawl fail (`legal draft out/privacy exported…`). First Load JS unchanged: `/` 165 kB, `/services` 160, `/services/[slug]` 161, `/contact` 152.

## 2. Route inventory (production export, LOCAL)

| Route | In `out/` | Index | Canonical (self) | Title (chars) | Desc chars | JSON-LD | In sitemap |
|---|---|---|---|---|---|---|---|
| `/` | yes | index | https://growlatics.us/ | 58 | 149 | Organization, WebSite, WebPage | yes |
| `/services/` | yes | index | self | 52 | 147 | WebPage, BreadcrumbList | yes |
| `/services/sales-bpo/` | yes | index | self | 67 | 156 | Service, WebPage, BreadcrumbList | yes |
| `/services/performance-marketing/` | yes | index | self | 65 | 142 | Service, WebPage, BreadcrumbList | yes |
| `/services/customer-operations/` | yes | index | self | 55 | 129 | Service, WebPage, BreadcrumbList | yes |
| `/services/technology/` | yes | index | self | 68 | 127 | Service, WebPage, BreadcrumbList | yes |
| `/about/` | yes | index | self | 18 | 154 | WebPage, BreadcrumbList | yes |
| `/work/` | yes | index | self | 32 | 139 | WebPage, BreadcrumbList | yes |
| `/contact/` | yes | index | self | 31 | 134 | WebPage, BreadcrumbList | yes |
| `/404.html`, `/404/` | yes | noindex, follow | none | 27 | 118 | none | no |
| `/privacy/`, `/terms/` | **no** (was yes) | noindex, nofollow | — | — | — | — | no |
| `/lab/system` | no (postbuild) | — | — | — | — | — | no |

Also in `out/`: `robots.txt`, `sitemap.xml`, `site.webmanifest`, `.htaccess`, icons, `og-image.png` (1200×630), `logo.png` (512×512), `*.txt` RSC payloads. Click depth from `/`: every route = 1.

## 3. Technical checks

| # | Check | Label | Status | Evidence |
|---|---|---|---|---|
| 1 | HTTPS + http→https | PROD | PASS | `curl -I http://growlatics.us/` → 301 `https://growlatics.us/` (Hostinger hcdn, also sends `content-security-policy: upgrade-insecure-requests`) |
| 2 | One host (www vs apex) | PROD | FAIL → fixed in `.htaccess`, PENDING VERIFICATION | `https://www.growlatics.us/` returns 200 with byte-identical HTML (md5 1c0dd591…). New rule tested on Apache: `Host: www.growlatics.us` `/services/?a=1` → 301 `https://growlatics.us/services/?a=1` |
| 3 | Mixed content | LOCAL | PASS | No `http://` `src`/`href` in exported HTML; only external `href`s are LinkedIn, Facebook, Instagram, `mailto:`, `tel:` |
| 4 | Self-referencing canonical, og:url, OG image, Twitter card | LOCAL | PASS | crawl: all 9 indexable routes canonical = `https://growlatics.us{route}`; confirmed in rendered DOM (Chromium, 1440 and 390) |
| 5 | Unique titles / descriptions | LOCAL | PASS | crawl uniqueness check, 0 duplicates |
| 6 | `lang` | LOCAL | PASS | `<html lang="en">` on every page |
| 7 | No production noindex | LOCAL | PASS | only `/404` noindex; crawl now fails the build check on any other |
| 8 | robots.txt (production) | LOCAL | PASS | `User-Agent: * / Allow: / / Sitemap: https://growlatics.us/sitemap.xml` |
| 9 | Sitemap | LOCAL | PASS | `xmllint` valid; 9 `<loc>` all `https://growlatics.us/…/`, all indexable, all exist; no `lastmod` (no reliable source: correct to omit); `priority` is ignored by Google but harmless |
| 10 | Sitemap submission (Search Console, Bing WMT) | PROD | PENDING VERIFICATION | needs owner accounts; steps in §6 |
| 11 | 404 handling | LOCAL | PASS | Apache: `/nope/` → 404 with branded `404.html` (`<title>Page not found…`), noindex |
| 12 | Trailing slash | LOCAL / PROD | PASS local, PENDING prod | `trailingSlash: true`; Apache `mod_dir` 301s `/about` → `/about/`. Locally the Location is `http://…`; on Hostinger that may add a second hop through the CDN's https redirect — check once deployed |
| 13 | Static HTML holds the text | LOCAL | PASS | 0 `<canvas>` in static HTML; home 1,555 words, all 4 system summaries, markets and every H2 in the HTML; canvas is client-added and decorative |
| 14 | Headings | LOCAL | PASS | one H1 per route, no level skips (crawl) |
| 15 | Internal links, anchors, footer, breadcrumbs | LOCAL | PASS | crawl: 0 dead, 0 `#`, 0 missing `#fragment` targets (e.g. `/contact/#book`), 0 links to legal drafts |
| 16 | External links | PROD (live fetch) | PASS with note | LinkedIn 200, Instagram 200, Facebook `share/1bFSXzTp4i/` → 302 `profile.php?id=61581775025692` (see TECH-06) |
| 17 | Console errors, failed requests, WebGL, fonts with the new headers | LOCAL (Apache + Chromium) | PASS | 9 routes × {1440, 390}: 0 console errors, 0 failed requests, canvas created where expected (home/services/service pages desktop, home mobile), `document.fonts.status` = loaded. `/nope/` logs the expected 404 for itself only |
| 18 | Preview: crawlable but noindex | LOCAL preview build | FAIL → fixed (TECH-01) | see TECH-01 |
| 19 | Preview: canonical/OG/JSON-LD/sitemap on growlatics.us | LOCAL preview build | PASS | crawl in preview mode, 0 problems; links all carry `/growlatics` basePath |
| 20 | Preview: X-Robots-Tag | PREVIEW | NOT APPLICABLE | GitHub Pages cannot set response headers; meta robots is the only control |
| 21 | Legal drafts out of export | LOCAL | FAIL → fixed (TECH-02) | |
| 22 | Security headers | LOCAL (Apache) | MISSING → fixed (TECH-03), PENDING VERIFICATION on Hostinger | |
| 23 | HSTS | PROD | PENDING VERIFICATION (owner step) | TECH-04 |
| 24 | Secrets / public env vars | SRC + LOCAL | PASS | only `NEXT_PUBLIC_SITE_ENV`, `_BASE_PATH`, `_LEGAL_APPROVED`, `_LEAD_PROVIDER`, `_LEAD_WEBHOOK_URL`, `_BOOKING_URL` (all unset in prod; all non-secret by design); no key patterns in `out/` |
| 25 | `rel` on external links | LOCAL | PASS | all `target="_blank"` links have `rel="noopener noreferrer"` |
| 26 | npm audit | SRC | FAIL, low runtime exposure | TECH-05 |
| 27 | hreflang | SRC | NOT APPLICABLE | one English site, no alternates (brief §10) |
| 28 | Duplicate URL patterns | LOCAL | PASS with note | `/404.html` and `/404/` both exported by Next; both noindex and unlinked |
| 29 | Search Console / Bing ownership, field CWV | PROD | PENDING VERIFICATION | needs owner accounts and real traffic |

## 4. Issues

| ID | Pri | Route / file | Issue + evidence | Fix | Auto-fixable | Fixed | Re-test |
|---|---|---|---|---|---|---|---|
| TECH-01 | P1 | preview, `scripts/postbuild.mjs` | Preview `robots.txt` was `Disallow: /`: a crawler that may not fetch a URL never reads its `noindex`, so known preview URLs can be indexed URL-only. GitHub Pages also honours robots only at host root, and `https://musahex.github.io/robots.txt` is 404, so the file had no effect anyway. Live preview still serves the old file (`curl …/growlatics/robots.txt` → `Disallow: /`) | Preview robots is now `Allow: /`; every page keeps `<meta name="robots" content="noindex, nofollow">`; canonicals stay on growlatics.us. Takes effect on the next preview dispatch | yes | yes | preview crawl 0 problems; crawl now fails on any `Disallow: /` |
| TECH-02 | P0 | `/privacy/`, `/terms/` | Unapproved legal drafts were in the production AND preview export (`out/privacy/index.html`, `out/terms/index.html`; reachable by URL though unlinked and noindex) | `postbuild` deletes both pages and their chunks unless `NEXT_PUBLIC_LEGAL_APPROVED=1` | yes | yes | `ls out` has no privacy/terms; no `"/privacy/"` or `"/terms/"` in `out/`; flag build ships them (verified) |
| TECH-03 | P1 | `public/.htaccess` | No security headers on production (PROD curl: only `content-security-policy: upgrade-insecure-requests` from the CDN) | Added `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Content-Security-Policy: frame-ancestors 'self'; upgrade-insecure-requests`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()` | yes | yes (local) | Apache 2.4 `-t` Syntax OK, headers present on 200/301/404; Chromium shows WebGL + fonts intact. Hostinger: PENDING (curl -I after upload) |
| TECH-04 | P2 | Hostinger | No HSTS | Owner step after deploy, once https works on apex and www: add `Header always set Strict-Transport-Security "max-age=31536000"` to `.htaccess` (no `includeSubDomains`/`preload` until every subdomain is on https). Not added now: a cert problem would lock visitors out for a year | no | no | — |
| TECH-05 | P2 | `package.json` (`next 14.2.5`) | `npm audit --omit=dev`: 4 vulns (1 critical, 3 high) in next, its postcss, nanoid. The Next advisories target the Next server (middleware, image optimiser, server actions, RSC cache); a static export on Hostinger runs none of them, so runtime exposure is low | Upgrade to latest `next@14.2.x` after launch with a full re-test; not done here (dependency change outside a no-redesign audit) | partly | no | — |
| TECH-06 | P3 | `content/site.ts:21` | Facebook `sameAs`/footer link is a share short-link that 302s to `https://www.facebook.com/profile.php?id=61581775025692` | gl-audit-content / owner: replace with the profile URL (or the vanity URL if the page has one) | yes (content) | no | — |
| TECH-07 | P3 | `content/site.ts:18,29` | Public email is on `growlatics.com` while the site is `growlatics.us`. MX for growlatics.com exists (`mx1/mx2.privateemail.com`), so mail works; entity signals are just split across two domains | Owner decision; no change needed for launch | no | no | — |
| TECH-08 | P2 | www host | www served a duplicate copy of the site (PROD) | `.htaccess` 301 www → apex (TECH-03 file). Rollback: delete the `mod_rewrite` block | yes | yes (local) | PENDING on Hostinger: `curl -I https://www.growlatics.us/about/` → 301 `https://growlatics.us/about/` |
| TECH-09 | P3 | `docs/v2/PREVIEW.md:9`, `.github/workflows/preview-pages.yml:36`, `docs/v2/LAUNCH.md:14` | Text still says postbuild writes `Disallow` / `scripts/preview-postbuild.mjs` / drafts at `localhost:4173/privacy/` | Doc owner: point to `scripts/postbuild.mjs`, `Allow: /`, and "legal drafts only with `NEXT_PUBLIC_LEGAL_APPROVED=1`" | yes | no (not my files) | — |
| TECH-10 | P3 | `/about/` metadata (`content/pages.ts`) | Title "About \| Growlatics" (18 chars) carries no topic | gl-audit-content wording: `About Growlatics: growth operations for US, UK and Pakistan` | yes (content) | no | — |
| TECH-11 | P3 | `/services/sales-bpo/` (67), `/services/technology/` (68) titles | Likely truncated in results (~60 chars) | gl-audit-content wording: `Sales & BPO: outbound, inbound, appointment setting \| Growlatics` (64); `Web, Ecommerce & Automation Development \| Growlatics` (52) | yes (content) | no | — |
| TECH-12 | P2 | `out/index.html` 364 KB | Home HTML is large (inline RSC payload + SVG). Perf stream to judge against LCP | Refer to perf/QA stream | — | no | — |

No P0 remains on this stream.

## 5. AI crawler policy (recommendation only; robots.txt unchanged = everything allowed)

Current production `robots.txt` allows all agents, which includes training crawlers. That is a data-use decision for the owner, so it was not changed.

| Purpose | User-agents | Recommendation |
|---|---|---|
| Search indexing | `Googlebot`, `Bingbot` | Allow (required) |
| AI search / answer retrieval (cites and links pages) | `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User` | Allow: this is how the site can be cited in AI answers |
| Model training | `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent`, `Bytespider` | **Owner decision.** Allowing has no proven citation benefit; blocking keeps marketing copy out of training sets. If the owner opts out, add one rule per agent in `app/robots.ts` (`{ userAgent: [...], disallow: '/' }`) |

`llms.txt`: not added. It is experimental, no major search or AI engine documents using it, and a hand-written copy of business facts would drift from `content/`. Revisit if a platform the owner cares about adopts it.

## 6. Owner steps (production-only, after an approved Hostinger upload)

1. Upload `out/` including the dotfile `.htaccess`. Then: `curl -sI https://growlatics.us/ | grep -iE 'x-content|referrer|x-frame|permissions|content-security'` shows the five headers; `curl -sI https://www.growlatics.us/` → 301 to the apex; `curl -sI https://growlatics.us/nope/` → 404.
2. Load home on a phone and a desktop: 3D and fonts must still render (they do locally under the same headers). If anything breaks, remove the `mod_headers` block and re-upload `.htaccess` only.
3. HSTS (TECH-04) once step 1 is clean for a week.
4. Search Console: add a Domain property for `growlatics.us` (DNS TXT), submit `https://growlatics.us/sitemap.xml`; Bing Webmaster Tools: import from Search Console. Both stay PENDING until done.
5. Legal: when text is approved, build with `NEXT_PUBLIC_LEGAL_APPROVED=1`, finalise `content/legal.ts`, drop the draft notice and `noindex` from `app/privacy|terms/page.tsx`, add them to `nav.legal` and `sitemapRoutes`.
6. CSP: if wanted later, run `Content-Security-Policy-Report-Only` first. The export needs `script-src 'self' 'unsafe-inline'` (theme script, JSON-LD and Next's inline RSC payload), `style-src 'self' 'unsafe-inline'`, `img-src 'self' data:`, `font-src 'self'`, `connect-src 'self'` plus any future lead webhook / analytics host. Without a report endpoint violations only appear in the browser console.

Rollback for this branch's `.htaccess`: re-upload the previous one (`ErrorDocument 404 /404.html` only).
