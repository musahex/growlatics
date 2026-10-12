'use client'

import { useRef } from 'react'
import { voiceAiTesting as v } from '@/content'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/motion'
import { useSystem } from '@/components/system/runtime'
import { glassClass } from '@/components/ui/Glass'
import { flat } from './glass'

// Resting heights of the waveform bars (% of the track), the owner's figure; bars breathe under motion-safe
// and, on fine pointers, swell toward the pointer (the same "near the pointer" response as the home network).
const BARS = [25, 48, 75, 40, 88, 52, 94, 45, 70, 36, 78, 51, 85, 32, 68, 46, 91, 55, 74, 29]

const well = cn('rounded-liquid-inner border border-line bg-text/[0.04] p-5', flat)

/**
 * Voice AI testing hero figure: one flat glass shell (the page behind it is static, no backdrop blur) with the
 * four proof chips, two inner-well readouts, a live waveform track and a footer row. Decorative: every value is
 * read from content.
 */
export default function TestConsole({ className }: { className?: string }) {
  const c = v.console
  const bars = useRef<(HTMLSpanElement | null)[]>([])
  const fine = useSystem('fine')
  const reduced = useReducedMotion()
  const live = fine && !reduced

  const swell = (x: number | null) => {
    const n = BARS.length
    bars.current.forEach((el, i) => {
      if (!el) return
      const d = x === null ? Infinity : Math.abs(i - x * (n - 1))
      const boost = 1 + 0.7 * Math.max(0, 1 - d / 2.5)
      el.style.transform = `scaleY(${boost.toFixed(3)})`
    })
  }

  return (
    <figure
      aria-label={`${c.title}: ${c.cards.map((k) => `${k.label} ${k.value}`).join(', ')}`}
      data-cursor="panel"
      className={glassClass('base', {}, cn('p-5 sm:p-6', flat, className))}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-data uppercase text-text-3">{c.title}</p>
        <p className="inline-flex items-center gap-2 rounded-full border border-signal-line bg-signal-soft px-3 py-1 font-mono text-data-s uppercase text-signal-ink">
          <span aria-hidden className="size-1.5 rounded-full bg-signal motion-safe:animate-pulse" />
          {c.status}
        </p>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {v.proof.map((p) => (
          <li key={p} className="inline-flex items-center gap-2 rounded-sm border border-line px-2 py-1 font-mono text-data text-text-2">
            <span aria-hidden className="size-1.5 rounded-full bg-signal" />
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {c.cards.map((k) => (
          <div key={k.label} className={well}>
            <p className="font-mono text-data-s uppercase text-text-3">{k.label}</p>
            <p className="mt-2 text-display-m text-text">{k.value}</p>
            <p className="mt-1 text-body-s text-text-2">{k.sub}</p>
          </div>
        ))}

        <div className={cn(well, 'sm:col-span-2')}>
          <p className="font-mono text-data-s uppercase text-text-3">{c.live.label}</p>
          <div
            aria-hidden
            className="my-5 flex h-20 items-end justify-between gap-1"
            onPointerMove={live ? (e) => { const r = e.currentTarget.getBoundingClientRect(); swell((e.clientX - r.left) / r.width) } : undefined}
            onPointerLeave={live ? () => swell(null) : undefined}
          >
            {BARS.map((h, i) => (
              <span
                key={i}
                ref={(el) => { bars.current[i] = el }}
                className="flex w-full max-w-[6px] origin-bottom items-end transition-transform duration-fast ease-out"
                style={{ height: `${h}%` }}
              >
                <span className="h-full w-full origin-bottom rounded-full bg-signal/80 motion-safe:animate-wave" style={{ animationDelay: `${(i % 7) * 110}ms` }} />
              </span>
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
