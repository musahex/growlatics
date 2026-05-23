'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import GrowthBars from './GrowthBars'
import OrbitNodes from './OrbitNodes'

interface Props {
  reduceMotion: boolean
}

// Wraps the whole scene — provides cursor-responsive parallax rotation
function SceneRoot({ reduceMotion }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reduceMotion || typeof window === 'undefined') return
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduceMotion])

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    // Subtle tilt — never more than ~4° on any axis
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, mouse.current.x * 0.07, 0.04)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, mouse.current.y * 0.035, 0.04)
  })

  return (
    <group ref={groupRef}>
      <GrowthBars reduceMotion={reduceMotion} />
      <OrbitNodes reduceMotion={reduceMotion} />
    </group>
  )
}

export default function HeroGrowthScene({ reduceMotion }: Props) {
  return (
    <Canvas
      // Camera positioned slightly above origin, well back from the scene
      camera={{ position: [0, 0.5, 7.5], fov: 44 }}
      // Cap pixel ratio — avoids GPU thrash on 3× Retina displays
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      // Transparent so the glass card background shows through
      style={{ background: 'transparent' }}
    >
      {/* Ambient base light */}
      <ambientLight intensity={0.45} />

      {/* Key light — warm orange from upper right, main illumination for bars */}
      <pointLight position={[3.5, 5, 3]} color="#D2401A" intensity={3.5} />

      {/* Fill light — softer orange from left, lifts shadows */}
      <pointLight position={[-2.5, 2, 4]} color="#FF7050" intensity={1.0} />

      {/* Bounce/rim — deep red below, adds depth to bar bases */}
      <pointLight position={[0, -2, 2]} color="#7B1D08" intensity={1.8} />

      <SceneRoot reduceMotion={reduceMotion} />
    </Canvas>
  )
}
