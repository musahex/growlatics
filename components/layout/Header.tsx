'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { nav, site, systemById } from '@/content'
import Logo from '@/components/brand/Logo'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

const isCurrent = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
const navLink =
  'inline-flex min-h-11 items-center rounded-sm px-3 text-body-s font-medium text-text-2 transition-colors duration-fast ease-out hover:text-text aria-[current=page]:text-text'

function ServicesMenu({ pathname }: { pathname: string }) {
  const item = nav.header[0]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => () => clearTimeout(timer.current), [])

  const enter = () => {
    clearTimeout(timer.current)
    setOpen(true)
  }
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 200)
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <div className="flex items-center">
        <Link href={item.href} className={cn(navLink, 'pr-1')} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}>
          {item.label}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="services-panel"
          aria-label="Show services"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-8 items-center justify-center rounded-sm text-text-3 hover:text-text"
        >
          <ChevronDown size={16} strokeWidth={1.5} aria-hidden className={cn('transition-transform duration-fast ease-out', open && 'rotate-180')} />
        </button>
      </div>

      <div
        id="services-panel"
        hidden={!open}
        className="absolute left-1/2 top-full w-screen max-w-2xl -translate-x-1/2 pt-2"
      >
        <div className="rounded-lg border border-line-2 bg-elevated p-2 shadow-3">
          <ul className="grid grid-cols-[1.25fr_1fr_1fr_1fr] gap-1">
            {item.children!.map((c) => {
              const s = systemById[c.system]
              return (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    aria-current={pathname === c.href ? 'page' : undefined}
                    className="flex h-full flex-col gap-2 rounded-md p-4 transition-colors duration-fast ease-out hover:bg-signal-soft aria-[current=page]:bg-signal-soft"
                  >
                    <span className="font-mono text-data uppercase text-signal-ink">{s.verb}</span>
                    <span className={cn('font-semibold text-text', s.emphasis ? 'text-body' : 'text-body-s')}>{c.label}</span>
                    <span className="text-body-s text-text-3">{s.short}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <Link
            href={nav.servicesPanelFooter.href}
            className="mt-1 flex min-h-11 items-center border-t border-line px-4 text-body-s font-medium text-text-2 hover:text-text"
          >
            {nav.servicesPanelFooter.label} →
          </Link>
        </div>
      </div>
    </div>
  )
}

function MobileSheet({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const [servicesOpen, setServicesOpen] = useState(pathname.startsWith('/services/'))
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const services = nav.header[0]
  const row = 'flex min-h-14 items-center border-b border-line text-title text-text'

  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-overlay flex flex-col bg-bg lg:hidden">
      <div className="flex h-16 items-center justify-between px-gutter">
        <Logo />
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-md text-text">
          <X size={20} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-gutter pb-8">
        <ul>
          <li className="border-b border-line">
            <button type="button" aria-expanded={servicesOpen} onClick={() => setServicesOpen((v) => !v)} className={cn(row, 'w-full justify-between border-0')}>
              {services.label}
              <ChevronDown size={18} strokeWidth={1.5} aria-hidden className={cn('transition-transform duration-fast ease-out', servicesOpen && 'rotate-180')} />
            </button>
            {servicesOpen && (
              <ul className="pb-3">
                {services.children!.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} onClick={onClose} aria-current={pathname === c.href ? 'page' : undefined} className="flex min-h-11 items-center gap-3 text-body text-text-2 aria-[current=page]:text-text">
                      <span className="w-16 font-mono text-data uppercase text-signal-ink">{systemById[c.system].verb}</span>
                      {c.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={services.href} onClick={onClose} className="flex min-h-11 items-center text-body text-text-2">
                    {nav.servicesPanelFooter.label} →
                  </Link>
                </li>
              </ul>
            )}
          </li>
          {nav.header.slice(1).map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={onClose} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined} className={row}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button href={site.primaryCta.href} size="lg" className="mt-8 w-full" onClick={onClose}>
          {site.primaryCta.label}
        </Button>
      </nav>
    </div>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useEffect(closeMenu, [pathname, closeMenu])

  return (
    <header className="fixed inset-x-0 top-0 z-header border-b border-line bg-bg/95">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between gap-6 px-gutter">
        <Logo replayOnNavigate />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <ServicesMenu pathname={pathname} />
            </li>
            {nav.header.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={navLink} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button href={site.primaryCta.href} className="hidden sm:inline-flex">
            {site.primaryCta.label}
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-md text-text lg:hidden"
          >
            <Menu size={20} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
      {menuOpen && <MobileSheet pathname={pathname} onClose={closeMenu} />}
    </header>
  )
}
