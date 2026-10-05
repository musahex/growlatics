'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

// Strictly ascending bars matching the logo mark
const BARS = [32, 52, 70, 86, 100]

export default function FinalCTA() {
  return (
    <section id="contact" data-cursor-surface="dark" className="w-full border-t border-white/[0.06] bg-[#0C0B0A]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="flex flex-col items-center text-center">

          {/* Logo-mark bars */}
          <div
            aria-hidden
            className="mb-8 flex items-end gap-[5px]"
            style={{ height: '56px' }}
          >
            {BARS.map((pct, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ height: `${pct}%`, transformOrigin: 'bottom' }}
                className="w-[8px] rounded-full bg-[#D2401A] md:w-[9px]"
              />
            ))}
          </div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold leading-[1.07] tracking-[-0.028em] text-white"
          >
            Ready to build your growth engine?
          </motion.h2>

          {/* Copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-lg text-[15px] leading-[1.75] text-[#8E8A85] lg:text-[16px]"
          >
            Whether you need better marketing, trained sales teams, reliable support,
            or scalable digital systems — Growlatics connects the pieces.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Button href="mailto:ahsan@growlatics.com" size="lg" data-cursor="cta">
              Book a Growth Call
            </Button>
            <Button href="#services" size="md" variant="outline" data-cursor="interactive">
              Explore Services
            </Button>
          </motion.div>

          {/* Micro-copy */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-5 text-[11px] tracking-[0.04em] text-[#4C4C48]"
          >
            No long-term commitment. Just a focused growth conversation.
          </motion.p>

        </div>
      </div>
    </section>
  )
}
