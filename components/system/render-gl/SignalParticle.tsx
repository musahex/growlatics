'use client'

// Instanced packets (leads, conversations, customers moving through the system) with halos.
// The last instance is the journey's hero packet (2× size).
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, Color, InstancedMesh, MeshBasicMaterial, NormalBlending, Object3D } from 'three'
import { MAX_PACKETS } from '../model/flow'
import { mixInto } from '../model/palette'
import type { StageCtx } from '../stage/context'
import { PLANE, SPHERE, haloTexture } from './GrowthNode'
import { view, wx, wy, wz } from './world'

const COUNT = MAX_PACKETS + 1

export function SignalParticle({ stage }: { stage: StageCtx }) {
  const cores = useRef<InstancedMesh>(null)
  const halos = useRef<InstancedMesh>(null)
  const camera = useThree((s) => s.camera)
  const mats = useMemo(
    () => ({
      core: new MeshBasicMaterial({ toneMapped: false }),
      halo: new MeshBasicMaterial({ map: haloTexture(), transparent: true, depthWrite: false, toneMapped: false }),
    }),
    [],
  )
  const tmp = useMemo(() => ({ o: new Object3D(), c: new Color(), rgb: new Float32Array(3) }), [])

  useEffect(() => {
    const apply = () => {
      const add = stage.palette?.additive ?? true
      mats.core.blending = mats.halo.blending = add ? AdditiveBlending : NormalBlending
      mats.core.needsUpdate = mats.halo.needsUpdate = true
    }
    apply()
    const prev = stage.onPalette
    stage.onPalette = () => {
      prev?.()
      apply()
    }
    return () => {
      stage.onPalette = prev
      mats.core.dispose()
      mats.halo.dispose()
    }
  }, [stage, mats])

  useFrame(() => {
    const p = stage.palette, cm = cores.current, hm = halos.current
    if (!p || !cm || !hm) return
    const f = stage.field, { o, c, rgb } = tmp
    for (let i = 0; i < COUNT; i++) {
      let a = 0, x = 0, y = 0, z = 0, s = 1
      if (i < MAX_PACKETS) {
        const k = f.packets[i]
        if (k.alive) {
          a = 0.9 * f.pose.dim * (k.leak > 0 ? Math.max(0, 1 - k.leak / 1.2) : Math.min(1, k.t * 10, (1 - k.t) * 10, 1))
          if (stage.still) a = 0.9 * f.pose.dim
          x = k.x
          y = k.y
          z = k.z
        }
      } else {
        a = f.hero.a
        x = f.hero.x
        y = f.hero.y
        z = f.hero.z
        s = 2
      }
      o.position.set(wx(x), wy(y), wz(z) + 0.02)
      o.quaternion.identity()
      o.scale.setScalar(a > 0.01 ? 0.022 * s * view.scale : 0)
      o.updateMatrix()
      cm.setMatrixAt(i, o.matrix)
      mixInto(rgb, 0, p.packet, a, p)
      cm.setColorAt(i, c.setRGB(rgb[0], rgb[1], rgb[2]))
      o.quaternion.copy(camera.quaternion)
      o.scale.setScalar(a > 0.01 ? 0.2 * s * view.scale : 0)
      o.updateMatrix()
      hm.setMatrixAt(i, o.matrix)
      mixInto(rgb, 0, p.packet, a * 0.6, p)
      hm.setColorAt(i, c.setRGB(rgb[0], rgb[1], rgb[2]))
    }
    cm.instanceMatrix.needsUpdate = hm.instanceMatrix.needsUpdate = true
    if (cm.instanceColor) cm.instanceColor.needsUpdate = true
    if (hm.instanceColor) hm.instanceColor.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={halos} args={[PLANE, mats.halo, COUNT]} frustumCulled={false} renderOrder={3} />
      <instancedMesh ref={cores} args={[SPHERE, mats.core, COUNT]} frustumCulled={false} renderOrder={4} />
    </>
  )
}
