import type { Hero } from '@/content'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import SectionHeader from '@/components/ui/SectionHeader'

/**
 * Internal page hero: eyebrow, H1 (display-l), lead, CTAs, optional figure below.
 * `stage` (lg+): a network figure behind the hero. The act layouts keep a left text-safe zone,
 * so the text holds the left column and the network fills the right.
 */
export default function PageHero({ hero, stage, children }: { hero: Hero; stage?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Section as="header" space="none" className="overflow-hidden pb-section-tight pt-32 sm:pt-40">
      <div className="relative">
      {stage && <div className="pointer-events-none absolute inset-x-0 -inset-y-16 hidden lg:block">{stage}</div>}
      <div className={stage ? 'relative lg:flex lg:min-h-[30rem] lg:max-w-[52%] lg:flex-col lg:justify-center' : undefined}>
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
      </div>
      </div>
      {children && <div className="relative mt-16">{children}</div>}
    </Section>
  )
}
