'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    label: 'Attract',
    description:
      'Attract qualified attention through targeted performance marketing and demand generation.',
  },
  {
    n: '02',
    label: 'Convert',
    description:
      'Convert leads into conversations with optimised funnels and response workflows.',
  },
  {
    n: '03',
    label: 'Close',
    description:
      'Close with trained inbound and outbound sales teams built for your market.',
  },
  {
    n: '04',
    label: 'Support',
    description:
      'Support and retain customers with dedicated service operations and retention workflows.',
  },
  {
    n: '05',
    label: 'Scale',
    description:
      'Scale through technology, automation, and digital infrastructure built to grow with you.',
  },
]

export default function GrowthSystemSection() {
  return (
    <section
      id="process"
      className="w-full border-b border-[rgba(10,9,8,0.07)] bg-[#F5F3F0] dark:border-white/[0.06] dark:bg-[#0D0C0B]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 md:py-24 lg:py-32">

        {/* Section header */}
        <div className="mb-16 grid grid-cols-1 gap-6 lg:mb-20 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D2401A]">
              Growth System
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-[#0C0B0A] dark:text-white">
              From attention to revenue, every stage is connected.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg self-end text-[16px] leading-[1.72] text-[#5A5550] dark:text-[#7A7570]"
          >
            Instead of treating marketing, sales, and support as separate functions,
            Growlatics builds operating systems where each stage strengthens the next.
          </motion.p>
        </div>

        {/* Steps — desktop: module cards */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:gap-2">
          {STEPS.map(({ n, label, description }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="panel"
              className={[
                'group flex flex-col gap-5 border-t-[3px] border-[#D2401A] px-6 py-8 xl:px-7 xl:py-10',
                // light mode card
                'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
                // dark mode card
                'dark:bg-[#0C0B0A] dark:shadow-none',
                'transition-all duration-300',
                'hover:-translate-y-1.5',
                'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12),0_0_0_1px_rgba(210,64,26,0.12)]',
                'dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(210,64,26,0.12)]',
              ].join(' ')}
            >
              <span className="text-[12px] font-extrabold tabular-nums text-[#D2401A]">
                {n}
              </span>
              <div className="flex flex-1 flex-col">
                <p className="mb-3 text-[18px] font-bold leading-snug text-[#0C0B0A] dark:text-white">{label}</p>
                <p className="text-[13px] leading-[1.72] text-[#5A5550] dark:text-[#7A7570]">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Steps — mobile/tablet: vertical timeline */}
        <div className="flex flex-col lg:hidden">
          {STEPS.map(({ n, label, description }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {/* Vertical connector */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="absolute left-[9px] top-5 bottom-0 w-px bg-[rgba(10,9,8,0.12)] dark:bg-white/[0.12]"
                />
              )}

              {/* Dot */}
              <div className="relative z-10 mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 border-[#D2401A] bg-[#F5F3F0] dark:bg-[#0D0C0B]">
                <div className="h-2 w-2 rounded-full bg-[#D2401A]" />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <div className="mb-1.5 flex items-baseline gap-2.5">
                  <span className="text-[11px] font-extrabold tabular-nums text-[#D2401A]">
                    {n}
                  </span>
                  <span className="text-[16px] font-bold text-[#0C0B0A] dark:text-white">{label}</span>
                </div>
                <p className="text-[13.5px] leading-[1.7] text-[#5A5550] dark:text-[#7A7570]">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
