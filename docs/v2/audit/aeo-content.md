# Audit stream: on-page content, AEO, entity, IA, E-E-A-T (gl-audit-content)

Branch `v2-audit-content` (base `51da8b9`), fix commit `80a0a14`. Date 2026-10-09. Brief §7, §8, §9.1–9.3, §9.5, §9.8, §10 (wording), §11, §13.
Check labels: **SRC** = source inspection · **EXP** = local export (`npm run build` → `out/`, served on :4188) · **PREV** = public preview · **PROD** = production-only.
Companion docs: `KEYWORD_CONTENT_MAP.md`, `ORGANIC_GROWTH_ROADMAP.md`.

## 1. What changed in this pass (all in `content/**` + one page body)

| Change | Files | Why |
|---|---|---|
| Answer-first "What Growlatics <service> covers" passage + `<dl>` (Who it's for / How it connects / How it starts / Next step) under every service hero | `content/types.ts` (`overview`), `content/pages.ts`, `app/services/[slug]/page.tsx` | §9.3 AEO passages. Every sentence restates copy already on the site (capabilities, problem, journeyNote, pairsWith, engagement "Diagnose", contact call) |
| FAQ on Performance Marketing, Customer Operations, Technology (3 each); Sales & BPO +1 (cold outreach / appointment setting) | `content/faq.ts`, `content/pages.ts` | §8 service breadth as FAQ, not thin pages; page-specific questions only |
| Services FAQ: "What does Growlatics do?", "Where is Growlatics based, and which markets do you serve?" (merged the old markets question), "What is a Growth Call?" | `content/faq.ts` | §9.1 entity answers in one citable place |
| Titles/descriptions: Home, Services, About, Work, Performance Marketing, Customer Operations | `content/pages.ts` | §7 factual, intent-matched, de-cannibalised |
| Entity description unified: "US / Pakistan-based international growth operations, Sales & BPO and technology partner…" (feeds default meta + Organization JSON-LD) | `content/site.ts`; About hero/description "BPO" → "Sales & BPO" | §9.1 one definition everywhere |
| Removed two speed claims: "Fast inbound response…" → "Inbound response…"; "Fast, consistent answers…" → "Consistent answers…" | `content/pages.ts` | Same rule god applied to the speed promise in 9a |

Post-fix verification (EXP): `npm run build` ✔, `npx tsc --noEmit` ✔, `npm run lint` ✔ (0 warnings), `node scripts/seo-crawl.mjs` → **0 problems**, 1 H1 per page, no heading skips. First Load JS unchanged: `/` 165, `/services` 160, `/services/[slug]` 161, `/contact` 152 kB. Screenshots of the new section at 1440 and 390 (Chrome via playwright-core) match the existing Ledger look; 0 console errors. WebKit/Firefox: NOT RUN (not installed for this stream; QA stream owns the browser matrix).

## 2. Per-route on-page table (EXP, after fix)

Title length counts `&` as one character. All indexable routes: self-canonical `https://growlatics.us<route>`, OG + Twitter present, `lang="en"`, robots indexable (crawl script, EXP).

| Route | Title (chars) | Description (chars) | H1 | H2 outline | Status |
|---|---|---|---|---|---|
| `/` | Growlatics — Growth operations, Sales & BPO and technology partner (66) | US / Pakistan growth operations partner running Sales & BPO, performance marketing, customer operations and technology as one connected system. (143) | We build and operate the systems behind growth. | 8 acts, logical h2→h3 | PASS |
| `/services/` | Sales & BPO, Marketing, Support and Technology Services \| Growlatics (68) | Four connected services: … Start with one or run growth as one operation. (157) | Four systems. One growth operation. | systems · journey map · engagement · Questions (7) · CTA | PASS |
| `/services/sales-bpo/` | Sales & BPO: outbound, inbound and appointment setting \| Growlatics (67) | unchanged (152) | Sales capacity that plugs into your pipeline. | overview · problem · what we run · how it works · ways to engage · journey · connected · FAQ (5) · CTA | PASS |
| `/services/performance-marketing/` | Performance Marketing: paid ads, SEO, social and YouTube \| Growlatics (69) | unchanged (142) | Demand that reaches your sales team. | overview · problem · what we run · journey · connected · FAQ (3) · CTA | PASS |
| `/services/customer-operations/` | Customer Operations: chat, phone and email support \| Growlatics (63) | unchanged (129) | Support that keeps customers — and tells you why they stay. | same shape · FAQ (3) | PASS |
| `/services/technology/` | Technology & Development: web, ecommerce and automation \| Growlatics (68) | unchanged (127) | The infrastructure that connects your growth. | same shape · FAQ (3) | PASS (title a little long; P3) |
| `/about/` | About Growlatics: growth operations, Sales & BPO and technology (63) | Growlatics is an international growth operations, Sales & BPO and technology partner: a US / Pakistan business … (158) | We connect the work behind growth. | why · beliefs · who · international · CTA | PASS |
| `/work/` | Work: how we measure and report results \| Growlatics (52) | unchanged (139) | How we measure work. | measure · report · engagement · CTA | PASS |
| `/contact/` | Book a Growth Call \| Growlatics (31) | unchanged, includes email + phone (130) | Book a Growth Call. | direct contact · what happens on the call | PASS |
| `/404`, `/privacy/`, `/terms/` | noindex | — | 1 each | — | NOT APPLICABLE (noindex) |

H1 note: service H1s are benefit lines, not service names. Kept (premium voice, brief §19); the service name is now in the first H2 ("What Growlatics Sales & BPO covers"), the title, breadcrumb and Service JSON-LD. PASS.

## 3. AEO per service page (EXP, after fix)

Each facet is checked for a plain, extractable sentence in the static HTML.

| Facet | Sales & BPO | Performance Marketing | Customer Operations | Technology |
|---|---|---|---|---|
| What it is (first passage) | PASS (overview answer) | PASS | PASS | PASS |
| Who it's for | PASS (dl) | PASS | PASS | PASS |
| Problems it solves | PASS (problem section + who) | PASS | PASS | PASS |
| What we do | PASS (4 capability rows) | PASS (6) | PASS (6) | PASS (6) |
| Engagement | PASS ("How it starts", ways to engage = OWNER_VERIFY 2) | PASS ("How it starts") | PASS | PASS |
| Integration with other systems | PASS ("How it connects", Pairs with) | PASS | PASS | PASS |
| Next step | PASS (dl + hero/final CTA → `/contact/?system=<slug>#book`) | PASS | PASS | PASS |
| Breadth terms findable as text | cold outreach, appointment setting, BPO, telesales ✔ | SEO, social, YouTube, Google Ads, Meta, ecommerce ✔ | chat, phone, email, retention, help desk ✔ | WordPress, ecommerce, apps, automation ✔ | 

## 4. Entity clarity (SRC + EXP)

| Element | Where | Status |
|---|---|---|
| Name "Growlatics" | everywhere, `site.name` | PASS |
| What it is | `site.description` (meta default, Organization JSON-LD), About hero/description, Services FAQ, home hero | PASS after fix. Before: three variants ("Growth operations, Sales & BPO and technology partner" / "international growth operations, BPO and technology partner" / no geography in JSON-LD). Now one definition |
| Services | 4 named services + capabilities; same names in nav, footer, breadcrumbs, Service JSON-LD | PASS |
| Who it serves | About "Who we work with"; per-service "Who it's for" | PASS |
| Markets | "US / Pakistan business serving clients in the United States, the United Kingdom, Pakistan and other international markets" (owner-approved); footer `site.geography`; JSON-LD `areaServed` US/GB/PK | PASS |
| Offices / addresses | none anywhere (copy or JSON-LD) | PASS (correct: none verified) |
| Public contacts | email + phone in footer, contact, Organization JSON-LD | PASS |
| Social profiles | LinkedIn, Facebook, Instagram in `sameAs` and Contact | PENDING VERIFICATION (PROD): owner confirms each profile is live and names Growlatics the same way |
| Spelling | US English throughout ("optimize", "center"); no mixed UK spellings found (grep) | PASS |
| Vague/contradictory text | "Distributed execution" (home act 7, About) is deliberately vague about where work happens | Owner decision → OWNER_VERIFY 5 |

## 5. E-E-A-T (SRC)

| Signal | Buildable now (no new facts) | Needs owner evidence |
|---|---|---|
| Who | Done: entity line, markets, contacts | Named founder/leadership with permission; legal entity name (OWNER_VERIFY 4) |
| What | Done: services, capabilities, answer-first passages | Exact BPO scope (OWNER_VERIFY 1); engagement models (OWNER_VERIFY 2) |
| How clients engage | Done: engagement steps, "How it starts", Growth Call explained | Typical onboarding timeline (FAQ says "we'll give you a timeline") |
| Experience / proof | Proof slots wired, empty (`content/proof.ts`) | Permissioned case study, testimonial with name/role, client logos with permission, verified metrics with source |
| Transparency | Contact details, honest-numbers belief, Work method | Approved Privacy/Terms (OWNER_VERIFY 4); company registration if the owner wants it shown |
| Off-site | Consistent social bios (roadmap launch week) | Third-party profiles (Clutch, LinkedIn page activity) only if real |

## 6. IA (brief §8)

| Page type | Status | Launch? |
|---|---|---|
| Home, Services, 4 service pages, About, Work, Contact | Exist | Required — PASS |
| Process / engagement model | Covered on `/services/` and `/work/` ("How an engagement runs") and per-service "How it starts" | PASS; no separate page needed |
| FAQ | Per-page FAQ (Services 7, Sales 5, others 3). No standalone /faq/ (would duplicate) | PASS |
| Privacy / Terms | Drafts, noindex, unlinked | PENDING VERIFICATION (owner legal); see tech stream for export exclusion |
| Resources / blog | None | After launch (roadmap days 30–90), owner-approved only |
| Service-area / location pages | None | NOT APPLICABLE (no verified offices; brief forbids fake local pages) |
| Work | Method page with dormant proof slots | PASS; future-ready without fabrication |

## 7. Issue register

| ID | Cat | P | Page / file | Evidence (label) | Status | Fix | Owner | Re-test |
|---|---|---|---|---|---|---|---|---|
| AEO-01 | AEO | P1 | 4 service pages | No answer-first definition before narrative (EXP outline before fix) | FIXED `80a0a14` | Overview passage + dl | content | EXP outline shows `h2 What Growlatics … covers` first ✔ |
| AEO-02 | AEO | P2 | `content/site.ts:10`, `content/pages.ts` About | 3 entity variants (SRC) | FIXED | One definition | content | grep ✔ |
| AEO-03 | AEO | P2 | Services FAQ | No "what/where" entity answers (EXP) | FIXED | 3 entity FAQs | content | EXP ✔ |
| AEO-04 | Schema | P3 | `lib/seo.ts` | FAQ content now on 5 pages; **do not add FAQPage JSON-LD**: Google shows FAQ rich results only for well-known government/health sites (Aug 2023 change), so no benefit, more maintenance | OPEN (recommendation) | None | structured-data stream | — |
| AEO-05 | Schema | P3 | `lib/seo.ts:89` `serviceJsonLd` | Service `description` = meta description; could use `overview.answer` (fuller, same facts) | OPEN (recommendation) | Pass `page.overview.answer` from `app/services/[slug]/page.tsx:70` | structured-data stream | crawl JSON-LD |
| CONT-01 | Content | P2 | `content/pages.ts` Sales "Conversion", CO "Chat and email" | "Fast …" speed claims (SRC) | FIXED | Removed "Fast" | content | grep ✔ |
| CONT-02 | On-page | P2 | `/services/`, `/about/`, `/work/` titles | Verbs-only / "About \| Growlatics" titles carry no service or entity terms (EXP) | FIXED | New titles (§2) | content | crawl ✔ |
| CONT-03 | Breadth | P2 | PM, CO, Tech | No FAQ; SEO/social/YouTube/ecommerce only as chips/rows (EXP) | FIXED | Page-specific FAQs | content | EXP ✔ |
| CONT-04 | Content | P3 | `app/services/[slug]/page.tsx` journey section | Same 5 stage h3s on 5 pages (boilerplate) | OPEN | Optional: `SignalRail` titles as non-heading text on service pages | patterns owner | crawl |
| CONT-05 | On-page | P3 | `app/not-found.tsx` / `lib/seo.ts:29` | 404 og:title "Page not found \| Growlatics" keeps the suffix (EXP); noindex so low impact | OPEN | Use `pageMetadata` or strip suffix | tech stream | EXP |
| CONT-06 | Entity | P2 | Home act 7, About "International by design" | "Distributed execution" hides where work happens; buyers and AI answers cannot tell whether delivery is from Pakistan | PENDING VERIFICATION | Owner decides wording → OWNER_VERIFY 5 | owner | — |
| CONT-07 | E-E-A-T | P1 (business) | `/about/`, `/work/` | No people, no proof (SRC `content/proof.ts` empty) | PENDING VERIFICATION | Owner supplies §5 assets | owner | — |
| CONT-08 | Entity | P3 | `content/site.ts:19-23` | Social profiles not checked live (sandbox) | PENDING VERIFICATION (PROD) | Owner confirms | owner | — |
| CONT-09 | On-page | P3 | `/services/technology/` | Title 68 chars may truncate on mobile SERPs | OPEN (accepted) | Optional shorter "Web, Ecommerce and Automation Development \| Growlatics" | owner | — |
