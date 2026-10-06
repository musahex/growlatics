'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { CalendarClock, ChevronDown } from 'lucide-react'
import { nav, site, systemById } from '@/content'
import Logo from '@/components/brand/Logo'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { addTask, damp, removeTask, sys, useSystem } from '@/components/system/runtime'
import { cn } from '@/lib/utils'

// Floating glass header (GLASS_BRIEF §2–6, docs/v2/GLASS_SYSTEM.md). Scroll response is pure CSS
// (.hdr scroll timeline); the CTA magnet runs on the shared scheduler only while hovered.

const isCurrent = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
const services = nav.header.find((i) => i.children)!
const navLink =
  'nav-link inline-flex min-h-11 items-center rounded-[12px] px-3.5 text-body-s font-medium text-text-2 transition-colors duration-fast ease-out hover:text-text aria-[current=page]:text-text'

/** Magnetic pull toward the pointer (max 6px), fine pointers only, off under reduced motion. */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const id = useId()
  const fine = useSystem('fine')
  const reduced = useSystem('reduced')
  const st = useRef({ x: 0, y: 0, cx: 0, cy: 0, w: 1, h: 1, inside: false })

  useEffect(() => () => removeTask(id), [id])

  const tick = useCallback(
    (dt: number) => {
      const s = st.current
      const el = ref.current
      if (!el) return removeTask(id)
      const p = sys.pointer
      const tx = s.inside ? Math.max(-1, Math.min(1, (p.x - s.cx) / s.w)) * 6 : 0
      const ty = s.inside ? Math.max(-1, Math.min(1, (p.y - s.cy) / s.h)) * 4 : 0
      s.x = damp(s.x, tx, 12, dt)
      s.y = damp(s.y, ty, 12, dt)
      if (!s.inside && Math.abs(s.x) < 0.05 && Math.abs(s.y) < 0.05) {
        el.style.transform = ''
        return removeTask(id)
      }
      el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`
    },
    [id],
  )

  const enter = () => {
    if (!fine || reduced || !ref.current) return
    const s = st.current
    const r = ref.current.getBoundingClientRect()
    s.cx = r.left - s.x + r.width / 2
    s.cy = r.top - s.y + r.height / 2
    s.w = r.width / 2 + 16
    s.h = r.height / 2 + 16
    s.inside = true
    addTask(id, tick, 30)
  }
  const leave = () => {
    st.current.inside = false
  }

  return (
    <span ref={ref} onPointerEnter={enter} onPointerLeave={leave} className="inline-flex">
      {children}
    </span>
  )
}

function ServicesMenu({ pathname }: { pathname: string }) {
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
        <Link href={services.href} className={cn(navLink, 'pr-1.5')} aria-current={isCurrent(pathname, services.href) ? 'page' : undefined}>
          {services.label}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="services-panel"
          aria-label="Show services"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-7 items-center justify-center rounded-[10px] text-text-3 transition-colors duration-fast ease-out hover:text-text"
        >
          <ChevronDown size={15} strokeWidth={1.5} aria-hidden className={cn('transition-transform duration-base ease-out', open && 'rotate-180')} />
        </button>
      </div>

      <div id="services-panel" hidden={!open} className="absolute left-1/2 top-full w-screen max-w-2xl -translate-x-1/2 pt-4">
        <div className="glass-elevated glass-drop rounded-liquid p-2">
          <ul className="grid grid-cols-[1.25fr_1fr_1fr_1fr] gap-1">
            {services.children!.map((c) => {
              const s = systemById[c.system]
              return (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    aria-current={pathname === c.href ? 'page' : undefined}
                    className="rounded-liquid-inner flex h-full flex-col gap-2 p-4 transition-colors duration-fast ease-out hover:bg-text/[0.05] aria-[current=page]:bg-signal-soft"
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

/** Two hairlines that morph into a cross. */
function MenuIcon({ open }: { open: boolean }) {
  const line = 'absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-base ease-out motion-reduce:transition-none'
  return (
    <span aria-hidden className="relative block h-3 w-[18px]">
      <span className={cn(line, 'top-[2px]', open && 'translate-y-[4px] rotate-45')} />
      <span className={cn(line, 'bottom-[2px]', open && '-translate-y-[4px] -rotate-45')} />
    </span>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }, [])
  useEffect(() => {
    setOpen(false)
    setServicesOpen(pathname.startsWith('/services/'))
  }, [pathname])

  // Open menu = modal: the rest of the page is inert, scroll locked, Tab wraps inside the header,
  // Escape closes and returns focus to the toggle. Crossing to desktop width closes it.
  useEffect(() => {
    if (!open) return
    const root = rootRef.current!.closest('header')!
    const others = Array.from(root.parentElement!.children).filter((el) => el !== root) as HTMLElement[]
    others.forEach((el) => el.setAttribute('inert', ''))
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close(true)
      if (e.key !== 'Tab') return
      const f = Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter((el) => el.getClientRects().length && !el.closest('[hidden]'))
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const mq = matchMedia('(min-width: 1024px)')
    const onWide = () => mq.matches && close(false)
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onWide)
    return () => {
      others.forEach((el) => el.removeAttribute('inert'))
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
    }
  }, [open, close])

  const row = 'flex min-h-12 w-full items-center justify-between rounded-liquid-inner px-3 text-title text-text transition-colors duration-fast ease-out hover:bg-text/[0.05] aria-[current=page]:bg-text/[0.06]'

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-header px-[var(--hdr-x)] pt-[calc(env(safe-area-inset-top,0px)+var(--hdr-y))]">
      {open && <div aria-hidden className="pointer-events-auto fixed inset-0 bg-bg/50 lg:hidden" onClick={() => close(false)} />}

      <div ref={rootRef} className="hdr pointer-events-auto relative mx-auto max-w-[calc(var(--container)-2*var(--gutter)+40px)]">
        <div aria-hidden className="hdr-bar glass-elevated rounded-liquid absolute inset-0" />

        {/* 1fr | auto | 1fr keeps the links on the true centre line whatever the side widths. */}
        <div className="relative grid h-[var(--hdr-h)] grid-cols-[1fr_auto] items-center gap-3 pl-4 pr-2 sm:pl-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:pl-6 lg:pr-3">
          <div className="justify-self-start">
            <Logo replayOnNavigate />
          </div>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {nav.header.map((item) => (
                <li key={item.href}>
                  {item.children ? (
                    <ServicesMenu pathname={pathname} />
                  ) : (
                    <Link href={item.href} className={navLink} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 justify-self-end sm:gap-2">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Magnetic>
              <Button href={site.primaryCta.href} className="hidden px-5 sm:inline-flex" onClick={() => close(false)}>
                <span className="md:hidden">Book a call</span>
                <span className="hidden md:inline">{site.primaryCta.label}</span>
              </Button>
            </Magnetic>
            <Button href={site.primaryCta.href} aria-label={site.primaryCta.label} className={cn('w-11 px-0 sm:hidden', open && 'invisible')} onClick={() => close(false)}>
              <CalendarClock size={18} strokeWidth={1.5} aria-hidden />
            </Button>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? close(false) : setOpen(true))}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center rounded-[12px] text-text transition-colors duration-fast ease-out hover:bg-text/[0.06] lg:hidden"
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>

        <div id="mobile-menu" ref={panelRef} data-open={open} className="hdr-panel relative lg:hidden">
          <div>
            <nav aria-label="Main" className="max-h-[calc(100svh-var(--header-clear)-2rem)] overflow-y-auto border-t border-line px-2 pb-3 pt-2">
              <ul className="flex flex-col gap-0.5">
                {nav.header.map((item) =>
                  item.children ? (
                    <li key={item.href}>
                      <button type="button" aria-expanded={servicesOpen} onClick={() => setServicesOpen((v) => !v)} className={row}>
                        {item.label}
                        <ChevronDown size={18} strokeWidth={1.5} aria-hidden className={cn('text-text-3 transition-transform duration-base ease-out', servicesOpen && 'rotate-180')} />
                      </button>
                      <ul hidden={!servicesOpen} className="pb-2 pl-3">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              aria-current={pathname === c.href ? 'page' : undefined}
                              className="flex min-h-11 items-center gap-3 rounded-liquid-inner px-3 text-body text-text-2 aria-[current=page]:text-text"
                            >
                              <span className="w-16 font-mono text-data uppercase text-signal-ink">{systemById[c.system].verb}</span>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href={item.href} className="flex min-h-11 items-center px-3 text-body text-text-2">
                            {nav.servicesPanelFooter.label} →
                          </Link>
                        </li>
                      </ul>
                    </li>
                  ) : (
                    <li key={item.href}>
                      <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined} className={row}>
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-3 flex items-center gap-2 border-t border-line px-1 pt-3">
                <div className="sm:hidden">
                  <ThemeToggle />
                </div>
                <Button href={site.primaryCta.href} size="lg" arrow className="flex-1" onClick={() => close(false)}>
                  {site.primaryCta.label}
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
