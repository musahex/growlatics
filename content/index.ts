// Single source of copy. Components import from '@/content'.
import { systems } from './systems'
import { journey } from './journey'
import { site } from './site'
import type { PostalAddress } from './types'

export * from './types'
export * from './site'
export * from './nav'
export * from './systems'
export * from './journey'
export * from './pages'
export * from './faq'
export * from './proof'
export * from './lead'
// legal.ts is NOT re-exported: the barrel is imported by client components, and the unapproved drafts must not ship
// in shared JS. app/privacy and app/terms import '@/content/legal' directly.

// Flat label map: system ids, capability ids (`<system>.<capability>`), stage ids, markets, core.
const labels: Record<string, string> = {
  core: site.name,
  ...Object.fromEntries(systems.map((s) => [s.id, s.verb])),
  ...Object.fromEntries(systems.flatMap((s) => s.capabilities.map((c) => [c.id, c.short]))),
  ...Object.fromEntries(journey.stages.map((st) => [st.id, st.name])),
  ...Object.fromEntries(site.markets.map((m) => [`market.${m.code.toLowerCase()}`, m.label])),
}

/** Address as shown in copy, street and city only: '12123 Garner Mill Lane, Houston'. JSON-LD carries the full PostalAddress. */
export function formatAddress(a: PostalAddress): string {
  return `${a.street}, ${a.city}`
}

/** Short display label for a graph / content key, e.g. getLabel('sell.appointment-setting') → 'Appointments'. */
export function getLabel(key: string): string {
  return labels[key] ?? key
}
