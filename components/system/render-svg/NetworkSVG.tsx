// Tier 0: server-rendered static end state of an act (or journey stage). Also the no-JS and
// reduced-motion view (§4.5): same composition, labels in the DOM, packets as static dots.
'use client'

import { useMemo, type CSSProperties } from 'react'
import { EDGES, EDGE_A, EDGE_B, NODES, SYSTEMS, labelFor, CORE } from '../model/graph'
import { emptyPose, frame as fit, keyFor, poseAt, transpose } from '../model/layouts'
import { FIELD, FIELD_POINTS } from '../model/flow'
import { css } from '../model/palette'
import { useSystem } from '../runtime/useSystem'
import { MarkRects } from '../overlay/MarkBars'
import { place } from '../model/place'

const SYSTEM_NAMES: Record<string, string> = { acquire: 'Acquire', sell: 'Sell', operate: 'Operate', build: 'Build' }

export type NetworkSVGProps = {
  act: number
  stage?: number
  /** Follow the store's act/stage (lab, fixed fallbacks) instead of the props. */
  follow?: boolean
  /** true: flagged labels + system names. 'all': every capability. false: none. */
  labels?: boolean | 'all'
  portrait?: boolean
  /** Accessible name; without it the SVG is decorative (aria-hidden). */
  title?: string
  className?: string
  style?: CSSProperties
  /** Hide while the fixed home stage draws live (inline act figures on home). */
  hideWhenLive?: boolean
  /** Fit the composition to its visible nodes (inline figures). */
  frame?: boolean
}

export function NetworkSVG({ act, stage = 0, follow, labels = true, portrait, title, className, style, hideWhenLive, frame }: NetworkSVGProps) {
  const storeAct = useSystem('act')
  const storeStage = useSystem('stage')
  const live = useSystem('live')
  // Focus (System index, inspector): same rule as the live renderers (flow.ts): the focused system lights, the rest dims to 0.4.
  const focus = useSystem('focus')
  const fa = (i: number) => (!focus || NODES[i].system === focus || i === CORE ? 1 : 0.4)
  const focused = (i: number) => !!focus && NODES[i].system === focus
  const a = follow ? storeAct : act
  const s = follow ? storeStage : stage

  const p = useMemo(() => {
    const pose = poseAt(emptyPose(), keyFor(a, s))
    if (portrait) transpose(pose)
    if (frame) fit(pose)
    else pose.cam.set([0.5, 0.5, 1, 0])
    return pose
  }, [a, s, portrait, frame])

  const W = portrait ? 1000 : 1600
  const H = portrait ? 1600 : 1000
  const X = (i: number) => ((p.pos[i * 3] - p.cam[0]) * p.cam[2] + 0.5) * W
  const Y = (i: number) => ((p.pos[i * 3 + 1] - p.cam[1]) * p.cam[2] + 0.5) * H

  const edgePath = (e: number) => {
    const ax = X(EDGE_A[e]), ay = Y(EDGE_A[e]), bx = X(EDGE_B[e]), by = Y(EDGE_B[e])
    const bow = EDGES[e].bow
    const cx = (ax + bx) / 2 - (by - ay) * bow, cy = (ay + by) / 2 + (bx - ax) * bow
    return { d: `M${ax.toFixed(1)} ${ay.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`, mx: 0.25 * ax + 0.5 * cx + 0.25 * bx, my: 0.25 * ay + 0.5 * cy + 0.25 * by }
  }

  const centroids = SYSTEMS.map((sid) => {
    const ids = NODES.map((n, i) => (n.system === sid && p.node[i] >= 1 ? i : -1)).filter((i) => i >= 0)
    if (!ids.length) return null
    const cx = ids.reduce((v, i) => v + X(i), 0) / ids.length
    const top = Math.min(...ids.map(Y))
    return { sid, x: cx, y: top - 34 }
  })

  const markH = 140
  const font = 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)'

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ display: 'block', ...style, ...(hideWhenLive && live ? { visibility: 'hidden' } : null) }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {p.field > 0 && (
        <g opacity={p.field}>
          {Array.from({ length: FIELD_POINTS }, (_, i) => (
            <circle key={i} cx={((FIELD[i * 3] - p.cam[0]) * p.cam[2] + 0.5) * W} cy={((FIELD[i * 3 + 1] - p.cam[1]) * p.cam[2] + 0.5) * H} r={2} fill={css.dormant} />
          ))}
        </g>
      )}
      <g fill="none" strokeWidth={1.25} opacity={p.dim}>
        {EDGES.map((_, e) => {
          const lv = p.edge[e]
          if (lv < 0.3) return null
          const { d } = edgePath(e)
          const brokenEdge = lv < 1.5
          return (
            <path
              key={e}
              d={d}
              stroke={brokenEdge ? css.edgeBroken : lv >= 2.4 ? css.edgeHot : css.edge}
              strokeDasharray={brokenEdge ? '4 8' : undefined}
              opacity={(brokenEdge ? Math.min(1, lv) : 1) * Math.min(fa(EDGE_A[e]), fa(EDGE_B[e]))}
            />
          )
        })}
      </g>
      <g opacity={p.dim}>
        {/* Packets: static dots on active paths so flow direction stays legible. */}
        {EDGES.map((_, e) => {
          if (p.edge[e] < 2.4) return null
          const { mx, my } = edgePath(e)
          return <circle key={e} cx={mx} cy={my} r={3.5} fill={css.packet} opacity={Math.min(fa(EDGE_A[e]), fa(EDGE_B[e]))} />
        })}
        {NODES.map((n, i) => {
          const lv = focused(i) ? Math.max(p.node[i], 3) : p.node[i]
          if (lv < 0.5) return null
          const r = 3.5 + n.weight * 1.6
          const fill = lv >= 2.5 ? css.active : lv >= 1.5 ? css.idle : css.dormant
          return (
            <g key={n.id} opacity={fa(i)}>
              {lv >= 2.5 && <circle cx={X(i)} cy={Y(i)} r={r * 4} fill={css.glow} />}
              <circle cx={X(i)} cy={Y(i)} r={r} fill={fill} />
            </g>
          )
        })}
      </g>
      {labels && (
        <g fontFamily={font} fontSize={portrait ? 22 : 15} fill={css.label} letterSpacing="0.04em">
          {(() => {
            // Same greedy placement as the live overlay; mono glyphs ≈ 0.64em wide incl. tracking.
            const fs = portrait ? 22 : 15
            const placed: number[] = []
            return NODES.map((n, i) => {
              const show = (p.node[i] >= 1 || focused(i)) && (labels === 'all' || p.label[i] > 0.5 || focused(i)) && i !== CORE
              if (!show) return null
              const text = labelFor(n)
              const [x, y] = place(placed, X(i), Y(i), text.length * fs * 0.64, fs)
              return (
                <text key={n.id} x={x} y={y + fs * 0.8} opacity={fa(i)}>
                  {text}
                </text>
              )
            })
          })()}
          {centroids.map((c) =>
            c && p.mark < 0.5 ? (
              <text key={c.sid} x={c.x} y={c.y} textAnchor="middle" fill={css.text} fontSize={portrait ? 26 : 17} fontWeight={600}>
                {SYSTEM_NAMES[c.sid].toUpperCase()}
              </text>
            ) : null,
          )}
        </g>
      )}
      {p.mark > 0 && (
        <g transform={`translate(${X(CORE) - (66 * markH) / 140}, ${Y(CORE) - markH}) scale(${markH / 70})`}>
          <MarkRects rise={p.mark} />
        </g>
      )}
    </svg>
  )
}

export default NetworkSVG
