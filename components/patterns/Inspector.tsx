'use client'

import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { swap, useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface InspectorItem {
  id: string
  label: string
  meta?: string
  content: React.ReactNode
}

/**
 * P3 Inspector: list beside a detail panel (md+); accordion on phones. One markup for both:
 * triggers and panels interleave in DOM order, CSS grid places panels in the right column from md.
 * Arrow keys move between triggers; one item is always open.
 */
export default function Inspector({ items, defaultId, label, panelClassName }: { items: InspectorItem[]; defaultId?: string; label: string; /** md+ detail panel surface (e.g. glass). */ panelClassName?: string }) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const reduced = useReducedMotion()
  const uid = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : null
    if (next === null) return
    e.preventDefault()
    const j = (next + items.length) % items.length
    refs.current[j]?.focus()
    setActive(items[j].id)
  }

  return (
    <div role="group" aria-label={label} style={{ ['--rows' as string]: items.length }} className="grid gap-x-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {items.map((item, i) => {
        const open = item.id === active
        return (
          <div key={item.id} className="contents">
            <button
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              id={`${uid}-t-${item.id}`}
              aria-expanded={open}
              aria-controls={`${uid}-p-${item.id}`}
              onClick={() => setActive(item.id)}
              onKeyDown={(e) => onKey(e, i)}
              data-cursor="panel"
              className={cn(
                'group relative flex min-h-14 w-full items-center gap-4 border-t border-line py-4 pl-5 text-left md:col-start-1',
                'transition-colors duration-fast ease-out hover:bg-signal-soft',
                open && 'bg-signal-soft',
              )}
            >
              <span aria-hidden className={cn('absolute inset-y-2 left-0 w-0.5 origin-center rounded-xs bg-signal transition-transform duration-fast ease-out', open ? 'scale-y-100' : 'scale-y-0')} />
              {item.meta && <span className={cn('font-mono text-data', open ? 'text-signal-ink' : 'text-text-3')}>{item.meta}</span>}
              <span className={cn('text-body-l font-semibold', open ? 'text-text' : 'text-text-2')}>{item.label}</span>
            </button>
            <div
              id={`${uid}-p-${item.id}`}
              role="region"
              aria-labelledby={`${uid}-t-${item.id}`}
              hidden={!open}
              className={cn('py-6 md:col-start-2 md:py-0 md:[grid-row:1/span_var(--rows)] md:self-start', panelClassName)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open && (
                  <motion.div key={item.id} variants={swap(reduced)} initial="initial" animate="enter" exit="exit">
                    {item.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )
      })}
    </div>
  )
}
