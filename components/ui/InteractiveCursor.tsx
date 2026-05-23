'use client'

import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTORS =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor]'

type CursorState = 'default' | 'interactive' | 'cta' | 'panel'

function resolveState(el: Element | null): CursorState {
  if (!el) return 'default'
  const dc = (el as HTMLElement).dataset.cursor
  if (dc === 'cta')         return 'cta'
  if (dc === 'panel')       return 'panel'
  if (dc === 'interactive') return 'interactive'
  const tag = el.tagName.toLowerCase()
  if (
    tag === 'a' || tag === 'button' || tag === 'input' ||
    tag === 'textarea' || tag === 'select' || tag === 'label' ||
    el.getAttribute('role') === 'button'
  ) return 'interactive'
  return 'default'
}

// ── Standard styling (dark mode globally, or light mode over light sections) ─

const RING_SHADOW: Record<CursorState, string> = {
  default:     'none',
  interactive: '0 0 12px rgba(210,64,26,0.22)',
  cta:         '0 0 22px rgba(210,64,26,0.38), 0 0 8px rgba(210,64,26,0.55)',
  panel:       '0 0 10px rgba(210,64,26,0.14)',
}

const RING_BORDER: Record<CursorState, string> = {
  default:     'var(--cursor-ring-color)',
  interactive: 'rgba(210,64,26,0.55)',
  cta:         'rgba(210,64,26,0.78)',
  panel:       'rgba(210,64,26,0.38)',
}

// ── Dark-surface styling ─────────────────────────────────────────────────────
// Applied only when site is in light mode AND cursor is inside an element with
// [data-cursor-surface="dark"] in its ancestor chain.
// Dot becomes white; ring shifts to white (default) or warm orange (interactive).

const RING_SHADOW_DS: Record<CursorState, string> = {
  default:     'none',
  interactive: '0 0 12px rgba(210,64,26,0.32)',
  cta:         '0 0 22px rgba(210,64,26,0.48), 0 0 8px rgba(210,64,26,0.65)',
  panel:       '0 0 10px rgba(210,64,26,0.20)',
}

const RING_BORDER_DS: Record<CursorState, string> = {
  default:     'rgba(255,255,255,0.30)',
  interactive: 'rgba(210,64,26,0.60)',
  cta:         'rgba(210,64,26,0.82)',
  panel:       'rgba(255,255,255,0.22)',
}

// Scale targets per state (lerped each frame)
const RING_SCALE: Record<CursorState, number> = {
  default:     1,
  interactive: 1.42,
  cta:         1.72,
  panel:       1.28,
}
const DOT_SCALE: Record<CursorState, number> = {
  default:     1,
  interactive: 1.25,
  cta:         1.45,
  panel:       1.1,
}

export default function InteractiveCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const rawPos     = useRef({ x: -300, y: -300 })
  const smoothPos  = useRef({ x: -300, y: -300 })
  const scales     = useRef({ dot: 1, ring: 1 })
  const curState   = useRef<CursorState>('default')
  const themeRef   = useRef<'dark' | 'light'>('dark')
  const surfaceRef = useRef<'light' | 'dark'>('light')

  const rafRef  = useRef(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if ( window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setShow(true)

    // Signal to CSS that the custom cursor is running — hides native cursor
    document.documentElement.classList.add('custom-cursor-active')

    // Read initial theme before first paint
    themeRef.current =
      (document.documentElement.getAttribute('data-theme') ?? 'dark') as 'dark' | 'light'

    // ── Styling helper — no React re-renders ─────────────────────────────────
    const applyState = (state: CursorState) => {
      if (!dotRef.current || !ringRef.current) return

      // Switch to dark-surface variant only when the page is in light mode and
      // the cursor is physically inside a [data-cursor-surface="dark"] section.
      const onDarkSurface = themeRef.current === 'light' && surfaceRef.current === 'dark'
      const border = (onDarkSurface ? RING_BORDER_DS : RING_BORDER)[state]
      const shadow = (onDarkSurface ? RING_SHADOW_DS : RING_SHADOW)[state]

      dotRef.current.style.backgroundColor =
        onDarkSurface
          ? (state === 'default' ? 'rgba(255,255,255,0.88)' : '#D2401A')
          : (state === 'default' ? 'var(--cursor-color)'    : '#D2401A')

      ringRef.current.style.borderColor = border
      ringRef.current.style.boxShadow   = shadow
    }

    // Watch data-theme attribute so toggling recolours the cursor immediately
    const themeObs = new MutationObserver(() => {
      themeRef.current =
        (document.documentElement.getAttribute('data-theme') ?? 'dark') as 'dark' | 'light'
      applyState(curState.current)
    })
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // ── Event handlers ───────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      rawPos.current.x = e.clientX
      rawPos.current.y = e.clientY
    }

    const onOver = (e: MouseEvent) => {
      const target  = e.target as Element
      // closest() walks up the DOM, so any element inside the marked section matches
      const surface = target.closest('[data-cursor-surface="dark"]') ? 'dark' : 'light'
      const el      = target.closest(INTERACTIVE_SELECTORS)
      const next    = resolveState(el)

      const stateChanged   = next    !== curState.current
      const surfaceChanged = surface !== surfaceRef.current

      if (stateChanged)   curState.current   = next
      if (surfaceChanged) surfaceRef.current = surface as 'dark' | 'light'
      if (stateChanged || surfaceChanged) applyState(curState.current)
    }

    const onLeaveDoc = () => {
      rawPos.current.x = -300
      rawPos.current.y = -300
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeaveDoc)

    // ── RAF animation loop ───────────────────────────────────────────────────
    const tick = () => {
      const raw = rawPos.current
      const sm  = smoothPos.current
      const sc  = scales.current
      const st  = curState.current

      sm.x += (raw.x - sm.x) * 0.11
      sm.y += (raw.y - sm.y) * 0.11

      sc.dot  += (DOT_SCALE[st]  - sc.dot)  * 0.12
      sc.ring += (RING_SCALE[st] - sc.ring) * 0.10

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${raw.x}px, ${raw.y}px) translate(-50%, -50%) scale(${sc.dot.toFixed(3)})`
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${sm.x}px, ${sm.y}px) translate(-50%, -50%) scale(${sc.ring.toFixed(3)})`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeaveDoc)
      themeObs.disconnect()
      cancelAnimationFrame(rafRef.current)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  if (!show) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
