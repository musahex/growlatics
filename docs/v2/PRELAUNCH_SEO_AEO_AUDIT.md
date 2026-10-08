# Growlatics v2: prelaunch SEO, AEO and growth-readiness audit

Final integration pass (gl-audit-final), 2026-10-09. Base `v2` fc64672 (all four audit streams merged), branch `v2-audit-final`. Owner brief: `AUDIT_BRIEF.md`. Launch decision: `LAUNCH_READINESS.md`.

Stream reports (detail and raw evidence): `audit/tech-seo.md` (technical SEO, headers, preview), `audit/aeo-content.md` (on-page, AEO, entity, IA, E-E-A-T), `audit/cro.md` (CTA and contact flow), `audit/perf-a11y-qa.md` (performance, accessibility, 3D/glass, component matrix). Plans: `KEYWORD_CONTENT_MAP.md`, `STRUCTURED_DATA_AUDIT.md`, `CONVERSION_TRACKING_PLAN.md`, `ORGANIC_GROWTH_ROADMAP.md`, `PAID_ADS_READINESS.md`.

Labels: **SRC** source inspection · **LOCAL** local export (`out/`; served by Apache 2.4.62 with the real `.htaccess`, gzip on) · **PREVIEW** public preview · **PROD** production-only. Every browser run is simulated (headless engines with viewport and touch emulation); **no real device was used**.

## 1. Executive scorecard

Counts are **open** items only (fixed items are in the register as FIXED). "Pending" = needs production, an owner account, owner approval or field data.

| Area | Result | P0 | P1 | P2 | P3 |
|---|---|---|---|---|---|
| Technical SEO | PASS (LOCAL); Search Console/Bing and production redirects pending | 0 | 0 | 1 | 2 |
| On-page | PASS | 0 | 0 | 0 | 1 |
| AEO / AI search | PASS (answer-first passages, one entity definition, valid JSON-LD) | 0 | 0 | 0 | 1 |
| Content / IA | PASS technically; owner claims and proof pending | 0 | 2 | 1 | 1 |
| International | PASS (one English site, hreflang N/A, no fake locations) | 0 | 0 | 0 | 1 |
| Performance | PASS desktop (Lighthouse 100); mobile lab LCP 2.6–3.05 s simulated; field data pending | 0 | 0 | 2 | 1 |
| Accessibility | PASS (axe 0 violations, keyboard, reflow, reduced motion) | 0 | 0 | 0 | 2 |
| Conversion | PASS (CTA on every commercial route, honest mailto hand-off); real lead delivery pending | 0 | 1 | 1 | 3 |
| Organic growth | PLAN READY (90-day roadmap starts launch week) | 0 | 0 | 0 | 0 |
| Paid ads | NOT READY (no conversion signal, no consent, no published privacy policy) | 0 | 3 | 0 | 0 |
| Analytics | Event layer PASS; no tags installed (owner decision) | 0 | 1 | 0 | 0 |
| Security / privacy | PASS (LOCAL); headers pending on Hostinger; legal text not approved | 0 | 2 | 2 | 1 |
| Deployment | Build ready; real-device QA and production checks pending | 0 | 1 | 2 | 1 |

**No P0 is open.** The one new defect found in this pass (FINAL-01, unapproved legal draft text shipped inside a shared JavaScript file on every page) is fixed and now guarded by the crawl.

## 2. Validation (this pass, final tree)

| Gate | Result |
|---|---|
| `npm run build` (production) | PASS. First Load JS: `/` 166 · `/services` 162 · `/services/[slug]` 163 · `/contact` 152 · `/about` 140 · `/work` 141 kB, all within +2 kB of budget (contact −1) |
| Preview build `NEXT_PUBLIC_SITE_ENV=preview` | PASS, same sizes |
| `npx tsc --noEmit` | PASS |
| `npm run lint` | PASS, 0 warnings |
| `node scripts/seo-crawl.mjs` production / preview | 0 problems / 0 problems (9 sitemap routes, click depth ≤ 1, JSON-LD parses, every `@id` resolves) |
| Negative crawl test | Planted "OWNER TO PROVIDE" in a JS chunk → crawl fails (new check) |
| `lib/leads` selfcheck | ok |
| `xmllint --noout out/sitemap.xml` | valid (production and preview) |
| Production `out/` | root paths; canonicals `https://growlatics.us/…`; 9 routes indexable, only 404 noindex; `.htaccess` present; 0 `/growlatics/` paths (only the LinkedIn URL `company/growlatics/`); no `out/lab`, `out/privacy`, `out/terms`; 0 files with draft legal text |
| Preview `out/` | 11/11 HTML pages `noindex, nofollow`; canonicals on growlatics.us; robots `Allow: /`; no lab/legal |
| axe-core 4.11.4 (WCAG 2.0–2.2 A/AA + best practice), Chromium, LOCAL | 10 routes (9 + 404) × 390/1440 × dark/light = 40 runs, **0 violations** |
| Lighthouse 13.4.1, LOCAL Apache with gzip | desktop `/` 100/100/100/100 LCP 0.64 s · sales-bpo 100s LCP 0.57 · contact 100s LCP 0.54; mobile `/` 94/100/100/100 LCP 3.05 · sales-bpo 95 LCP 2.85 · contact 97 LCP 2.59; TBT 0, CLS 0 everywhere. Same as the QA stream baseline (run-to-run noise ±0.3 s) |
| Cross-browser smoke (Playwright 1.59.1) | **WebKit 26.4, Firefox 148.0.2, Chromium 147: PASS.** 9 routes 200 with one H1, header nav, mobile menu at 390 (opens, focus inside, Esc closes, focus returns), CTA accessible name "Book a Growth Call", 0 px overflow, contact flow `?system=sales-bpo` → "One last step: send the email", 0 console errors, 0 failed requests. WebKit note: FINAL-02 |
| Apache `.htaccess` (LOCAL) | `-t` Syntax OK; HTML/txt/xml `Cache-Control: no-cache`; `/_next/static/*` `public, max-age=31536000, immutable`; gzip on HTML/JS/CSS/XML/txt; www → 301 apex; 404 branded; with mod_rewrite, mod_headers, mod_filter and mod_deflate all unloaded the site still answers 200/404 (no 500) |
| Event + attribution checks (Chromium, LOCAL) | Land `/services/?utm_source=linkedin&utm_campaign=launch`, client-navigate to `/about/` → `gl_attribution` kept; footer mailto/tel → `contact_email_intent` / `contact_phone_intent` with `location: footer`; contact aside → `location: contact-aside`; service final CTA href `/contact/?system=sales-bpo#book`; Service JSON-LD description = overview answer |

Screenshots: `hive/artifacts/growlatics-audit/smoke-{webkit,firefox,chromium}-*.png`.

## 3. Route inventory (production export)

| Route | Exported | Index | In sitemap | JSON-LD |
|---|---|---|---|---|
| `/` | yes | index | yes | Organization, WebSite, WebPage |
| `/services/` | yes | index | yes | WebPage, BreadcrumbList |
| `/services/sales-bpo/`, `/performance-marketing/`, `/customer-operations/`, `/technology/` | yes | index | yes | Service, WebPage, BreadcrumbList |
| `/about/`, `/work/`, `/contact/` | yes | index | yes | WebPage, BreadcrumbList |
| `/404.html`, `/404/` | yes | noindex, follow | no | none |
| `/privacy/`, `/terms/` | **no** (only with `NEXT_PUBLIC_LEGAL_APPROVED=1`) | — | no | — |
| `/lab/system` | no (postbuild) | — | no | — |

Per-route titles, descriptions and heading outlines: `audit/aeo-content.md` §2 (titles changed in this pass: Sales & BPO 64 chars, Technology 54).

## 4. Components

Full component matrix (layout, header, nav, dropdown, footer, buttons, heroes, glass, network/3D, scroll sections, contact flow, theme, cursor, FAQ, metadata/schema, deploy config): `audit/perf-a11y-qa.md` §8.

**FloatingHeader** (`components/layout/Header.tsx`). SEO: real `<a href>` nav and all four service links in static HTML. A11y: PASS (tab order, disclosure dropdown, modal mobile menu with inert page, focus wrap, Esc, focus return), now also verified in WebKit and Firefox. Perf: no scroll listener. Conversion: CTA visible at every width; below 640 px it is an icon button whose accessible name is "Book a Growth Call" (verified by role query in three engines). CRO-02 kept as designed; an owner may still prefer a text label or a hero CTA on About/Work. Status: PASS.

**Home Hero** (`components/home/acts.tsx` + `SystemStage`). SEO: one H1 in static HTML; all act copy in HTML (no canvas-only text). Perf: desktop LCP 0.64 s; mobile lab LCP 3.05 s simulated (PERF-02, field pending); CLS 0; WebGL idle-gated, context-loss fallback (PERF-01). Conversion: primary + secondary CTA above the fold. Status: PASS, field LCP pending.

**Sales & BPO** (`/services/sales-bpo/`). SEO: title "Sales & BPO: outbound, inbound, appointment setting | Growlatics" (64). AEO: answer-first overview + Who/How it connects/How it starts/Next step; 5 FAQs; Service JSON-LD description now the overview answer. Conversion: hero **and now the final CTA** preselect `?system=sales-bpo`. Content: BPO scope and engagement models await owner (OWNER_VERIFY 1–2). Status: PASS, owner claims pending.

**QualificationFlow** (`components/patterns/QualificationFlow.tsx`, `lib/leads`). A11y: fieldset/legend per step, focus to legend, `aria-live` step count, linked errors. Conversion: 5 one-tap steps (CRO-04: revisit with data), mailto result says "One last step: send the email", never "sent"; `lead_submitted` only on a webhook 2xx. Privacy: no cookies, no third-party requests; UTMs in sessionStorage only when present. Cross-browser: completes in WebKit, Firefox, Chromium. Status: PASS; real delivery to the inbox pending (PROD).

**Footer** (`components/layout/Footer.tsx`). SEO: crawlable service/company links, geography line. A11y: 44 px targets on mobile; social links open a new tab without a cue (A11Y-03, advisory). Entity: social links now LinkedIn + Instagram only (Facebook share link removed, TECH-06). Conversion: email/phone links now emit intent events through the layout listener (CRO-07). Status: PASS.

## 5. AEO deliverable per service page

| Facet (static HTML) | Sales & BPO | Performance Marketing | Customer Operations | Technology |
|---|---|---|---|---|
| What it is (first passage) | PASS | PASS | PASS | PASS |
| Who it's for / problems | PASS | PASS | PASS | PASS |
| What we do (capabilities) | 4 rows | 6 | 6 | 6 |
| Engagement / how it starts | PASS (models = OWNER_VERIFY 2) | PASS | PASS | PASS |
| Integration with other systems | PASS | PASS | PASS | PASS |
| Next step (CTA with preselect, hero + final) | PASS | PASS | PASS | PASS |
| FAQ (page-specific) | 5 | 3 | 3 | 3 |
| Service JSON-LD (description = overview answer, provider → Organization, areaServed US/GB/PK) | PASS | PASS | PASS | PASS |

No FAQPage markup (AEO-04: no rich-result benefit for this site class). Structured data and passages make the site easier to cite; they do not guarantee AI citations.

## 6. Issue register

Owner/worker: tech = gl-audit-tech, content = gl-audit-content, growth = gl-audit-growth, qa = gl-audit-qa, final = this pass. Re-test column cites the evidence above or the stream report.

### FIX BEFORE LAUNCH

| ID | Category | P | Page / component | Evidence | Status | Fix | Owner / worker | Result | Re-test |
|---|---|---|---|---|---|---|---|---|---|
| TECH-02 | Security/privacy | P0 | `/privacy/`, `/terms/` | Unapproved drafts were in the production export | FIXED | `scripts/postbuild.mjs` removes them unless `NEXT_PUBLIC_LEGAL_APPROVED=1` | tech | absent from `out/` | final: `ls out` + crawl ✔ |
| FINAL-01 | Security/privacy | P1 | `content/index.ts` → shared chunk | First final-pass build: draft privacy text ("[LEGAL ENTITY NAME — OWNER TO PROVIDE]… is operated by…") inside `_next/static/chunks/910-*.js`, referenced by every page, because client components import the `@/content` barrel which re-exported `legal.ts` (unchanged since fc64672, so present in every earlier build) | FIXED | Barrel no longer re-exports legal; privacy/terms pages import `@/content/legal`; crawl fails on draft text in any `.js/.html/.txt` | final | 0 files in `out/` | final: grep + negative crawl test ✔ |
| TECH-01 | Technical SEO | P1 | preview robots | `Disallow: /` hid `noindex` from crawlers | FIXED in code | Preview robots `Allow: /`, every page noindex | tech | preview build ✔ | final: preview 11/11 noindex ✔. Live preview keeps the old file until the next owner-approved dispatch |
| AEO-01 | AEO | P1 | 4 service pages | No answer-first definition | FIXED | Overview passage + facts | content | ✔ | crawl ✔ |
| CRO-05 | Analytics | P1 | `lib/analytics`, `lib/leads` | No event layer; mailto open indistinguishable from a lead | FIXED | `track()`; `lead_submitted` only on webhook 2xx | growth | ✔ | `audit/cro.md` ✔ |
| OV-1–3, 5 | Content | P1 | Sales & BPO, FAQ, Home act 7, About | `OWNER_VERIFY.md` 1, 2, 3, 5: BPO scope, engagement models, data ownership, delivery location | PENDING (owner) | Owner confirms, edits or removes | owner | — | — |
| LEGAL | Security/privacy | P1 | `content/legal.ts` | No approved Privacy/Terms; entity name, law, retention, date are placeholders | PENDING (owner/legal) | Approve text, then build with the flag (LAUNCH_READINESS §4) or launch without them by explicit owner decision | owner | drafts stay out of the export | crawl guard ✔ |
| QA-01 | Deployment | P1 | all routes | WebKit/Firefox were not run | PARTLY FIXED | Installed WebKit 26.4 + Firefox 148, smoke PASS | final | automated PASS | §2. **Real Safari macOS/iOS + Android: PENDING** (LAUNCH.md §5) |
| TECH-03 | Security/privacy | P1 | `public/.htaccess` | No security headers on production | FIXED (LOCAL) | 5 headers | tech | Apache ✔ | final ✔ LOCAL; PROD curl after upload |
| CRO-PROD | Conversion | P1 | `/contact/` | Real delivery to ahsan@growlatics.com untested | PENDING (PROD) | Send one real request after upload | owner | — | — |

### RECOMMENDED AT LAUNCH

| ID | Category | P | Page / component | Evidence | Status | Fix | Owner / worker | Result | Re-test |
|---|---|---|---|---|---|---|---|---|---|
| TECH-08 | Deployment | P2 | www host | `www.growlatics.us` served a duplicate site (PROD) | FIXED (LOCAL) | `.htaccess` 301 www → apex | tech | Apache ✔ | final ✔; PROD `curl -I https://www.growlatics.us/about/` |
| ASSET-01 | Performance | P3 | `public/.htaccess` | No cache or compression rules | FIXED (LOCAL) | immutable `/_next/static`, no-cache HTML/txt/xml, brotli/deflate in module guards | final | Apache ✔ (§2) | PROD: `curl -sI -H 'Accept-Encoding: br,gzip'` |
| GSC | Technical SEO | P2 | site | Search Console / Bing not set up | PENDING (owner account) | LAUNCH_READINESS §5 | owner | — | — |
| CRO-01 | Conversion | P2 | service pages, `ConvergenceCTA` | Final CTA dropped `?system=` | FIXED | `href` prop; slug page passes `/contact/?system=<slug>#book` | final | ✔ | Chromium attr check ✔ |
| CRO-02 | Conversion | P2 | Header < 640 px | Icon-only CTA; only CTA above the fold on About/Work at 390 | DOCUMENTED (design kept) | Accessible name verified in 3 engines; owner may add a text label or About/Work hero CTA | owner | — | smoke ✔ |
| CRO-07 | Analytics | P3 | Footer, contact aside | mailto/tel links emitted no events | FIXED | `data-track` + one delegated listener in `components/layout/Attribution.tsx` | final | ✔ | Chromium ✔ |
| ATTR | Analytics | P3 | root layout | UTMs lost if visitor browsed before clicking a CTA | FIXED | `captureAttribution()` once in a layout effect | final | ✔ | Chromium ✔ |
| CRO-08 | Security/privacy | P2 | `content/legal.ts` | Privacy draft did not mention UTM sessionStorage | FIXED as marked draft | One sentence tagged `[DRAFT, OWNER/LEGAL TO REVIEW]`, listed in `ownerRequired` | final | unpublished | — |
| TECH-06 | Content | P3 | `content/site.ts` | Facebook link was a share short-link, not a profile | FIXED | Removed from `site.social` (footer, contact, `sameAs`); no URL invented | final | ✔ | `grep facebook.com/share out` = 0 |
| CONT-08 | Content | P3 | socials | Profiles not owner-confirmed; Facebook page URL unknown | PENDING (owner) | Confirm LinkedIn/Instagram; give the real Facebook page URL to re-add | owner | — | — |
| TECH-09 | Deployment | P3 | `PREVIEW.md`, `LAUNCH.md`, `preview-pages.yml` | Stale postbuild/robots/legal text | FIXED | Text updated | final | ✔ | — |
| TECH-11 / CONT-09 | On-page | P3 | Sales & BPO, Technology titles | 67 / 68 chars | FIXED | 64 / 54 chars | final | ✔ | Apache titles ✔ |
| TITLES-2 | On-page | P3 | `/services/` (68), Performance Marketing (69) | May truncate on mobile SERPs | OPEN (accepted) | Revisit with Search Console data | owner | — | — |
| CONT-04 | Content | P3 | service journey | Same 5 stage h3s on 5 pages | FIXED | `SignalRail titleAs="p"` on service pages (same classes, no visual change); `/services/` keeps the h3s | final | Attract…Scale no longer h3 on service pages, still h3 on `/services/` | `out/` grep ✔ |
| CONT-05 | On-page | P3 | 404 | og:title kept the suffix | FIXED | og:title "Page not found" | final | ✔ | `out/404.html` ✔ |
| AEO-05 | AEO | P3 | Service JSON-LD | description = meta description | FIXED | `overview.answer` | final | ✔ | Chromium ✔ |
| AI-BOTS | AEO | P3 | `app/robots.ts` | All agents allowed incl. training crawlers | OWNER DECISION | Table in `audit/tech-seo.md` §5 | owner | — | — |
| CRO-03 | Conversion | P3 | Header 640–767 px | "Book a call" variant; "Book" while no scheduler | OWNER DECISION (O-6) | keep or "Request a Growth Call" | owner | — | — |
| FINAL-02 | Deployment | P3 | `.htaccess` CSP `upgrade-insecure-requests` | WebKit upgrades `http://127.0.0.1` subresources to https (Chromium/Firefox exempt loopback), so a plain-http local test under the real `.htaccess` fails to hydrate in WebKit | NOTE | None for production (https, upgrade is a no-op). Local WebKit tests strip that token | final | — | WebKit smoke ✔ without the token |

### FIRST 30 DAYS

| ID | Category | P | Page / component | Evidence | Status | Fix | Owner / worker |
|---|---|---|---|---|---|---|---|
| PERF-02 | Performance | P2 | all, mobile | Lab LCP 2.6–3.05 s simulated; 1.55–2.03 s with applied throttling | PENDING (field) | Read CrUX/Search Console; if p75 > 2.5 s move first-paint reveals to CSS, trim shared `framer-motion` chunk | qa → owner |
| PERF-04 | Performance | P2 | `/` tier 2 | Lab interaction latency up to 544 ms under software GL | PENDING (field INP) | If p75 > 200 ms skip the view transition while WebGL runs | qa |
| TECH-04 | Security | P2 | Hostinger | No HSTS | OWNER STEP | `Strict-Transport-Security max-age=31536000` after a clean week | owner |
| TECH-05 | Security | P2 | `next 14.2.5` | npm audit 1 critical, 3 high (server features unused by a static export) | OPEN | Upgrade to latest 14.2.x with full re-test | worker |
| CONT-07 | Content | P1 (business) | `/about/`, `/work/` | No people, no proof | PENDING (owner evidence) | Supply permissioned assets (`audit/aeo-content.md` §5) | owner |
| CONT-06 | Content | P2 | Home act 7, About | "Distributed execution" hides where work happens | PENDING (OWNER_VERIFY 5) | Owner states delivery locations | owner |
| O-1–O-3 | Analytics / paid | P1 | site | No webhook, no GTM/GA4, no consent | OWNER DECISION | `CONVERSION_TRACKING_PLAN.md` §3–5 | owner |
| PERF-03 | Performance | P3 | `/` desktop | 4× CPU frame p99 133 ms on software GL | PENDING (real GPU) | Real-device run | owner |
| A11Y-02 | Accessibility | P3 | glass | No reduced-transparency / forced-colors rules | PENDING | Optional CSS (in report) | qa |
| TECH-07 | International | P3 | `content/site.ts` | Email on growlatics.com, site on growlatics.us | OWNER DECISION | none needed for launch | owner |

### 30–90 DAYS

| ID | Category | P | Page / component | Status | Fix | Owner / worker |
|---|---|---|---|---|---|---|
| PAID | Paid ads | P1 (before any campaign) | site | NOT READY | O-1–O-3 + published privacy policy; differentiated landing pages (`PAID_ADS_READINESS.md`) | owner |
| ORG | Organic growth | — | content | PLAN | First Sales & BPO spoke, query review (`ORGANIC_GROWTH_ROADMAP.md`) | owner + worker |
| CSP | Security | P3 | `.htaccess` | OPEN | Report-only CSP first (`audit/tech-seo.md` §6) | worker |
| CRO-04 | Conversion | P3 | contact flow | OPEN | Merge stage + start steps only if `contact_step_completed` data shows drop-off | growth |
| CRO-06 | Conversion | P3 | "Copy my answers" | OPEN | Fallback select-text on clipboard failure (https works) | worker |
| A11Y-03 | Accessibility | P3 | Footer socials | ADVISORY | sr-only "(opens in new tab)" | worker |

Closed without change (evidence in stream reports): TECH-10, CONT-01–03, AEO-02–04, PERF-01, A11Y-01, QA-02, ASSET-02/TECH-12 (accepted trade-off).

## 7. NOT RUN in this pass

- Real devices (Safari macOS/iOS, iPad, Android): needs hardware. Automated WebKit is not iOS Safari.
- Public preview re-check: the preview was not redeployed (boundary); it still serves the pre-audit build.
- Production checks (headers, www redirect, compression, lead delivery, Search Console, Rich Results Test): production still serves the old site.
- Screen reader pass: not run in any stream.
