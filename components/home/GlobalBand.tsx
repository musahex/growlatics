// Act 7: a 24-hour hairline band, ticks every 3h, the markets at their UTC offsets (DIRECTION §7 act 7).
// DOM, not canvas, so it lines up with the copy on every tier and needs no JS. No map, no pins, no hours claim.
import { homeUi, site } from '@/content'
import { cn } from '@/lib/utils'

const at = (offset: number) => `${((offset + 12) / 24) * 100}%`
const TICKS = [-12, -9, -6, -3, 0, 3, 6, 9, 12]
const tick = (o: number) => (o === 0 ? homeUi.band.axis : `${o > 0 ? '+' : '−'}${Math.abs(o)}`)

export default function GlobalBand({ className }: { className?: string }) {
  const markets = site.markets.filter((m) => m.code in homeUi.band.offsets).map((m) => ({ ...m, x: homeUi.band.offsets[m.code] }))
  const lo = Math.min(...markets.map((m) => m.x)), hi = Math.max(...markets.map((m) => m.x))
  return (
    <figure aria-label={homeUi.figures.global} className={cn('relative h-28 w-full', className)}>
      <div aria-hidden className="absolute inset-x-4 top-14 sm:inset-x-6">
        <span className="absolute inset-x-0 top-0 h-px bg-line-3" />
        {/* The span the markets share, lit as one connected path. */}
        <span className="absolute top-0 h-0.5 -translate-y-1/4 bg-signal/60" style={{ left: at(lo), right: `calc(100% - ${at(hi)})` }} />
        {TICKS.map((o) => (
          <span key={o} className="absolute top-0 -translate-x-1/2" style={{ left: at(o) }}>
            <span className="mx-auto block h-2 w-px -translate-y-1/2 bg-line-3" />
            <span className="mt-2 block font-mono text-data-s text-text-3">{tick(o)}</span>
          </span>
        ))}
      </div>
      <ul className="absolute inset-x-4 top-14 sm:inset-x-6">
        {markets.map((m) => (
          <li key={m.code} className="absolute top-0 -translate-x-1/2" style={{ left: at(m.x) }}>
            <span aria-hidden className="absolute left-1/2 top-0 hidden size-8 sm:block -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-soft" />
            <span aria-hidden className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-data-s uppercase text-text-2">
              <span className="hidden sm:inline">{m.label}</span>
              <span className="sm:hidden">{m.code}</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
