# Phase 9b GLASS-PAGES: what got glass, what did not, and why

Branch `v2-glass-pages` from v2 `e4bc99b`. Variants from `docs/v2/GLASS_SYSTEM.md` only; no new tokens.
One local helper, `components/patterns/glass.ts`: `flat` / `flatBelowLg` switch backdrop-filter off for surfaces over static content (same tint, edge, highlight, sheen and shadow). Blur is kept only where a surface sits over the moving WebGL stage at lg+.

**Blur budget per viewport (lg+):** header + at most one. Hero: header + System index. Act 4: header + one stage card. Act 5: header + inspector panel. Every other glass surface is flat.

## Home (`/`)

| Act | Glass | Not glass, and why |
|---|---|---|
| 1 Hero | **System index = ELEVATED glass** (strongest after the header), blur at lg over the stage, flat below lg. Rows became inner liquid wells; Sell keeps its signal hairline. Eyebrow now clears the bar (carry-over 3). | H1, lead, CTAs: typography stays on the scene. |
| 2 Problem | **Leak callouts = small flat-glass chips**, placed every frame with the shared `model/place.ts` rule, clear of lit nodes and of each other; a chip with no free slot hides (carry-over 4). | Ledger list: content, stays hairline. |
| 3 Connection | none | The network pose is the content; adding panels would compete with it. |
| 4 Journey | Stage card (existing `lg:glass`) now uses the system radius `rounded-liquid`. One card per viewport. | Owner chips stay plain. |
| 5 Capabilities | **Inspector detail panel = BASE glass** (md+; blur at lg, flat at md). | Triggers stay hairline rows (no glass list); open state stays the signal bar + `aria-expanded`. |
| 6 Why | none | Trace figure is a diagram on a clean field. |
| 7 Global | none | The band is the figure; keep the large clean space. |
| 8 Work | none | Proof wrapper now renders nothing while proof is empty (carry-over 2). |
| 9 CTA | none | The convergence mark and CTA own this act. |

## Services
- `/services/` and every service hero: the **HandoffStrip** (`glass` prop) is a flat BASE surface; the current system is a flat **SIGNAL** inner well (the only orange glass, paired with `aria-current`).
- **Sales & BPO** (operational infrastructure): hero strip = inbound/outbound lanes → Sell → calendar/Operate; "How it works" strip = Your CRM ↔ our team ↔ your closers (CRM connection + workflow) on glass; the capabilities schematic (operational modules) sits on one flat glass surface.
- Technology / Customer Operations / Performance Marketing: the hero strip only (Technology: Build as the base layer feeding Acquire, Sell, Operate). No glass card grids, no dashboards, no data. The systems list on `/services/` stays editorial.

## Contact
Qualification flow shell = flat BASE glass (contact page has no WebGL, so no blur). Choices keep the existing signal-soft selected state (with the checked input). Direct contacts aside stays plain. Carry-over 1: the booking link (`NEXT_PUBLIC_BOOKING_URL`, when set) now shows after a mailto hand-off too, still never on an error.

## About, Work, legal, 404
- About: no glass (restrained, editorial). Its HandoffStrip keeps the hairline style.
- Work: no glass; proof slots stay dormant and render nothing.
- Privacy/Terms/404: only the header-clear top padding (carry-over 3).

## Header (carry-over 5)
`Header.tsx`, one line: the bar's icon CTA is `invisible` while the mobile menu is open (the panel has the full CTA). Verified in `menu-390-*.png`.

## Checks
- `npm run build`, `tsc --noEmit`, `next lint`: pass. `node scripts/seo-crawl.mjs`: 0 problems.
- First Load JS (before → after): / 164 → 165 kB, /contact 151 → 152, /services 159 → 160, /services/[slug] 161 → 161, /about 138 → 138, /work 139 → 139. No route grows > 3 kB.
- axe-core: 0 violations on /, /services/, all four service pages, /contact/, /about/, /work/, /privacy/, /404.html at 1440 and 390, dark and light.
- 0 page errors in all screenshot loads.

## Screenshots (not in git)
Before (v2 `e4bc99b`): `/Users/moses/HarnessAgents/hive/agents/worker-gl-glass-pages/screenshots/before/`. After: `/Users/moses/HarnessAgents/hive/agents/worker-gl-glass-pages/screenshots/after/`. Names: `<shot>-<width>-<theme>.png`.
Shots: hero (1440, 390, 820 dark+light), act2, act4, act5, act9, sales-bpo (1440, 390, 820), sales-bpo-how, contact (1440, 390, 820), services, technology, customer-operations, performance-marketing, about, work, menu (390 open).

## For 9c
- Not measured: frame cost of the System index blur over the live stage on mid-range phones/GPUs (desktop only gets blur; phones get flat glass).
- Light theme, act 4 (`data-surface="dark"` journey): the ivory header over a black section reads grey (see `act4-1440-light.png`); a header/9a concern, untouched here.
- Act 5 inspector trigger rows stay as tall as the panel (pre-existing grid behaviour, now slightly taller with panel padding).
