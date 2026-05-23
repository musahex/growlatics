'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { NAV_LINKS } from '@/lib/content'
import { cn } from '@/lib/utils'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? [
              // light mode
              'border-b border-[rgba(10,9,8,0.1)] bg-[#F5F3F0]/95 shadow-[0_1px_0_rgba(10,9,8,0.04)] backdrop-blur-md',
              // dark mode
              'dark:border-white/[0.08] dark:bg-[#070605]/95 dark:shadow-[0_1px_0_rgba(255,255,255,0.04)]',
            ].join(' ')
          : [
              'border-b border-[rgba(10,9,8,0.06)] bg-[#F5F3F0]/70 backdrop-blur-sm',
              'dark:border-white/[0.05] dark:bg-[#070605]/60',
            ].join(' ')
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <a
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40"
          >
            <span aria-hidden className="flex items-end gap-[2.5px]" style={{ height: '16px' }}>
              {[35, 55, 75, 90, 100].map((pct, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-t-[1px] bg-brand-orange"
                  style={{ height: `${pct}%` }}
                />
              ))}
            </span>
            <span className="text-[17px] font-black tracking-[-0.02em] text-[#0C0B0A] dark:text-white">
              Growlatics
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-[#5A5550] transition-colors duration-200 hover:text-[#0C0B0A] dark:text-[#A8A09A] dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop: theme toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button href="#contact" size="sm" data-cursor="cta">
              Book a Growth Call
            </Button>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-1 text-[#5A5550] transition-colors hover:text-[#0C0B0A] dark:text-[#A8A09A] dark:hover:text-white"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-[rgba(10,9,8,0.1)] bg-[#F5F3F0]/98 backdrop-blur-md md:hidden dark:border-white/[0.08] dark:bg-[#070605]/98"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-[rgba(10,9,8,0.07)] py-3 text-sm font-semibold text-[#5A5550] transition-colors last:border-0 hover:text-[#0C0B0A] dark:border-white/[0.06] dark:text-[#A8A09A] dark:hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4">
                <Button href="#contact" size="sm" className="w-full justify-center" data-cursor="cta">
                  Book a Growth Call
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
