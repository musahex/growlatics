# Growlatics v2 — Organic growth roadmap (first 90 days)

Stream: gl-audit-content. Date 2026-10-09. Brief §13. **No traffic, ranking or lead forecasts.** The site is new on its domain content-wise, has no published proof, and no Search Console data yet; any number would be invented. Progress is measured by what gets done and what Search Console shows after launch.

Nothing here is published autonomously. Every article or page below is a proposal for the owner to approve, and every one must avoid the brief's "never" list (no fabricated proof, numbers, locations or guarantees).

## 1. Cluster architecture

Hubs already exist; spokes are future, only where the owner can supply real substance.

```
/ (entity)
└─ /services/ (hub of hubs)
   ├─ Sales & BPO        /services/sales-bpo/              ← commercial priority
   │    spokes (future):  outbound vs inbound sales capacity · how appointment setting works with your CRM ·
   │                      lead qualification criteria (how to define a qualified lead) · BPO scope (after OWNER_VERIFY 1)
   ├─ Marketing          /services/performance-marketing/
   │    spokes (future):  measuring marketing on pipeline, not clicks · tracking leads from ad to CRM
   ├─ Customer Ops       /services/customer-operations/
   │    spokes (future):  connecting support to sales and marketing · retention and win-back workflows
   └─ Technology         /services/technology/
        spokes (future):  connecting CRM, forms and help desk · ecommerce builds connected to campaigns and support
/work/  ← case studies attach here when the owner has evidence (proof slots already wired)
/about/ ← E-E-A-T assets attach here (people, entity details) when supplied
```

Rules: every spoke links up to its hub and across to the one sibling it hands off to (the existing "Pairs with" logic). No city/country landing pages. No spoke that would be under ~500 words of real, specific substance.

Priority order (relevance × intent × what Growlatics can say truthfully today): **Sales & BPO → Customer Ops → Marketing → Technology.**

## 2. 90-day plan

Day 0 = production launch on Hostinger (owner-approved). Dates resolve from the launch date, not from today.

| Window | Work | Owner input needed | Done when |
|---|---|---|---|
| Launch week | Verify growlatics.us in Google Search Console and Bing Webmaster Tools; submit `sitemap.xml`; request indexing of `/`, `/services/`, the four service pages | GSC/Bing access (owner account) | Both consoles show the sitemap read with 9 URLs |
| Launch week | Make the LinkedIn, Facebook and Instagram profiles use the same entity line as the site ("US / Pakistan-based international growth operations, Sales & BPO and technology partner") and link to growlatics.us | Profile access | Same wording on site, schema `sameAs` profiles |
| Days 1–30 | Watch GSC Coverage/Pages for exclusions; fix any crawl or canonical issue | — | No unexplained exclusions |
| Days 1–30 | Owner settles OWNER_VERIFY 1–5; legal pages approved or kept out | Decisions | Flags cleared or strings removed |
| Days 1–30 | Collect E-E-A-T assets (see `audit/aeo-content.md` §5): named leadership with permission, legal entity name, one permissioned case study | Owner evidence | At least one item ready to publish |
| Days 30–60 | First GSC query review (Performance → Queries, per page). Map real queries to the page that should own them; adjust titles/descriptions only where the query intent matches existing copy | — | Short note of query → page decisions |
| Days 30–60 | First Sales & BPO spoke (one article), written from the owner's actual process, reviewed by the owner | Owner interview / review | Published, linked from Sales & BPO |
| Days 30–60 | If one case study is approved, publish it on `/work/` via `content/proof.ts` (approvedBy/approvedOn required) | Evidence + approval | Proof slot renders |
| Days 60–90 | Second spoke (Customer Ops or Marketing, whichever GSC shows more impressions for) | Owner review | Published, linked |
| Days 60–90 | Review: which service pages get impressions but few clicks (title/description fit), which get none (indexing or relevance). Decide whether a paid landing page (see PAID_ADS_READINESS) or more organic content is the next step | — | Decision recorded |

## 3. What not to do
- No speculative articles published by an agent.
- No keyword-volume targets, rank promises or traffic projections.
- No thin pages for each capability (social, SEO, YouTube, etc. stay subsections + FAQ until there is real depth).
- No local/city pages, no LocalBusiness schema, no GBP listing without a verified office.
- No FAQ blocks repeated across pages; each page's FAQ answers questions specific to it.
