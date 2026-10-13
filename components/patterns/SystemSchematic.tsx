'use client'

import { motion } from 'framer-motion'
import { trace, viewportOnce, useReducedMotion } from '@/lib/motion'

/**
 * P1 System schematic: inputs → capabilities → outputs, drawn from data (labels via content/).
 * md+: SVG with mono labels and an R2 trace on reveal. Below md: stacked lists on a vertical rail.
 */
export default function SystemSchematic({
  inputs,
  capabilities,
  outputs,
  notes,
  title,
  labels,
}: {
  inputs: string[]
  capabilities: string[]
  outputs: string[]
  /** Sub-tags per capability (grouped schematic): drawn as mono lines under each capability node. */
  notes?: string[][]
  /** Accessible description of the diagram. */
  title: string
  labels: { inputs: string; capabilities: string; outputs: string }
}) {
  const reduced = useReducedMotion()
  const ROW = 44
  // Grouped: each node carries its sub-tags as wrapped mono lines, so rows grow and the column widens.
  const lines = capabilities.map((_, i) => wrap(notes?.[i] ?? []))
  const capH = lines.map((l) => (l.length ? 36 + l.length * 16 : ROW))
  const capTotal = capH.reduce((a, b) => a + b, 0)
  const sideTotal = Math.max(inputs.length, outputs.length) * ROW
  const body = Math.max(capTotal, sideTotal)
  const H = body + 64
  const capW = notes ? 300 : 200
  const X = { in: 180, busIn: 330, cap: notes ? 400 : 420, busOut: 0, out: 0 }
  X.busOut = X.cap + capW + 70
  X.out = X.busOut + (notes ? 50 : 90)
  const top = 56 - ROW / 2
  const side = (n: number, i: number) => top + (body - n * ROW) / 2 + ROW / 2 + i * ROW
  const capY = capH.map((h, i) => top + (body - capTotal) / 2 + capH.slice(0, i).reduce((a, b) => a + b, 0) + (lines[i].length ? 22 : h / 2))
  const span = (ys: number[]) => [Math.min(...ys), Math.max(...ys)]
  const [c0, c1] = span(capY)

  const inY = inputs.map((_, i) => side(inputs.length, i))
  const outY = outputs.map((_, i) => side(outputs.length, i))
  const bus = (x: number, ys: number[]) => `M${x} ${Math.min(c0, ...ys)} V${Math.max(c1, ...ys)}`
  const paths: string[] = [
    ...(inY.length ? [...inY.map((iy) => `M${X.in} ${iy} H${X.busIn}`), bus(X.busIn, inY), ...capY.map((cy) => `M${X.busIn} ${cy} H${X.cap}`)] : []),
    ...(outY.length ? [...capY.map((cy) => `M${X.cap + capW} ${cy} H${X.busOut}`), bus(X.busOut, outY), ...outY.map((oy) => `M${X.busOut} ${oy} H${X.out}`)] : []),
  ]

  return (
    <figure>
      <svg viewBox={`0 0 960 ${H}`} className="hidden w-full md:block" role="img" aria-label={title}>
        <g className="fill-text-3 font-mono" fontSize={11} letterSpacing="0.04em">
          {inputs.length > 0 && <text x={X.in} y={24} textAnchor="end">{labels.inputs.toUpperCase()}</text>}
          <text x={X.cap} y={24}>{labels.capabilities.toUpperCase()}</text>
          {outputs.length > 0 && <text x={X.out} y={24}>{labels.outputs.toUpperCase()}</text>}
        </g>
        <motion.g initial="hidden" whileInView="show" viewport={viewportOnce} className="fill-none stroke-net-edge-hot" strokeWidth={1}>
          {paths.map((d, i) => (
            <motion.path key={i} d={d} variants={trace(reduced, Math.min(i, 6))} />
          ))}
        </motion.g>
        {inputs.map((l, i) => (
          <g key={l}>
            <circle cx={X.in} cy={inY[i]} r={5} className="fill-bg stroke-net-idle" />
            <text x={X.in - 14} y={inY[i] + 4} textAnchor="end" className="fill-text-2 font-mono" fontSize={12}>{l}</text>
          </g>
        ))}
        {capabilities.map((l, i) => (
          <g key={l}>
            <circle cx={X.cap} cy={capY[i]} r={5} className="fill-signal" />
            <text x={X.cap + 14} y={capY[i] + 4} className="fill-text font-mono" fontSize={12}>{l}</text>
            {lines[i].map((line, k) => (
              <text key={line} x={X.cap + 14} y={capY[i] + 24 + k * 16} className="fill-text-3 font-mono" fontSize={11}>{line}</text>
            ))}
          </g>
        ))}
        {outputs.map((l, i) => (
          <g key={l}>
            <circle cx={X.out} cy={outY[i]} r={5} className="fill-bg stroke-net-idle" />
            <text x={X.out + 14} y={outY[i] + 4} className="fill-text-2 font-mono" fontSize={12}>{l}</text>
          </g>
        ))}
      </svg>

      <div className="relative grid gap-6 pl-8 md:hidden">
        <span aria-hidden className="absolute bottom-2 left-1.5 top-2 w-px bg-net-edge-hot" />
        {([
          [labels.inputs, inputs, false],
          [labels.capabilities, capabilities, true],
          [labels.outputs, outputs, false],
        ] as const).filter(([, list]) => list.length > 0).map(([heading, list, lit]) => (
          <div key={heading} className="relative">
            <span aria-hidden className={lit ? 'absolute -left-8 top-0.5 size-3 rounded-full bg-signal' : 'absolute -left-8 top-0.5 size-3 rounded-full border border-net-idle bg-bg'} />
            <p className="font-mono text-data uppercase text-text-3">{heading}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {list.map((l, i) => (
                <li key={l} className={lit ? 'rounded-sm bg-signal-soft px-2 py-1 font-mono text-data text-text' : 'rounded-sm border border-line px-2 py-1 font-mono text-data text-text-2'}>
                  {l}
                  {lit && notes?.[i] && <span className="block text-data-s text-text-3">{notes[i].join(' · ')}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </figure>
  )
}

/** Join tags with ' · ' into lines of at most ~34 mono characters (fits the 300-unit column at 11px). */
function wrap(tags: string[], max = 34) {
  const out: string[] = []
  for (const t of tags) {
    const last = out[out.length - 1]
    if (last && last.length + 3 + t.length <= max) out[out.length - 1] = `${last} · ${t}`
    else out.push(t)
  }
  return out
}
