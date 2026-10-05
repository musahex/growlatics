'use client'

// Tier 1: Canvas2D, harvested from HeroInteractiveField. No listeners and no loop of its own:
// the stage calls draw() from the scheduler. DPR capped at 2.
import { useEffect, useRef } from 'react'
import { EDGES, EDGE_A, EDGE_B, NODES } from '../model/graph'
import { FIELD, FIELD_POINTS, edgeColor, isDashed, levelColor } from '../model/flow'
import { paint, type RGBA } from '../model/palette'
import { sys } from '../runtime/store'
import { useStage } from '../stage/context'

const N = NODES.length
const DASH = [2, 4]
const SOLID: number[] = []

export default function NetworkCanvas2D() {
  const stage = useStage()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!stage || !canvas || !ctx) return
    let w = 1, h = 1
    const resize = () => {
      const dpr = Math.min(sys.viewport.dpr || 1, 2)
      w = canvas.clientWidth || 1
      h = canvas.clientHeight || 1
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const col: RGBA = [0, 0, 0, 0]
    const pt = { x: 0, y: 0, z: 0 }
    const f = stage.field
    // Normalised pose → canvas px, with the 2D camera (pan/zoom) and depth parallax.
    const sx = (x: number, z: number) => ((x - f.pose.cam[0]) * f.pose.cam[2] + 0.5) * w + (stage.pointerFx ? sys.pointer.nx * (9.75 + z * 4.25) : 0)
    const sy = (y: number, z: number) => ((y - f.pose.cam[1]) * f.pose.cam[2] + 0.5) * h + (stage.pointerFx ? sys.pointer.ny * (9.75 + z * 4.25) * 0.6 : 0)

    let first = true
    stage.draw = () => {
      const p = stage.palette
      if (!p) return
      const P = f.pose.pos
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < N; i++) {
        f.screen[i * 2] = sx(P[i * 3], P[i * 3 + 2])
        f.screen[i * 2 + 1] = sy(P[i * 3 + 1], P[i * 3 + 2])
      }
      const S = f.screen

      // Dormant background field (act 1).
      if (f.pose.field > 0.01) {
        ctx.fillStyle = paint(p.dormant, f.pose.field * 0.6)
        for (let i = 0; i < FIELD_POINTS; i++) {
          ctx.beginPath()
          ctx.arc(sx(FIELD[i * 3], -1), sy(FIELD[i * 3 + 1], -1), 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Edges (bowed quadratic; broken handoffs dashed 2/4).
      ctx.lineWidth = p.dark ? 0.9 : 1.1
      for (let e = 0; e < EDGES.length; e++) {
        const lv = f.edgeLevel[e]
        if (lv < 0.05) continue
        const a = EDGE_A[e], b = EDGE_B[e]
        const ax = S[a * 2], ay = S[a * 2 + 1], bx = S[b * 2], by = S[b * 2 + 1]
        const bow = EDGES[e].bow
        edgeColor(col, p, lv, f.edgeBoost[e], f.edgeProx[e])
        ctx.strokeStyle = paint(col, f.edgeA[e])
        ctx.setLineDash(isDashed(lv) ? DASH : SOLID)
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.quadraticCurveTo((ax + bx) / 2 - (by - ay) * bow, (ay + by) / 2 + (bx - ax) * bow, bx, by)
        ctx.stroke()
      }
      ctx.setLineDash(SOLID)

      // Nodes: halo when lit, dot, pulse ring on key nodes.
      const pulse = (f.t * 0.23) % 1
      for (let i = 0; i < N; i++) {
        const lv = f.level[i]
        if (lv < 0.05) continue
        const x = S[i * 2], y = S[i * 2 + 1]
        const r = 3 * f.size[i] * (1 + f.prox[i] * 0.2)
        const a = f.alpha[i]
        levelColor(col, p, lv)
        if (lv > 2) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r * 8)
          g.addColorStop(0, paint(p.glow, a * (1 + f.prox[i] * 1.5) * (lv - 1)))
          g.addColorStop(1, paint(p.glow, 0))
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(x, y, r * 8, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = paint(col, Math.min(1, a + f.prox[i] * 0.38))
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        if (NODES[i].weight === 3 && lv >= 2 && !stage.still) {
          const ph = (pulse + i * 0.17) % 1
          ctx.strokeStyle = paint(p.idle, (1 - ph) * 0.55 * a)
          ctx.lineWidth = 0.85
          ctx.beginPath()
          ctx.arc(x, y, r + ph * 22, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // Packets: soft glow plus crisp centre; leaks fade as they fall.
      const drawPacket = (x: number, y: number, a: number, scale: number) => {
        const gr = (p.dark ? 8 : 10) * scale
        const g = ctx.createRadialGradient(x, y, 0, x, y, gr)
        g.addColorStop(0, paint(p.packet, a))
        g.addColorStop(0.4, paint(p.packet, a * 0.35))
        g.addColorStop(1, paint(p.packet, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, gr, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = paint(p.packet, a)
        ctx.beginPath()
        ctx.arc(x, y, 1.8 * scale, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const k of f.packets) {
        if (!k.alive) continue
        const fade = k.leak > 0 ? Math.max(0, 1 - k.leak / 1.2) : Math.min(1, k.t * 10, (1 - k.t) * 10)
        drawPacket(sx(k.x, k.z), sy(k.y, k.z), 0.9 * fade * f.pose.dim, 1)
      }
      if (f.hero.a > 0.01) {
        pt.x = f.hero.x
        pt.y = f.hero.y
        drawPacket(sx(pt.x, 0.4), sy(pt.y, 0.4), f.hero.a, 2)
      }

      if (first) {
        first = false
        stage.ready()
      }
    }
    return () => {
      ro.disconnect()
      stage.draw = null
    }
  }, [stage])

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
}
