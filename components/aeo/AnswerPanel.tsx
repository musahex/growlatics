import { aeo } from '@/content'
import { cn } from '@/lib/utils'
import { glassClass } from '@/components/ui/Glass'
import { flat } from '@/components/patterns/glass'
import Reveal from '@/components/ui/Reveal'

/**
 * AEO hero figure: the page's thesis as a picture. A homeowner's question, then an AI answer that names your
 * business first. Illustrative (no real names): every string comes from content. Rises with CSS on first paint
 * like the H1 (Reveal load), so the hero never waits for hydration.
 */
export default function AnswerPanel({ className }: { className?: string }) {
  const a = aeo.answer
  return (
    <figure aria-label={`${a.status}: ${a.question} ${a.intro} ${a.picks.map((p) => p.name).join(', ')}`} className={glassClass('base', {}, cn('p-5 sm:p-6', flat, className))}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-data uppercase text-text-3">{a.status}</p>
        <span aria-hidden className="inline-flex items-center gap-2 font-mono text-data-s uppercase text-signal-ink">
          <span className="size-1.5 rounded-full bg-signal motion-safe:animate-pulse" />
          Example
        </span>
      </div>

      {/* the homeowner's question: a bubble on the right */}
      <Reveal load delay={120} className="mt-5 flex justify-end">
        <p className={cn('max-w-[85%] rounded-liquid-inner bg-text/[0.06] px-4 py-3 text-body text-text', flat)}>{a.question}</p>
      </Reveal>

      {/* the answer: your business first, lit */}
      <Reveal load delay={260} className="mt-4">
        <p className="text-body text-text-2">{a.intro}</p>
      </Reveal>
      <ol className="mt-3 grid gap-2">
        {a.picks.map((p, i) => {
          const top = i === 0
          return (
            <Reveal
              key={p.name}
              load
              delay={380 + i * 110}
              as="li"
              className={cn(
                'flex min-h-12 items-center gap-3 px-4 py-2',
                top ? glassClass('base', { signal: true, inner: true }, cn('text-text', flat)) : 'rounded-liquid-inner border border-transparent bg-text/[0.03] text-text-2',
              )}
            >
              <span aria-hidden className={cn('size-3 shrink-0 rounded-full border', top ? 'border-signal bg-signal' : 'border-line-3 bg-bg')} />
              <span className="font-mono text-data text-text-3">{String(i + 1).padStart(2, '0')}</span>
              <span className={cn('text-body', top && 'font-semibold')}>{p.name}</span>
              {p.tag && <span className="ml-auto rounded-full border border-signal-line bg-signal-soft px-2.5 py-0.5 font-mono text-data-s uppercase text-signal-ink">{p.tag}</span>}
            </Reveal>
          )
        })}
      </ol>
    </figure>
  )
}
