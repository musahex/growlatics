import Link from 'next/link'
import { engagement, home } from '@/content'
import { organizationJsonLd } from '@/lib/seo'
import GlobalGrowthScene from '@/components/three/GlobalGrowthScene'
import Hero from '@/components/sections/Hero'
import ThreeGrowthWindow from '@/components/sections/ThreeGrowthWindow'
import ServicesSection from '@/components/sections/ServicesSection'
import Ledger from '@/components/patterns/Ledger'
import SignalRail from '@/components/patterns/SignalRail'
import ConvergenceCTA from '@/components/patterns/ConvergenceCTA'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

// Interim home on the v2 foundation. HOME (phase 3) replaces it with the nine acts on the system stage.
export default function Home() {
  const { connection, work } = home
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      {/* Legacy fixed background canvas, home only until HOME mounts the system stage. */}
      <GlobalGrowthScene />

      <Hero />

      <Section id={connection.id} rule aria-labelledby="system-h">
        <SectionHeader id="system-h" eyebrow={connection.eyebrow} heading={connection.heading} body={connection.body} />
        <Ledger className="mt-12" rows={(connection.items ?? []).map((i) => ({ term: i.title, description: i.body }))} />
      </Section>

      <ThreeGrowthWindow />
      <ServicesSection />

      <Section id={work.id} rule aria-labelledby="work-h">
        <SectionHeader id="work-h" eyebrow={work.eyebrow} heading={work.heading} body={work.body} />
        <SignalRail className="mt-16" items={engagement.steps.map((s) => ({ index: `0${s.number}`, title: s.title, body: s.body }))} />
        {work.links?.map((l) => (
          <Link key={l.href} href={l.href} className="mt-12 inline-flex min-h-11 items-center text-body-s font-semibold text-signal-ink hover:text-text">
            {l.label} →
          </Link>
        ))}
      </Section>

      <ConvergenceCTA />
    </>
  )
}
