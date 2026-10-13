# Growlatics v2 — Information architecture, copy and conversion

Stream: IA-COPY. Branch: `v2-ia-copy` (git cannot hold `v2/ia-copy` while a branch named `v2` exists; same convention as `v2-direction`).
Inputs: `docs/v2/MASTER_BRIEF.md`, `docs/v2/PLAN.md`, god's `growlatics-brief.md`, baseline `lib/content.ts` and `components/sections/*.tsx` at `0b75041`.
Status: final. FOUNDATION implements sections 8 and 1 as data; HOME and PAGES implement section 5 copy verbatim. Change copy only here.

Conventions in this file:
- `H1` / `H2` / `H3` = semantic heading level. `Eyebrow` = small uppercase label above a heading (not a heading element; render as `<p>`).
- `[CTA primary]` = orange button. `[CTA secondary]` = text/ghost button.
- `OWNER-VERIFY` = do not publish until the owner confirms.

---

## 1. Sitemap, navigation, internal links

### 1.1 Sitemap

| Route | Page | Index | Priority |
|---|---|---|---|
| `/` | Home | yes | 1.0 |
| `/services/` | Services overview | yes | 0.9 |
| `/services/sales-bpo/` | Sales & BPO | yes | 0.9 |
| `/services/performance-marketing/` | Performance Marketing | yes | 0.8 |
| `/services/customer-operations/` | Customer Operations | yes | 0.8 |
| `/services/technology/` | Technology & Development | yes | 0.8 |
| `/about/` | About | yes | 0.7 |
| `/contact/` | Contact + Book a Growth Call flow | yes | 0.9 |
| `/work/` | Work (methodology, proof-ready) | yes | 0.5 |
| `/privacy/`, `/terms/` | Drafts only | **noindex, unlinked, not in sitemap** until owner legal approval | — |
| 404 | Not found | noindex | — |

No `/careers/`. No `/blog/`. No anchor-only nav (`#services` etc. are retired).

### 1.2 Header

Left: five-bar mark + wordmark "Growlatics" → `/`.
Center (desktop ≥1024px), in this order:
1. **Services** → `/services/` (desktop: hover/focus opens a panel listing the four systems, Sell first; see below)
2. **Work** → `/work/`
3. **About** → `/about/`
4. **Contact** → `/contact/`

Right: theme toggle · `[CTA primary] Book a Growth Call` → `/contact/#book`.

Services panel (one column per system, each a link):
- **Sell** — Sales & BPO → `/services/sales-bpo/` (listed first, slightly larger)
- **Acquire** — Performance Marketing → `/services/performance-marketing/`
- **Operate** — Customer Operations → `/services/customer-operations/`
- **Build** — Technology & Development → `/services/technology/`
- Footer link in panel: "See how the four systems connect" → `/services/`

Mobile (<1024px): menu button opens a full-height sheet: Services (expandable, same four links), Work, About, Contact, then full-width `Book a Growth Call`. Tablet 768–1023px uses the mobile sheet, not the desktop panel.

Active state: the current section's nav item is marked (`aria-current="page"`).

### 1.3 Footer

Column 1 — brand
- Mark + "Growlatics"
- Tagline: **The systems behind growth.**
- Geography line (verbatim, PLAN.md): **US / Pakistan business; serving US, UK, Pakistan and international clients.**
- Socials (icons with `aria-label`): LinkedIn, Facebook, Instagram (URLs in §8 `site`).

Column 2 — Services: Sales & BPO · Performance Marketing · Customer Operations · Technology & Development · All services
Column 3 — Company: About · Work · Contact
Column 4 — Contact: Book a Growth Call (`/contact/#book`) · ahsan@growlatics.com (`mailto:`) · +1 (470) 755-6472 (`tel:+14707556472`)

Bottom bar: `© {year} Growlatics. All rights reserved.` Privacy / Terms links appear **only** after owner approval flips them live. No branch cities.

### 1.4 Internal-link plan

| From | Links to | Anchor text |
|---|---|---|
| Home act 5 (each system module) | its service page | "Explore Sales & BPO" / "Explore Performance Marketing" / "Explore Customer Operations" / "Explore Technology" |
| Home act 4 (journey) | `/services/` | "See the four systems" |
| Home act 7 | `/about/` | "How we work across markets" |
| Home act 8 | `/work/` | "How we measure work" |
| `/services/` | all four service pages + `/contact/#book` | system names |
| Each service page "Connected systems" section | the other three service pages | "Pairs with {system}" |
| Each service page | `/work/` (methodology) | "How we report results" |
| `/about/` | `/services/`, `/contact/#book` | "The four systems", "Book a Growth Call" |
| `/work/` | `/services/`, `/contact/#book` | — |
| 404 | `/`, `/services/`, `/contact/` | — |
| Every page | final CTA band → `/contact/#book` | "Book a Growth Call" |

Rule: every indexable page links to at least one service page and to `/contact/#book`. No page is more than two clicks from Home.

---

## 2. Positioning and voice

### 2.1 One-line positioning
**Growlatics builds and operates the systems behind growth: demand, sales, customer operations and technology, connected and run by one accountable partner.**

### 2.2 Hero (final)
- Eyebrow: **Growth operations · Sales & BPO · Technology**
- H1: **We build and operate the systems behind growth.**
- Subhead: **Most companies run growth through separate vendors, and leads, context and accountability leak between them. Growlatics connects marketing, sales, customer operations and technology into one operating system, and runs it with you.**
- `[CTA primary]` **Book a Growth Call** → `/contact/#book`
- `[CTA secondary]` **See how the system works** → scrolls to Home act 3 (`#system`)
- Capability panel label (if DIRECTION keeps the panel): **Four connected systems** — rows: Sell · Sales & BPO / Acquire · Performance Marketing / Operate · Customer Operations / Build · Technology & Development.

Alternates (use only if DIRECTION's hero composition needs a shorter line):
1. H1 **One partner across demand, sales, operations and technology.**
2. H1 **Build the system behind your growth.**

### 2.3 Voice rules

1. **Explain, then assert.** Say what we do in plain words before any slogan. One slogan-style line per section, maximum.
2. **Operational verbs.** build, run, connect, qualify, hand off, measure, route, staff, report. Not "empower", "unlock", "elevate", "supercharge".
3. **Specific nouns over abstractions.** "booked meetings", "qualified leads", "response times", "handoffs", "CRM records" — not "results", "solutions", "synergy".
4. **No unverifiable claims.** No numbers, client counts, team size, coverage hours, industry counts, awards, or "leading/best/#1".
5. **International, not offshore.** Say "distributed teams", "multi-market delivery", "teams that extend yours". Never "offshore", "cheap", "low-cost", "outsourcing partner" as a headline, "call center".
6. **Confident, not loud.** Short declaratives. No exclamation marks. No rhetorical-question headlines except the 404.
7. **British/US spelling:** US English site-wide (optimize, center, program) — primary buyer market. (Baseline mixed "optimisation"; normalize.)
8. **Sentence case** for headings and buttons. Product/system names capitalized: Sales & BPO, Performance Marketing, Customer Operations, Technology & Development; systems Acquire, Sell, Operate, Build.

| Don't | Do |
|---|---|
| "Unlock your growth potential with cutting-edge solutions." | "We connect the teams and tools your growth depends on, and run them." |
| "Passionate experts delivering 360-degree digital transformation." | "Marketing, sales, support and technology, operated as one system." |
| "Affordable offshore call-center agents." | "Sales capacity that plugs into your pipeline: outbound, inbound, qualification and booked meetings." |
| "150% ROI in 90 days." | "We agree the metrics before launch and report against them every cycle." |
| "24/7 global coverage." | "Coverage hours are scoped to your markets and agreed in writing." |
| "Ready to skyrocket?!" | "Tell us where growth is stalling. We'll show you where the system leaks." |

Banned list (lint in review): passionate, unlock, potential, 360, cutting-edge, state-of-the-art, transform your digital journey, synergy, world-class, best-in-class, leading, skyrocket, supercharge, game-changer, seamless, offshore, cheap, low-cost, call center (except the deliberate "Not a call center" contrast on Sales & BPO), rockstar, ninja, guaranteed results.

---

## 3. Service taxonomy — four systems

Order everywhere the systems are listed as a set: **Acquire → Sell → Operate → Build** (flow order). Exception: navigation menus and the Services panel list **Sell first** (commercial priority). Visual emphasis: Sell module is larger / first-active in Home act 5 and on `/services/`.

Names kept from PLAN.md; no rename: the verbs read as one flow and each maps to one page.

### 3.1 Acquire — Performance Marketing
- Route: `/services/performance-marketing/`
- Short (≤90 chars): **Demand you can measure: paid, search, social and video, built to feed the pipeline.**
- Long: **Acquire is the demand layer. We plan and run paid search, paid social, SEO, social and YouTube performance programs, and build the landing pages and funnels behind them. Campaigns are measured on what reaches sales — qualified leads and booked conversations — not on clicks alone.**
- Sub-capabilities:
  - Paid search and shopping (Google Ads, Microsoft Ads)
  - Paid social (Meta, LinkedIn, TikTok)
  - SEO and content for search
  - Social media management
  - YouTube performance
  - Lead generation programs
  - Landing pages and funnel optimization
  - Ecommerce campaigns
  - Tracking, attribution and reporting

### 3.2 Sell — Sales & BPO (commercial lead)
- Route: `/services/sales-bpo/`
- Short: **Operational sales capacity: outbound, inbound, qualification and booked meetings, run inside your process.**
- Long: **Sell extends your revenue operation with trained, managed sales capacity. We run cold outreach, outbound and inbound calling, telesales, lead qualification and appointment setting, and the sales operations work that keeps a pipeline clean. Our teams work in your CRM, to your scripts and qualification criteria, and report on the same pipeline your own team sees.**
- Positioning line: **Not a call center. A sales operation that plugs into yours.**
- Sub-capabilities, grouped:
  - **Pipeline generation:** cold outreach (email, phone, LinkedIn), outbound calling, list building and research, campaign support
  - **Conversion:** inbound response and follow-up, lead qualification, appointment setting, telesales
  - **Sales operations:** CRM hygiene and data entry, pipeline reporting, script and cadence design, sales process support
  - **Business process outsourcing (BPO):** back-office and business-process execution that supports the revenue cycle (order processing, follow-up workflows, data and admin tasks)
- Engagement shapes (copy, no pricing): **Dedicated team** (named people working only on your account) · **Campaign** (a defined outreach or calling program with a start and end) · **Overflow** (extra capacity on top of your in-house team).

### 3.3 Operate — Customer Operations
- Route: `/services/customer-operations/`
- Short: **Support and retention operations — chat, call and email — run to your standards.**
- Long: **Operate keeps the customers you've won. We staff and run customer support across chat, phone and email, build the workflows behind it, and handle retention and win-back programs. Every conversation is logged where your team can see it, so service, sales and marketing work from the same customer record.**
- Sub-capabilities:
  - Chat and email support
  - Call (voice) support
  - Customer service team operations (staffing, QA, escalation paths)
  - Retention and win-back workflows
  - Onboarding and order support
  - CX operations: help-desk setup, macros, knowledge base, reporting

### 3.4 Build — Technology & Development (the infrastructure layer)
- Route: `/services/technology/`
- Short: **The infrastructure layer: websites, ecommerce, products and the automation that connects every system.**
- Long: **Build is the layer that connects the other three. We design and develop websites, ecommerce stores and digital products, and the automation and integrations that move a lead from an ad to a sales call to a support ticket without being re-keyed. Marketing, sales and support run on what Build puts in place.**
- Sub-capabilities:
  - Websites and landing pages (including WordPress)
  - Ecommerce builds
  - Web and mobile app development, full-stack
  - UI/UX design
  - Automation and integrations (CRM, forms, help desk, data flows)
  - QA and testing
  - Ongoing maintenance of digital systems

---

## 4. The growth journey — five stages (final vocabulary)

**Attract → Qualify → Close → Retain → Scale**

Why these words: they describe what happens to a customer, while the four systems describe what Growlatics does. No word is shared between the two sets (the candidate "Acquire / Sell" stages would collide with system names). "Qualify" replaces baseline "Convert" because qualification is where most leads leak between marketing and sales, and it showcases Sales & BPO. "Retain" replaces "Support" (outcome, not activity). "Attention" and "Attract" are unified as **Attract**.

| # | Stage | One line | Systems | Stage copy (2 sentences) |
|---|---|---|---|---|
| 01 | **Attract** | Bring in the right demand. | Acquire | Paid, search, social and video programs reach the buyers you actually want. Every campaign is tracked to what it sends downstream, not just to clicks. |
| 02 | **Qualify** | Turn interest into real conversations. | Acquire + Sell | Leads are answered fast, checked against your criteria and routed with full context. Nothing waits in an inbox and nothing reaches sales without a reason to be there. |
| 03 | **Close** | Move qualified buyers to a decision. | Sell | Trained sales teams run follow-up, booked meetings and telesales inside your process and your CRM. Pipeline stays visible, so you see what is moving and what is stuck. |
| 04 | **Retain** | Keep the customers you've won. | Operate | Support and retention teams answer on chat, phone and email to your standards. What customers say flows back to sales and marketing instead of disappearing in a ticket queue. |
| 05 | **Scale** | Grow without rebuilding. | Build (connects all) | Technology and automation connect every stage, so more volume does not mean more manual work. The system grows as one, instead of as five separate vendors. |

Journey section heading (Home act 4): see §5.1. These five words, numbers and one-liners are used **identically** everywhere (Home act 4, `/services/`, service pages "Where this sits in the journey", mobile fallback, reduced-motion fallback). Content source: `content/journey.ts` only.

---

## 5. Page copy

### 5.1 Home `/`

**Act 1 — Hero** (`<section id="hero">`): copy in §2.2. H1 is the only H1.

**Act 2 — Problem** (`id="problem"`)
- Eyebrow: **The problem**
- H2: **Growth breaks between vendors.**
- Body: **An agency runs the ads. Another team chases leads. Support sits somewhere else, and the website belongs to whoever built it last. Each part may work on its own, but the handoffs between them don't — and that is where growth leaks.**
- Leak labels (spatial callouts on the visual, H3 or `<p>` per DIRECTION; keep short):
  - **Leads go cold** — Enquiries wait hours or days for a first response.
  - **Context gets lost** — Sales calls start without knowing what the buyer clicked or asked.
  - **Nobody owns the number** — Every vendor reports its own metric; no one reports revenue.
  - **Customers churn quietly** — Support issues never reach the people who could fix the cause.
  - **Tools don't talk** — Data is re-keyed between ad platforms, CRM and help desk.

**Act 3 — Connection** (`id="system"`)
- Eyebrow: **The Growlatics model**
- H2: **One connected system, one accountable partner.**
- Body: **Growlatics puts demand, sales, customer operations and technology on the same operating system. Leads arrive with context, sales picks up where marketing left off, support feeds what it learns back into the pipeline, and technology keeps it all connected. You get one team, one plan and one set of numbers.**
- Three short points (H3 + one line):
  - **Shared data** — One customer record from first click to renewal.
  - **Clean handoffs** — Defined rules for when, how and to whom a lead moves.
  - **Single ownership** — One partner accountable for the whole flow, not one slice of it.

**Act 4 — Growth journey** (`id="journey"`)
- Eyebrow: **The growth journey**
- H2: **From first click to long-term customer, every stage connected.**
- Intro: **Follow a lead through the system. Each stage hands the next one everything it needs.**
- Stages: the five from §4 (number, H3 stage name, one line, stage copy, system tag).
- Closing link: **See the four systems →** `/services/`

**Act 5 — Capabilities** (`id="capabilities"`)
- Eyebrow: **Four systems**
- H2: **Acquire. Sell. Operate. Build.**
- Intro: **Four systems that work on their own and work better together. Start with the one that's under the most pressure; connect the rest as you grow.**
- Modules (order Acquire → Sell → Operate → Build; Sell visually emphasized and default-active):
  - H3 **Acquire — Performance Marketing** · short description §3.1 · 4 tags: Paid search · Paid social · SEO · YouTube · link **Explore Performance Marketing**
  - H3 **Sell — Sales & BPO** · short description §3.2 · tags: Cold outreach · Appointment setting · Lead qualification · Telesales · extra line: **Not a call center. A sales operation that plugs into yours.** · link **Explore Sales & BPO**
  - H3 **Operate — Customer Operations** · short §3.3 · tags: Chat · Call · Retention · CX operations · link **Explore Customer Operations**
  - H3 **Build — Technology & Development** · short §3.4 · tags: Websites · Ecommerce · Automation · Apps · link **Explore Technology**

**Act 6 — Why integration matters** (`id="why"`)
- Eyebrow: **Why connected**
- H2: **The gains are in the handoffs.**
- Body: **Most growth problems aren't inside one function. They sit between functions: the lead marketing generated that sales never called, the complaint support logged that product never saw. Connecting the system fixes problems no single vendor is positioned to see.**
- Comparison (two columns, H3 each; no numbers):
  - H3 **Separate vendors**: Separate reports and definitions of a "lead" · Handoffs by email and spreadsheet · Gaps nobody is contracted to fix · You coordinate everyone
  - H3 **One connected system**: One definition of a qualified lead, agreed up front · Handoffs automated and tracked · One partner accountable for the gaps · We coordinate; you decide
- Footnote line: **We agree the metrics before launch and report against them every cycle.**

**Act 7 — Global delivery** (`id="global"`)
- Eyebrow: **Global delivery**
- H2: **Built for international growth.**
- Body: **Growlatics is a US / Pakistan business serving clients in the United States, the United Kingdom, Pakistan and other international markets. Distributed teams let us staff sales, support and technology work around the markets you sell into, with the same process and reporting wherever the work happens.**
- Market labels on the visual: **United States · United Kingdom · Pakistan · International** (no cities, no office pins).
- Link: **How we work across markets →** `/about/`

**Act 8 — Work / proof** (`id="work"`)
- Render rule: if `proof.caseStudies`, `proof.testimonials`, `proof.logos` and `proof.metrics` are all empty → render the methodology treatment below. Never render placeholder logos, quote marks or counters.
- Eyebrow: **How we measure work**
- H2: **Results agreed before launch, reported every cycle.**
- Body: **Every engagement starts with the numbers that matter to your business — qualified leads, booked meetings, response times, retention — and a baseline to measure them against. We report on the whole system, not just the part we touched.**
- Link: **How we measure work →** `/work/`

**Act 9 — Final CTA** (`id="book-cta"`)
- H2: **Show us where growth is leaking.**
- Body: **A Growth Call is a focused conversation about your pipeline, your teams and your tools. You'll leave with a clear view of where the system breaks and what to fix first.**
- `[CTA primary]` **Book a Growth Call** → `/contact/#book`
- `[CTA secondary]` **Email us** → `mailto:ahsan@growlatics.com`
- Small print: **No commitment. Just a clear conversation about your growth.**

### 5.2 Services `/services/`

- H1: **Four systems. One growth operation.**
- Lead: **Growlatics runs the work behind growth across four connected systems. Use one where you need capacity now, or connect all four and run growth as a single operation.**
- `[CTA primary]` Book a Growth Call

Section — `id="systems"`
- H2: **The four systems**
- One block per system (Sell first and larger), each: Eyebrow system verb · H3 service name · long description (§3) · sub-capabilities list · link "Explore {service}".

Section — journey map
- H2: **How the systems map to the journey**
- Body: **Each system owns stages of the journey and hands off to the next.**
- Table/diagram: Attract ← Acquire · Qualify ← Acquire + Sell · Close ← Sell · Retain ← Operate · Scale ← Build.

Section — engagement model (`id="how-we-engage"`; reused on `/work/`)
- H2: **How an engagement runs**
- H3 **1. Diagnose** — We map your current funnel, teams and tools, and find where leads and customers drop out.
- H3 **2. Design** — We agree the target system: who does what, which tools connect, and which metrics define success.
- H3 **3. Deploy** — We stand up teams, campaigns and integrations, starting with the highest-pressure gap.
- H3 **4. Operate** — We run the system day to day and report against the agreed metrics every cycle.
(Engagement steps are not the journey stages; never mix the two lists.)

Section — FAQ (`id="faq"`, H2 **Questions**; each question H3)
- **Can we start with one system?** Yes. Most clients start where the pressure is highest — often sales capacity or lead flow — and connect other systems once the first is running.
- **Do your teams use our tools?** Yes, by default. Sales and support work inside your CRM and help desk so your data stays yours. If you don't have the right tools yet, Build can set them up.
- **Which markets do you work with?** We serve clients in the United States, the United Kingdom, Pakistan and other international markets.
- **How do you report?** Against metrics agreed before launch, on a regular cadence set with you, covering the whole system rather than one channel.

Final CTA band: shared component (Act 9 copy).

### 5.3 Sales & BPO `/services/sales-bpo/` (priority page; deepest copy)

Hero
- Eyebrow: **Sell · Sales & BPO**
- H1: **Sales capacity that plugs into your pipeline.**
- Lead: **Trained, managed teams for outbound, inbound, qualification and appointment setting — working in your CRM, to your process, reporting on your pipeline. Not a call center. An extension of your revenue operation.**
- `[CTA primary]` Book a Growth Call · `[CTA secondary]` **See what we run** → `#capabilities`

Section — the problem (H2 **Pipelines stall for operational reasons.**)
- Body: **Good leads go uncalled because nobody has time. Outbound starts and stops with each hire. Reps spend their day on admin instead of conversations. The fix is usually not more marketing — it's dependable sales capacity and the process behind it.**

Section — `id="capabilities"`, H2 **What we run**
- H3 **Pipeline generation** — Cold outreach by email, phone and LinkedIn; outbound calling; list building and prospect research; campaign support for launches and promotions.
- H3 **Conversion** — Fast inbound response and follow-up; lead qualification against your criteria; appointment setting into your team's calendars; telesales where the sale closes on the call.
- H3 **Sales operations** — CRM hygiene and data entry; pipeline reporting; script, cadence and objection-handling design; day-to-day sales process support.
- H3 **Business process outsourcing** — Back-office execution that supports the revenue cycle: order processing, follow-up workflows, and data and admin tasks your sellers shouldn't be doing.

Section — H2 **How it works with your team**
- H3 **Your process, your tools** — We work in your CRM and calendars, with scripts and qualification rules agreed with you.
- H3 **Managed, not just staffed** — Team leads handle training, quality review and daily performance, so you manage outcomes, not people.
- H3 **Visible pipeline** — Every call, email and meeting is logged where you can see it. Reporting uses the same pipeline your team works from.
- H3 **Clean handoffs** — Agreed rules decide when a lead goes to your closers, and with what context.

Section — H2 **Ways to engage**
- H3 **Dedicated team** — Named people working only on your account, as part of your sales operation.
- H3 **Campaign** — A defined outreach or calling program with clear targets and an end date.
- H3 **Overflow** — Extra capacity on top of your in-house team for peaks, launches or new markets.

Section — H2 **Where Sell sits in the journey**
- Body: **Sell owns Qualify and Close. It receives demand from Acquire, hands won customers to Operate, and runs on the CRM and automation Build puts in place.** (Journey strip with stages 02–03 active.)

Section — H2 **Connected systems** (links)
- **Pairs with Acquire** — More, better-targeted leads for your team to work. → performance-marketing
- **Pairs with Operate** — New customers handed straight to onboarding and support. → customer-operations
- **Pairs with Build** — CRM, dialer and workflow setup so nothing is re-keyed. → technology

Section — FAQ (H2 **Sales & BPO questions**)
- **Is this a call center?** No. We run sales work as part of your revenue process — targets, scripts, qualification rules and CRM included — with managers accountable for quality and pipeline, not just call volume.
- **Who owns the leads and data?** You do. We work in your systems by default.
- **Can you sell into the US and UK?** We serve clients selling in the United States, the United Kingdom, Pakistan and other international markets. Coverage hours and languages are agreed per engagement.
- **How quickly can a team start?** It depends on scope and hiring needs; we'll give you a timeline on the Growth Call.

Final CTA band (shared) with H2 override: **Need more pipeline, not more vendors?**

### 5.4 Performance Marketing `/services/performance-marketing/`

- Eyebrow: **Acquire · Performance Marketing**
- H1: **Demand that reaches your sales team.**
- Lead: **Paid search, paid social, SEO, social and YouTube programs — with the landing pages, funnels and tracking behind them — measured on qualified pipeline, not clicks.**
- CTAs: Book a Growth Call · See what we run (`#capabilities`)

H2 **Traffic isn't the goal.**
Body: **Most marketing reports stop at clicks and cost per lead. What matters is whether those leads become conversations and customers. Because Growlatics also runs sales and support, we can see what happens after the click — and optimize for it.**

H2 **What we run** (`id="capabilities"`)
- H3 **Paid search and shopping** — Google Ads and Microsoft Ads, including shopping campaigns for ecommerce.
- H3 **Paid social** — Meta, LinkedIn and TikTok campaigns built around your buyer and offer.
- H3 **SEO and content** — Technical SEO, on-page work and content built to rank for what buyers search.
- H3 **Social and YouTube** — Social media management and YouTube performance programs.
- H3 **Funnels and landing pages** — Pages, forms and lead flows designed to reduce drop-off.
- H3 **Tracking and reporting** — Conversion tracking and reporting tied to pipeline, not vanity metrics.

H2 **Where Acquire sits in the journey** — **Acquire owns Attract and shares Qualify with Sell. Leads arrive in your CRM with their source and context attached.** (stages 01–02 active)

H2 **Connected systems** — Pairs with Sell (Every lead followed up fast, by people who know where it came from.) · Pairs with Build (Landing pages, tracking and integrations built properly.) · Pairs with Operate (Customer feedback that sharpens targeting.)

Final CTA H2 override: **Want marketing measured on revenue?**

### 5.5 Customer Operations `/services/customer-operations/`

- Eyebrow: **Operate · Customer Operations**
- H1: **Support that keeps customers — and tells you why they stay.**
- Lead: **Chat, phone and email support, retention workflows and CX operations, run to your standards and logged where your whole team can see them.**
- CTAs: Book a Growth Call · See what we run

H2 **Retention is a growth channel.**
Body: **Winning a customer costs more than keeping one, yet support is often the least connected part of the business. When support is part of the same system as sales and marketing, every conversation becomes something the business can act on.**

H2 **What we run** (`id="capabilities"`)
- H3 **Chat and email support** — Fast, consistent answers in your tone of voice.
- H3 **Call support** — Inbound and outbound voice support for service, orders and follow-up.
- H3 **Team operations** — Staffing, quality review, escalation paths and daily management.
- H3 **Retention and win-back** — Renewal reminders, save offers and win-back outreach.
- H3 **Onboarding and order support** — Helping new customers get started and orders get resolved.
- H3 **CX operations** — Help-desk setup, macros, knowledge base and service reporting.

H2 **Where Operate sits in the journey** — **Operate owns Retain. It receives customers from Sell and sends what it learns back to Acquire and Sell.** (stage 04 active)

H2 **Connected systems** — Pairs with Sell (Upsell and renewal leads passed straight to sales.) · Pairs with Build (Help desk, CRM and automation connected.) · Pairs with Acquire (Real customer language for campaigns.)

Final CTA H2 override: **Keep more of the customers you win.**

### 5.6 Technology & Development `/services/technology/`

- Eyebrow: **Build · Technology & Development**
- H1: **The infrastructure that connects your growth.**
- Lead: **Websites, ecommerce, digital products, and the automation and integrations that move data between marketing, sales and support without manual work.**
- CTAs: Book a Growth Call · See what we build

H2 **Every system runs on something.**
Body: **Campaigns need pages that convert. Sales teams need a CRM that's set up properly. Support needs a help desk that talks to everything else. Build is the layer underneath — the one that lets the other three work as one.**

H2 **What we build** (`id="capabilities"`)
- H3 **Websites and landing pages** — Fast, maintainable sites, including WordPress where it fits.
- H3 **Ecommerce** — Stores built to sell, integrated with marketing, payments and support.
- H3 **Apps and digital products** — Web and mobile applications, built full-stack.
- H3 **UI/UX design** — Interfaces designed around how your customers actually buy and use.
- H3 **Automation and integrations** — CRM, forms, help desk and data flows connected so nothing is re-keyed.
- H3 **QA and maintenance** — Testing before launch and care after it.

H2 **Where Build sits in the journey** — **Build powers Scale and sits under every stage: the pages that Attract, the CRM that Qualifies and Closes, the help desk that Retains.** (all stages lit, stage 05 emphasized)

H2 **Connected systems** — Pairs with Acquire · Pairs with Sell · Pairs with Operate (one line each: "Pages and tracking for campaigns." / "CRM, dialer and workflow setup." / "Help desk and automation for support.")

Final CTA H2 override: **Build once. Connect everything.**

### 5.7 About `/about/`

- Eyebrow: **About Growlatics**
- H1: **We connect the work behind growth.**
- Lead: **Growlatics is an international growth operations, BPO and technology partner. We build and run the marketing, sales, customer operations and technology systems that growing businesses depend on — as one connected operation.**

H2 **Why we exist**
Body: **Growing companies rarely lack effort. They lack connection. Marketing, sales, support and technology are often bought from different providers, each optimizing its own piece. The gaps between them — slow follow-up, lost context, unclear ownership — are where growth stalls. Growlatics was built to own those gaps.**

H2 **What we believe** (H3 + one line each)
- **Systems beat services.** A connected operation outperforms a stack of disconnected vendors.
- **Accountability over activity.** We report on outcomes the business cares about, agreed up front.
- **Your data stays yours.** We work in your tools by default.
- **Honest numbers.** We don't publish claims we can't back, and we won't promise results before we've seen your system.

H2 **Who we work with**
Body: **Established and growth-stage businesses that need extra marketing, sales, customer operations or technology capacity — without managing several disconnected vendors to get it.**

H2 **International by design**
Body: **Growlatics is a US / Pakistan business serving clients in the United States, the United Kingdom, Pakistan and other international markets. Distributed teams and one shared operating process mean the work is run the same way wherever it happens.**

Final CTA band (shared).

### 5.8 Contact `/contact/`

- H1: **Book a Growth Call.**
- Lead: **Tell us a little about your business. It takes about a minute, and we'll come back to you with next steps.**
- Qualification flow component (`id="book"`), see §6.
- Side panel / below on mobile — H2 **Prefer to reach out directly?**
  - Email: **ahsan@growlatics.com**
  - Phone: **+1 (470) 755-6472**
  - Socials: LinkedIn · Facebook · Instagram
  - Line: **US / Pakistan business; serving US, UK, Pakistan and international clients.**
- H2 **What happens on the call** (ordered list)
  1. **We listen.** Your goals, your current setup, and where growth is stalling.
  2. **We map the leaks.** Where leads, context or customers drop out between functions.
  3. **We suggest a first step.** Which system to start with, and what success would look like.
- No final CTA band on this page (the form is the CTA).

### 5.9 Work `/work/` (no proof yet — methodology treatment)

- Eyebrow: **Work**
- H1: **How we measure work.**
- Lead: **We publish client results only with permission and evidence. Until then, here is exactly how we define, measure and report success on every engagement.**

H2 **What we measure** (H3 + line)
- **Pipeline** — Qualified leads, booked meetings, and how many become opportunities.
- **Speed** — Time to first response and time between handoffs.
- **Conversion** — Movement from stage to stage across the journey.
- **Retention** — Resolution, satisfaction and repeat business, where you track them.

H2 **How we report**
Body: **Metrics and baselines are agreed in writing before launch. Reporting covers the whole system — not just the channel we run — and follows a cadence set with you.**

Section: engagement model (reuse `/services/#how-we-engage` block, H2 **How an engagement runs**).

Dormant proof slots (render only when `content/proof.ts` has approved entries): H2 **Case studies** · H2 **What clients say** · logo row (no heading) · verified metrics row. When empty, render nothing for them — no "coming soon".

Final CTA band (shared) H2 override: **Let's define what success looks like for you.**

### 5.10 404

- H1: **This page isn't connected.**
- Body: **The link may be broken or the page may have moved. Here's where to go next.**
- Links: **Home** (`/`) · **Services** (`/services/`) · **Book a Growth Call** (`/contact/#book`)

### 5.11 Shared final CTA band (default)
H2 **Show us where growth is leaking.** · Body and CTAs as Home Act 9. Pages may override only the H2 (overrides listed above).

---

## 6. Conversion flow — Book a Growth Call

Location: `/contact/#book`. Every "Book a Growth Call" CTA links here. One step per screen on mobile; desktop may show steps in one card with a progress bar of five segments (use the five-bar mark per DIRECTION). Back is always allowed; answers persist in component state only (no storage, no cookies).

### 6.1 Steps

| # | Question (label) | Field | Options / rules | Required |
|---|---|---|---|---|
| 1 | **What do you need help with?** (helper: Choose all that apply.) | multi-select chips (`checkbox` group) | `sales-bpo` Sales & BPO · `performance-marketing` Performance Marketing · `customer-operations` Customer Operations · `technology` Technology & Development · `not-sure` Not sure yet — help me find the gap | ≥1. If a service-page CTA sent `?system=sales-bpo` etc., pre-select it |
| 2 | **Where is your business today?** | radio | `early` Early stage, finding traction · `growing` Growing, with steady revenue · `established` Established, adding capacity or markets · `enterprise` Large or multi-location organization | 1 |
| 3 | **Which markets do you sell into?** (Choose all that apply.) | checkbox group | `us` United States · `uk` United Kingdom · `pk` Pakistan · `other` Other (reveals text input, max 80 chars) | ≥1; if `other`, text required |
| 4 | **When do you want to start?** | radio | `now` Within 30 days · `quarter` In the next 3 months · `exploring` Just exploring | 1 |
| 5 | **How do we reach you?** | text fields | Name (text, 2–80) · Work email (`type=email`, RFC-valid, required) · Company (text, 2–100) · Website (`type=url`, optional; accept without scheme, prefix `https://`) · Phone (`type=tel`, optional, 7–20 chars of digits/space/+()-) · Anything we should know? (textarea, optional, max 1000) | name, email, company |

Submit button: **Request my Growth Call**. Below it: **We'll use these details only to respond to your request.** (Link to Privacy appears only once `/privacy/` is approved.)

Validation messages (inline, on blur and on submit; `aria-describedby`, focus moves to first error):
- Required: **Please fill this in.** · Chips/radios: **Please choose at least one.** / **Please choose one.**
- Email: **Please enter a valid email address.** · URL: **Please enter a valid website, like example.com.** · Phone: **Please enter a valid phone number.**
- Honeypot field `company_website` (visually hidden, `tabindex=-1`, `autocomplete=off`); if filled, silently show success and do not send.

### 6.2 After submit

Adapter result `sent` (webhook accepted) — success state:
- H2 **Thanks — your request is in.**
- Body: **We'll reply to {email} within one business day with next steps.** → `OWNER-VERIFY` the response time; until confirmed use: **We'll reply to {email} with next steps.**
- If `NEXT_PUBLIC_BOOKING_URL` is set: line **Want to lock in a time now?** + button **Pick a time** (opens booking URL in new tab, with name/email query params if the provider supports them).

Adapter result `mailto` (default, no webhook configured) — state shown after the mail client is triggered:
- H2 **One last step: send the email.**
- Body: **We've opened an email with your answers filled in. Press send and we'll reply with next steps. If nothing opened, email us at ahsan@growlatics.com or call +1 (470) 755-6472.**
- Button **Copy my answers** (copies the mailto body text to clipboard).

Adapter result `error` (webhook failed):
- **Something went wrong sending your request.** + button **Send by email instead** (falls back to mailto) .

### 6.3 Mailto fallback format

```
to:      ahsan@growlatics.com
subject: Growth Call request — {company}
body:
Name: {name}
Email: {email}
Company: {company}
Website: {website | "—"}
Phone: {phone | "—"}

Needs: {labels of step 1, comma-separated}
Stage: {label of step 2}
Markets: {labels of step 3, "Other: {text}" if any}
Start: {label of step 4}

Notes:
{message | "—"}

Sent from growlatics.us/contact/
```
URL-encode subject and body (`encodeURIComponent`); keep total URL under 2,000 chars by truncating Notes with "…".

### 6.4 Integration boundary (for FOUNDATION)

- One module: `lib/leads/` exports `submitLead(lead: LeadSubmission): Promise<LeadResult>`.
- Provider order: `NEXT_PUBLIC_LEAD_WEBHOOK_URL` set → `POST` JSON (`LeadSubmission` + `submittedAt` ISO + `source` page path), 10s timeout → `sent` / `error`. Not set → build mailto (§6.3) → `mailto`.
- `NEXT_PUBLIC_BOOKING_URL` → shown in success state only. Later a CRM (HubSpot or similar) plugs in as the webhook target or a second provider inside `lib/leads/`; the UI does not change.
- No vendor SDK, no analytics, no cookies until the owner approves a provider. Static-export compatible (client-side only).

---

## 7. SEO

Title pattern: `{Page} | Growlatics` (Home is the exception). Descriptions ≤155 chars. Canonical = `https://growlatics.us{route}` with trailing slash. OG image `/og-image.png` site-wide until per-page images exist.

| Route | `<title>` | Meta description |
|---|---|---|
| `/` | Growlatics — Growth operations, Sales & BPO and technology | Growlatics builds and operates the systems behind growth: performance marketing, sales and BPO, customer operations and technology, connected as one. |
| `/services/` | Services: Acquire, Sell, Operate, Build \| Growlatics | Four connected systems: Performance Marketing, Sales & BPO, Customer Operations and Technology. Start with one or run growth as a single operation. |
| `/services/sales-bpo/` | Sales & BPO: outbound, inbound and appointment setting \| Growlatics | Managed sales capacity for cold outreach, inbound and outbound calling, lead qualification, appointment setting and sales operations, inside your CRM. |
| `/services/performance-marketing/` | Performance Marketing: paid, SEO, social and YouTube \| Growlatics | Paid search, paid social, SEO, social and YouTube programs with landing pages and tracking, measured on qualified pipeline rather than clicks. |
| `/services/customer-operations/` | Customer Operations: support and retention \| Growlatics | Chat, phone and email support, retention workflows and CX operations, run to your standards and connected to sales and marketing. |
| `/services/technology/` | Technology & Development: web, ecommerce and automation \| Growlatics | Websites, ecommerce, apps, UI/UX and the automation and integrations that connect marketing, sales and support into one system. |
| `/about/` | About \| Growlatics | Growlatics is an international growth operations, BPO and technology partner, a US / Pakistan business serving US, UK, Pakistan and international clients. |
| `/contact/` | Book a Growth Call \| Growlatics | Tell us about your business and where growth is stalling. Book a Growth Call or reach us at ahsan@growlatics.com or +1 (470) 755-6472. |
| `/work/` | How we measure work \| Growlatics | How Growlatics defines, measures and reports results: metrics and baselines agreed before launch, reporting across the whole growth system. |
| 404 | Page not found \| Growlatics | (none; noindex) |

OG/Twitter: `og:title` = title without " \| Growlatics"; `og:description` = meta description; `og:site_name` Growlatics; `og:type` website; `twitter:card` summary_large_image. Home OG title: **We build and operate the systems behind growth.**

Organization JSON-LD (Home only; every field sourced from baseline code):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Growlatics",
  "url": "https://growlatics.us",
  "logo": "https://growlatics.us/icon.svg",
  "description": "Growth operations, Sales & BPO and technology partner connecting marketing, sales, customer operations and technology.",
  "email": "ahsan@growlatics.com",
  "telephone": "+1-470-755-6472",
  "sameAs": [
    "https://www.linkedin.com/company/growlatics/",
    "https://www.facebook.com/share/1bFSXzTp4i/",
    "https://www.instagram.com/growlatics"
  ],
  "areaServed": ["US", "GB", "PK"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "ahsan@growlatics.com",
    "telephone": "+1-470-755-6472"
  }
}
```
No `address`, no `LocalBusiness`, no `foundingDate`, no `numberOfEmployees`, no `aggregateRating`. Logo: use a raster ≥112px if FOUNDATION produces one (baseline `logo.png` is a JPEG with a wrong extension). Service pages may add `Service` JSON-LD with `provider` → the Organization and `name` = service name; no `offers`/prices.

---

## 8. Content data shape (`content/`)

One module per file; every component imports from here; no copy literals in components.

```ts
// content/types.ts
export type SystemId = 'acquire' | 'sell' | 'operate' | 'build'
export type ServiceSlug = 'performance-marketing' | 'sales-bpo' | 'customer-operations' | 'technology'
export type StageId = 'attract' | 'qualify' | 'close' | 'retain' | 'scale'
export type Route =
  | '/' | '/services/' | '/services/sales-bpo/' | '/services/performance-marketing/'
  | '/services/customer-operations/' | '/services/technology/' | '/work/' | '/about/' | '/contact/'

export interface Link { label: string; href: string; external?: boolean }
export interface Cta { label: string; href: string }

// content/site.ts
export interface SiteContent {
  name: 'Growlatics'
  url: 'https://growlatics.us'
  positioning: string                 // §2.1
  tagline: string                     // "The systems behind growth."
  geography: string                   // footer line, PLAN.md verbatim
  markets: { code: 'US' | 'GB' | 'PK' | 'INTL'; label: string }[]
  contact: { email: string; phone: string; phoneHref: string }
  social: { label: 'LinkedIn' | 'Facebook' | 'Instagram'; href: string }[]
  primaryCta: Cta                     // Book a Growth Call → /contact/#book
  finalCta: { heading: string; body: string; primary: Cta; secondary: Cta; note: string }
}

// content/nav.ts
export interface NavItem { label: string; href: Route; children?: { system: SystemId; label: string; href: Route }[] }
export interface NavContent {
  header: NavItem[]                   // Services, Work, About, Contact
  servicesPanelFooter: Link
  footer: { heading: string; links: Link[] }[]
  legal: Link[]                       // empty until owner approves privacy/terms
  copyright: (year: number) => string
}

// content/systems.ts
export interface CapabilityGroup { title: string; body: string }
export interface SystemContent {
  id: SystemId
  verb: 'Acquire' | 'Sell' | 'Operate' | 'Build'
  service: string                     // "Sales & BPO"
  slug: ServiceSlug
  href: Route
  emphasis: boolean                   // true for sell only
  short: string                       // ≤90 chars
  long: string
  tags: string[]                      // 4 short tags for Home act 5
  capabilities: string[]              // flat list (§3)
  stages: StageId[]                   // journey stages owned
  pairsWith: { system: SystemId; line: string }[]
}
export type SystemsContent = SystemContent[]   // flow order: acquire, sell, operate, build

// content/journey.ts
export interface StageContent {
  id: StageId
  number: '01' | '02' | '03' | '04' | '05'
  name: 'Attract' | 'Qualify' | 'Close' | 'Retain' | 'Scale'
  line: string
  copy: string                        // 2 sentences
  systems: SystemId[]
}
export interface JourneyContent { eyebrow: string; heading: string; intro: string; stages: StageContent[] }

// content/pages.ts
export interface Section {
  id?: string
  eyebrow?: string
  heading: string                     // rendered as h2
  body?: string
  items?: { title: string; body: string; href?: Route }[]   // h3 + text
  links?: Link[]
}
export interface PageContent {
  route: Route
  seo: { title: string; description: string; ogTitle?: string; noindex?: boolean }
  hero: { eyebrow?: string; heading: string; lead: string; primary?: Cta; secondary?: Cta }  // heading = h1
  sections: Section[]
  finalCtaHeading?: string            // override of site.finalCta.heading; null on /contact/
  faq?: FaqItem[]
}
export interface HomeContent extends Omit<PageContent, 'sections'> {
  problem: Section & { leaks: { title: string; body: string }[] }
  connection: Section
  journey: JourneyContent             // re-export from journey.ts, not a copy
  capabilities: Section               // modules come from systems.ts
  why: Section & { separate: string[]; connected: string[]; note: string }
  global: Section
  work: Section
}
export interface ServicePageContent extends PageContent {
  system: SystemId
  problem: Section
  capabilities: Section
  howItWorks?: Section                // sales-bpo
  engagementShapes?: Section          // sales-bpo
  journeyNote: string
}
export interface EngagementStep { number: 1 | 2 | 3 | 4; title: 'Diagnose' | 'Design' | 'Deploy' | 'Operate'; body: string }

// content/faq.ts
export interface FaqItem { question: string; answer: string }
export interface FaqContent { services: FaqItem[]; salesBpo: FaqItem[] }

// content/proof.ts  — ships EMPTY; components return null when arrays are empty
export interface CaseStudy { id: string; client: string; systems: SystemId[]; summary: string; metrics: VerifiedMetric[]; approvedBy: string; approvedOn: string }
export interface Testimonial { id: string; quote: string; name: string; role: string; company: string; approvedBy: string; approvedOn: string }
export interface ClientLogo { id: string; name: string; src: string; approvedBy: string; approvedOn: string }
export interface VerifiedMetric { value: string; label: string; source: string; approvedBy: string; approvedOn: string }
export interface ProofContent { caseStudies: CaseStudy[]; testimonials: Testimonial[]; logos: ClientLogo[]; metrics: VerifiedMetric[] }
export const proof: ProofContent = { caseStudies: [], testimonials: [], logos: [], metrics: [] }

// content/lead.ts  (used by lib/leads/ and the form)
export type NeedId = ServiceSlug | 'not-sure'
export type StageOfBusiness = 'early' | 'growing' | 'established' | 'enterprise'
export type MarketId = 'us' | 'uk' | 'pk' | 'other'
export type StartWindow = 'now' | 'quarter' | 'exploring'
export interface LeadSubmission {
  needs: NeedId[]; stage: StageOfBusiness; markets: MarketId[]; marketOther?: string; start: StartWindow
  name: string; email: string; company: string; website?: string; phone?: string; message?: string
}
export type LeadResult = { status: 'sent' } | { status: 'mailto'; href: string; body: string } | { status: 'error'; message: string }
export interface LeadFormContent {
  steps: { id: string; question: string; helper?: string; options?: { value: string; label: string }[] }[]
  submitLabel: string; privacyNote: string
  errors: Record<'required' | 'chooseOne' | 'chooseAny' | 'email' | 'url' | 'phone', string>
  success: { heading: string; body: string; bookingPrompt: string; bookingLabel: string }
  mailto: { heading: string; body: string; copyLabel: string; to: string; subject: string }
  failure: { body: string; fallbackLabel: string }
}
```
`approvedBy` / `approvedOn` on every proof type is deliberate: no proof item can be added without a recorded owner approval.

---

## 9. Claims audit

### 9.1 Claims used

| Claim | Where | Source |
|---|---|---|
| Growth operations + BPO + technology partner | positioning, About, JSON-LD | Owner brief §1 |
| US / Pakistan business | footer, Home act 7, About, Contact | Owner brief §1; PLAN.md footer line |
| Serves US, UK, Pakistan and international clients | same + `areaServed` | Owner brief §1; PLAN.md |
| Email ahsan@growlatics.com | contact, footer, JSON-LD | Baseline `lib/content.ts` |
| Phone +1 (470) 755-6472 | contact, footer, JSON-LD | Baseline `lib/content.ts` |
| LinkedIn / Facebook / Instagram URLs | footer, contact, JSON-LD | Baseline `lib/content.ts` |
| Service list (all sub-capabilities in §3) | services pages | Owner brief §3 + baseline `SERVICES` (WordPress, QA, app development from baseline) |
| Specific platforms: Google Ads, Meta (baseline); Microsoft Ads, LinkedIn, TikTok (new) | performance marketing | Google/Meta baseline. **OWNER-VERIFY** Microsoft Ads, LinkedIn, TikTok — drop if not offered |
| Cold outreach via email, phone and LinkedIn | Sales & BPO | Owner brief §3 lists cold outreach; channels **OWNER-VERIFY** |
| BPO sub-items (order processing, follow-up workflows, data/admin) | Sales & BPO | Interpretation of "business-process outreach / BPO" §3. **OWNER-VERIFY** scope |
| Engagement shapes: dedicated team, campaign, overflow | Sales & BPO | **OWNER-VERIFY** (standard models; confirm all three are offered) |
| Team leads handle training and quality review | Sales & BPO | **OWNER-VERIFY** (implied by "managed", §16) |
| Teams work in client CRM/tools by default | Sales, FAQ, About | **OWNER-VERIFY** |
| Metrics agreed before launch, reported every cycle | Home act 6/8, Work, About | **OWNER-VERIFY** (operating commitment, not a result) |
| Reply "within one business day" | contact success | **OWNER-VERIFY**; fallback copy given without the time |
| "No commitment" on Growth Call | final CTA | Baseline FinalCTA ("No long-term commitment") |

No numbers, client names, team sizes, coverage hours, industry counts or results appear anywhere.

### 9.2 Removed claims and copy

| Old | Location | Reason |
|---|---|---|
| 150% ROI uplift (in 90 days) | Hero stats, Outcomes, content.ts | Unverified metric (§5) |
| 10+ industries | Hero stats | Unverified count |
| 24/7 ops coverage | Hero stats | Unverified coverage |
| 40% engagement, 25% conversions, 60% funnel, 10x scalability | Outcomes, content.ts | Unverified metrics |
| "Selected outcomes from connected growth systems" / "Selected project outcomes… Not verified public case studies" | OutcomesSection | Implies proof that doesn't exist |
| Lahore, Pakistan / London, United Kingdom branches | Footer | Not confirmed as offices (§12 act 7) |
| "offshore sales operations" | Hero subhead, metadata description | Banned term (§15) |
| "Elevating your digital footprint." | Footer tagline | Generic, off-message |
| "Marketing that converts. Sales teams that close. Tech that scales." | Hero H1, OG | Lists services, misses the connection thesis; replaced |
| "Close with trained sales teams built for your market" | Growth steps | Kept idea, removed "built for your market" (implies coverage) |
| "growth agency" keyword | metadata | Brief: not a generic agency |
| Careers, About `#` links; Case Studies → `#outcomes` | Footer | Dead placeholders |
| Stage names Attention / Attract / Convert / Support | TGW, GrowthSystem, content.ts | Unified to Attract · Qualify · Close · Retain · Scale |

Harvested from baseline: "Book a Growth Call", "Explore Services" (now "See how the system works"/links), "Build the engine behind your growth" (evolved to "systems behind growth"), "Growth is not one service. It is a connected system." (idea in act 3), "Turn attention into pipeline" / "reduce leakage" (act 2 leak language), "From attention to revenue, every stage is connected" (act 4 H2), "One connected stack across marketing, sales, support, and technology" (hero subhead idea), "Growth operations partner" (hero eyebrow).

---

## 10. Owner-only items (do not ship without owner input)

1. **Privacy Policy and Terms** — need real legal text (data controller entity, jurisdiction, contact for data requests, form data handling). Until approved: drafts unlinked, `noindex`, excluded from sitemap; form shows the plain privacy note without a link.
2. **Careers** — no page or link until there are real roles or a real hiring statement.
3. **Office / branch locations** — Lahore and London removed; confirm any city or registered address before it appears anywhere (also gates any `address` in JSON-LD).
4. **Timezone / coverage hours** — no "24/7", "round-the-clock" or "US hours" claims until confirmed per service.
5. **Response time** for the Growth Call (§6.2).
6. **Platform and channel list** — Microsoft Ads, LinkedIn Ads, TikTok Ads; LinkedIn outreach; BPO task scope; engagement shapes (§9.1 OWNER-VERIFY rows).
7. **Operating commitments** — "work in your tools by default", "metrics agreed before launch", "managed by team leads".
8. **Legal entity name** for copyright line and JSON-LD `legalName` (currently "Growlatics").
9. **Booking / CRM / webhook provider** — choose and approve before setting `NEXT_PUBLIC_LEAD_WEBHOOK_URL` or `NEXT_PUBLIC_BOOKING_URL`.
10. **Any proof** — case studies, testimonials, logos, metrics: each needs written client approval recorded in `content/proof.ts` (`approvedBy`, `approvedOn`).
11. **Founder / leadership names or photos** for About — none used; add only if the owner supplies them.
