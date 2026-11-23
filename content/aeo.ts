import type { Cta, FaqItem, Hero, Seo } from './types'
import { site } from './site'

// AEO for local businesses (owner-supplied page, 2026-11-23): copy from "Growlatics AEO Page – Website Copy"
// in its order, plus the deck ("Local Growth System") material the copy does not carry: the live check, the
// measurement comparison, the ten-minutes-a-week part, the 90-day timing and the investment band.
// OWNER-VERIFY (docs/v2/OWNER_VERIFY.md): the three statistics (sourced), the Samosa Paradise proof, the
// reference-call line and the prices are the owner's own claims, supplied 2026-11-23.
// The WhatsApp number is separate from the site's call number on purpose (owner, 2026-11-23).

export const whatsapp = {
  number: '+1 (470) 908-1949',
  digits: '14709081949',
  message: "Hi Growlatics, I'd like my free AI audit. My business is [name] in [city].",
}
/** wa.me deep link with the ready-made message prefilled. */
export const whatsappHref = `https://wa.me/${whatsapp.digits}?text=${encodeURIComponent(whatsapp.message)}`

const audit: Cta = { label: 'Get my free AI audit on WhatsApp', href: whatsappHref }
const call: Cta = { label: 'Call us', href: site.contact.phoneHref }

export const aeo: {
  route: '/aeo/'
  slug: 'aeo'
  name: string
  seo: Seo
  hero: Hero & { note: string }
  /** Hero figure: an AI answer to a local question, your business first. Illustrative: no real names. */
  answer: { question: string; intro: string; picks: { name: string; tag?: string }[]; status: string }
  shift: { eyebrow: string; heading: string; stats: { value: string; body: string }[]; sourceNote: string; sources: { label: string; href: string }[]; before: string; now: string; rows: { before: string; now: string }[] }
  liveCheck: { eyebrow: string; heading: string; cards: { label: string; value: string; sub: string }[]; line: string }
  checks: { eyebrow: string; heading: string; intro: string; items: { title: string; body: string }[]; line: string }
  everywhere: { eyebrow: string; heading: string; upstream: { label: string; sub: string }[]; current: { label: string; sub: string }; downstream: { label: string; sub: string }[]; line: string }
  /** Two groups of AEO steps: what brings calls within weeks, and what makes AI keep naming you. */
  system: { eyebrow: string; heading: string; columns: { when: string; title: string; body: string; steps: string[] }[]; line: string }
  how: { eyebrow: string; heading: string; steps: { title: string; body: string; when: string }[]; timeline: string; faster: string }
  measure: { eyebrow: string; heading: string; agencies: { label: string; items: string[]; line: string }; us: { label: string; items: string[]; line: string } }
  proof: { eyebrow: string; heading: string; body: string; reference: string; image: { src: string; alt: string; width: number; height: number } }
  get: { heading: string; items: string[]; line: string }
  yourPart: { eyebrow: string; heading: string; items: { title: string; body: string }[]; line: string }
  investment: { eyebrow: string; range: string; body: string; line: string; items: { title: string; body?: string }[] }
  faq: { heading: string; items: FaqItem[] }
  finalCta: { eyebrow: string; heading: string; body: string; primary: Cta; secondary: Cta; note: string; messageLabel: string; copyLabel: string; copiedLabel: string }
  fab: { label: string }
} = {
  route: '/aeo/',
  slug: 'aeo',
  name: 'AEO for Local Businesses',
  seo: {
    title: 'AEO: be the business AI recommends | Growlatics',
    description:
      "People now ask ChatGPT and Google's AI for the best plumber, handyman or cleaner near them. Growlatics makes sure AI names your business. Free AI audit on WhatsApp, no contract.",
    ogTitle: 'When homeowners ask AI who to call, be the name it gives.',
  },
  hero: {
    eyebrow: 'AI optimization for local businesses',
    heading: 'When homeowners ask AI who to call, be the name it gives.',
    lead: "People now ask ChatGPT and Google's AI for the best plumber, handyman or cleaner near them. AI names two or three businesses, and they call one of them. We make sure it's you.",
    primary: audit,
    secondary: call,
    note: "Free. No contract. We'll show you exactly what AI says about your business today.",
  },
  answer: {
    question: 'Best plumber near me?',
    intro: 'Here are the ones I’d call first:',
    picks: [{ name: 'Your business', tag: 'My top pick' }, { name: 'A competitor' }, { name: 'Another competitor' }],
    status: 'What AI should say',
  },
  shift: {
    eyebrow: 'The shift',
    heading: 'The way customers find you has changed.',
    stats: [
      { value: '45%', body: 'of US consumers now use AI tools like ChatGPT to find local businesses, up from 6% a year earlier.' },
      { value: 'First', body: "The first thing on Google is now often an AI answer, before any website." },
      { value: '1.2%', body: 'of local business locations get recommended by ChatGPT. Most are invisible.' },
    ],
    sourceNote: 'Sources: BrightLocal Local Consumer Review Survey 2026; SOCi Local Visibility Index 2026.',
    sources: [
      { label: 'BrightLocal 2026 findings via DesignRush', href: 'https://news.designrush.com/ai-local-business-discovery-website-strategy' },
      { label: 'SOCi Local Visibility Index via Search Engine Land', href: 'https://searchengineland.com/ai-local-visibility-report-2026-468085' },
    ],
    before: 'Before',
    now: 'Now',
    rows: [
      { before: 'Customers scrolled a list of ten websites', now: 'AI gives them two or three names' },
      { before: 'They compared prices and shopped around', now: 'They call who AI recommends' },
      { before: 'Ranking on page one was enough', now: "If AI doesn't say your name, you're not in the conversation" },
    ],
  },
  liveCheck: {
    eyebrow: 'Live check',
    heading: 'We asked AI about your business.',
    cards: [
      { label: 'We asked', value: '“Best [trade] in [city]”', sub: "ChatGPT and Google's AI answer" },
      { label: 'AI recommended', value: '[Competitor 1], [Competitor 2]', sub: 'Businesses AI trusts today' },
      { label: 'Where you were', value: '[Not mentioned]', sub: 'Even with [X] reviews and [Y] years of great work' },
    ],
    line: 'Those homeowners are calling someone else today.',
  },
  checks: {
    eyebrow: 'How AI decides',
    heading: "Great work isn't enough if AI can't see it.",
    intro: "AI doesn't guess. Before it recommends anyone, it looks for proof that you're a real, trusted local business. Most owners are missing two or three of these:",
    items: [
      { title: 'Google Business Profile', body: 'Complete, with services, photos and the towns you serve.' },
      { title: 'Reviews', body: 'Plenty of them, recent, on Google and other sites.' },
      { title: 'The same details everywhere', body: 'Name, phone and address match on every listing.' },
      { title: 'A website AI can read', body: 'Clear pages for each service and town, and answers to common questions.' },
      { title: 'Trust signals', body: 'Your name, years in business, license and insurance.' },
      { title: 'Mentions elsewhere', body: 'Directories, videos and local articles.' },
    ],
    line: "The good news? Most of your competitors aren't doing this yet.",
  },
  everywhere: {
    eyebrow: 'AEO',
    heading: 'Be everywhere AI looks.',
    upstream: [
      { label: 'Website', sub: 'Your website' },
      { label: 'Profile', sub: 'Google Business Profile' },
      { label: 'Reviews', sub: 'Reviews on Google and Yelp' },
    ],
    current: { label: 'AI trusts', sub: 'Your business' },
    downstream: [
      { label: 'Social', sub: 'YouTube and Facebook' },
      { label: 'Directories', sub: 'BBB, Nextdoor' },
      { label: 'Local news', sub: 'Local news and articles' },
    ],
    line: 'When every source tells the same story, AI trusts you, and recommends you.',
  },
  system: {
    eyebrow: 'What we do',
    heading: 'Leads now, and leads that last.',
    columns: [
      {
        when: 'Within weeks',
        title: 'Leads now',
        body: 'Your Google profile, reviews and listings, set up so customers trust you and call.',
        steps: [
          'Google Business Profile completed: services, photos and the towns you serve',
          'A steady flow of recent reviews on Google and other sites',
          'Name, phone and address matching on every listing',
          'Trust signals in place: your name, years in business, license and insurance',
        ],
      },
      {
        when: 'Builds over months',
        title: 'Leads that last',
        body: "We make your business easy for ChatGPT and Google's AI to recommend, and keep it there.",
        steps: [
          'A page for every service and every town, written for that town',
          'Answers to the questions customers actually ask AI',
          'Videos, directories and local mentions that tell the same story',
          'AI names you first: tracked every month, reported every week',
        ],
      },
    ],
    line: 'As AEO grows, you rely less on paid ads and more work comes to you for free.',
  },
  how: {
    eyebrow: 'How it works',
    heading: 'From a free audit to AI naming you.',
    steps: [
      { title: 'Free AI audit', body: 'We check what ChatGPT and Google say about you today, and show you exactly why.', when: 'Within 48 hours' },
      { title: 'We fix the foundation', body: 'Google profile, listings and reviews, all matching.', when: 'Weeks 1–2' },
      { title: 'We make your website AI-ready', body: 'Pages for your services and towns, plus answers to the questions customers ask.', when: 'Weeks 3–4' },
      { title: 'AI starts naming you', body: 'We track it every month, and you get a short report every week.', when: 'Month 3 on' },
    ],
    timeline: "You'll see Google improvements within weeks. AI recommendations build over two to three months.",
    faster: "Already have great reviews? You'll move faster than most.",
  },
  measure: {
    eyebrow: 'How we measure',
    heading: 'We measure calls, not clicks.',
    agencies: { label: 'What most agencies report', items: ['Impressions', 'Rankings', 'Website traffic'], line: "Nice charts. Your phone doesn't ring any more often." },
    us: { label: 'What we report every week', items: ['Calls and messages', 'Estimates booked', 'What AI says about you'], line: 'The numbers that pay your bills.' },
  },
  proof: {
    eyebrow: 'Proof',
    heading: "AI's top pick? Our client.",
    body: 'Ask AI for the best samosa shop in Jersey City, and its first recommendation is our client, Samosa Paradise.',
    reference: 'The owner, Saif, takes reference calls. Ask him what changed.',
    image: { src: '/aeo/samosa-paradise.webp', alt: 'An AI chat answering “best samosa shop in jersey city”: “my first recommendation is Samosa Paradise”, marked as its top pick.', width: 1200, height: 594 },
  },
  get: {
    heading: 'What you get',
    items: [
      'No contract. Month to month.',
      'Weekly updates with real numbers: calls, bookings and what AI says about you.',
      'You own everything we build.',
      'One business per trade in each city. We never work for your competitors in your area.',
    ],
    line: 'We measure calls, not clicks.',
  },
  yourPart: {
    eyebrow: 'A partnership',
    heading: 'Your part takes ten minutes a week.',
    items: [
      { title: 'Ask for reviews', body: 'Every happy customer gets your review link. Aim for one review from every other job.' },
      { title: 'Snap before and after', body: 'Two photos on every job. Real work beats any stock photo.' },
      { title: 'Share your work', body: 'Post a job on Facebook once a week. AI notices businesses people talk about.' },
    ],
    line: 'We handle the rest, and give you the review link, message templates and reminders.',
  },
  investment: {
    eyebrow: 'Investment',
    range: '$300–$800',
    body: 'per month for AEO depending on how many towns you want to own.',
    line: 'Two jobs a month pays for it.',
    items: [
      { title: 'No contract.', body: 'Month to month.' },
      { title: 'Weekly updates', body: 'with real numbers.' },
      { title: 'You own everything we build.' },
      { title: 'One business per trade, per city.' },
    ],
  },
  faq: {
    heading: 'Questions owners ask',
    items: [
      { question: 'What is AEO?', answer: "AEO (AI optimization) is how we get AI tools like ChatGPT and Google's AI answer to recommend your business when customers ask who to call." },
      { question: 'Is this the same as SEO?', answer: 'No, but they work together. SEO puts you on a list. AEO makes you the answer. If you already have SEO, we build on it.' },
      { question: 'How long does it take?', answer: 'Google improvements show within weeks. AI recommendations usually build over two to three months. Businesses with good reviews often move faster.' },
      { question: 'Do I need a new website?', answer: "Not always. Often we improve the one you have. If you don't have one, we build it for you." },
      { question: 'Do I have to do much?', answer: 'About ten minutes a week: ask happy customers for reviews and send us photos of your work. We handle the rest.' },
      { question: 'How much does it cost?', answer: 'It depends on how many towns you want to cover. Plans start at $300 a month, with no contract. Your free audit comes with an exact price.' },
      { question: "What's in the free audit?", answer: 'What ChatGPT and Google say about your business today, who they recommend instead, and the exact steps to fix it.' },
    ],
  },
  finalCta: {
    eyebrow: 'Free AI audit',
    heading: 'Find out what AI says about your business.',
    body: "Send us your business name and city on WhatsApp. Within 48 hours, we'll send your free AI audit: where you stand, who AI recommends instead, and how to fix it.",
    primary: audit,
    secondary: call,
    note: 'Only one business per trade in each city. Check if yours is still open.',
    messageLabel: 'Ready-made message',
    copyLabel: 'Copy message',
    copiedLabel: 'Copied',
  },
  fab: { label: 'Free AI audit' },
}
