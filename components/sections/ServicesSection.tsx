'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const SERVICES = [
  {
    n: '01',
    title: 'Performance Marketing',
    description:
      'Google Ads, Meta Ads, PPC, SEO, ecommerce campaigns, lead generation, and funnel optimisation.',
    tags: ['Google Ads', 'Meta Ads', 'SEO', 'PPC', 'Lead Gen'],
  },
  {
    n: '02',
    title: 'Sales & BPO Teams',
    description:
      'Inbound sales, outbound sales, tele-sales, appointment setting, and campaign support.',
    tags: ['Inbound Sales', 'Outbound', 'Tele-sales', 'BPO'],
  },
  {
    n: '03',
    title: 'Customer Support Operations',
    description:
      'Chat support, call support, customer service teams, retention workflows, and support operations.',
    tags: ['Chat Support', 'Call Support', 'Retention', 'CX Ops'],
  },
  {
    n: '04',
    title: 'Technology & Development',
    description:
      'Websites, full-stack development, app development, QA, UI/UX, automation, and scalable digital systems.',
    tags: ['Web Dev', 'App Dev', 'Automation', 'UI/UX'],
  },
]

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="w-full border-b border-[rgba(10,9,8,0.07)] bg-[#FDFCFA] dark:border-white/[0.06] dark:bg-[#09080A]"
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">

        {/* Section header */}
        <div className="mb-10 grid grid-cols-1 gap-5 lg:mb-12 lg:grid-cols-2 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#D2401A]">
              Services
            </p>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-[#0C0B0A] dark:text-white">
              Growth services built as one connected system.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:self-end"
          >
            <p className="max-w-lg text-[15px] leading-[1.65] text-[#5A5550] dark:text-[#7A7570]">
              Growlatics connects acquisition, sales, support, and technology so
              businesses can move from attention to revenue with less friction.
            </p>
          </motion.div>
        </div>

        {/* Service list */}
        <div className="border-b border-[rgba(10,9,8,0.07)] dark:border-white/[0.06]">
          {SERVICES.map(({ n, title, description, tags }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="panel"
              className={[
                'group relative overflow-hidden border-t py-5 md:py-6',
                'border-[rgba(10,9,8,0.07)] dark:border-white/[0.06]',
                'transition-all duration-300',
                'hover:-translate-y-px',
                'hover:bg-[rgba(10,9,8,0.02)] hover:shadow-[0_4px_28px_rgba(0,0,0,0.06),0_0_0_1px_rgba(210,64,26,0.06)]',
                'dark:hover:bg-white/[0.03] dark:hover:shadow-[0_4px_28px_rgba(0,0,0,0.5),0_0_0_1px_rgba(210,64,26,0.06)]',
              ].join(' ')}
            >
              {/* Left accent bar on hover */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 rounded-r-full bg-[#D2401A] transition-transform duration-300 group-hover:scale-y-100"
              />

              <div className="grid grid-cols-1 gap-3 pl-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_20px] md:items-start md:gap-x-8 md:gap-y-0 lg:gap-x-12">

                {/* Number + title + tags */}
                <div>
                  <span className="mb-1 block text-[10px] font-extrabold tabular-nums tracking-[0.1em] text-[#D2401A]">
                    {n}
                  </span>
                  <h3 className="text-[18px] font-bold leading-snug text-[#0C0B0A] dark:text-white md:text-[19px]">
                    {title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-2 py-0.5 text-[10px] font-medium border-[rgba(10,9,8,0.1)] bg-[rgba(10,9,8,0.04)] text-[#6A6460] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-[#7A7570]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[14px] leading-[1.6] text-[#5A5550] dark:text-[#7A7570]">
                  {description}
                </p>

                {/* Arrow — desktop only */}
                <ArrowUpRight
                  size={17}
                  aria-hidden
                  className="hidden text-[#B0AAA5] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#D2401A] dark:text-[#3A3530] md:block md:self-center"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
