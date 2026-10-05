import Link from 'next/link'
import { about, site, systemById } from '@/content'
import { pageMetadata } from '@/lib/seo'
import PageHero from '@/components/patterns/PageHero'
import HandoffStrip from '@/components/patterns/HandoffStrip'
import Ledger from '@/components/patterns/Ledger'
import ConvergenceCTA from '@/components/patterns/ConvergenceCTA'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

export const metadata = pageMetadata(about.route, about.seo)

const node = (id: 'acquire' | 'sell' | 'operate' | 'build') => ({ label: systemById[id].verb, sub: systemById[id].service, href: systemById[id].href })

export default function AboutPage() {
  return (
    <>
      <PageHero hero={about.hero}>
        <HandoffStrip upstream={[node('acquire'), node('sell')]} current={{ label: site.name, sub: site.tagline }} downstream={[node('operate'), node('build')]} />
      </PageHero>
      {about.sections.map((s) => (
        <Section key={s.heading} id={s.id} rule aria-labelledby={`${s.id}-h`}>
          <SectionHeader id={`${s.id}-h`} heading={s.heading} body={s.body} />
          {s.items && <Ledger className="mt-12" rows={s.items.map((i) => ({ term: i.title, description: i.body }))} />}
          {s.links && (
            <ul className="mt-8 flex flex-wrap gap-x-8">
              {s.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center text-body-s font-semibold text-signal-ink hover:text-text">
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      ))}
      <ConvergenceCTA heading={about.finalCtaHeading} />
    </>
  )
}
