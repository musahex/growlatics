'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// Each bar: world-unit height, brand-orange palette darkening toward shorter bars
const BAR_DATA = [
  { x: -2.0, height: 0.85, color: '#5C1B09', emissive: '#3A0D05', ei: 0.4 },
  { x: -1.0, height: 1.25, color: '#832413', emissive: '#50160C', ei: 0.5 },
  { x:  0.0, height: 1.05, color: '#A03018', emissive: '#66200F', ei: 0.6 },
  { x:  1.0, height: 1.75, color: '#C03A1A', emissive: '#8A2510', ei: 0.7 },
  { x:  2.0, height: 2.30, color: '#D2401A', emissive: '#D2401A', ei: 1.0 },
] as const

interface BarProps {
  x: number
  height: number
  color: string
  emissive: string
  ei: number
  index: number
  reduceMotion: boolean
}

function Bar({ x, height, color, emissive, ei, index, reduceMotion }: BarProps) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return

    const t = clock.elapsedTime
    const delay = index * 0.18
    const elapsed = Math.max(0, t - delay)

    // Ease-out cubic entry (1.2 s duration)
    const raw = reduceMotion ? 1 : Math.min(elapsed / 1.2, 1)
    const eased = 1 - Math.pow(1 - raw, 3)

    // Gentle vertical float after entry
    const float = reduceMotion ? 0 : Math.sin(t * 0.55 + index * 1.15) * 0.04 * eased

    mesh.scale.y = Math.max(eased, 0.001)
    // Keep base at y=0 by offsetting centre as scale grows
    mesh.position.y = (height * eased) / 2 + float
  })

  return (
    <RoundedBox
      ref={ref}
      args={[0.5, height, 0.5]}
      radius={0.07}
      smoothness={3}
      position={[x, 0, 0]}
      castShadow={false}
      receiveShadow={false}
    >
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={ei}
        roughness={0.28}
        metalness={0.12}
      />
    </RoundedBox>
  )
}

export default function GrowthBars({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    // Group shifted downward so bars rise from the lower third of the canvas
    <group position={[0, -1.15, 0]}>
      {BAR_DATA.map((bar, i) => (
        <Bar key={bar.x} {...bar} index={i} reduceMotion={reduceMotion} />
      ))}
    </group>
  )
}
