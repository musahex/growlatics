// Content data shape (docs/v2/IA_AND_COPY.md §8). Every component imports copy from content/.
// `verify: true` marks an OWNER-VERIFY claim (IA §9.1): god strips or confirms it before publishing.

export type SystemId = 'acquire' | 'sell' | 'operate' | 'build'
export type ServiceSlug = 'performance-marketing' | 'sales-bpo' | 'customer-operations' | 'technology'
export type StageId = 'attract' | 'qualify' | 'close' | 'retain' | 'scale'
export type Route =
  | '/'
  | '/services/'
  | '/services/sales-bpo/'
  | '/services/performance-marketing/'
  | '/services/customer-operations/'
  | '/services/technology/'
  | '/work/'
  | '/about/'
  | '/contact/'

/** Marks a string or block the owner must confirm before publishing. */
export interface Verifiable { verify?: true }

export interface Link { label: string; href: string; external?: boolean }
export interface Cta { label: string; href: string }

export interface SiteContent {
  name: 'Growlatics'
  url: 'https://growlatics.us'
  positioning: string
  tagline: string
  geography: string
  description: string
  markets: { code: 'US' | 'GB' | 'PK' | 'INTL'; label: string }[]
  contact: { email: string; phone: string; phoneHref: string }
  social: { label: 'LinkedIn' | 'Facebook' | 'Instagram'; href: string }[]
  primaryCta: Cta
  finalCta: { heading: string; body: string; primary: Cta; secondary: Cta; note: string }
}

export interface NavItem { label: string; href: Route; children?: { system: SystemId; label: string; href: Route }[] }
export interface NavContent {
  header: NavItem[]
  servicesPanelFooter: Link
  footer: { heading: string; links: Link[] }[]
  legal: Link[]
  skipLink: string
  copyright: (year: number) => string
}

/** One capability. id = `<system>.<capability>` (shared contract with SYSTEM-3D). */
export interface Capability extends Verifiable {
  id: `${SystemId}.${string}`
  label: string // full label (IA §3)
  short: string // node / chip label
  group?: string // Sell groups its capabilities
}

export interface CapabilityGroup extends Verifiable { title: string; body: string }

export interface SystemContent extends Verifiable {
  id: SystemId
  verb: 'Acquire' | 'Sell' | 'Operate' | 'Build'
  service: string
  slug: ServiceSlug
  href: Route
  emphasis: boolean
  short: string
  long: string
  positioning?: string
  tags: string[]
  capabilities: Capability[]
  stages: StageId[]
  pairsWith: { system: SystemId; line: string }[]
  exploreLabel: string
}

export interface StageContent {
  id: StageId
  number: '01' | '02' | '03' | '04' | '05'
  name: 'Attract' | 'Qualify' | 'Close' | 'Retain' | 'Scale'
  line: string
  copy: string
  systems: SystemId[]
}
export interface JourneyContent { eyebrow: string; heading: string; intro: string; closing: Link; stages: StageContent[] }

export interface SectionItem extends Verifiable { title: string; body: string; href?: string }
export interface Section extends Verifiable {
  id?: string
  eyebrow?: string
  heading: string // h2
  body?: string
  items?: SectionItem[] // h3 + text
  links?: Link[]
}

export interface FaqItem extends Verifiable { question: string; answer: string }

export interface Seo { title: string; description: string; ogTitle?: string; noindex?: boolean }
export interface Hero { eyebrow?: string; heading: string; lead: string; primary?: Cta; secondary?: Cta }

export interface PageContent {
  route: Route
  seo: Seo
  hero: Hero // heading = h1
  sections: Section[]
  finalCtaHeading?: string | null // null = no final CTA band (contact)
  faq?: FaqItem[]
}

export interface HomeContent extends Omit<PageContent, 'sections'> {
  hero: Hero & { panelLabel: string }
  problem: Section & { leaks: { title: string; body: string }[] }
  connection: Section
  journey: JourneyContent
  capabilities: Section
  why: Section & { separate: string[]; connected: string[]; note: string } & Verifiable
  global: Section
  work: Section
}

export interface ServicePageContent extends PageContent {
  system: SystemId
  problem: Section
  capabilities: Section
  howItWorks?: Section
  engagementShapes?: Section
  journeyNote: string
  faqHeading?: string
}

export interface EngagementStep { number: 1 | 2 | 3 | 4; title: 'Diagnose' | 'Design' | 'Deploy' | 'Operate'; body: string }
