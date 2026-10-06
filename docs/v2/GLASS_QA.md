# Growlatics v2 — Phase 9c GLASS-QA

Worker: worker-gl-glass-qa (temp). Branch `v2-glass-qa` from v2 `cecfaf8`. Date 2026-10-06. Not pushed, not deployed.
"Before" = v2 `cecfaf8` (glass pass merged). "FINAL_QA" = the pre-glass phase 8 numbers (`docs/v2/FINAL_QA.md`).
Rig: playwright-core + Chromium 1228 (Metal GPU, Apple M5, 120 Hz), Lighthouse 13 and axe-core, in a scratch folder (not the repo). Screenshots (not in git): `/Users/moses/HarnessAgents/hive/agents/worker-gl-glass-qa/screenshots/`.

## 1. Gate table

| Gate | Before (`cecfaf8`) | After (branch head) | vs FINAL_QA |
|---|---|---|---|
| `npm run build` | pass | **pass** | — |
| First Load JS | / 165 · /services 160 · /services/[slug] 161 · /contact 152 · /work 139 · /about 138 | **same** (no route grew) | / +1, /services +1, /contact +1 (glass pass, 9b) |
| `tsc --noEmit` / `next lint` | pass / pass | **pass / pass** | — |
| `scripts/seo-crawl.mjs` | 0 problems | **0 problems**, sitemap 9, click depth ≤ 1 | same |
| `lib/leads` selfcheck | ok | **ok** | same |
| Export | `.htaccess`, 404, no lab | **same**; privacy/terms `noindex` | same |
| Scroll frames, 1440 tier-2 home, CPU 4×, M5 GPU (p50 / p95 / p99 ms) | glass 8.3 / 10.1 / 10.3 · no backdrop-filter 8.3 / 10.1 / 10.3 | **8.3 / 10.1 / 10.3**, 0 frames > 33 ms, flat mode never triggers | — |
| Same, software GPU (SwiftShader: worst-case proxy for a weak GPU) | glass **42.0 / 182.5 / 241.3** (539 frames > 33 ms) · no backdrop-filter 15.7 / 49.8 / 118.4 | **15.6 / 65.0 / 149.8** (71 frames > 33 ms): flat glass kicks in after 90 slow frames | — |
| Lighthouse mobile `/` (perf/a11y/bp · LCP · TBT · CLS) | 94/100/100 · 3.05 s · 0 · 0 | **94/100/100 · 3.02 s · 2 · 0** | 95 · 2.86 s (see 4.2) |
| Lighthouse mobile `/services/sales-bpo/` | 96/100/100 · 2.70 s · 0 · 0 | **96/100/100 · 2.71 s · 0 · 0** | same |
| Lighthouse mobile `/contact/` | 97/100/100 · 2.55 s · 0 · 0 | **97/100/100 · 2.55 s · 0 · 0** | same |
| Lighthouse desktop `/`, sales-bpo, contact | 100/100/100 · 0.62 / 0.57 / 0.53 s | **100/100/100 · 0.61 / 0.57 / 0.53 s**, TBT 0, CLS 0 | same |
| axe-core (WCAG 2 A/AA + best practice) | — | **0 violations, 0 page errors on 72 runs**: 12 routes (9 indexable + privacy, terms, 404) × dark/light × 390/820/1440 | FINAL_QA: 48 runs (390/1440) |
| Keyboard | Services: Escape **dropped focus to `<body>`** | **pass** (2.2) | — |
| Reduced motion (1440, 390, both themes) | — | **pass**: no canvas (tier 0 SVG), header transform `none`, 9 acts, no overflow, 0 errors | same |
| Touch 1024 (landscape 1024×768, portrait 1024×1366) | — | **pass**: tier 1 (one Canvas2D, no WebGL, no three chunk), 0 errors, no overflow | same |
| Light theme header over dark sections | ivory bar reads **grey** over act 4, act 9, footer | **dark glass** there (2.1) | — |

Frame test: 160 wheel steps down then 160 up over acts 1–5, rAF intervals, 3 interleaved runs, median of each statistic. Lighthouse: simulated throttling, local gzip static server (as Hostinger serves). axe runs with reduced motion so every reveal has settled.

## 2. Fixes (one commit each)

| # | Problem | Fix | Commit |
|---|---|---|---|
| 1 | **Blur cost on weak GPUs.** On the software-GPU proxy any one backdrop-filter over the WebGL stage doubles frame time (header alone: p50 15.7 → 33.6 ms; all glass 42 ms). The System index is not the cost (turning only it off: 42.2 ms); blur radius is not either (8 px: 49.7 ms). So a smaller blur is not a cheaper equivalent; no blur is. | The stage's existing frame-time governor (`SceneEnvironment`, mean > 20 ms over 90 frames) now first sets `html[data-glass="flat"]`, then steps DPR as before. Flat glass keeps tint, edge, top highlight, sheen and shadow, drops the blur and goes near-opaque (`--glass-a-solid`, the same look as browsers without backdrop-filter). `[class*='glass']` also catches `lg:glass`. Session-sticky. The M5 never triggers it. | `35dadf6` |
| 2 | **Light theme: ivory header reads grey** over home act 4, act 9 and the footer (all `data-surface="dark"`). | One IntersectionObserver on a 1 px band at the bar's centre line; while a dark-surface section is under it the header gets `data-surface="dark"`, so material and text tokens flip together. No scroll listener; re-armed on resize and route change; no visible change in the dark theme. Shots: `after-hdr-act4-1440-light.png` vs `before-hdr-act4-1440-light.png`. | `3706a97` |
| 2b | Found while checking 2: the open mobile menu's scrim (`bg-bg/50`, outside the bar) still washed a dark section grey. | The surface flag sits on `<header>`, so the scrim flips too. `after-menu-act4-390-light.png`, `-820-`. | `0bf8b18` |
| 3 | **Keyboard: Escape inside the Services dropdown** hid the panel holding focus; focus fell to `<body>`. | Escape closes and returns focus to the chevron toggle. | `f26d869` |

Bundle effect: none visible (/ stays 165 kB; the observer is in the shared header).

## 3. GLASS_BRIEF §13 no-regression list

| Item | Result | How checked |
|---|---|---|
| Nine-act story | pass | 9 `[data-act]` on every tier |
| Disconnected → connected network; distinct views per act | pass | no change to `components/system/**` poses; tier shots (`tier-*.png`) |
| Neutral idle / orange active | pass | idle nodes neutral, orange only on lit nodes, CTA and active nav dot in every shot; glass idle stays neutral (no new `glass-signal`) |
| Sales & BPO emphasis and improved page | pass | Lighthouse 96/100/100 mobile, 100 desktop; axe clean 6 runs |
| Responsive ordering | pass | no layout edits; 390/820/1440 axe, no horizontal overflow at 390/1024/1440 |
| Reduced-motion fallback | pass | tier 0, no canvas, static header, mobile menu fades |
| Code splitting | pass | three/R3F chunk requested only at tier 2 (21 JS files vs 19 touch, 18 reduced) |
| Mobile/touch gating | pass | touch 1024 → Canvas2D, no WebGL context |
| Per-route JS budgets | pass | / 165, others ≤ 161 kB, unchanged |
| a11y (Lighthouse 100, axe 0) | pass | a11y 100 on all 6 Lighthouse runs; axe 0 on 72 |
| SEO infrastructure, crawl cleanliness | pass | seo-crawl 0 problems |
| Static Hostinger compatibility, custom 404 | pass | `out/.htaccess`, `404.html`, no `out/lab` |
| v1 stats removed | pass | no content files touched |
| Contact freeze fix | pass | keyboard-only run through all 5 steps at 1440 and 390 ends on "One last step: send the email" with focus on its heading, 0 errors |

## 4. Still open

1. **Real devices.** All frame numbers are an M5 and a software-GPU proxy. Before launch, check a 2020 MacBook Air, an iPad and a mid-range Android. On any of them, `document.documentElement.dataset.glass` in the console shows whether flat mode kicked in.
2. **Home mobile Lighthouse 95 → 94** (LCP 2.86 → ~3.0 s) since FINAL_QA. Already at `cecfaf8`, untouched by these fixes. The LCP element is still the hero paragraph (render delay ~50 ms); the simulated time comes from the glass pass's extra CSS/DOM. Within the run-to-run noise seen in phase 5 (2.64–3.0 s).
3. **Header material switch is instant**, at the moment a dark section's edge crosses the bar's centre line. It reads as the bar meeting a new surface; a cross-fade would need two material layers (cost) and was not added.
4. **Touch 1024 landscape (tier 1):** two Build nodes sit just under the top-right edge of the System index (`tier-touch-1024-landscape.png`). Legible, pre-existing pose; fix in `layouts.ts` act 1 if wanted.
5. **Act 4 at 1440:** consecutive stage cards (`lg:glass`) are ~880 px apart, so the bottom of one and the top of the next can share a 900 px viewport: header + 2 blurs for a moment, one over the budget in GLASS_SYSTEM rule 2. Measured cost on the M5: none; weak GPUs get flat mode.
6. Carried, unchanged: the items in FINAL_QA §3 and GLASS_PAGES "For 9c" (act 5 trigger rows height).
