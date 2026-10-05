'use client'

// Every edge in one LineSegments2 with per-vertex colour (three/examples/jsm/lines, no drei).
// Each bowed edge is sampled into SEG segments; broken handoffs drop every other segment (dashed).
// Buffers are written in place each frame: no setPositions()/setColors() reallocation.
import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, NormalBlending, type InterleavedBufferAttribute } from 'three'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { EDGES, EDGE_A, EDGE_B } from '../model/graph'
import { edgeColor, isDashed } from '../model/flow'
import { mixInto, type RGBA } from '../model/palette'
import type { StageCtx } from '../stage/context'
import { wx, wy, wz } from './world'

const SEG = 10
const E = EDGES.length

export function SignalPath({ stage }: { stage: StageCtx }) {
  const size = useThree((s) => s.size)
  const line = useMemo(() => {
    const g = new LineSegmentsGeometry()
    g.setPositions(new Float32Array(E * SEG * 6))
    g.setColors(new Float32Array(E * SEG * 6))
    const m = new LineMaterial({ linewidth: 1, vertexColors: true, toneMapped: false })
    const l = new LineSegments2(g, m)
    l.frustumCulled = false
    l.renderOrder = 0
    return l
  }, [])
  const col = useMemo(() => [0, 0, 0, 0] as RGBA, [])

  useEffect(() => {
    const m = line.material
    const apply = () => {
      const add = stage.palette?.additive ?? true
      m.blending = add ? AdditiveBlending : NormalBlending
      m.transparent = add
      m.needsUpdate = true
    }
    apply()
    const prev = stage.onPalette
    stage.onPalette = () => {
      prev?.()
      apply()
    }
    return () => {
      stage.onPalette = prev
      line.geometry.dispose()
      m.dispose()
    }
  }, [stage, line])

  useFrame(() => {
    const p = stage.palette
    if (!p) return
    const f = stage.field, P = f.pose.pos
    line.material.resolution.set(size.width, size.height)
    line.material.linewidth = p.dark ? 1 : 1.2
    const posAttr = line.geometry.attributes.instanceStart as InterleavedBufferAttribute
    const colAttr = line.geometry.attributes.instanceColorStart as InterleavedBufferAttribute
    const pos = posAttr.data.array as Float32Array
    const cols = colAttr.data.array as Float32Array
    for (let e = 0; e < E; e++) {
      const a = EDGE_A[e] * 3, b = EDGE_B[e] * 3
      const lv = f.edgeLevel[e]
      const ax = P[a], ay = P[a + 1], bx = P[b], by = P[b + 1]
      const az = P[a + 2], bz = P[b + 2]
      const bow = EDGES[e].bow
      const cx = (ax + bx) / 2 - (by - ay) * bow, cy = (ay + by) / 2 + (bx - ax) * bow
      const dashed = isDashed(lv)
      edgeColor(col, p, lv, f.edgeBoost[e], f.edgeProx[e])
      for (let s = 0; s < SEG; s++) {
        const o = (e * SEG + s) * 6
        const hide = lv < 0.05 || (dashed && s % 2 === 1)
        for (let end = 0; end < 2; end++) {
          const t = (s + (hide ? 0 : end)) / SEG, mt = 1 - t
          pos[o + end * 3] = wx(mt * mt * ax + 2 * mt * t * cx + t * t * bx)
          pos[o + end * 3 + 1] = wy(mt * mt * ay + 2 * mt * t * cy + t * t * by)
          pos[o + end * 3 + 2] = wz(az + (bz - az) * t)
          mixInto(cols, o + end * 3, col, hide ? 0 : f.edgeA[e], p)
        }
      }
    }
    posAttr.data.needsUpdate = true
    colAttr.data.needsUpdate = true
  })

  return <primitive object={line} />
}
