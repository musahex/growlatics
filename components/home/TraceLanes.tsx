'use client'

// Act 6 trace comparison (DIRECTION §7): one lead through separate vendors (stalls at each broken handoff,
// drops at the third) and through one connected system (arrives). No numbers; the gaps are the evidence.
import { useState } from 'react'
import { motion } from 'framer-motion'
import { getLabel, homeUi, systems } from '@/content'
import { viewportOnce, useReducedMotion } from '@/lib/motion'
import Button from '@/components/ui/Button'

const X = [80, 320, 560, 800]
const SEG = X[1] - X[0]
const OWNERS = systems.map((s) => s.verb)
const mono = { fontFamily: 'var(--font-mono, ui-monospace, monospace)', fontSize: 13, letterSpacing: '0.04em' }

function Lane({ y, broken, label, run, reduced }: { y: number; broken: boolean; label: string; run: number; reduced: boolean }) {
  // Top lane: move, stall at a gap, move, stall, then fall out of the graph mid-gap. Bottom: one continuous run.
  const top = {
    x: [0, SEG, SEG, SEG * 2, SEG * 2, SEG * 2.5, SEG * 2.55],
    y: [0, 0, 0, 0, 0, 0, 28],
    opacity: [1, 1, 0.6, 0.6, 0.6, 0.6, 0],
    times: [0, 0.22, 0.38, 0.6, 0.76, 0.88, 1],
  }
  const end = broken ? { x: SEG * 2.55, y: 28, opacity: 0.35 } : { x: SEG * 3, y: 0, opacity: 1 }
  return (
    <g>
      <text x={X[0] - 8} y={y - 28} className="fill-text-2" style={{ ...mono, fontWeight: 600 }}>
        {label.toUpperCase()}
      </text>
      {X.slice(1).map((x, i) =>
        broken ? (
          <g key={x} fill="none" strokeWidth={1.25}>
            <path d={`M${X[i] + 10} ${y}H${x - SEG / 2 - 14}`} className="stroke-net-edge" />
            <path d={`M${x - SEG / 2 + 14} ${y}H${x - 10}`} className="stroke-net-edge" />
            <path d={`M${x - SEG / 2 - 14} ${y}H${x - SEG / 2 + 14}`} className="stroke-net-edge-broken" strokeDasharray="3 6" />
          </g>
        ) : (
          <path key={x} d={`M${X[i] + 10} ${y}H${x - 10}`} fill="none" strokeWidth={1.25} className="stroke-net-edge-hot" />
        ),
      )}
      {X.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={y} r={7} className={broken ? 'fill-net-idle' : 'fill-net-active'} />
          {broken && (
            <text x={x} y={y + 30} textAnchor="middle" className="fill-text-3" style={mono}>
              {OWNERS[i]}
            </text>
          )}
        </g>
      ))}
      <motion.circle
        key={run}
        cx={X[0]}
        cy={y}
        r={6}
        className="fill-net-packet"
        initial={reduced ? end : { x: 0, y: 0, opacity: 1 }}
        whileInView={
          reduced
            ? { ...end, transition: { duration: 0 } }
            : broken
              ? { x: top.x, y: top.y, opacity: top.opacity, transition: { duration: 4.2, times: top.times, ease: 'linear' } }
              : { x: SEG * 3, transition: { duration: (4.2 * 0.6) / 0.88, ease: 'linear' } }
        }
        viewport={viewportOnce}
      />
    </g>
  )
}

export default function TraceLanes() {
  const reduced = useReducedMotion()
  const [run, setRun] = useState(0)
  return (
    <figure>
      <svg viewBox="0 0 900 300" className="w-full" role="img" aria-label={homeUi.figures.trace}>
        <Lane y={70} broken label={homeUi.lanes.separate} run={run} reduced={reduced} />
        {/* One owner across the whole route. */}
        <path d={`M${X[0] - 20} 244H${X[3] + 20}`} className="stroke-signal-line" strokeWidth={1} />
        <text x={(X[0] + X[3]) / 2} y={270} textAnchor="middle" className="fill-text-3" style={mono}>
          {getLabel('core')}
        </text>
        <Lane y={210} broken={false} label={homeUi.lanes.connected} run={run} reduced={reduced} />
      </svg>
      {!reduced && (
        <Button variant="text" onClick={() => setRun((r) => r + 1)} className="mt-2">
          {homeUi.lanes.replay}
        </Button>
      )}
    </figure>
  )
}
