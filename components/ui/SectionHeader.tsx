import { cn } from '@/lib/utils'
import Reveal from './Reveal'

/** Eyebrow (label, <p>) + heading + optional body. Eyebrows are always followed by a heading. */
export default function SectionHeader({
  eyebrow,
  heading,
  body,
  as: H = 'h2',
  size = 'display-m',
  id,
  className,
}: {
  eyebrow?: string
  heading: string
  body?: string
  as?: 'h1' | 'h2'
  size?: 'display-xl' | 'display-l' | 'display-m'
  id?: string
  className?: string
}) {
  // The page H1 is above the fold: it rises with CSS on first paint instead of waiting for JS (LCP).
  const load = H === 'h1'
  return (
    <Reveal group={!load} load={load} className={cn('max-w-3xl', className)}>
      {eyebrow && (
        <Reveal item={!load} load={load} as="p" className="mb-4 text-label uppercase text-signal-ink">
          {eyebrow}
        </Reveal>
      )}
      <Reveal item={!load} load={load} delay={load ? 60 : 0}>
        <H id={id} className={cn('text-text', size === 'display-xl' ? 'text-display-xl' : size === 'display-l' ? 'text-display-l' : 'text-display-m')}>
          {heading}
        </H>
      </Reveal>
      {body && (
        <Reveal item={!load} load={load} delay={load ? 120 : 0} as="p" className="mt-6 max-w-measure text-body-l text-text-2">
          {body}
        </Reveal>
      )}
    </Reveal>
  )
}
