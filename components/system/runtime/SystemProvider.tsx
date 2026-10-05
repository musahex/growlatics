'use client'

// Mounts the site's window listeners exactly once (DIRECTION §6.4): pointermove, pointerover,
// scroll, resize (ResizeObserver), visibilitychange, matchMedia (reduced motion, pointer) and one
// MutationObserver on data-theme. Ref-counted, so a second consumer (the cursor) shares them.
import { useEffect, type ReactNode } from 'react'
import { pointerHooks, publish, sys, type Tier } from './store'
import { wake } from './scheduler'
import { detectTier, FINE_QUERY, REDUCED_QUERY } from './tier'

let refs = 0
let detach: (() => void) | null = null
let detected: Tier = 0

function setTier() {
  const next = (sys.tierOverride ?? detected) as Tier
  if (next !== sys.tier) {
    sys.tier = next
    publish('tier')
  }
}

/** Lab/QA: force a tier (null restores detection). */
export function setTierOverride(t: Tier | null) {
  sys.tierOverride = t
  setTier()
}

function attach() {
  const root = document.documentElement
  const mqReduced = matchMedia(REDUCED_QUERY)
  const mqFine = matchMedia(FINE_QUERY)

  const readTheme = () => {
    const t = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    if (t !== sys.theme) {
      sys.theme = t
      publish('theme')
    }
  }
  const readMedia = () => {
    const reduced = mqReduced.matches
    const fine = mqFine.matches
    if (reduced !== sys.reduced) {
      sys.reduced = reduced
      publish('reduced')
    }
    if (fine !== sys.pointer.fine) {
      sys.pointer.fine = fine
      publish('fine')
    }
    detected = detectTier()
    setTier()
  }
  const readViewport = () => {
    sys.viewport.w = innerWidth
    sys.viewport.h = innerHeight
    sys.viewport.dpr = devicePixelRatio || 1
    const max = root.scrollHeight - innerHeight
    sys.scroll.progress = max > 0 ? sys.scroll.y / max : 0
    const before = detected
    detected = detectTier()
    if (before !== detected) setTier()
  }
  const onScroll = () => {
    const y = scrollY
    sys.scroll.velocity = y - sys.scroll.y
    sys.scroll.y = y
    const max = root.scrollHeight - innerHeight
    sys.scroll.progress = max > 0 ? y / max : 0
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    const p = sys.pointer
    p.x = e.clientX
    p.y = e.clientY
    p.nx = (e.clientX / (sys.viewport.w || 1)) * 2 - 1
    p.ny = (e.clientY / (sys.viewport.h || 1)) * 2 - 1
    p.active = true
    pointerHooks.forEach((fn) => fn())
  }
  const onOver = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') sys.pointer.target = e.target as Element
    pointerHooks.forEach((fn) => fn())
  }
  const onLeave = () => {
    sys.pointer.active = false
    sys.pointer.target = null
    pointerHooks.forEach((fn) => fn())
  }
  const onVisibility = () => {
    sys.visible = document.visibilityState !== 'hidden'
    publish('visible')
    if (sys.visible) wake()
  }

  readTheme()
  readMedia()
  readViewport()
  onScroll()
  onVisibility()

  const ro = new ResizeObserver(readViewport)
  ro.observe(root)
  const mo = new MutationObserver(readTheme)
  mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
  addEventListener('pointermove', onMove, { passive: true })
  addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('pointerover', onOver, { passive: true })
  root.addEventListener('pointerleave', onLeave)
  document.addEventListener('visibilitychange', onVisibility)
  mqReduced.addEventListener('change', readMedia)
  mqFine.addEventListener('change', readMedia)

  return () => {
    ro.disconnect()
    mo.disconnect()
    removeEventListener('pointermove', onMove)
    removeEventListener('scroll', onScroll)
    document.removeEventListener('pointerover', onOver)
    root.removeEventListener('pointerleave', onLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    mqReduced.removeEventListener('change', readMedia)
    mqFine.removeEventListener('change', readMedia)
  }
}

/** Attach the shared runtime for the lifetime of the calling component. */
export function useRuntime() {
  useEffect(() => {
    if (refs++ === 0) detach = attach()
    return () => {
      if (--refs === 0) {
        detach?.()
        detach = null
      }
    }
  }, [])
}

export function SystemProvider({ children }: { children?: ReactNode }) {
  useRuntime()
  return <>{children}</>
}

export default SystemProvider
