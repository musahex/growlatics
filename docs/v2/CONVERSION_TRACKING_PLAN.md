# Growlatics v2 — Conversion tracking plan

Stream: growth audit, 2026-10-09, base `v2` 51da8b9. Brief §12, §15. Issue detail: `docs/v2/audit/cro.md`.
Nothing here activates a vendor, adds an ID or sends data anywhere. The site today makes **0 third-party requests** and sets **0 cookies** (local export, all 9 routes + full contact flow, Chromium).

## 1. Journey audit

| Stage | Where | Status | Evidence |
|---|---|---|---|
| Land | 9 indexable routes | PASS | 0 external requests, 0 console errors [export] |
| See CTA | header + hero on `/`, `/services/`, 4 service pages; header only on `/about/`, `/work/` | PASS / P2 gap | cro.md CRO-02 [export] |
| Click CTA | `/contact/#book`; service heroes add `?system=<slug>` | PASS; final CTA on service pages drops preselect | CRO-01 [export] |
| Qualify | 5 steps: needs, stage, markets, start, contact | PASS | validation, focus, keyboard, Back/Edit verified at 390 and 1440 [export] |
| Hand-off (default) | prefilled `mailto:ahsan@growlatics.com` | PASS: copy says "One last step: send the email" | body verified incl. campaign line [export] |
| Hand-off (webhook) | `NEXT_PUBLIC_LEAD_PROVIDER=webhook` | PASS: success only on HTTP 2xx; 500 → error + email fallback | selfcheck + stubbed endpoint |
| Lead received | owner inbox / CRM | PENDING VERIFICATION | production only (LAUNCH.md §3.11) |

**The measurement gap:** with the default mailto provider the site **cannot know** whether a lead was sent. The visitor's mail app sends it, outside the site. So the only honest conversion signal is `contact_email_intent` (intent) on the site plus the email arriving in the inbox (truth). A real `lead_submitted` count needs the webhook provider (or a form backend) — owner decision O-1.

## 2. Event taxonomy (implemented)

`lib/analytics/index.ts` — `track(name, props)` pushes `{ event, page, ...props }` to `window.dataLayer` **only if a tag manager already created it**. Otherwise a no-op. No network, no cookies, no IDs, no form values.

| Event | Fires when | Props | Conversion? |
|---|---|---|---|
| `booking_link_clicked` | any Button to `/contact/…` (header, heroes, final CTA, mobile menu); scheduler link after a request | `target: contact_form \| scheduler`, `location` (`site-header`, `footer`, section id e.g. `hero`, `book-cta`), `after` (scheduler only: `sent`/`mailto`) | no (navigation intent) |
| `contact_form_started` | first answer changed, or first Continue (once per page view) | `preselected: bool` | no |
| `contact_step_completed` | a step passes validation (once per step per page view, not repeated after Back/Edit) | `step: needs\|stage\|markets\|start\|contact`, `step_number: 1–5` | no (funnel) |
| `contact_email_intent` | mailto opened by the form, or a Button `mailto:` link clicked | `method: form_mailto \| form_fallback \| link`, `location` | **micro-conversion only**. Never a lead. |
| `contact_phone_intent` | Button `tel:` link clicked | `location` | micro |
| `lead_submitted` | `submitLead()` got `sent` from a non-mailto provider (webhook = HTTP 2xx) | `provider`, `needs` (service slugs) | **primary conversion** |

Every event also carries `page` (pathname). Honeypot-filled submissions emit nothing.
Verified [export, Chromium 1440 + 390]: CTA on `/services/sales-bpo/` → `booking_link_clicked` → `contact_form_started` → 5 × `contact_step_completed` → `contact_email_intent:form_mailto`. No `lead_submitted` on mailto (selfcheck asserts it too, plus webhook 500 and forced fallback).
Webhook build [export, stubbed endpoint]: HTTP 500 → error heading, no `lead_submitted`, "Send by email instead" → `contact_email_intent:form_fallback`; HTTP 200 → "Thanks — your request is in.", `lead_submitted`, `attribution` in the POST body, scheduler link shown. The scheduler `booking_link_clicked` is verified in source only (the click navigates away before it can be read).
No dataLayer (today's production state): `window.dataLayer` stays undefined, 0 errors, 0 cookies, 0 external requests.
Not covered: footer and contact-aside email/phone plain links (cro.md CRO-07).

### Attribution (implemented, first-party)
- `captureAttribution()` stores `utm_source/medium/campaign/term/content` (≤100 chars each) + `landing_page` (path only) + `referrer` (host only) in **sessionStorage** `gl_attribution`, first touch per tab, **only when UTMs are present**.
- Captured on `/contact/` load and on any CTA click. Ceiling: a visitor who lands with UTMs, browses to a second page, then clicks a CTA loses them. Fix: one `useEffect(() => captureAttribution(), [])` in `components/layout/Header.tsx` (recommended, outside my files).
- Click IDs (`gclid`, `fbclid`, `li_fat_id`) are **not** stored: they are identifiers. GA4/Ads tags read them themselves once consented.
- Sent with the request: mailto body line `Campaign: utm_source=…`; webhook JSON field `attribution`.

## 3. Recommended stack (minimal; owner activates, no IDs inserted)

| Tool | Purpose | Status | Owner action |
|---|---|---|---|
| Google Search Console | indexing, queries | MISSING (PENDING VERIFICATION) | verify `growlatics.us` (DNS TXT or HTML file), submit `/sitemap.xml` |
| Bing Webmaster Tools | Bing + Copilot indexing | MISSING | import from Search Console, submit sitemap |
| GTM container | single tag loader, reads `dataLayer` | MISSING | create container; give god the `GTM-XXXX` ID to add behind consent |
| GA4 via GTM | traffic + the events above | MISSING | create property; mark `lead_submitted` as key event; `contact_email_intent` as secondary |
| Consent Mode v2 + CMP | gate GA4/ads tags | MISSING | choose CMP (see §5) |
| Google Ads conversion | import GA4 `lead_submitted` | NOT APPLICABLE until ads run | import, don't add a second tag |
| Meta Pixel / CAPI | Meta ads | NOT APPLICABLE until Meta ads | CAPI needs a **server endpoint** (webhook receiver, e.g. Zapier/Make/server); no client-side "CAPI" |
| LinkedIn Insight | LinkedIn ads | NOT APPLICABLE until LinkedIn ads | add via GTM behind consent |
| Hotjar/Clarity etc. | — | not recommended at launch | — |

## 4. Integration plan (static export, Hostinger)

1. **Launch (no change needed):** event layer ships dormant. Add Search Console + Bing (no code; file-based verification would add a file to `public/`).
2. **With GTM:** god adds the GTM snippet (`next/script`, `afterInteractive`) gated by `NEXT_PUBLIC_GTM_ID` (unset = no snippet, so preview and current builds stay tag-free) and a Consent Mode default-denied block *before* it. GTM creates `dataLayer`; events start flowing with no further code change.
3. **GA4 in GTM:** one Custom Event trigger per event name; map props to event parameters; `page` → `page_path`.
4. **Real lead count:** set `NEXT_PUBLIC_LEAD_PROVIDER=webhook` + `NEXT_PUBLIC_LEAD_WEBHOOK_URL` (CRM, Zapier/Make/n8n). The receiver must allow CORS from `https://growlatics.us` and return 2xx only after storing the lead. That also gives the server hop CAPI needs.
5. **CSP:** if a CSP is added to `.htaccess` later, allow `www.googletagmanager.com`, `*.google-analytics.com` and the CMP host only.
6. **Privacy draft:** update `content/legal.ts:50` (cookies section) and "How your request reaches us" when any tool or provider is activated (cro.md CRO-08).

## 5. Consent architecture

- Default: **no tag loads** without an ID set at build time. Today the site needs no banner (no cookies, no third parties; theme in localStorage, UTMs in sessionStorage are strictly functional/first-party — owner/legal to confirm).
- Once GA4/ads are added: Consent Mode v2 with `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` **denied by default** for UK/EEA visitors; a CMP banner with equal "Accept" / "Reject". `track()` keeps pushing to `dataLayer`; GTM decides what fires.
- Jurisdiction questions for the owner / counsel (not answered here):
  - **UK:** UK GDPR + PECR need prior consent for analytics cookies (the 2025 Data (Use and Access) Act relaxes some analytics cases; counsel to confirm scope). Need a lawful basis for lead data and a retention period.
  - **US:** which states' visitors matter (CA CCPA/CPRA "sale/share" opt-out if ad pixels run; others similar)? Is a "Do Not Sell or Share" link needed once Meta/LinkedIn pixels run?
  - **Pakistan:** PECA 2016 applies; the Personal Data Protection Bill is not enacted as far as this audit can verify — counsel to confirm current status.
  - Legal entity name and controller contact for the privacy notice (OWNER_VERIFY #4).

## 6. Performance cost of this change

`Button` became a client component for the click handler. First Load JS (Next build output):

| Route | Before | After | Budget (+2 kB) |
|---|---|---|---|
| `/` | 165 | 166 | 167 ✓ |
| `/services/` | 160 | 162 | 162 ✓ |
| `/services/[slug]` | 161 | 163 | 163 ✓ |
| `/contact/` | 152 | 153 | 154 ✓ |
| `/about/`, `/work/` | 138, 139 | 140, 141 | not budgeted |

If a later change needs the headroom: move click tracking to one delegated `document` listener mounted in the Header and revert `Button` to a server component.

## 7. Owner decisions

| # | Decision | Default if no answer |
|---|---|---|
| O-1 | Keep mailto, or configure a webhook/CRM so `lead_submitted` is real | mailto; report leads from the inbox |
| O-2 | Approve GTM + GA4 (and give IDs) | no tags |
| O-3 | CMP vendor and consent policy per market (UK opt-in, US opt-out) | no tags, no banner |
| O-4 | Ads platforms to run (drives Pixel / Insight / CAPI) | none |
| O-5 | Scheduler URL (Calendly / Cal.com) | none; CTA leads to the request form |
| O-6 | Keep "Book a Growth Call" while no scheduler exists, or use "Request a Growth Call" | keep |
| O-7 | Approve privacy-draft wording for UTMs in sessionStorage + chosen tools | draft unchanged, stays unpublished |
