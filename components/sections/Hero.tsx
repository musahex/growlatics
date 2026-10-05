'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { home, systems } from '@/content'
import { rise, riseGroup } from '@/lib/motion'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import HeroInteractiveField from '@/components/sections/HeroInteractiveField'

// Act 1 (interim): copy from content, tokens only, no stats. HOME rebuilds it on the system stage.

function SystemIndex() {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div className="glass rounded-lg p-5 shadow-2 sm:p-6" data-cursor="panel">
      <p className="mb-4 font-mono text-data uppercase text-text-3">{home.hero.panelLabel}</p>
      <ul className="grid gap-1">
        {systems.map((s, i) => {
          const on = active === s.id
          return (
            <li key={s.id}>
              <Link
                href={s.href}
                onMouseEnter={() => setActive(s.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.id)}
                onBlur={() => setActive(null)}
                className={cn(
                  'group relative flex min-h-14 items-start gap-4 rounded-md px-4 py-3 transition-colors duration-fast ease-out',
                  on ? 'bg-signal-soft' : 'hover:bg-signal-soft',
                )}
              >
                <span aria-hidden className={cn('absolute inset-y-2 left-0 w-0.5 rounded-xs bg-signal transition-transform duration-fast ease-out', on ? 'scale-y-100' : 'scale-y-0')} />
                <span className="mt-0.5 font-mono text-data text-signal-ink">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1">
                  <span className={cn('block text-text', s.emphasis ? 'text-body font-semibold' : 'text-body-s font-semibold')}>
                    {s.verb} · {s.service}
                  </span>
                  <span className="mt-1 block text-body-s text-text-3">{s.short}</span>
                </span>
                <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden className={cn('mt-0.5 shrink-0 transition-colors duration-fast', on ? 'text-signal' : 'text-text-4')} />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function Hero() {
  const reduced = useReducedMotion()
  const h = home.hero
  return (
    <section id="hero" className="relative w-full overflow-hidden border-b border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dot-grid bg-grid" />
      <HeroInteractiveField />

      <div className="relative z-content mx-auto grid w-full max-w-container items-center gap-12 px-gutter pb-section-tight pt-32 xl:grid-cols-[3fr_2fr] xl:gap-16 xl:pt-40">
        <motion.div variants={riseGroup(reduced)} initial="hidden" animate="show">
          <motion.p variants={rise(reduced)} className="mb-5 text-label uppercase text-signal-ink">
            {h.eyebrow}
          </motion.p>
          <motion.h1 variants={rise(reduced)} className="max-w-headline text-display-xl text-text">
            {h.heading}
          </motion.h1>
          <motion.p variants={rise(reduced)} className="mt-6 max-w-measure text-body-l text-text-2">
            {h.lead}
          </motion.p>
          <motion.div variants={rise(reduced)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            {h.primary && (
              <Button href={h.primary.href} size="lg" arrow>
                {h.primary.label}
              </Button>
            )}
            {h.secondary && (
              <Button href={h.secondary.href} variant="secondary" size="lg">
                {h.secondary.label}
              </Button>
            )}
          </motion.div>
        </motion.div>

        <motion.aside variants={rise(reduced)} initial="hidden" animate="show" aria-label={h.panelLabel}>
          <SystemIndex />
        </motion.aside>
      </div>
    </section>
  )
}
