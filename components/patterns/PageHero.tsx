import type { Hero } from '@/content'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

/** Internal page hero: eyebrow, H1 (display-l), lead, CTAs, optional figure below. */
export default function PageHero({ hero, children }: { hero: Hero; children?: React.ReactNode }) {
  return (
    <Section as="header" space="none" className="pb-section-tight pt-32 sm:pt-40">
      <SectionHeader as="h1" size="display-l" eyebrow={hero.eyebrow} heading={hero.heading} body={hero.lead} />
      {(hero.primary || hero.secondary) && (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {hero.primary && (
            <Button href={hero.primary.href} size="lg" arrow>
              {hero.primary.label}
            </Button>
          )}
          {hero.secondary && (
            <Button href={hero.secondary.href} variant="secondary" size="lg">
              {hero.secondary.label}
            </Button>
          )}
        </div>
      )}
      {children && <div className="mt-16">{children}</div>}
    </Section>
  )
}
