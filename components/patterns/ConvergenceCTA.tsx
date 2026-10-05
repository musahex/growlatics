import { site } from '@/content'
import Mark from '@/components/brand/Mark'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import Reveal from '@/components/ui/Reveal'

/** P7 Convergence CTA: mark + headline + primary CTA on data-surface="dark". Pages may override only the heading. */
export default function ConvergenceCTA({ heading, id = 'book-cta' }: { heading?: string | null; id?: string }) {
  const c = site.finalCta
  return (
    <Section id={id} tone="dark" rule aria-labelledby={`${id}-h`}>
      <Reveal group className="flex flex-col items-center text-center">
        <Mark size={88} state="converge" />
        <Reveal item>
          <h2 id={`${id}-h`} className="mt-10 max-w-3xl text-display-l text-text">
            {heading ?? c.heading}
          </h2>
        </Reveal>
        <Reveal item as="p" className="mt-6 max-w-measure text-body-l text-text-2">
          {c.body}
        </Reveal>
        <Reveal item className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button href={c.primary.href} size="lg" arrow>
            {c.primary.label}
          </Button>
          <Button href={c.secondary.href} variant="secondary" size="lg">
            {c.secondary.label}
          </Button>
        </Reveal>
        <Reveal item as="p" className="mt-6 text-body-s text-text-3">
          {c.note}
        </Reveal>
      </Reveal>
    </Section>
  )
}
