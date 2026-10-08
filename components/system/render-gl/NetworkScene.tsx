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
import { setTierOverride } from '../runtime/SystemProvider'

const noEvents = () => ({ enabled: false, priority: 0 })

// Context loss (GPU reset, driver crash, tab memory pressure): three.js waits for a restore. If none
// comes within 2s, drop to the Canvas2D tier so the network never vanishes behind its labels.
const onLoss = ({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
  const c = gl.domElement
  let t: ReturnType<typeof setTimeout> | undefined
  c.addEventListener('webglcontextlost', () => (t = setTimeout(() => setTierOverride(1), 2000)))
  c.addEventListener('webglcontextrestored', () => clearTimeout(t))
}

export default function NetworkScene() {
  const stage = useStage()
  if (!stage) return null
  const dpr = initialDpr()
  return (
    <Canvas
      frameloop="never"
      events={noEvents}
      // No scroll listener of its own (react-use-measure): size comes from ResizeObserver; offsets only matter for R3F pointer events, which are off.
      resize={{ scroll: false }}
      dpr={dpr}
      linear
      flat
      camera={{ fov: FOV, position: [0, 0, BASE_DIST], near: 0.1, far: 60 }}
      gl={{ antialias: dpr <= 1.25, powerPreference: 'high-performance', alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={onLoss}
    >
      <SceneEnvironment stage={stage} />
      <CameraRig stage={stage} />
      <NetworkField stage={stage} />
    </Canvas>
  )
}
