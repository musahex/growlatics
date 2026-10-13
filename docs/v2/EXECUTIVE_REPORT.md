# Growlatics v2 — Executive report

Orchestrator: Izza (god). Date: 2026-10-06. State: built, reviewed and QA'd on local branch `v2` (head = the commit that adds this file). **Nothing pushed, nothing deployed, no DNS change, archives untouched.**

## 1. What was built
A complete rebuild of growlatics.us as a static Next.js 14 site (static export is kept for Hostinger):
- a nine-act cinematic homepage;
- Services, four service pages, Work, About and Contact;
- one shared network-system engine;
- a typed content source;
- a lead adapter;
- full SEO, accessibility and performance hardening.

The specs are in `docs/v2/`: MASTER_BRIEF, PLAN, DIRECTION, IA_AND_COPY.

## 2. Page architecture
- **Indexed routes:** `/`, `/services/`, `/services/{sales-bpo,performance-marketing,customer-operations,technology}/`, `/work/`, `/about/`, `/contact/`.
- **Not indexed:** `/privacy/` and `/terms/` are drafts, marked noindex and unlinked. The branded 404 is noindex.
- **Dev only:** `/lab/system/`, removed from the export by the `postbuild` step.
- **Content:** every string lives in `content/**`, a single source.
- **Proof:** `content/proof.ts` is empty, and its slots render nothing.

## 3. Creative concept
**"One connected growth system."** At the start of the page, the capabilities appear dormant and disconnected. As the visitor scrolls, signals flow between them until they converge into one operating system, with Growlatics as the connecting layer.
- **Four systems:** Acquire, **Sell** (the lead offer), Operate, Build.
- **Journey:** Attract → Qualify → Close → Retain → Scale.
- **Hero H1:** "We build and operate the systems behind growth."
- **Colour:** orange `#D2401A` appears only where something is active. Neutrals are warm, and light and dark themes are each tuned separately rather than inverted.

## 4. 3D and motion system
`components/system/**` holds one graph model, one store, one `requestAnimationFrame` scheduler, and one fixed stage across the nine homepage acts. Each device gets one of three tiers:

| Tier | Who gets it | How it draws |
|---|---|---|
| 0 | Reduced motion or save-data | Static SVG; the full story is still there |
| 1 | Touch screens and narrow screens | 2D canvas |
| 2 | Desktop with a mouse, 1024 px or wider, WebGL2 | three.js / R3F, loaded lazily |

Animation pauses off-screen and in background tabs, the pixel-density cap only ever lowers, and there is one shared pointer listener and one shared scroll listener.

Six legacy engines were harvested for ideas and then deleted: GlobalGrowthScene, HeroInteractiveField, ThreeGrowthWindow, HeroGrowthScene, GrowthBars, OrbitNodes.

## 5. Performance, before → after
| | Before (v1) | After (v2) |
|---|---|---|
| First Load JS `/` | 363 kB (three/R3F in the main bundle) | **164 kB** (3D only in a lazy chunk); other routes 138–161 kB |
| Lighthouse mobile perf | not measured on v1 | `/` 95, sales-bpo 96, contact 97; desktop 100 |
| Mobile LCP (internal pages) | 3.0–3.2 s (first v2 build) | 2.4–2.7 s; `/` 2.86 s |
| CLS / TBT | 0.113 on home (first v2 build) | 0 / 0 |
| rAF loops | several independent (one never stopped) | 1, pauses with the stage |

## 6. Responsive and accessibility
- **Responsive:** verified at 390, 768, 1024 (touch), 1024×1366 portrait and 1440 px, in both themes and with reduced motion.
- **Accessibility:**
  - Lighthouse accessibility scores 100 on every route.
  - axe shows 0 violations across 48 runs.
  - The skip link works, focus order is logical and focus is always visible.
  - Contrast meets AA in both themes.
  - The contact flow was tested end to end by keyboard.
  - Content stays visible without JavaScript.
- **Bugs fixed along the way:**
  - The v1 journey was stuck at stage 1 when reduced motion was on.
  - A v2 hydration error appeared under reduced motion.
  - Button contrast was 4.15:1 because of a tailwind-merge bug.

## 7. SEO
- Every route has its own title, description, canonical (`https://growlatics.us/...`), Open Graph and Twitter tags.
- The sitemap lists the 9 routes; robots.txt is in place.
- **Structured data (JSON-LD):** Organization and WebSite, Service ×4, and BreadcrumbList. There is no address, rating or price anywhere.
- New OG image and full icon set.
- One H1 per page, no dead links, and every service is one click from the homepage.
- `.htaccess` serves the branded 404 page.
- Run `node scripts/seo-crawl.mjs` to check: it reports 0 problems.

## 8. Conversion architecture
"Book a Growth Call" leads to `/contact/`, which has a short qualification flow (preselected by `?system=`). That flow goes through `lib/leads/`, a single adapter:
- **Default:** a prefilled email to ahsan@growlatics.com.
- **Optional slots, read at build time:**
  - `NEXT_PUBLIC_LEAD_WEBHOOK_URL`
  - `NEXT_PUBLIC_BOOKING_URL`
- No vendor is connected. The tech review fixed an infinite loop that could freeze the tab on long submissions; a self-check now covers it.

## 9. Waiting on the owner
These are on the ASK ME board.
1. **Confirm or strike claims:**
   - 22 strings marked `verify: true` in `content/`;
   - 5 unflagged strings listed in `SEO_QA_REPORT.md` §B, such as "inside your CRM", "Trained, managed teams" and "Distributed teams".
2. **Legal:** the Privacy and Terms text, and the legal entity name.
3. **Lead capture:** keep the email default, or provide a webhook or booking URL. No paid tool is activated without your approval.
4. **Turn off GitHub Pages:** the stale copy at `musahex.github.io/growlatics` is still live.
5. **Approve publishing:** pushing `main` and uploading to Hostinger.
6. **Test on real devices:** a MacBook Air, an iPad held upright and a mid-range Android. Frame rate on a real GPU has not been measured.

## 10. Git
- **`main`:** `13c1c6b` baseline and `5fbd96c` GitHub Pages auto-deploy disabled. Both are local and unpushed.
- **`v2`** (integration branch), in this order:
  1. Phase 1 specs: `d9752ca`
  2. system-3d: `d7b11a4`
  3. foundation and integration: `809198e`
  4. pages: `42146fc`
  5. home: `b96b0d2`
  6. seo: `025684c`
  7. perf: `b38aef3`
  8. review-tech: `504d4c0`
  9. review-creative: `1e84dcf`
  10. story and polish: `af871b4`
  11. token fix: `3a051b2`
  12. final QA, squashed: `162a7c4`
- **Worker branches** (`v2-direction` … `v2-story`) are kept for audit and are all merged.
- **Reports:** `PERF_A11Y_REPORT.md`, `SEO_QA_REPORT.md`, `REVIEW_TECH.md`, `REVIEW_CREATIVE.md`, `FIXPASS_POLISH.md`, `FINAL_QA.md`.

## 11. Pre-production steps (exact order)
The full checklist is in `FINAL_QA.md` §5.
1. You settle §9 items 1–3, and god strips or keeps the flagged strings.
2. You turn off GitHub Pages.
3. god merges `v2` → `main`.
4. On approval, push.
5. Run `npm run build`, with lead env vars set if chosen. Check that `out/.htaccess` exists and `out/lab` does not.
6. Back up the current Hostinger `public_html/`, then empty it.
7. Upload the contents of `out/`, including `.htaccess`. It is 80 files, about 4.1 MB.
8. Smoke-test the live site:
   - all 9 routes
   - a bad URL shows the branded 404
   - the contact flow
   - the theme toggle
   - `robots.txt` and `sitemap.xml`
   - the link preview
9. Submit the sitemap in Search Console.

## 12. Screenshots
242 PNGs: every route at 1440 dark, 1440 light and 390 dark, plus homepage acts 1–9 at tier 2 and with reduced motion, plus portrait. They are at `/Users/moses/HarnessAgents/hive/agents/god/growlatics-v2-screenshots/` (index in its README.md). They are kept outside git to avoid adding 19 MB to the repo's history.

## 13. Rejected or reworked in review
- **Creative review:**
  - The story was illegible: every node was orange, homepage acts 3, 6 and 8 shared one pose, and the hero did not name the four systems.
  - Sales & BPO was five stacked tables.
  - The light-theme network looked salmon.
  - The About and Services heroes reused the homepage's figure.
  - Labels collided.
  
  All of these were fixed in phase 7b.
- **Tech review:** the infinite loop in the email-link builder; the dev lab shipping in the export; the unused drei dependency; a stale README that said Vercel.
- **god's own calls:**
  - Dropped Microsoft, LinkedIn and TikTok Ads, LinkedIn as an outreach channel, and the response-time promise.
  - Removed every v1 statistic: 150% ROI, 10x, 40/25/60%, "10+ industries", "24/7".
  - Removed the Lahore and London branches.
  - Kept the screenshots out of git.
  - Kept "Not a call center" as approved positioning.
- **Deferred:** a Sales hero "calendar" pose for the canvas (the page strip already carries it), and a phone act-1 figure that fills only half its frame.
