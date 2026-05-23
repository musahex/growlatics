'use client'

import { motion } from 'framer-motion'

const OUTCOMES = [
  { metric: '150%', label: 'ROI uplift in 90 days', area: 'Marketing' },
  { metric: '40%', label: 'Higher user engagement', area: 'Product' },
  { metric: '25%', label: 'Increase in conversions', area: 'Funnels' },
  { metric: '60%', label: 'Funnel conversion improvement', area: 'Sales' },
  { metric: '10x', label: 'Infrastructure scalability', area: 'Technology' },
]

export default function OutcomesSection() {
  return (
    <section
      id="outcomes"
      className="w-full border-b border-[rgba(10,9,8,0.07)] bg-[#F5F3F0] dark:border-white/[0.06] dark:bg-[#0B0A09]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 md:py-24 lg:py-32">

        {/* Section header */}
        <div className="mb-14 grid grid-cols-1 gap-6 lg:mb-20 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D2401A]">
              Outcomes
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-[#0C0B0A] dark:text-white">
              Selected outcomes from connected growth systems.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg self-end text-[16px] leading-[1.72] text-[#5A5550] dark:text-[#7A7570]"
          >
            Across marketing, sales, support, and technology, Growlatics tracks
            what moves the business — better acquisition, stronger conversion, and
            operations that scale.
          </motion.p>
        </div>

        {/* Metric cards — gap-px trick: outer bg shows through gaps = 1px lines */}
        <div className="grid grid-cols-2 gap-px border border-[rgba(10,9,8,0.08)] bg-[rgba(10,9,8,0.06)] dark:border-white/[0.06] dark:bg-white/[0.04] md:grid-cols-3 lg:grid-cols-5">
          {OUTCOMES.map(({ metric, label, area }, i) => (
            <motion.div
              key={metric}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="panel"
              className={[
                'flex flex-col px-5 py-7 md:px-7 md:py-9 lg:px-7 lg:py-10',
                // light mode card
                'bg-[#FDFCFA]',
                // dark mode card
                'dark:bg-[#0C0B0A]',
                'transition-all duration-250',
                'hover:-translate-y-0.5',
                'hover:bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(210,64,26,0.07)]',
                'dark:hover:bg-[#111010] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(210,64,26,0.07)]',
              ].join(' ')}
            >
              {/* Domain area */}
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A9490] dark:text-[#4A4540]">
                {area}
              </p>

              {/* Metric number */}
              <p
                className="font-black tabular-nums leading-none tracking-[-0.03em] text-[#0C0B0A] dark:text-white"
                style={{ fontSize: 'clamp(2rem,3.5vw,3.25rem)' }}
              >
                {metric}
              </p>

              {/* Label */}
              <p className="mt-3 text-[13px] font-medium leading-[1.55] text-[#5A5550] dark:text-[#7A7570]">
                {label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 text-[11px] text-[#AAA09A] dark:text-[#3A3530]"
        >
          Selected project outcomes. Results vary by scope, market, and engagement timeframe.
          Not verified public case studies.
        </motion.p>

      </div>
    </section>
  )
}
