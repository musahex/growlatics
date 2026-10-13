# Growlatics v2: Creative and technical direction

Status: decided, 2026-10-06. Owner: DIRECTION stream. Inputs: `MASTER_BRIEF.md`, `PLAN.md`, god's verified audit, and the current source (`app/globals.css`, `tailwind.config.ts`, `Hero`, `HeroInteractiveField`, `ThreeGrowthWindow`, `components/three/*`, `InteractiveCursor`, `ThemeContext`).

Every later stream builds from this file. Where it gives a value, use that value. Where you think it is wrong, raise it with god; do not fork it locally. Copy, stage names and page structure belong to `IA_AND_COPY.md`. This file uses placeholders (`{STAGE_1..5}`, `{HEADLINE}`) where words are needed.

---

## 1. Creative concept

**The site is one living operating network, seen first in pieces and then as one system.** A visitor arrives at a quiet field of warm-grey nodes, some dormant and some lit. As they scroll, the field tells one story in nine acts. Capabilities that start as separate islands (paid, SEO, social, YouTube, outreach, sales, support, ecommerce, technology) lose signal at their edges. Growlatics appears as the connecting core. Paths reconnect through it. Signal (always orange, `#D2401A`) begins to travel the whole route: demand, then leads, then conversations, then sales, then retained customers, with technology carrying it underneath. At the bottom of the page every path converges on one point, and that point resolves into the five-bar mark beside **Book a Growth Call**. Nothing in the visual system is decoration. A node is always a capability. A path is always a handoff. An orange packet is always a lead, a conversation or a customer moving through the system. Precision is the luxury here: thin hairlines, exact type and slow, purposeful motion, in the spirit of an operations console, not a nightclub.

**How "one connected growth operating system" shows up everywhere**

| Layer | Expression |
|---|---|
| Colour | Neutrals carry structure. Orange appears **only** where the system is active: a lit node, a moving packet, a primary action, a current stage. If nothing is active, nothing is orange. |
| Line | 1px hairlines are the site's grid, borders and network edges. Section rules and network edges come from the same token. |
| Shape | Circles are nodes, hairlines are paths, and the five ascending bars are the outcome. There are no other ornamental shapes. |
| Motion | Things do not float. They **activate** (go dormant to lit), **travel** (along a path) or **converge** (toward the core). Each motion pattern in section 4 maps to one of these three verbs. |
| Data | One graph model (`components/system/model/graph.ts`) drives the hero, the story, the journey, the capability diagram and the CTA. Every renderer draws the same nodes. |
| Interaction | The pointer acts as a node: nearby paths brighten and packets bend toward it. Focusing a capability in the UI lights the same cluster in the network. |

---

## 2. Design tokens

**Format.** Colours are CSS custom properties written as RGB channels, so Tailwind opacity modifiers work, for example `rgb(var(--c-bg) / <alpha-value>)`. Tokens live in `app/globals.css` under `:root` (light), `[data-theme="dark"]` and `[data-surface="dark"]`. Tailwind maps them by name, and components use only the Tailwind names. **No hex, rgb() or rgba() literals in `.tsx` files** except in `components/system/model/palette.ts`, which reads the CSS variables at runtime for the canvases.

### 2.1 Colour: neutrals and type

| Token | Light | Dark | Use |
|---|---|---|---|
| `--c-bg` | `#F5F3F0` | `#070605` | page background |
| `--c-surface` | `#FDFCFA` | `#0C0B0A` | sections and panels on the background |
| `--c-elevated` | `#FFFFFF` | `#14120F` | raised panels, menus, inputs |
| `--c-inset` | `#ECE9E4` | `#0A0908` | wells, code and data strips, input background |
| `--c-text` | `#0C0B0A` | `#F4F1EC` | primary text |
| `--c-text-2` | `#3A3530` | `#C0B8B0` | secondary text |
| `--c-text-3` | `#6F6A64` | `#8A837B` | muted text and labels (both at least 4.5:1 on `--c-bg`) |
| `--c-text-4` | `#A39D96` | `#4F4943` | disabled text and decoration only. **Never use it for reading text.** |
| `--c-line` | `12 11 10 / 0.08` | `244 241 236 / 0.07` | hairlines, borders, network edges at rest |
| `--c-line-2` | `12 11 10 / 0.14` | `244 241 236 / 0.13` | hover border, input border |
| `--c-line-3` | `12 11 10 / 0.24` | `244 241 236 / 0.22` | focus-adjacent, strong dividers |
| `--c-grid-dot` | `12 11 10 / 0.055` | `244 241 236 / 0.05` | 24px dot grid |

Dark text is warm off-white `#F4F1EC`, not pure white. Pure `#FFFFFF` is allowed only on orange fills, as button text.

### 2.2 Colour: signal (orange) and its states

Orange is a **state colour**. Use it for active states, never as a background wash.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--c-signal` | `#D2401A` | `#D2401A` | active node, packet, primary button fill, current stage |
| `--c-signal-deep` | `#A83216` | `#B8381A` | primary button hover and pressed |
| `--c-signal-ink` | `#B23A17` | `#EE5A30` | orange **text** under 18px (5.4:1 on light background, 5.9:1 on dark) |
| `--c-signal-soft` | `210 64 26 / 0.08` | `210 64 26 / 0.12` | active row tint, selected chip |
| `--c-signal-line` | `210 64 26 / 0.32` | `210 64 26 / 0.38` | active border, active edge |
| `--c-glow` | `210 64 26 / 0.12` | `210 64 26 / 0.16` | radial glow stops (pointer glow, node halo) |
| `--c-on-signal` | `#FFFFFF` | `#FFFFFF` | text on signal fill (4.7:1; use weight 600 or more) |

Network state ramp, read by the canvases through `palette.ts`:

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--net-dormant` | `12 11 10 / 0.22` | `244 241 236 / 0.20` | capability that exists but is not connected |
| `--net-idle` | `210 64 26 / 0.45` | `210 64 26 / 0.52` | connected, resting |
| `--net-active` | `210 64 26 / 0.95` | `210 64 26 / 1.0` | carrying signal or focused |
| `--net-edge` | `210 64 26 / 0.12` | `210 64 26 / 0.14` | connected path at rest |
| `--net-edge-hot` | `210 64 26 / 0.48` | `210 64 26 / 0.44` | path carrying a packet or near the pointer |
| `--net-edge-broken` | `12 11 10 / 0.18` | `244 241 236 / 0.16` | disconnected handoff (dashed 2/4) |
| `--net-packet` | `#D2401A` | `#F0663C` | packet core. The dark value is lifted so the packet reads on black; this is perceptual tuning, not neon. |
| `--net-blend` | `normal` | `additive` | WebGL blending per theme |

Light-theme orange alphas sit above the dark ones for interactive states, because orange on ivory has lower perceived contrast. This keeps the harvested rule from `HeroInteractiveField`.

### 2.3 Glass, used sparingly

Glass is allowed **only** for a panel that floats over a live network canvas, at most two per viewport.

| Token | Light | Dark |
|---|---|---|
| `--glass-bg` | `253 252 250 / 0.78` | `12 11 10 / 0.72` |
| `--glass-line` | `12 11 10 / 0.10` | `244 241 236 / 0.08` |
| `--glass-blur` | `16px` | `16px` |

Fallback without `backdrop-filter`: use `--c-elevated` at 0.96.

### 2.4 Inverse surface

`[data-surface="dark"]` re-declares every `--c-*` and `--net-*` token with its dark value inside that subtree, whatever the page theme. The growth journey (act 4) and the CTA (act 9) are always dark surfaces: they are "inside the machine". This attribute **replaces** `data-cursor-surface="dark"`, and the cursor reads tokens from it automatically (section 9).

### 2.5 Spacing (4px base)

`0 · 1:4 · 2:8 · 3:12 · 4:16 · 5:20 · 6:24 · 8:32 · 10:40 · 12:48 · 16:64 · 20:80 · 24:96 · 32:128 · 48:192` (the Tailwind default scale; do not add arbitrary `px` values).

| Token | Value |
|---|---|
| `--space-section` | `clamp(96px, 12vw, 192px)`: vertical padding of a standard section |
| `--space-section-tight` | `clamp(64px, 8vw, 128px)` |
| `--gutter` | `20px` below 640, `24px` from 640, `32px` from 1024, `48px` from 1536 |
| `--container` | `1280px` (text and layout) |
| `--container-wide` | `1536px` (cinematic stages, network canvases) |
| `--measure` | `36rem` body copy max, `22ch` display headline max |

### 2.6 Radii

| Token | Value | Use |
|---|---|---|
| `--r-xs` | `2px` | hairline caps, progress ticks |
| `--r-sm` | `6px` | chips, inputs, small buttons |
| `--r-md` | `10px` | buttons, list rows |
| `--r-lg` | `16px` | panels, inspector |
| `--r-xl` | `24px` | stage windows (journey frame, CTA frame) |
| `--r-full` | `9999px` | nodes, pills, the cursor |

Five-bar mark radii follow section 5, not this table.

### 2.7 Shadows (warm-tinted, never cool black)

| Token | Light | Dark |
|---|---|---|
| `--sh-1` | `0 1px 2px rgb(40 24 12 / .06)` | `0 1px 2px rgb(0 0 0 / .40)` |
| `--sh-2` | `0 8px 24px -8px rgb(40 24 12 / .12), 0 1px 2px rgb(40 24 12 / .06)` | `0 8px 24px -8px rgb(0 0 0 / .55), 0 0 0 1px rgb(244 241 236 / .03)` |
| `--sh-3` | `0 24px 64px -16px rgb(40 24 12 / .18), 0 2px 4px rgb(40 24 12 / .06)` | `0 24px 64px -16px rgb(0 0 0 / .70), 0 0 0 1px rgb(244 241 236 / .04)` |
| `--sh-signal` | `0 0 0 1px rgb(210 64 26 / .32), 0 6px 24px -6px rgb(210 64 26 / .35)` | `0 0 0 1px rgb(210 64 26 / .38), 0 6px 28px -6px rgb(210 64 26 / .45)` |
| `--focus-ring` | `0 0 0 2px var(--bg), 0 0 0 4px rgb(210 64 26 / .55)` | same, with the dark background |

Only `--sh-signal` may glow, and only on the primary CTA and the active node. There are no ambient pulsing glows.

### 2.8 Z layers

| Token | Value | Layer |
|---|---|---|
| `--z-canvas` | `0` | fixed home network canvas |
| `--z-content` | `10` | page content |
| `--z-stage` | `20` | sticky stage panels, spatial labels |
| `--z-header` | `50` | header |
| `--z-overlay` | `80` | mobile nav, qualification dialog |
| `--z-toast` | `90` | toasts |
| `--z-cursor` | `100` | custom cursor. It replaces `z-[9999]`. |

### 2.9 Breakpoints, with the tablet and touch rule

Width breakpoints (Tailwind defaults): `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

**Rule: width decides layout; pointer decides interaction and rendering tier.** Never pick a 3D tier, hover behaviour or sticky scroll-travel from width alone.

- Add Tailwind screens `fine: {raw: '(hover: hover) and (pointer: fine)'}` and `touch: {raw: '(hover: none), (pointer: coarse)'}`.
- An iPad in landscape (1024 to 1366px wide, coarse pointer) gets the **desktop layout** and the **touch tier** (Canvas2D, no hover-only reveals, no pointer-proximity effects, tap targets at least 44px).
- At 768 to 1023px (tablet portrait), the layout is the two-column version of the phone layout, and sticky stages are allowed (section 7).
- Hover-only information is forbidden. Anything revealed on hover must also appear on focus and on tap.

### 2.10 Deprecated (FOUNDATION deletes these)

- `tailwind.config.ts`: `surface.{base,subtle,elevated,glass,border}` (cool `#050505 #08090B #0D0D0F`), `text.{primary,muted}` (`#A1A1AA`), `brand.orange-glow`, `boxShadow.{orange-glow,orange-glow-lg,glass}`, `animation.{fade-up,fade-in,pulse-glow}` and their keyframes, `backgroundImage.gradient-conic`.
- `globals.css`: the Google Fonts `@import`; `.glass`, `.orange-glow`, `.text-gradient-orange`, `.border-glow`; `--hero-*` (replaced by `--net-*`); `--dot-color` (replaced by `--c-grid-dot`); `--bg-*`, `--text-*` and `--border-subtle` (renamed to `--c-*`); the cool `--scrollbar-track: #08090B` (use `--c-inset`); the global `@media (pointer: fine) { * { cursor: none } }` rule (see section 9).
- Literal colours to remove from source: `#FF6B47`, `#FF7050`, `#7A1808`, `#7B1D08`, `#5C1B09`, `#832413`, `#2C2A28`, `#060504`, `#080706`, `#0A0908`, `#5A5550`, `#8A8480`, `#6A6460`, `#B0AAA5`, `#A8A09A`, `#6E6860`, `#08090B`, and every other hex or rgba literal in `.tsx` (152 counted by the audit).
- `data-cursor-surface` (replaced by `data-surface`).

---

## 3. Typography

**Decision: keep Inter, self-hosted through `next/font/google`. Add JetBrains Mono as the data face.**

- **Why Inter stays.** It is neutral, enterprise-credible and highly legible at UI sizes, and it is already the brand's face. The premium feel comes from discipline (lighter display weights, tight tracking, a strict scale), not from a new typeface. A display face swap would add bytes and risk for no gain in the "operating system" story.
- **Why a mono.** The system needs a voice for machine-level data: stage indices, node labels, coordinates, timestamps and system tags. JetBrains Mono is open-source (SIL Open Font License, OFL), has a clear zero, and its tabular figures suit indices. It is used **only** for labels at 11 to 13px, never for body copy.
- **Licences.** Inter and JetBrains Mono are both OFL. `next/font/google` downloads the files at build time and serves them from `/_next/static/media`, so they work with static export and make no runtime call to Google.
- **Loading.** Inter as a variable font (no `weight` list; `subsets: ['latin']`, `display: 'swap'`, `variable: '--font-sans'`). JetBrains Mono at weights 400 and 500 (`variable: '--font-mono'`, `display: 'swap'`, `preload: false`). Only Inter is preloaded.

### 3.1 Scale (fluid, `clamp(min, preferred, max)`)

| Token | Size | Line height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | `clamp(2.75rem, 1.6rem + 4.6vw, 5.5rem)` | 1.02 | 600 | -0.035em | home hero H1 only |
| `display-l` | `clamp(2.25rem, 1.5rem + 3vw, 4rem)` | 1.05 | 600 | -0.03em | act headlines, page H1 |
| `display-m` | `clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem)` | 1.1 | 600 | -0.025em | section H2 |
| `title` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)` | 1.25 | 600 | -0.015em | H3, panel titles |
| `body-l` | `1.125rem` | 1.6 | 400 | -0.005em | lead paragraphs |
| `body` | `1rem` | 1.65 | 400 | 0 | default |
| `body-s` | `0.875rem` | 1.55 | 400 | 0 | secondary, captions |
| `label` | `0.75rem` | 1.3 | 600 | 0.14em, uppercase | eyebrows (Inter) |
| `data` | `0.75rem` | 1.3 | 500 | 0.02em | mono: indices `01`, node tags, stage counters |
| `data-s` | `0.6875rem` | 1.3 | 400 | 0.04em | mono: spatial labels in canvas overlays |

Rules:
- Display weight drops from the current 800 to **600**. Use weight 800 or 900 nowhere except the "Growlatics" wordmark (700).
- Emphasis inside a headline uses colour (`--c-signal`) on **one** phrase at most. No gradient text, no italics in display type.
- Numbers use `font-variant-numeric: tabular-nums` everywhere.
- Body text uses `text-wrap: pretty` and headlines `text-wrap: balance`.
- Eyebrows (`label`) are always followed by a heading. Never stack two eyebrows.

---

## 4. Motion system

Motion constants live in one module, `lib/motion.ts`, mirrored as CSS variables. Framer Motion (already installed) handles DOM reveals. The network runs on the frame scheduler (section 6). **No GSAP, Lenis or Locomotive Scroll**: no new dependencies, and native scroll stays.

### 4.1 Durations

| Token | ms | Use |
|---|---|---|
| `instant` | 120 | press feedback, colour swaps |
| `fast` | 200 | hover, focus, cursor state |
| `base` | 320 | small reveals, node activation |
| `slow` | 560 | section reveals, bar rise |
| `slower` | 880 | path tracing, panel changes between stages |
| `cinematic` | 1400 | hero intro, CTA convergence |

### 4.2 Easings (the `[0.16, 1, 0.3, 1]` family)

| Token | Curve | Use |
|---|---|---|
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | **default** for all entrances and activations |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | camera travel, interpolation between stages, theme cross-fade |
| `ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | exits only, at 60% of the matching entrance duration |
| `ease-linear` | `linear` | packets along a path (their speed is the information) |

Per-frame smoothing (pointer, camera, cursor) uses **frame-rate-independent** damping, `v += (target - v) * (1 - exp(-k * dt))`, with `k` per channel: cursor ring 14, cursor dot 40, pointer for the network 6, camera 3.5, theme colour 5. This replaces the fixed per-frame lerps (`0.11`, `0.055`, `0.04`, and so on) that run faster on 120Hz screens.

### 4.3 Reveal patterns

| ID | Name | Motion | Stagger | Reduced-motion equivalent |
|---|---|---|---|---|
| R1 | Rise | opacity 0 to 1, y 16 to 0, `slow`, `ease-out` | 60ms | opacity 0 to 1 over `fast`, no translate |
| R2 | Trace | SVG path `stroke-dashoffset` from length to 0, `slower` | 120ms per path | path drawn fully at once |
| R3 | Bars | five-bar `scaleY` 0 to 1 from the bottom, `slow` | 80ms | bars shown at full height |
| R4 | Activate | node dormant to idle: colour ramp plus halo expanding 0 to 1, `base` | 90ms per node in graph order | instant state change, no halo animation |
| R5 | Converge | nodes and paths move to target positions, `cinematic`, `ease-in-out` | none | jump to the end state |
| R6 | Swap | panel content exits up 8px (`ease-in`, 190ms), then enters with R1 | n/a | cross-fade over `fast` |

Triggers: R1 to R4 fire once when 20% of the element is in view (`viewport={{ once: true, amount: 0.2 }}`). Nothing re-animates on scroll-back. Words and letters are never split for animation.

### 4.4 Stage transitions (journey, story acts)

- Driven by **scroll position, never by timers**. No scroll-jacking, no snap, no `wheel` interception.
- The sticky stage panel changes with R6 when the stage index changes. The canvas interpolates continuously with scroll (camera on a spline; section 7, act 4).
- Each stage owns 100vh of scroll on desktop: 60% dwell (camera holds and the cluster expands) and 40% travel (`ease-in-out` remapped over that segment).
- **Reduced motion:** sticky travel is turned off. All stages render in normal flow, each with its static composition, so all five are reachable. This fixes the current bug where the window is stuck at stage 1.

### 4.5 Global reduced-motion contract

`prefers-reduced-motion: reduce` means **the same content and the same diagrams, with no travel, drift, parallax, pulsing or packet flow**. Concretely:

- The network renders as its **end state for each act** (static SVG, tier 0) with every label visible.
- Packets are drawn as static orange dots on active paths, so flow direction stays legible.
- Hover and focus colour changes stay (they are not motion). Scale changes on hover are removed.
- Theme switching uses an instant swap, with no view-transition animation.
- The custom cursor is off and the native cursor is shown (section 9).

---

## 5. Five-bar mark: canonical geometry

**Canonical heights: 32 / 52 / 70 / 86 / 100 (% of mark height).** This matches `app/icon.svg` (the favicon already ships it) and `FinalCTA`. `Hero` (32/50/68/84/100) and `Header` (35/55/75/90/100) are wrong and change to these values.

Geometry in units (`u`), with bars bottom-aligned:

| Property | Value |
|---|---|
| bar width | 10u |
| gap | 4u |
| mark width | 66u (5 × 10 + 4 × 4) |
| mark height | 70u |
| bar heights | 22.4u · 36.4u · 49u · 60.2u · 70u |
| corner radius | 3u on **all four corners** (not top-only, not `rounded-full`) |
| colour | `--c-signal`. Monochrome `--c-text` is allowed only when printed or embossed. |

One component, `components/brand/Mark.tsx`, with props `size` (rendered height in px) and `state` (`static | rise | progress | converge`) and `value` (0 to 5, for progress). It renders one inline SVG with `viewBox="0 0 66 70"`. At sizes of 24px or less, snap bar width and gap to whole pixels: 16px tall uses width 2, gap 1; 20px tall uses width 3, gap 1; 24px tall uses width 3, gap 2.

Uses, and only these:

1. **Logo.** Header at 20px plus the wordmark "Growlatics" (Inter 700, -0.02em). The favicon is unchanged.
2. **Arrival.** The hero settle moment (act 1): five network nodes rise into the mark (section 7).
3. **Progress.** The journey (act 4) stage indicator is the mark at 28px: bar *n* is `--c-signal` when stage *n* has been reached and `--c-line-3` otherwise. The qualification flow on `/contact/` uses it the same way when it has five or fewer steps. The tier-2 asset loader uses it too (bars fill as chunks load). There is no spinner anywhere on the site.
4. **Route transition.** On client navigation, the header mark replays R3 (`slow`). There is no full-screen wipe and no page-cover animation.
5. **Destination.** The CTA (act 9) at 72 to 96px: the converging network resolves into it.

Never: 3D extruded bars (delete `GrowthBars.tsx`), gradients on the bars, bars used as a decorative divider, or more or fewer than five bars.

---

## 6. Network and 3D architecture

### 6.1 Principles

1. **One graph, three renderers.** A single typed graph model and per-act layouts. Tier 0 SVG, tier 1 Canvas2D and tier 2 WebGL all draw the same nodes and paths, so the story never changes by device; only the fidelity does.
2. **One store, one loop.** One set of window listeners and one `requestAnimationFrame`. Nothing else in the app may call `requestAnimationFrame` or add `mousemove` or `scroll` listeners.
3. **No React in the loop.** The store is a mutable module object. React re-renders only on discrete changes (tier, theme, stage index, focused system).
4. **Pay for what is seen.** Code-split by tier, mount by viewport, pause off-screen and in background tabs.

### 6.2 File layout

```
components/system/
  model/
    graph.ts          // nodes, edges, systems: the single source of network data
    layouts.ts        // per-act target positions (normalised 2D + z), per tier if needed
    palette.ts        // reads --net-* / --c-* from CSS on theme change, caches as numbers
  runtime/
    store.ts          // interaction store (6.3)
    scheduler.ts      // frame scheduler (6.4)
    tier.ts           // capability detection (6.5)
    SystemProvider.tsx// mounts listeners once; lives in app/layout.tsx
    useSystem.ts      // React hooks for discrete values (tier, theme, stage, focus)
  stage/
    SystemStage.tsx   // viewport mount + tier switch + off-screen pause (6.6)
    StageController.ts// scroll → act/stage index + local progress (0..1)
  render-svg/
    NetworkSVG.tsx    // tier 0: SSR, static per-act end state, also the no-JS view
  render-2d/
    NetworkCanvas2D.tsx // tier 1: harvested from HeroInteractiveField
  render-gl/          // tier 2: only reached via next/dynamic
    NetworkScene.tsx  // <Canvas frameloop="never"> root, wired to scheduler
    SceneEnvironment.tsx
    NetworkField.tsx
    GrowthNode.tsx    // instanced
    SignalPath.tsx
    SignalParticle.tsx// instanced packets
    CameraRig.tsx
  overlay/
    SpatialLabel.tsx  // DOM labels positioned from projected coordinates
components/brand/Mark.tsx
```

Primitives kept: **GrowthNode, SignalPath, SignalParticle, NetworkField, CameraRig, StageController, SpatialLabel, SceneEnvironment.** **SystemCluster is dropped**: clusters are a field in the graph data (`node.system`) and a layout concern, not a component.

### 6.3 Graph model (shape)

```ts
type SystemId = 'acquire' | 'sell' | 'operate' | 'build' | 'core'
type GNode = { id: string; system: SystemId; labelKey: string; weight: 1 | 2 | 3 }
type GEdge = { id: string; a: string; b: string; kind: 'internal' | 'handoff' | 'core'; bow: number }
type ActLayout = Record<string, { x: number; y: number; z: number; state: 'dormant' | 'idle' | 'active' | 'hidden' }>
```

- About 28 nodes: 6 Acquire (paid, SEO, social, YouTube, funnels, lead gen), 7 Sell (inbound, outbound, outreach, appointments, qualification, telesales, sales ops; this is the largest cluster, because Sell is commercial priority), 5 Operate (support, chat, call, retention, CX ops), 6 Build (web, ecommerce, automation, product, UI/UX, integrations), 1 core, plus 3 market nodes used only in act 7.
- `labelKey` points into `content/`; the words come from IA-COPY. Build nodes sit on a **lower plane** (y offset, or z behind in 3D). This is how "Technology is the infrastructure layer" is read spatially. Build edges run *under* other clusters' handoffs.
- Edge `bow` is the perpendicular curve factor, harvested from `HeroInteractiveField.edgeCP`.

### 6.4 Interaction store and frame scheduler

`store.ts` holds one mutable object:

```ts
export const sys = {
  pointer: { x: 0, y: 0, nx: 0, ny: 0, sx: 0, sy: 0, active: false, fine: false }, // px, -1..1, smoothed
  scroll:  { y: 0, progress: 0, velocity: 0 },
  viewport:{ w: 0, h: 0, dpr: 1 },
  theme:   'dark' as 'dark' | 'light',
  reduced: false,
  tier:    0 as 0 | 1 | 2,
  visible: true,              // document.visibilityState
  act:     { index: 1, local: 0 }, journey: { stage: 0, local: 0 },
  focus:   null as SystemId | null, // set by UI (capability panel, inspector)
}
```

- `SystemProvider` attaches **once**: `pointermove` (passive, fine pointers only), `scroll` (passive), `resize` (via ResizeObserver on `documentElement`), `visibilitychange`, the `matchMedia` change listeners for reduced motion and pointer, and **one** MutationObserver on `data-theme`. This replaces the 4 mousemove listeners, 2 scroll listeners and 3 MutationObservers that exist today.
- Discrete changes publish through a minimal `subscribe(key, fn)`. `useSystem('tier')` wraps it with `useSyncExternalStore`.
- `scheduler.ts`: one rAF loop. `addTask(id, fn(dt, t), order)` and `removeTask(id)`. The loop **stops itself** when there are no tasks or `sys.visible` is false, and restarts on demand. `dt` is clamped to 50ms. Task order: 0 smoothing (pointer, scroll), 10 stage controller, 20 canvases (Canvas2D draw or R3F `advance(t)`), 30 overlays and labels, 40 cursor.
- R3F canvases use `frameloop="never"` and are advanced by the scheduler through `advance()` from `@react-three/fiber`. No canvas owns its own loop.

### 6.5 Capability tiers

Computed once on mount, recomputed on `matchMedia` change, and stored in `sys.tier`.

| Tier | Gets it | Renderer | Budget |
|---|---|---|---|
| **0 Static** | reduced motion; `navigator.connection.saveData`; no JS (SSR output); WebGL and Canvas both unavailable | `NetworkSVG`, per-act end states, all labels in DOM | 0 kB extra JS beyond the page |
| **1 Lite** | coarse pointer (any width, so every tablet); or width below 1024; or `hardwareConcurrency` of 4 or less; or `deviceMemory` below 4 | `NetworkCanvas2D`, DPR capped at 2, at most 14 packets in flight, 30fps cap when `local` progress is unchanged for 2s | at most 15 kB gzip chunk |
| **2 Full** | `(hover: hover) and (pointer: fine)` **and** width 1024 or more **and** WebGL2 context creation succeeds | R3F `NetworkScene` | three, R3F and scene code in one dynamic chunk; at most 2 WebGL contexts site-wide (home uses 1) |

The SVG (tier 0) is **always** server-rendered first. Tiers 1 and 2 load after hydration and fade in over it (`base` cross-fade), then hide the SVG with `visibility: hidden`, without unmounting it. So first paint, LCP and no-JS all show a complete composition.

### 6.6 Mounting, pausing, DPR

- `SystemStage` wraps a region. It holds the SVG plus the lazily loaded renderer (`next/dynamic(() => import(...), { ssr: false })`). Its IntersectionObserver uses `rootMargin: '50% 0px'`: start loading the chunk when the region is within half a viewport; add the scheduler task when it intersects; remove the task (pause) when it leaves. The WebGL context is kept while the page lives (no remounts during scroll).
- Tier-2 load starts **after** `requestIdleCallback` (timeout 1500ms) following hydration, never before LCP.
- DPR: WebGL `min(devicePixelRatio, 1.5)`. If the average frame time is over 20ms across 90 frames, drop to 1.25 once, then to 1.0 once. Never raise it again in that session. Canvas2D `min(dpr, 2)`.
- `gl` settings: `antialias: true` at DPR 1.25 or below, otherwise false; `powerPreference: 'high-performance'`; `alpha: true` (the background is the CSS token, not `scene.background`); no postprocessing, no shadows, no lights. Materials are unlit (`MeshBasicMaterial`, `SpriteMaterial` for halos) with `--net-blend`.
- Allocation rule: no `new THREE.*` inside frame callbacks (today `GlobalGrowthScene` allocates a `Color` every frame). Nodes and packets are `InstancedMesh` (sphere 12×8 segments) and updated through `setMatrixAt` plus `instanceMatrix.needsUpdate`. Edges use one `LineSegments2` (`three/examples/jsm/lines`) with per-vertex colour. **`@react-three/drei` is not used in `components/system`**: no `Line`, `Html` or `RoundedBox`. PERF may then remove the package.
- Labels: `SpatialLabel` is a DOM element in an overlay, positioned with `transform` from projected coordinates in scheduler order 30. That gives one overlay per stage, not one portal per node (as drei `Html` does).

### 6.7 Home uses one fixed canvas

The home page mounts **one** fixed full-viewport `SystemStage` (`--z-canvas`) behind acts 1 to 9. DOM sections carry `data-act="1".."9"`. `StageController` measures their offsets (once on resize, through ResizeObserver) and maps `scroll.y` to `{ act, local }`. The scene interpolates between `layouts[act]` and `layouts[act + 1]` by `local`. This is literally one connected system that the visitor scrolls through. On tier 0 there is no fixed canvas: each act renders its own inline `NetworkSVG` figure in normal flow.

Internal pages never mount the fixed canvas (section 8).

### 6.8 Legacy components: harvest, then delete

| File | Harvest | Then |
|---|---|---|
| `HeroInteractiveField.tsx` | Bowed-edge maths (`edgeCP`, `qpt`); per-theme alpha logic (light-mode boost); signal model (speed range 1.5 to 3s per edge, wait, edge "boost charge" while a packet is mid-path, decay 0.958); node breathing (desynchronised frequencies); pulse rings on key nodes; cursor proximity falloff on edges and nodes; the `GLOW_R` pointer glow done as a transform-only div; ResizeObserver and DPR sizing | It becomes `render-2d/NetworkCanvas2D.tsx`, fed by the graph and store, with no own listeners or loop. Then delete it. |
| `ThreeGrowthWindow.tsx` | Five-stage structure; sticky panel plus window composition; camera pose per stage (as spline waypoints); halo ring and point light that follow the active node (redone as an unlit sprite); stage progress ticks (become the `Mark` progress); the vertical-connector list on phones | Rebuilt as act 4 on the shared scene. Its hardcoded `STAGES` copy moves to `content/`. Delete it. The reduced-motion stall dies with it. |
| `GlobalGrowthScene.tsx` | Module-level mutable state pattern (it becomes the store); depth-placed nodes that keep the text centre clear; the golden-angle particle distribution (reused only as the dormant **background field** in act 1, at most 60 points); smooth background colour change between themes | Replaced by the home fixed stage (6.7). It is **not** site-wide anymore. Delete it. |
| `HeroGrowthScene.tsx` | Nothing beyond the DPR cap idea | Delete. |
| `GrowthBars.tsx` | Nothing (3D bars conflict with section 5) | Delete. |
| `OrbitNodes.tsx` | The idea of labelled capability nodes (becomes `SpatialLabel`). The orbit motion itself is "purposeless motion" | Delete. |
| `Hero.tsx` | Capability panel interaction (active row, left signal bar scale-in, focus parity with hover); staggered entrance | The panel becomes the **System index** (act 1). Stats are deleted. The panel's hardcoded copy moves to `content/`. |
| `InteractiveCursor.tsx` | State machine, surface awareness, transform-only rendering | It reads from the store and scheduler (section 9). |

---

## 7. Homepage storyboard (MASTER_BRIEF §12)

Notation: **D** = desktop with fine pointer (tier 2) · **T** = touch tablet, 768 to 1366px, coarse pointer (tier 1) · **P** = phone, below 768px (tier 1) · **RM** = reduced motion (tier 0). Layout keys: `L` text column left, `N` network.

Network arc across the page: **fragmented** (acts 1 and 2) → **reconnecting** (act 3) → **flowing** (acts 4 to 6) → **distributed** (act 7) → **converging** (acts 8 and 9).

### Act 1: Hero, "the connected growth operator"

Purpose: within 3 seconds the visitor reads "marketing, sales, operations and technology run as one system, and Growlatics runs it".

**Composition (D).** A full-viewport section. The fixed network fills the viewport. The text column takes the left 6 of 12 columns at `--container`: eyebrow `label`, H1 `display-xl` (`{HEADLINE}`, at most 3 lines), lead `body-l`, CTAs (primary **Book a Growth Call**, secondary `{SECONDARY_CTA}`). The **text-safe zone** (left 50%, vertical 18 to 82%) holds only dormant background-field points, never active nodes. The four clusters sit right of centre, spread in depth: Acquire top-right, Sell centre-right (largest, nearest the camera), Operate lower-right, Build on the lower plane spanning under all three. The core node sits at about x 62%, y 52%. The **System index** (the evolved capability panel) is a glass panel docked bottom-right: four rows (`01 Acquire … 04 Build`, Sell visually first in weight but kept in this order), each with one-line scope text from `content/`. No stats.

**Intro sequence (D, T)** after hydration; text renders first in SSR:

| t (ms) | Event |
|---|---|
| 0 | Dot grid and dormant nodes are present (from the SVG). Text R1 starts (eyebrow, H1, lead, CTAs at 60ms stagger). |
| 300 | Tier renderer cross-fades in over the SVG (`base`). |
| 400 to 1300 | R4 cluster activation in story order: Acquire, then Sell, then Operate, then Build, 90ms per node. |
| 900 | First packets launch from Acquire. Edges inside each cluster brighten while carrying a packet. |
| 1300 to 2100 | **Handoff edges between clusters fail**: each draws half-way, flickers once to `--net-edge-broken` (dashed) and retracts. The system is capable but disconnected. This seeds act 2. |
| 2100 to 3500 | **Arrival.** The core lights. Five Sell and Build nodes nearest the core slide (R5, `cinematic`) into five vertical columns, then extend upward into the five-bar mark (66:70) at about 140px tall. Every broken handoff re-routes through the core and redraws solid. Packets now flow cluster → core → cluster. |
| 3500+ | Idle: the mark dissolves back to nodes over `slower` (it is not persistent; the header carries the logo). Steady flow at about 10 packets in flight. Node breathing ±9% scale at 0.013 to 0.018 Hz per node. |

The intro plays **once per session** (`sessionStorage` flag). Later visits start at the idle state.

**Pointer (D only).**
- Proximity radius 180px: edges whose midpoint is within the radius rise toward `--net-edge-hot`, and nodes rise by up to +0.38 alpha (harvested falloff).
- **Pointer as router:** a packet whose next hop is within 120px of the pointer takes the hop toward the node nearest the pointer, if that edge exists. The visitor can visibly "pull" flow.
- Parallax: near nodes up to 14px, far nodes 5.5px, or in 3D a camera offset of ±0.35 units, damped with k = 3.5.
- Pointer glow: a 620px radial gradient of `--c-glow`, transform-only.

**System index ↔ network.** Hover or focus on a row sets `sys.focus` to that system. Its cluster goes to `--net-active`, other clusters dim to 40%, packets route only through that cluster and the core, and `SpatialLabel` tags show its node names (`data-s` mono). Leaving clears focus after a 200ms grace. Each row links to its service page.

**T.** The same composition at `lg` and above. At 768 to 1023px the System index moves below the CTAs as a horizontal four-column strip. Canvas2D renders the same layout. No pointer effects. Tapping a row sets focus for 2.5s, and a second tap navigates. The intro plays, with packets capped at 14.

**P.** H1 at the minimum clamp size. The network sits in a band **below** the CTAs (aspect 4:5, full-bleed) and does not run behind text. Clusters are stacked vertically: Acquire top, Sell, Operate, Build at the bottom as the base layer, with the core in the middle. The intro plays at 70% duration. The System index is a list below the band (same rows, 56px tap targets).

**RM.** SSR SVG of the idle state with the mark *not* shown (the header has it). Handoffs are solid. Packets are static dots on active edges. The System index highlights rows without animating the network.

### Act 2: Problem, "fragmented vendors"

**D.** On entering, the camera pulls back and tilts 8°. The core node fades to dormant, and the clusters split into **six islands** (paid, SEO and social, outreach, sales, support, tech) that drift apart along `ease-in-out` with scroll. Each island keeps its internal flow (each vendor works). Handoff edges between islands render `--net-edge-broken` with visible gaps. **Leaks:** about 1 in 3 packets reaching an island edge detaches, slows and falls out of the graph while fading over 1.2s (the lost lead). Three `SpatialLabel` callouts anchor to specific gaps: `{LEAK_1}` lost lead, `{LEAK_2}` split ownership, `{LEAK_3}` no shared data (words from IA-COPY). The text column is on the left with the act headline and 2 to 3 lines.
**T.** The same scene in Canvas2D. Callouts are DOM chips under the canvas, numbered to match markers on the gaps.
**P.** A vertical stack of six islands joined by dashed broken connectors. Leaks are drawn as small dots sliding off connectors (CSS transform, 2.4s loop, 3 at a time). Callouts sit inline.
**RM.** Static SVG: islands, dashed gaps, leaks shown as faded dots outside the graph, callouts visible.

### Act 3: Connection, "Growlatics reconnects"

**D.** Scroll-scrubbed (no timer): the core re-lights at `local` 0.1, and from 0.2 to 0.8 each broken handoff redraws as R2 *through the core*, island by island in story order. Islands compress into the four system clusters. Leaks stop. By `local` 0.9, packets complete full loops (Acquire → Sell → Operate → back), with Build edges pulsing beneath. The headline lands at `local` 0.5.
**T.** Same, in Canvas2D.
**P.** An SVG of the act 2 stack in which the connectors redraw solid through a central core line as the section scrolls (scroll progress drives `stroke-dashoffset`).
**RM.** A before/after pair of static SVGs (act 2 end state on the left, act 3 end state on the right; stacked on phones) with captions.

### Act 4: Growth journey, the cinematic section

Five stages, words `{STAGE_1}`…`{STAGE_5}` from IA-COPY. The section is `data-surface="dark"` in both themes ("inside the machine").

**Scroll space.** D: 500vh, so 100vh per stage (60% dwell, 40% travel). T at `lg` and above: 400vh. T at 768 to 1023px: 400vh. P: normal flow.

**D: camera travel.**
- The camera leaves the act 3 overview and **enters the graph**: it dollies from z 9 to z 3.2 over the first 30% of stage 1's travel. Field of view is 42°.
- A `CatmullRomCurve3` path runs through five waypoints. Each waypoint is a point beside the relevant cluster: `{STAGE_1}` Acquire, `{STAGE_2}` the Acquire→Sell handoff, `{STAGE_3}` Sell, `{STAGE_4}` Operate, `{STAGE_5}` Build (the lower plane, so the camera *descends* for the final stage, looking up at the whole system resting on it).
- Camera position is `curve.getPointAt(u)`, where `u` comes from scroll and is eased per segment. `lookAt` is a point 0.08 further along the curve, blended 30% toward the active cluster centre. Banking is at most 4°.
- At each dwell the active cluster **expands**: its nodes spread out by 1.6×, and `SpatialLabel`s name its capabilities. One "hero packet" (2× size) travels the whole journey with the camera and is always in frame: it is the visitor's lead moving through the system.
- The previous stage's cluster stays lit at `--net-idle` (the trail stays on) and the next one is dormant. By stage 5, all clusters are lit.
- Pointer: parallax only (±0.2 units). No routing here.

**D: DOM.** A sticky left panel (5 of 12 columns, full viewport height minus the header): mono index `0n / 05`, stage name (`label`), title (`display-m`), 2 lines of copy, the capability chips for that stage, and the `Mark` at 28px as progress. Changes use R6. The panel and canvas share one frame: the canvas fills the viewport behind it, and there is no rounded window. The legacy "window in a card" is removed so the journey is spatial, not boxed.

**T.** The same sticky panel. Canvas2D does **2D camera travel**: a pan and zoom transform across a wide flat layout of the same graph (zoom 1.0 at overview, 1.8 at dwell), plus the same expanding clusters and hero packet. At 768 to 1023px the panel sits on top (40vh) and the canvas below (60vh), both sticky.

**P.** No sticky. A **signal rail**: one vertical hairline down the left (24px gutter) with five stage nodes. Each stage is a block (index, name, title, copy, chips) with a small 2D cluster vignette (SVG, 160px tall). The hero packet is a dot on the rail whose `translateY` follows scroll progress through the section (scheduler task, transform only). The rail fills orange behind it.

**RM.** No sticky on any device. Five blocks in normal flow. On D and T each block has a static SVG of that stage's camera framing (cluster expanded, labels on). The rail is fully drawn. Every stage is reachable.

### Act 5: Capabilities, "four systems"

Not cards. **System inspector** (pattern P3, section 8).

**D.** The canvas eases to a **top-down** schematic: four clusters in a ring around the core, with Sell at the 12 o'clock position and drawn 1.25× larger. DOM is a two-column layout: on the left a vertical list of the 4 systems (name, one line, the service page link), with Sell first and pre-selected; on the right a detail panel showing that system's capability nodes as an **SVG schematic** (inputs on the left edge, capabilities in the middle, outputs on the right edge) with 1-line descriptions. Selecting a system sets `sys.focus` and the canvas cluster lights to match. Keyboard: list = `tablist` with arrow keys.
**T.** Same, with tap. At 768 to 1023px the list becomes a horizontal segmented control above the panel.
**P.** Accordion: four sections, Sell open by default, each holding its schematic (it scales to the width; inputs and outputs stack vertically).
**RM.** Same UI. Panel swap is instant.

### Act 6: Why integration matters

**D, T.** A **trace comparison**, two horizontal lanes stacked. The top lane is "separate vendors": one lead's packet passes through 4 owners, with a broken edge at each handoff where it pauses, dims, and one branch drops. The bottom lane is "one operating system": the same route through the core, continuous, with the same owner label throughout. The lanes play side by side when in view, at the same speed, and replay on demand (button "Replay trace"). No numbers, percentages or timings shown. The visible gaps are the evidence. Below sits a three-row ledger (pattern P5): `{REASON_1..3}` (for example, one owner of the funnel, shared context across handoffs, systems built where the work happens). Words come from IA-COPY.
**P.** Same lanes, stacked vertically and narrower. Auto-plays once in view.
**RM.** Both lanes drawn at their end state (the top one with its gaps and drop, the bottom one complete).

### Act 7: Global delivery

**D, T.** The network **distributes**: the canvas layout spreads into a horizontal 24-hour band (a hairline ribbon with hour ticks every 3h in mono `data-s`). Three market nodes (US, UK, Pakistan), each placed at its UTC offset, with packets passing between them. The label reads "US / Pakistan business · serving US, UK, Pakistan and international clients" (from content). **No world map, no pins on cities, no branch addresses, no coverage-hours claim.** The band is drawn from data only.
**P.** The same band, rotated vertically.
**RM.** Static band and nodes.

### Act 8: Work and proof architecture

No proof exists, so `content/proof.ts` is empty and renders nothing. This act shows **how an engagement runs** as a horizontal signal rail (pattern P2) with **four** phases (`{PHASE_1..4}` from IA-COPY). It must not be five, so it does not echo the journey. Each phase is a node with title, line, and "what you get" as a mono tag list. The canvas dims to 50% here so the DOM leads. When proof content exists later, a `ProofSlot` renders below the rail; until then no placeholder, "coming soon" or empty frame is shown.
**P.** Vertical rail. **RM.** Static.

### Act 9: CTA, convergence

`data-surface="dark"`. **D, T.** As the section enters (`local` 0 to 0.7, scroll-driven), every cluster contracts toward the core and all packets route inward. At `local` 0.7 the core resolves into the five-bar mark at 96px (R5, then R3 for the last 20%). The headline `display-l` sits under the mark, with one line of copy, the primary **Book a Growth Call** button (`--sh-signal`, `data-cursor="cta"`) and the secondary contact line (email and phone from content). Hovering or focusing the primary button sends one pulse outward along every edge (`slower`). After convergence the scene idles with low flow toward the mark.
**P.** The SVG mark rises with R3 and three converging lines trace in from the edges (R2).
**RM.** The mark is static, lines are drawn, and the button is fully present.

---

## 8. Internal pages: intensity and patterns

### 8.1 Intensity levels

| Level | Pages | Network | Motion |
|---|---|---|---|
| **L3 Cinema** | Home | fixed home stage, tiers 0/1/2 | full system |
| **L2 Instrument** | Services, the 4 service pages, About | **one** local `SystemStage` in the page hero (tier 2 allowed on D; otherwise 1 or 0), showing only that page's cluster plus its handoffs to the others in `--net-dormant`. Everything else is SVG schematics. | R1 to R4 on scroll; one scroll-scrubbed schematic per page at most |
| **L1 Clarity** | Contact, Work, Privacy and Terms drafts | none; a static `Mark` and hairlines only | R1 only |

On service pages the hero cluster is that service's system, at **full** detail. Sales & BPO's hero shows the Sell cluster with inbound and outbound lanes and an appointment handoff to the client's calendar node. Technology's hero is shown from below: the Build plane with the other three clusters resting on it.

### 8.2 Reusable section patterns (FOUNDATION builds them in `components/patterns/`)

| ID | Pattern | Shape | Use for |
|---|---|---|---|
| P1 | **System schematic** | An SVG diagram from graph data: inputs → capabilities → outputs, with mono labels and R2 trace on reveal | what a service does, how it connects |
| P2 | **Signal rail** | A hairline (horizontal from `lg`, vertical below) with numbered nodes and a block per node | process, engagement model, About timeline |
| P3 | **Inspector** | A list (tablist) beside a detail panel; on phone an accordion | capability sets, FAQs that matter |
| P4 | **Statement** | One `display-m` sentence, at most 2 lines, between two hairlines, with optional mono tag | philosophy beats, transitions between acts |
| P5 | **Ledger** | A two-column definition table (term | description) with hairline rows and mono index; no boxes | service scope lists, "what's included", reasons |
| P6 | **Handoff strip** | A horizontal row: `[upstream system] → this service → [downstream system]` with the live edge animated | the top of each service page, so connection is always visible |
| P7 | **Convergence CTA** | A compact act 9: mark plus headline plus primary CTA on `data-surface="dark"` | the end of every page except Contact |
| P8 | **Qualification flow** | A stepped form (at most 5 steps) with `Mark` progress, one question per step, a review step, then hand-off to `lib/leads/` | `/contact/` |

Rules:
- **No grid of 3 or more equal cards** anywhere. When items are peers, use P3 or P5.
- No alternating left/right image and text sections. No stock imagery, no illustrations of people, no device mockups.
- Icons: `lucide-react` at 16px stroke 1.5, only as functional affordances (arrow, external link, check, menu). Never as a feature-card ornament.
- Every internal page has at least one P1 or P6, so the "connected system" idea appears on every page.
- Proof components (`TestimonialSlot`, `LogoRow`, `CaseStudyCard`, `MetricSlot`) render `null` when their content array is empty.

---

## 9. Cursor evolution

Keep: the dot and ring, transform-only rendering, touch exclusion, and surface-aware colour. Change:

1. **Bug fix.** Today `@media (pointer: fine) { * { cursor: none !important } }` hides the native cursor even when the component chose not to render (reduced motion), so those users get **no cursor at all**. Remove that rule. Hide the native cursor **only** under `.custom-cursor-active`.
2. **Gate.** The custom cursor runs only when `fine` **and** not `reduced`. Otherwise the native cursor shows.
3. **Runtime.** No own listeners or rAF loop. It reads `sys.pointer` and runs as scheduler task order 40. Damping: dot k = 40 (effectively 1:1), ring k = 14.
4. **Colours from tokens.** Dot `--c-text` (default) or `--c-signal` (any interactive state). Ring `rgb(var(--c-line-3))` default, `--c-signal-line` interactive. Glows use `--c-glow`. Because `data-surface="dark"` re-declares the tokens, surface awareness is automatic and the `RING_*_DS` tables are deleted.
5. **States.**

| State | Trigger | Dot scale | Ring scale | Ring style |
|---|---|---|---|---|
| `default` | anything | 1 | 1 (28px) | `--c-line-3` |
| `interactive` | `a`, `button`, `[role=button]`, `[data-cursor="interactive"]` | 1.25 | 1.42 | `--c-signal-line` |
| `cta` | `[data-cursor="cta"]` | 1.45 | 1.72 | `--c-signal`, `--sh-signal` glow |
| `panel` | `[data-cursor="panel"]` (System index, inspector) | 1.1 | 1.28 | `--c-signal-line` at 60% |
| `node` (new) | the pointer is within 48px of a live network node on the home stage | 1.2, `--c-signal` | 0.72 | solid `--c-signal`. The ring tightens around the node like a probe. |
| `text` (new) | `input`, `textarea`, `[contenteditable]` | hidden | hidden | the **native I-beam shows** (class `cursor-native` on the field) |

6. **Linking to the network** (home only, tier 2): while the cursor is within 120px of a node, draw one hairline (`--net-edge-hot`, 1px) from the ring to that node. The cursor reads as a node in the system. Fade over `fast`.
7. The cursor is never part of the accessibility tree (`aria-hidden`). Focus-visible rings are always on and never depend on the cursor.

---

## 10. Do not, and acceptance checklist

### 10.1 Do not

- Do not add colours, fonts, easings, radii or shadows outside this file. No hex or rgba literals in `.tsx`.
- No purple, blue or teal; no cool greys; no gradients except the radial `--c-glow` stop; no gradient text; no neon glows; no blobs; no glassmorphism outside section 2.3.
- No sphere-in-hero, globe, world map with pins, orbiting nodes, floating 3D bars, or particles without graph meaning. Every dot is a node, packet or field point defined in the graph.
- No grid of 3 or more equal cards, alternating image/text, stock imagery, device mockups, people illustrations or icon-card trios.
- No metric counters, percentages, client counts, logos, testimonials, "24/7" or "10+ industries" unless they come from approved `content/proof.ts` data. No "coming soon" proof placeholders.
- No stating Lahore, London or any office address as a branch.
- No new dependencies (no GSAP, Lenis, Locomotive, Spline, Lottie, postprocessing). No drei in `components/system`.
- No `requestAnimationFrame`, `mousemove`, `pointermove` or `scroll` listener outside `components/system/runtime`. No `useState` updates per frame. No `new THREE.*` in frame callbacks.
- No WebGL on touch devices, below 1024px or under reduced motion. No more than 2 WebGL contexts.
- No scroll-jacking, snap, smooth-scroll libraries, wheel interception or timer-driven stage changes.
- No content hidden behind hover only, behind a scroll position under reduced motion, or behind JS. The tier-0 SVG and the DOM text must tell the whole story on their own.
- No per-letter text animation, no looping attention-grabbers on CTAs, no autoplay sound or video.
- No five-bar geometry other than section 5, and no extruded 3D bars.
- No route-change full-screen wipes.

### 10.2 Acceptance checklist (reviewers)

Tokens and type
- [ ] `grep -E "#[0-9A-Fa-f]{3,8}|rgba?\(" components app --include=*.tsx` returns hits only in `components/system/model/palette.ts`.
- [ ] Tailwind config has no `surface.*`, `text.*` or cool hex values. `globals.css` has no `@import url(`.
- [ ] Inter and JetBrains Mono load through `next/font/google`. No request to `fonts.googleapis.com` at runtime.
- [ ] Every text token pair meets WCAG AA (4.5:1 for body, 3:1 for at least 24px or 700-weight 18.66px) in both themes and on `data-surface="dark"`.

Story and design
- [ ] Every homepage act exists in order, and each one reads correctly with JS disabled (SSR SVG plus DOM).
- [ ] The network visibly goes fragmented → reconnected → flowing → converged on the CTA mark.
- [ ] The journey has exactly 5 stages, and all 5 are reachable with reduced motion on desktop, tablet and phone.
- [ ] Sell is the visually dominant cluster. Build reads as the layer underneath.
- [ ] No banned pattern from 10.1 appears. Every internal page contains P1 or P6.
- [ ] The five-bar mark uses 32/52/70/86/100 everywhere (header, hero arrival, journey progress, CTA, favicon).
- [ ] Light and dark themes are both art-directed (alphas per section 2.2), not an inversion. Theme switching recolours canvases without a reload or a flash.

Performance and lifecycle
- [ ] `/` First Load JS is at most **200 kB** (baseline 363 kB). three and R3F are absent from the initial chunks and load only for tier 2.
- [ ] One rAF loop (verify with a performance trace). It stops in a background tab and when no stage is in view.
- [ ] Exactly one listener each for pointermove and scroll on `window` (check `getEventListeners(window)` in DevTools).
- [ ] At most 1 WebGL context on home and at most 1 on any other page. None on touch, below 1024px, or under reduced motion.
- [ ] Home on a 2020 MacBook Air at 1440×900 holds at least 55fps during the journey. An iPad (tier 1) holds at least 50fps. A mid-range Android holds at least 50fps.
- [ ] LCP element is the hero H1 and is not delayed by canvas code.

Interaction and accessibility
- [ ] Custom cursor only with fine pointer and without reduced motion. The native cursor is visible in every other case, and over text fields.
- [ ] All hover reveals also work on focus and tap. Tap targets are at least 44px on touch. System index and inspector work by keyboard.
- [ ] Tablet in landscape at 1024 to 1366px with a coarse pointer gets tier 1, no pointer effects, and a working sticky journey.
- [ ] `npm run build` (static export), `npx tsc --noEmit` and `npm run lint` are clean.
