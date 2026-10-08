# CRO audit — Book a Growth Call + contact flow (stream: growth, 2026-10-09)

Base `v2` 51da8b9. Evidence: local export (`npm run build` → `out/`) loaded in headless Chromium (Chrome channel, playwright-core) through request interception (no server; sandbox blocks port binding). Viewports 390×844 (mobile, touch), 820×1180 (tablet, touch), 1440×900. WebKit and Firefox: **NOT RUN** (not installed). Real devices: NOT RUN. Scripts: `cta.mjs`, `flow.mjs`, `hook.mjs`, `nodl.mjs` (session scratchpad; logic summarised below).

Labels: **[src]** source inspection · **[export]** local export test · **[preview]** public preview · **[prod]** production-only.

## Summary

| Check | Status | Label |
|---|---|---|
| "Book a Growth Call" reachable above the fold on all 9 commercial routes, 390 / 820 / 1440 | PASS | export |
| Wording identical across header, heroes, final CTAs, footer, 404 | FAIL (P3, CRO-03) | src + export |
| Mobile (<640 px) header CTA has visible text | FAIL (P2, CRO-02) | export |
| Service page final CTA keeps `?system=` preselect | FAIL (P2, CRO-01) | export |
| `?system=<slug>` preselects the need | PASS | export |
| Validation: required, email, URL, phone, "Other market" text | PASS | export |
| Errors: text shown, `aria-invalid`, `aria-describedby`, focus moves to first invalid field | PASS | export |
| Keyboard: Enter submits a step, arrow keys pick radios, focus moves to each step heading | PASS | export |
| Mobile keyboard types (`type=email/url/tel`, `autocomplete` name/email/organization/url/tel) | PASS | export |
| Back / Edit keep every answer | PASS | export |
| Mailto hand-off: result says "One last step: send the email", never "sent" | PASS | export |
| Mailto body complete and under 2,000 chars (selfcheck) | PASS | export + src |
| A mailto open is never counted as a lead | PASS (after fix, CRO-05) | export + src |
| Webhook: success only on HTTP 2xx; 500 → error + email fallback | PASS | export (stubbed endpoint) |
| "Copy my answers" gives feedback when the clipboard is unavailable | FAIL (P3, CRO-06) | export |
| Click-to-email / click-to-call use only owner-confirmed values (`content/site.ts:18`) | PASS | src |
| Third-party requests on all 9 routes and through the whole flow | PASS: 0 | export |
| Cookies / localStorage written by the flow | PASS: 0 cookies; sessionStorage only when UTMs exist | export |
| Real lead delivery to ahsan@growlatics.com | PENDING VERIFICATION | prod |
| 5 steps justified | PASS with recommendation (CRO-04) | export |

## CTA placement (export, all three widths)

| Route | Above fold | Further down |
|---|---|---|
| `/` | header CTA + hero "Book a Growth Call" | act 9 final CTA + "Email us", footer |
| `/services/` | header + hero | final CTA, footer |
| 4 × `/services/<slug>/` | header + hero → `/contact/?system=<slug>#book` | final CTA → `/contact/#book` (no preselect), footer |
| `/about/`, `/work/` | header only (heroes have no CTA) | in-body link (about), final CTA, footer |
| `/contact/` | header; the flow itself is the hero target | direct email / phone, footer |

## Issues

| ID | P | Route / component | Evidence | Fix | Auto? | Fixed? |
|---|---|---|---|---|---|---|
| CRO-01 | P2 | 4 service pages, `app/services/[slug]/page.tsx:148` → `components/patterns/ConvergenceCTA.tsx:22` | Final CTA href is `/contact/#book`; hero CTA is `/contact/?system=<slug>#book` (export, every slug). A visitor who reads the whole page and clicks the bottom CTA loses the preselect. | Give `ConvergenceCTA` an optional `href` prop (default `site.finalCta.primary.href`) and pass `` `/contact/?system=${sys.slug}#book` `` from the slug page. No visual change. | yes | no (outside my files) |
| CRO-02 | P2 | `components/layout/Header.tsx:304` | Below 640 px the header CTA is a calendar icon with `aria-label` only. On `/about/` and `/work/` at 390 px it is the only CTA above the fold (export). Icon-only CTAs are easy to miss. | Owner/design call: either add a hero CTA to About/Work (`content/pages.ts` hero `primary: book`) or show a short text label ("Book a call") at <640 px if the header width allows. Keep the glass header. | partly | no |
| CRO-03 | P3 | `components/layout/Header.tsx:300` | 640–767 px header label is "Book a call"; everywhere else "Book a Growth Call" (and the submit is "Request my Growth Call"). | Acceptable for space; if kept, it's the only variant. "Book" promises scheduling while the default outcome is an email request: keep until a scheduler is configured, then the wording becomes literal. Owner decision O-6 in CONVERSION_TRACKING_PLAN. | n/a | no |
| CRO-04 | P3 | `components/patterns/QualificationFlow.tsx:18` | 5 steps; steps 2 (stage) and 4 (start) are single radios with 4 and 3 options. Full flow by keyboard took 5 Continue presses + 3 required fields (export). | Justified for qualification, and every step is one tap. Recommendation for later, based on real drop-off data (`contact_step_completed`): merge stage + start into one step (4 steps). Do not change before data exists. | n/a | no |
| CRO-05 | P1 | `lib/leads`, `QualificationFlow` | Before: no event layer; nothing could distinguish a mailto open from a confirmed lead once a tag manager is added. | Added `lib/analytics` `track()`; `lead_submitted` fires only inside `submitLead()` when a non-mailto provider returns `sent` (webhook HTTP 2xx). Mailto fires `contact_email_intent`. | yes | **yes** |
| CRO-06 | P3 | `components/patterns/QualificationFlow.tsx` `copy()` | On a non-secure origin (http) `navigator.clipboard` is undefined; the button silently does nothing (export over http). On https (production) it works (export over https: body copied). | Low impact in production. If wanted: on failure select the text in a read-only `<textarea>`; needs a visual decision. | no | no |
| CRO-07 | P3 | `components/layout/Footer.tsx:8`, `app/contact/page.tsx:25,30` | Footer and contact-aside email/phone links are plain `<a>`, not `Button`, so they emit no `contact_email_intent` / `contact_phone_intent`. Button-based CTAs (header, heroes, final CTA, "Email us") do. | Wrap those anchors' `onClick` with `trackLink(href, 'footer' \| 'contact-aside')` from `@/lib/analytics`, or let GTM's link-click trigger cover `mailto:`/`tel:`. | yes | no (outside my files) |
| CRO-08 | P2 | `content/legal.ts:50` | Privacy draft says only the theme is stored. The flow now keeps UTM parameters in `sessionStorage` (`gl_attribution`) when the landing URL carries them, and adds them to the email / webhook body. | Add one sentence to the draft: campaign parameters from the link you arrived on are kept for the visit and sent with your request. Legal approval still with owner. | yes | no (outside my files) |

## Component cards

**Book a Growth Call CTA** (`components/ui/Button.tsx`, used by Header, PageHero, ConvergenceCTA, home acts)
- SEO: internal `next/link` to `/contact/#book`, crawlable anchor text. PASS.
- AEO: N/A.
- A11y: real `<a>`; icon-only mobile variant has `aria-label`. PASS.
- Perf: now a client component for the click event; First Load JS +1–2 kB on routes that had only server Buttons (table in CONVERSION_TRACKING_PLAN §6). Within budget.
- Conversion: present on every commercial route; see CRO-01/02/03.
- Events: `booking_link_clicked {target:'contact_form', location}`, `contact_email_intent {method:'link'}`, `contact_phone_intent`. No-op without `window.dataLayer`.
- Status: PASS with P2/P3 recommendations.

**ContactForm / QualificationFlow** (`components/patterns/QualificationFlow.tsx`, `lib/leads`)
- SEO: form is client-rendered inside a static page; page text (hero, "What happens on the call", direct contacts) is in the HTML. PASS.
- AEO: contact facts are text, not images. PASS.
- A11y: fieldset/legend per step, focus management, labelled inputs, errors linked, honeypot hidden from AT. PASS (keyboard verified; screen reader NOT RUN).
- Perf: `/contact/` 152 → 153 kB First Load JS.
- Conversion: 5 short steps; preselect works; mailto honest; webhook confirmed-only. See CRO-04/06.
- Privacy: no cookies, no third-party requests, answers stay in memory until the visitor sends. UTMs only if present, path-only landing page, host-only referrer, no click IDs.
- Status: PASS; lead delivery PENDING VERIFICATION in production (LAUNCH.md §3 step 11).
