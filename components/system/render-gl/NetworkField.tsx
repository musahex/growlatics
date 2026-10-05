'use client'

// The network's draw order: background field points, then paths, nodes, packets.
// Field points are the dormant golden-angle field (act 1 only, 60 points).
import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three'
import { FIELD, FIELD_POINTS } from '../model/flow'
import type { StageCtx } from '../stage/context'
import { GrowthNode } from './GrowthNode'
import { SignalParticle } from './SignalParticle'
import { SignalPath } from './SignalPath'
import { view, wx, wy, wz } from './world'

function FieldPoints({ stage }: { stage: StageCtx }) {
  const pts = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(FIELD_POINTS * 3), 3))
    const m = new PointsMaterial({ size: 2.2, sizeAttenuation: false, transparent: true, depthWrite: false, toneMapped: false })
    const p = new Points(g, m)
    p.frustumCulled = false
    return p
  }, [])
  const state = useMemo(() => ({ aspect: 0 }), [])
  useFrame(() => {
    const p = stage.palette
    if (!p) return
    if (state.aspect !== view.aspect) {
      state.aspect = view.aspect
      const a = pts.geometry.attributes.position as BufferAttribute
      for (let i = 0; i < FIELD_POINTS; i++) a.setXYZ(i, wx(FIELD[i * 3]), wy(FIELD[i * 3 + 1]), wz(FIELD[i * 3 + 2]))
      a.needsUpdate = true
    }
    const f = stage.field.pose.field
    pts.visible = f > 0.01
    pts.material.color.setRGB(p.dormant[0] / 255, p.dormant[1] / 255, p.dormant[2] / 255)
    pts.material.opacity = p.dormant[3] * f
  })
  return <primitive object={pts} />
}

export function NetworkField({ stage }: { stage: StageCtx }) {
  return (
    <>
      <FieldPoints stage={stage} />
      <SignalPath stage={stage} />
      <GrowthNode stage={stage} />
      <SignalParticle stage={stage} />
    </>
  )
}
