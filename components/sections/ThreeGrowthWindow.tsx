'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
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
import { cn } from '@/lib/utils'

// ─── Data ───────────────────────────────────────────────────────────────────

const STAGES = [
  {
    n: '01',
    label: 'Attention',
    title: 'Attract qualified demand',
    copy: 'Performance campaigns and acquisition systems built around measurable growth.',
  },
  {
    n: '02',
    label: 'Convert',
    title: 'Turn attention into pipeline',
    copy: 'Landing pages, funnels, and response workflows designed to reduce leakage.',
  },
  {
    n: '03',
    label: 'Close',
    title: 'Add sales capacity',
    copy: 'Trained inbound, outbound, and appointment-setting teams that move leads forward.',
  },
  {
    n: '04',
    label: 'Support',
    title: 'Retain and support customers',
    copy: 'Customer support operations that improve experience, retention, and trust.',
  },
  {
    n: '05',
    label: 'Scale',
    title: 'Build systems that grow with you',
    copy: 'Technology, automation, and digital infrastructure designed for scale.',
  },
]

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
        color="#D2401A"
        transparent
        opacity={0.18}
        emissive="#D2401A"
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
      <meshBasicMaterial color="#D2401A" transparent opacity={0.35} />
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
      color="#D2401A"
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
        color="#D2401A"
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
            color={hi ? '#D2401A' : '#2C2A28'}
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
      <color attach="background" args={['#060504']} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 4]} intensity={0.4} color="#FFFFFF" />
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
    if (!reduceMotion) {
      setActiveStage(Math.min(Math.floor(v * 5), 4))
    }
  })

  const stage = STAGES[activeStage]

  return (
    // md:h-[300vh] creates the scroll space; mobile uses auto height
    <div ref={containerRef} data-cursor-surface="dark" className="relative bg-[#080706] md:h-[300vh]">

      {/* ── Desktop: sticky 3D window ── */}
      <div className="hidden md:block md:sticky md:top-0 md:h-screen md:overflow-hidden">
        {/* Push content below fixed header */}
        <div className="h-full pt-16 grid grid-cols-[5fr_7fr]">

          {/* Left: text panel */}
          <div className="flex flex-col px-8 py-8 lg:px-14 xl:px-20">
            {/* Section label */}
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D2401A]">
              Growth System
            </p>

            {/* Stage content — animated on change */}
            <div className="flex flex-1 flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#D2401A]">
                    {stage.n}&nbsp;&nbsp;{stage.label}
                  </p>
                  <h2 className="mb-5 text-[clamp(1.8rem,2.4vw,2.9rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-white">
                    {stage.title}
                  </h2>
                  <p className="max-w-[22rem] text-[15px] leading-[1.75] text-[#6E6860]">
                    {stage.copy}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bars */}
            <div>
              <div className="flex items-center gap-[6px] mb-2">
                {STAGES.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-[2px] flex-1 rounded-full transition-all duration-500',
                      i <= activeStage ? 'bg-[#D2401A]' : 'bg-white/[0.10]'
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#3A3530]">
                Stage {activeStage + 1} of {STAGES.length} &nbsp;·&nbsp; Scroll to explore
              </p>
            </div>
          </div>

          {/* Right: 3D canvas in a rounded "window" */}
          <div className="py-5 pr-5">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#060504] shadow-[0_0_80px_rgba(210,64,26,0.05)]">
              {mounted && (
                <Canvas
                  camera={{ position: CAM_POS[0], fov: 42 }}
                  dpr={[1, 1.5]}
                  style={{ width: '100%', height: '100%' }}
                >
                  <GrowthScene stage={activeStage} />
                </Canvas>
              )}
              {/* Subtle inner vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 55%, rgba(6,5,4,0.65) 100%)',
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile: static numbered stage list ── */}
      <div className="md:hidden px-5 pt-20 pb-16 sm:px-6">
        <div className="mb-12">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D2401A]">
            Growth System
          </p>
          <h2 className="text-[clamp(1.75rem,5.5vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-white">
            From attention to revenue, every stage connected.
          </h2>
        </div>

        {STAGES.map((s, i) => (
          <div key={s.n} className="relative flex gap-5 pb-10 last:pb-0">
            {/* Vertical connector */}
            {i < STAGES.length - 1 && (
              <div
                aria-hidden
                className="absolute left-[15px] top-[34px] bottom-0 w-px bg-[#D2401A]/20"
              />
            )}

            {/* Stage badge */}
            <div className="relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D2401A]/40 bg-[#D2401A]/10">
              <span className="text-[10px] font-extrabold tabular-nums text-[#D2401A]">
                {i + 1}
              </span>
            </div>

            {/* Content */}
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#D2401A]">
                {s.label}
              </p>
              <h3 className="mb-2 text-[17px] font-bold leading-snug text-white">
                {s.title}
              </h3>
              <p className="text-[13.5px] leading-[1.65] text-[#6E6860]">{s.copy}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
