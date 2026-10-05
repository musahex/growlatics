'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  useScroll,
  useMotionValueEvent,
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { bgHex, signalHex, text4Hex, textHex } from '@/lib/tokens'
import { cn } from '@/lib/utils'
import { journey } from '@/content'
import { swap } from '@/lib/motion'
import Mark from '@/components/brand/Mark'
import SignalRail from '@/components/patterns/SignalRail'
import SectionHeader from '@/components/ui/SectionHeader'

// ─── Data ───────────────────────────────────────────────────────────────────

const STAGES = journey.stages

// Node positions in 3D space — gentle arc with depth variation
const NODE_POS: [number, number, number][] = [
  [-3.2,  0.4,  0.2],
  [-1.6,  1.0, -0.6],
  [ 0.0,  0.3, -1.2],
  [ 1.6, -0.4, -0.6],
  [ 3.2,  0.6,  0.2],
]

// Camera positions per stage [x, y, z]
const CAM_POS: [number, number, number][] = [
  [-1.2, 1.4, 9.0],
  [-0.4, 1.6, 8.5],
  [ 0.2, 1.2, 8.0],
  [ 0.9, 0.9, 8.5],
  [ 1.6, 1.4, 9.0],
]

// ─── Three.js scene components ───────────────────────────────────────────────

function GrowthNode({
  pos,
  isActive,
}: {
  pos: [number, number, number]
  isActive: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    const targetScale = isActive ? 1.55 : 1.0
    const targetOpacity = isActive ? 1.0 : 0.18
    const targetEmissive = isActive ? 0.9 : 0.0

    const cur = meshRef.current.scale.x
    const next = cur + (targetScale - cur) * 0.06
    meshRef.current.scale.setScalar(next)

    mat.opacity += (targetOpacity - mat.opacity) * 0.06
    mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.06
  })

  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        color={signalHex}
        transparent
        opacity={0.18}
        emissive={signalHex}
        emissiveIntensity={0}
        roughness={0.12}
        metalness={0.65}
      />
    </mesh>
  )
}

// Halo ring that grows around the active node
function HaloRing({ stage }: { stage: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    const [tx, ty, tz] = NODE_POS[stage]
    meshRef.current.position.x += (tx - meshRef.current.position.x) * 0.06
    meshRef.current.position.y += (ty - meshRef.current.position.y) * 0.06
    meshRef.current.position.z += (tz - meshRef.current.position.z) * 0.06
    // Slow spin
    meshRef.current.rotation.z += 0.004
    meshRef.current.rotation.x += 0.002
  })

  return (
    <mesh ref={meshRef} position={NODE_POS[0]}>
      <torusGeometry args={[0.42, 0.012, 8, 64]} />
      <meshBasicMaterial color={signalHex} transparent opacity={0.35} />
    </mesh>
  )
}

// Point light that lerps toward the active node
function ActiveLight({ stage }: { stage: number }) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (!lightRef.current) return
    const [tx, ty, tz] = NODE_POS[stage]
    lightRef.current.position.x += (tx - lightRef.current.position.x) * 0.06
    lightRef.current.position.y += (ty - lightRef.current.position.y) * 0.06
    lightRef.current.position.z += (tz - lightRef.current.position.z) * 0.06
  })

  return (
    <pointLight
      ref={lightRef}
      position={NODE_POS[0]}
      color={signalHex}
      intensity={2.8}
      distance={5}
    />
  )
}

// Camera lerps toward the target position for each stage
function CameraController({ stage }: { stage: number }) {
  const { camera } = useThree()

  useFrame(() => {
    const [tx, ty, tz] = CAM_POS[stage]
    camera.position.x += (tx - camera.position.x) * 0.04
    camera.position.y += (ty - camera.position.y) * 0.04
    camera.position.z += (tz - camera.position.z) * 0.04
    camera.lookAt(0, 0.3, -0.4)
  })

  return null
}

// Subtle floating particles
function Particles() {
  const count = 110
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        color={signalHex}
        transparent
        opacity={0.18}
        sizeAttenuation
      />
    </points>
  )
}

// Whole 3D scene group with subtle ambient rotation
function SceneGroup({ stage }: { stage: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.14) * 0.07
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.09) * 0.025
    }
  })

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {NODE_POS.map((pos, i) => (
        <GrowthNode key={i} pos={pos} isActive={i === stage} />
      ))}

      {/* Connecting lines */}
      {NODE_POS.slice(0, -1).map((pos, i) => {
        const hi = i === stage - 1 || i === stage
        return (
          <Line
            key={i}
            points={[pos, NODE_POS[i + 1]]}
            color={hi ? signalHex : text4Hex.dark}
            lineWidth={hi ? 1.6 : 0.8}
            opacity={hi ? 0.55 : 0.14}
            transparent
          />
        )
      })}
    </group>
  )
}

// Root scene (everything inside <Canvas>)
function GrowthScene({ stage }: { stage: number }) {
  return (
    <>
      <color attach="background" args={[bgHex.dark]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 4]} intensity={0.4} color={textHex.dark} />
      <CameraController stage={stage} />
      <ActiveLight stage={stage} />
      <Particles />
      <HaloRing stage={stage} />
      <SceneGroup stage={stage} />
    </>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ThreeGrowthWindow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => setMounted(true), [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduceMotion) setActiveStage(Math.min(Math.floor(v * 5), 4))
  })

  const stage = STAGES[activeStage]
  const rail = (
    <SignalRail
      items={STAGES.map((s) => ({ index: s.number, title: s.name, body: `${s.line} ${s.copy}` }))}
    />
  )

  return (
    // Act 4 (interim): always a dark surface. Sticky travel on md+ only without reduced motion;
    // reduced motion and phones get all five stages in normal flow.
    <section
      id="journey"
      ref={containerRef}
      data-surface="dark"
      data-cursor-surface="dark"
      aria-labelledby="journey-h"
      className={cn('relative bg-bg text-text', !reduceMotion && 'md:h-[300vh]')}
    >
      {!reduceMotion && (
        <div className="hidden md:sticky md:top-0 md:block md:h-screen md:overflow-hidden">
          <div className="grid h-full grid-cols-[5fr_7fr] pt-16">
            <div className="flex flex-col px-8 py-8 lg:px-14 xl:px-20">
              <p className="text-label uppercase text-signal-ink">{journey.eyebrow}</p>
              <h2 id="journey-h" className="mt-4 max-w-md text-title text-text-2">
                {journey.heading}
              </h2>

              <div className="flex flex-1 flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div key={activeStage} variants={swap(reduceMotion)} initial="initial" animate="enter" exit="exit">
                    <p className="mb-3 font-mono text-data text-signal-ink">
                      {stage.number} / 05
                    </p>
                    <h3 className="text-display-m text-text">{stage.name}</h3>
                    <p className="mt-3 text-body-l text-text">{stage.line}</p>
                    <p className="mt-4 max-w-sm text-body text-text-2">{stage.copy}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <Mark size={28} state="progress" value={activeStage + 1} title={`${stage.number} / 05`} />
            </div>

            <div className="py-5 pr-5">
              <div className="relative h-full overflow-hidden rounded-xl border border-line">
                {mounted && (
                  <Canvas camera={{ position: CAM_POS[0], fov: 42 }} dpr={[1, 1.5]} style={{ width: '100%', height: '100%' }}>
                    <GrowthScene stage={activeStage} />
                  </Canvas>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={cn('mx-auto max-w-container px-gutter py-section', !reduceMotion && 'md:hidden')}>
        <SectionHeader id={reduceMotion ? 'journey-h' : undefined} eyebrow={journey.eyebrow} heading={journey.heading} body={journey.intro} />
        <div className="mt-16">{rail}</div>
        <Link href={journey.closing.href} className="mt-12 inline-flex min-h-11 items-center text-body-s font-semibold text-signal-ink hover:text-text">
          {journey.closing.label} →
        </Link>
      </div>
    </section>
  )
}
