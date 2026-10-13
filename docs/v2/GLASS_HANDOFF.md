# Growlatics v2 — Glass + floating header: owner handoff

Date 2026-10-06. Branch `v2`, head = the commit that adds this file (base `4362b63`). **Not pushed, not deployed, DNS untouched, live Hostinger site untouched.** Specs: `GLASS_BRIEF.md`. Detail: `GLASS_SYSTEM.md`, `GLASS_PAGES.md`, `GLASS_QA.md`, `REVIEW_GLASS.md`.

## 1. What changed visually
- A floating glass header with liquid corners replaces the edge-to-edge bar.
- Glass appears only on the floating and interactive UI, in these places:
  - the hero's "Four connected systems" panel
  - the act-2 problem labels (now glass chips; this also fixed the label overlap)
  - the act-5 detail panel
  - the service-hero lane strips
  - Sales & BPO: the inbound/outbound → Sell → calendar lanes and the CRM ↔ team ↔ closers strip
  - the Contact qualification surface
- The Contact form is redesigned:
  - recessed option tiles, with the selected one in orange glass
  - a 5-step progress bar
  - a footer row with the step count and Back / Continue
- Content follows your decisions A–F (section 10).

## 2. Glass material system
- **Where it lives:**
  - tokens in `app/globals.css` and `tailwind.config.ts`
  - classes `.glass`, `.glass-elevated`, `.glass-dark`, `.glass-light`, `.glass-signal`, plus `rounded-liquid` / `rounded-glass`
  - React helpers `components/ui/Glass.tsx` (`Glass`, `glassClass`) and `components/patterns/glass.ts` (a flat variant without blur)
- **Tokenised properties:** background alpha, blur, saturation, border alpha, top highlight, shadow, radius, inner glow, and orange active tint.
- **Colour logic:** idle glass is warm neutral; only SIGNAL glass is orange.
- **Slow-GPU fallback:** when the 3D frame governor detects frames over 20 ms, it sets `html[data-glass=flat]`. The glass keeps its tint, edge and shadow but drops the blur, before the 3D resolution is reduced.

## 3. Header
- **Shape:**
  - detached, centred, set back from the screen edges
  - liquid corners: a CSS squircle in recent Chromium, a tuned elliptical radius elsewhere
- **Material:** warm dark or warm ivory glass, with a hairline edge, a top highlight and a soft ambient shadow.
- **On scroll:** it becomes slightly more opaque, blurred and deep over the first 160 px, driven by a CSS scroll timeline with no JavaScript listener. Over dark sections the light-theme bar switches to dark glass. It never auto-hides.
- **Contents:**
  - the mark on the left
  - Home / Services (4-system dropdown) / Work / About / Contact in the centre
  - the theme toggle and a solid-orange "Book a Growth Call" on the right
- **Interactions:**
  - the active link has a glass well and an orange dot
  - hovering a link draws a hairline signal
  - the booking button pulls slightly toward the cursor on fine pointers, using the shared scheduler
  - hovering opens the dropdown and a click pins it; Escape returns focus to the toggle
- **Mobile:**
  - its own layout, with an icon booking button under 640 px and a short label from 640 to 767 px
  - the menu unfolds downward as the same glass, pinned to the solid material
  - one booking button while the menu is open
  - background locked, Tab wraps and Escape closes
  - safe-area aware
  - reduced motion uses a simple fade

## 4. Where glass was deliberately NOT used
- About and Work: editorial and future-ready.
- Homepage acts 3, 6, 7, 8 and 9: the network scenes stay dominant.
- The Sales & BPO capabilities diagram: a third glass panel in a row was rejected in review.
- Body paragraphs, headings, section backgrounds, the footer, and generic card grids.

## 5. Before / after screenshots
- **Before (pre-glass):** `/Users/moses/HarnessAgents/hive/agents/god/growlatics-v2-screenshots/` (242).
- **After:** `/Users/moses/HarnessAgents/hive/artifacts/growlatics-glass-after/`, covering 1440 dark/light, 390 dark/light and 820, with the hero/header, act 2, act 5, Sales & BPO, Contact, Services and the open menu.
- **Iterate fixes:** `/Users/moses/HarnessAgents/hive/agents/god/growlatics-glass-screenshots/after-glass/`.
- None of these are in git.

## 6. Mobile / tablet
- 390 and 820 px: own header and menu, verified in both themes.
- Touch 1024: the 2D canvas tier, with the act-1 view nudged so the panel no longer covers network nodes.
- 1024×1366 portrait has its own act-1 view.

## 7. Performance
- **First Load JS:** `/` 164 → 165 kB. All other routes unchanged within 1 kB (`/contact` 152, `/services` 160, service pages 161, `/about` 138, `/work` 139).
- **Lighthouse mobile:** `/` 94, Sales & BPO 96, Contact 97. Desktop is 100.
- **Blur cost:**
  - Apple M5: unmeasurable (8.3 ms per frame with or without glass).
  - Software GPU with 4× CPU slowdown: blur over the 3D doubled frame time (p50 42 ms vs 15.7 ms without blur). The flat-glass fallback now handles slow GPUs; with it on, p50 is 15.6 ms.
- Real-GPU mid-range devices are not measured yet; see section 17.

## 8. Accessibility
- axe: 0 violations across 72 + 30 runs (12 routes × both themes × 390/820/1440, plus menus).
- Lighthouse accessibility: 100 on every route.
- Header text contrast over the live network: at least 9.98:1.
- Keyboard: header, dropdown, mobile menu and the full contact flow all pass. Focus is always visible.
- Reduced motion: still the static tier, with full content.

## 9. Route bundle sizes (First Load JS)
| Route | kB |
|---|---|
| `/` | 165 |
| `/services/` | 160 |
| `/services/[slug]` (×4) | 161 |
| `/contact/` | 152 |
| `/work/` | 139 |
| `/about/` | 138 |
| `/privacy/`, `/terms/`, 404 | 87.5 |

## 10. Remaining OWNER_VERIFY (`docs/v2/OWNER_VERIFY.md`, non-blocking)
1. The Sales & BPO "Business process outsourcing" scope, including "order processing" (`content/pages.ts:182`).
2. The Sales & BPO "Ways to engage" options: Dedicated team ("Named people working only on your account"), Campaign and Overflow (`content/pages.ts:195–201`).
3. The FAQ answer "Who owns the leads and data? You do." (`content/faq.ts:33`), which is a contract term.
4. The legal text (section 11).

Everything else that implied results, scale, volume, speed, team structure or presence was softened. The full before/after table is in OWNER_VERIFY.md. There are no Lahore/London or other branch claims, no proof, testimonials or logos, and no numbers.

## 11. Privacy / Terms
- **Status:** structurally complete (Privacy 9 sections, Terms 8), in `content/legal.ts`.
- **Placeholders, clearly marked:**
  - `[LEGAL ENTITY NAME — OWNER TO PROVIDE]`
  - governing law
  - retention period
  - effective date
- **Not on the site:** no registration details or address.
- **Visibility:** unlinked, noindex and kept out of the sitemap until you approve.

## 12. Booking behaviour
- **Now:** "Book a Growth Call" → `/contact/` → a 5-step qualification flow → a prefilled email to **ahsan@growlatics.com**.
- **Later:** `lib/leads` is a provider adapter. `NEXT_PUBLIC_LEAD_PROVIDER=webhook` with `NEXT_PUBLIC_LEAD_WEBHOOK_URL` posts to any CRM or automation endpoint. `NEXT_PUBLIC_BOOKING_URL` (Calendly or Cal.com) shows a booking link after either email or webhook. HubSpot is documented as a ~10-line provider.
- **When settings take effect:** they are read at build time.

## 13. GitHub Pages: disable it (owner action, needs repo admin)
1. Go to https://github.com/musahex/growlatics → **Settings** → **Pages**.
2. If the Source is **GitHub Actions**, click **Unpublish site**. If it is **Deploy from a branch**, set the branch to **None** and **Save**.
3. After 1–10 minutes, open https://musahex.github.io/growlatics/ in a private window. It must show GitHub's 404.
4. Optional: delete the `github-pages` environment under Settings → Environments.

`deploy.yml` is already manual-only, so pushes will not redeploy it. Details are in `docs/v2/LAUNCH.md` §2.

## 14. Local preview
- **Development server:** `cd ~/Growlatics && git checkout v2 && npm run dev`, then open **http://localhost:3000/**.
- **Exact production output:** `npm run build && python3 -m http.server 4173 --directory out`, then open **http://localhost:4173/**.

## 15. Branch / head
- **`v2`:** local only. The base for this report is `4362b63`.
- **Glass pass merges, in order:**
  1. content: `8220815`
  2. glass core: `b363ea0`
  3. glass pages: `cecfaf8`
  4. creative review: `2b96548`
  5. glass QA: `e102d33`
  6. iterate: `4362b63`
- **`main`:** `5fbd96c`, unchanged and unpushed.

## 16. Hostinger deployment checklist (only after your approval; `LAUNCH.md` §3)
1. Settle OWNER_VERIFY 1–4, or accept them as they are.
2. Disable GitHub Pages (section 13).
3. god merges `v2` → `main`, then pushes on your approval.
4. Run `npm run build`, with any lead settings exported first. Check that `out/.htaccess` exists and `out/lab` does not.
5. Download a backup of the current `public_html/`.
6. Empty `public_html/`.
7. Upload the contents of `out/`, including the dotfile `.htaccess`.
8. Smoke-test https://growlatics.us:
   - all 9 routes
   - a bad URL shows the branded 404
   - the contact flow sends the email
   - the theme toggle and the menu
   - `robots.txt` and `sitemap.xml`
   - the link-preview image
9. Submit the sitemap in Search Console.

## 17. Real-device QA checklist
- **Devices:** a MacBook Air (Safari and Chrome), an iPad portrait and landscape, an iPhone, and a mid-range Android (Chrome).
- **What to check on each:**
  - the header blur and legibility at the top and while scrolling, including over the dark sections in light theme
  - the mobile menu opening at the top of a page
  - smooth homepage scrolling through acts 1–9: run `document.documentElement.dataset.glass` in the console. `flat` means the fallback kicked in, which is fine, but note which device triggered it
  - Sales & BPO and Contact end to end: does the email open, prefilled?
  - the reduced-motion setting
  - both themes
- **Report:** any jank, unreadable text or clipped panels.
