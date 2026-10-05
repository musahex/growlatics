import { engagement, proof, systems, work, workProofHeadings, workSchematic } from '@/content'
import { breadcrumbJsonLd, ldJson, pageMetadata } from '@/lib/seo'
import PageHero from '@/components/patterns/PageHero'
import SystemSchematic from '@/components/patterns/SystemSchematic'
import SignalRail from '@/components/patterns/SignalRail'
import Ledger from '@/components/patterns/Ledger'
import ConvergenceCTA from '@/components/patterns/ConvergenceCTA'
import { CaseStudyList, LogoRow, MetricSlot, TestimonialSlot } from '@/components/patterns/Proof'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

export const metadata = pageMetadata(work.route, work.seo)

export default function WorkPage() {
  const [measure, report] = work.sections
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(breadcrumbJsonLd(work.route)) }} />
      <PageHero hero={work.hero} />

      <Section id={measure.id} rule aria-labelledby="measure-h">
        <SectionHeader id="measure-h" heading={measure.heading} />
        <Ledger className="mt-12" rows={(measure.items ?? []).map((i) => ({ term: i.title, description: i.body }))} />
        <div className="mt-16">
          <SystemSchematic
            title={`${measure.heading}: ${(measure.items ?? []).map((i) => i.title).join(', ')}`}
            labels={workSchematic.labels}
            inputs={systems.map((s) => s.verb)}
            capabilities={(measure.items ?? []).map((i) => i.title)}
            outputs={workSchematic.outputs}
          />
        </div>
      </Section>

      <Section id={report.id} rule space="tight" aria-labelledby="report-h">
        <SectionHeader id="report-h" heading={report.heading} body={report.body} />
        {report.links?.map((l) => (
          <Button key={l.href} href={l.href} variant="text" arrow className="mt-8">
            {l.label}
          </Button>
        ))}
      </Section>

      <Section id={engagement.id} tone="surface" aria-labelledby="engage-h">
        <SectionHeader id="engage-h" heading={engagement.heading} />
        <SignalRail className="mt-16" items={engagement.steps.map((s) => ({ index: `0${s.number}`, title: s.title, body: s.body }))} />
      </Section>

      {/* Dormant proof slots: each renders nothing until content/proof.ts has approved entries. */}
      <CaseStudyList heading={workProofHeadings.caseStudies} />
      <TestimonialSlot heading={workProofHeadings.testimonials} />
      {proof.logos.length + proof.metrics.length > 0 && (
        <Section rule>
          <div className="grid gap-12">
            <LogoRow />
            <MetricSlot />
          </div>
        </Section>
      )}

      <ConvergenceCTA heading={work.finalCtaHeading} />
    </>
  )
}
