// Shared per-frame network state for the live renderers (Canvas2D and WebGL draw the same thing).
// Harvested from HeroInteractiveField: bowed edges (edgeCP/qpt), signal model (1.5–3s per edge,
// edge "boost charge" while a packet is mid-path, decay 0.958 @60fps), desynchronised breathing,
// pointer proximity falloff. No allocation inside step().
import { ADJ, CORE, EDGES, EDGE_A, EDGE_B, NODES, type SystemId } from './graph'
import { emptyPose, poseAt, transpose, type Pose } from './layouts'
import { sys } from '../runtime/store'
import { damp } from '../runtime/scheduler'
import type { RGBA, Palette } from './palette'

const N = NODES.length
const E = EDGES.length
export const FIELD_POINTS = 60
export const MAX_PACKETS = 24

// Dormant background field (act 1), golden-angle distribution harvested from GlobalGrowthScene.
export const FIELD = new Float32Array(FIELD_POINTS * 3)
for (let i = 0; i < FIELD_POINTS; i++) {
  const a = i * 2.39996323
  const r = Math.sqrt((i + 0.5) / FIELD_POINTS) * 0.62
  FIELD[i * 3] = 0.5 + Math.cos(a) * r * 1.1
  FIELD[i * 3 + 1] = 0.5 + Math.sin(a) * r * 0.9
  FIELD[i * 3 + 2] = -0.6 - ((i * 7) % 5) * 0.08
}

const BREATH = NODES.map((_, i) => (0.013 + ((i * 37) % 6) * 0.001) * 60)
const PHASE = NODES.map((_, i) => (i / N) * Math.PI * 2)
const INTRO_AT = NODES.map((_, i) => 0.4 + 0.9 * (i / N))

export type Packet = {
  alive: boolean
  edge: number
  t: number
  dir: 1 | -1
  speed: number
  leak: number // >0: detached and falling (seconds since leak)
  leakAt: number // t where it will detach (broken handoff), or 2 = never
  x: number
  y: number
  z: number
}

export type Field = ReturnType<typeof createField>

/** `pointerFx`: tier 2 desktop only (proximity, routing). `still`: reduced motion (no flow, no breathing). */
export function createField(opts: { maxPackets: number; portrait?: boolean }) {
  const target = emptyPose()
  const pose = emptyPose()
  const f = {
    pose,
    kp: -1,
    t: 0,
    intro: -1, // seconds since intro start; -1 = not playing
    level: new Float32Array(N),
    alpha: new Float32Array(N),
    size: new Float32Array(N),
    labelA: new Float32Array(N),
    focusA: new Float32Array(N).fill(1),
    edgeLevel: new Float32Array(E),
    edgeBoost: new Float32Array(E),
    edgeA: new Float32Array(E),
    prox: new Float32Array(N),
    edgeProx: new Float32Array(E),
    screen: new Float32Array(N * 2), // stage-local px, written by the renderer's projector
    packets: Array.from({ length: MAX_PACKETS }, (): Packet => ({ alive: false, edge: 0, t: 0, dir: 1, speed: 1, leak: 0, leakAt: 2, x: 0, y: 0, z: 0 })),
    maxPackets: opts.maxPackets,
    portrait: !!opts.portrait,
    hero: { x: 0.5, y: 0.5, z: 0.4, a: 0 },
    spawnClock: 0,
  }
  return f
}

const inFocus = (i: number, focus: SystemId | null) => !focus || NODES[i].system === focus || i === CORE

/** Advance the shared state. `kpTarget` = key position from layouts.keyPosition(). */
export function stepField(f: Field, dt: number, kpTarget: number, o: { still: boolean; pointerFx: boolean; rect?: DOMRect | { left: number; top: number } }) {
  f.t += dt
  if (f.kp < 0) f.kp = kpTarget
  f.kp = o.still ? kpTarget : damp(f.kp, kpTarget, 3.5, dt)
  poseAt(f.pose, f.kp)
  if (f.portrait) transpose(f.pose)
  const p = f.pose

  // Intro (act 1, once per session): activation in graph order, handoffs fail, core arrives, mark.
  let introCore = 1, introHandoff = 0
  if (f.intro >= 0 && !o.still) {
    f.intro += dt
    const it = f.intro
    if (it > 3.5 + 0.88) f.intro = -1
    introCore = Math.min(1, Math.max(0, (it - 2.1) / 0.88))
    introHandoff = it > 1.3 && it < 2.1 ? Math.sin(((it - 1.3) / 0.8) * Math.PI) : 0
    p.mark = Math.max(p.mark, it < 2.1 ? 0 : it < 3.5 ? Math.min(1, (it - 2.1) / 0.6) : Math.max(0, 1 - (it - 3.5) / 0.88))
  }

  const focus = sys.focus
  for (let i = 0; i < N; i++) {
    let lv = p.node[i]
    if (f.intro >= 0) {
      const a = Math.min(1, Math.max(0, (f.intro - INTRO_AT[i]) / 0.32))
      lv = i === CORE ? 1 + (lv - 1) * introCore : lv > 1 ? 1 + (lv - 1) * a : lv
    }
    const fa = inFocus(i, focus) ? 1 : 0.4
    f.focusA[i] = o.still ? fa : damp(f.focusA[i], fa, 8, dt)
    if (focus && NODES[i].system === focus) lv = Math.max(lv, 3)
    f.level[i] = lv
    const breath = o.still ? 0 : Math.sin(f.t * BREATH[i] + PHASE[i])
    f.size[i] = (0.75 + NODES[i].weight * 0.25) * (1 + breath * 0.09) * (lv < 1 ? lv : 1)
    f.alpha[i] = p.dim * f.focusA[i] * (1 + breath * 0.12) * Math.min(1, lv)
    const lab = Math.max(p.label[i], focus && NODES[i].system === focus ? 1 : 0)
    f.labelA[i] = o.still ? lab : damp(f.labelA[i], lab, 8, dt)
  }

  for (let e = 0; e < E; e++) {
    let lv = p.edge[e]
    const kind = EDGES[e].kind
    if (f.intro >= 0) {
      const a = Math.min(1, Math.max(0, (f.intro - INTRO_AT[EDGE_B[e]]) / 0.32))
      lv = kind === 'core' ? lv * introCore : kind === 'handoff' ? Math.max(lv, introHandoff) : lv * a
    }
    f.edgeLevel[e] = lv
    f.edgeA[e] = p.dim * Math.min(f.focusA[EDGE_A[e]], f.focusA[EDGE_B[e]])
    f.edgeBoost[e] *= Math.pow(0.958, dt * 60)
  }

  // Pointer proximity (stage-local px; harvested falloff: nodes +0.38, edges toward hot).
  const ptr = sys.pointer
  const left = o.rect?.left ?? 0, top = o.rect?.top ?? 0
  const px = ptr.sx - left, py = ptr.sy - top
  let nearD = Infinity, nearI = -1
  for (let i = 0; i < N; i++) {
    const sx = f.screen[i * 2], sy = f.screen[i * 2 + 1]
    const d = Math.hypot(px - sx, py - sy)
    f.prox[i] = o.pointerFx && ptr.active ? Math.max(0, 1 - d / 180) : 0
    if (f.level[i] >= 1.5 && d < nearD) {
      nearD = d
      nearI = i
    }
  }
  for (let e = 0; e < E; e++) {
    const a = EDGE_A[e], b = EDGE_B[e]
    const d = Math.hypot(px - (f.screen[a * 2] + f.screen[b * 2]) / 2, py - (f.screen[a * 2 + 1] + f.screen[b * 2 + 1]) / 2)
    f.edgeProx[e] = o.pointerFx && ptr.active ? Math.max(0, 1 - d / 180) : 0
  }

  // Journey hero packet rides with the camera focus.
  f.hero.x = p.cam[0]
  f.hero.y = p.cam[1] + 0.02
  f.hero.a = p.hero

  if (!o.still) stepPackets(f, dt, o.pointerFx ? nearI : -1, o.pointerFx && nearD < 120)
  else placeStillPackets(f)
  return { nearI, nearD }
}

const usable = (f: Field, e: number) => f.edgeLevel[e] >= 1.5
const broken = (f: Field, e: number) => f.edgeLevel[e] >= 0.6 && f.edgeLevel[e] < 1.5

function launch(f: Field, k: Field['packets'][number], e: number, from: number) {
  k.alive = true
  k.edge = e
  k.dir = EDGE_A[e] === from ? 1 : -1
  k.t = 0
  k.leak = 0
  k.leakAt = broken(f, e) ? 0.4 + Math.random() * 0.15 : 2
  k.speed = 1 / (1.5 + Math.random() * 1.5) // 1.5–3s per edge
}

function nextEdge(f: Field, node: number, came: number, routeTo: number): number {
  const adj = ADJ[node]
  // Pointer as router: take the hop toward the node nearest the pointer if that edge exists.
  if (routeTo >= 0) {
    for (const e of adj) if (e !== came && usable(f, e) && (EDGE_A[e] === routeTo || EDGE_B[e] === routeTo)) return e
  }
  let pick = -1, seen = 0
  for (const e of adj) {
    if (e === came) continue
    const other = EDGE_A[e] === node ? EDGE_B[e] : EDGE_A[e]
    if (!inFocus(other, sys.focus)) continue
    // Broken handoffs take about 1 in 3 departures: the leak.
    const ok = usable(f, e) || (broken(f, e) && Math.random() < 0.33)
    if (ok && Math.random() * ++seen < 1) pick = e
  }
  return pick
}

function stepPackets(f: Field, dt: number, nearI: number, routing: boolean) {
  let alive = 0
  for (const k of f.packets) {
    if (!k.alive) continue
    alive++
    if (k.leak > 0) {
      k.leak += dt
      k.y += dt * 0.05 * k.leak
      if (k.leak > 1.2) k.alive = false
      continue
    }
    k.t += dt * k.speed
    const e = k.edge
    if (k.t > 0.08 && k.t < 0.92) f.edgeBoost[e] = Math.min(1, f.edgeBoost[e] + 0.06 * dt * 60)
    if (k.t >= k.leakAt) {
      edgePoint(f, e, k.dir > 0 ? k.t : 1 - k.t, k)
      k.leak = 1e-3
      continue
    }
    if (f.edgeLevel[e] < 0.6) {
      k.alive = false
      continue
    }
    if (k.t >= 1) {
      const at = k.dir > 0 ? EDGE_B[e] : EDGE_A[e]
      const n = nextEdge(f, at, e, routing && nearI !== at ? nearI : -1)
      if (n < 0) k.alive = false
      else launch(f, k, n, at)
    }
    if (k.alive) edgePoint(f, k.edge, k.dir > 0 ? k.t : 1 - k.t, k)
  }
  // Keep flow near the cap; spawn on a lit edge.
  f.spawnClock -= dt
  if (alive < f.maxPackets && f.spawnClock <= 0 && (f.intro < 0 || f.intro > 0.9)) {
    f.spawnClock = 0.18
    let k: Packet | undefined
    for (const x of f.packets) if (!x.alive) { k = x; break }
    const e = Math.floor(Math.random() * E)
    if (k && usable(f, e) && inFocus(EDGE_A[e], sys.focus) && inFocus(EDGE_B[e], sys.focus)) launch(f, k, e, EDGE_A[e])
  }
}

/** Reduced motion: packets become static dots at the middle of active paths (flow stays legible). */
function placeStillPackets(f: Field) {
  let j = 0
  for (let e = 0; e < E && j < f.maxPackets; e++) {
    if (f.edgeLevel[e] < 2.4) continue
    const k = f.packets[j++]
    k.alive = true
    k.leak = 0
    edgePoint(f, e, 0.5, k)
  }
  for (; j < f.packets.length; j++) f.packets[j].alive = false
}

/** Point on a bowed edge in normalised pose space (harvested edgeCP + qpt). */
export function edgePoint(f: Field, e: number, t: number, out: { x: number; y: number; z: number }) {
  const P = f.pose.pos
  const a = EDGE_A[e] * 3, b = EDGE_B[e] * 3
  const ax = P[a], ay = P[a + 1], bx = P[b], by = P[b + 1]
  const dx = bx - ax, dy = by - ay
  const bow = EDGES[e].bow
  const cx = (ax + bx) / 2 - dy * bow, cy = (ay + by) / 2 + dx * bow
  const mt = 1 - t
  out.x = mt * mt * ax + 2 * mt * t * cx + t * t * bx
  out.y = mt * mt * ay + 2 * mt * t * cy + t * t * by
  out.z = P[a + 2] + (P[b + 2] - P[a + 2]) * t
}

/** Node colour by level: dormant → idle → active. Writes into `out` (no allocation). */
export function levelColor(out: RGBA, p: Palette, lv: number) {
  const hi = lv > 2
  const a = hi ? p.idle : p.dormant, b = hi ? p.active : p.idle
  const t = hi ? Math.min(1, lv - 2) : Math.max(0, lv - 1)
  for (let k = 0; k < 4; k++) out[k] = a[k] + (b[k] - a[k]) * t
  return out
}

/** Edge colour by level: broken (dashed) → rest → hot, plus packet boost and pointer proximity. */
export function edgeColor(out: RGBA, p: Palette, lv: number, boost: number, prox: number) {
  if (lv < 1.5) {
    for (let k = 0; k < 4; k++) out[k] = p.edgeBroken[k]
    out[3] *= Math.min(1, lv)
    return out
  }
  const t = Math.min(1, Math.max(0, lv - 2 + boost * 0.8 + prox * 0.6))
  for (let k = 0; k < 4; k++) out[k] = p.edge[k] + (p.edgeHot[k] - p.edge[k]) * t
  if (lv < 2) out[3] *= lv - 1
  return out
}

export const isDashed = (lv: number) => lv < 1.5

/** Intro plays once per session (§7 act 1). */
export function claimIntro(): boolean {
  try {
    if (sessionStorage.getItem('gl-intro')) return false
    sessionStorage.setItem('gl-intro', '1')
    return true
  } catch {
    return false
  }
}

export type { Pose }
