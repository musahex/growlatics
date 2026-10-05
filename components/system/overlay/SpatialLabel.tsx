'use client'

// DOM labels positioned with transform from projected coordinates, scheduler order 30 (§6.6).
// One overlay per stage, not one portal per node.
import { useEffect, useRef, type ReactNode } from 'react'
import { CORE, EDGE_A, EDGE_B, EDGE_INDEX, LABEL_ORDER, NODES, NODE_INDEX, SYSTEMS, labelFor, systemName } from '../model/graph'
import { css } from '../model/palette'
import { sys } from '../runtime/store'
import { useStage } from '../stage/context'
import { MarkRects } from './MarkBars'
import { place, reserveNode } from '../model/place'

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

const nameStyle = { ...labelStyle, font: '600 12px/1 var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', letterSpacing: '0.08em', color: css.text } as const

/** Capability labels for every node, the four system names (acts 1, 3, 5) and the act-9/intro mark at the core. */
export function SpatialLabelLayer() {
  const stage = useStage()
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const nameRefs = useRef<(HTMLSpanElement | null)[]>([])
  const mark = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!stage) return
    const last = new Float32Array(NODES.length).fill(-1)
    const lastName = new Float32Array(SYSTEMS.length).fill(-1)
    const width = new Float32Array(NODES.length) // measured once per label (fixed font)
    const nameW = new Float32Array(SYSTEMS.length)
    const slot = new Uint8Array(NODES.length) // last placement, tried first (no flicker)
    const placed: number[] = [] // x, y, w of boxes already taken this frame (shared rule: model/place.ts)
    let lastMark = -1
    const fade = (el: HTMLElement, store: Float32Array, i: number, a: number) => {
      if (a !== store[i]) el.style.opacity = String((store[i] = a))
    }
    const fn = () => {
      const f = stage.field
      const S = f.screen
      const maxX = stage.rect.width || Infinity
      placed.length = 0
      for (let i = 0; i < NODES.length; i++) if (f.level[i] >= 1) reserveNode(placed, S[i * 2], S[i * 2 + 1], 3 * f.size[i] + 1, 11)
      // System names above each cluster, placed before the capability labels.
      SYSTEMS.forEach((sid, k) => {
        const el = nameRefs.current[k]
        if (!el) return
        let sx = 0, top = Infinity, n = 0, fa = 1
        for (let i = 0; i < NODES.length; i++) {
          if (NODES[i].system !== sid || f.level[i] < 1) continue
          sx += S[i * 2]
          top = Math.min(top, S[i * 2 + 1])
          fa = f.focusA[i]
          n++
        }
        const a = n ? Math.round(f.pose.names * f.pose.dim * fa * (1 - f.pose.mark) * 100) / 100 : 0
        fade(el, lastName, k, a)
        if (a <= 0) return
        if (!nameW[k]) nameW[k] = el.offsetWidth || 60
        const x = Math.max(0, Math.min(maxX - nameW[k], sx / n - nameW[k] / 2))
        const y = top - 30
        placed.push(x, y, nameW[k])
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`
      })
      for (const i of LABEL_ORDER) {
        const el = refs.current[i]
        if (!el) continue
        let a = Math.round(f.labelA[i] * Math.min(1, f.level[i]) * f.pose.dim * 100) / 100
        if (a > 0) {
          if (!width[i]) width[i] = el.offsetWidth || 80
          const at = place(placed, S[i * 2], S[i * 2 + 1], width[i], 11, slot[i], maxX)
          if (at) {
            slot[i] = at[2]
            el.style.transform = `translate3d(${at[0].toFixed(1)}px,${at[1].toFixed(1)}px,0)`
          } else a = 0
        }
        fade(el, last, i, a)
      }
      const m = Math.round(f.pose.mark * 100) / 100
      const el = mark.current
      if (el) {
        if (m !== lastMark) el.style.opacity = String((lastMark = m))
        if (m > 0) el.style.transform = `translate3d(${S[CORE * 2].toFixed(1)}px,${S[CORE * 2 + 1].toFixed(1)}px,0) translate(-50%,-100%) scaleY(${Math.min(1, m * 1.2).toFixed(3)})`
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
      {SYSTEMS.map((sid, k) => (
        <span key={sid} ref={(el) => void (nameRefs.current[k] = el)} style={sid === 'sell' ? { ...nameStyle, color: css.signalInk } : nameStyle}>
          {systemName(sid).toUpperCase()}
        </span>
      ))}
      <div ref={mark} style={{ position: 'absolute', left: 0, top: 0, width: 92, height: 96, opacity: 0, transformOrigin: '50% 100%', willChange: 'transform, opacity' }}>
        <svg viewBox="0 0 66 70" width="100%" height="100%" aria-hidden>
          <MarkRects />
        </svg>
      </div>
    </div>
  )
}

export default SpatialLabel
