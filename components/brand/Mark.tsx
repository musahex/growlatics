'use client'

import { motion } from 'framer-motion'
import { bars, duration, useReducedMotion, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/utils'

// Canonical five-bar mark (docs/v2/DIRECTION.md §5): heights 32/52/70/86/100 % of 70u,
// bar 10u, gap 4u, radius 3u on all corners, viewBox 66×70. Same geometry as app/icon.svg.
const PCT = [0.32, 0.52, 0.7, 0.86, 1]

type MarkState = 'static' | 'rise' | 'progress' | 'converge'

interface MarkProps {
  /** Rendered height in px. */
  size?: number
  /** static · rise (R3 on mount) · converge (R3 when in view, CTA) · progress (bars 1..value lit). */
  state?: MarkState
  /** 0–5, for `progress`. */
  value?: number
  /** Accessible name; omitted = decorative. */
  title?: string
  className?: string
}

/** At ≤24px, snap bar width and gap to whole pixels (§5). */
function geometry(size: number) {
  if (size > 24) {
    return { w: 10, g: 4, h: 70, heights: PCT.map((p) => p * 70), rx: 3 }
  }
  const [w, g] = size <= 17 ? [2, 1] : size <= 21 ? [3, 1] : [3, 2]
  return { w, g, h: size, heights: PCT.map((p) => Math.round(p * size)), rx: Math.max(0.5, (3 / 70) * size) }
}

export default function Mark({ size = 20, state = 'static', value = 0, title, className }: MarkProps) {
  const reduced = useReducedMotion()
  const { w, g, h, heights, rx } = geometry(size)
  const vbW = 5 * w + 4 * g
  const animated = state === 'rise' || state === 'converge'
  const d = state === 'converge' ? duration.slower : duration.slow

  return (
    <svg
      viewBox={`0 0 ${vbW} ${h}`}
      height={size}
      width={(size * vbW) / h}
      className={cn('shrink-0 overflow-visible', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...(state === 'progress' && { 'data-value': value })}
    >
      {heights.map((bh, i) => {
        const lit = state !== 'progress' || i < value
        const common = {
          x: i * (w + g),
          y: h - bh,
          width: w,
          height: bh,
          rx,
          className: cn('transition-colors duration-base ease-out', lit ? 'fill-signal' : 'fill-line-3'),
        }
        if (!animated) return <rect key={i} {...common} />
        return (
          <motion.rect
            key={i}
            {...common}
            style={{ originY: 1, transformBox: 'fill-box' }}
            variants={bars(reduced, i, d)}
            initial="hidden"
            {...(state === 'rise' ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}
          />
        )
      })}
    </svg>
  )
}
