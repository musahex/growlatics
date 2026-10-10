# Fix: service route error on localhost + Growth Engine effects over the footer

Branch `v2-fix-route-engine`, base `e7b0a56`. Brief: `hive/agents/god/briefs/gl-fix-route-engine.md`. Date 2026-10-10.

## 1. Route root cause

`app/services/[slug]/page.tsx` exported `generateStaticParams()` with all 4 slugs, and also `export const dynamicParams = false`. That second line triggers a Next.js 14.2.5 dev-server rule:

- `next/dist/build/utils.js` (`buildAppStaticPaths`) sets `fallback = false` when any segment has `dynamicParams === false`.
- `next/dist/server/base-server.js:1080` then requires `fallbackMode === "static"` (fallback `true`) whenever `output: 'export'` is on, and otherwise throws `Page "/services/[slug]/page" is missing exported function "generateStaticParams()"`. The message is misleading: the function exists; the dev server rejects the `false` fallback.
- `next build` never runs that check, which is why the static export (GitHub Pages preview) always worked.

**Not staleness.** A fresh dev server from this worktree on :3100 reproduced the 500 on all 4 pages before the fix, and the owner's :3000 server (pid 55034, cwd `/Users/moses/Growlatics`, branch `v2` at `e7b0a56`) runs the same code. No other route uses `dynamicParams`, and there is no other dynamic route.

## 2. Footer overlap root cause

The home acts already clip the fixed WebGL stage (`app/page.tsx`: wrapper `[clip-path:inset(0)]`), so the canvas itself never painted over the footer. What escaped was the **global custom cursor** (`components/ui/InteractiveCursor.tsx`): it sits at `z-index: var(--z-cursor)` (100), outside that clip, and draws:

- the orange hairline from the ring to the nearest node (`sys.near.d < 120`)
- the ring locked onto that node (`sys.near.d < 48`, the "node" state)

`sys.near` is written by the fixed stage (`components/system/stage/SystemStage.tsx`) in viewport pixels for every projected node. Two defects:

- a. No bounds: nodes positioned under the footer (clipped, invisible) and pointers over the footer still counted as "near". So a line ran from a node into the footer and the ring sat in the footer (the owner's screenshot).
- b. No release: when the acts left the viewport, the intersection observer paused the stage task but left `sys.near` at its last value, so the lock and line could stay frozen over the footer.

The same unbounded pointer also kept driving proximity glow, packet routing and camera parallax while the pointer was over the footer (clipped, so invisible, but the effect was active outside its region).

## 3. Files changed

| File | Change |
|---|---|
| `app/services/[slug]/page.tsx` | removed `export const dynamicParams = false` (1 line, comment added) |
| `components/system/stage/SystemStage.tsx` | pointer and near-node bounded to the acts' clip region; `sys.near` cleared when the stage pauses (+14 / -4) |
| `docs/v2/audit/fix-route-engine.md` | this report |
| `docs/v2/audit/shots/fix-route-engine/` | 8 before/after PNGs; `footer.mjs` and `audit.mjs` test scripts |

## 4. Fixes

**Route.** Without `dynamicParams = false` the dev server gets fallback `true` ("static") and checks the requested slug against `generateStaticParams()`. The export still emits exactly the 4 slugs; an unknown slug is never built, so the host serves `404.html` as before. `output: 'export'`, `trailingSlash`, basePath logic and SEO are untouched. Not suppressed: the check still runs (an unknown slug in dev now reports `missing param ... in generateStaticParams()`, which is correct).

**Footer.** Inside the existing per-frame stage task (no new listener, loop or observer), the fixed stage reads its acts wrapper's rect, which is the clip region. Per frame:
- pointer effects (`ctx.pointerFx`: proximity glow, routing, parallax) are on only while the pointer is inside that region (requirements A, B, C)
- `sys.near` is published only when the pointer **and** the nearest node are inside it, and otherwise set to `Infinity`, so the cursor fades its hairline and unlocks the ring at its own damping (B, D)
- when the existing IntersectionObserver pauses the stage (acts off screen), `sys.near` is reset, so there is no stale lock (B, E)

The interaction is unchanged inside the scene (F). No visual design change: the cursor in the footer is the normal site cursor.

## 5. Screenshots (section/footer boundary, pointer in the footer just after a fast sweep through the scene)

`docs/v2/audit/shots/fix-route-engine/`:
- `before-footer-boundary-{1440,1024}-{light,dark}.png`: an orange hairline from a node into the footer and the ring in the footer
- `after-footer-boundary-{1440,1024}-{light,dark}.png`: the same pointer path, with no line and a plain cursor

Below 1024 there is no fixed stage (inline framed figures), so no boundary effect exists to shoot.

## 6. Results

Footer test (`footer.mjs`, Chromium + SwiftShader WebGL, home page). Path: scroll so the boundary sits at 60% of the viewport; fast sweeps from the scene into the footer at 12 x-positions (tests 1-3); pointer held over the footer while wheel-scrolling to the bottom (test 4); scroll back to top, where the stage is still drawing (test 5); leftovers measured at each step (test 6); reduced motion (test 7).

| Width | Theme | Motion | Renderer | Before: lines in footer | After: lines / ring locks / stale lock at bottom | Console errors |
|---|---|---|---|---|---|---|
| 1440 | light | full | WebGL (fixed) | 3 | 0 / 0 / no | 0 |
| 1440 | dark | full | WebGL (fixed) | 3 | 0 / 0 / no | 0 |
| 1024 | light | full | WebGL (fixed) | 7 | 0 / 0 / no | 0 |
| 1024 | dark | full | WebGL (fixed) | 7 | 0 / 0 / no | 0 |
| 820 | light, dark | full | inline figures, custom cursor | 0 | 0 / 0 / no | 0 |
| 390 | light, dark | full | inline figures, touch (no custom cursor) | 0 | 0 / 0 / no | 0 |
| all 4 | light, dark | reduced | tier 0 SVG, no custom cursor | 0 | 0 / 0 / no | 0 |

Cross-page audit (`audit.mjs`, issue 3). Pages: `/`, `/services/`, 4 service pages, `/about/`, `/work/`, `/contact/`. Widths 1440, 1024, 820, 390; light and dark; 72 runs, each fully scrolled.
- 84 stages and 64 canvases checked. No canvas, SVG or label escapes its stage box or a clipping ancestor inside it; the fixed stage's wrapper is clipped on every run.
- No canvas stacks at or above the header.
- The 390 mobile menu, when open, sits above every network layer.
- All pages returned 200, with 0 console errors.

Service routes on the dev server (:3100): `/services/sales-bpo/`, `/services/performance-marketing/`, `/services/customer-operations/`, `/services/technology/`. Before: 500 on all 4. After: 200 on all 4, on direct load and on reload (requested twice).

## 7. Gates (production build, `NEXT_PUBLIC_SITE_ENV` unset)

| Gate | Result |
|---|---|
| `npm run build` (+ postbuild) | PASS: `/services/[slug]` SSG with the 4 slugs; `out/services/{sales-bpo,performance-marketing,customer-operations,technology}/index.html` emitted (static Hostinger export) |
| `npx tsc --noEmit` | PASS |
| `npm run lint` | PASS, no warnings |
| `node scripts/seo-crawl.mjs` | PASS, 0 problems |
| axe-core 4.12.1 (WCAG 2.0/2.1/2.2 A+AA + best practice), static `out/` | 9 live routes + `404.html` × 4 widths × 2 themes = 80 runs, **0 violations**. `/privacy/` and `/terms/` are dropped from the export by design (postbuild, legal drafts), so they were not testable from `out/`. |

Not run: WebKit and Firefox (the same gap as perf-a11y-qa QA-01).

**Owner's :3000 server.** Staleness is not the cause. After this branch lands in `/Users/moses/Growlatics`, the running server hot-reloads the page, but Next caches the static-paths result, so the first reload can still show the old error. Restart cleanly: stop the server (Ctrl+C in its terminal, or `kill 55034` and its parent `next dev`), then run `cd /Users/moses/Growlatics && rm -rf .next && npm run dev`.

## 8. Commit

Fix commit `16390d7`; this report is the next commit on `v2-fix-route-engine` (tip: `git log -1 v2-fix-route-engine`).
