'use client'

import { useRef, useEffect } from 'react'

// ─── Brand colour ─────────────────────────────────────────────────────────────
const R = 210, G = 64, B = 26

// ─── Network topology ─────────────────────────────────────────────────────────
// Nodes positioned in text-safe zones (top strip, right edge, bottom strip).
// The structure reads as a branching growth system:
//   N0 (origin) → branches across the top and down the left
//   Signals flow outward from N0 through junctions toward endpoints.
//
// px/py = fraction of hero width/height   r = dot radius in CSS px
// layer: 1 = near (more parallax shift)   2 = far (less shift)

interface FNode { px: number; py: number; r: number; layer: 1 | 2 }

const NODES: FNode[] = [
  { px: 0.025, py: 0.082, r: 4.2, layer: 1 }, // N0 – origin (top-left)
  { px: 0.025, py: 0.893, r: 3.2, layer: 1 }, // N1 – bottom-left anchor
  { px: 0.548, py: 0.038, r: 3.4, layer: 2 }, // N2 – top junction (splits path)
  { px: 0.758, py: 0.050, r: 2.8, layer: 2 }, // N3 – top-right branch
  { px: 0.960, py: 0.072, r: 4.0, layer: 1 }, // N4 – top-right endpoint
  { px: 0.960, py: 0.508, r: 3.4, layer: 2 }, // N5 – right-mid node
  { px: 0.938, py: 0.912, r: 3.2, layer: 1 }, // N6 – bottom-right endpoint
]

// Each edge: node indices + perpendicular curve factor (fraction of edge length,
// signed = which side it bows toward)
interface FEdge { a: number; b: number; perp: number }

const EDGES: FEdge[] = [
  { a: 0, b: 1, perp: -0.038 }, // left side (N0 down to N1)
  { a: 0, b: 2, perp: -0.025 }, // top bar origin → junction
  { a: 2, b: 3, perp: -0.018 }, // junction → pre-panel branch
  { a: 3, b: 4, perp:  0.020 }, // pre-panel → top-right corner
  { a: 4, b: 5, perp:  0.030 }, // right side: top → mid
  { a: 5, b: 6, perp:  0.022 }, // right side: mid → bottom
  { a: 1, b: 6, perp:  0.028 }, // bottom bar
  { a: 2, b: 5, perp:  0.055 }, // diagonal shortcut: junction → right-mid
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Compute quadratic bezier control point by bowing an edge perpendicularly.
function edgeCP(ax: number, ay: number, bx: number, by: number, perp: number) {
  const mx  = (ax + bx) / 2
  const my  = (ay + by) / 2
  const dx  = bx - ax, dy = by - ay
  const len = Math.hypot(dx, dy) || 1
  return { x: mx + (-dy / len) * perp * len, y: my + (dx / len) * perp * len }
}

// Point on a quadratic bezier at parameter t.
function qpt(t: number, ax: number, ay: number, cx: number, cy: number, bx: number, by: number) {
  const mt = 1 - t
  return { x: mt*mt*ax + 2*mt*t*cx + t*t*bx, y: mt*mt*ay + 2*mt*t*cy + t*t*by }
}

// ─── Per-edge signal state ────────────────────────────────────────────────────

interface Signal { t: number; speed: number; waiting: number; delay: number }

function freshSignal(tInit = 0): Signal {
  return {
    t: tInit,
    speed: 0.0016 + Math.random() * 0.0024, // ~1.5–3s per edge at 60fps
    delay: 90 + Math.floor(Math.random() * 200),
    waiting: 0,
  }
}

interface EdgeState { sig: Signal; boost: number }

// ─── Node breathing parameters ────────────────────────────────────────────────
// Slightly different frequency per node so they never sync up perfectly.
const BREATH_HZ  = [0.016, 0.014, 0.018, 0.015, 0.017, 0.013, 0.016]
const BREATH_PH  = NODES.map((_, i) => (i / NODES.length) * Math.PI * 2)

// ─── Pulse-ring config ────────────────────────────────────────────────────────
// Staggered rings on the three most prominent nodes (origin + two endpoints).
const PULSE_CFG = [
  { ni: 0, off: 0.00 },
  { ni: 4, off: 0.36 },
  { ni: 5, off: 0.70 },
]

// ─── Parallax amounts ─────────────────────────────────────────────────────────
const NEAR_PX = 14, FAR_PX = 5.5
const GLOW_R  = 310

// ─────────────────────────────────────────────────────────────────────────────

export default function HeroInteractiveField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const glowRef      = useRef<HTMLDivElement>(null)
  const rafRef       = useRef(0)

  const rawMouse = useRef({ x: 0.5, y: 0.5 })
  const smMouse  = useRef({ x: 0.5, y: 0.5 })
  const sz       = useRef({ w: 1, h: 1 })
  const frame    = useRef(0)
  const isDark   = useRef(true)

  // Per-edge state — initialised once on mount (client only)
  const edgeState = useRef<EdgeState[]>(
    EDGES.map((_, i) => ({
      sig:   freshSignal(i / EDGES.length), // stagger initial positions
      boost: 0,
    }))
  )

  useEffect(() => {
    if (!window.matchMedia('(min-width: 768px)').matches) return

    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas   = canvasRef.current
    const ctr      = containerRef.current
    if (!canvas || !ctr) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ── Theme detection ───────────────────────────────────────────────────────
    isDark.current = document.documentElement.getAttribute('data-theme') !== 'light'
    const themeObs = new MutationObserver(() => {
      isDark.current = document.documentElement.getAttribute('data-theme') !== 'light'
    })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    // ── Resize / HiDPI ───────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w   = ctr.offsetWidth
      const h   = ctr.offsetHeight
      canvas.width  = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sz.current = { w, h }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(ctr)

    // ── Mouse tracking ────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const rect = ctr.getBoundingClientRect()
      rawMouse.current.x = Math.max(0, Math.min(1, (e.clientX - rect.left) / sz.current.w))
      rawMouse.current.y = Math.max(0, Math.min(1, (e.clientY - rect.top)  / sz.current.h))
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    // ── Draw loop ─────────────────────────────────────────────────────────────
    const draw = () => {
      const { w, h } = sz.current
      ctx.clearRect(0, 0, w, h)

      const f    = ++frame.current
      const dark = isDark.current

      // Smooth mouse (same lerp factor in both themes — identical interaction)
      if (!noMotion) {
        smMouse.current.x += (rawMouse.current.x - smMouse.current.x) * 0.055
        smMouse.current.y += (rawMouse.current.y - smMouse.current.y) * 0.055
      }
      const mx   = (smMouse.current.x - 0.5) * 2 // −1..1
      const my   = (smMouse.current.y - 0.5) * 2
      const curX = smMouse.current.x * w
      const curY = smMouse.current.y * h

      // ── Shared alphas — ONLY these differ by theme ───────────────────────
      // (geometry, animation speed, interaction logic are identical)
      // NOTE: light mode values are at or above dark mode for interactive states.
      // Orange on ivory has lower perceptual contrast than orange on near-black,
      // so higher alpha is needed to achieve the same *felt* response strength.
      const LINE_BASE  = dark ? 0.130 : 0.110 // resting edge alpha
      const LINE_BOOST = dark ? 0.320 : 0.360 // light mode boost is higher to compensate
      const NODE_BASE  = dark ? 0.520 : 0.430 // resting node alpha
      const HALO_BASE  = dark ? 0.115 : 0.090 // node halo alpha
      const SIG_A      = dark ? 0.90  : 0.84  // signal dot peak alpha
      const GRID_A     = dark ? 0.016 : 0.024
      const PULSE_A    = dark ? 0.30  : 0.28  // pulse ring peak alpha

      // ── Background grid ───────────────────────────────────────────────────
      const gridC = dark ? `rgba(255,255,255,${GRID_A})` : `rgba(10,9,8,${GRID_A})`
      ctx.save()
      ctx.strokeStyle = gridC
      ctx.lineWidth   = 0.5
      const gs = 48
      for (let x = gs; x < w; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = gs; y < h; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
      ctx.restore()

      // ── Node world positions with parallax ────────────────────────────────
      const npos = NODES.map((n) => {
        const s = n.layer === 1 ? NEAR_PX : FAR_PX
        return { x: n.px * w + mx * s, y: n.py * h + my * s * 0.6, r: n.r }
      })

      // ── Cursor proximity: per-edge & per-node (0..1) ─────────────────────
      const edgeProx = EDGES.map((e) => {
        const na = npos[e.a], nb = npos[e.b]
        const dist = Math.hypot(curX - (na.x + nb.x) / 2, curY - (na.y + nb.y) / 2)
        return Math.max(0, 1 - dist / (w * 0.26))
      })
      const nodeProx = npos.map(({ x, y }) => {
        const dist = Math.hypot(curX - x, curY - y)
        return Math.max(0, 1 - dist / (w * 0.19))
      })

      // ── Update signals ────────────────────────────────────────────────────
      if (!noMotion) {
        const es = edgeState.current
        for (let i = 0; i < es.length; i++) {
          const e = es[i]
          if (e.sig.waiting > 0) { e.sig.waiting--; continue }
          e.sig.t += e.sig.speed
          if (e.sig.t >= 1) {
            e.sig.t       = 0
            e.sig.waiting = e.sig.delay
            e.sig.speed   = 0.0016 + Math.random() * 0.0024
          }
          // Charge the edge boost while signal is mid-path
          if (e.sig.t > 0.08 && e.sig.t < 0.92) {
            e.boost = Math.min(1, e.boost + 0.06)
          }
          // Decay
          e.boost *= 0.958
        }
      }

      // ── Draw edges ────────────────────────────────────────────────────────
      ctx.save()
      ctx.lineWidth = dark ? 0.9 : 1.1
      for (let i = 0; i < EDGES.length; i++) {
        const e   = EDGES[i]
        const na  = npos[e.a], nb = npos[e.b]
        const c   = edgeCP(na.x, na.y, nb.x, nb.y, e.perp)
        const es  = edgeState.current[i]

        // Edge alpha: base + signal boost + cursor proximity boost
        const sigContrib    = es.boost * (LINE_BOOST - LINE_BASE)
        const cursorContrib = edgeProx[i] * (dark ? 0.22 : 0.28)
        const alpha = Math.min(0.95, LINE_BASE + sigContrib + cursorContrib)

        ctx.strokeStyle = `rgba(${R},${G},${B},${alpha})`
        ctx.beginPath()
        ctx.moveTo(na.x, na.y)
        ctx.quadraticCurveTo(c.x, c.y, nb.x, nb.y)
        ctx.stroke()
      }
      ctx.restore()

      // ── Draw nodes ────────────────────────────────────────────────────────
      for (let i = 0; i < npos.length; i++) {
        const { x, y, r } = npos[i]

        // Breathing: very slow sin per node
        const bPhase = f * BREATH_HZ[i] + BREATH_PH[i]
        const breath  = noMotion ? 1 : 1 + Math.sin(bPhase) * 0.09
        const breathA = noMotion ? 1 : 1 + Math.sin(bPhase) * 0.18

        // Combine base + cursor proximity + breathing
        const nodeA = Math.min(0.95, (NODE_BASE + nodeProx[i] * (dark ? 0.38 : 0.38)) * breathA)
        const haloA = Math.min(0.55, (HALO_BASE + nodeProx[i] * (dark ? 0.15 : 0.14)) * breathA)
        const nr    = r * breath

        // Halo (soft radial gradient)
        const halo = ctx.createRadialGradient(x, y, 0, x, y, nr * 8)
        halo.addColorStop(0, `rgba(${R},${G},${B},${haloA})`)
        halo.addColorStop(1, `rgba(${R},${G},${B},0)`)
        ctx.beginPath()
        ctx.arc(x, y, nr * 8, 0, Math.PI * 2)
        ctx.fillStyle = halo
        ctx.fill()

        // Dot
        ctx.beginPath()
        ctx.arc(x, y, nr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${R},${G},${B},${nodeA})`
        ctx.fill()
      }

      // ── Draw signal packets ───────────────────────────────────────────────
      if (!noMotion) {
        const es = edgeState.current
        for (let i = 0; i < EDGES.length; i++) {
          const e   = EDGES[i]
          const sig = es[i].sig
          if (sig.waiting > 0 || sig.t <= 0) continue

          const na  = npos[e.a], nb = npos[e.b]
          const c   = edgeCP(na.x, na.y, nb.x, nb.y, e.perp)
          const pt  = qpt(sig.t, na.x, na.y, c.x, c.y, nb.x, nb.y)

          // Ease in at start, ease out at end
          const alpha = SIG_A *
            Math.min(1, sig.t * 10) *
            Math.min(1, (1 - sig.t) * 10)

          // Glowing dot: radial gradient for soft halo + crisp center
          // Light mode uses a slightly larger glow to compensate for lower contrast
          const sgR = dark ? 8 : 10
          const sg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, sgR)
          sg.addColorStop(0,   `rgba(${R},${G},${B},${alpha})`)
          sg.addColorStop(0.4, `rgba(${R},${G},${B},${alpha * 0.35})`)
          sg.addColorStop(1,   `rgba(${R},${G},${B},0)`)
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, sgR, 0, Math.PI * 2)
          ctx.fillStyle = sg
          ctx.fill()

          // Crisp center point
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${R},${G},${B},${alpha})`
          ctx.fill()
        }
      }

      // ── Draw pulse rings on key nodes ─────────────────────────────────────
      if (!noMotion) {
        const pulseSpeed  = 0.0038
        const globalPhase = (f * pulseSpeed) % 1

        ctx.save()
        ctx.lineWidth = 0.85
        for (const { ni, off } of PULSE_CFG) {
          const { x, y, r } = npos[ni]
          const phase = (globalPhase + off) % 1
          const pr    = r + phase * 22
          const pa    = Math.max(0, (1 - phase) * PULSE_A)
          ctx.strokeStyle = `rgba(${R},${G},${B},${pa})`
          ctx.beginPath()
          ctx.arc(x, y, pr, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.restore()
      }

      // ── Cursor glow div ───────────────────────────────────────────────────
      if (glowRef.current && !noMotion) {
        const gx = smMouse.current.x * w - GLOW_R
        const gy = smMouse.current.y * h - GLOW_R
        glowRef.current.style.transform = `translate(${gx}px, ${gy}px)`
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      ro.disconnect()
      themeObs.disconnect()
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
    >
      {/* Cursor-following glow blob (CSS-driven for quality, transform-only for perf) */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width:  GLOW_R * 2,
          height: GLOW_R * 2,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 60%)',
          willChange: 'transform',
          pointerEvents: 'none',
          // Park off-screen until first mousemove fires
          transform: `translate(${-GLOW_R * 4}px, ${-GLOW_R}px)`,
        }}
      />

      {/* Canvas — grid · edges · nodes · signals · pulse rings */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      />
    </div>
  )
}
