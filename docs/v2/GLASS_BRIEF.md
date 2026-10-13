# Growlatics v2 — Owner brief: glass material system + floating header (2026-10-06)

Condensed faithfully from the owner's UI polish brief. This is a polish pass, NOT a redesign: the creative concept, IA, nine-act story, network metaphor, motion system, 3D architecture and page structure are accepted and must not regress. Where this file and a worker's taste disagree, this file wins. (The owner's reference image did not reach the orchestrator; work from the description below.)

## 1. Direction
Glass is a material SYSTEM layered above the Growlatics operating system, not decoration. Feel: premium, futuristic, cinematic, spatial, technical, polished, restrained. NOT: frosted cards everywhere, over-blur, transparent text boxes over busy visuals, literal Apple UI, neon/cyberpunk, crypto dashboard, generic SaaS glass, excessive rounded cards. The network/signal narrative stays dominant; glass supports it. Use glass where UI should feel floating, interactive, layered, persistent, elevated, system-like.

## 2. Floating header (required)
- Detached: ~20–32px below the viewport top, never touching left/right edges (~16–28px side margin on smaller desktops), centred, max width ≈ main content or slightly wider, height ≈ 68–80px.
- Shape: rectangle with very soft, continuous, "liquid" corners (≈24–30px, tuned elliptical or superellipse-like). NOT a pill, NOT sharp, NOT plain `rounded-2xl`. Prefer CSS; avoid expensive masks.
- Material, dark: very dark warm glass from the #070605 / #0C0B0A family; translucent enough to show motion behind, opaque enough for excellent legibility. Light: warm ivory/white glass, never sterile cold white.
- Treatment: colour-mix/rgba from canonical surface tokens; backdrop blur + subtle saturation; ~1px low-alpha border; faint inner top highlight; soft ambient shadow (not a harsh box shadow); no muddy glass.
- Test: with logo and text removed, the bar must still read as a deliberately designed premium object (proportion, curvature, transparency, depth, interaction). It must not be `bg-black/80 rounded-2xl backdrop-blur-xl` with no further thought.

## 3. Scroll behaviour
At top: lighter, more transparent, integrated with the hero. After scroll: modestly more opaque, more blur and depth, always readable over complex sections. Smooth interpolation, no state jumps. Slight vertical compression is allowed if elegant; no gimmicky shrinking. Do not auto-hide.

## 4. Content
Left: the Growlatics mark/identity. Centre: Home, Services, Work, About, Contact (a careful Services dropdown only if it improves UX; no generic mega-menu). Right: the theme control + the primary CTA "Book a Growth Call", with stronger material contrast than the links (solid orange, orange-tinted glass with strong edge, or an inverse treatment with an orange interaction state; pick the most premium). Never the reference's blue.

## 5. Micro-interactions
Soft active-route indicator / glass highlight under the active link, a magnetic or cursor-responsive CTA, a small line/signal hover, restrained icon motion, a smooth mobile-menu morph. No bouncing, exaggerated scale, oversized underlines or generic navbar hovers. Default easing [0.16, 1, 0.3, 1].

## 6. Mobile header
Its own design, not a squashed desktop bar: floating, detached glass container, mark/name, compact menu control, CTA as an icon or short label by width, safe-area aware, touch targets compliant. The menu opens as glass unfolding downward from the header (continuous rounded surface), not a generic full-screen overlay. Reduced motion: a simple fade/height transition.

## 7. Glass system
A few reusable variants, small API: BASE (standard floating UI), ELEVATED (header, high-priority overlays), DARK (over light backgrounds), LIGHT (over dark, if needed), SIGNAL (subtle orange-reactive active state). Tokenise: background opacity, blur, saturation, border alpha, top highlight, shadow, radius, inner glow, orange active tint. Correct in both themes.

## 8. Where to use glass
Priority: navigation, hero capability/control panel, service exploration interfaces, system labels/callouts, interactive network overlays, stage/progress indicators, qualification/contact UI, floating contextual labels, selected feature cards, mobile menu, popovers, selected CTA surfaces. Possible: Sales & BPO operational interface, CRM ↔ Growlatics diagram controls, global delivery UI, contact form shell, service navigation, page hero metadata. Never automatically: every paragraph, section, heading, large content block, page background or card. Keep large clean spaces.

## 9. Glass over 3D
Foreground glass UI → middle typography → background network. Text stays legible; few backdrop-filter surfaces; no huge full-screen blurred layers; no stacked blurs; no continuous-repaint bottlenecks. Profile glass over moving WebGL; if an effect is expensive, use a visually equivalent cheaper one.

## 10. Orange
#D2401A stays the active-state colour. Idle glass is neutral/warm; only active glass may get subtle orange (edge glow, inner gradient, active border, signal reflection, moving highlight). NEUTRAL = inactive infrastructure, ORANGE = active signal. Do not regress to "everything is orange" (fixed in creative review).

## 11. Pages
- Home: audit all nine acts; glass reinforces hierarchy; no repeated card treatment; the scenes stay dominant; text separated from animation. The hero gets the strongest glass after the header.
- Services: glass for systems/capabilities, never a generic glass-card grid.
- Sales & BPO (commercial priority): operational infrastructure feel; glass on inbound/outbound lanes, operational modules, the CRM connection, workflow detail; a system a business plugs into.
- Performance Marketing: campaign/channel fragments, signal flows; no fake dashboards or data.
- Customer Operations: controlled operational UI, not generic cards.
- Technology: glass as the infrastructure / control layer.
- About: restrained, editorial; no forced glass/3D.
- Work: future-ready; no fabricated case studies.
- Contact: an exceptional qualification experience; a premium glass form/control surface fits.

## 12. Owner decisions (confirmed, apply)
- A. Claims: keep only factual service/capability wording. Remove or soften anything implying unverified results, scale, client volume, performance, ROI, revenue impact, team size or unsupported geographic presence. No invented numbers, no fake evidence. Descriptive wording such as "managed sales capacity" may stay. Genuinely ambiguous items go into `docs/v2/OWNER_VERIFY.md`; they do not block the build.
- B. Proof: no testimonials, quotes, people, logos, customer names or figures. Keep the dormant proof architecture; render nothing (no empty proof sections) when content is empty.
- C. Privacy/Terms: may be structurally complete, but the legal entity name is a clearly marked owner-required placeholder. No fabricated registration details. They stay unlinked and noindex until the owner approves.
- D. Booking: launch with the prefilled email to ahsan@growlatics.com. Architect `lib/leads` so Calendly, Cal.com, HubSpot, a CRM form or a webhook can replace or extend the destination cleanly.
- E. GitHub Pages: musahex.github.io/growlatics must not stay active; deploy nothing; document the exact owner steps to disable it.
- F. Hosting: Hostinger, https://growlatics.us. No Vercel, no DNS change, no overwriting the live site; deploy only after owner review.
- Geography: a US / Pakistan-based business; markets US, UK, Pakistan plus other international. Not Pakistan-only, UK-only, purely offshore or low-cost. Prefer "international growth operations", "distributed execution", "multi-market capability", "connected operations" where factual. No Lahore/London or any office/branch claims.

## 13. Must not regress
The nine-act story; disconnected → connected network; neutral idle / orange active; Sales & BPO emphasis; distinct network views per act; the improved Sales & BPO page; responsive ordering; the reduced-motion fallback; code splitting; mobile/touch gating; per-route JS budgets (≈ current: / 164 kB, others ≤161 kB); a11y (Lighthouse 100, axe 0); SEO infrastructure; static Hostinger compatibility; v1 stats removed; the contact freeze fix; the custom 404; crawl cleanliness.

## 14. Performance and accessibility
Watch backdrop-filter, large translucent moving surfaces, blur over WebGL, box-shadow, overlapping glass layers. Few high-quality glass surfaces beat many mediocre ones; redesign any effect that measurably regresses. Keep contrast, focus indicators, keyboard use, semantics, touch target size and reduced motion; never convey state by transparency or colour alone.

## 15. Visual QA (required before acceptance)
Screenshots: 1440×900 dark + light; ~390 dark + light; tablet portrait 768–834. Capture the hero/header, a representative mid-home act, Sales & BPO, Contact, the mobile menu (open). Review: header quality, edge curvature, excessive blur, legibility, repeated glass cards, clutter, theme consistency, orange overuse, mobile crampedness, excessive transparency. Reject and iterate if it looks like a generic glassmorphism template.

## 16. Handoff
No deploy, no push. The final owner report covers: visual changes, the glass system, header behaviour, where glass was deliberately not used, before/after screenshots, mobile/tablet, performance difference, a11y, route sizes, remaining OWNER_VERIFY, the legal placeholder, booking behaviour, GitHub Pages disable steps, the local preview command + URL, the v2 head commit, the Hostinger checklist, the real-device QA checklist.
