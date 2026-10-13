'use client'

// Instanced capability nodes (sphere 12×8, unlit) plus camera-facing halo sprites for lit nodes.
// Updated with setMatrixAt/setColorAt; nothing is allocated per frame.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, Color, InstancedMesh, MeshBasicMaterial, NormalBlending, Object3D, PlaneGeometry, SphereGeometry } from 'three'
import { NODES } from '../model/graph'
import { levelColor } from '../model/flow'
import { SPRITE_STOPS, mixInto, type RGBA } from '../model/palette'
import type { StageCtx } from '../stage/context'
import { view, wx, wy, wz } from './world'

const N = NODES.length
export const SPHERE = new SphereGeometry(1, 12, 8)
export const PLANE = new PlaneGeometry(1, 1)

let haloTex: CanvasTexture | null = null
/** One soft radial sprite shared by node and packet halos (made once). */
export function haloTexture() {
  if (haloTex) return haloTex
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  for (const [o, c] of SPRITE_STOPS) grad.addColorStop(o, c)
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  haloTex = new CanvasTexture(c)
  return haloTex
}

export function GrowthNode({ stage }: { stage: StageCtx }) {
  const nodes = useRef<InstancedMesh>(null)
  const halos = useRef<InstancedMesh>(null)
  const camera = useThree((s) => s.camera)
  const mats = useMemo(
    () => ({
      node: new MeshBasicMaterial({ toneMapped: false }),
      halo: new MeshBasicMaterial({ map: haloTexture(), transparent: true, depthWrite: false, toneMapped: false }),
    }),
    [],
  )
  const tmp = useMemo(() => ({ o: new Object3D(), c: new Color(), col: [0, 0, 0, 0] as RGBA, rgb: new Float32Array(3) }), [])

  useEffect(() => {
    const apply = () => {
      const add = stage.palette?.additive ?? true
      mats.node.blending = add ? AdditiveBlending : NormalBlending
      mats.halo.blending = add ? AdditiveBlending : NormalBlending
      mats.node.needsUpdate = mats.halo.needsUpdate = true
    }
    apply()
    const prev = stage.onPalette
    stage.onPalette = () => {
      prev?.()
      apply()
    }
    return () => {
      stage.onPalette = prev
      mats.node.dispose()
      mats.halo.dispose()
    }
  }, [stage, mats])

  useFrame(() => {
    const p = stage.palette, nm = nodes.current, hm = halos.current
    if (!p || !nm || !hm) return
    const f = stage.field, P = f.pose.pos, { o, c, col, rgb } = tmp
    for (let i = 0; i < N; i++) {
      const lv = f.level[i]
      o.position.set(wx(P[i * 3]), wy(P[i * 3 + 1]), wz(P[i * 3 + 2]))
      o.quaternion.identity()
      o.scale.setScalar(lv < 0.05 ? 0 : 0.045 * view.scale * f.size[i] * (1 + f.prox[i] * 0.2))
      o.updateMatrix()
      nm.setMatrixAt(i, o.matrix)
      levelColor(col, p, lv)
      mixInto(rgb, 0, col, Math.min(1, f.alpha[i] + f.prox[i] * 0.38), p)
      nm.setColorAt(i, c.setRGB(rgb[0], rgb[1], rgb[2]))

      const h = lv > 2 ? (lv - 1) * f.alpha[i] * (1 + f.prox[i] * 1.5) : 0
      o.quaternion.copy(camera.quaternion)
      o.scale.setScalar(h > 0.01 ? 0.045 * view.scale * f.size[i] * 11 : 0)
      o.updateMatrix()
      hm.setMatrixAt(i, o.matrix)
      mixInto(rgb, 0, p.glow, h * 2, p)
      hm.setColorAt(i, c.setRGB(rgb[0], rgb[1], rgb[2]))
    }
    nm.instanceMatrix.needsUpdate = hm.instanceMatrix.needsUpdate = true
    if (nm.instanceColor) nm.instanceColor.needsUpdate = true
    if (hm.instanceColor) hm.instanceColor.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={halos} args={[PLANE, mats.halo, N]} frustumCulled={false} renderOrder={1} />
      <instancedMesh ref={nodes} args={[SPHERE, mats.node, N]} frustumCulled={false} renderOrder={2} />
    </>
  )
}
