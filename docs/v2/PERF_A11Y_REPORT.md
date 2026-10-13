# Growlatics v2 — Phase 5 PERF-A11Y report

Branch `v2-perf` from `v2` 6816dca. Worker: worker-gl-perf (temp). Date 2026-10-06.
Gates: `npm run build` (static export), `npx tsc --noEmit` and `npm run lint` pass on the final commit.

## 1. The six carried defects

| # | Defect | Status | Fix |
|---|---|---|---|
| 1 | React #418/#423 on `/` with reduced motion | **Fixed** (merge blocker cleared) | framer-motion's `useReducedMotion` reads `matchMedia` on the first client render (server: `null`), so `TraceLanes` rendered a different tree. `lib/motion.ts` now exports a `useReducedMotion` built on `useSyncExternalStore` with a `false` server snapshot; Reveal, Inspector, SystemSchematic and TraceLanes use it. Reduced variants also settle correctly when they replace the full ones after mount. Verified: 0 page errors on 7 routes × 390/768/1024/1440, both themes, reduced motion and touch. |
| 2 | Reveal hides content without JS | **Fixed** | Reveal elements carry `data-reveal`; `@media (scripting: none)` in `globals.css` forces them visible. Measured with JS disabled: 0 hidden reveals on every route (e.g. `/` 0/42, `/services/sales-bpo/` 0/54). Page H1 headers also no longer depend on JS (see 3.3). |
| 3 | Act-5 label overlap (Qualification / Outreach), dense Sell labels | **Fixed** | New `components/system/model/place.ts`: greedy placement (right, left, below, above; keeps the last slot so live labels do not flicker; stays inside the figure). Used by the live `SpatialLabelLayer` and the tier-0 `NetworkSVG`. Act-5 ring moved right of the text column and the Sell cluster widened slightly. |
| 4 | Tier-0 SVG ignores `setFocus` | **Fixed** | `NetworkSVG` applies the live renderer's rule (focused system lit and labelled, others at 0.4). `FocusInAct` now observes its own act section (viewport middle), so the inspector focus works on every tier; the store's act index only moves while a live fixed stage runs. |
| 5 | `/` not verified at 390/768/1024, tier 2, reduced-motion visuals | **Verified** | Contact sheets below. Tier 2 (WebGL) at ≥1024 with a fine pointer; tier 1 (Canvas2D) on touch at 1024 and 1366; tier 0 (SVG) under reduced motion. All 5 journey stages reachable with reduced motion. No horizontal overflow at any width. |
| 6 | Real-GPU fps unmeasured | **Not measured** | Only headless SwiftShader (software GL) is available here; its frame times say nothing about a MacBook Air or iPad. Still open, see risks. |

## 2. Other defects found and fixed

- **Primary button contrast (site-wide colour bug).** `cn()` uses tailwind-merge, which did not know the custom type scale, so `text-body-s` / `text-display-*` counted as text colours and **dropped the real colour class**: `cn('text-on-signal', 'text-body-s')` → `text-body-s`. Primary buttons rendered #f4f1ec on #d2401a (4.15:1, fails AA). `lib/utils.ts` registers the scale with `extendTailwindMerge`; buttons are white again (4.7:1). The same bug silently removed `text-text` from every SectionHeader heading (they inherited a similar colour, so it was not visible). `lib/utils.ts` is not in any stream's ownership list; flagged for god.
- **Home desktop CLS 0.113 → 0.** `ActFigure` server-rendered the phone figure and swapped to the desktop layout after hydration, shifting the hero. The static HTML now carries both variants and CSS shows one; after hydration only the matching one stays. Side benefit: no-JS desktop gets the desktop composition.
- **Adaptive DPR raised the resolution.** On a 1× screen the "drop" step went to 1.25 (canvas 1800×1125 at 1440×900). It now steps only to a value strictly below the current DPR.
- **Scheduler never stopped on home.** Label overlays registered their own always-on scheduler tasks. They now run inside their stage's frame task (`StageCtx.overlays`), the fixed stage pauses when its acts wrapper leaves the viewport, and the stage controller starts and stops with it.
- **Second window scroll listener.** R3F's `react-use-measure` adds a capturing `scroll` listener; `resize={{ scroll: false }}` removes it (R3F pointer events are off). Window now has exactly 1 `scroll` and 1 `pointermove` listener.
- **Phone label clipping.** Labels near a figure edge were cut off; placement now stays inside the figure.

## 3. Numbers

### 3.1 First Load JS (`next build`)

| Route | before | after |
|---|---|---|
| `/` | 163 kB | 164 kB |
| `/services/[slug]` | 159 | 160 |
| `/services`, `/about` | 158 | 159 |
| `/contact` | 150 | 151 |
| `/work` | 138 | 139 |

+1 kB is the tailwind-merge config. Every route is ≤ 200 kB. three/R3F stay in the dynamic tier-2 chunk.

### 3.2 Lighthouse (local, gzip static server, Lighthouse CLI 12, simulated throttling)

Perf / Accessibility / Best practices, LCP, CLS. Before = `v2` 6816dca build, after = final `v2-perf`.

| Route | Mobile before | Mobile after | Desktop before | Desktop after |
|---|---|---|---|---|
| `/` | 97/96/100 · 2.64s · 0 | 96/**100**/100 · 2.75s · 0 | 97/96/100 · 0.57s · **0.113** | **100/100**/100 · 0.61s · **0** |
| `/services/` | 93/96/100 · 3.16s | **96/100**/100 · **2.71s** | 99/96/100 · 0.94s | **100/100**/100 · **0.57s** |
| `/services/sales-bpo/` | 93/96/100 · 3.17s | **96/100**/100 · **2.70s** | 99/96/100 · 0.98s | **100/100**/100 · **0.57s** |
| `/about/` | 95/100/100 · 3.01s | **96**/100/100 · **2.72s** | 99/96/100 · 0.90s | **100/100**/100 · **0.53s** |
| `/contact/` | 95/96/100 · 2.86s | **98/100**/100 · **2.41s** | 100/96/100 · 0.65s | 100/**100**/100 · 0.53s |

TBT 0–3 ms everywhere. Home mobile LCP is within run-to-run noise (its LCP is the hero paragraph, never hidden). Without compression (Python `http.server`) mobile LCP reads ~6 s on every route: that measures the dev server, not the site; Hostinger serves gzip/brotli.

### 3.3 What moved LCP on internal pages
Page H1 headers (`SectionHeader as="h1"`) waited for hydration and then `whileInView`. They now use `Reveal load`: the same R1 rise as a CSS animation on first paint (fade only under reduced motion). Element render delay fell from ~700 ms to under 50 ms.

## 4. Verification matrix (all passed)

- Routes `/`, `/services/`, 4 service pages, `/work/`, `/about/`, `/contact/` at 390, 768, 1024 and 1440, dark and light: no page errors, no horizontal overflow.
- Reduced motion (390, 1440), touch (390, 1024): no errors; touch gets tier 1, no WebGL.
- axe-core (WCAG 2 A/AA plus best practice) on 6 routes × 2 themes × 2 widths: **0 violations**.
- Keyboard: skip link first, logical order through header, hero, system index, inspector (arrow keys too), CTAs and footer; every stop shows a visible focus ring. Contact flow inputs reachable in order.
- Lifecycle on `/` at 1440: one rAF loop (the scheduler); 0 rAF calls while the tab is hidden; framer's loop only runs during reveals; 1 WebGL context on home, 1 on an internal page, 0 on touch or reduced motion; the home canvas is released on client navigation.
- DPR: WebGL starts at `min(dpr, 1.5)` and only steps down; Canvas2D `min(dpr, 2)`.

## 5. Deliberately not done

- No copy, metadata, JSON-LD or `components/{layout,brand}` edits (SEO-QA scope). `components/brand/Mark.tsx` still uses framer's `useReducedMotion`; it only changes a variant (a style difference, not a tree difference), so it does not throw #418. SEO-QA or god may switch it to `useReducedMotion` from `lib/motion`.
- No redesign of act layouts beyond moving the act-5 ring. Act 7's 24-hour band runs behind the copy at 1024 (see risks).
- `@react-three/drei` is no longer imported anywhere; I did not edit `package.json` (not in my file list). Removing it changes no bundle, only install size.
- No new runtime dependency. Test tooling (playwright-core, Lighthouse) lived in a scratch folder, not the repo.

## 6. Open risks

1. Real-GPU frame rate is still unmeasured (needs a 2020 MacBook Air, an iPad and a mid-range Android, per DIRECTION §10.2).
2. Act 7 at 1024–1280 px: the market band and its labels pass behind the paragraph copy. It is legible but busy; a layout tweak in `layouts.ts` act7 would fix it.
3. Tier-0 journey figures use the default camera, not the live camera's zoom on the active stage, so on desktop with reduced motion some cluster labels sit behind the stage panel. All five stages and their copy are complete; this is polish.
4. The static HTML for `/` grew from 230 kB to 353 kB uncompressed (37 → 51 kB gzip) because the nine act figures now ship in both desktop and phone variants until hydration (the CLS / no-JS fix). Lighthouse did not move. If it matters, dual-render only act 1 (the above-the-fold CLS culprit) in `ActFigure`.
5. `lib/utils.ts` was outside every ownership list; the fix is one config call, flagged for god's review.

## 7. Evidence

Screenshots, Lighthouse JSON and the test scripts: `/Users/moses/HarnessAgents/hive/agents/worker-gl-perf/screenshots/` (`home-sheet-390|768|1024.png`, `home-sheet-1440-rm.png`, `home-sheet-1440-light.png`, `act5-1440.png`, `act5-1440-rm.png`, `act4-1440.png`, `act4-touch-1024.png`, `lighthouse/gz-{before,after,after2}-*.json`, `tools/*.mjs`). `gz-after2-*` is the final build; `gz-after-*` is an intermediate build.
