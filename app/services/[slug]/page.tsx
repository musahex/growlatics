import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  connectedHeading,
  journey,
  journeyHeading,
  pairsWithLabel,
  reportLink,
  schematicLabels,
  servicePages,
  serviceSchematics,
  stageTitles,
  systemById,
  type ServiceSlug,
  type SystemId,
} from '@/content'
import { breadcrumbJsonLd, ldJson, pageMetadata, serviceJsonLd } from '@/lib/seo'
import PageHero from '@/components/patterns/PageHero'
import PageStage from '@/components/pages/PageStage'
import HandoffStrip from '@/components/patterns/HandoffStrip'
import SystemSchematic from '@/components/patterns/SystemSchematic'
import SignalRail from '@/components/patterns/SignalRail'
import Ledger from '@/components/patterns/Ledger'
import ConvergenceCTA from '@/components/patterns/ConvergenceCTA'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

// Where each system sits in the flow: upstream → system → downstream, Build underneath (IA §5.3–5.6).
const FLOW: Record<SystemId, { up: SystemId[]; down: SystemId[]; base: boolean }> = {
  acquire: { up: [], down: ['sell'], base: true },
  sell: { up: ['acquire'], down: ['operate'], base: true },
  operate: { up: ['sell'], down: ['acquire'], base: true },
  build: { up: [], down: ['acquire', 'sell', 'operate'], base: false },
}

export const dynamicParams = false
export function generateStaticParams() {
  return Object.keys(servicePages).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = servicePages[params.slug as ServiceSlug]
  return page ? pageMetadata(page.route, page.seo) : {}
}

const node = (id: SystemId) => ({ label: systemById[id].verb, sub: systemById[id].service, href: systemById[id].href })

export default function ServicePage({ params }: { params: { slug: string } }) {
  const page = servicePages[params.slug as ServiceSlug]
  if (!page) notFound()
  const sys = systemById[page.system]
  const flow = FLOW[sys.id]
  const ledger = (items: { title: string; body: string }[] = []) => items.map((i) => ({ term: i.title, description: i.body }))
  // Sell groups its capabilities: show each group's capabilities as chips under its row.
  const groupTags = (title: string) => sys.capabilities.filter((c) => c.group?.startsWith(title)).map((c) => c.label)
  const lanes = serviceSchematics[sys.slug] ?? { inputs: flow.up.map((id) => systemById[id].verb), outputs: flow.down.map((id) => systemById[id].verb) }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(serviceJsonLd(sys.service, page.route, page.seo.description)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(breadcrumbJsonLd(page.route)) }} />

      <PageHero hero={{ ...page.hero, primary: page.hero.primary && { ...page.hero.primary, href: `/contact/?system=${sys.slug}#book` } }} stage={<PageStage act={5} focus={sys.id} title={stageTitles.service(sys.service)} />}>
          <HandoffStrip upstream={flow.up.map(node)} current={node(sys.id)} downstream={flow.down.map(node)} base={flow.base ? node('build') : undefined} />
      </PageHero>

      <Section rule aria-labelledby="problem-h">
        <SectionHeader id="problem-h" heading={page.problem.heading} body={page.problem.body} />
      </Section>

      <Section id="capabilities" tone="surface" aria-labelledby="cap-h">
        <SectionHeader id="cap-h" heading={page.capabilities.heading} />
        <Ledger className="mt-12" rows={ledger(page.capabilities.items).map((r) => ({ ...r, tags: groupTags(r.term) }))} />
        <div className="mt-16">
          <SystemSchematic
            title={`${sys.service}: ${sys.capabilities.map((c) => c.short).join(', ')}`}
            labels={schematicLabels}
            inputs={lanes.inputs}
            capabilities={sys.capabilities.map((c) => c.short)}
            outputs={lanes.outputs}
          />
        </div>
      </Section>

      {page.howItWorks && (
        <Section rule aria-labelledby="how-h">
          <SectionHeader id="how-h" heading={page.howItWorks.heading} />
          <Ledger className="mt-12" rows={ledger(page.howItWorks.items)} />
        </Section>
      )}

      {page.engagementShapes && (
        <Section rule aria-labelledby="shapes-h">
          <SectionHeader id="shapes-h" heading={page.engagementShapes.heading} />
          <Ledger className="mt-12" rows={ledger(page.engagementShapes.items)} />
        </Section>
      )}

      <Section rule aria-labelledby="journey-h">
        <SectionHeader id="journey-h" heading={journeyHeading(sys.verb)} body={page.journeyNote} />
        <SignalRail
          className="mt-16"
          isActive={(i) => sys.id === 'build' || sys.stages.includes(journey.stages[i].id)}
          items={journey.stages.map((st) => ({ index: st.number, title: st.name, body: st.line }))}
        />
      </Section>

      <Section rule aria-labelledby="connected-h">
        <SectionHeader id="connected-h" heading={connectedHeading} />
        <Ledger
          className="mt-12"
          rows={sys.pairsWith.map((p) => ({ term: pairsWithLabel(systemById[p.system].verb), description: p.line, href: systemById[p.system].href }))}
        />
        <Link href={reportLink.href} className="mt-8 inline-flex min-h-11 items-center text-body-s font-semibold text-signal-ink hover:text-text">
          {reportLink.label} →
        </Link>
      </Section>

      {page.faq && (
        <Section rule aria-labelledby="faq-h">
          <SectionHeader id="faq-h" heading={page.faqHeading ?? ''} />
          <Ledger className="mt-12" rows={page.faq.map((q) => ({ term: q.question, description: q.answer }))} />
        </Section>
      )}

      <ConvergenceCTA heading={page.finalCtaHeading} />
    </>
  )
}
