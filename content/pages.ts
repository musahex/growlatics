import type { EngagementStep, HomeContent, PageContent, Section, ServicePageContent, ServiceSlug } from './types'
import { journey } from './journey'
import { faq } from './faq'
import { site } from './site'

const book = site.primaryCta
const seeCapabilities = { label: 'See what we run', href: '#capabilities' }

// ─── Home (IA §5.1) ──────────────────────────────────────────────────────────

export const home: HomeContent = {
  route: '/',
  seo: {
    title: 'Growlatics — Growth operations, Sales & BPO and technology',
    description:
      'Growlatics builds and operates the systems behind growth: performance marketing, sales and BPO, customer operations and technology, connected as one.',
    ogTitle: 'We build and operate the systems behind growth.',
  },
  hero: {
    eyebrow: 'Growth operations · Sales & BPO · Technology',
    heading: 'We build and operate the systems behind growth.',
    lead: 'Most companies run growth through separate vendors, and leads, context and accountability leak between them. Growlatics connects marketing, sales, customer operations and technology into one operating system, and runs it with you.',
    primary: book,
    secondary: { label: 'See how the system works', href: '#system' },
    panelLabel: 'Four connected systems',
  },
  problem: {
    id: 'problem',
    eyebrow: 'The problem',
    heading: 'Growth breaks between vendors.',
    body: "An agency runs the ads. Another team chases leads. Support sits somewhere else, and the website belongs to whoever built it last. Each part may work on its own, but the handoffs between them don't — and that is where growth leaks.",
    leaks: [
      { title: 'Leads go cold', body: 'Enquiries wait hours or days for a first response.' },
      { title: 'Context gets lost', body: 'Sales calls start without knowing what the buyer clicked or asked.' },
      { title: 'Nobody owns the number', body: 'Every vendor reports its own metric; no one reports revenue.' },
      { title: 'Customers churn quietly', body: 'Support issues never reach the people who could fix the cause.' },
      { title: "Tools don't talk", body: 'Data is re-keyed between ad platforms, CRM and help desk.' },
    ],
  },
  connection: {
    id: 'system',
    eyebrow: 'The Growlatics model',
    heading: 'One connected system, one accountable partner.',
    body: 'Growlatics puts demand, sales, customer operations and technology on the same operating system. Leads arrive with context, sales picks up where marketing left off, support feeds what it learns back into the pipeline, and technology keeps it all connected. You get one team, one plan and one set of numbers.',
    items: [
      { title: 'Shared data', body: 'One customer record from first click to renewal.' },
      { title: 'Clean handoffs', body: 'Defined rules for when, how and to whom a lead moves.' },
      { title: 'Single ownership', body: 'One partner accountable for the whole flow, not one slice of it.' },
    ],
  },
  journey,
  capabilities: {
    id: 'capabilities',
    eyebrow: 'Four systems',
    heading: 'Acquire. Sell. Operate. Build.',
    body: "Four systems that work on their own and work better together. Start with the one that's under the most pressure; connect the rest as you grow.",
  },
  why: {
    id: 'why',
    eyebrow: 'Why connected',
    heading: 'The gains are in the handoffs.',
    body: "Most growth problems aren't inside one function. They sit between functions: the lead marketing generated that sales never called, the complaint support logged that product never saw. Connecting the system fixes problems no single vendor is positioned to see.",
    separate: [
      'Separate reports and definitions of a "lead"',
      'Handoffs by email and spreadsheet',
      'Gaps nobody is contracted to fix',
      'You coordinate everyone',
    ],
    connected: [
      'One definition of a qualified lead, agreed up front',
      'Handoffs automated and tracked',
      'One partner accountable for the gaps',
      'We coordinate; you decide',
    ],
    // OWNER-VERIFY: metrics agreed before launch
    note: 'We agree the metrics before launch and report against them every cycle.',
    verify: true,
  },
  global: {
    id: 'global',
    eyebrow: 'Global delivery',
    heading: 'Built for international growth.',
    body: 'Growlatics is a US / Pakistan business serving clients in the United States, the United Kingdom, Pakistan and other international markets. Distributed teams let us staff sales, support and technology work around the markets you sell into, with the same process and reporting wherever the work happens.',
    links: [{ label: 'How we work across markets', href: '/about/' }],
  },
  work: {
    id: 'work',
    eyebrow: 'How we measure work',
    heading: 'Results agreed before launch, reported every cycle.',
    body: 'Every engagement starts with the numbers that matter to your business — qualified leads, booked meetings, response times, retention — and a baseline to measure them against. We report on the whole system, not just the part we touched.',
    links: [{ label: 'How we measure work', href: '/work/' }],
    // OWNER-VERIFY: metrics agreed before launch
    verify: true,
  },
}

/** Home-only UI words and figure descriptions (HOME-owned, IA §5.1). */
export const homeUi = {
  stageIndex: (n: string, total: number) => `${n} / ${String(total).padStart(2, '0')}`,
  lanes: { separate: 'Separate vendors', connected: 'One connected system', replay: 'Replay trace' },
  figures: {
    hero: 'The Growlatics network: Acquire, Sell, Operate and Build connected through one core',
    problem: 'Separate vendors with broken handoffs between them, where leads drop out',
    connection: 'Every handoff rerouted through one connected core',
    journey: (stage: string) => `The ${stage} stage of the growth journey, its system lit`,
    capabilities: 'Four systems around the core, Sell the largest',
    global: 'United States, United Kingdom and Pakistan placed on a 24-hour band',
    convergence: 'Every path converging on the Growlatics mark',
    trace: 'One lead traced through separate vendors, where it stalls and drops, and through one connected system, where it arrives',
  },
}

// ─── Shared blocks ───────────────────────────────────────────────────────────

export const engagement: { heading: string; id: string; steps: EngagementStep[] } = {
  id: 'how-we-engage',
  heading: 'How an engagement runs',
  steps: [
    { number: 1, title: 'Diagnose', body: 'We map your current funnel, teams and tools, and find where leads and customers drop out.' },
    { number: 2, title: 'Design', body: 'We agree the target system: who does what, which tools connect, and which metrics define success.' },
    { number: 3, title: 'Deploy', body: 'We stand up teams, campaigns and integrations, starting with the highest-pressure gap.' },
    { number: 4, title: 'Operate', body: 'We run the system day to day and report against the agreed metrics every cycle.' },
  ],
}

export const connectedHeading = 'Connected systems'
export const pairsWithLabel = (verb: string) => `Pairs with ${verb}`
export const reportLink = { label: 'How we report results', href: '/work/' }

// ─── Services overview (IA §5.2) ─────────────────────────────────────────────

export const services: PageContent & { journeyMap: Section; faqHeading: string } = {
  route: '/services/',
  seo: {
    title: 'Services: Acquire, Sell, Operate, Build | Growlatics',
    description:
      'Four connected systems: Performance Marketing, Sales & BPO, Customer Operations and Technology. Start with one or run growth as a single operation.',
  },
  hero: {
    heading: 'Four systems. One growth operation.',
    lead: 'Growlatics runs the work behind growth across four connected systems. Use one where you need capacity now, or connect all four and run growth as a single operation.',
    primary: book,
  },
  sections: [{ id: 'systems', heading: 'The four systems' }],
  journeyMap: {
    heading: 'How the systems map to the journey',
    body: 'Each system owns stages of the journey and hands off to the next.',
  },
  faqHeading: 'Questions',
  faq: faq.services,
}

// ─── Service pages (IA §5.3–5.6) ─────────────────────────────────────────────

export const servicePages: Record<ServiceSlug, ServicePageContent> = {
  'sales-bpo': {
    route: '/services/sales-bpo/',
    system: 'sell',
    seo: {
      title: 'Sales & BPO: outbound, inbound and appointment setting | Growlatics',
      description:
        'Managed sales capacity for cold outreach, inbound and outbound calling, lead qualification, appointment setting and sales operations, inside your CRM.',
    },
    hero: {
      eyebrow: 'Sell · Sales & BPO',
      heading: 'Sales capacity that plugs into your pipeline.',
      lead: 'Trained, managed teams for outbound, inbound, qualification and appointment setting — working in your CRM, to your process, reporting on your pipeline. Not a call center. An extension of your revenue operation.',
      primary: book,
      secondary: seeCapabilities,
    },
    problem: {
      heading: 'Pipelines stall for operational reasons.',
      body: "Good leads go uncalled because nobody has time. Outbound starts and stops with each hire. Reps spend their day on admin instead of conversations. The fix is usually not more marketing — it's dependable sales capacity and the process behind it.",
    },
    capabilities: {
      id: 'capabilities',
      heading: 'What we run',
      items: [
        // God decision: cold outreach without a channel list.
        { title: 'Pipeline generation', body: 'Cold outreach; outbound calling; list building and prospect research; campaign support for launches and promotions.' },
        { title: 'Conversion', body: "Fast inbound response and follow-up; lead qualification against your criteria; appointment setting into your team's calendars; telesales where the sale closes on the call." },
        { title: 'Sales operations', body: 'CRM hygiene and data entry; pipeline reporting; script, cadence and objection-handling design; day-to-day sales process support.' },
        // OWNER-VERIFY: BPO scope
        { title: 'Business process outsourcing', body: "Back-office execution that supports the revenue cycle: order processing, follow-up workflows, and data and admin tasks your sellers shouldn't be doing.", verify: true },
      ],
    },
    howItWorks: {
      heading: 'How it works with your team',
      // OWNER-VERIFY: work in client tools; managed by team leads
      verify: true,
      items: [
        { title: 'Your process, your tools', body: 'We work in your CRM and calendars, with scripts and qualification rules agreed with you.', verify: true },
        { title: 'Managed, not just staffed', body: 'Team leads handle training, quality review and daily performance, so you manage outcomes, not people.', verify: true },
        { title: 'Visible pipeline', body: 'Every call, email and meeting is logged where you can see it. Reporting uses the same pipeline your team works from.' },
        { title: 'Clean handoffs', body: 'Agreed rules decide when a lead goes to your closers, and with what context.' },
      ],
    },
    engagementShapes: {
      heading: 'Ways to engage',
      // OWNER-VERIFY: all three engagement shapes offered
      verify: true,
      items: [
        { title: 'Dedicated team', body: 'Named people working only on your account, as part of your sales operation.' },
        { title: 'Campaign', body: 'A defined outreach or calling program with clear targets and an end date.' },
        { title: 'Overflow', body: 'Extra capacity on top of your in-house team for peaks, launches or new markets.' },
      ],
    },
    journeyNote: 'Sell owns Qualify and Close. It receives demand from Acquire, hands won customers to Operate, and runs on the CRM and automation Build puts in place.',
    sections: [],
    faqHeading: 'Sales & BPO questions',
    faq: faq.salesBpo,
    finalCtaHeading: 'Need more pipeline, not more vendors?',
  },
  'performance-marketing': {
    route: '/services/performance-marketing/',
    system: 'acquire',
    seo: {
      // God decision: LinkedIn / TikTok / Microsoft Ads dropped; description already platform-free.
      title: 'Performance Marketing: paid, SEO, social and YouTube | Growlatics',
      description:
        'Paid search, paid social, SEO, social and YouTube programs with landing pages and tracking, measured on qualified pipeline rather than clicks.',
    },
    hero: {
      eyebrow: 'Acquire · Performance Marketing',
      heading: 'Demand that reaches your sales team.',
      lead: 'Paid search, paid social, SEO, social and YouTube programs — with the landing pages, funnels and tracking behind them — measured on qualified pipeline, not clicks.',
      primary: book,
      secondary: seeCapabilities,
    },
    problem: {
      heading: "Traffic isn't the goal.",
      body: 'Most marketing reports stop at clicks and cost per lead. What matters is whether those leads become conversations and customers. Because Growlatics also runs sales and support, we can see what happens after the click — and optimize for it.',
    },
    capabilities: {
      id: 'capabilities',
      heading: 'What we run',
      items: [
        { title: 'Paid search and shopping', body: 'Google Ads, including shopping campaigns for ecommerce.' },
        { title: 'Paid social', body: 'Meta campaigns built around your buyer and offer.' },
        { title: 'SEO and content', body: 'Technical SEO, on-page work and content built to rank for what buyers search.' },
        { title: 'Social and YouTube', body: 'Social media management and YouTube performance programs.' },
        { title: 'Funnels and landing pages', body: 'Pages, forms and lead flows designed to reduce drop-off.' },
        { title: 'Tracking and reporting', body: 'Conversion tracking and reporting tied to pipeline, not vanity metrics.' },
      ],
    },
    journeyNote: 'Acquire owns Attract and shares Qualify with Sell. Leads arrive in your CRM with their source and context attached.',
    sections: [],
    finalCtaHeading: 'Want marketing measured on revenue?',
  },
  'customer-operations': {
    route: '/services/customer-operations/',
    system: 'operate',
    seo: {
      title: 'Customer Operations: support and retention | Growlatics',
      description:
        'Chat, phone and email support, retention workflows and CX operations, run to your standards and connected to sales and marketing.',
    },
    hero: {
      eyebrow: 'Operate · Customer Operations',
      heading: 'Support that keeps customers — and tells you why they stay.',
      lead: 'Chat, phone and email support, retention workflows and CX operations, run to your standards and logged where your whole team can see them.',
      primary: book,
      secondary: seeCapabilities,
    },
    problem: {
      heading: 'Retention is a growth channel.',
      body: 'Winning a customer costs more than keeping one, yet support is often the least connected part of the business. When support is part of the same system as sales and marketing, every conversation becomes something the business can act on.',
    },
    capabilities: {
      id: 'capabilities',
      heading: 'What we run',
      items: [
        { title: 'Chat and email support', body: 'Fast, consistent answers in your tone of voice.' },
        { title: 'Call support', body: 'Inbound and outbound voice support for service, orders and follow-up.' },
        { title: 'Team operations', body: 'Staffing, quality review, escalation paths and daily management.' },
        { title: 'Retention and win-back', body: 'Renewal reminders, save offers and win-back outreach.' },
        { title: 'Onboarding and order support', body: 'Helping new customers get started and orders get resolved.' },
        { title: 'CX operations', body: 'Help-desk setup, macros, knowledge base and service reporting.' },
      ],
    },
    journeyNote: 'Operate owns Retain. It receives customers from Sell and sends what it learns back to Acquire and Sell.',
    sections: [],
    finalCtaHeading: 'Keep more of the customers you win.',
  },
  technology: {
    route: '/services/technology/',
    system: 'build',
    seo: {
      title: 'Technology & Development: web, ecommerce and automation | Growlatics',
      description:
        'Websites, ecommerce, apps, UI/UX and the automation and integrations that connect marketing, sales and support into one system.',
    },
    hero: {
      eyebrow: 'Build · Technology & Development',
      heading: 'The infrastructure that connects your growth.',
      lead: 'Websites, ecommerce, digital products, and the automation and integrations that move data between marketing, sales and support without manual work.',
      primary: book,
      secondary: { label: 'See what we build', href: '#capabilities' },
    },
    problem: {
      heading: 'Every system runs on something.',
      body: "Campaigns need pages that convert. Sales teams need a CRM that's set up properly. Support needs a help desk that talks to everything else. Build is the layer underneath — the one that lets the other three work as one.",
    },
    capabilities: {
      id: 'capabilities',
      heading: 'What we build',
      items: [
        { title: 'Websites and landing pages', body: 'Fast, maintainable sites, including WordPress where it fits.' },
        { title: 'Ecommerce', body: 'Stores built to sell, integrated with marketing, payments and support.' },
        { title: 'Apps and digital products', body: 'Web and mobile applications, built full-stack.' },
        { title: 'UI/UX design', body: 'Interfaces designed around how your customers actually buy and use.' },
        { title: 'Automation and integrations', body: 'CRM, forms, help desk and data flows connected so nothing is re-keyed.' },
        { title: 'QA and maintenance', body: 'Testing before launch and care after it.' },
      ],
    },
    journeyNote: 'Build powers Scale and sits under every stage: the pages that Attract, the CRM that Qualifies and Closes, the help desk that Retains.',
    sections: [],
    finalCtaHeading: 'Build once. Connect everything.',
  },
}

// ─── About (IA §5.7) ─────────────────────────────────────────────────────────

export const about: PageContent = {
  route: '/about/',
  seo: {
    title: 'About | Growlatics',
    description:
      'Growlatics is an international growth operations, BPO and technology partner, a US / Pakistan business serving US, UK, Pakistan and international clients.',
  },
  hero: {
    eyebrow: 'About Growlatics',
    heading: 'We connect the work behind growth.',
    lead: 'Growlatics is an international growth operations, BPO and technology partner. We build and run the marketing, sales, customer operations and technology systems that growing businesses depend on — as one connected operation.',
  },
  sections: [
    {
      id: 'why',
      heading: 'Why we exist',
      body: 'Growing companies rarely lack effort. They lack connection. Marketing, sales, support and technology are often bought from different providers, each optimizing its own piece. The gaps between them — slow follow-up, lost context, unclear ownership — are where growth stalls. Growlatics was built to own those gaps.',
    },
    {
      id: 'beliefs',
      heading: 'What we believe',
      items: [
        { title: 'Systems beat services.', body: 'A connected operation outperforms a stack of disconnected vendors.' },
        // OWNER-VERIFY: outcomes agreed up front
        { title: 'Accountability over activity.', body: 'We report on outcomes the business cares about, agreed up front.', verify: true },
        // OWNER-VERIFY: work in client tools by default
        { title: 'Your data stays yours.', body: 'We work in your tools by default.', verify: true },
        { title: 'Honest numbers.', body: "We don't publish claims we can't back, and we won't promise results before we've seen your system." },
      ],
    },
    {
      id: 'who',
      heading: 'Who we work with',
      body: 'Established and growth-stage businesses that need extra marketing, sales, customer operations or technology capacity — without managing several disconnected vendors to get it.',
    },
    {
      id: 'international',
      heading: 'International by design',
      body: 'Growlatics is a US / Pakistan business serving clients in the United States, the United Kingdom, Pakistan and other international markets. Distributed teams and one shared operating process mean the work is run the same way wherever it happens.',
      links: [
        { label: 'The four systems', href: '/services/' },
        { label: 'Book a Growth Call', href: '/contact/#book' },
      ],
    },
  ],
}

// ─── Contact (IA §5.8) ───────────────────────────────────────────────────────

export const contact: PageContent & { direct: { heading: string }; call: Section } = {
  route: '/contact/',
  seo: {
    title: 'Book a Growth Call | Growlatics',
    description:
      'Tell us about your business and where growth is stalling. Book a Growth Call or reach us at ahsan@growlatics.com or +1 (470) 755-6472.',
  },
  hero: {
    heading: 'Book a Growth Call.',
    lead: "Tell us a little about your business. It takes about a minute, and we'll come back to you with next steps.",
  },
  direct: { heading: 'Prefer to reach out directly?' },
  call: {
    heading: 'What happens on the call',
    items: [
      { title: 'We listen.', body: 'Your goals, your current setup, and where growth is stalling.' },
      { title: 'We map the leaks.', body: 'Where leads, context or customers drop out between functions.' },
      { title: 'We suggest a first step.', body: 'Which system to start with, and what success would look like.' },
    ],
  },
  sections: [],
  finalCtaHeading: null,
}

// ─── Work (IA §5.9) ──────────────────────────────────────────────────────────

export const work: PageContent = {
  route: '/work/',
  seo: {
    title: 'How we measure work | Growlatics',
    description:
      'How Growlatics defines, measures and reports results: metrics and baselines agreed before launch, reporting across the whole growth system.',
  },
  hero: {
    eyebrow: 'Work',
    heading: 'How we measure work.',
    lead: 'We publish client results only with permission and evidence. Until then, here is exactly how we define, measure and report success on every engagement.',
  },
  sections: [
    {
      id: 'measure',
      heading: 'What we measure',
      items: [
        { title: 'Pipeline', body: 'Qualified leads, booked meetings, and how many become opportunities.' },
        { title: 'Speed', body: 'Time to first response and time between handoffs.' },
        { title: 'Conversion', body: 'Movement from stage to stage across the journey.' },
        { title: 'Retention', body: 'Resolution, satisfaction and repeat business, where you track them.' },
      ],
    },
    {
      id: 'report',
      heading: 'How we report',
      // OWNER-VERIFY: metrics agreed before launch
      body: 'Metrics and baselines are agreed in writing before launch. Reporting covers the whole system — not just the channel we run — and follows a cadence set with you.',
      verify: true,
    },
  ],
  finalCtaHeading: "Let's define what success looks like for you.",
}

// ─── 404 (IA §5.10) ──────────────────────────────────────────────────────────

export const notFoundPage = {
  seo: { title: 'Page not found | Growlatics', description: '', noindex: true },
  heading: "This page isn't connected.",
  body: "The link may be broken or the page may have moved. Here's where to go next.",
  links: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/' },
    { label: 'Book a Growth Call', href: '/contact/#book' },
  ],
}

// ─── Pattern labels ──────────────────────────────────────────────────────────

export const schematicLabels = { inputs: 'Receives from', capabilities: 'Runs', outputs: 'Hands off to' }
export const journeyHeading = (verb: string) => `Where ${verb} sits in the journey`
export const draftNotice = 'Draft — pending owner legal approval. Not linked and not indexed.'

// ─── Network figures (accessible names) and page-specific schematic lanes ────

export const stageTitles = {
  services: 'Acquire, Sell, Operate and Build reconnected through Growlatics as one system',
  about: 'Marketing, sales, customer operations and technology connected through Growlatics',
  international: 'Growlatics serving the United States, the United Kingdom and Pakistan',
  service: (service: string) => `${service} in the Growlatics network, lit, with its handoffs to the other systems`,
}

/** Overrides the default schematic lanes (upstream verbs → capabilities → downstream verbs). */
export const serviceSchematics: Partial<Record<ServiceSlug, { inputs: string[]; outputs: string[] }>> = {
  // DIRECTION §8.1: Sell shows inbound and outbound lanes and the appointment handoff to the client's calendar.
  'sales-bpo': { inputs: ['Inbound leads', 'Outbound lists'], outputs: ['Your calendar', 'Operate'] },
}

/** Work page proof slots (IA §5.9): headings render only when the slot has approved entries. */
export const workProofHeadings = { caseStudies: 'Case studies', testimonials: 'What clients say' }
