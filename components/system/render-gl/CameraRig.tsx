'use client'

// Camera from the pose (focus, zoom, tilt); through the journey it rides a CatmullRomCurve3 through
// the five stage waypoints (§7 act 4). Pointer parallax ±0.35 (±0.2 in the journey). Also projects
// every node into field.screen for labels, proximity and the cursor.
import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3, type PerspectiveCamera } from 'three'
import { NODES } from '../model/graph'
import { KEYS, keyFor } from '../model/layouts'
import { sys } from '../runtime/store'
import { damp } from '../runtime/scheduler'
import type { StageCtx } from '../stage/context'
import { BASE_DIST, distFor, view, wx, wy, wz } from './world'

const J0 = keyFor(4, 0)
const J4 = keyFor(4, 4)

export function CameraRig({ stage }: { stage: StageCtx }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  const tmp = useMemo(() => ({ focus: new Vector3(), look: new Vector3(), v: new Vector3(), par: { x: 0, y: 0 } }), [])
  const curve = useMemo(() => new CatmullRomCurve3([0, 1, 2, 3, 4].map(() => new Vector3())), [])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const f = stage.field
    view.aspect = size.width / Math.max(1, size.height)
    if (camera.aspect !== view.aspect) {
      camera.aspect = view.aspect
      camera.updateProjectionMatrix()
    }
    const cam = f.pose.cam
    const dist = distFor(cam[2])
    view.scale = Math.pow(dist / BASE_DIST, 0.7)
    const kp = f.kp
    if (kp >= J0 && kp <= J4) {
      for (let s = 0; s < 5; s++) {
        const c = KEYS[J0 + s].cam
        curve.points[s].set(wx(c[0]), wy(c[1]), 0)
      }
      curve.getPoint((kp - J0) / (J4 - J0), tmp.focus) // getPoint, not getPointAt: no arc-length table rebuild per frame
    } else tmp.focus.set(wx(cam[0]), wy(cam[1]), 0)

    const amp = kp >= J0 && kp <= J4 ? 0.2 : 0.35
    const ptr = sys.pointer
    const nx = stage.pointerFx && ptr.active ? (ptr.sx / (sys.viewport.w || 1)) * 2 - 1 : 0
    const ny = stage.pointerFx && ptr.active ? (ptr.sy / (sys.viewport.h || 1)) * 2 - 1 : 0
    tmp.par.x = damp(tmp.par.x, nx * amp, 3.5, dt)
    tmp.par.y = damp(tmp.par.y, -ny * amp, 3.5, dt)
    const tilt = (cam[3] * Math.PI) / 180
    camera.position.set(tmp.focus.x + tmp.par.x, tmp.focus.y + tmp.par.y + Math.tan(tilt) * dist, tmp.focus.z + dist)
    tmp.look.copy(tmp.focus)
    camera.lookAt(tmp.look)
    camera.updateMatrixWorld()

    // Project nodes → stage px.
    const P = f.pose.pos
    for (let i = 0; i < NODES.length; i++) {
      tmp.v.set(wx(P[i * 3]), wy(P[i * 3 + 1]), wz(P[i * 3 + 2])).project(camera)
      f.screen[i * 2] = (tmp.v.x + 1) * 0.5 * size.width
      f.screen[i * 2 + 1] = (1 - tmp.v.y) * 0.5 * size.height
    }
  })
  return null
}
