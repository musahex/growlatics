# Growlatics v2 — Phase 7 creative + content review

Reviewer: worker-gl-review-creative (temp, did not author this code). Branch `v2-review-creative` from `v2` b38aef3. Date 2026-10-06.
Judged against MASTER_BRIEF §6–17 and §30, DIRECTION.md §1, §3, §7, §8, §10 and IA_AND_COPY.md §2–5. Report only; no code edited.

## Method

- `npm run build` (static export, passes), then headless Chromium (Playwright `chrome-headless-shell` 1228, SwiftShader GL) served `out/` through request interception (no local port).
- Every indexable route plus 404 at 390 (touch, tier 1) and 1440 (fine pointer, **tier 2 WebGL confirmed**: a `1440x900` WebGL canvas on `/`), dark and light. Home acts 1–9 as viewport shots at 1440 dark, 1440 light and 390 dark; act 4 at five scroll points (one per stage).
- 0 page errors on all 40 page loads and 3 act runs.
- Screenshots: `/Users/moses/HarnessAgents/hive/agents/worker-gl-review-creative/screenshots/` (below: `shots/`). `<route>-<width>-<theme>.png` (long pages split `-partN`), `act<N>[-s<stage>]-<width>-<theme>.png`, `log.json` (page loads), `acts-log.json` (act offsets).
- **Capture artifacts, not defects:** in full-page shots the sticky header sometimes appears mid-page (e.g. `services-1440-dark.png`, `services_technology-1440-dark.png`). A first pass also showed blank sections on service pages; I re-checked with a slow real scroll and **every `data-reveal` element becomes visible on all 9 routes** (0 hidden), so that was the capture, not the site.

Severity: **P1** fix before launch (story or brand fails) · **P2** fix in this phase (weakens the gate) · **P3** polish.
Verdict: **keep** · **fix** (right idea, execution misses) · **reject** (could sit on any agency site, or contradicts the brief).

## Summary

The bones pass the creative gate: one graph model, the five-stage journey, the Sell-first inspector, the trace lanes, the convergence CTA and the qualification flow are all specific to "Growlatics connects growth operations". No sphere hero, no card grids, no counters, no stock imagery, no fabricated proof. Copy is clean against the banned list.

What fails is **legibility of the story**. Orange is on every node in every act, so "dormant → lit", "fragmented → connected" and "Sell is the commercial lead" cannot be seen. Acts 3, 6 and 8 show the same canvas, so the middle of the page stops telling a story. The hero never names the four systems in the visual. Internal pages are well-written but mostly ledger after ledger, with the home overview figure reused as their hero.

## Top 10 findings (ranked)

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 1 | P1 | **Orange everywhere.** The `idle` node state is orange (dark `210 64 26 / 0.45`, light `/ 0.52`), and act 1 sets every cluster to `idle`. Every node on the page is orange in every act. DIRECTION §1: "If nothing is active, nothing is orange." The dormant → lit and fragmented → connected arc is invisible, and the hero reads as a generic orange constellation. | `components/system/model/palette.ts:40,45`; `components/system/model/layouts.ts:109` (act1 `states`); `shots/act1-1440-dark.png`, `act3-1440-dark.png`, `act4-s3-1440-dark.png` | Make `idle` a warm neutral (`--c-line-3` / text-3 tint). Orange only for `active` nodes, packets, the core and the focused cluster. Act 1 clusters start dormant and light in story order during the intro; act 4 lights only the current stage's cluster with the trail at neutral-plus. |
| 2 | P1 | **Acts 3, 6 and 8 show the same canvas.** `act6()` and `act8()` are `act3()` with a dim factor. Three of nine acts look identical, so the arc "reconnecting → flowing → converging" (DIRECTION §7) stalls for about three screens, and act 8's dim (0.5) still runs nodes through the rail text. | `components/system/model/layouts.ts:208-237`; `shots/act3-1440-dark.png` vs `act6-1440-dark.png` vs `act8-1440-dark.png` | Act 6: canvas steps back (dim 0.2 or hidden) so the trace lanes are the visual. Act 8: begin the convergence: clusters contract toward the core and edges route inward, so act 9 lands as the conclusion. Keep the canvas clear of the rail columns (x < 0.55). |
| 3 | P1 | **The hero visual does not name the four systems**, and Sell is not visibly dominant. No labels in act 1, all clusters the same orange and similar size. Brief §11: "Communicates in seconds: marketing, sales, operations, technology as one system." Today that is carried by the text alone. | `shots/act1-1440-dark.png`, `act1-1440-light.png` | Four `SpatialLabel`s in act 1 idle (Acquire, **Sell**, Operate, Build in `data` mono), Sell cluster 1.25× and nearest the camera as DIRECTION §7 act 1 specifies, Build visibly underneath. |
| 4 | P1 | **Hero first viewport at 1440×900 cuts off the System index**, the hero's four-systems panel and its only Sell emphasis. Only the row numbers `01–04` show. The H1 runs 4 lines; DIRECTION §7 act 1 allows at most 3. The hero is 1172 px tall. | `components/home/acts.tsx:50,54,72`; `shots/act1-1440-dark.png` | Widen the H1 measure in the hero (allow about 14ch, giving 3 lines at `display-xl` max) and reduce `lg:pt-40` to about `lg:pt-28`, so the System index rows sit above 900 px. |
| 5 | P2 | **Sales & BPO, the priority page, is five ledgers in a row** (What we run, How it works, Ways to engage, Connected systems, FAQ) plus a 13-row schematic that is about 750 px of identical bullets. It is premium and correct but has no signature moment. The hero figure is the generic Sell cluster, not DIRECTION §8.1's "inbound and outbound lanes and an appointment handoff to the client's calendar node". | `shots/services_sales-bpo-1440-dark-part1.png`, `-part2.png` | Hero: two lanes (inbound, outbound) through qualification into a "Your calendar" node. Schematic: group into the 4 capability groups (Pipeline generation, Conversion, Sales ops, BPO), 4 nodes with sub-tags, not 13 rows. Turn "How it works with your team" into a P6 handoff strip (your CRM ↔ our team ↔ your closers). |
| 6 | P2 | **The BPO chip repeats the full description.** The chip under "Business process outsourcing" renders the whole sentence as a tag, because the capability label is a sentence. | `content/systems.ts:64`; `shots/services_sales-bpo-1440-dark-part1.png` (row 04) | Label `'BPO'` or `'Back-office execution'`; keep the sentence in the description. (The label is `verify: true`; keep the flag.) |
| 7 | P2 | **Spatial labels collide** on dense clusters: act 5 Sell (Telesales and Qualification over nodes), the Technology hero (Ecommerce and Automation stacked), the Sales hero, phone act 4 and act 5 (SEO, Funnels and Paid search pile up). The precision story breaks where labels overprint. | `shots/act5-1440-dark.png`, `act5-390-dark.png`, `act4-s2-390-dark.png`, `services_technology-1440-dark.png`; placement `components/system/model/place.ts` | Enforce a minimum label gap and drop lower-priority labels when no slot fits (cap about 5 labels per cluster at hero/phone scale). Spread the Sell and Build clusters wider at small figure sizes. |
| 8 | P2 | **Phone acts 2–9 put an unlabelled diagram before the heading**, with about 150–250 px of dead space after it. The reader sees a tangle of dots before knowing what it means. Phone act 2 has no leak callouts on the figure (DIRECTION §7 act 2 P: six islands, inline callouts). | `components/home/acts.tsx:86,102,174,268` (`ActFigure` before the text); `shots/act2-390-dark.png`, `act5-390-dark.png`, `act7-390-dark.png` | Below `lg`, render `ActFigure` after the `SectionHeader` and tighten its aspect or padding. Act 2 phone: number the gaps 01–05 to match the ledger rows. |
| 9 | P2 | **Act 7 global band is not readable as a 24-hour ribbon.** No hour ticks. Three market nodes with labels overprinting nodes ("United States" sits on its node). A row of grey capability dots reads as noise, and the right half of the section is empty at 1440. | `components/system/model/layouts.ts:215-229`; `shots/act7-1440-dark.png`, `act7-1440-light.png` | Draw the hairline ribbon with `data-s` ticks every 3h (DIRECTION §7 act 7). Offset market labels above their nodes. Drop or fade the capability dots to the field level. Let the band span the full container under the heading. |
| 10 | P2 | **Light theme network turns salmon.** Orange at 0.45–0.52 alpha over `#F5F3F0` renders pink, not signal orange. That reads as decoration rather than "active state" and is not the perceptual tuning brief §9 asks for. | `components/system/model/palette.ts:45`; `shots/act1-1440-light.png`, `act2-1440-light.png` | Follows from #1: light `idle` neutral (`12 11 10 / 0.35`), `active` full `#D2401A`, edges `--c-line-2`. Re-check on light at 1440. |

## Home, act by act (1440 tier 2 · 390 tier 1)

| Act | Verdict | Notes (beyond the top 10) |
|---|---|---|
| 1 Hero | **fix** | #1, #3, #4. Copy is exactly IA §2.2. Phone: the eyebrow wraps and orphans "· TECHNOLOGY" on line 2 (`shots/act1-390-dark.png`, `content/pages.ts:20`). Use `text-wrap: balance` or drop the leading dot on wrap (render as three spans). P3. |
| 2 Problem | **fix** | Leak callouts float in empty space at 1440 instead of anchoring to the broken gaps (DIRECTION §7 act 2: "anchor to specific gaps"); the dashed broken edges read as loose hairlines (`shots/act2-1440-dark.png`). Callout labels are mid-grey mono on near-black; check 4.5:1. P2. Copy keep. |
| 3 Connection | **keep** | The clearest act: one core, four clusters, labels optional. Becomes stronger once #1 makes the reconnect visible against dormant act 2. |
| 4 Journey | **fix** | The five stages, copy and chips are right. Issues: every node orange (#1); a fixed orange "hero packet" sits at the same screen point (about 720, 513) in every stage and reads as a stray dot rather than a lead moving (`act4-s1…s5-1440-dark.png`); no `Mark` progress at 28 px in the panel (DIRECTION §7 act 4); the journey section is not visibly a distinct `data-surface="dark"` "inside the machine" moment in dark theme (looks the same as acts 3 and 5). In light theme, act-4 chips show through the translucent header (`act4-s2-1440-light.png`). P2. |
| 5 Capabilities | **fix** | Inspector with Sell pre-selected and the "Not a call center" line is right. Each list row is about 124 px tall, so "04 Build" falls below the fold and the list looks sparse next to a dense panel (`act5-1440-dark.png`). Tighten rows to about 72 px. Canvas is not the top-down ring of DIRECTION §7 act 5; the Sell cluster labels collide (#7). |
| 6 Why connected | **fix** | TraceLanes is the right idea and specific to Growlatics. At 1440 it is small and low-contrast, and the top lane's "drop" is hard to see (`act6-1440-dark.png`). Make the lanes span the full text column, make the broken gaps and the dropped branch explicit, and step the canvas back (#2). |
| 7 Global | **fix** | #9. Copy keep, but "Distributed teams let us staff…" is on the SEO owner-verify list (B5). |
| 8 Work / proof | **fix** | The four-phase rail is right and is not five, so it does not echo the journey. Canvas runs through the Deploy/Operate columns (`act8-1440-dark.png`); see #2. No fake proof rendered. |
| 9 CTA | **keep** | The convergence into the five-bar mark lands and is the brand's best moment. P3: at 1440×900 the primary button sits at the fold edge when the act enters (`act9-1440-dark.png`); `lg:pt-[60vh]` (`components/home/acts.tsx:308`) could drop to about 45vh. |

## Routes

| Route | Verdict | Findings |
|---|---|---|
| `/` | **fix** | Acts above. |
| `/services/` | **fix** | Order and emphasis right (Sell first, at `display-m`; the others at `title`). The hero figure is the home act-3 overview, not a page-specific picture (`services-1440-dark.png`). "How the systems map to the journey" is a plain five-column rail; drawing the system-to-stage ownership (Acquire → 01–02, Sell → 02–03…) as lines would make it a real diagram. P2. Then ledger, ledger. P3. |
| `/services/sales-bpo/` | **fix** | #5, #6. Phone version clean (`services_sales-bpo-390-dark-part1.png`). "Not a call center" appears in the hero lead, the home inspector, the services page and this FAQ; keep it in two places at most (hero lead, FAQ). P3. |
| `/services/performance-marketing/` | **keep** (minor fix) | Same template as Sales. Paid search copy matches the god decision (no Microsoft, LinkedIn or TikTok). Label density on the hero cluster (#7). |
| `/services/customer-operations/` | **keep** (minor fix) | As above. H1 "Support that keeps customers — and tells you why they stay." is the strongest internal H1. |
| `/services/technology/` | **fix** | Build cluster labels pile up (#7). DIRECTION §8.1: Technology's hero is "shown from below: the Build plane with the other three clusters resting on it"; today Build hangs under the core like any other cluster. The HandoffStrip (Build → Acquire, Sell, Operate) is the right idea. P2. |
| `/about/` | **fix** | Hero figure is again the home overview. The second half ("Who we work with", "International by design") is text-only with an empty right half (`about-1440-dark.png`). About is the "story, philosophy, global nature" page (brief §14); reuse the act-7 market band here and a P4 statement for "Systems beat services". P2. |
| `/work/` | **fix** | Honest methodology treatment, no fake proof: keep. The schematic labels the four metrics "RECEIVES FROM … / RUNS", because it reuses the service labels (`content/pages.ts:448`), and it has no outputs column (`work-1440-dark.png`). Pass per-use labels ("Systems" → "What we measure"). P2. SEO report item 2 (no service link in main content) still stands. |
| `/contact/` | **keep** | Clear, one job. Step 1 lists Sales & BPO first; Mark as step progress is on-brand. P3: the form card has about 150 px of empty space under Continue on step 1. |
| 404 | **keep** | "This page isn't connected." with a partly lit mark. On-brand. |

## Typography, spacing and theme

- **Type discipline: good.** Inter at 600 for display, mono only for indices and tags, one signal-coloured eyebrow per section, tabular indices. No gradient text, no italics. Headlines balance well except the hero (#4).
- **Spacing: too uniform on internal pages.** Every section gets the same about 300–350 px of top and bottom padding (`py-section`), so a two-line "Who we work with" block takes a full screen and ledgers feel like a spec sheet. Use `py-section-tight` for short text-only sections and between consecutive ledgers. P2.
- **Mono label contrast.** Canvas `SpatialLabel` text (`data-s`, 11 px, grey) on near-black and on cream is faint (`act2-1440-dark.png`, `act4-s1-1440-dark.png`). axe cannot check canvas text. Raise it to `--c-text-2` and keep 4.5:1. P2.
- **Themes.** Dark is the stronger, intended look. Light is clean on DOM content (`*-1440-light.png`), and the dark journey surface holds in light. The network colour is the gap (#10).

## Copy and claims

- Banned-list sweep (`content/`, `components/`, `app/`): no passionate, unlock, 360, cutting-edge, seamless, offshore, cheap, low-cost, world-class, leading, guarantee, empower, solutions. "Call center" appears only in the sanctioned "Not a call center" contrast (`content/pages.ts:167`, `content/systems.ts:46`, `content/faq.ts:31`).
- Tone matches IA §2.3: operational verbs, specific nouns, sentence case, no exclamation marks.
- **Fabricated proof: none.** No testimonials, logos, client names, counters, percentages, ROI, team size or office addresses rendered on any route. Proof slots render nothing.
- **No new owner-verify items** beyond `SEO_QA_REPORT.md` §A and §B. One low-risk note: the hero lead's "Most companies run growth through separate vendors" is a market generalisation, not a Growlatics claim; it is acceptable as written.

## What I did not check

- Real-GPU frame rate, reduced-motion visuals and 768/1024 widths (PERF report covers them).
- Pointer interactions (cursor states, pointer-as-router) and the act-1 intro sequence frame by frame; the shots are after the intro.
- `/lab/system/`, `/privacy/`, `/terms/`.
