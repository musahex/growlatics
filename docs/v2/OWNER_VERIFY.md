# Growlatics v2 — Owner verify list (Phase 9a CONTENT-TRUTH, 2026-10-06)

Owner decision A (GLASS_BRIEF §12): keep factual service wording; remove or soften anything implying unverified results, scale, client volume, performance, ROI, revenue impact, team size or geographic presence. The items below are the ones only the owner can settle. They do **not** block the build. Each still carries `verify: true` (or is a legal placeholder) in `content/`.

## Open: owner confirms, edits or removes

| # | File:line | String | Why it needs the owner |
|---|---|---|---|
| 1 | `content/pages.ts:182` | Sales & BPO "Business process outsourcing": "…order processing, follow-up workflows, and data and admin tasks your sellers shouldn't be doing." | Exact BPO task scope. "Order processing" in particular is a specific offer only the owner can confirm. |
| 2 | `content/pages.ts:195–201` | Sales & BPO "Ways to engage": **Dedicated team** ("Named people working only on your account…"), **Campaign**, **Overflow** | Commercial engagement models. "Named people working only on your account" is a staffing commitment. Remove any shape that is not offered. |
| 3 | `content/faq.ts:33` | "Who owns the leads and data?" → "You do. Where you have the systems, we work in yours." | Data ownership is a contract term; the site should only say it if the standard agreement says it. |
| 4 | `content/legal.ts` (whole file) | Privacy Policy and Terms of Use | Legal approval. Owner supplies the legal entity name (placeholder `[LEGAL ENTITY NAME — OWNER TO PROVIDE]`), governing law, and approves the text. Pages stay unlinked, `noindex`, out of the sitemap until then. |
| 5 | `content/pages.ts` home `global.body`, About `international.body` (audit 2026-10-09, `docs/v2/audit/aeo-content.md` CONT-06) | "Distributed execution lets us run sales, support and technology work for the markets you sell into…" — nothing new shipped | Positioning decision, not a fix: say plainly where delivery teams work (e.g. "delivery from Pakistan and the US") or keep it vague. Buyers and AI answers currently cannot tell. Only the owner can state where work is done. |

## Owner-only facts (left out on purpose)

- Legal entity name, registration details, registered address: not on the site anywhere (copy or JSON-LD). Add only if the owner provides them.
- Response time after a request, coverage hours, languages: not stated. FAQ says coverage hours and languages are agreed per engagement.

## Resolved in 9a (softened, `verify` cleared)

| Was | Now | Where |
|---|---|---|
| "Most clients start where the pressure is highest…" (client volume) | "Start where the pressure is highest…" | `content/faq.ts` |
| "Do your teams use our tools?" "Yes, by default…" | "Do you work in our tools?" "Yes, where you have them…" | `content/faq.ts` |
| "…with managers accountable for quality and pipeline…" (team structure) | "…measured on quality and pipeline, not call volume." | `content/faq.ts` |
| "Against metrics agreed before launch, on a regular cadence…" | "Against metrics agreed with you before launch, on a cadence set with you…" (process, not a result) | `content/faq.ts` |
| "Trained sales teams run follow-up…" / "Support and retention teams answer…" | "Managed sales capacity runs follow-up…" / "Support and retention work runs…" | `content/journey.ts` |
| "Leads are answered fast… Nothing waits in an inbox…" (speed promise) | "Leads are followed up, checked against your criteria and routed with full context…" | `content/journey.ts` |
| "Every lead followed up fast…" | "Leads followed up by people who know where they came from." | `content/systems.ts` |
| Sell long: "trained, managed sales capacity… Our teams work in your CRM" | "managed sales capacity… The work runs in your CRM where you have one" | `content/systems.ts` |
| Sales hero: "Trained, managed teams for…" | "Managed sales capacity for…" | `content/pages.ts` |
| Sales meta description "…inside your CRM." | "…connected to your CRM." | `content/pages.ts` |
| "Team leads handle training, quality review and daily performance" (team structure) | "Training, quality review and day-to-day performance management are part of the service" | `content/pages.ts` |
| "We work in your CRM and calendars" / "We work in your tools by default." | "…where you have them" / "Where you have the tools, we work in yours." | `content/pages.ts` |
| Home act 8 heading "Results agreed before launch, reported every cycle." (implies results) | "Metrics agreed before launch, reported on a set cadence." | `content/pages.ts` |
| "…report against them every cycle" (Home act 6, engagement step 4) | "…on a set cadence" | `content/pages.ts` |
| Work "agreed in writing before launch" | "agreed with you before launch" | `content/pages.ts` |
| "Distributed teams let us staff sales, support and technology work around the markets you sell into" (team size / presence) | "Distributed execution lets us run sales, support and technology work for the markets you sell into" | `content/pages.ts` (Home act 7, About) |
| Home act 7 eyebrow "Global delivery" (presence) | "International delivery" | `content/pages.ts` |
| "A connected operation outperforms a stack of disconnected vendors." (performance claim) | "…closes the gaps a stack of disconnected vendors leaves open." | `content/pages.ts` |
| "Connecting the system fixes problems no single vendor is positioned to see." | "…puts those gaps in front of one accountable partner." | `content/pages.ts` |
| "Because Growlatics also runs sales and support…" | "When Growlatics also runs your sales and support…" | `content/pages.ts` |
| "Winning a customer costs more than keeping one" (absolute) | "…usually costs more…" | `content/pages.ts` |
| `salesHandoff.team`, `workSchematic`, `sell.bpo` label flags | cleared: they restate the softened copy above; BPO scope stays flagged at item 1 | `content/pages.ts`, `content/systems.ts` |

Kept as is (descriptive, owner-approved wording): "managed sales capacity", "Not a call center", "US / Pakistan business serving clients in the United States, the United Kingdom, Pakistan and other international markets", the service capability lists. No branch, office or city claims exist anywhere.
