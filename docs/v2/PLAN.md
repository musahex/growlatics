# Growlatics v2 — Build plan and worker contract

Owner brief: `docs/v2/MASTER_BRIEF.md` (read it fully). Orchestrator: god (Izza). This file is the contract every worker follows.

## Git rules (every worker)
- Integration branch: **`v2`** (god merges into it; `main` = what is live, untouched).
- Work only on your own branch **`v2-<stream>`** (git cannot nest `v2/x` under branch `v2`) created from the latest `v2`. Commit there. Never commit to `v2` or `main`. Never push. Never `git add -A` / `git add .`; stage explicit paths.
- Non-source copies (`Growlatics/`, `growlatics-hostinger-deploy*`, zips, `out/`, `.next/`) are never read as source, never staged, never deleted.
- Report done with: branch name, final commit hash, what changed, what you deliberately did not do, open risks.
- Worktrees have no `node_modules`: run `npm ci` in your worktree (or symlink `/Users/moses/Growlatics/node_modules`) before building. No new runtime dependency without stating why in your report; free/OSS only.
- Every code stream must leave `npm run build` passing (static export) and `npx tsc --noEmit` + `npm run lint` clean.

## Phases and streams
| Phase | Stream | Branch | Output |
|---|---|---|---|
| 1 Plan | DIRECTION (art direction + design system + motion + 3D architecture + hero/story storyboard) | `v2-direction` | `docs/v2/DIRECTION.md` |
| 1 Plan | IA-COPY (sitemap, page structures, final copy, journey vocabulary, conversion flow, metadata) | `v2-ia-copy` | `docs/v2/IA_AND_COPY.md` |
| 2 Foundation | FOUNDATION (tokens, fonts, layout shell, content modules, interaction store, motion constants, route skeleton, SEO base, lead adapter) | `v2-foundation` | code |
| 2 Foundation | SYSTEM-3D (shared network primitives, capability tiers, dynamic loading, frame scheduler) | `v2-system-3d` | code in `components/system/**` |
| 3 Flagship | HOME (all homepage acts incl. hero + journey) | `v2-home` | code |
| 4 Internal | PAGES (Services, 4 service pages, About, Contact, Work) | `v2-pages` | code |
| 5 Hardening | PERF-A11Y (bundle, gating, reduced motion, touch, responsive) | `v2-perf` | code + report |
| 6 Hardening | SEO-QA (metadata, sitemap, robots, JSON-LD, links, headings) | `v2-seo` | code + report |
| 7 Review | Cross-review temps on work they did not author | — | review reports |
| 8 QA | god final QA | — | executive report |

Phase 1 docs are decided before any parallel code. Workers do not invent colours, type, motion language, network primitives or copy tone outside DIRECTION / IA_AND_COPY.

## Decisions already fixed by god
- Four systems: **Acquire** (Performance Marketing) · **Sell** (Sales & BPO, commercial lead) · **Operate** (Customer Operations) · **Build** (Technology & Development, the infrastructure layer). IA-COPY may rename only with a stronger, documented reason.
- Routes (trailing slash, static): `/` `/services/` `/services/sales-bpo/` `/services/performance-marketing/` `/services/customer-operations/` `/services/technology/` `/work/` `/about/` `/contact/`. `/privacy/` `/terms/` only as drafts flagged for owner legal approval, unlinked and `noindex` until approved. No `/careers/` link unless real content exists.
- Content lives in typed TS modules under `content/` (single source). No CMS.
- Conversion: "Book a Growth Call" opens a short qualification flow on `/contact/`; submission goes through one adapter `lib/leads/` with provider config (default: prefilled mailto to `ahsan@growlatics.com`; slots for webhook URL and booking URL via `NEXT_PUBLIC_*` env). No vendor.
- Proof: `content/proof.ts` typed but empty; components render nothing when empty.
- Footer geography: "US / Pakistan business; serving US, UK, Pakistan and international clients". No branch addresses. Phone/email/socials from baseline stay.
- Static export, `trailingSlash: true`, images unoptimized stay. Remove the GitHub-Pages `basePath` branch in next.config only in FOUNDATION.
- Legacy components: inspect before deleting; delete only in the stream that replaces them, noting what was harvested.

## Creative + technical gates (from brief §30–31)
Reject any section that could live on a random agency site; reject sphere heroes, four-card grids, purposeless particles, metric counters, stock imagery, alternating image/text. Never merge just because it builds: check fit, duplication, bundle, animation lifecycle/cleanup, responsiveness, theme, static export, a11y, content accuracy.

## God decisions after Phase 1 review
- IA_AND_COPY.md accepted. Journey = **Attract → Qualify → Close → Retain → Scale** (content/journey.ts only). Hero H1 = "We build and operate the systems behind growth."
- OWNER-VERIFY claims (IA_AND_COPY §9.1): implement them, but every such string carries `verify: true` in content (or sits in a clearly marked block) so god can strip or confirm before publishing. Drop outright: Microsoft Ads, LinkedIn Ads, TikTok Ads, and the LinkedIn channel for outreach (say "cold outreach" without channel list). Contact success copy uses the fallback without a response time.
- DIRECTION.md accepted. Its {STAGE_1..5} placeholders = Attract, Qualify, Close, Retain, Scale.

## Phase 2 file ownership (no overlap)
- **FOUNDATION** (`v2-foundation`): `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `next.config.mjs`, `app/sitemap.ts`, `app/robots.ts`, route files for `/services/**`, `/work/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `app/not-found.tsx`, `content/**`, `lib/**`, `components/brand/**`, `components/patterns/**`, `components/layout/**`, `components/ui/**` EXCEPT `InteractiveCursor.tsx`, `context/**`. Keeps the current home sections rendering (migrated off deprecated tokens only as far as needed to build). Does not mount the system provider; god wires it at merge.
- **SYSTEM-3D** (`v2-system-3d`): `components/system/**`, `components/ui/InteractiveCursor.tsx`, and a lab route `app/lab/system/page.tsx` (`robots: noindex`, excluded from sitemap) to exercise every tier and act layout. Must not edit any other file.
- Shared contract: capability ids are `<system>.<capability>` (e.g. `sell.appointment-setting`), kebab-case from IA_AND_COPY §3. FOUNDATION exports `getLabel(key)` from `content/index.ts`; SYSTEM-3D may use a local fallback label map until integration. SYSTEM-3D exports `SystemProvider` and `useSystem` from `components/system/runtime/`.

## Integration state (god, after Phase 2)
- `v2` = d7b11a4 (SYSTEM-3D) + FOUNDATION merge + 809198e (SystemProvider mounted in layout, graph labels from `getLabel`, GlobalGrowthScene unmounted, archive copies excluded from tsc).
- Build/tsc/lint pass. `/` First Load 374 kB (legacy Hero field + ThreeGrowthWindow); internal pages 139–152 kB.
- SYSTEM-3D handover for HOME: one `<SystemStage mode="fixed" intro />`, sections `data-act="1".."9"` (act 4 may hold `data-journey-stage` children), tier 0 renders inline `<NetworkSVG act={n} hideWhenLive title=… />` per act, inline figures `<SystemStage act stage title />`, `setFocus()` / `useSystem()` hooks, `<SpatialLabel>` callouts. Read `components/system/lab/SystemLab.tsx` for working usage.
- Known gap: graph ids in `components/system/model/graph.ts` differ from `content/systems.ts` for acquire.paid-media, acquire.social-media, operate.customer-support, operate.call-support, build.product, build.integrations (they fall back to FALLBACK_LABELS). HOME reconciles: rename graph ids to content ids, delete FALLBACK_LABELS.

## Phase 3/4 file ownership (no overlap)
- **HOME** (`v2-home`): `app/page.tsx`, new `components/home/**`, `components/system/**`, `components/sections/**` and `components/three/**` (replace, harvest, then DELETE all legacy: Hero, HeroInteractiveField, ThreeGrowthWindow, ServicesSection, GlobalGrowthScene), the `home` export in `content/pages.ts`, `content/journey.ts`, `content/systems.ts` only where needed for graph-id reconciliation (no copy changes to service-page fields).
- **PAGES** (`v2-pages`): `app/services/**`, `app/about/**`, `app/contact/**`, `app/work/**`, `components/patterns/**`, `components/ui/**` except `InteractiveCursor.tsx`, new `components/pages/**`, every non-`home` export of `content/pages.ts`, `content/{faq,lead,proof,legal}.ts`, `lib/leads/**`.
- **Frozen (god only; ask via outbox)**: `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`, `components/{layout,brand}/**`, `lib/{seo,tokens,motion}.ts`, `content/{site,nav,types,index}.ts`, `next.config.mjs`, sitemap/robots. If you truly need a new token or type, message god with the exact diff; do not edit.
- HOME may import from `components/patterns/**` but must not edit it; PAGES may use `<SystemStage>` inline figures but must not edit `components/system/**`.

## Integration state (god, after Phase 3/4)
- `v2` = b96b0d2: PAGES 95fef8e + HOME be9b91b/57acf09 (god committed HOME's uncommitted files after its usage limit). Build/tsc/lint pass. First Load: / 163 kB, /services* 158–159, /about 158, /contact 150, /work 138. Legacy 3D deleted.
- Open defects carried into Phase 5: (1) React hydration error #418/#423 on / with prefers-reduced-motion at 1440 (likely useSystem/useReducedMotion SSR snapshot vs client). (2) Reveal hides SectionHeader/Ledger content until JS runs (no-JS and crawlers see nothing). (3) act-5 layout overlaps "Qualification"/"Outreach" labels on the Sell focus; dense Sell labels at 16:10. (4) Tier-0 SVG ignores setFocus. (5) Not yet verified: / at 390/768/1024, tier 2 WebGL, reduced-motion visuals. (6) Real-GPU fps unmeasured.

## Phase 5/6 file ownership (no overlap)
- **PERF-A11Y** (`v2-perf`): `components/**` except `components/{layout,brand}/**`, `app/page.tsx` (body, not metadata), `app/{services,about,contact,work}/**` (body, not metadata/JSON-LD), `app/globals.css` (bug fixes only, no new palette), `lib/motion.ts`, `context/**`.
- **SEO-QA** (`v2-seo`): `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, the metadata/JSON-LD in `app/layout.tsx` and the `metadata` / `generateMetadata` / JSON-LD `<script>` in each route file, `seo` fields and heading copy in `content/**`, `public/**` (OG image, favicon, manifest), `components/{layout,brand}/**` (nav/footer link + landmark fixes only). Heading-level fixes inside components: report to god, do not edit.

## Phase 7b fix pass (god, after reviews; v2 base = review-creative merge)
Inputs: `docs/v2/REVIEW_CREATIVE.md` (all P1 + P2 findings), `docs/v2/REVIEW_TECH.md` "left for god".
- **STORY** (`v2-story`): `components/system/**`, `components/home/**`, `app/page.tsx` body, `home`/`homeUi` exports in `content/pages.ts`. Fixes: idle vs lit palette in both themes (dormant→lit, fragmented→connected must read), distinct poses for acts 3/6/8, hero names the four systems with Sell dominant, hero fits 1440x900 with System index above the fold, phone act heading before figure, act 7 band ticks/labels, all spatial-label collisions (home, Tech hero, phones). May add new layout poses for internal page heroes (export them; PAGES-POLISH consumes).
- **POLISH** (`v2-polish`): `app/{services,about,work,contact}/**` body, `components/{pages,patterns,ui,brand}/**` (not InteractiveCursor), non-home exports in `content/pages.ts`, `content/systems.ts` (copy-length fixes only, ids frozen), `lib/{tokens,motion,utils}.ts`, `README.md`. Fixes: Sales & BPO structure (fewer stacked ledgers, DIRECTION 8.1 lanes + calendar node), BPO chip text, Work schematic labels, About/Services heroes not reusing the home overview figure (use distinct act/stage/focus props), stale README (Hostinger static, `npm run build` incl. postbuild, upload incl. `.htaccess`), dead lib/tokens (keep bgHex) and lib/motion damp, Mark.tsx on lib/motion hook, unused public/images/growlatics-logo.png, text-link class duplicated x7 → one utility.
