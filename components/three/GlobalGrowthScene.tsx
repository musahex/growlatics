'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { bgHex, signalDeepHex, signalHex } from '@/lib/tokens'

// ─── Module-level mutable state (never causes React re-renders) ──────────────

const scrollState = { progress: 0 }
const themeState  = { isDark: true }
const mouseState  = {
  rawX: 0, rawY: 0,   // normalised -1…+1, updated by DOM listener
  smX:  0, smY:  0,   // smoothed, updated inside useFrame
  active: false,      // true after first mousemove
  reducedMotion: false,
}

// ─── Scene data ──────────────────────────────────────────────────────────────

// Spread nodes toward edges/depth — fewer in the vertical centre so the
// camera travels through open space and nodes don't crowd the hero text.
const NODES: [number, number, number][] = [
  [-4.2,  4.1, -5.0],  // top-left, deep
  [ 4.8,  3.2, -6.4],  // top-right, very deep
  [-2.4,  2.0, -3.8],  // upper mid-left
  [ 3.8,  0.8, -6.8],  // mid right, deepest
  [-5.0, -0.4, -5.2],  // mid far-left
  [ 2.0, -1.8, -4.0],  // lower mid-right
  [-3.2, -3.2, -6.0],  // lower-left, deep
  [ 4.6, -4.4, -4.6],  // bottom-right
]

const EDGES: [number, number][] = [
  [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [2, 3],
]

const BG_DARK  = new THREE.Color(bgHex.dark)
const BG_LIGHT = new THREE.Color(bgHex.light)

// ─── Individual node — pulsing sphere ────────────────────────────────────────

function AmbientNode({ pos }: { pos: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    const t = clock.elapsedTime

    // Phase-shifted pulse per node (keyed by x position)
    const s = 1 + Math.sin(t * 0.6 + pos[0] * 0.55) * 0.1
    meshRef.current.scale.setScalar(s)

    // Lerp emissive and opacity toward theme targets.
    // Light mode is subdued so HeroInteractiveField dominates the hero area,
    // but visible enough to maintain ambient network presence across the page.
    const targetEI  = themeState.isDark ? 0.45 : 0.14
    const targetOp  = themeState.isDark ? 0.55 : 0.16
    mat.emissiveIntensity += (targetEI  - mat.emissiveIntensity) * 0.04
    mat.opacity           += (targetOp  - mat.opacity)           * 0.04
  })

  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[0.09, 10, 10]} />
      <meshStandardMaterial
        color={signalHex}
        emissive={signalHex}
        emissiveIntensity={0.45}
        transparent
        opacity={0.55}
        roughness={0.25}
        metalness={0.45}
      />
    </mesh>
  )
}

// ─── Particle field — deterministic, golden-angle spiral ─────────────────────

function Particles() {
  const matRef = useRef<THREE.PointsMaterial>(null)
  const count  = 80

  // Positions weighted toward edges — keeps centre open for hero text
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const phi = 2.399963 // golden angle
    for (let i = 0; i < count; i++) {
      const angle  = i * phi
      const radius = 5.5 + (i % 7) * 1.2      // pulled further out
      arr[i * 3]     = Math.cos(angle) * radius * 0.9
      arr[i * 3 + 1] = 4.5 - (i / count) * 11
      arr[i * 3 + 2] = -4.0 - (i % 5) * 1.2   // pushed deeper
    }
    return arr
  }, [])

  useFrame(() => {
    if (!matRef.current) return
    // Subdued in light mode — HeroInteractiveField handles the hero area.
    const target = themeState.isDark ? 0.12 : 0.035
    matRef.current.opacity += (target - matRef.current.opacity) * 0.04
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.018}
        color={signalHex}
        transparent
        opacity={0.12}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Soft point light that follows the mouse cursor ───────────────────────────

function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (!lightRef.current) return
    // Project mouse into approximate scene space (z≈2 plane in front of nodes)
    const tx = mouseState.smX * 5.5
    const ty = mouseState.smY * 3.5
    lightRef.current.position.x += (tx - lightRef.current.position.x) * 0.05
    lightRef.current.position.y += (ty - lightRef.current.position.y) * 0.05

    // Dark mode: perceptible warm glow; light mode: subtle (hero field handles primary glow)
    const targetInt = themeState.isDark ? 0.75 : 0.10
    lightRef.current.intensity += (targetInt - lightRef.current.intensity) * 0.04
  })

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 2]}
      color={signalHex}
      intensity={0.75}
      distance={11}
    />
  )
}

// ─── Node/edge group with mouse-driven parallax rotation ─────────────────────

function NodesGroup() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    // Subtle parallax tilt — only when motion is allowed
    const mx = mouseState.reducedMotion ? 0 : mouseState.smX
    const my = mouseState.reducedMotion ? 0 : mouseState.smY
    const targetRotY =  mx * 0.055
    const targetRotX = -my * 0.038
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.042
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.042
  })

  return (
    <group ref={groupRef}>
      {NODES.map((pos, i) => <AmbientNode key={i} pos={pos} />)}
      {EDGES.map(([a, b], i) => (
        <Line
          key={i}
          points={[NODES[a], NODES[b]]}
          color={signalHex}
          lineWidth={0.5}
          opacity={themeState.isDark ? 0.08 : 0.05}
          transparent
        />
      ))}
    </group>
  )
}

// ─── Camera + scene background ───────────────────────────────────────────────

function SceneContent() {
  const { camera, scene } = useThree()
  const bgT = useRef(0) // 0 = dark, 1 = light

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const s = scrollState.progress

    // Smooth mouse values inside the render loop (avoids extra listeners)
    if (!mouseState.reducedMotion) {
      mouseState.smX += (mouseState.rawX - mouseState.smX) * 0.038
      mouseState.smY += (mouseState.rawY - mouseState.smY) * 0.038
    }

    // Camera: slow organic drift + scroll vertical travel + mouse parallax
    const drift    = Math.sin(t * 0.085) * 0.65
    const targetX  = drift + (mouseState.reducedMotion ? 0 : mouseState.smX * 0.55)
    const targetY  = (3.5 - s * 7) + (mouseState.reducedMotion ? 0 : mouseState.smY * 0.32)
    const targetZ  = 7 + Math.sin(t * 0.055) * 0.22

    camera.position.x += (targetX - camera.position.x) * 0.016
    camera.position.y += (targetY - camera.position.y) * 0.022
    camera.position.z += (targetZ - camera.position.z) * 0.014

    camera.lookAt(
      Math.sin(t * 0.065) * 0.2,
      camera.position.y - 1.1,
      0,
    )

    // Background colour: smooth lerp between dark and light
    const targetBgT = themeState.isDark ? 0 : 1
    bgT.current += (targetBgT - bgT.current) * 0.038
    scene.background = new THREE.Color().lerpColors(BG_DARK, BG_LIGHT, bgT.current)
  })

  return (
    <>
      <ambientLight intensity={0.18} />
      {/* Warm orange fill from upper-left */}
      <pointLight position={[-2.5, 3.5, 2]} color={signalHex} intensity={0.9} distance={13} />
      {/* Deep-red counter-fill from lower-right */}
      <pointLight position={[4.5, -2.5, 1.5]} color={signalDeepHex} intensity={0.55} distance={11} />
      <CursorLight />
      <Particles />
      <NodesGroup />
    </>
  )
}

// ─── Root export — fixed canvas behind all page content ──────────────────────

export default function GlobalGrowthScene() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Read initial theme
    themeState.isDark = document.documentElement.getAttribute('data-theme') !== 'light'

    // Check reduced-motion once on mount
    mouseState.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Scroll progress
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollState.progress = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Mouse normalised to -1…+1 (only on non-touch, non-reduced-motion devices)
    const isFineMouse = window.matchMedia('(pointer: fine)').matches
    let onMove: ((e: MouseEvent) => void) | null = null
    if (isFineMouse && !mouseState.reducedMotion) {
      onMove = (e: MouseEvent) => {
        mouseState.rawX = (e.clientX / window.innerWidth)  * 2 - 1
        mouseState.rawY = -((e.clientY / window.innerHeight) * 2 - 1)
      }
      window.addEventListener('mousemove', onMove, { passive: true })
    }

    // Watch data-theme changes
    const observer = new MutationObserver(() => {
      themeState.isDark = document.documentElement.getAttribute('data-theme') !== 'light'
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (onMove) window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])

  return (
    // Hidden on mobile — avoids two WebGL contexts on low-end devices.
    <div aria-hidden className="pointer-events-none fixed inset-0 hidden md:block" style={{ zIndex: 0 }}>
      {mounted && (
        <Canvas
          camera={{ position: [0, 3.5, 7], fov: 45 }}
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%' }}
        >
          <SceneContent />
        </Canvas>
      )}
    </div>
  )
}
