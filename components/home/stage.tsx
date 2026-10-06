'use client'

// Client glue between the home acts and the network system (DIRECTION §6.7, §7).
// lg and up: one fixed stage behind acts 1-9; each act keeps a tier-0 SVG that hides while the stage is live.
// Below lg: no fixed canvas; each act owns an inline, framed figure in normal flow (phone/tablet interpretation).
import { useEffect, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { home, systems, type SystemId } from '@/content'
import { cn } from '@/lib/utils'
import { SystemStage } from '@/components/system/stage/SystemStage'
import { NetworkSVG } from '@/components/system/render-svg/NetworkSVG'
import { SpatialCallouts, SpatialLabel } from '@/components/system/overlay/SpatialLabel'
import { glassClass } from '@/components/ui/Glass'
import { flatBelowLg } from '@/components/patterns/glass'
import { setFocus, sys } from '@/components/system/runtime'

const WIDE = '(min-width: 1024px)'
const TABLET = '(min-width: 768px)'

function useMedia(q: string) {
  return useSyncExternalStore(
    (fn) => {
      const m = matchMedia(q)
      m.addEventListener('change', fn)
      return () => m.removeEventListener('change', fn)
    },
    () => matchMedia(q).matches,
    () => false,
  )
}

// Act 2 callouts, numbered like the leak list in the DOM; each sits on the handoff it breaks.
const LEAK_EDGES = [
  'acquire.lead-generation~sell.inbound',
  'acquire.funnels~sell.lead-qualification',
  'build.automation~sell.sales-operations',
  'sell.appointment-setting~operate.team-operations',
  'build.websites~acquire.funnels',
]
const LEAK_CALLOUTS = home.problem.leaks.map((l, i) => ({ edge: LEAK_EDGES[i], text: `${String(i + 1).padStart(2, '0')} ${l.title}` }))

/** The one fixed home canvas (lg+). Tier 0 renders nothing here: the acts' own SVGs carry the story. */
export function HomeStage() {
  const wide = useMedia(WIDE)
  if (!wide) return null
  return (
    <SystemStage mode="fixed" intro>
      <SpatialCallouts items={LEAK_CALLOUTS} act={2} />
    </SystemStage>
  )
}

const subscribeNothing = () => () => {}
/** false in the static HTML and during hydration, true afterwards. */
const useHydrated = () => useSyncExternalStore(subscribeNothing, () => true, () => false)

/**
 * An act's network figure. lg+: the full-viewport composition behind the act's text (absolute; hidden
 * while the fixed stage draws live). Below lg: a framed inline figure. The static HTML carries both and
 * CSS shows the right one, so desktop does not shift when hydration swaps the phone figure out (hero CLS)
 * and no-JS desktop gets the desktop composition.
 */
export function ActFigure({ act, stage, title, className, leaks }: { act: number; stage?: number; title?: string; className?: string; /** Act 2: number the first n broken handoffs to match the leak list. */ leaks?: number }) {
  const hydrated = useHydrated()
  const wide = useMedia(WIDE)
  const tablet = useMedia(TABLET)
  const desktop = (
    <NetworkSVG
      act={act}
      stage={stage}
      hideWhenLive
      title={title}
      className={cn('pointer-events-none absolute inset-0 h-full w-full', !hydrated && 'hidden lg:block')}
    />
  )
  if (hydrated && wide) return desktop
  const inline = (
    <SystemStage
      act={act}
      stage={stage}
      frame
      portrait={!tablet}
      intro={act === 1}
      title={title}
      className={cn('w-full aspect-[4/5] md:aspect-[16/10]', !hydrated && 'lg:hidden', className)}
    >
      {LEAK_EDGES.slice(0, leaks ?? 0).map((edge, i) => (
        <SpatialLabel key={edge} edge={edge} dx={-8} dy={-6}>
          {String(i + 1).padStart(2, '0')}
        </SpatialLabel>
      ))}
    </SystemStage>
  )
  if (hydrated) return inline
  return (
    <>
      {desktop}
      {inline}
    </>
  )
}

/**
 * Lights one system while its act sits under the middle of the viewport (the capability inspector's
 * open item). Observes the act section itself, so it works on every tier: the store's act index only
 * moves while the live fixed stage runs.
 */
export function FocusInAct({ system, act }: { system: SystemId; act: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current?.closest(`[data-act="${act}"]`)
    if (!el) return
    let on = false
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === on) return
      on = e.isIntersecting
      if (on) setFocus(system)
      else if (sys.focus === system) setFocus(null)
    }, { rootMargin: '-50% 0px -50% 0px' })
    io.observe(el)
    return () => {
      io.disconnect()
      // An exiting inspector panel unmounts after the next one mounted: never clear its focus.
      if (on && sys.focus === system) setFocus(null)
    }
  }, [act, system])
  return <span ref={ref} hidden />
}

/** Act 1 System index: four rows linking to the service pages; hover/focus lights that cluster (200ms grace). */
export function SystemIndex() {
  const timer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => () => clearTimeout(timer.current), [])
  const on = (id: SystemId) => {
    clearTimeout(timer.current)
    setFocus(id)
  }
  const off = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setFocus(null), 200)
  }
  return (
    <nav aria-labelledby="system-index-h" data-cursor="panel" className={glassClass('elevated', {}, cn('p-2 md:p-3', flatBelowLg))}>
      <p id="system-index-h" className="mb-2 px-3 pt-2 font-mono text-data uppercase text-text-3 md:mb-3">
        {home.hero.panelLabel}
      </p>
      <ul className="grid divide-y divide-line md:grid-cols-4 md:divide-x md:divide-y-0">
        {systems.map((s, i) => (
          <li key={s.id} className="py-1 md:px-1 md:py-0">
            <Link
              href={s.href}
              onMouseEnter={() => on(s.id)}
              onMouseLeave={off}
              onFocus={() => on(s.id)}
              onBlur={off}
              className="group relative flex min-h-14 gap-3 rounded-liquid-inner px-3 py-3 transition-colors duration-fast ease-out hover:bg-signal-soft focus-visible:bg-signal-soft md:flex-col md:gap-1"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-3 top-0 h-px origin-left bg-signal transition-transform duration-fast ease-out',
                  s.emphasis ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100',
                )}
              />
              <span className={cn('font-mono text-data', s.emphasis ? 'text-signal-ink' : 'text-text-3')}>{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1">
                <span className={cn('block text-text', s.emphasis ? 'text-body font-semibold' : 'text-body-s font-semibold')}>
                  {s.verb}
                  <span className="font-normal text-text-3"> · {s.service}</span>
                </span>
                <span className="mt-1 block text-body-s text-text-3">{s.short}</span>
              </span>
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0 text-text-4 transition-colors duration-fast group-hover:text-signal md:absolute md:right-3 md:top-3" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
