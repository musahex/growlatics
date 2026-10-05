# Growlatics v2 — Phase 7b fix pass: POLISH

Worker: worker-gl-polish (temp). Branch `v2-polish` from `v2` 8a8f659. Date 2026-10-06.
Scope (PLAN "Phase 7b fix pass"): `app/{services,about,work,contact}/**` body, `components/{pages,patterns,ui,brand}/**`, non-home `content/pages.ts`, `content/systems.ts` (copy length), `lib/{tokens,motion,utils}.ts`, `README.md`, `public/images/growlatics-logo.png`. No `components/system/**`, no home files, no frozen files.

## Gates (final commit)

`npm run build` (static export + postbuild) ✓ · `npx tsc --noEmit` ✓ · `npm run lint` ✓ · `node scripts/seo-crawl.mjs` 0 problems ✓ · `lib/leads` selfcheck ✓.

First Load JS, before (8a8f659) → after: `/` 164 → 163 kB · `/services` 159 → 158 · `/services/[slug]` 160 → 160 · `/about` 159 → 158 · `/work` 139 → 139 · `/contact` 151 → 151. No route grew.

Screenshots (headless Chromium, tier 2 at 1440, 390 touch, dark, plus 1440 light for Sales and About): `hive/agents/worker-gl-polish/screenshots/before/` and `.../after/`, named `<before|after>-<route>-<width>-<theme>[-partN].png`. 0 page errors on every load.

## Findings → result

| Finding (source) | Result | Commit |
|---|---|---|
| **#5 Sales & BPO is five ledgers in a row** (REVIEW_CREATIVE P2, commercial priority) | **Fixed.** Hero handoff strip is now inbound + outbound lanes → Sell → *Your calendar* / Operate, Build underneath (DIRECTION §8.1). The 13-row schematic is 4 group nodes (Pipeline generation, Conversion, Sales operations, BPO) with their capabilities as sub-tags; the ledger above keeps the descriptions, chips removed (the schematic carries them). "How it works with your team" is a handoff strip (*Your CRM ↔ Our team ↔ Your closers*) plus a 4-step signal rail. Ways to engage, Connected systems and FAQ put the heading beside the list (lg) with `py-section-tight`. Page 8675 → 7531 px at 1440. | d585572 |
| **#5 Sales hero canvas** (lanes + calendar node in the 3D figure) | **Not fixed (needs a new pose).** The canvas still uses act 5 with Sell focus; the lanes and calendar handoff are carried by the DOM strip under the hero. A dedicated pose is STORY's (`components/system/**`). | — |
| **#6 BPO chip repeats the description** | **Fixed.** `sell.bpo` label → "Back-office execution" (`verify: true` kept); the scope sentence stays in the page ledger. The one-capability BPO group shows that label as its sub-tag. | 8b0366a, d585572 |
| **Services hero reuses the home overview figure** (Routes: /services/) | **Fixed.** Hero uses act 5 (top-down ring, Sell at 12 o'clock and larger) instead of act 3; accessible title updated. | 2b7a2fb |
| **Services "How the systems map to the journey" is a plain rail** | **Fixed.** New `OwnershipLanes` pattern draws one lane per system across the five stages from `content/journey.ts` (lit span + nodes for owned stages, Build as a dashed base under all). | 2b7a2fb |
| **"Not a call center" in four places** (P3) | **Partly fixed.** Removed from `/services/`. Remaining: Sales hero lead, Sales FAQ, home inspector (home is STORY's). | 2b7a2fb |
| **About hero reuses the home overview; second half text-only** (Routes: /about/) | **Fixed.** Hero keeps only the handoff strip. "International by design" gets the act-7 market band (US, UK, Pakistan) as About's one network figure, framed 4:1. "Systems beat services." is a P4 Statement above the remaining beliefs. Text-only sections use `py-section-tight`. | dd1e933, ef373b0 |
| **Work schematic says "Receives from / Runs", no outputs** (Routes: /work/) | **Fixed.** Own labels (Systems → What we measure → Reported as) and an outputs column (Agreed baselines, Whole-system report; `verify: true`, restates the "How we report" body). | c711af7 |
| **Contact form card: ~150 px empty under Continue** (P3) | **Fixed.** Grid `lg:items-start`; the card hugs its step. | 5ad4774 |
| **Uniform section padding on internal pages** (Typography/spacing) | **Fixed on POLISH pages:** tight spacing for short/text-only and consecutive reference sections (service problem/engage/connected/FAQ, services FAQ, about why/who, work report). | d585572, 2b7a2fb, dd1e933, c711af7 |
| README stale (REVIEW_TECH) | **Fixed.** Rewritten: Hostinger static export, `npm run build` incl. postbuild, seo-crawl, upload `out/` contents incl. `.htaccess`, env vars are build-time, legacy GH Pages workflow manual-only. | 6181486 |
| `lib/tokens.ts` mostly dead (REVIEW_TECH) | **Fixed.** Reduced to `bgHex`. | 135ae65 |
| `lib/motion` `damp`/`dampK` unused (REVIEW_TECH) | **Fixed.** Deleted; scheduler keeps its copy. | b3be2af |
| `Mark.tsx` uses framer `useReducedMotion` (REVIEW_TECH) | **Fixed.** Uses the hydration-safe hook from `lib/motion`. | 8b4fe25 |
| `public/images/growlatics-logo.png` unused (REVIEW_TECH) | **Fixed.** Deleted (no reference in `v2` or `main`). Risk: an old external email/social card hot-linking the URL would 404. | 119e213 |
| Text-link class copied ×7 (REVIEW_TECH) | **Fixed in POLISH files** (about, work, services, service page): all use `<Button variant="text" arrow>`. **Left:** `components/home/acts.tsx` `MoreLink` (STORY's file; same one-line swap). `QualificationFlow` "Edit" button is a different control and stays. | cce3f85 |

## Not in POLISH scope (left for STORY / god)

- #7 spatial-label collisions on the Technology / Sales / Performance hero clusters, #9 act-7 band ticks and label offsets (visible in About's band too), Technology hero "shown from below": all `components/system/**`.
- Home acts, hero, palette (#1–#4, #8, #10).
