'use client'

// Custom cursor (DIRECTION §9). No listeners or rAF of its own: it reads sys.pointer and runs as
// scheduler task order 40. Runs only with a fine pointer and without reduced motion; otherwise the
// native cursor shows. Colours come from tokens; surface awareness comes from copying
// data-surface="dark" from the element under the pointer onto the cursor, so tokens re-declare.
import { useEffect, useRef } from 'react'
import { useRuntime } from '@/components/system/runtime/SystemProvider'
import { useSystem } from '@/components/system/runtime/useSystem'
import { pointerHooks, sys } from '@/components/system/runtime/store'
import { addTask, damp, removeTask } from '@/components/system/runtime/scheduler'
import { css } from '@/components/system/model/palette'

type CursorState = 'default' | 'interactive' | 'cta' | 'panel' | 'node' | 'text'

const TEXT = 'input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]), textarea, [contenteditable=""], [contenteditable="true"]'
const INTERACTIVE = 'a, button, [role="button"], select, label, [data-cursor]'

function resolve(el: Element | null): CursorState {
  if (!el) return 'default'
  if (el.closest(TEXT)) return 'text'
  const hit = el.closest(INTERACTIVE) as HTMLElement | null
  if (!hit) return 'default'
  const dc = hit.dataset.cursor
  if (dc === 'cta') return 'cta'
  if (dc === 'panel') return 'panel'
  return 'interactive'
}

const DOT: Record<CursorState, number> = { default: 1, interactive: 1.25, cta: 1.45, panel: 1.1, node: 1.2, text: 0 }
const RING: Record<CursorState, number> = { default: 1, interactive: 1.42, cta: 1.72, panel: 1.28, node: 0.72, text: 0 }

function paint(dot: HTMLDivElement, ring: HTMLDivElement, s: CursorState) {
  dot.style.backgroundColor = s === 'default' ? css.text : css.signal
  ring.style.borderColor = s === 'default' ? css.line3 : s === 'cta' || s === 'node' ? css.signal : css.signalLine
  ring.style.boxShadow = s === 'cta' ? css.shSignal : 'none'
  ring.style.opacity = s === 'panel' ? '0.6' : '1'
}

export default function InteractiveCursor() {
  useRuntime()
  const fine = useSystem('fine')
  const reduced = useSystem('reduced')
  const on = fine && !reduced
  const wrap = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const link = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const w = wrap.current, d = dot.current, r = ring.current, l = link.current
    if (!on || !w || !d || !r || !l) return
    const root = document.documentElement
    root.classList.add('custom-cursor-active')
    let state: CursorState = 'default'
    let target: Element | null = null
    let surface = false
    const pos = { dx: -100, dy: -100, rx: -100, ry: -100, ds: 1, rs: 1, la: 0, shown: -1 }
    paint(d, r, state)

    let awake = false
    const tick = (dt: number) => {
      const p = sys.pointer
      if (p.target !== target) {
        target = p.target
        const dark = !!target?.closest('[data-surface="dark"]')
        if (dark !== surface) {
          surface = dark
          if (dark) w.setAttribute('data-surface', 'dark')
          else w.removeAttribute('data-surface')
        }
      }
      let next = resolve(target)
      if (next === 'default' && sys.near.d < 48) next = 'node'
      if (next !== state) {
        // Text fields show the native I-beam.
        if (next === 'text') root.classList.remove('custom-cursor-active')
        else if (state === 'text') root.classList.add('custom-cursor-active')
        state = next
        paint(d, r, state)
      }
      const nodeLock = state === 'node'
      const tx = nodeLock ? sys.near.x : p.x, ty = nodeLock ? sys.near.y : p.y
      if (pos.dx < -50) {
        pos.dx = pos.rx = p.x
        pos.dy = pos.ry = p.y
      }
      pos.dx = damp(pos.dx, p.x, 40, dt)
      pos.dy = damp(pos.dy, p.y, 40, dt)
      pos.rx = damp(pos.rx, tx, 14, dt)
      pos.ry = damp(pos.ry, ty, 14, dt)
      pos.ds = damp(pos.ds, DOT[state], 16, dt)
      pos.rs = damp(pos.rs, RING[state], 14, dt)
      const show = p.active ? 1 : 0
      if (show !== pos.shown) w.style.opacity = String((pos.shown = show))
      d.style.transform = `translate3d(${pos.dx.toFixed(1)}px,${pos.dy.toFixed(1)}px,0) translate(-50%,-50%) scale(${pos.ds.toFixed(3)})`
      r.style.transform = `translate3d(${pos.rx.toFixed(1)}px,${pos.ry.toFixed(1)}px,0) translate(-50%,-50%) scale(${pos.rs.toFixed(3)})`

      // Tier-2 home: a hairline from the ring to a node within 120px.
      const la = damp(pos.la, sys.near.d < 120 && state !== 'text' ? 1 : 0, 15, dt)
      pos.la = la
      if (la > 0.01) {
        const vx = sys.near.x - pos.rx, vy = sys.near.y - pos.ry
        l.style.width = `${Math.hypot(vx, vy).toFixed(1)}px`
        l.style.transform = `translate3d(${pos.rx.toFixed(1)}px,${pos.ry.toFixed(1)}px,0) rotate(${Math.atan2(vy, vx).toFixed(4)}rad)`
      }
      l.style.opacity = la > 0.01 ? la.toFixed(2) : '0'

      // Sleep when settled so the shared loop can stop; the next pointer event wakes it.
      const settled =
        Math.abs(pos.dx - p.x) + Math.abs(pos.dy - p.y) + Math.abs(pos.rx - tx) + Math.abs(pos.ry - ty) < 0.2 &&
        Math.abs(pos.ds - DOT[state]) + Math.abs(pos.rs - RING[state]) < 0.002 &&
        (la < 0.01 || la > 0.99) &&
        !(sys.near.d < 120)
      if (settled) {
        awake = false
        removeTask('cursor')
      }
    }
    const wakeCursor = () => {
      if (awake) return
      awake = true
      addTask('cursor', tick, 40)
    }
    pointerHooks.add(wakeCursor)
    wakeCursor()

    return () => {
      pointerHooks.delete(wakeCursor)
      removeTask('cursor')
      root.classList.remove('custom-cursor-active')
    }
  }, [on])

  if (!on) return null

  const base = { position: 'fixed', left: 0, top: 0, pointerEvents: 'none', willChange: 'transform' } as const
  const colours = 'background-color 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)'
  return (
    <div ref={wrap} aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 'var(--z-cursor, 100)' as unknown as number, opacity: 0 }}>
      <div ref={link} style={{ ...base, height: 1, width: 0, transformOrigin: '0 50%', background: css.edgeHot, opacity: 0 }} />
      <div ref={ring} style={{ ...base, width: 28, height: 28, borderRadius: 9999, border: '1.5px solid', transition: colours }} />
      <div ref={dot} style={{ ...base, width: 6, height: 6, borderRadius: 9999, transition: colours }} />
    </div>
  )
}
