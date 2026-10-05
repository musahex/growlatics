# Growlatics v2 — Phase 8 final QA

> Screenshots are kept outside git (19 MB): `/Users/moses/HarnessAgents/hive/agents/god/growlatics-v2-screenshots/` (index: README.md there).

Worker: worker-gl-final (temp). Branch `v2-final` from `v2` 3a051b2. Date 2026-10-06.
Everything below was measured on the code at **ff1fd22** (last code commit); later commits are docs and screenshots only.
Not pushed, not deployed, `main` untouched.

## 1. Gate table

| Gate | Result | Numbers |
|---|---|---|
| `npm run build` (static export + postbuild) | **pass** | exit 0. First Load JS: `/` 164 kB · `/services` 159 · `/services/[slug]` 161 · `/about` **138** (was 159) · `/contact` 151 · `/work` 139 · shared 87.4. Every route ≤ 200 kB. |
| `npx tsc --noEmit` | **pass** | 0 errors |
| `npm run lint` | **pass** | 0 warnings, 0 errors |
| `node scripts/seo-crawl.mjs` | **pass** | 0 problems; sitemap = 9 URLs; every page at click depth ≤ 1 |
| `lib/leads` selfcheck | **pass** | `lib/leads selfcheck: ok` |
| Lighthouse mobile (perf / a11y / best practices · LCP · TBT · CLS) | **pass** | `/` 95/100/100 · 2.86 s · 0 ms · 0 — `/services/sales-bpo/` 96/100/100 · 2.71 s · 0 · 0 — `/contact/` 97/100/100 · 2.56 s · 0 · 0 |
| Lighthouse desktop | **pass** | `/` 100/100/100 · 0.62 s · 0 · 0 — `/services/sales-bpo/` 100/100/100 · 0.57 s · 0 · 0 — `/contact/` 100/100/100 · 0.53 s · 0 · 0 |
| axe-core (WCAG 2 A/AA + best practice) | **pass** | **0 violations** on 48 runs: 12 routes (9 indexable + `/privacy/`, `/terms/`, 404) × dark/light × 390/1440 |
| Page errors (JS exceptions) | **pass** | 0 on every screenshot load: 30 route runs + 2 act runs + portrait/phone checks |
| Export contents | **pass** | `out/.htaccess` present (`ErrorDocument 404 /404.html`); no `out/lab/`, no lab chunk, no file references `/lab/`; sitemap has 9 `<loc>` (no privacy, terms, lab); `/privacy/` and `/terms/` carry `noindex` |
| Screenshot set | **done** | 242 PNGs, largest 220 KB, index in `/Users/moses/HarnessAgents/hive/agents/god/growlatics-v2-screenshots/README.md` |

Lighthouse: CLI 13, simulated throttling, local gzip static server (as Hostinger serves gzip/brotli). axe and Lighthouse rig: playwright-core + lighthouse + axe-core in a scratch folder, not the repo.

## 2. Fixes (one commit each)

| # | Request | Result | Commit |
|---|---|---|---|
| 1 | 1024×1366 portrait: hero network ran behind the System index | **Fixed.** New hand-posed act-1 key for portrait stages (`act1Portrait` in `layouts.ts`; the other keys keep the transpose). The network sits in the band between the CTAs and the System index, Sell in the middle, nearest and lit. Also used by phone inline figures (reads better there than the transpose did). `screenshots/act1-1024x1366-dark.png`. | 322ad2a |
| 2 | Sales & BPO hero canvas: lanes → Sell → calendar pose (DIRECTION 8.1) if ≤ 2 kB | **Not done (too big).** A real "your calendar" node needs a new graph node, a content label, a new pose key and a clamp so home act 9 does not blend into it, and it touches every pose. Over the 2 kB limit and risky this late. The hero's DOM handoff strip right under the figure already shows Inbound / Outbound → Sell → Your calendar / Operate. | — |
| 3 | Act-7 market band ticks / label offsets as shown on /about/ | **Fixed.** Root cause: STORY's act-7 pose (07359e1) hides every node and moved the band into the DOM, so About's act-7 canvas showed only the background dust. About now uses the same DOM band as home (ticks every 3 h, US −5, UK 0, PK +5, labels above the nodes). Side effect: About has no canvas any more, First Load 159 → 138 kB. | c44bb73 |
| 3b | Found while checking 3 | **Fixed.** The act-1 intro mark followed a fast scroller into act 7 (bars at the right edge); the intro now ends once the stage passes act 1. On phones the market halos overlapped the −6 / +6 tick labels; halos show from `sm` up. | fc1c8a5 |
| 3c | Found while checking 1 | **Fixed.** At 1440 a Build node sat over the end of System index column 04; Build moved right and tightened. | ff1fd22 |
| 4 | `components/home/acts.tsx` MoreLink → Button `variant="text"` | **Fixed.** Same style as every other text link (arrow icon instead of "→" text). | 1b74f03 |
| 5 | Regressions from token change 3a051b2 (neutral `--net-idle` / `--net-edge`) | **None found.** Consumers: SystemSchematic (idle rings, lit groups), HandoffStrip (idle dots), TraceLanes, Tailwind `net-*` colours (alpha carried by the token, `rgb(var())`, so no double alpha). Sales & BPO schematic and handoff strip checked at 1440 dark and light: idle rings neutral, lit nodes and edges orange, all legible. axe clean in both themes. | — |

## 3. Still open (not fixed here)

1. **Sales & BPO hero pose** (fix 2 above). Needs a dedicated pose with a calendar node; one focused task for a later pass.
2. **Phone act-1 figure framing (P3).** On phones the framed hero figure fills only the top half of its 4:5 box (empty band under it). This was there before fix 1 (the old transposed pose did the same). Fix in `frame()` / the inline stage's camera.
3. **Real-GPU frame rate** never measured (only software WebGL here). Check on a 2020 MacBook Air, an iPad and a mid-range Android before launch, per DIRECTION §10.2.
4. Carried P3s from REVIEW_CREATIVE (untouched): eyebrow orphan on phone, act-9 button near the fold at 1440×900, act-4 hero packet, journey Mark progress, "Not a call center" still in the Sales hero lead + Sales FAQ + home inspector (review asked for two places at most).
5. `/privacy/` and `/terms/` ship in `out/` as unlinked `noindex` drafts. Fine to upload; they become live URLs only by guessing.

## 4. Export: exactly what to upload

Build with `npm run build` (never `npx next build`: that skips the postbuild that removes the lab). Upload the **contents** of `out/` to Hostinger `public_html/` — 80 files, 4.1 MB:

```
.htaccess                      ← dotfile; many upload tools skip it. Required for the branded 404.
404.html
404/index.html
index.html  index.txt
about/index.html  about/index.txt
contact/index.html  contact/index.txt
privacy/index.html  privacy/index.txt      (noindex draft)
terms/index.html  terms/index.txt          (noindex draft)
services/index.html  services/index.txt
services/sales-bpo/index.html  services/sales-bpo/index.txt
services/performance-marketing/index.html  services/performance-marketing/index.txt
services/customer-operations/index.html  services/customer-operations/index.txt
services/technology/index.html  services/technology/index.txt
work/index.html  work/index.txt
robots.txt  sitemap.xml  site.webmanifest
favicon.ico  icon.svg  icon-192.png  icon-512.png  apple-icon.png  logo.png  og-image.png
_next/static/**                ← 45 files (31 JS, 1 CSS, 13 woff2 fonts); upload the whole folder
```

## 5. Pre-production checklist (in order)

1. **Owner verifies claims.** 22 strings carry `verify: true` in `content/` (faq, pages, systems, legal), including POLISH's `salesHandoff.team` and the Work schematic outputs. Plus the unflagged list in `SEO_QA_REPORT.md` §B ("inside your CRM", "Trained, managed teams", "Distributed teams", "report against agreed metrics", FAQ "Most clients start"). Owner confirms each, or god strips it.
2. **Owner-only facts** (`SEO_QA_REPORT.md` §C): legal entity name, any address. Leave out if not given.
3. **Legal.** Owner approves Privacy / Terms text; only then link them, drop `noindex`, add them to the sitemap.
4. **Lead capture.** Decide whether to set `NEXT_PUBLIC_LEAD_WEBHOOK_URL` and `NEXT_PUBLIC_BOOKING_URL`. They are read at build time: set them in the shell before `npm run build`. Unset = prefilled email to ahsan@growlatics.com. Send one real test submission after deploy.
5. **Real devices.** Frame rate and touch on a MacBook Air, an iPad (portrait, the fixed stage) and a mid-range Android.
6. **GitHub Pages.** `musahex.github.io/growlatics` is a second, stale live copy. `deploy.yml` is already manual-only on `main` and `v2` (checked), so pushes no longer redeploy it, but the old copy stays live until Pages is turned off in the repo settings. Turn it off.
7. **Merge.** god merges `v2-final` → `v2` → `main`. Push only after step 6.
8. **Build** on the merged commit with `npm run build`; confirm `out/.htaccess` exists and `out/lab` does not.
9. **Back up** the current `public_html/` on Hostinger (the live v1 files), then empty it so old `_next` chunks don't linger.
10. **Upload** the contents of `out/` (section 4), including `.htaccess`.
11. **Smoke test live** `https://growlatics.us`: the 9 routes, a bad URL shows the branded 404, the contact flow, light/dark toggle, `robots.txt`, `sitemap.xml`, OG preview (paste the URL into a link-preview checker).
12. **Search Console.** Submit `https://growlatics.us/sitemap.xml`.
