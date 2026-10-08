# Growlatics v2 — Keyword and content map

Stream: gl-audit-content, branch `v2-audit-content` (base `51da8b9`). Date 2026-10-09. Brief §7, §8, §13.

**Read this first.** Every keyword below is a *research candidate*: a phrase that matches what the page already offers. None is a proven target. **No search volume, difficulty or traffic numbers are given, and none should be added without a real tool export** (Search Console after launch, or a paid keyword tool the owner chooses). The "SERP type" column comes from a few web searches on 2026-10-09 (sources at the end). It describes what kind of page ranks, not how hard it is to rank.

## 1. Per-page map (source inspection + local export)

| Route | Primary topic (one per page) | Supporting terms already on the page | Intent | Audience | Geography | Coverage now | Gap | Internal links in / out |
|---|---|---|---|---|---|---|---|---|
| `/` | Growlatics as an entity: growth operations, Sales & BPO and technology partner | growth operations, Sales & BPO, performance marketing, customer operations, technology, connected system | Navigational (brand) + early commercial | Established and growing businesses | US, UK, PK, international (act 7) | Strong narrative; all four service summaries are in the static HTML (Inspector panels) | None for launch. Brand query only until the brand is known | Out: every service page, /services/, /about/, /work/, /contact/ |
| `/services/` | Overview of the four services | Sales & BPO, performance marketing, customer operations, technology & development, engagement steps | Commercial investigation | Buyers comparing scope | as Home | 4 service blocks with capability chips, journey map, engagement, 7-item FAQ | — | In: header, footer, home. Out: 4 service pages |
| `/services/sales-bpo/` | Managed sales capacity / sales outsourcing (lead offer) | cold outreach, outbound calling, inbound response, lead qualification, appointment setting, telesales, CRM hygiene, pipeline reporting, back-office (BPO) | Commercial / transactional | Revenue leaders with uncalled leads or stop-start outbound | US, UK, PK, intl (FAQ) | Answer-first overview, 4 capability groups, how it works, FAQ ×5 | No proof (owner); BPO scope pending (OWNER_VERIFY 1) | In: header, footer, home, /services/, siblings. Out: siblings, /work/, /contact/?system=sales-bpo |
| `/services/performance-marketing/` | Performance marketing measured on pipeline | Google Ads (search, shopping), Meta, SEO and content, social media management, YouTube performance, landing pages, tracking | Commercial | Marketing/growth leads, ecommerce | as Home | Answer-first overview, 6 capabilities, FAQ ×3 | No proof | as above |
| `/services/customer-operations/` | Customer support operations (chat, phone, email) and retention | chat and email support, call support, team operations, retention and win-back, onboarding and order support, CX operations / help desk | Commercial | Ops/CX leads | as Home | Answer-first overview, 6 capabilities, FAQ ×3 | Coverage hours/languages deliberately unstated | as above |
| `/services/technology/` | Web, ecommerce and automation development connected to growth | websites, landing pages, WordPress, ecommerce builds, web and mobile apps, UI/UX, automation and integrations, QA, maintenance | Commercial | Founders/ops needing a site, store or integrations | as Home | Answer-first overview, 6 capabilities, FAQ ×3 | No portfolio (owner) | as above |
| `/about/` | Who Growlatics is | international growth operations, Sales & BPO and technology partner, US / Pakistan business | Navigational / trust | Buyers checking the company | US, UK, PK, intl | Why, beliefs, who we work with, international | E-E-A-T assets (see aeo-content.md §5) | In: header, footer, home act 7. Out: /services/, /contact/ |
| `/work/` | How results are defined and reported | metrics, baselines, pipeline, speed, conversion, retention, engagement steps | Trust / investigation | Buyers checking proof | — | Method only; proof slots dormant | Case studies (owner, evidence) | In: header, footer, home act 8, service pages |
| `/contact/` | Book a Growth Call | Growth Call, email, phone | Transactional | Ready buyers | — | Flow + direct contacts + what happens on the call | — | In: every CTA |

## 2. Service-breadth placement (brief §8)

Decision for each service the owner listed: **subsection or FAQ on an existing page now; no thin standalone pages.**

| Service | Where it lives now (static HTML) | Format | Future landing page? |
|---|---|---|---|
| Cold outreach | Sales & BPO: overview, "Pipeline generation" row, FAQ "Do you do cold outreach and appointment setting?" | Subsection + FAQ | Candidate (paid: "outbound / appointment setting") once proof exists |
| Appointment setting | Sales & BPO: overview, "Conversion" row, FAQ | Subsection + FAQ | Same page as cold outreach, not a separate one |
| BPO / back-office | Sales & BPO: "Business process outsourcing" row (scope = OWNER_VERIFY 1), overview | Subsection | Only after the owner confirms the scope |
| Social media marketing | Performance Marketing: overview, "Social and YouTube" row, FAQ | Subsection + FAQ | No (thin) |
| SEO | Performance Marketing: overview, "SEO and content" row, FAQ | Subsection + FAQ | No (thin) |
| YouTube performance | Performance Marketing: overview, "Social and YouTube" row, FAQ | Subsection + FAQ | No (thin) |
| Ecommerce | Technology ("Ecommerce" row, FAQ "Do you build ecommerce stores?") + Performance Marketing (shopping campaigns, FAQ) | Subsection + FAQ on two pages, distinct angles (build vs campaigns) | Candidate (paid: "ecommerce web + campaigns") later |
| Customer support outsourcing | Customer Operations page | Page (exists) | Paid variant later |

## 3. Research candidates per cluster (no metrics)

Grouped by the four systems. "SERP type" = what the first results looked like on 2026-10-09 (standard web search, US).

| Cluster | Candidate phrases (match existing copy) | SERP type observed | Best page |
|---|---|---|---|
| Sales & BPO | sales outsourcing; outsourced appointment setting; B2B appointment setting services; outbound sales outsourcing; inbound sales support; cold outreach services; lead qualification services; telesales outsourcing; sales BPO | Vendor service pages and "what is / benefits" guides mixed; directory and listicle pages for "companies" queries [1][2][5] | `/services/sales-bpo/` |
| Marketing | performance marketing agency; Google Ads management; Meta ads management; SEO services; social media management; YouTube ads management; ecommerce PPC / shopping campaigns | Not searched this pass: assume heavy agency competition; validate in Search Console after launch | `/services/performance-marketing/` |
| Customer Ops | customer support outsourcing; chat and email support outsourcing; customer service outsourcing for ecommerce; retention / win-back support | Vendor pages plus channel explainers (phone vs email vs chat) and platform blogs (e.g. Shopify) [3] | `/services/customer-operations/` |
| Technology | ecommerce website development; WordPress development; CRM integration; marketing automation integration; web app development | Not searched this pass | `/services/technology/` |
| Entity / brand | growth operations partner; growth operations agency | Agency directories and RevOps/growth agencies; term is ambiguous [4] | `/`, `/about/` |
| International | Pakistan BPO for US/UK companies; outsourcing to Pakistan | Pakistani BPO vendor pages and directories; many make cost/speed/24-7 claims [6] | **Not targeted now.** Owner decision on how explicitly to describe Pakistan delivery (OWNER_VERIFY 5). Never copy competitors' cost or speed claims |

Avoid: "call center" as a target (positioning is "Not a call center"; keep the FAQ that answers it); "near me"/city phrases (no offices; brief forbids fake local pages).

## 4. Cannibalisation check (local export)

| Pair | Overlap | Verdict | Action |
|---|---|---|---|
| `/` vs `/services/` | Both introduce the four systems | PASS: Home title/description = entity ("…partner"); Services = service list ("Sales & BPO, Marketing, Support and Technology Services") | Done in this pass (titles retargeted) |
| `/services/` vs service pages | Services repeats each system's `long` text | PASS: overview is a summary that links down; detail pages carry capabilities, FAQ and overview | — |
| Sales & BPO vs Customer Operations | Both mention calling/voice | PASS: Sales = outbound/inbound *sales*; Customer Ops = *support* voice | — |
| Performance Marketing vs Technology on ecommerce and landing pages | Both list landing pages and ecommerce | PASS with care: PM = campaigns/funnels; Technology = builds. FAQ answers point to each other | Keep distinct angles |
| Journey block (Attract…Scale h3s) on `/services/` + 4 service pages | Identical 5 h3s on 5 pages | P3 boilerplate, not cannibalisation | Optional: render journey stage titles as non-heading text on service pages (`app/services/[slug]/page.tsx` journey section → `SignalRail`, owner: patterns stream) |
| Services FAQ vs Sales & BPO FAQ (markets) | Both answer "which markets" | P3, acceptable: different question framing (company vs selling into US/UK) | — |

## Sources (SERP-type observations only)
1. https://revnew.com/blog/b2b-appointment-setting-outsourcing ; https://www.salesfocusinc.com/sales-outsourcing/appointment-setting/ ; https://keyoutreach.com/post/outsourced-b2b-appointment-setting
2. https://www.focusservices.com/services/sales-outsourcing/ ; https://www.convoso.com/blog/what-is-a-bpo-call-center/
3. https://helpware.com/cx/services/customer-support-outsourcing ; https://www.shopify.com/ie/blog/customer-service-outsourcing ; https://vonage.com/resources/articles/call-center-outsourcing
4. https://www.salesforge.ai/directory/agencies/growth ; https://syncgtm.com/directory/agency/lemniscate-growth-growth-marketing-agency
5. https://www.salesforge.ai/blog/coldiq-review ; https://www.salesforge.ai/de/blog/cold-email-agencies
6. https://stealthagents.com/top-25-bpo-companies-in-pakistan ; https://www.outsourceaccelerator.com/company/support-solutions-hub
