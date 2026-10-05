'use client'

// DOM labels positioned with transform from projected coordinates, scheduler order 30 (§6.6).
// One overlay per stage, not one portal per node.
import { useEffect, useRef, type ReactNode } from 'react'
import { CORE, EDGE_A, EDGE_B, EDGE_INDEX, NODES, NODE_INDEX, labelFor } from '../model/graph'
import { css } from '../model/palette'
import { sys } from '../runtime/store'
import { useStage } from '../stage/context'
import { MarkRects } from './MarkBars'
import { place } from '../model/place'

const labelStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  font: '500 11px/1 var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
  letterSpacing: '0.04em',
  color: css.label,
  whiteSpace: 'nowrap',
  opacity: 0,
  willChange: 'transform, opacity',
  pointerEvents: 'none',
} as const

/** A callout anchored to a node or to the middle of an edge (e.g. act 2 leak gaps). */
export function SpatialLabel({ node, edge, act, dx = 12, dy = -6, children }: { node?: string; edge?: string; /** Show only while this act is current. */ act?: number; dx?: number; dy?: number; children: ReactNode }) {
  const stage = useStage()
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!stage) return
    const ni = node ? NODE_INDEX[node] : -1
    const ei = edge ? EDGE_INDEX[edge] : -1
    let lastA = -1
    const fn = () => {
      const el = ref.current
      const s = stage.field.screen
      if (!el) return
      let x: number, y: number, a: number
      if (ni >= 0) {
        x = s[ni * 2]
        y = s[ni * 2 + 1]
        a = Math.min(1, stage.field.level[ni])
      } else if (ei >= 0) {
        const p = EDGE_A[ei], q = EDGE_B[ei]
        x = (s[p * 2] + s[q * 2]) / 2
        y = (s[p * 2 + 1] + s[q * 2 + 1]) / 2
        a = Math.min(1, stage.field.edgeLevel[ei])
      } else return
      if (act !== undefined && sys.act.index !== act) a = 0
      el.style.transform = `translate3d(${(x + dx).toFixed(1)}px,${(y + dy).toFixed(1)}px,0)`
      const r = Math.round(a * 100) / 100
      if (r !== lastA) el.style.opacity = String((lastA = r))
    }
    stage.overlays.add(fn)
    return () => void stage.overlays.delete(fn)
  }, [stage, node, edge, act, dx, dy])
  return (
    <span ref={ref} style={labelStyle}>
      {children}
    </span>
  )
}

/** Capability labels for every node (visibility from the field) and the act-9/intro mark at the core. */
export function SpatialLabelLayer() {
  const stage = useStage()
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const mark = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!stage) return
    const last = new Float32Array(NODES.length).fill(-1)
    const width = new Float32Array(NODES.length) // measured once per label (fixed font)
    const slot = new Uint8Array(NODES.length) // last placement, tried first (no flicker)
    const placed: number[] = [] // x, y, w of labels already placed this frame (shared rule: model/place.ts)
    let lastMark = -1
    const fn = () => {
      const f = stage.field
      placed.length = 0
      for (let i = 0; i < NODES.length; i++) {
        const el = refs.current[i]
        if (!el) continue
        const a = Math.round(f.labelA[i] * Math.min(1, f.level[i]) * f.pose.dim * 100) / 100
        if (a !== last[i]) el.style.opacity = String((last[i] = a))
        if (a <= 0) continue
        if (!width[i]) width[i] = el.offsetWidth || 80
        const [x, y, k] = place(placed, f.screen[i * 2], f.screen[i * 2 + 1], width[i], 11, slot[i], stage.rect.width || Infinity)
        slot[i] = k
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`
      }
      const m = Math.round(f.pose.mark * 100) / 100
      const el = mark.current
      if (el) {
        if (m !== lastMark) el.style.opacity = String((lastMark = m))
        if (m > 0) el.style.transform = `translate3d(${f.screen[CORE * 2].toFixed(1)}px,${f.screen[CORE * 2 + 1].toFixed(1)}px,0) translate(-50%,-100%) scaleY(${Math.min(1, m * 1.2).toFixed(3)})`
      }
    }
    stage.overlays.add(fn)
    return () => void stage.overlays.delete(fn)
  }, [stage])

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 'var(--z-stage, 20)' as unknown as number }}>
      {NODES.map((n, i) =>
        n.system === 'core' ? null : (
          <span key={n.id} ref={(el) => void (refs.current[i] = el)} style={labelStyle}>
            {labelFor(n)}
          </span>
        ),
      )}
      <div ref={mark} style={{ position: 'absolute', left: 0, top: 0, width: 92, height: 96, opacity: 0, transformOrigin: '50% 100%', willChange: 'transform, opacity' }}>
        <svg viewBox="0 0 66 70" width="100%" height="100%" aria-hidden>
          <MarkRects />
        </svg>
      </div>
    </div>
  )
}

export default SpatialLabel
