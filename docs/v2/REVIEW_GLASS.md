# Growlatics v2 — Phase 9c creative review of the glass pass

Reviewer: worker-gl-review-glass (temp). Branch `v2-review-glass` from v2 `cecfaf8`. Date 2026-10-06. Report only, no code changed.
Judged against `GLASS_BRIEF.md` (§2–3, §9–10, §13–15), `GLASS_SYSTEM.md`, `GLASS_PAGES.md`.

**Overall verdict: ITERATE (small).** The glass reads as premium and selective, not "glass everywhere". The header passes the §2 test. Three surfaces need work before acceptance: the mobile/tablet menu (legibility), Contact (not yet the "exceptional" surface the brief asks for), and Sales & BPO (three full-width glass slabs in a row). Everything else: ACCEPT.

## How this was checked

- `npm run build` → `out/`, served by request interception in headless Chromium 1228 (Metal GPU, tier-2 WebGL at 1440). Intro skipped (`gl-intro` session flag), theme set by `localStorage`.
- Sizes: 1440×900 desktop; 390×844 phone and 820×1180 tablet portrait (touch, DPR 2). Dark and light for each.
- Shots: hero top, hero scrolled 400px, acts 2/4/5, menu open (390, 820), Services dropdown (1440), Sales & BPO (top, mid, mid2), Services, Contact. 0 page errors.
- Header material read from computed style: dark `rgba(12,11,10,.40)` blur 14px at the top → `.72` blur 26px when scrolled; light `.46` / 12px → `.78` / 24px. Matches §3 (lighter at top, denser after scroll).
- Before shots (pre-glass): `/Users/moses/HarnessAgents/hive/agents/god/growlatics-v2-screenshots/`.

Screenshot folder (not in git): `/Users/moses/HarnessAgents/hive/agents/worker-gl-review-glass/screenshots/`. Names: `<shot>-<width>-<theme>.png`.

## Ranked findings (fix in this order)

| # | Surface | Verdict | Problem | Concrete fix | Evidence |
|---|---|---|---|---|---|
| 1 | Mobile + tablet menu (open) | **ITERATE (P1)** | Opened at the page top, the menu uses the header's *top* material (alpha .40/.46, blur 12–14px). The hero H1 behind it shows through as large grey smears behind Work / About / Contact. This is the "muddy glass / transparent text box over busy content" the brief forbids (§1, §2). Worst in light at 820. | While the menu is open, pin the header material to its scrolled state (`--hk: 1` on the open header) and add an alpha floor for the panel (about .90 light, .86 dark). Blur alone will not hide 60–80px type. | `menu-820-light.png`, `menu-390-light.png`, `menu-390-dark.png`, `menu-820-dark.png` |
| 2 | Contact qualification shell | **ITERATE (P2)** | Next to the pre-glass shot it is almost the same object: a dark card with a border, now with a liquid radius. The choice tiles are bordered boxes inside that card (box in a box). In light at 390 it reads as a white form card with white tiles: generic. §11 asks for "an exceptional qualification experience". | Keep one flat glass shell, change what is inside it: (a) tiles become inner wells (`rounded-liquid-inner`, faint fill, no 1px border), selected = `glass-signal` + the checked input; (b) "Step 1 of 5" becomes a 5-segment progress rail in the shell's top edge, current segment orange; (c) Continue sits in a footer row separated by a hairline. No new tokens needed. | `contact-top-1440-dark.png` vs before `contact-1440-dark-p01.png`; `contact-top-390-light.png` |
| 3 | Sales & BPO page rhythm | **ITERATE (P3)** | Three container-wide glass surfaces in a row down the page: hero handoff strip, capabilities schematic, "How it works" strip. Each is fine alone; together the page reads as repeated slabs, and the schematic panel is close to section-sized (§8 "never large content blocks"). | Drop the glass from the capabilities schematic (it is a diagram; let it sit on a clean field with its hairlines, like act 6 on home). Keep glass on the two handoff strips (lanes → Sell → calendar, CRM ↔ team ↔ closers), which is where §11 asks for it. | `sales-bpo-mid2-1440-light.png`, `sales-bpo-top-1440-dark.png` |
| 4 | Tablet header with menu open | **ITERATE (P3)** | At 820 the bar keeps its full "Book a Growth Call" button while the open panel shows a second full-width one. Two orange CTAs in one surface. 9b hid only the phone icon CTA. | Apply the same `invisible`-while-open rule to the bar CTA at every width below `lg`. | `menu-820-light.png`, `menu-820-dark.png` |
| 5 | Services dropdown (1440) | **ITERATE (P3, interaction, pre-existing)** | Glass looks right (ELEVATED, liquid radius, legible over act 2). But for a mouse user, hovering opens the panel and clicking the chevron then closes it: `onMouseEnter` opens, `onClick` toggles. Probe: hover → click → panel `hidden`. The open chevron also renders as a small orange dot in a ring; check that this is intended. | In `ServicesMenu` (`components/layout/Header.tsx`), make the chevron click set `open = true` when the open came from hover (or ignore the click within ~300ms of a hover-open). Keyboard toggling unchanged. | `dropdown-1440-dark.png`, `dropdown-1440-light.png` |
| 6 | Home hero System index (1440) | ACCEPT (minor note) | The strongest glass after the header, as asked. Rows as inner wells, Sell carries the only orange hairline. Note: at the top of the page its bottom edge sits about 11px above the 900px fold. When scrolled, Build nodes pass under its bottom-right corner. Both minor. | Optional: trim 16–24px from the hero's vertical rhythm so the panel's bottom edge sits clear of the fold. | `hero-top-1440-dark.png`, `hero-scrolled-1440-dark.png` |

## Per-surface verdicts

| Surface | Verdict | Notes | Shots |
|---|---|---|---|
| Desktop header (§2 test) | **ACCEPT** | With logo and text removed it is still a designed object: detached 22px, centred, continuous corners (squircle), warm dark / ivory glass, hairline edge, inner top highlight, soft ambient shadow. Active route = glass well + 4px dot. CTA solid signal, clearly stronger than the links. Light glass is warm ivory, not cold white. Clear upgrade over the flat pre-glass bar. | `hero-top-1440-*`, `hero-scrolled-1440-*`, before `home-1440-dark-p01.png` |
| Header scroll behaviour (§3) | **ACCEPT** | Alpha +.32, blur +12px; text scrolled behind it is unreadable in both themes, as intended. Over the black hero the top/scrolled difference is subtle, which is correct. | `hero-scrolled-1440-*` |
| Phone header | **ACCEPT** | Its own layout (mark + name, calendar icon CTA, menu). Not cramped at 390. The solid orange 44px icon tile is the heaviest element in the bar but is the CTA, so acceptable. | `hero-top-390-*` |
| Tablet header | ACCEPT closed; see #1 and #4 open | Full CTA label + theme + menu fit cleanly at 820. | `hero-top-820-*` |
| Mobile menu (open) | **ITERATE** | #1, #4. Shape and unfold are right (one continuous surface, CTA at the bottom, theme toggle inside); the material is too thin. | `menu-*` |
| Home act 1 hero | **ACCEPT** | See #6. Typography stays on the scene; no glass on H1/lead/CTAs. Eyebrow now clears the bar (40px). | `hero-top-*` |
| Home act 2 leak chips | **ACCEPT** | Small, neutral, mono, flat; no collisions in these shots. They read as system labels, not cards. | `act2-1440-*` |
| Home act 4 stage card | **ACCEPT** | One card per viewport, system radius. The 9b note (ivory header reading grey over the black act-4 section in light) did not show at my scroll position; the header sat over the light band above the section. Not confirmed either way. | `act4-1440-light.png`, `act4-1440-dark.png` |
| Home act 5 inspector | **ACCEPT** | The one glass panel in the viewport; network stays dominant on the right. Orange is at its densest here (selected row fill + "Runs" tags + lit nodes) but it is all *active* state, so §10 holds. Tall trigger rows are a known pre-existing grid issue. | `act5-1440-*` |
| Acts 3, 6–9 | **ACCEPT** | Deliberately no glass; large clean spaces kept. | — |
| Services hub / service heroes | **ACCEPT** | One flat handoff strip; the current system is the only orange (SIGNAL) well. No glass card grid. | `services-top-1440-*`, `services-mid-*` |
| Sales & BPO | **ITERATE** | #3. Hero strip and "How it works" strip are good, operational-looking glass. | `sales-bpo-*` |
| Contact | **ITERATE** | #2. | `contact-*` |
| Theme consistency | **ACCEPT** | Same variants and radii in both themes; light glass is warm. | all |
| Orange discipline (§10) | **ACCEPT** | Neutral idle / orange active holds on every surface checked. Only borderline spot: act 5 (all active state). | all |
| Blur budget (§9, SYSTEM rule 2) | **ACCEPT** | Header + at most one blurred surface per viewport in every shot; everything else is flat glass. No full-screen blur layers. | — |

## Not checked

- Frame cost of glass on real mid-range phones or GPUs (only this Mac's GPU).
- Reduced-motion menu fade and keyboard paths (owned by the tech/QA review).
- Pages other than Home, Services, Sales & BPO and Contact were not reshot (About, Work, legal pages have no glass by design).

## Iterate

Phase 9d, worker-gl-glass-iterate (temp). Branch `v2-glass-iterate` from v2 `e102d33`. Date 2026-10-06. Not pushed, not deployed.
After-shots (not in git): `/Users/moses/HarnessAgents/hive/agents/worker-gl-glass-iterate/screenshots/`. Names: `after-<shot>-<width>-<theme>.png`.

| # | Finding | Fix | Commit | After-shots |
|---|---|---|---|---|
| 1 | Menu opened at the page top uses the top-of-page alpha; hero H1 smears through | While `.hdr-panel[data-open]` the bar pins the scrolled blur and shadow, alpha floor `--glass-a + .25` (light .91, dark .85, read from computed style). Via `--glass-a`, so the `data-surface="dark"` switch still applies; flat mode's `!important` solid alpha still wins. CSS only (`:has`). | `995fcb5` | `after-menu-top-{390,820}-{dark,light}.png` |
| 2 | Contact: box in a box, generic | Tiles are inner wells (`rounded-liquid-inner`, faint fill, no border), selected = `glass-signal` inner glass. 5-segment rail on the shell's top edge (current orange, done neutral). Footer row under a hairline: Mark + "Step n of 5" (still `aria-live`) left, Back / Continue right. No copy change; keyboard, error focus and lib/leads flow unchanged. | `f20630e` | `after-contact-{1440,820,390}-{dark,light}.png` |
| 3 | Sales & BPO: three glass slabs in a row | Capabilities schematic sits on the clean field, no glass. Hero lanes strip and "How it works" CRM strip keep theirs. | `0b4d7b2` | `after-sales-bpo-schematic-*`, `after-sales-bpo-top-*` |
| 4 | 820: two orange CTAs with the menu open | Bar CTA gets `invisible lg:visible` while open (note: `max-lg:` is not generated in this config, raw screens disable max-* variants). Probe: 1 visible "Book" CTA in the header at 390 and 820, both themes. | `ca7662d` | `after-menu-top-820-{dark,light}.png` |
| 5 | Services dropdown: hover-open then chevron click closes it | A mouse click on a hover-opened panel pins it (mouse-leave no longer closes); a second click closes. Keyboard (click `detail` 0) toggles as before; Escape still returns focus to the toggle. Probe: hover open → click open → leave open → click hidden; Enter open → Enter hidden; Escape hidden, focus on toggle. | `689db6b` | — (interaction; probe output above) |
| 6 | Touch 1024 tier 1: Build nodes under the System index edge (GLASS_QA §4.4) | Act 1: Build x .82 → .87, r .1 → .09 (landscape and 1440). Portrait key: Build y .73 → .69, r .09 → .08 (same issue at 1024×1366). | `d57951c` | `after-tier1-touch-1024-{landscape,portrait}.png` vs `before-…` |

Gates: `npm run build` pass, routes unchanged (/ 165, /contact 152, /services/[slug] 161 kB) · `tsc --noEmit` pass · `next lint` 0 · `seo-crawl` 0 problems · `lib/leads` selfcheck ok · axe (WCAG 2 A/AA + best practice) **0 violations, 0 page errors on 30 runs**: /, /services/sales-bpo/, /contact/ × 390/820/1440 × dark/light, plus menu open at 390 and 820 · Contact keyboard-only run through all 5 steps at 1440 and 390 ends on the mailto heading with focus on it; Continue with nothing chosen focuses the first option and shows the error.

Act 1 at 1440 tier 2 after the Build nudge: Build clear of the System index (`after-hero-top-1440-dark.png`). Not checked: real devices.
