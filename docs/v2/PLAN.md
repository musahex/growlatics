# Growlatics v2 — Build plan and worker contract

Owner brief: `docs/v2/MASTER_BRIEF.md` (read it fully). Orchestrator: god (Izza). This file is the contract every worker follows.

## Git rules (every worker)
- Integration branch: **`v2`** (god merges into it; `main` = what is live, untouched).
- Work only on your own branch **`v2-<stream>`** (git cannot nest `v2/x` under branch `v2`) created from the latest `v2`. Commit there. Never commit to `v2` or `main`. Never push. Never `git add -A` / `git add .`; stage explicit paths.
- Non-source copies (`Growlatics/`, `growlatics-hostinger-deploy*`, zips, `out/`, `.next/`) are never read as source, never staged, never deleted.
- Report done with: branch name, final commit hash, what changed, what you deliberately did not do, open risks.
- Worktrees have no `node_modules`: run `npm ci` in your worktree (or symlink `/Users/moses/Growlatics/node_modules`) before building. No new runtime dependency without stating why in your report; free/OSS only.
- Every code stream must leave `npm run build` passing (static export) and `npx tsc --noEmit` + `npm run lint` clean.

## Phases and streams
| Phase | Stream | Branch | Output |
|---|---|---|---|
| 1 Plan | DIRECTION (art direction + design system + motion + 3D architecture + hero/story storyboard) | `v2-direction` | `docs/v2/DIRECTION.md` |
| 1 Plan | IA-COPY (sitemap, page structures, final copy, journey vocabulary, conversion flow, metadata) | `v2-ia-copy` | `docs/v2/IA_AND_COPY.md` |
| 2 Foundation | FOUNDATION (tokens, fonts, layout shell, content modules, interaction store, motion constants, route skeleton, SEO base, lead adapter) | `v2-foundation` | code |
| 2 Foundation | SYSTEM-3D (shared network primitives, capability tiers, dynamic loading, frame scheduler) | `v2-system-3d` | code in `components/system/**` |
| 3 Flagship | HOME (all homepage acts incl. hero + journey) | `v2-home` | code |
| 4 Internal | PAGES (Services, 4 service pages, About, Contact, Work) | `v2-pages` | code |
| 5 Hardening | PERF-A11Y (bundle, gating, reduced motion, touch, responsive) | `v2-perf` | code + report |
| 6 Hardening | SEO-QA (metadata, sitemap, robots, JSON-LD, links, headings) | `v2-seo` | code + report |
| 7 Review | Cross-review temps on work they did not author | — | review reports |
| 8 QA | god final QA | — | executive report |

Phase 1 docs are decided before any parallel code. Workers do not invent colours, type, motion language, network primitives or copy tone outside DIRECTION / IA_AND_COPY.

## Decisions already fixed by god
- Four systems: **Acquire** (Performance Marketing) · **Sell** (Sales & BPO, commercial lead) · **Operate** (Customer Operations) · **Build** (Technology & Development, the infrastructure layer). IA-COPY may rename only with a stronger, documented reason.
- Routes (trailing slash, static): `/` `/services/` `/services/sales-bpo/` `/services/performance-marketing/` `/services/customer-operations/` `/services/technology/` `/work/` `/about/` `/contact/`. `/privacy/` `/terms/` only as drafts flagged for owner legal approval, unlinked and `noindex` until approved. No `/careers/` link unless real content exists.
- Content lives in typed TS modules under `content/` (single source). No CMS.
- Conversion: "Book a Growth Call" opens a short qualification flow on `/contact/`; submission goes through one adapter `lib/leads/` with provider config (default: prefilled mailto to `ahsan@growlatics.com`; slots for webhook URL and booking URL via `NEXT_PUBLIC_*` env). No vendor.
- Proof: `content/proof.ts` typed but empty; components render nothing when empty.
- Footer geography: "US / Pakistan business; serving US, UK, Pakistan and international clients". No branch addresses. Phone/email/socials from baseline stay.
- Static export, `trailingSlash: true`, images unoptimized stay. Remove the GitHub-Pages `basePath` branch in next.config only in FOUNDATION.
- Legacy components: inspect before deleting; delete only in the stream that replaces them, noting what was harvested.

## Creative + technical gates (from brief §30–31)
Reject any section that could live on a random agency site; reject sphere heroes, four-card grids, purposeless particles, metric counters, stock imagery, alternating image/text. Never merge just because it builds: check fit, duplication, bundle, animation lifecycle/cleanup, responsiveness, theme, static export, a11y, content accuracy.

## God decisions after Phase 1 review
- IA_AND_COPY.md accepted. Journey = **Attract → Qualify → Close → Retain → Scale** (content/journey.ts only). Hero H1 = "We build and operate the systems behind growth."
- OWNER-VERIFY claims (IA_AND_COPY §9.1): implement them, but every such string carries `verify: true` in content (or sits in a clearly marked block) so god can strip or confirm before publishing. Drop outright: Microsoft Ads, LinkedIn Ads, TikTok Ads, and the LinkedIn channel for outreach (say "cold outreach" without channel list). Contact success copy uses the fallback without a response time.
