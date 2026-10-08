import { engagement, journey, services, site, stageTitles, systemById, systems, systemsSellFirst } from '@/content'
import { ldJson, pageJsonLd, pageMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'
import PageHero from '@/components/patterns/PageHero'
import PageStage from '@/components/pages/PageStage'
import HandoffStrip from '@/components/patterns/HandoffStrip'
import SignalRail from '@/components/patterns/SignalRail'
import OwnershipLanes from '@/components/patterns/OwnershipLanes'
import Ledger from '@/components/patterns/Ledger'
import ConvergenceCTA from '@/components/patterns/ConvergenceCTA'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'
import Reveal from '@/components/ui/Reveal'

export const metadata = pageMetadata(services.route, services.seo)

const node = (id: 'acquire' | 'sell' | 'operate' | 'build') => ({ label: systemById[id].verb, sub: systemById[id].service, href: systemById[id].href })

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(pageJsonLd(services.route, services.seo)) }} />
      <PageHero hero={services.hero} stage={<PageStage act={5} title={stageTitles.services} />}>
          <HandoffStrip glass upstream={[node('acquire')]} current={node('sell')} downstream={[node('operate')]} base={node('build')} />
      </PageHero>

      <Section id="systems" rule aria-labelledby="systems-h">
        <SectionHeader id="systems-h" heading={services.sections[0].heading} />
        <div className="mt-16 border-b border-line">
          {systemsSellFirst.map((s) => (
            <Reveal key={s.id} className="grid gap-6 border-t border-line py-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
              <div>
                <p className="mb-3 text-label uppercase text-signal-ink">{s.verb}</p>
                <h3 className={cn('text-text', s.emphasis ? 'text-display-m' : 'text-title')}>{s.service}</h3>
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
                <Button href={s.href} variant="text" arrow className="mt-6">
            {s.exploreLabel}
          </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface" aria-labelledby="map-h">
        <SectionHeader id="map-h" heading={services.journeyMap.heading} body={services.journeyMap.body} />
        <OwnershipLanes
          className="mt-16"
          stages={journey.stages.map((st) => ({ index: st.number, title: st.name, body: st.line }))}
          lanes={systems.map((s) => ({
            label: s.verb,
            owns: journey.stages.flatMap((st, i) => (st.systems.includes(s.id) ? [i] : [])),
            base: s.id === 'build',
          }))}
        />
      </Section>

      <Section id={engagement.id} rule aria-labelledby="engage-h">
        <SectionHeader id="engage-h" heading={engagement.heading} />
        <SignalRail className="mt-16" items={engagement.steps.map((s) => ({ index: `0${s.number}`, title: s.title, body: s.body }))} />
      </Section>

      <Section id="faq" rule space="tight" aria-labelledby="faq-h">
        <SectionHeader id="faq-h" heading={services.faqHeading} />
        <Ledger className="mt-12" rows={(services.faq ?? []).map((q) => ({ term: q.question, description: q.answer }))} />
      </Section>

      <ConvergenceCTA heading={services.finalCtaHeading ?? site.finalCta.heading} />
    </>
  )
}
