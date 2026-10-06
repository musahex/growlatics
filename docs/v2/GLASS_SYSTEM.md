# Glass system — usage note for 9b GLASS-PAGES

Source: `app/globals.css` (tokens + `.glass*` utilities + header rules), `components/ui/Glass.tsx`. Brief: `docs/v2/GLASS_BRIEF.md` §7–10, §14. 9b adds no new tokens (ask god).

## API

```tsx
import Glass, { glassClass } from '@/components/ui/Glass'

<Glass variant="base" className="p-6">…</Glass>           // div by default; as="aside|section|nav|figure|form|ul|li"
<Glass variant="elevated" signal>…</Glass>                // active state
<div className={glassClass('base', { inner: true }, 'p-4')} />  // class string; inner = smaller radius
```

Plain classes also work: `glass`, `glass-elevated`, `glass-dark`, `glass-light`, modifier `glass-signal`, radius `rounded-liquid` / `rounded-liquid-inner` (Tailwind variants OK, e.g. `lg:glass`).

## Variants

| Variant | Class | Use | Do not use |
|---|---|---|---|
| BASE | `glass` | Standard floating UI: control panels, system labels/callouts, stage/progress indicators, the contact form shell, popovers | Paragraphs, sections, headings, large content blocks, card grids |
| ELEVATED | `glass-elevated` | Header (already done), the hero capability panel, high-priority overlays, dropdowns | More than one per viewport besides the header |
| DARK | `glass-dark` | Dark glass over a light background. `<Glass variant="dark">` sets `data-surface="dark"` so the text tokens flip | Inside dark theme (BASE already is dark there) |
| LIGHT | `glass-light` | Ivory glass over a dark visual, only if a design truly needs it. Material only: set dark ink on text yourself (no `data-surface="light"` exists) | Default choice; avoid unless needed |
| SIGNAL | `+ glass-signal` | The active/selected state of a glass surface: orange edge + faint inner glow | Idle surfaces. Neutral = inactive, orange = active (§10) |

State is never shown by glass/colour alone: pair `glass-signal` with `aria-current`, `aria-pressed`, `aria-selected` or a text/shape change.

## Tokens (both themes)

`--glass-tint` (channels), `--glass-a` (bg alpha), `--glass-a-solid` (fallback alpha), `--glass-blur`, `--glass-sat`, `--glass-edge`, `--glass-hi` (inner top highlight), `--glass-sheen` (top-down inner gradient), `--glass-shadow`, `--glass-signal-edge`, `--glass-signal-glow`, `--r-glass` (26px), `--r-glass-inner` (14px).
Header geometry: `--hdr-y`, `--hdr-x`, `--hdr-h`, and **`--header-clear`** (safe area + offset + height; Tailwind `pt-header-clear`, `top-header-clear`).
Legacy `--glass-bg` / `--glass-line` still resolve; `.glass` is now the BASE variant (the one existing consumer, `components/home/acts.tsx` `lg:glass`, keeps working).

Corners: `rounded-liquid` uses `corner-shape: squircle` (continuous curvature) where supported, otherwise a faintly elliptical radius. Do not substitute `rounded-2xl`.

## Header (done in 9a, for reference)

- Floating, detached, centred, max width ≈ container + 40px; 60/64/72px tall at phone/tablet/desktop; 10/16/22px from the top.
- Scroll response is CSS only: a scroll timeline drives `--hk` 0→1 over the first 160px (alpha +0.32, blur +12px, shadow opacity, a 4px lift). Without scroll-timeline support (Firefox today) it stays at the readable scrolled state. No JS listener.
- Links on the true centre line; current route = glass well + 4px signal dot + `aria-current`; hover = a neutral hairline.
- CTA: solid signal with an inner glass highlight; magnetic (max 6px) on fine pointers only, through the shared scheduler while hovered; off under reduced motion.
- Phone/tablet: own layout (mark + name, CTA as calendar icon below 640px, "Book a call" 640–767, full label from 768, menu toggle). The menu unfolds the same glass surface downward (`grid-rows 0fr→1fr`; reduced motion = fade). While open: rest of the page `inert`, scroll locked, Tab wraps, Escape closes and returns focus. The theme toggle moves into the menu below 640px.
- Nav content now includes Home (brief §4).

## Rules for 9b

1. **Page tops must clear the header.** Use `pt-[calc(var(--header-clear)+…)]` or `scroll-mt`. `html` already has `scroll-padding-top: calc(var(--header-clear) + 16px)`. Known tight spots: home hero eyebrow at 1440 sits ~25px under the bar (`acts.tsx` `lg:pt-28`); PageHero `pt-32/40` is fine.
2. **Budget: at most 2 backdrop-filter surfaces in a viewport** (header + one). No nested glass (a backdrop-filter inside another one only blurs its parent). No full-screen or section-sized blur layers.
3. Never animate size/position of a glass surface per frame; animate opacity/transform of its contents, or of the whole surface with `transform` only.
4. Glass over the WebGL stage: keep it small and static; text inside must stay ≥ 4.5:1 against the worst pixel behind (verify with a screenshot, axe cannot see through backdrop-filter).
5. No glass card grids, no glass on every section; keep large clean spaces (§8). Services = systems/capabilities, About stays editorial.
6. Under `prefers-reduced-motion`, glass surfaces appear with a fade, never a drop/scale.

## Measured (9a, 1440×900, tier-2 WebGL home, Apple M5, 120 Hz, 3 interleaved runs, 240 wheel steps)

| | avg frame | p95 | p99 | frames > 20 ms |
|---|---|---|---|---|
| header blur on | 8.42 ms | 9.1 ms | 9.3 ms | 0–1 |
| header blur off | 8.34 ms | 9.1 ms | 9.3 ms | 0 |

No measurable cost on this GPU. Real mid-range phones are not measured.
