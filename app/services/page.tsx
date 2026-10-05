import Link from 'next/link'
import { engagement, journey, services, site, systemById, systemsSellFirst } from '@/content'
import { pageMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'
import PageHero from '@/components/patterns/PageHero'
import HandoffStrip from '@/components/patterns/HandoffStrip'
import SignalRail from '@/components/patterns/SignalRail'
import Ledger from '@/components/patterns/Ledger'
import ConvergenceCTA from '@/components/patterns/ConvergenceCTA'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'

export const metadata = pageMetadata(services.route, services.seo)

const node = (id: 'acquire' | 'sell' | 'operate' | 'build') => ({ label: systemById[id].verb, sub: systemById[id].service, href: systemById[id].href })

export default function ServicesPage() {
  return (
    <>
      <PageHero hero={services.hero}>
        <HandoffStrip upstream={[node('acquire')]} current={node('sell')} downstream={[node('operate')]} base={node('build')} />
      </PageHero>

      <Section id="systems" rule aria-labelledby="systems-h">
        <SectionHeader id="systems-h" heading={services.sections[0].heading} />
        <div className="mt-16 border-b border-line">
          {systemsSellFirst.map((s) => (
            <Reveal key={s.id} className="grid gap-6 border-t border-line py-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
              <div>
                <p className="mb-3 text-label uppercase text-signal-ink">{s.verb}</p>
                <h3 className={cn('text-text', s.emphasis ? 'text-display-m' : 'text-title')}>{s.service}</h3>
                {s.positioning && <p className="mt-4 text-body text-text-2">{s.positioning}</p>}
              </div>
              <div>
                <p className="max-w-measure text-body text-text-2">{s.long}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.capabilities.map((c) => (
                    <li key={c.id} className="rounded-sm border border-line px-2 py-1 font-mono text-data text-text-2">
                      {c.short}
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className="mt-6 inline-flex min-h-11 items-center text-body-s font-semibold text-signal-ink hover:text-text">
                  {s.exploreLabel} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface" aria-labelledby="map-h">
        <SectionHeader id="map-h" heading={services.journeyMap.heading} body={services.journeyMap.body} />
        <SignalRail
          className="mt-16"
          items={journey.stages.map((st) => ({ index: st.number, title: st.name, body: st.line, tags: st.systems.map((id) => systemById[id].verb) }))}
        />
      </Section>

      <Section id={engagement.id} rule aria-labelledby="engage-h">
        <SectionHeader id="engage-h" heading={engagement.heading} />
        <SignalRail className="mt-16" items={engagement.steps.map((s) => ({ index: `0${s.number}`, title: s.title, body: s.body }))} />
      </Section>

      <Section id="faq" rule aria-labelledby="faq-h">
        <SectionHeader id="faq-h" heading={services.faqHeading} />
        <Ledger className="mt-12" rows={(services.faq ?? []).map((q) => ({ term: q.question, description: q.answer }))} />
      </Section>

      <ConvergenceCTA heading={services.finalCtaHeading ?? site.finalCta.heading} />
    </>
  )
}
