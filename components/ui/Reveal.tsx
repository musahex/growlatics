'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { rise, riseGroup, viewportOnce, useReducedMotion } from '@/lib/motion'

type Tag = 'div' | 'ul' | 'ol' | 'li' | 'p' | 'section'

/**
 * R1 Rise once in view. `group` staggers direct <Reveal item> children (60ms).
 * `load` (page heroes, above the fold): the same rise as a CSS animation on first paint, so the
 * LCP text never waits for hydration; `delay` in ms staggers it.
 */
export default function Reveal({
  as = 'div',
  group = false,
  item = false,
  load = false,
  delay = 0,
  className,
  children,
}: {
  as?: Tag
  group?: boolean
  item?: boolean
  load?: boolean
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()
  if (load) {
    const T = as
    return (
      <T className={cn('rise-load', className)} style={delay ? { animationDelay: `${delay}ms` } : undefined}>
        {children}
      </T>
    )
  }
  const M = motion[as]
  if (item) return <M data-reveal variants={rise(reduced)} className={className}>{children}</M>
  return (
    <M
      data-reveal
      variants={group ? riseGroup(reduced) : rise(reduced)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </M>
  )
}
