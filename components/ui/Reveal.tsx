'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { rise, riseGroup, viewportOnce } from '@/lib/motion'

type Tag = 'div' | 'ul' | 'ol' | 'li' | 'p' | 'section'

/** R1 Rise once in view. `group` staggers direct <Reveal item> children (60ms). */
export default function Reveal({
  as = 'div',
  group = false,
  item = false,
  className,
  children,
}: {
  as?: Tag
  group?: boolean
  item?: boolean
  className?: string
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()
  const M = motion[as]
  if (item) return <M variants={rise(reduced)} className={className}>{children}</M>
  return (
    <M
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
