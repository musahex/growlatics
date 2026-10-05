'use client'

// Tier 2 root. Only reached through next/dynamic from SystemStage, so three + R3F live in their
// own chunk. No own loop (frameloop="never"), no R3F pointer events, alpha canvas over the CSS
// background, unlit materials, no lights, shadows or postprocessing.
import { Canvas } from '@react-three/fiber'
import { useStage } from '../stage/context'
import { CameraRig } from './CameraRig'
import { NetworkField } from './NetworkField'
import { SceneEnvironment, initialDpr } from './SceneEnvironment'
import { BASE_DIST, FOV } from './world'

const noEvents = () => ({ enabled: false, priority: 0 })

export default function NetworkScene() {
  const stage = useStage()
  if (!stage) return null
  const dpr = initialDpr()
  return (
    <Canvas
      frameloop="never"
      events={noEvents}
      dpr={dpr}
      linear
      flat
      camera={{ fov: FOV, position: [0, 0, BASE_DIST], near: 0.1, far: 60 }}
      gl={{ antialias: dpr <= 1.25, powerPreference: 'high-performance', alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <SceneEnvironment stage={stage} />
      <CameraRig stage={stage} />
      <NetworkField stage={stage} />
    </Canvas>
  )
}
