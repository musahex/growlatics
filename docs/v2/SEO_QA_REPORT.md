# Growlatics v2 — SEO-QA report (Phase 6)

Branch `v2-seo` from `v2` 6816dca. Worker: worker-gl-seo. Date 2026-10-06.
Gates: `npm run build` (static export), `npx tsc --noEmit`, `npm run lint` all pass. First Load JS unchanged (`/` 163 kB).

Re-run the checks: `npm run build && node scripts/seo-crawl.mjs` (exit code 1 on any problem).

## Before / after (crawl of `out/`)

| Check | Before (6816dca) | After |
|---|---|---|
| Crawl problems | 3 (404, `/404/`, `/lab/system/` inherited Home's canonical `https://growlatics.us/`, plus Home's description and `og:url`) | **0** |
| Title / description / canonical / OG / Twitter on the 9 indexable routes | correct | correct (+ `og:locale`, OG image width/height/alt) |
| Exactly one H1, no skipped heading levels | 14/14 pages | 14/14 pages |
| JSON-LD | Organization (Home), Service ×4 | Organization + WebSite (Home, one `@graph`), Service ×4 (provider linked by `@id`), BreadcrumbList on all 8 inner indexable pages |
| JSON-LD forbidden fields (address, ratings, reviews, offers, price, foundingDate, employees, LocalBusiness) | none | none (crawler now fails if any appear) |
| Organization logo | `/icon.svg` (SVG; Google wants raster) | `/logo.png` 512×512 raster |
| OG image | 1200×630 with removed copy "Marketing that converts. Sales teams that close. Tech that scales." (IA §9.2) and old mark | 1200×630, Home H1 "We build and operate the systems behind growth.", canonical mark, Acquire · Sell · Operate · Build on one signal line. No claims |
| Icons | `icon.svg` only (`/favicon.ico` 404 on Hostinger) | `favicon.ico` 32, `icon.svg`, `apple-icon.png` 180, `site.webmanifest` with 192/512 PNGs |
| Sitemap | 9 indexable routes; lab/privacy/terms/404 excluded | unchanged (already correct) |
| robots.txt | `Allow: /` + sitemap | unchanged: drafts use `noindex` meta, not `Disallow`, so crawlers can read the noindex |
| noindex | privacy, terms, lab, 404 | unchanged |
| Service pages within 2 clicks of Home | all 4 at depth 1 | all 4 at depth 1 |
| Dead links, `#` links, links to `/privacy/` or `/terms/` | none | none |
| Footer landmarks | link columns were plain `div`s | each column is a labelled `<nav>` (Services, Company, Contact) |

## What changed (files)

- `lib/seo.ts`: `siteMetadata` (root-layout defaults: `metadataBase`, title template, site description, OG/Twitter image, manifest; **no canonical**), `ldJson()` (escapes `<`), `homeJsonLd()` (Organization + WebSite), `breadcrumbJsonLd(route)` (names from `content/nav.ts`), Service gains `serviceType` and provider `@id`.
- `app/layout.tsx`: metadata = `siteMetadata` only. `app/page.tsx`: Home's own `metadata` + `homeJsonLd`.
- `app/{about,contact,services,work}/page.tsx`, `app/services/[slug]/page.tsx`: BreadcrumbList script (metadata/JSON-LD lines only; bodies untouched).
- `components/layout/Footer.tsx`: column `div` → `nav aria-label`.
- `public/og-image.png`, `public/logo.png`, `public/icon-192.png`, `public/icon-512.png`, `public/site.webmanifest`.
- `app/favicon.ico`, `app/apple-icon.png` (**outside my listed ownership**: Next's file-based `app/icon.svg` overrides metadata `icons`, so the favicon and apple icon must also be file conventions in `app/`. Asset files only, no code).
- `scripts/seo-crawl.mjs` (crawler) and `scripts/gen-brand-assets.mjs` (regenerates every raster asset from the canonical mark with Playwright's cached headless Chromium and the built Inter font; free, no new dependency). Needs the sandbox off to launch Chromium.

## Asset paths (visual check)

- `public/og-image.png` (1200×630), `public/logo.png`, `app/apple-icon.png`, `public/icon-512.png`, `app/favicon.ico`.
- No page screenshots taken: local port binding and full Chrome headless were blocked in this sandbox; the crawl reads the exported HTML directly.

## Heading and link findings for god (component code, not edited)

1. **Heading structure is clean** on every page in the exported HTML: one H1, no skipped levels. No component fix needed.
2. **`/work/` main content links to no service page** (only header/footer do). IA §1.4: "`/work/` → `/services/`, `/contact/#book`" and "every indexable page links to at least one service page". Fix in `app/work/page.tsx` body (PERF/PAGES ownership): add a "See the four systems" link to `/services/`.
3. **`/contact/` main content links to no service page.** Acceptable (it is the destination); header/footer cover it. Optional.
4. **Reveal ships `opacity:0` inline in SSR HTML** (18–39 per page). Text is in the HTML, so crawlers that read HTML index it, and Google renders JS; but no-JS readers see blank sections. Already PERF defect (2); listed here because it is also an SEO risk.
5. Header renders two `<nav aria-label="Main">` (desktop + mobile sheet). The sheet only mounts when open, so only one exists at a time. No change.

## Content accuracy sweep (MASTER_BRIEF §5, PLAN "God decisions")

Swept `content/**`, `components/{home,pages,patterns,system}/**`, `app/**`, `lib/**` for: % figures, ROI, 10x, "10+", 24/7, round-the-clock, offshore, Lahore/London/Karachi, Microsoft/LinkedIn/TikTok Ads, response times, years/founded, "trusted by", awards, client counts, clichés (cutting-edge, passionate, 360, unlock, world-class).
**Result: none present.** Microsoft/LinkedIn/TikTok Ads and the LinkedIn outreach channel are gone; contact success copy has no response time; no address anywhere (copy or JSON-LD); `content/proof.ts` empty and proof slots render nothing.

## OWNER-VERIFY list

### A. Strings already flagged `verify: true` (implemented; owner confirms or god strips)

| # | File:line | String / block | Claim type (IA §9.1) |
|---|---|---|---|
| 1 | `content/faq.ts:15` | "Do your teams use our tools?" → "Yes, by default. Sales and support work inside your CRM and help desk…" | work in client tools |
| 2 | `content/faq.ts:25` | "How do you report?" → "Against metrics agreed before launch…" | metrics agreed before launch |
| 3 | `content/faq.ts:34` | "Is this a call center?" → "…with managers accountable for quality and pipeline…" | managed by team leads |
| 4 | `content/faq.ts:40` | "Who owns the leads and data?" → "You do. We work in your systems by default." | work in client tools |
| 5 | `content/pages.ts:77` | Home act 6 note: "We agree the metrics before launch and report against them every cycle." | metrics agreed before launch |
| 6 | `content/pages.ts:93` | Home act 8: "Results agreed before launch, reported every cycle." + body | metrics agreed before launch |
| 7 | `content/pages.ts:184` | Sales & BPO capability "Business process outsourcing: order processing, follow-up workflows, data and admin tasks" | BPO scope |
| 8 | `content/pages.ts:190–193` | Sales "How it works": "We work in your CRM and calendars…", "Team leads handle training, quality review and daily performance…" | client tools; team leads |
| 9 | `content/pages.ts:201` | Sales "Ways to engage": Dedicated team / Campaign / Overflow | engagement shapes |
| 10 | `content/pages.ts:348` | About belief "Accountability over activity. …agreed up front." | metrics agreed up front |
| 11 | `content/pages.ts:350` | About belief "Your data stays yours. We work in your tools by default." | client tools |
| 12 | `content/pages.ts:427` | Work "How we report": "Metrics and baselines are agreed in writing before launch…" | metrics agreed before launch |
| 13 | `content/systems.ts:44` | Sell `long`: "…trained, managed sales capacity… Our teams work in your CRM…" | client tools; managed |
| 14 | `content/systems.ts:67` | Capability `sell.bpo` label (BPO scope) | BPO scope |
| 15 | `content/legal.ts:6,15,35` | Privacy Policy and Terms drafts (whole documents) | legal approval (IA §10.1) |

### B. Unverifiable claims found that are NOT flagged (listed, not edited)

| # | File:line | String | Why it needs the owner |
|---|---|---|---|
| 1 | `content/pages.ts:162` (Sales `seo.description`) | "…appointment setting and sales operations, **inside your CRM**." | Same "work in client tools" commitment as A1/A4, but in the meta description and Service JSON-LD description, unflagged |
| 2 | `content/pages.ts:167` (Sales hero lead) | "**Trained, managed teams** for outbound, inbound…" | Same as A8 (team leads / managed); unflagged and is the page lead |
| 3 | `content/journey.ts:31` | "**Trained sales teams** run follow-up, booked meetings and telesales…" | Same "trained, managed" claim, unflagged |
| 4 | `content/pages.ts:122` (engagement step 4, used on Services and Work) | "We run the system day to day and **report against the agreed metrics every cycle**." | Same as A2/A5/A12, unflagged |
| 5 | `content/pages.ts:83` (Home act 7) | "**Distributed teams** let us staff sales, support and technology work around the markets you sell into…" | Implies staffing / coverage across markets (IA §10.4 coverage hours, §10.3 locations) |
| 6 | `content/pages.ts:362` (About) | "**Distributed teams** and one shared operating process…" | Same as B5 |
| 7 | `content/faq.ts:8` | "**Most clients** start where the pressure is highest…" | Implies an existing client base and pattern; no proof exists |
| 8 | `content/pages.ts:203` | "Dedicated team: **Named people working only on your account**" | Inside flagged block A9, but a specific staffing commitment worth a separate yes/no |
| 9 | `content/pages.ts:194` | "Visible pipeline: **Every call, email and meeting is logged** where you can see it." | Operating commitment; sits in flagged block A8 but the item itself is unflagged |
| 10 | `content/legal.ts` privacy | "This site sets **no analytics or advertising cookies**." | True today; becomes false the day analytics is added. Owner/legal to keep in sync |
| 11 | `site.ts` / JSON-LD `areaServed` US, GB, PK | Serving US, UK, Pakistan | Sourced (brief §1); listed only because it is machine-readable in JSON-LD |

### C. Owner-only items still open (IA §10), relevant to SEO

- Legal entity name (copyright line, JSON-LD `legalName`): not set; JSON-LD uses "Growlatics".
- Office / registered address: none anywhere; gates any `address` in JSON-LD.
- Privacy / Terms approval: until then they stay `noindex`, unlinked, out of the sitemap (verified).

## Deliberately not done

- No visible breadcrumb UI (JSON-LD only; a visible trail would be a component change).
- No per-page OG images (IA §7: one site-wide image until per-page images exist).
- No `Disallow` for `/lab/` in robots.txt: `noindex` is the right signal and a Disallow would hide it.
- No `lastmod` in the sitemap (static export has no reliable per-page modified date; a build date on every URL is noise).
- No edits to component bodies, heading copy or flagged strings (nothing needed fixing; owner-verify items are listed, not changed).
- Kept `app/icon.svg` unchanged (it already has the canonical geometry).

## Open risks

1. `/lab/system/` ships in `out/` and is publicly reachable on Hostinger (noindex, unlinked, not in sitemap). God may want it excluded from the production upload.
2. Reveal `opacity:0` in SSR HTML (above, item 4).
3. Manifest is emitted with `crossorigin="use-credentials"` (Next default); harmless on a same-origin static host.
4. `scripts/gen-brand-assets.mjs` depends on a local Playwright Chromium cache (`~/Library/Caches/ms-playwright`) and needs the sandbox off; set `CHROME=` to another headless Chromium otherwise.
