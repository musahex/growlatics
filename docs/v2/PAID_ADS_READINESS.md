# Growlatics v2 — Paid ads readiness

Stream: growth audit, 2026-10-09, base `v2` 51da8b9. Brief §14. No accounts, budgets, keyword volumes or forecasts are assumed. Tracking detail: `CONVERSION_TRACKING_PLAN.md`.

## Verdict

**Not ready to run paid ads at launch.** Pages are fast and honest enough to receive traffic, but there is no conversion measurement (no GA4/GTM, no consent, and the default mailto hand-off cannot confirm a lead). Running ads now would spend without a signal to optimise or judge. Blockers: O-1 (webhook/CRM), O-2/O-3 (GTM + consent) in the tracking plan.

## Readiness per platform

| Item | Google Search | Meta (FB/IG) | LinkedIn | YouTube |
|---|---|---|---|---|
| Landing speed | PASS (Lighthouse mobile 94–97, lab; GLASS_HANDOFF) | PASS | PASS | PASS |
| Message hierarchy (hero = offer) | PASS on service pages (hero names the service + CTA) | PASS | PASS | PASS |
| Conversion action defined | FAIL: `lead_submitted` exists in code but needs webhook provider | FAIL | FAIL | FAIL |
| Tag installed | MISSING (GA4 → Ads import) | MISSING (Pixel) | MISSING (Insight) | MISSING (via Google Ads) |
| Server-side events | N/A | MISSING: CAPI needs a server endpoint | N/A (optional CAPI, same) | N/A |
| Consent | MISSING (Consent Mode v2) | MISSING | MISSING | MISSING |
| UTM capture into lead | PASS (sessionStorage → email/webhook) | PASS | PASS | PASS |
| Privacy policy live | FAIL: draft unpublished (OWNER_VERIFY #4); Google and Meta require one for lead ads and personalised ads | FAIL | FAIL | FAIL |
| Trust assets (proof, clients, reviews) | MISSING by owner decision B (no proof yet) — expect weaker cold-traffic conversion | MISSING | MISSING | MISSING |
| Message match ad → page | possible per service page (4) | same | same | same |

Labels: speed and hierarchy [export + lab]; everything else [src].

## Landing-page recommendations

**Now (no new pages):** send each campaign to the matching service page, not the home page (home is the 9-act story, long and 3D-heavy; service pages carry the offer above the fold and the `?system=` preselect).

| Campaign theme | Landing URL |
|---|---|
| Sales & BPO, outbound, appointment setting | `/services/sales-bpo/?utm_source=…&utm_medium=cpc&utm_campaign=…` |
| Performance marketing, SEO, social, YouTube | `/services/performance-marketing/?utm_…` |
| Customer support outsourcing | `/services/customer-operations/?utm_…` |
| Web / ecommerce / automation | `/services/technology/?utm_…` |
| Brand / retargeting | `/` or `/contact/?utm_…` |

**Later (after 30–60 days of conversion data, owner approval):** dedicated landing pages, each differentiated (one offer, one audience, one proof block, the flow embedded with `?system=` preselected, `noindex` if near-duplicate of the service page): (1) Sales & BPO, (2) appointment setting / outbound, (3) performance marketing, (4) support outsourcing, (5) ecommerce / web. Do **not** build them now: without proof assets and data they would be near-duplicates of the service pages (brief §14).

## Organic vs paid

- Organic targets: service pages + future cluster articles (see ORGANIC_GROWTH_ROADMAP). Keep canonical, indexable.
- Paid targets: the same service pages at launch; dedicated ad pages later, `noindex` and excluded from the sitemap so they do not compete with organic pages.

## UTM plan

Lowercase, hyphens, no PII ever in a URL.

| Param | Values |
|---|---|
| `utm_source` | `google`, `bing`, `meta`, `linkedin`, `youtube`, `newsletter`, `partner-<name>` |
| `utm_medium` | `cpc`, `paid-social`, `video`, `email`, `referral`, `organic-social` |
| `utm_campaign` | `<yyyy-mm>-<system>-<market>` e.g. `2026-11-sales-bpo-us` |
| `utm_content` | creative / ad variant id, e.g. `hero-a` |
| `utm_term` | search keyword (Google/Bing auto) |

Use UTMs on owned social profile links too (LinkedIn, Facebook, Instagram bios). The flow stores them first-touch per tab and sends them with the request (cro.md; CONVERSION_TRACKING_PLAN §2).

## Attribution limits (say these to the owner)

- Mailto default: the site sees intent, never the send. Ad platforms will under-count or (if `contact_email_intent` is imported as a conversion) over-count. Import only `lead_submitted`.
- sessionStorage is per tab: a visitor who returns days later in a new tab has no UTMs; the ad platform's own click-ID attribution (once tags are consented) covers that.
- Consent-denied UK/EEA visitors will be modelled, not counted, by Google; Meta/LinkedIn lose them.
- Offline outcome (call booked, deal won) needs the CRM: upload as offline conversions later.

## Owner checklist before the first campaign

1. Webhook/CRM provider live, one test lead received (O-1).
2. GTM + GA4 + Consent Mode + CMP live; `lead_submitted` marked key event (O-2, O-3).
3. Privacy policy approved and linked (OWNER_VERIFY #4).
4. Ads accounts created by the owner; conversion imported from GA4 (no second tag).
5. Campaign URLs built from the UTM plan; checked on the live site.
