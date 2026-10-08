# Structured data audit (gl-audit-tech, 2026-10-09)

Scope: brief §9.6, §10 (schema location fields). Generator: `lib/seo.ts`; emitted by `app/page.tsx`, `app/services/page.tsx`, `app/services/[slug]/page.tsx`, `app/about|work|contact/page.tsx`. All values come from `content/`; nothing invented.
Evidence: LOCAL export, parsed from `out/**/index.html` by `scripts/seo-crawl.mjs` (JSON.parse of every block, type list, banned-property scan, `@id` reference resolution). Google Rich Results Test / Schema Markup Validator: **PENDING VERIFICATION** (need the public URL; run them on the preview after the next dispatch, then on production).

## What each route emits (after this branch)

| Route | Nodes | `@id`s |
|---|---|---|
| `/` | Organization, WebSite, WebPage (`about` → Organization) | `/#organization`, `/#website`, `/#webpage` |
| `/services/`, `/about/`, `/work/`, `/contact/` | WebPage (`isPartOf` → WebSite, `breadcrumb` →), BreadcrumbList | `{route}#webpage`, `{route}#breadcrumb` |
| 4 service pages | Service (`provider` → Organization, `mainEntityOfPage` → WebPage), WebPage, BreadcrumbList | as above |
| 404 | none (noindex) | — |

Example (`/services/sales-bpo/`): Service `name` "Sales & BPO", description = the page meta description, `areaServed` United States / United Kingdom / Pakistan (`Country`), provider `{@id /#organization, name, url}`; breadcrumb Home › Services › Sales & BPO with absolute `https://growlatics.us/…/` items.

## Checks

| Check | Status | Evidence / note |
|---|---|---|
| Valid JSON on every page | PASS | crawl JSON.parse, 0 errors |
| `@id` references resolve | PASS | crawl: every reference-only `{"@id"}` matches a node defined on the site (WebSite/Organization are defined on `/` and referenced elsewhere, which schema.org allows; Service provider also carries name + url so it stands alone) |
| URLs absolute, on `https://growlatics.us`, trailing slash | PASS | including preview build (no `/growlatics/` in JSON-LD) |
| Organization fields | PASS | name, url, logo (512×512 PNG, exists), description, email, telephone `+1-470-755-6472`, contactPoint (sales), areaServed, sameAs |
| `sameAs` only real profiles from `content/site.ts` | PASS with note | LinkedIn 200, Instagram 200; Facebook is a share short-link (302 → `profile.php?id=61581775025692`): content owner should swap in the profile URL (`content/site.ts:21`, TECH-06) |
| No address / LocalBusiness / Review / AggregateRating / offers / price / foundingDate / numberOfEmployees | PASS | crawl banned-property scan, 0 hits |
| Location fields | PASS | only `areaServed` (countries from `site.markets`, "International" omitted since it is not a place). No `address`, `geo`, `location`: no verified office is published |
| BreadcrumbList matches visible IA | PASS | names from `nav.header` labels; no visible breadcrumb UI exists, which Google accepts but it is a minor mismatch (P3, design decision, no change) |
| WebPage name/description match page metadata | PASS | name = OG title, description = meta description |
| FAQPage | NOT APPLICABLE | Services and each service page have 4 FAQs, but since Aug 2023 Google only shows FAQ rich results for well-known government and health sites; the questions are already plain HTML (`h3` + text) which answer engines read directly. Adding FAQPage would be markup with no display benefit and one more thing to keep in sync |
| hreflang | NOT APPLICABLE | one English site, no language alternates |
| Rich Results Test, Schema Markup Validator | PENDING VERIFICATION | needs a public URL |

## Changes made (`lib/seo.ts`)

1. Added WebPage nodes (Home and every inner page) tying page → WebSite → Organization, with `inLanguage: "en"`.
2. BreadcrumbList moved into a `@graph` with WebPage and given an `@id` (`breadcrumbJsonLd` → `pageJsonLd(route, seo)`).
3. Service gets `mainEntityOfPage` → its WebPage.
4. `areaServed` changed from bare codes (`"US"`, `"GB"`, `"PK"`) to `{"@type":"Country","name":…}`: a bare "GB" is ambiguous text to a parser.

## Not done, and why

- `logo` as a wide wordmark: the 512×512 square mark is valid for Google's logo guidance; no change.
- `Person` / founder / `foundingDate` / `numberOfEmployees`: no owner-approved facts.
- `llms.txt`: not added (see `docs/v2/audit/tech-seo.md` §5). Structured data and llms.txt do not guarantee AI citations.
