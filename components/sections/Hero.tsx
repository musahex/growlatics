'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { HERO_CONTENT } from '@/lib/content'
import { cn } from '@/lib/utils'
import HeroInteractiveField from '@/components/sections/HeroInteractiveField'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

const CAPABILITIES = [
  {
    n: '01',
    label: 'Performance Marketing',
    hint: 'Google Ads, Meta Ads, PPC, SEO, and funnel optimisation',
  },
  {
    n: '02',
    label: 'Sales & BPO Teams',
    hint: 'Inbound, outbound, tele-sales, and appointment setting',
  },
  {
    n: '03',
    label: 'Customer Support',
    hint: 'Chat, call support, retention, and support operations',
  },
  {
    n: '04',
    label: 'Technology & Development',
    hint: 'Websites, apps, automation, and scalable digital systems',
  },
]

const STATS = [
  { value: '150%', label: 'ROI uplift' },
  { value: '10+', label: 'Industries' },
  { value: '24/7', label: 'Ops coverage' },
]

const HERO_BARS = [32, 50, 68, 84, 100]

function CapabilitiesPanel({ reduceMotion }: { reduceMotion: boolean }) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <motion.div
      className={cn(
        'rounded-xl border p-5 sm:p-6',
        'backdrop-blur-xl',
        // light mode
        'border-[rgba(10,9,8,0.1)] bg-white/90',
        'shadow-[0_8px_48px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(10,9,8,0.04)]',
        // dark mode
        'dark:border-white/[0.08] dark:bg-[#0A0908]/90',
        'dark:shadow-[0_8px_48px_rgba(0,0,0,0.55),0_1px_2px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)]',
      )}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3 px-0.5">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0C0B0A] dark:text-white">
          Core capabilities
        </p>
        <span className="rounded-full bg-[rgba(10,9,8,0.06)] px-2.5 py-1 text-[10px] font-semibold text-[#5A5550] dark:bg-white/[0.08] dark:text-[#C0B8B0]">
          04 systems
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-2.5 sm:gap-3">
        {CAPABILITIES.map(({ n, label, hint }) => {
          const isActive = active === n

          return (
            <li key={n}>
              <motion.a
                href="#services"
                onClick={() => setActive(n)}
                onMouseEnter={() => setActive(n)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(n)}
                onBlur={() => setActive(null)}
                className={cn(
                  'group relative flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 sm:px-5 sm:py-4',
                  'transition-[border-color,background-color,box-shadow] duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/45',
                  isActive
                    ? 'border-brand-orange/30 bg-brand-orange/[0.07] shadow-[0_2px_14px_rgba(210,64,26,0.12)]'
                    : [
                        // light mode inactive
                        'border-[rgba(10,9,8,0.08)] bg-[rgba(10,9,8,0.02)]',
                        'hover:border-[rgba(10,9,8,0.14)] hover:bg-[rgba(10,9,8,0.05)]',
                        'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]',
                        // dark mode inactive
                        'dark:border-white/[0.06] dark:bg-white/[0.03]',
                        'dark:hover:border-white/[0.12] dark:hover:bg-white/[0.06]',
                        'dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]',
                      ].join(' ')
                )}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-brand-orange transition-transform duration-200',
                    isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                  )}
                />

                <span className="mt-0.5 shrink-0 text-[11px] font-extrabold tabular-nums text-brand-orange">
                  {n}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-snug text-[#0C0B0A] dark:text-white sm:text-[15px]">
                    {label}
                  </span>
                  <span
                    className={cn(
                      'mt-1 block text-xs leading-relaxed transition-colors duration-200 sm:text-[13px]',
                      isActive
                        ? 'text-[#5A5550] dark:text-[#B0A8A0]'
                        : 'text-[#8A8480] group-hover:text-[#5A5550] dark:text-[#6A6460] dark:group-hover:text-[#8A8280]'
                    )}
                  >
                    {hint}
                  </span>
                </span>

                <ArrowUpRight
                  size={14}
                  aria-hidden
                  className={cn(
                    'mt-0.5 shrink-0 transition-all duration-200',
                    isActive
                      ? 'text-brand-orange'
                      : 'text-[#B0AAA5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-orange dark:text-[#3A3530]'
                  )}
                />
              </motion.a>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 px-0.5 text-[13px] font-medium leading-relaxed text-[#8A8480] dark:text-[#6A6460]">
        One connected stack across marketing, sales, support, and technology.
      </p>
    </motion.div>
  )
}

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const initial = reduceMotion ? 'show' : 'hidden'

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden border-b border-[rgba(10,9,8,0.06)] bg-transparent dark:border-white/[0.06]"
    >
      {/* Dot grid — color adapts via CSS variable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(var(--dot-color) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Interactive signal field — sits above dot grid, below content */}
      <HeroInteractiveField />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 pt-24 pb-14 md:pt-28 md:pb-16 xl:grid-cols-[3fr_2fr] xl:gap-16 xl:pt-[7.5rem] xl:pb-14">

          {/* Copy */}
          <motion.div variants={stagger} initial={initial} animate="show">
            <motion.p
              variants={fadeUp}
              className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D2401A]"
            >
              Growth operations partner
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0C0B0A] dark:text-white"
            >
              <span className="block">Marketing that converts.</span>
              <span className="block">Sales teams that close.</span>
              <span className="mt-1 block text-brand-orange">Tech that scales.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-[36rem] text-[15px] font-medium leading-relaxed text-[#5A5550] dark:text-[#A8A09A] sm:text-[16px] sm:leading-[1.7] lg:text-[17px]"
            >
              {HERO_CONTENT.subheadline}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <a
                href="#contact"
                data-cursor="cta"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-brand-orange-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40"
              >
                {HERO_CONTENT.ctaPrimary}
                <ArrowRight size={15} aria-hidden />
              </a>
              <a
                href="#services"
                data-cursor="interactive"
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-6 py-3 text-sm font-semibold',
                  'transition-colors duration-200 backdrop-blur-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30',
                  // light mode
                  'border border-[rgba(10,9,8,0.15)] bg-[rgba(10,9,8,0.05)] text-[#0C0B0A]',
                  'hover:border-[rgba(10,9,8,0.25)] hover:bg-[rgba(10,9,8,0.09)]',
                  // dark mode
                  'dark:border-white/[0.18] dark:bg-white/[0.06] dark:text-white',
                  'dark:hover:border-white/[0.25] dark:hover:bg-white/[0.10]',
                )}
              >
                {HERO_CONTENT.ctaSecondary}
                <ArrowUpRight size={15} aria-hidden className="text-[#8A8480] dark:text-[#8A8280]" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.dl
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-[rgba(10,9,8,0.1)] pt-6 dark:border-white/[0.08] sm:gap-x-10"
            >
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex items-baseline gap-2.5">
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-extrabold tabular-nums leading-none tracking-tight text-[#0C0B0A] dark:text-white sm:text-3xl lg:text-[2rem]">
                    {value}
                  </dd>
                  <dd className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7A7570]">
                    {label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Right: bars mark + capabilities panel */}
          <motion.aside
            variants={fadeUp}
            initial={initial}
            animate="show"
            className="w-full"
          >
            {/* Logo-mark ascending bars — desktop only */}
            <div
              aria-hidden
              className="mb-3 hidden items-end gap-[5px] xl:flex"
              style={{ height: '48px' }}
            >
              {HERO_BARS.map((pct, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: `${pct}%`, transformOrigin: 'bottom' }}
                  className="w-[7px] rounded-t-[2px] bg-[#D2401A]"
                />
              ))}
            </div>

            <CapabilitiesPanel reduceMotion={!!reduceMotion} />
          </motion.aside>

        </div>
      </div>
    </section>
  )
}
