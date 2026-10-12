import { voiceAiTesting as v } from '@/content'
import { cn } from '@/lib/utils'
import { glassClass } from '@/components/ui/Glass'
import { flat } from './glass'

// Resting heights of the waveform bars (% of the track), the owner's figure; bars breathe under motion-safe.
const BARS = [25, 48, 75, 40, 88, 52, 94, 45, 70, 36, 78, 51, 85, 32, 68, 46, 91, 55, 74, 29]

const well = cn('rounded-liquid-inner border border-line bg-text/[0.04] p-5', flat)

/**
 * Voice AI testing hero figure: one flat glass shell (the page behind it is static, no backdrop blur) with two
 * inner-well readouts, a live waveform track and a footer row. Decorative: every value is read from content.
 */
export default function TestConsole({ className }: { className?: string }) {
  const c = v.console
  return (
    <figure aria-label={`${c.title}: ${c.cards.map((k) => `${k.label} ${k.value}`).join(', ')}`} className={glassClass('base', {}, cn('p-5 sm:p-6', flat, className))}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-data uppercase text-text-3">{c.title}</p>
        <p className="inline-flex items-center gap-2 rounded-full border border-signal-line bg-signal-soft px-3 py-1 font-mono text-data-s uppercase text-signal-ink">
          <span aria-hidden className="size-1.5 rounded-full bg-signal motion-safe:animate-pulse" />
          {c.status}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {c.cards.map((k) => (
          <div key={k.label} className={well}>
            <p className="font-mono text-data-s uppercase text-text-3">{k.label}</p>
            <p className="mt-2 text-display-m text-text">{k.value}</p>
            <p className="mt-1 text-body-s text-text-2">{k.sub}</p>
          </div>
        ))}

        <div className={cn(well, 'sm:col-span-2')}>
          <p className="font-mono text-data-s uppercase text-text-3">{c.live.label}</p>
          <div aria-hidden className="my-5 flex h-20 items-end justify-between gap-1">
            {BARS.map((h, i) => (
              <span
                key={i}
                className="w-full max-w-[6px] origin-bottom rounded-full bg-signal/80 motion-safe:animate-wave"
                style={{ height: `${h}%`, animationDelay: `${(i % 7) * 110}ms` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-line pt-4 font-mono text-data text-text-3">
            <span>{c.live.left}</span>
            <span>{c.live.right}</span>
          </div>
        </div>
      </div>
    </figure>
  )
}
