'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface NodeCfg {
  label: string
  radius: number
  speed: number   // radians/sec
  y: number       // world-space vertical position
  phase: number   // initial angle offset
  size: number    // sphere radius
}

const NODES: NodeCfg[] = [
  { label: 'Marketing', radius: 2.6, speed: 0.22, y:  0.9, phase: 0,               size: 0.13 },
  { label: 'Sales',     radius: 2.1, speed: 0.32, y:  0.0, phase: Math.PI * 0.55,  size: 0.11 },
  { label: 'Support',   radius: 2.9, speed: 0.18, y:  1.5, phase: Math.PI,         size: 0.12 },
  { label: 'Tech',      radius: 2.3, speed: 0.27, y:  0.5, phase: Math.PI * 1.5,   size: 0.10 },
]

function OrbNode({ cfg, reduceMotion }: { cfg: NodeCfg; reduceMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const g = groupRef.current
    if (!g) return
    const t = clock.elapsedTime
    const angle = cfg.phase + (reduceMotion ? 0 : t * cfg.speed)
    // Flatten Z orbit slightly so nodes read as 3-D depth without going behind bars too much
    g.position.x = cfg.radius * Math.cos(angle)
    g.position.z = cfg.radius * Math.sin(angle) * 0.55
    g.position.y = cfg.y + (reduceMotion ? 0 : Math.sin(t * 0.38 + cfg.phase) * 0.09)
  })

  // Compute initial position to avoid pop on first frame
  const initX = cfg.radius * Math.cos(cfg.phase)
  const initZ = cfg.radius * Math.sin(cfg.phase) * 0.55

  return (
    <group ref={groupRef} position={[initX, cfg.y, initZ]}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[cfg.size, 16, 16]} />
        <meshStandardMaterial
          color="#D2401A"
          emissive="#D2401A"
          emissiveIntensity={0.95}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>

      {/* Soft glow halo ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[cfg.size * 2.0, cfg.size * 0.35, 6, 28]} />
        <meshStandardMaterial
          color="#D2401A"
          emissive="#D2401A"
          emissiveIntensity={0.4}
          transparent
          opacity={0.28}
        />
      </mesh>

      {/* HTML label — stays upright, scales with distance */}
      <Html center distanceFactor={9} zIndexRange={[0, 10]}>
        <div
          style={{
            color: 'rgba(255,255,255,0.60)',
            fontSize: '9px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            padding: '2px 7px',
            background: 'rgba(8,9,11,0.72)',
            border: '1px solid rgba(210,64,26,0.32)',
            borderRadius: '4px',
            transform: 'translateY(15px)',
            letterSpacing: '0.04em',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {cfg.label}
        </div>
      </Html>
    </group>
  )
}

export default function OrbitNodes({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <>
      {NODES.map((cfg) => (
        <OrbNode key={cfg.label} cfg={cfg} reduceMotion={reduceMotion} />
      ))}
    </>
  )
}
