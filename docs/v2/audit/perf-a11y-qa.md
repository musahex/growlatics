# Growlatics v2 prelaunch audit: performance, accessibility, QA, 3D/glass, component matrix

Stream: gl-audit-qa (temp). Branch `v2-audit-qa` from `v2` 51da8b9. Date 2026-10-09.
Brief sections covered: 4 (component matrix), 5.5 (Core Web Vitals), 6 (assets, 3D), 17 (accessibility), 18 (component cards), 19 (preserve), 20 (test matrix).
Owned files: `components/system/**`, `components/ui/**`, `components/layout/**`, `app/globals.css`, `tailwind.config.ts`. Anything else is a recommendation with file:line.

Labels used on every check: **SRC** source inspection · **LOCAL** local production export (`out/`) · **PREVIEW** public preview https://musahex.github.io/growlatics/ · **PROD** production-only (cannot be tested before launch).
Device labels: every run is **simulated** (headless Google Chrome 154 via playwright-core, viewport + touch emulation, Lighthouse simulated throttling). **No real-device run was done.** SwiftShader (software GL) stands in for a GPU.

## 1. Summary

| Area | Result | P0 | P1 | P2 | P3 |
|---|---|---|---|---|---|
| Performance (lab) | PASS desktop (100 on every route); interaction latency PERF-04 pending; mobile LCP 2.50–3.02 s simulated (1.55–2.03 s with applied throttling) | 0 | 0 | 2 | 1 |
| Core Web Vitals (field) | PENDING VERIFICATION: no CrUX field data before launch | – | – | – | – |
| Accessibility | PASS: axe 0 violations on 96 runs, keyboard/reflow/zoom/reduced motion pass | 0 | 0 | 0 | 2 |
| 3D / glass lifecycle | PASS after fix (context-loss fallback added) | 0 | 0 | 1 fixed | 1 |
| Cross-browser | Chromium PASS; WebKit, Firefox NOT RUN (not installed) | 0 | 1 | 0 | 0 |
| Assets | PASS (no raster content images; fonts swap; OG 1200×630) | 0 | 0 | 0 | 2 |
| Console errors | PASS (0 errors except the expected 404 document status on the 404 route) | 0 | 0 | 0 | 0 |

No P0. One code fix shipped (PERF-01). Nothing in the accepted visual design changed.


## 2. Issue register

| ID | Pri | Route / component | Issue and evidence | Status | Fix | Auto-fixable | Fixed | Re-test |
|---|---|---|---|---|---|---|---|---|
| PERF-01 | P2 | `/` ≥1024 fine pointer (tier 2) · `components/system/render-gl/NetworkScene.tsx` | **WebGL context loss had no fallback.** LOCAL: `WEBGL_lose_context.loseContext()` on the home canvas → network disappears, the DOM labels (ACQUIRE / SELL / OPERATE / BUILD) float over empty space (`growlatics-audit/gl-during-loss.png`). It only came back because the test called `restoreContext()`; a real GPU reset or driver crash may never restore. 0 console errors, text unaffected. | FAIL → PASS | `onCreated` listener: on `webglcontextlost`, if no `webglcontextrestored` within 2 s, `setTierOverride(1)` drops the stage to the Canvas2D tier (same story, no WebGL). Restore within 2 s cancels it. | yes | yes | §5.3 |
| PERF-02 | P2 | all routes, mobile | **Lab mobile LCP 2.7–3.0 s (target ≤ 2.5 s) under Lighthouse simulated slow 4G + 4× CPU.** LOCAL gzip server, clean runs: `/` 3.02 s (LCP = hero paragraph), service routes 2.71 s (LCP = hero "Book a Growth Call" button). Observed (unthrottled) LCP is 45–69 ms and element render delay 42–68 ms, so the estimate is driven by the network model of ~165 kB first-load JS + 47 kB CSS + one preloaded font, not by a hidden or late element. Cross-check with **applied** (DevTools) throttling instead of the simulated model: `/` mobile LCP **1.55 s**, `/services/sales-bpo/` **2.03 s**, both PASS. Field LCP: PENDING VERIFICATION (CrUX after launch). | PENDING VERIFICATION | Not fixable inside my files without a redesign. Recommendation: after launch read CrUX / Search Console CWV; if field LCP p75 > 2.5 s, cut shared JS (`framer-motion` is in the shared 53.6 kB chunk `e22a3a9a…`; `components/ui/Reveal.tsx` and `lib/motion.ts` could move first-paint reveals to CSS only). | no | no | – |
| PERF-03 | P3 | `/` 1440 (tier 2, SwiftShader) | **4× CPU throttle while scrolling through acts 1–9 (12 s):** frame p50 16.7 ms, p90 66.7 ms, p99 133 ms, 56 of 398 frames > 50 ms; the flat-glass fallback switched on (`data-glass=flat`) as designed. 1× CPU: p50 16.7, p90 16.8, p99 50.0, 4 frames > 50 ms. Software GL on an M-series CPU says nothing about a real mid-range GPU. | PENDING VERIFICATION | Real-device run (GLASS_HANDOFF §17): MacBook Air, iPad, mid-range Android. | – | – | – |
| PERF-04 | P2 | `/` tier 2 · theme toggle, dropdown | **Lab interaction latency over 200 ms on home with software WebGL** (§3.5): theme toggle 544 ms, dropdown up to 296 ms; input delay ≤ 29 ms and handler ≤ 12 ms, so it is frame presentation, not JavaScript. Without WebGL the same interactions take 80–184 ms. | PENDING VERIFICATION | Field INP after launch (CrUX / Search Console). If p75 > 200 ms on desktop: skip the root view transition when `sys.live` (tier 2 running), or pause the stage task for one frame during the transition (`components/ui/ThemeToggle.tsx`, `context/ThemeContext.tsx`). Not changed now: no evidence on real hardware, and the transition is part of the accepted design. | yes | no | real device |
| QA-01 | P1 | all routes | **WebKit (Safari) and Firefox not run.** `~/Library/Caches/ms-playwright` holds only chromium-1217/1228 and headless shells; no webkit or firefox build, and installing needs network + a browser download outside this task. Safari is the riskiest engine for this site (backdrop-filter with `-webkit-` prefix, `corner-shape` fallback, scroll-driven header timeline `@supports (animation-timeline: scroll())`, WebGL2 in iOS). | NOT RUN | Owner/real-device QA on Safari macOS + iOS before launch; or `npx playwright install webkit firefox` on a machine with network and re-run `axe.mjs` / `kb.mjs` from this report. | – | – | – |
| QA-02 | P3 | `/nope-404/` (404) | Console shows "Failed to load resource: 404" on the 404 route. This is the document's own 404 status, which is correct (soft-404 avoided). | PASS (expected) | none | – | – | – |
| A11Y-01 | P3 | `/services/customer-operations/` 1440 dark | axe once reported 4 `color-contrast` nodes (`.pl-10 … > .text-text-3`) mid-reveal; 3 targeted re-runs at 0.4 / 1.9 / 3.4 s settle time: 0 violations. Measurement artefact of an opacity animation in progress, not a colour defect. | PASS | none | – | – | – |
| A11Y-02 | P3 | site-wide · `app/globals.css` | No `prefers-reduced-transparency` or `forced-colors` handling for glass surfaces. SRC only; under Windows High Contrast the glass background is replaced by the system colour (readable) but the solid primary button has no border, so its outline relies on the forced-colour button style. Not tested (Chromium emulation only, no Windows). | PENDING VERIFICATION | Optional after launch: `@media (prefers-reduced-transparency: reduce) { [class*=glass] { backdrop-filter:none } }` reusing the existing flat-glass rule; `@media (forced-colors: active) { .bg-signal { border:1px solid ButtonText } }`. | yes | no (not a verified defect) | – |
| A11Y-03 | P3 | `components/layout/Footer.tsx:30-34` | Social links open a new tab (`target=_blank`) with no "opens in new tab" cue (WCAG 3.2.5 is AAA; advisory). Names include visible text ("Growlatics on LinkedIn" ⊃ "LinkedIn"), so 2.5.3 passes. | PASS (advisory) | Optional sr-only "(opens in new tab)". | yes | no | – |
| ASSET-01 | P3 | `public/.htaccess` (not owned) | `.htaccess` only sets `ErrorDocument 404`. No `Cache-Control`/`Expires` for `/_next/static/*` (content-hashed, safe for 1 year) and no explicit compression. Hostinger LiteSpeed usually compresses by default; unverified. | PENDING VERIFICATION (PROD) | Recommend to tech stream: `<IfModule mod_expires.c>` 1-year immutable on `/_next/static/`, `no-cache` on HTML; verify `content-encoding: br|gzip` with `curl -sI -H 'Accept-Encoding: br,gzip' https://growlatics.us/` after deploy. | yes | no (not my file) | PROD |
| ASSET-02 | P3 | `/` static HTML | `index.html` is 363 kB raw / 52 kB gzip because every act figure ships desktop + phone SVG variants until hydration (PERF_A11Y_REPORT risk 4, a deliberate CLS fix). No Lighthouse cost measured (TBT ≤ 2 ms, CLS 0). | PASS (known trade-off) | none now | – | – | – |

No P0 found in this stream.

## 3. Lighthouse (lab)

Lighthouse 13.4.1, Chrome 154 headless, default simulated throttling (mobile = Moto G Power class, slow 4G, 4× CPU; desktop preset). Each run alone on the machine (an earlier pass that overlapped Playwright suites was discarded: it produced a 1424 ms TBT outlier). INP cannot be measured in a navigation run; **TBT is the lab INP proxy** (0–2 ms everywhere = no long main-thread tasks at load). Interaction INP below is from Playwright.

**Field data: PENDING VERIFICATION.** The site has no CrUX (Chrome UX Report) record until it receives real Chrome traffic at growlatics.us; check Search Console → Core Web Vitals ~28 days after launch.

### 3.1 LOCAL, gzip static server (closest to Hostinger), before fixes
| run | Perf/A11y/BP/SEO | FCP s | LCP s | TBT ms | CLS | SI s |
|---|---|---|---|---|---|---|
| desktop_about_ | 100/100/100/100 | 0.29 | 0.53 | 0 | 0.000 | 0.29 |
| desktop_contact_ | 100/100/100/100 | 0.29 | 0.54 | 6 | 0.000 | 0.29 |
| desktop_home | 100/100/100/100 | 0.33 | 0.62 | 0 | 0.000 | 0.33 |
| desktop_services_ | 100/100/100/100 | 0.33 | 0.57 | 0 | 0.000 | 0.33 |
| desktop_services_customer-operations_ | 100/100/100/100 | 0.33 | 0.57 | 0 | 0.000 | 0.33 |
| desktop_services_performance-marketing_ | 100/100/100/100 | 0.33 | 0.57 | 0 | 0.000 | 0.33 |
| desktop_services_sales-bpo_ | 100/100/100/100 | 0.33 | 0.57 | 0 | 0.000 | 0.33 |
| desktop_services_technology_ | 100/100/100/100 | 0.35 | 0.62 | 15 | 0.000 | 0.36 |
| desktop_work_ | 100/100/100/100 | 0.29 | 0.66 | 0 | 0.000 | 0.29 |
| mobile_about_ | 98/100/100/100 | 1.07 | 2.50 | 0 | 0.000 | 1.07 |
| mobile_contact_ | 97/100/100/100 | 1.06 | 2.55 | 0 | 0.000 | 1.06 |
| mobile_home | 94/100/100/100 | 1.36 | 3.02 | 2 | 0.000 | 1.36 |
| mobile_services_ | 96/100/100/100 | 1.21 | 2.71 | 0 | 0.000 | 1.21 |
| mobile_services_customer-operations_ | 96/100/100/100 | 1.21 | 2.71 | 0 | 0.000 | 1.21 |
| mobile_services_performance-marketing_ | 96/100/100/100 | 1.21 | 2.71 | 0 | 0.000 | 1.21 |
| mobile_services_sales-bpo_ | 96/100/100/100 | 1.21 | 2.71 | 0 | 0.000 | 1.21 |
| mobile_services_technology_ | 96/100/100/100 | 1.22 | 2.79 | 24 | 0.000 | 1.22 |
| mobile_work_ | 97/100/100/100 | 1.06 | 2.56 | 0 | 0.000 | 1.06 |

### 3.2 LOCAL, Python `http.server` (as the brief asks; uncompressed, so not representative of Hostinger)
| run | Perf/A11y/BP/SEO | FCP s | LCP s | TBT ms | CLS | SI s |
|---|---|---|---|---|---|---|
| desktop_about_ | 99/100/100/100 | 0.32 | 0.96 | 0 | 0.000 | 0.32 |
| desktop_contact_ | 99/100/100/100 | 0.32 | 1.00 | 0 | 0.000 | 0.32 |
| desktop_home | 97/100/100/100 | 0.56 | 1.28 | 0 | 0.000 | 0.56 |
| desktop_privacy_ | 99/100/100/58 | 0.32 | 1.04 | 0 | 0.000 | 0.32 |
| desktop_services_ | 99/100/100/100 | 0.36 | 1.04 | 0 | 0.000 | 0.36 |
| desktop_services_customer-operations_ | 99/100/100/100 | 0.36 | 1.04 | 0 | 0.000 | 0.36 |
| desktop_services_performance-marketing_ | 99/100/100/100 | 0.36 | 1.04 | 0 | 0.000 | 0.36 |
| desktop_services_sales-bpo_ | 99/100/100/100 | 0.36 | 1.04 | 0 | 0.000 | 0.36 |
| desktop_services_technology_ | 99/100/100/100 | 0.36 | 1.04 | 0 | 0.000 | 0.36 |
| desktop_terms_ | 98/100/100/58 | 0.32 | 1.05 | 0 | 0.000 | 0.32 |
| desktop_work_ | 97/100/100/100 | 0.32 | 1.32 | 0 | 0.000 | 0.32 |
| mobile_about_ | 81/100/100/100 | 1.65 | 5.10 | 0 | 0.000 | 1.65 |
| mobile_contact_ | 79/100/100/100 | 1.50 | 5.55 | 0 | 0.000 | 1.50 |
| mobile_home | 71/100/100/100 | 3.07 | 6.86 | 4 | 0.000 | 3.07 |
| mobile_privacy_ | 80/100/100/58 | 1.51 | 5.25 | 0 | 0.000 | 1.51 |
| mobile_services_ | 78/100/100/100 | 1.80 | 5.55 | 0 | 0.000 | 1.80 |
| mobile_services_customer-operations_ | 79/100/100/100 | 1.66 | 5.40 | 0 | 0.000 | 1.66 |
| mobile_services_performance-marketing_ | 79/100/100/100 | 1.65 | 5.40 | 0 | 0.000 | 1.65 |
| mobile_services_sales-bpo_ | 78/100/100/100 | 1.80 | 5.55 | 0 | 0.000 | 1.80 |
| mobile_services_technology_ | 79/100/100/100 | 1.65 | 5.40 | 0 | 0.000 | 1.65 |
| mobile_terms_ | 78/100/100/58 | 1.51 | 6.01 | 0 | 0.000 | 1.51 |
| mobile_work_ | 77/100/100/100 | 1.50 | 6.16 | 0 | 0.000 | 1.50 |

`/privacy/` and `/terms/` score SEO 58 because they are `noindex` on purpose (unapproved legal drafts, GLASS_HANDOFF §11); 404 is not measurable (Lighthouse refuses a 404 document) and was covered by axe/console instead.

Uncompressed HTML/JS inflates simulated mobile LCP to ~5–6 s on every route; compare 3.1 for the realistic number.

### 3.3 PREVIEW (GitHub Pages, real CDN, 3 routes)
| run | Perf/A11y/BP/SEO | FCP s | LCP s | TBT ms | CLS | SI s |
|---|---|---|---|---|---|---|
| desktop_contact_ | 100/100/100/63 | 0.27 | 0.47 | 0 | 0.000 | 0.27 |
| desktop_home | 100/100/100/63 | 0.29 | 0.45 | 0 | 0.000 | 0.43 |
| desktop_services_sales-bpo_ | 100/100/100/63 | 0.32 | 0.52 | 0 | 0.000 | 0.32 |
| mobile_contact_ | 98/100/100/63 | 1.06 | 2.26 | 10 | 0.000 | 2.56 |
| mobile_home | 90/100/100/63 | 2.25 | 2.81 | 4 | 0.000 | 4.60 |
| mobile_services_sales-bpo_ | 98/100/100/63 | 0.98 | 2.29 | 0 | 0.000 | 0.98 |

SEO 63 on the preview is expected: it is `noindex, nofollow` by design. Preview mobile `/` SI 4.6 s / FCP 2.25 s includes GitHub Pages TTFB from a real network; it is not the production host.

### 3.4 LOCAL gzip, after fixes
| run | Perf/A11y/BP/SEO | FCP s | LCP s | TBT ms | CLS | SI s |
|---|---|---|---|---|---|---|
| desktop_about_ | 100/100/100/100 | 0.29 | 0.53 | 0 | 0.000 | 0.29 |
| desktop_contact_ | 100/100/100/100 | 0.29 | 0.53 | 0 | 0.000 | 0.29 |
| desktop_home | 100/100/100/100 | 0.34 | 0.62 | 0 | 0.000 | 0.34 |
| desktop_services_ | 100/100/100/100 | 0.33 | 0.58 | 0 | 0.000 | 0.33 |
| desktop_services_customer-operations_ | 100/100/100/100 | 0.33 | 0.57 | 0 | 0.000 | 0.33 |
| desktop_services_performance-marketing_ | 100/100/100/100 | 0.33 | 0.57 | 0 | 0.000 | 0.33 |
| desktop_services_sales-bpo_ | 100/100/100/100 | 0.33 | 0.57 | 0 | 0.000 | 0.33 |
| desktop_services_technology_ | 100/100/100/100 | 0.33 | 0.58 | 0 | 0.000 | 0.33 |
| desktop_work_ | 100/100/100/100 | 0.30 | 0.63 | 0 | 0.000 | 0.30 |
| mobile_about_ | 95/100/100/100 | 1.06 | 2.87 | 0 | 0.000 | 1.06 |
| mobile_contact_ | 97/100/100/100 | 1.06 | 2.56 | 0 | 0.000 | 1.06 |
| mobile_home | 94/100/100/100 | 1.36 | 3.01 | 1 | 0.000 | 1.36 |
| mobile_services_ | 96/100/100/100 | 1.21 | 2.71 | 0 | 0.000 | 1.21 |
| mobile_services_customer-operations_ | 96/100/100/100 | 1.21 | 2.75 | 0 | 0.000 | 1.21 |
| mobile_services_performance-marketing_ | 96/100/100/100 | 1.21 | 2.71 | 0 | 0.000 | 1.21 |
| mobile_services_sales-bpo_ | 96/100/100/100 | 1.21 | 2.71 | 0 | 0.000 | 1.21 |
| mobile_services_technology_ | 96/100/100/100 | 1.21 | 2.71 | 0 | 0.000 | 1.21 |
| mobile_work_ | 95/100/100/100 | 1.06 | 3.01 | 0 | 0.000 | 1.06 |

Before → after: desktop identical (100 on every route). Mobile moves within run-to-run noise (±0.3 s LCP on `/about/` and `/work/`, Lighthouse's simulated estimate); the fix touches only the WebGL error path, which no Lighthouse run reaches (mobile is never tier 2). First Load JS unchanged: `/` 165, `/services` 160, `/services/[slug]` 161, `/contact` 152 kB.

### 3.5 Lab interaction latency proxy (Playwright, LOCAL, 1440 desktop, no throttle)
Event Timing API (`PerformanceObserver` type `event`, threshold 16 ms), worst event per interaction. Duration = input delay + handler time + time to the next painted frame.

| Interaction | `/` tier 2 (software GL) | `/` reduced motion | `/about/` (no WebGL) |
|---|---|---|---|
| Theme toggle (view transition) | 544 ms (input delay 29, handler 12) | 184 ms | 96 ms |
| Services dropdown | < 16 ms to 296 ms across runs | 80 ms | 128 ms |
| Contact option / Continue (1×, 4× CPU) | 144 / 80 ms · 184 / 96 ms | – | – |
| Mobile menu 390 (1×, 4× CPU) | 56 / 72 ms | – | – |

Main-thread work per interaction is ≤ 41 ms everywhere; the long durations come from presenting the next frame through SwiftShader (software WebGL on CPU) plus the full-page view-transition snapshot on theme change. That is PERF-04 below; a real GPU removes most of it, but only field INP proves it.

## 4. Accessibility

### 4.1 axe-core 4.11.4 (WCAG 2.0/2.1/2.2 A+AA + best practice), LOCAL
12 routes (`/`, `/services/`, 4 service pages, `/about/`, `/work/`, `/contact/`, `/privacy/`, `/terms/`, 404) × widths 390 (touch, mobile), 820 (touch), 1024 (touch), 1440 (mouse) × dark + light = **96 runs, 0 violations** after full-page scroll (reveals settled). One transient contrast hit per pass is A11Y-01 (before: Customer Operations 1440 dark; after: Sales & BPO 1440 light, the same "how it works" step component mid-fade). Targeted re-runs of both: 0 violations. **After the fix: the same 96 runs, 0 real violations.** Each route has exactly one `<h1>`; horizontal overflow 0 px on all 96.

### 4.2 Manual keyboard pass (LOCAL, Playwright-driven, real key events)
| Flow | Result | Evidence |
|---|---|---|
| Desktop header, 1440 | PASS | Tab order: Skip to content → logo → Home → Services → "Show services" toggle → Work → About → Contact → theme toggle → Book a Growth Call → hero CTAs. Every stop has a visible ring (outline or box-shadow) and a non-zero box. |
| Services dropdown | PASS | Enter on toggle → `aria-expanded=true`; Tab → first panel link (Sales & BPO); Escape → closes, focus returns to toggle; tabbing past the panel closes it (`onBlur`). |
| Mobile menu, 390 | PASS | Closed panel is out of the tab order (`visibility:hidden`). Open: focus moves to first item, `body{overflow:hidden}`, `<main>` inert, Tab wraps (Contact → theme → CTA → logo → Close → Home …), Escape closes and returns focus to the menu button, `aria-expanded=false`. |
| Contact flow `/contact/`, 1440 | PASS | Steps 1–4: Space selects the first option, Enter advances; focus lands on the next step's legend each time; "Step n of 5" announced via `aria-live`. Step 5: empty submit focuses the first invalid field and sets `aria-invalid` on name, email, company. Valid submit → result panel heading "One last step: send the email." receives focus. The copy does **not** claim a lead was submitted (brief §12 rule kept). |

### 4.3 Reduced motion, reflow, zoom, no-JS
| Check | Result |
|---|---|
| `prefers-reduced-motion: reduce`, `/` 1440 | PASS: tier 0 (static SVG), 0 canvases, 0 infinite animations running, all copy present (main text 7024 chars), 0 errors. |
| Reflow at 320 CSS px (WCAG 1.4.10), 7 routes | PASS: 0 px horizontal overflow, no text element clipped outside the viewport. |
| Zoom 200 % (1280 px window = 640 CSS px at 2×), 7 routes | PASS: same checks. |
| JavaScript disabled, `/` | PASS: 0 of 42 `[data-reveal]` elements hidden, H1 + all act copy in static HTML. |
| Theme: light + dark | PASS in all axe runs; header contrast over the live network previously measured ≥ 9.98:1 (GLASS_QA). |
| Touch targets | PASS (axe `target-size` 2.2 AA clean; nav/footer links `min-h-11` = 44 px on mobile). |

## 5. 3D and glass lifecycle (LOCAL, `/`)

### 5.1 Tier gating and lazy load
| Mode | Renderer | three.js chunk (681 kB raw / 168 kB gz) requested? | Errors |
|---|---|---|---|
| 1440 fine pointer, WebGL2 | tier 2 WebGL (`three.js r167` canvas) after `requestIdleCallback` | yes, after idle | 0 |
| 1440, WebGL disabled (`--disable-webgl --disable-3d-apis`) | tier 1 Canvas2D | **no** | 0 |
| 390 touch | tier 1 Canvas2D | **no** | 0 |
| reduced motion | tier 0 SVG, no canvas | **no** | 0 |
| JS disabled | static SVG + full text | no | 0 |

Text without WebGL: identical H1 and ~7,000 chars of main copy in every mode. **PASS.**

### 5.2 Off-screen pause and idle
- Internal page `/about/`, idle and after mouse movement: **0 rAF/s** (shared scheduler stops when no task is live). PASS.
- `/` with reduced motion, scrolled to footer: 0 rAF/s. PASS.
- `/` tier 2 scrolled to the very bottom (1440×900): the scene keeps drawing (~290 WebGL draw calls/s). Not a defect: the 538 px footer is shorter than the viewport, so act 9 and its network stay visible above it (`growlatics-audit/home-bottom-1440.png`); the IntersectionObserver on the acts wrapper is correct. The tab-hidden pause is covered by the scheduler (`sys.visible`) per PERF_A11Y_REPORT; not re-measured (headless cannot hide a tab reliably).

### 5.3 Context loss (PERF-01)
Before: lost → blank network with floating labels; restored → recovers. After the fix: permanent loss (no restore) → after 2 s the stage switches to the Canvas2D tier, the network and labels are back, 0 errors (`growlatics-audit/after-ctxloss-permanent.png`); restore within 0.5 s → WebGL stays (`three.js r167` canvas), no tier change, 0 errors. **PASS.**

### 5.4 Throttled CPU (PERF-03)
4× CPU via CDP while scrolling acts 1–9 for 12 s: p50 16.7 ms · p90 66.7 ms · p99 133 ms · 56/398 frames > 50 ms · flat-glass fallback engaged. 1×: p50 16.7 · p90 16.8 · p99 50.0. Simulated, software GL.

### 5.5 Glass fallbacks (SRC)
`backdrop-filter` is inside `@supports` (with `-webkit-` prefix) and falls back to `--glass-a-solid: 0.94`; `html[data-glass=flat]` is set by the frame governor (`SceneEnvironment.tsx:37`) and was observed switching on under 4× CPU. `corner-shape: squircle` and the scroll-timeline header are behind `@supports`. PASS (Chromium); Safari/Firefox NOT RUN (QA-01).

## 6. Assets
| Check | Result | Label |
|---|---|---|
| Raster images in pages | None (`<img>` count 0 on every route); visuals are inline SVG / canvas | LOCAL |
| Decorative SVG | 0 `<svg>` without `aria-hidden` or `role="img"`+`aria-label` on `/`, `/services/`, Sales & BPO, Contact, About | LOCAL |
| Meaningful SVG figures | `role="img"` with descriptive `aria-label` (e.g. "The Growlatics network: Acquire, Sell, Operate and Build connected through one core") | LOCAL |
| Fonts | `next/font` self-hosted, Inter `display: swap` (1 preload, 48 kB woff2), JetBrains Mono `swap`, `preload:false`; 10 woff2 files, 300 kB total (subsets; only the used ones download) | SRC + LOCAL |
| OG image | `og-image.png` 1200×630, 164 kB | LOCAL |
| Icons / manifest | `icon-192.png`, `icon-512.png`, `logo.png`, `site.webmanifest` all referenced; no unused file in `public/` | SRC |
| JS weight | First-load 87.4 kB shared; three.js chunk only on tier 2; Lighthouse "unused JS" flags 29 kB of `661-*.js` on mobile (shared app chunk) | LOCAL |
| Caching / compression headers | ASSET-01 | PROD |

## 7. Test matrix
| Dimension | Covered | Device type | Engine | Label |
|---|---|---|---|---|
| 390×844 touch, mobile UA | 12 routes × 2 themes, axe, overflow, console, keyboard menu | simulated | Chromium | LOCAL |
| 820×1180 touch | 12 routes × 2 themes | simulated | Chromium | LOCAL |
| 1024×768 touch | 12 routes × 2 themes | simulated | Chromium | LOCAL |
| 1440×900 mouse | 12 routes × 2 themes; keyboard; 3D lifecycle; 4× CPU | simulated | Chromium | LOCAL |
| 320 reflow, 200 % zoom | 7 routes | simulated | Chromium | LOCAL |
| Reduced motion, no-JS, no-WebGL | `/` | simulated | Chromium | LOCAL |
| Lighthouse mobile + desktop | 9 indexable routes (+ privacy/terms on Python server) | simulated | Chromium | LOCAL |
| Lighthouse mobile + desktop | `/`, `/services/sales-bpo/`, `/contact/` | simulated | Chromium | PREVIEW |
| WebKit / Firefox | – | – | NOT RUN (QA-01) | – |
| Real iPhone / iPad / Android / MacBook Air | – | – | NOT RUN, owner checklist GLASS_HANDOFF §17 | – |
| Field CWV | – | – | PENDING VERIFICATION after launch | PROD |

Screenshots: `/Users/moses/HarnessAgents/hive/artifacts/growlatics-audit/` (not in git): `before-{390,1440}-dark_*.png` (home, contact, Sales & BPO), `gl-before-loss.png`, `gl-during-loss.png`, `gl-after-restore.png`, `home-bottom-1440.png`, `reflow-320-home.png`, `zoom200-of-1280-home.png`, `after-ctxloss-permanent.png`, `after-ctxloss-restored.png`, `after-{390,1440}-dark_*.png`.

## 8. Component audit matrix (brief §4)

Criteria: Sem = semantics · Crawl = crawlability (content in static HTML) · SEO · A11y · Perf · Mob = mobile · Link = internal linking · Conv = conversion · Dup = duplication risk · Def = defects found here. ✓ PASS · ✗ FAIL · – NOT APPLICABLE · ? PENDING VERIFICATION.

| Component (file) | Sem | Crawl | SEO | A11y | Perf | Mob | Link | Conv | Dup | Def |
|---|---|---|---|---|---|---|---|---|---|---|
| Root layout (`app/layout.tsx`) | ✓ `lang=en`, skip link, landmarks | ✓ | ✓ | ✓ | ✓ inline theme script, no FOUC | ✓ | – | – | ✓ | none |
| Floating header (`components/layout/Header.tsx`) | ✓ `<header>`, `<nav aria-label=Main>` | ✓ links in HTML | ✓ | ✓ §4.2 | ✓ CSS scroll timeline, no listener | ✓ | ✓ 5 top links | ✓ CTA always visible | ✓ | none |
| Desktop nav | ✓ | ✓ | ✓ | ✓ `aria-current` | ✓ | – | ✓ | – | ✓ | none |
| Mobile nav / menu | ✓ modal pattern, inert | ✓ links in HTML (hidden) | ✓ | ✓ | ✓ | ✓ 390/820 | ✓ | ✓ one CTA while open | ✓ second `nav aria-label=Main` only exposed below lg | none |
| Services dropdown | ✓ disclosure (`aria-expanded`/`controls`) | ✓ panel links in HTML (`hidden`) | ✓ | ✓ Esc, blur-close | ✓ | – (mobile uses its own list) | ✓ 4 services + all | ✓ | ✓ | none |
| Footer (`components/layout/Footer.tsx`) | ✓ `<footer>`, per-column `<nav>` | ✓ | ✓ | ✓ (A11Y-03 advisory) | ✓ | ✓ | ✓ services, company, contact | ✓ CTA + email + phone | ✓ | none |
| Buttons / links (`components/ui/Button.tsx`) | ✓ link vs button by `href` | ✓ | ✓ | ✓ 44 px, white on signal 4.7:1 | ✓ | ✓ | ✓ | ✓ | ✓ | none |
| Home hero (`components/home/acts.tsx` Hero) | ✓ one H1 | ✓ | ✓ | ✓ | ✓ LCP = H1/paragraph, CLS 0 | ✓ | ✓ CTA + "see how" | ✓ | ✓ | none (PERF-02 lab) |
| Page heroes (`components/patterns/PageHero.tsx`) | ✓ | ✓ | ✓ | ✓ | ✓ `Reveal load` CSS-first | ✓ | ✓ | ✓ hero CTA = LCP on services | ✓ | none |
| Glass panels (`components/ui/Glass.tsx`, `globals.css`) | ✓ presentational | – | – | ✓ contrast clean both themes | ✓ flat fallback works | ✓ | – | – | ✓ | A11Y-02 (P3, optional) |
| Network visuals (SVG tier 0, `render-svg`) | ✓ `role=img` + label | ✓ | ✓ | ✓ | ✓ | ✓ | – | – | ✓ dual variants hidden by CSS | ASSET-02 known |
| 3D (`render-gl`) | ✓ `aria-hidden` canvas | – (text outside) | ✓ | ✓ | ✓ lazy, gated; ? real GPU | – (never on touch) | – | – | – | PERF-01 fixed, PERF-03 ? |
| Canvas2D (`render-2d`) | ✓ `aria-hidden` | – | – | ✓ | ✓ 30 fps when idle | ✓ | – | – | – | none |
| Scroll sections / acts (`components/home`, `Reveal`) | ✓ `section` + headings | ✓ no-JS visible | ✓ | ✓ reduced motion | ✓ | ✓ | ✓ | ✓ | ✓ | none |
| Service components (`app/services/[slug]`, patterns) | ✓ | ✓ | ✓ BreadcrumbList | ✓ | ✓ | ✓ | ✓ | ✓ hero + end CTA | ? cross-page (content stream) | none here |
| Contact / booking flow (`QualificationFlow.tsx`) | ✓ `form`, `fieldset`/`legend` | ✓ step 1 in HTML | – | ✓ §4.2 | ✓ 152 kB | ✓ | – | ✓ mailto honest; ? real send | ✓ | none here (CRO = growth stream) |
| Form fields | ✓ labels, `autocomplete`, `aria-invalid`/`describedby` | – | – | ✓ | ✓ | ✓ | – | ✓ | – | none |
| Theme toggle (`ThemeToggle.tsx`) | ✓ button + state label | – | – | ✓ | ✓ view transition, instant on reduced | ✓ | – | – | – | none |
| Custom cursor (`InteractiveCursor.tsx`) | ✓ `aria-hidden` | – | – | ✓ native cursor kept for text + touch + reduced | ✓ sleeps when settled | – (off on touch) | – | – | – | none |
| FAQ (`Ledger` on services pages) | ✓ `dl`/`dt`/`dd` | ✓ all answers in HTML | ✓ | ✓ | ✓ | ✓ | – | ✓ | ? FAQ repetition (content stream) | none here |
| Media (OG, icons) | – | ✓ | ✓ 1200×630 | – | ✓ | – | – | – | – | none |
| Metadata / schema (`lib/seo`) | ✓ JSON-LD per page | ✓ | ? tech stream | – | ✓ | – | – | – | – | out of scope |
| Routing / deploy (`next.config.mjs`, `.htaccess`, postbuild) | – | ✓ trailing slash, `out/lab` stripped | ✓ | – | ? ASSET-01 headers | – | – | – | – | ASSET-01 |

## 9. Component cards (brief §18)

**FloatingHeader** (`components/layout/Header.tsx`). SEO: real `<a href>` nav in static HTML, all 4 services in the dropdown markup. AEO: n/a. A11y: PASS (tab order, disclosure, modal menu with inert + focus wrap + Esc + focus return, closed panel out of tab order). Performance: no scroll listener (CSS scroll timeline), magnet only on fine pointers via the shared scheduler. Conversion: "Book a Growth Call" visible at every width (icon-button < 640 px with `aria-label`). Status: PASS. Fix: none.

**Home Hero** (`components/home/acts.tsx` Hero + fixed `SystemStage`). SEO: single H1 "We build and operate the systems behind growth." in static HTML. A11y: PASS. Performance: desktop LCP 0.62 s (H1), mobile lab 3.02 s (paragraph; PERF-02), CLS 0, TBT ≤ 2 ms; WebGL deferred to idle. Conversion: primary + secondary CTA above the fold at 390 and 1440. Status: PASS / PERF-02 pending field data. Fix: PERF-01 (context loss) applied to its stage.

**Sales & BPO section / page** (`/services/sales-bpo/`). SEO: own H1, BreadcrumbList. A11y: axe 0 at all widths/themes. Performance: desktop 100, mobile lab LCP 2.71 s (hero CTA). Mobile: glass lane strips reflow at 320 px. Conversion: hero CTA is the LCP element, so it paints first. Status: PASS. Fix: none.

**ContactForm / QualificationFlow** (`components/patterns/QualificationFlow.tsx`). A11y: fieldset/legend per step, focus to legend on step change, `aria-live` step counter, errors with `aria-invalid` + `aria-describedby`, focus to first invalid field. Honeypot is `aria-hidden` and `tabIndex=-1`. Conversion: mailto hand-off is described as "One last step: send the email", never as a submitted lead. Status: PASS. Fix: none (5-step justification belongs to the growth stream).

**SystemStage / 3D** (`components/system/stage/SystemStage.tsx`, `render-gl`). Performance: tiered (WebGL only ≥1024 + fine pointer + WebGL2 + more than 4 cores + ≥ 4 GB device memory; never with reduced motion or Save-Data), lazy chunk, idle gate, flat-glass governor, scheduler stops when idle. Status: PASS after PERF-01. Pending: real-GPU frame timing (PERF-03).

## 10. Preserve check (brief §19)
9-act story, floating glass header, warm themes, orange-active / neutral-idle, 3D narrative, Sales & BPO emphasis, capability system, contact experience, perf gains, mobile fallbacks: **unchanged**. The only code change is an error-path fallback that activates after a WebGL context is lost for 2 s.

## 11. Recommendations outside my files
1. `public/.htaccess`: cache + compression headers (ASSET-01), owner: tech stream.
2. `components/ui/Reveal.tsx` / `lib/motion.ts` / shared chunk: only if field LCP p75 > 2.5 s after launch (PERF-02).
3. Safari + Firefox + real-device QA before Hostinger cut-over (QA-01, PERF-03).

## 12. Gates on this branch
Run on the final tree of `v2-audit-qa`: `npm run build` PASS (postbuild strips `out/lab`), `npx tsc --noEmit` PASS, `npm run lint` PASS (no warnings), `node scripts/seo-crawl.mjs` PASS (0 problems, 9 sitemap routes, click depth ≤ 1). First Load JS: `/` 165 · `/services` 160 · `/services/[slug]` 161 · `/contact` 152 kB: equal to the baseline, inside the +2 kB budget.

Reproduce: scripts used for every number live in this session's scratchpad (not in git): `axe.mjs` (96-run axe matrix), `kb.mjs` (keyboard), `life.mjs` (tiers, reflow, zoom, no-JS, 4× CPU), `ctx.mjs` (context loss), `inp.mjs` / `inp2.mjs` (Event Timing), `lh.sh` + `gz.mjs` (Lighthouse against a gzip static server). Playwright: `/Users/moses/bat/career-ops/node_modules/playwright-core`; Lighthouse 13.4.1 from the npx cache.

