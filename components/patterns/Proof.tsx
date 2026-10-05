import { proof as defaultProof, type ProofContent } from '@/content'
import Ledger from './Ledger'

// Proof components render null while their content arrays are empty (no placeholders, no "coming soon").

export function CaseStudyList({ items = defaultProof.caseStudies }: { items?: ProofContent['caseStudies'] }) {
  if (!items.length) return null
  return <Ledger rows={items.map((c) => ({ term: c.client, description: c.summary }))} />
}

export function TestimonialSlot({ items = defaultProof.testimonials }: { items?: ProofContent['testimonials'] }) {
  if (!items.length) return null
  return (
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
