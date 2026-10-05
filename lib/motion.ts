// Motion constants (docs/v2/DIRECTION.md §4). Mirrored as CSS variables in app/globals.css.
import type { Variants, Transition } from 'framer-motion'

export const duration = {
  instant: 0.12,
  fast: 0.2,
  base: 0.32,
  slow: 0.56,
  slower: 0.88,
  cinematic: 1.4,
} as const

type Bezier = [number, number, number, number]
export const ease: { out: Bezier; inOut: Bezier; in: Bezier; linear: 'linear' } = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  in: [0.7, 0, 0.84, 0],
  linear: 'linear',
}

// Exits run at 60% of the matching entrance duration.
export const exitDuration = (d: number) => d * 0.6

// Frame-rate-independent damping: v += (target - v) * (1 - exp(-k * dt)), dt in seconds.
export const damp = (v: number, target: number, k: number, dt: number) => v + (target - v) * (1 - Math.exp(-k * dt))
export const dampK = { cursorRing: 14, cursorDot: 40, pointer: 6, camera: 3.5, theme: 5 } as const

// R1–R4 fire once when 20% of the element is in view; nothing re-animates on scroll-back.
export const viewportOnce = { once: true, amount: 0.2 } as const

export const stagger = { rise: 0.06, trace: 0.12, bars: 0.08, activate: 0.09 } as const

const t = (d: number, e: Bezier | 'linear' = ease.out): Transition => ({ duration: d, ease: e })

/** R1 Rise, with its reduced-motion equivalent (fade only, `fast`). */
export function rise(reduced: boolean | null): Variants {
  return reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: t(duration.fast) } }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: t(duration.slow) } }
}

/** Parent that staggers R1 children. */
export function riseGroup(reduced: boolean | null, gap: number = stagger.rise): Variants {
  return { hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : gap } } }
}

/** R2 Trace: animate `pathLength` 0→1. Reduced motion draws at once. */
export function trace(reduced: boolean | null, i = 0): Variants {
  return reduced
    ? { hidden: { pathLength: 1 }, show: { pathLength: 1 } }
    : { hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { ...t(duration.slower), delay: i * stagger.trace } } }
}

/** R3 Bars: scaleY 0→1 from the bottom. Reduced motion shows bars at full height. */
export function bars(reduced: boolean | null, i = 0, d: number = duration.slow): Variants {
  return reduced
    ? { hidden: { scaleY: 1 }, show: { scaleY: 1 } }
    : { hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { ...t(d), delay: i * stagger.bars } } }
}

/** R6 Swap: exit up 8px (`ease-in`), enter with R1. Reduced motion cross-fades over `fast`. */
export function swap(reduced: boolean | null): Variants {
  return reduced
    ? { initial: { opacity: 0 }, enter: { opacity: 1, transition: t(duration.fast) }, exit: { opacity: 0, transition: t(duration.fast) } }
    : {
        initial: { opacity: 0, y: 16 },
        enter: { opacity: 1, y: 0, transition: t(duration.slow) },
        exit: { opacity: 0, y: -8, transition: t(exitDuration(duration.base), ease.in) },
      }
}
