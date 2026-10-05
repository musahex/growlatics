'use client'

import Link from 'next/link'
import { home, systems } from '@/content'
import Inspector from '@/components/patterns/Inspector'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

// Act 5 (interim): four systems as an inspector, Sell default-active. HOME refines it.
export default function ServicesSection() {
  const c = home.capabilities
  return (
    <Section id={c.id} tone="surface" rule aria-labelledby="capabilities-h">
      <SectionHeader id="capabilities-h" eyebrow={c.eyebrow} heading={c.heading} body={c.body} />
      <div className="mt-16">
        <Inspector
          label={c.heading}
          defaultId="sell"
          items={systems.map((s, i) => ({
            id: s.id,
            meta: String(i + 1).padStart(2, '0'),
            label: s.verb,
            content: (
              <div>
                <h3 className="text-title text-text">
                  {s.verb} — {s.service}
                </h3>
                <p className="mt-4 max-w-measure text-body text-text-2">{s.short}</p>
                {s.positioning && <p className="mt-4 text-body font-semibold text-text">{s.positioning}</p>}
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li key={t} className="rounded-sm border border-line px-2 py-1 font-mono text-data text-text-2">
                      {t}
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className="mt-6 inline-flex min-h-11 items-center text-body-s font-semibold text-signal-ink hover:text-text">
                  {s.exploreLabel} →
                </Link>
              </div>
            ),
          }))}
        />
      </div>
    </Section>
  )
}
