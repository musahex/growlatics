'use client'

// Viewport mount + tier switch + off-screen pause (DIRECTION §6.5, §6.6).
// The tier-0 SVG is always server-rendered first; tiers 1/2 load after hydration, cross-fade in
// over it and then hide it with visibility:hidden (never unmounted).
import dynamic from 'next/dynamic'
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { sys, publish, subscribe } from '../runtime/store'
import { addTask, removeTask } from '../runtime/scheduler'
import { useSystem } from '../runtime/useSystem'
import { useRuntime } from '../runtime/SystemProvider'
import { claimIntro, createField, stepField } from '../model/flow'
import { keyFor, keyPosition } from '../model/layouts'
import { readPalette } from '../model/palette'
import { NetworkSVG } from '../render-svg/NetworkSVG'
import { SpatialLabelLayer } from '../overlay/SpatialLabel'
import { StageContext, type StageCtx } from './context'
import { startStageController } from './StageController'

const NetworkCanvas2D = dynamic(() => import('../render-2d/NetworkCanvas2D'), { ssr: false })
const NetworkScene = dynamic(() => import('../render-gl/NetworkScene'), { ssr: false })

export type SystemStageProps = {
  /** 'fixed': the one full-viewport home canvas behind acts 1-9, driven by scroll. 'inline': a figure. */
  mode?: 'fixed' | 'inline'
  /** Inline only: pin the composition to an act (and journey stage). Omit to follow the store. */
  act?: number
  stage?: number
  /** Play the act-1 intro once per session (home hero). */
  intro?: boolean
  /** Capability labels in the DOM (SVG text on tier 0, SpatialLabels on tiers 1/2). */
  labels?: boolean | 'all'
  /** Phone composition (clusters stacked). Default: automatic from the stage's aspect ratio (live tiers only). */
  portrait?: boolean
  /** Inline only: fit the composition to its visible nodes (phone/tablet act figures). */
  frame?: boolean
  /** Accessible name of the figure. */
  title?: string
  className?: string
  style?: CSSProperties
  /** Live-overlay children (tiers 1/2 only), e.g. <SpatialLabel edge="..."> callouts. Tier-0 callouts belong in the section DOM. */
  children?: ReactNode
}

const BASE_MS = 320

export function SystemStage({ mode = 'inline', act, stage = 0, intro, labels = true, portrait, frame, title, className, style, children }: SystemStageProps) {
  useRuntime()
  const id = useId()
  const tier = useSystem('tier')
  const reduced = useSystem('reduced')
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false) // within half a viewport: load the chunk
  const [idle, setIdle] = useState(false) // tier 2 waits for idle time after hydration
  const [live, setLive] = useState(false) // renderer has drawn: cross-fade done
  const [svgHidden, setSvgHidden] = useState(false)
  const fixed = mode === 'fixed'
  const follow = fixed || act === undefined

  const ctx = useMemo<StageCtx>(
    () => ({
      el: null,
      fixed,
      tier: 0,
      field: createField({ maxPackets: 10 }),
      palette: null,
      rect: { left: 0, top: 0, width: 0, height: 0 },
      still: false,
      pointerFx: false,
      draw: null,
      ready: () => {},
      onPalette: null,
    }),
    [fixed],
  )
  ctx.tier = tier
  ctx.still = reduced
  ctx.pointerFx = tier === 2 && fixed
  ctx.field.frame = !!frame && !fixed

  // Lazy-load trigger (rootMargin 50%) and tier-2 idle gate.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (fixed) return setNear(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '50% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [fixed])
  useEffect(() => {
    if (tier !== 2) return
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void }
    if (w.requestIdleCallback) {
      const h = w.requestIdleCallback(() => setIdle(true), { timeout: 1500 })
      return () => w.cancelIdleCallback?.(h)
    }
    const h = setTimeout(() => setIdle(true), 300)
    return () => clearTimeout(h)
  }, [tier])

  // Palette on mount and on theme change.
  useEffect(() => {
    let dark: boolean | null = null
    const read = () => {
      const el = ref.current
      if (!el) return
      // The fixed home stage takes the dark-surface palette while a dark act (data-surface) is current.
      if (fixed) {
        const d = !!document.querySelector(`[data-act="${sys.act.index}"][data-surface="dark"]`)
        if (d === dark && ctx.palette) return
        dark = d
        if (d) el.dataset.surface = 'dark'
        else delete el.dataset.surface
      }
      ctx.palette = readPalette(el, sys.theme)
      ctx.onPalette?.()
    }
    read()
    const offTheme = subscribe('theme', () => ((dark = null), read()))
    const offAct = fixed ? subscribe('act', read) : null
    return () => {
      offTheme()
      offAct?.()
    }
  }, [ctx, fixed])

  // Frame task: runs only while the stage intersects (pause off-screen). Labels at order 30.
  const showLive = tier > 0 && near && (tier === 1 || idle)
  useEffect(() => {
    const el = ref.current
    if (!el || !showLive) return
    ctx.el = el
    const stopController = fixed ? startStageController() : null
    const task = `stage:${id}`
    let lastKp = -1, lastChange = 0, skip = false
    const frame = (dt: number, t: number) => {
      const r = fixed ? null : el.getBoundingClientRect()
      const rect = ctx.rect
      rect.left = r ? r.left : 0
      rect.top = r ? r.top : 0
      rect.width = r ? r.width : sys.viewport.w
      rect.height = r ? r.height : sys.viewport.h
      ctx.field.portrait = portrait ?? rect.height > rect.width * 1.2
      const kp = follow ? keyPosition(sys.act.index, sys.act.local, sys.journey.stage, sys.journey.local) : keyFor(act!, stage)
      if (kp !== lastKp) {
        lastKp = kp
        lastChange = t
      }
      // Tier 1: 30fps when the scroll position has not changed for 2s.
      if (ctx.tier === 1 && t - lastChange > 2000 && (skip = !skip)) return
      const { nearI, nearD } = stepField(ctx.field, ctx.tier === 1 ? dt * (t - lastChange > 2000 ? 2 : 1) : dt, kp, { still: ctx.still, pointerFx: ctx.pointerFx, rect })
      if (fixed && ctx.tier === 2 && nearI >= 0) {
        sys.near.x = ctx.field.screen[nearI * 2]
        sys.near.y = ctx.field.screen[nearI * 2 + 1]
        sys.near.d = nearD
      }
      ctx.draw?.(dt, t)
    }
    let on = false
    const run = (v: boolean) => {
      if (v === on) return
      on = v
      if (v) addTask(task, frame, 20)
      else removeTask(task)
    }
    let io: IntersectionObserver | null = null
    if (fixed) run(true)
    else {
      io = new IntersectionObserver(([e]) => run(e.isIntersecting))
      io.observe(el)
    }
    ctx.ready = () => {
      ctx.ready = () => {}
      if (intro && claimIntro() && !ctx.still) ctx.field.intro = 0
      setLive(true)
      if (fixed) {
        sys.live = true
        publish('live')
      }
    }
    return () => {
      io?.disconnect()
      run(false)
      stopController?.()
      sys.near.d = Infinity
      if (fixed) {
        sys.live = false
        publish('live')
      }
    }
  }, [ctx, showLive, fixed, follow, act, stage, intro, id, portrait])

  // Cross-fade, then hide the SVG without unmounting it.
  useEffect(() => {
    if (!live || !showLive) {
      setSvgHidden(false)
      return
    }
    const h = setTimeout(() => setSvgHidden(true), BASE_MS)
    return () => clearTimeout(h)
  }, [live, showLive])
  useEffect(() => {
    if (!showLive) setLive(false)
  }, [showLive])

  const wrap: CSSProperties = fixed
    ? { position: 'fixed', inset: 0, zIndex: 'var(--z-canvas, 0)' as unknown as number, pointerEvents: 'none', ...style }
    : { position: 'relative', ...style }

  return (
    <StageContext.Provider value={ctx}>
      <div ref={ref} className={className} style={wrap} data-system-stage={mode} >
        {/* Fixed home stage has no SVG of its own: tier 0 shows each act's inline figure (§6.7). */}
        {!fixed && (
          <NetworkSVG
            act={act ?? 1}
            stage={stage}
            follow={follow}
            labels={labels}
            portrait={portrait}
            frame={frame}
            title={title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', visibility: svgHidden ? 'hidden' : undefined }}
          />
        )}
        {showLive && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: live ? 1 : 0,
              transition: `opacity ${BASE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            {tier === 2 ? <NetworkScene /> : <NetworkCanvas2D />}
            {labels && <SpatialLabelLayer />}
            {children}
          </div>
        )}
      </div>
    </StageContext.Provider>
  )
}

export default SystemStage
