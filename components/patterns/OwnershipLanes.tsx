import { cn } from '@/lib/utils'
import Reveal from '@/components/ui/Reveal'

export interface Lane {
  label: string
  /** Indices of the stages this lane owns (lit). */
  owns: number[]
  /** Runs under every stage (dashed full-width track), e.g. Build. */
  base?: boolean
}

/**
 * Which system owns which journey stage: one row per system, one column per stage. The owned span is a
 * lit hairline with signal nodes; the rest of the track stays dormant. Drawn from content/journey.ts.
 */
export default function OwnershipLanes({ stages, lanes, className }: { stages: { index: string; title: string; body?: string }[]; lanes: Lane[]; className?: string }) {
  const cols = { gridTemplateColumns: `minmax(4.5rem, 9rem) repeat(${stages.length}, minmax(0, 1fr))` }
  return (
    <Reveal className={cn('border-b border-line', className)}>
      <div className="grid gap-x-2 pb-6 sm:gap-x-6" style={cols}>
        <span />
        {stages.map((s) => (
          <div key={s.index}>
            <p className="font-mono text-data text-text-3">{s.index}</p>
            <h3 className="mt-1 text-body-s font-semibold text-text sm:text-title">{s.title}</h3>
            {s.body && <p className="mt-2 hidden max-w-measure text-body-s text-text-2 lg:block">{s.body}</p>}
          </div>
        ))}
      </div>
      {lanes.map((lane) => {
        const first = Math.min(...lane.owns)
        const last = Math.max(...lane.owns)
        return (
          <div key={lane.label} className="grid items-center gap-x-2 border-t border-line py-5 sm:gap-x-6" style={cols}>
            <p className="font-mono text-data uppercase text-text-2">{lane.label}</p>
            <div className="relative col-span-full col-start-2 h-3" style={{ gridColumnEnd: stages.length + 2 }}>
              <span aria-hidden className={cn('absolute inset-x-0 top-1/2 border-t', lane.base ? 'border-dashed border-line-3' : 'border-line-2')} />
              <span
                aria-hidden
                className="absolute top-1/2 h-px -translate-y-px bg-signal"
                style={{ left: `${(first / stages.length) * 100}%`, width: `${((last - first + 1) / stages.length) * 100}%` }}
              />
              {lane.owns.map((i) => (
                <span key={i} aria-hidden className="absolute top-0 size-3 rounded-full bg-signal" style={{ left: `${(i / stages.length) * 100}%` }} />
              ))}
              <span className="sr-only">
                {lane.label}: {lane.owns.map((i) => stages[i].title).join(', ')}
              </span>
            </div>
          </div>
        )
      })}
    </Reveal>
  )
}
