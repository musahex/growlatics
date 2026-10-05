import { proof as defaultProof, type ProofContent } from '@/content'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'
import Ledger from './Ledger'

// Proof components render null while their content arrays are empty (no placeholders, no "coming soon").
// Pass `heading` to render the slot as its own section (IA §5.9); the heading appears only with entries.

function Slot({ id, heading, children }: { id: string; heading?: string; children: React.ReactNode }) {
  if (!heading) return <>{children}</>
  return (
    <Section id={id} rule aria-labelledby={`${id}-h`}>
      <SectionHeader id={`${id}-h`} heading={heading} />
      <div className="mt-12">{children}</div>
    </Section>
  )
}

export function CaseStudyList({ items = defaultProof.caseStudies, heading }: { items?: ProofContent['caseStudies']; heading?: string }) {
  if (!items.length) return null
  return (
    <Slot id="case-studies" heading={heading}>
      <Ledger rows={items.map((c) => ({ term: c.client, description: c.summary }))} />
    </Slot>
  )
}

export function TestimonialSlot({ items = defaultProof.testimonials, heading }: { items?: ProofContent['testimonials']; heading?: string }) {
  if (!items.length) return null
  return (
    <Slot id="testimonials" heading={heading}>
    <ul className="grid gap-10">
      {items.map((t) => (
        <li key={t.id}>
          <blockquote className="max-w-3xl text-title text-text">{t.quote}</blockquote>
          <p className="mt-4 text-body-s text-text-3">
            {t.name}, {t.role}, {t.company}
          </p>
        </li>
      ))}
    </ul>
    </Slot>
  )
}

export function LogoRow({ items = defaultProof.logos }: { items?: ProofContent['logos'] }) {
  if (!items.length) return null
  return (
    <ul className="flex flex-wrap items-center gap-10">
      {items.map((l) => (
        <li key={l.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.src} alt={l.name} className="h-8 w-auto opacity-80" />
        </li>
      ))}
    </ul>
  )
}

export function MetricSlot({ items = defaultProof.metrics }: { items?: ProofContent['metrics'] }) {
  if (!items.length) return null
  return (
    <dl className="flex flex-wrap gap-x-12 gap-y-6">
      {items.map((m) => (
        <div key={m.label}>
          <dt className="text-body-s text-text-3">{m.label}</dt>
          <dd className="text-display-m text-text">{m.value}</dd>
        </div>
      ))}
    </dl>
  )
}
