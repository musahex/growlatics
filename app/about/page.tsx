import { about, site, stageTitles, systemById } from '@/content'
import { breadcrumbJsonLd, ldJson, pageMetadata } from '@/lib/seo'
import PageHero from '@/components/patterns/PageHero'
import PageStage from '@/components/pages/PageStage'
import HandoffStrip from '@/components/patterns/HandoffStrip'
import Ledger from '@/components/patterns/Ledger'
import ConvergenceCTA from '@/components/patterns/ConvergenceCTA'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

export const metadata = pageMetadata(about.route, about.seo)

const node = (id: 'acquire' | 'sell' | 'operate' | 'build') => ({ label: systemById[id].verb, sub: systemById[id].service, href: systemById[id].href })

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(breadcrumbJsonLd(about.route)) }} />
      <PageHero hero={about.hero} stage={<PageStage act={3} title={stageTitles.about} />}>
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
                  <Button href={l.href} variant="text" arrow>
            {l.label}
          </Button>
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
