import { about, site, stageTitles, systemById } from '@/content'
import { breadcrumbJsonLd, ldJson, pageMetadata } from '@/lib/seo'
import PageHero from '@/components/patterns/PageHero'
import PageStage from '@/components/pages/PageStage'
import HandoffStrip from '@/components/patterns/HandoffStrip'
import Ledger from '@/components/patterns/Ledger'
import Statement from '@/components/patterns/Statement'
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
      <PageHero hero={about.hero}>
          <HandoffStrip upstream={[node('acquire'), node('sell')]} current={{ label: site.name, sub: site.tagline }} downstream={[node('operate'), node('build')]} />
      </PageHero>
      {about.sections.map((s) => {
        // "Systems beat services." is the thesis: a P4 statement, the other beliefs stay a ledger (review: About).
        const [thesis, ...beliefs] = s.items ?? []
        const short = !s.items && !s.links
        return (
          <Section key={s.heading} id={s.id} rule space={short ? 'tight' : 'standard'} aria-labelledby={`${s.id}-h`}>
            <SectionHeader id={`${s.id}-h`} heading={s.heading} body={s.body} />
            {thesis && (
              <div className="mt-12">
                <Statement text={`${thesis.title} ${thesis.body}`} />
                <Ledger className="mt-12" rows={beliefs.map((i) => ({ term: i.title, description: i.body }))} />
              </div>
            )}
            {s.id === 'international' && (
              // The act-7 market band (US, UK, Pakistan on a 24-hour ribbon): About's one network figure.
              <div className="mt-12 hidden aspect-[16/5] w-full md:block">
                <PageStage act={7} title={stageTitles.international} />
              </div>
            )}
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
        )
      })}
      <ConvergenceCTA heading={about.finalCtaHeading} />
    </>
  )
}
