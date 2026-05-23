# CLAUDE.md — Growlatics 3D Interactive Website

## Project Summary

We are building a premium, responsive, highly interactive website for **Growlatics**, a growth operations company offering marketing, sales, support, and technology services.

The website must feel modern, cinematic, polished, and conversion-focused. It should not feel like a generic digital agency template.

The core brand message is:

> **Marketing that converts. Sales teams that close. Tech that scales.**

Supporting positioning:

> Growlatics helps businesses scale through performance marketing, offshore sales operations, customer support, and digital product development.

Do not heavily highlight geography in the main hero copy. UK and Pakistan branches should only appear subtly in the footer/contact section.

---

## Brand Identity

### Logo Notes

The uploaded logo uses:
- Bold black wordmark
- Orange/red ascending growth bars above the text
- White background
- Tagline: “Elevating your digital footprint”

### Suggested Colour System

Use the existing logo as the visual anchor. The site should primarily use a **white / off-white base**, bold black typography, and orange/red accent details from the logo.

Primary colours:
- Background primary: `#FFFFFF`
- Background soft: `#F7F5F2`
- Background warm: `#FBFAF7`
- Text primary: `#050505`
- Text secondary: `#3A3A3A`
- Text muted: `#6B6B6B`
- Brand orange: `#D9431E`
- Deep orange/red: `#B83216`
- Soft orange surface: `#FFF1EA`
- Border light: `rgba(5,5,5,0.10)`
- Card surface: `rgba(255,255,255,0.78)`

Use black and white as the dominant brand colours. Use orange only as a confident accent for CTAs, selected words, numbers, hover states, small motion details, and logo-inspired growth bars.

Avoid making the site mostly dark. Dark sections can be used sparingly later for contrast, but the default visual language should match the white logo background.

---

## Technical Stack

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js via `@react-three/fiber`
- Drei via `@react-three/drei`
- Responsive layout for desktop, tablet, and mobile
- Component-based architecture
- Clean reusable sections

Preferred packages:
- `framer-motion`
- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `lucide-react`
- `clsx`
- `tailwind-merge`

Avoid unnecessary dependencies unless there is a clear reason.

---

## Token-Saving Development Rules

Claude must work in controlled phases.

Do not generate the entire site in one huge response.

For every phase:
1. Briefly explain what will be changed.
2. List the files that will be created or edited.
3. Make only that part of the website.
4. Avoid rewriting unchanged files.
5. Keep components modular.
6. Do not over-engineer.
7. Do not add fake backend logic.
8. Prioritise clean visual quality and responsive behaviour.

Claude should wait for the next prompt before moving to the next phase.

---

## Design Direction

### Updated Reference Direction

The visual and interaction reference is **Lesse Studio**: a premium design/technology studio website with strong editorial framing, service taxonomy, immersive portfolio-style sections, large typography, refined spacing, image-led storytelling, smooth transitions, and a high-end studio feel.

Important: use Lesse Studio as a creative reference only. Do **not** copy their exact layout, assets, wording, animations, images, or code. Build an original Growlatics version with similar premium quality, pacing, and interaction confidence.

For Growlatics, the website should feel like a premium growth studio and growth operations partner — not a generic digital marketing agency and not a direct clone of the reference site.

The website should feel like a premium growth command centre with editorial studio-level polish. The layout must be tight, deliberate, and compact — not overly spread out — but it must also not look tiny or compressed on large desktop screens. Avoid narrow 1100px-only layouts for major sections. Use a wider premium editorial canvas around 1280–1440px where appropriate, with strong visual hierarchy, balanced whitespace, and clean framing.

Important visual scale rule: the site must not look like a small centered document floating inside a huge browser window. On desktop, hero and section content should feel intentionally framed, wide, confident, and immersive. Keep text readable and strong, not miniature.

Visual references:
- Cinematic dark interface
- Premium SaaS landing page
- 3D growth systems
- Animated data streams
- Glassmorphism cards
- Motion-led storytelling
- Sharp typography
- Smooth but restrained animation

The design should communicate:
- Growth
- Performance
- Trust
- Systems
- Scale
- Technology
- International capability without overplaying geography

Avoid:
- Generic agency templates
- Cheap neon overload
- Too many gradients
- Cartoonish 3D
- Overcrowded sections
- Long walls of text
- Excessive animations that hurt performance

---

## Website Structure

Recommended pages for the first version:

### Home Page

Sections:
1. Hero
2. Growth Engine / What Growlatics Does
3. Service Pillars
4. Interactive Process
5. Case Study / Outcome Metrics
6. Industries or Use Cases
7. Why Growlatics
8. CTA
9. Footer

### Optional Future Pages

Do not build these until requested:
- Services
- About
- Case Studies
- Contact
- Careers

---

## Homepage Content Architecture

### Hero Section

Main headline:

**Marketing that converts. Sales teams that close. Tech that scales.**

Supporting text:

**Growlatics helps businesses scale through performance marketing, offshore sales operations, customer support, and digital product development.**

CTA buttons:
- Book a Growth Call
- Explore Services

Hero visual concept:
- 3D animated growth bars inspired by the logo
- Floating orbit nodes for Marketing, Sales, Support, and Tech
- Animated data lines or particles connecting the system
- Subtle orange glow, not overwhelming

---

### Growth Engine Section

Headline:

**Build the engine behind your growth.**

Copy:

Growth is not one service. It is a connected system. Growlatics brings together marketing, sales, support, and technology teams to help businesses attract leads, convert customers, and scale operations with confidence.

Visual:
- Four connected modules/cards:
  - Marketing
  - Sales
  - Support
  - Technology

---

### Service Pillars Section

Headline:

**Growth systems for businesses that want more than marketing.**

Service cards:

#### Performance Marketing
Google Ads, Meta Ads, PPC, SEO, ecommerce campaigns, lead generation, and funnel optimisation.

#### Sales & BPO Teams
Inbound sales, outbound sales, tele-sales, appointment setting, and campaign support.

#### Customer Support Operations
Chat support, call support, customer service teams, retention workflows, and support operations.

#### Technology & Development
Websites, full-stack development, app development, WordPress, QA, UI/UX, automation, and scalable digital systems.

---

### Process Section

Headline:

**From attention to revenue, every stage is connected.**

Steps:
1. Attract qualified attention
2. Convert leads into conversations
3. Close with trained sales teams
4. Support and retain customers
5. Scale through technology and automation

---

### Outcome Metrics Section

Use anonymised metric cards unless real case studies are provided.

Suggested metrics:
- 150% ROI uplift in 90 days
- 40% higher user engagement
- 25% increase in conversions
- 60% funnel conversion improvement
- 10x infrastructure scalability

Label these as selected project outcomes, not verified public case studies.

---

### Footer

Footer should include subtle branch/location information:

**Branches**
- Lahore, Pakistan
- London, United Kingdom

Do not mention any US address.

Footer should also include:
- Services
- Company
- Contact
- Social links
- Copyright

---

## UX and Motion Principles

### Framer Motion

Use Framer Motion for:
- Hero text reveal
- Section fade/slide reveals
- Staggered service cards
- CTA hover states
- Mobile menu animation
- Scroll-based subtle transitions

Keep animations smooth and purposeful.

### Three.js / React Three Fiber

Use Three.js only where it adds value.

Good uses:
- Hero 3D growth bars
- Floating data nodes
- Connected orbit system
- Subtle particle field
- Interactive cursor-responsive object movement

Avoid placing heavy 3D scenes in every section.

Performance matters more than complexity.

### Mobile Behaviour

On mobile:
- Reduce 3D intensity
- Avoid huge canvas height
- Stack content clearly
- Make CTAs thumb-friendly
- Keep text readable
- Disable heavy hover-only interactions

---

## Code Quality Rules

- Use TypeScript.
- Use clean component names.
- Keep layout sections in `/components/sections`.
- Keep 3D components in `/components/three`.
- Keep reusable UI in `/components/ui`.
- Keep copy/data arrays in `/lib/content.ts` where useful.
- Use semantic HTML.
- Use accessible buttons and links.
- Optimise images.
- Avoid large monolithic files.
- Avoid adding placeholder lorem ipsum.
- Avoid fake claims.
- Use realistic, polished copy.

---

## Suggested Folder Structure

```txt
/app
  /page.tsx
  /layout.tsx
  /globals.css
/components
  /layout
    Header.tsx
    Footer.tsx
  /sections
    Hero.tsx
    GrowthEngine.tsx
    ServicePillars.tsx
    ProcessSection.tsx
    OutcomesSection.tsx
    FinalCTA.tsx
  /three
    HeroGrowthScene.tsx
    GrowthBars.tsx
    OrbitNodes.tsx
  /ui
    Button.tsx
    Section.tsx
    GlassCard.tsx
/lib
  content.ts
  utils.ts
/public
  /images
    growlatics-logo.png
```

---

## Implementation Phases

### Phase 1 — Foundation

Goal:
Set up global theme, typography, layout structure, logo, and base styling.

Build:
- `globals.css`
- Root layout
- Header
- Footer
- Reusable Button
- Reusable Section wrapper
- Reusable GlassCard
- Content constants

Do not build the 3D hero yet.

---

### Phase 2 — Hero Section

Goal:
Create the premium first impression.

Build:
- Hero text layout
- CTA buttons
- Framer Motion entrance animation
- Basic responsive structure
- Reserve right side for 3D scene

Then add the 3D hero scene separately.

---

### Phase 3 — Hero 3D Scene

Goal:
Create lightweight animated 3D growth bars inspired by the logo.

Build:
- React Three Fiber canvas
- 3D orange growth bars
- Floating orbit nodes
- Subtle particles or data points
- Cursor-responsive movement
- Mobile fallback/reduced complexity

---

### Phase 4 — Main Sections

Goal:
Build the story below the fold.

Build:
- Growth Engine
- Service Pillars
- Process Section
- Outcomes Section
- Final CTA

Use Framer Motion for scroll reveals.

---

### Phase 5 — Polish and Responsiveness

Goal:
Make the website feel premium on all screen sizes.

Tasks:
- Desktop spacing polish
- Tablet layout polish
- Mobile layout polish
- Header/mobile menu
- CTA alignment
- Animation timing
- Accessibility check
- Performance check

---

### Phase 6 — Final Production Pass

Goal:
Prepare for deployment.

Tasks:
- Remove unused code
- Check console errors
- Optimise images
- Check Lighthouse basics
- Check mobile rendering
- Check metadata
- Add Open Graph tags
- Final copy pass

---

## First Claude Code Task

When asked to begin, start only with **Phase 1**.

Do not build the full website in one response.

Create the base structure, global theme, layout, and reusable components only.

Use the logo from `/public/images/growlatics-logo.png` if available. If it is not available yet, create the structure and leave a clear instruction for where to place it.
