import { notFound } from 'next/navigation'
import {
  connectedHeading,
  journey,
  journeyHeading,
  pairsWithLabel,
  reportLink,
  salesHandoff,
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
import Button from '@/components/ui/Button'
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
  const lanes = serviceSchematics[sys.slug] ?? { inputs: flow.up.map((id) => systemById[id].verb), outputs: flow.down.map((id) => systemById[id].verb) }
  // Sell groups its 13 capabilities: the schematic draws 4 group nodes with their capabilities as sub-tags (review #5).
  const groups = Array.from(new Set(sys.capabilities.map((c) => c.group).filter((g): g is string => !!g)))
  const capNodes = groups.length ? groups : sys.capabilities.map((c) => c.short)
  const capNotes = groups.length ? groups.map((g) => {
        const caps = sys.capabilities.filter((c) => c.group === g)
        return caps.map((c) => (caps.length === 1 ? c.label : c.short)) // a one-capability group's short name repeats the group
      }) : undefined
  const sell = sys.id === 'sell'
  const hero = sell
    ? { upstream: salesHandoff.hero.upstream, downstream: [...salesHandoff.hero.downstream, node('operate')] }
    : { upstream: flow.up.map(node), downstream: flow.down.map(node) }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(serviceJsonLd(sys.service, page.route, page.seo.description)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(breadcrumbJsonLd(page.route)) }} />

      <PageHero hero={{ ...page.hero, primary: page.hero.primary && { ...page.hero.primary, href: `/contact/?system=${sys.slug}#book` } }} stage={<PageStage act={5} focus={sys.id} title={stageTitles.service(sys.service)} />}>
          <HandoffStrip glass upstream={hero.upstream} current={node(sys.id)} downstream={hero.downstream} base={flow.base ? node('build') : undefined} />
      </PageHero>

      {/* Answer-first passage (AEO): a plain definition of the service before the narrative sections. */}
      <Section rule space="tight" aria-labelledby="overview-h">
        <SectionHeader id="overview-h" heading={page.overview.heading} body={page.overview.answer} />
        <dl className="mt-12 border-b border-line">
          {page.overview.facts.map((f) => (
            <div key={f.term} className="grid gap-2 border-t border-line py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
              <dt className="text-body font-semibold text-text">{f.term}</dt>
              <dd className="max-w-measure text-body text-text-2">{f.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section rule space="tight" aria-labelledby="problem-h">
        <SectionHeader id="problem-h" heading={page.problem.heading} body={page.problem.body} />
      </Section>

      <Section id="capabilities" tone="surface" aria-labelledby="cap-h">
        <SectionHeader id="cap-h" heading={page.capabilities.heading} />
        <Ledger className="mt-12" rows={ledger(page.capabilities.items)} />
        {/* A diagram on a clean field, no glass: Sales & BPO keeps its glass on the two handoff strips (REVIEW_GLASS #3). */}
        <div className="mt-16">
          <SystemSchematic
            title={`${sys.service}: ${sys.capabilities.map((c) => c.short).join(', ')}`}
            labels={schematicLabels}
            inputs={lanes.inputs}
            capabilities={capNodes}
            notes={capNotes}
            outputs={lanes.outputs}
          />
        </div>
      </Section>

      {page.howItWorks && (
        <Section rule aria-labelledby="how-h">
          <SectionHeader id="how-h" heading={page.howItWorks.heading} />
          {sell && (
            <div className="mt-12">
              <HandoffStrip glass label={salesHandoff.team.label} upstream={salesHandoff.team.upstream} current={salesHandoff.team.current} downstream={salesHandoff.team.downstream} />
            </div>
          )}
          <SignalRail className="mt-12" items={(page.howItWorks.items ?? []).map((i, k) => ({ index: String(k + 1).padStart(2, '0'), title: i.title, body: i.body }))} />
        </Section>
      )}

      {page.engagementShapes && (
        <Section rule space="tight" aria-labelledby="shapes-h">
          <Split>
            <SectionHeader id="shapes-h" heading={page.engagementShapes.heading} />
            <Ledger rows={ledger(page.engagementShapes.items)} />
          </Split>
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

      <Section rule space="tight" aria-labelledby="connected-h">
        <Split>
          <div>
            <SectionHeader id="connected-h" heading={connectedHeading} />
            <Button href={reportLink.href} variant="text" arrow className="mt-6">
              {reportLink.label}
            </Button>
          </div>
          <Ledger rows={sys.pairsWith.map((p) => ({ term: pairsWithLabel(systemById[p.system].verb), description: p.line, href: systemById[p.system].href }))} />
        </Split>
      </Section>

      {page.faq && (
        <Section rule space="tight" aria-labelledby="faq-h">
          <Split>
            <SectionHeader id="faq-h" heading={page.faqHeading ?? ''} />
            <Ledger rows={page.faq.map((q) => ({ term: q.question, description: q.answer }))} />
          </Split>
        </Section>
      )}

      <ConvergenceCTA heading={page.finalCtaHeading} />
    </>
  )
}

/** Heading beside its list from lg: short reference sections read as one block, not another full-width table. */
function Split({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">{children}</div>
}
