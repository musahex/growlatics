// Per-act target compositions (DIRECTION §6.2, §7). Normalised: x 0..1 left→right, y 0..1 top→bottom,
// z -1..1 (negative = further). One key per act, act 4 has one key per journey stage.
import { CORE, EDGES, NODES, NODE_INDEX, type SystemId } from './graph'

/** Node state levels: 0 hidden · 1 dormant · 2 idle · 3 active. Edge levels: 0 hidden · 1 broken · 2 rest · 3 hot. */
export const LEVEL = { hidden: 0, dormant: 1, idle: 2, active: 3 } as const
export type NodeState = keyof typeof LEVEL
export type ActLayout = Record<string, { x: number; y: number; z: number; state: NodeState }>

export type Pose = {
  pos: Float32Array // N*3
  node: Float32Array // N, 0..3
  edge: Float32Array // E, 0..3
  label: Float32Array // N, 0..1 SpatialLabel visibility
  field: number // dormant background field alpha (act 1)
  dim: number // whole-network multiplier (act 8 dims to 0.5)
  mark: number // 0..1 the core resolves into the five-bar mark (act 9)
  hero: number // journey hero packet visibility
  cam: Float32Array // [x, y, zoom, tiltDeg]
}

const N = NODES.length
const E = EDGES.length
export const ACT_COUNT = 9
export const STAGE_COUNT = 5
/** Key order: acts 1-3, journey stages 0-4 (act 4), acts 5-9. */
export const KEY_COUNT = 3 + STAGE_COUNT + 5

export const keyFor = (act: number, stage = 0) =>
  act < 4 ? act - 1 : act === 4 ? 3 + Math.min(STAGE_COUNT - 1, Math.max(0, stage)) : act + 3

export const emptyPose = (): Pose => ({
  pos: new Float32Array(N * 3),
  node: new Float32Array(N),
  edge: new Float32Array(E),
  label: new Float32Array(N),
  field: 0,
  dim: 1,
  mark: 0,
  hero: 0,
  cam: new Float32Array([0.5, 0.5, 1, 0]),
})

type Center = { x: number; y: number; z: number; r: number }
const GOLDEN = 2.39996323
const sysOf = (i: number) => NODES[i].system

/** Spread each group's nodes around its centre (phyllotaxis, deterministic). */
function place(p: Pose, groups: [string[], Center][]) {
  for (const [ids, c] of groups) {
    const m = ids.length
    ids.forEach((id, k) => {
      const i = NODE_INDEX[id]
      const a = k * GOLDEN + c.x * 7
      const rad = m === 1 ? 0 : c.r * Math.sqrt((k + 0.55) / m)
      p.pos[i * 3] = c.x + Math.cos(a) * rad
      p.pos[i * 3 + 1] = c.y + Math.sin(a) * rad * 0.8
      p.pos[i * 3 + 2] = c.z + ((k % 3) - 1) * 0.12
    })
  }
}

const idsOf = (s: SystemId) => NODES.filter((x) => x.system === s).map((x) => x.id)
const bySystem = (centers: Partial<Record<SystemId, Center>>): [string[], Center][] =>
  (Object.keys(centers) as SystemId[]).map((s) => [idsOf(s), centers[s]!])

function states(p: Pose, fn: (s: SystemId, i: number) => NodeState) {
  for (let i = 0; i < N; i++) p.node[i] = LEVEL[fn(sysOf(i), i)]
}

type EdgeMode = 'fragmented' | 'connected' | 'flowing' | 'band' | 'converge'
function edges(p: Pose, mode: EdgeMode) {
  EDGES.forEach((ed, i) => {
    const market = ed.a.startsWith('market.')
    const na = p.node[NODE_INDEX[ed.a]], nb = p.node[NODE_INDEX[ed.b]]
    const lit = Math.min(na, nb) >= LEVEL.idle
    let v: number
    if (market) v = mode === 'band' ? 3 : 0
    else if (ed.kind === 'internal') v = mode === 'band' ? 0.6 : lit ? 2 : Math.min(na, nb) >= 1 ? 0.6 : 0
    else if (ed.kind === 'handoff') v = mode === 'fragmented' ? 1 : 0
    else v = mode === 'fragmented' || mode === 'band' ? 0 : mode === 'flowing' || mode === 'converge' ? (lit ? 2.6 : 0.6) : lit ? 2 : 0.6
    p.edge[i] = v
  })
}

// Market nodes rest on the core when hidden so they never fly in from the origin.
function parkMarkets(p: Pose) {
  for (const id of ['market.us', 'market.uk', 'market.pk']) {
    const i = NODE_INDEX[id]
    p.pos.set(p.pos.subarray(CORE * 3, CORE * 3 + 3), i * 3)
  }
}

const CORE_C = (x: number, y: number): Center => ({ x, y, z: 0.15, r: 0 })

// ── Act 1: the connected growth operator (idle end state; text-safe zone on the left) ──
function act1(): Pose {
  const p = emptyPose()
  place(p, [
    ...bySystem({
      acquire: { x: 0.8, y: 0.25, z: -0.1, r: 0.085 },
      sell: { x: 0.77, y: 0.5, z: 0.35, r: 0.11 },
      operate: { x: 0.86, y: 0.72, z: 0, r: 0.07 },
      build: { x: 0.78, y: 0.88, z: -0.75, r: 0.12 },
    }),
    [['core.growlatics'], CORE_C(0.62, 0.52)],
  ])
  parkMarkets(p)
  states(p, (s) => (s === 'market' ? 'hidden' : s === 'core' ? 'active' : 'idle'))
  edges(p, 'connected')
  p.field = 1
  return p
}

// ── Act 2: six vendor islands drifting apart, core dormant, handoffs broken ──
function act2(): Pose {
  const p = emptyPose()
  place(p, [
    [['acquire.paid-media', 'acquire.funnels'], { x: 0.58, y: 0.2, z: 0, r: 0.05 }],
    [['acquire.seo', 'acquire.social-media', 'acquire.youtube', 'acquire.lead-generation'], { x: 0.86, y: 0.22, z: -0.2, r: 0.07 }],
    [['sell.cold-outreach', 'sell.outbound-calling'], { x: 0.6, y: 0.52, z: 0.3, r: 0.05 }],
    [['sell.lead-qualification', 'sell.inbound', 'sell.appointment-setting', 'sell.telesales', 'sell.sales-operations'], { x: 0.87, y: 0.5, z: 0.2, r: 0.08 }],
    [idsOf('operate'), { x: 0.62, y: 0.82, z: 0, r: 0.07 }],
    [idsOf('build'), { x: 0.88, y: 0.84, z: -0.7, r: 0.08 }],
    [['core.growlatics'], CORE_C(0.74, 0.52)],
  ])
  parkMarkets(p)
  states(p, (s) => (s === 'market' ? 'hidden' : s === 'core' ? 'dormant' : 'idle'))
  edges(p, 'fragmented')
  p.cam[3] = 8
  return p
}

// ── Act 3: reconnected through the core, clusters compressed ──
function act3(): Pose {
  const p = emptyPose()
  place(p, [
    ...bySystem({
      acquire: { x: 0.62, y: 0.3, z: 0, r: 0.075 },
      sell: { x: 0.84, y: 0.42, z: 0.3, r: 0.095 },
      operate: { x: 0.8, y: 0.72, z: 0, r: 0.065 },
      build: { x: 0.66, y: 0.84, z: -0.75, r: 0.1 },
    }),
    [['core.growlatics'], CORE_C(0.72, 0.54)],
  ])
  parkMarkets(p)
  states(p, (s) => (s === 'market' ? 'hidden' : s === 'core' ? 'active' : 'idle'))
  edges(p, 'flowing')
  return p
}

// ── Act 4: journey stages. A wide flat graph the camera travels across. ──
const JOURNEY: Record<string, Center> = {
  acquire: { x: 0.2, y: 0.36, z: 0, r: 0.08 },
  sell: { x: 0.5, y: 0.4, z: 0.3, r: 0.1 },
  operate: { x: 0.78, y: 0.38, z: 0, r: 0.07 },
  build: { x: 0.5, y: 0.8, z: -0.8, r: 0.16 },
}
const STAGE_SYSTEMS: SystemId[][] = [['acquire'], ['acquire', 'sell'], ['sell'], ['operate'], ['build']]
const STAGE_FOCUS: [number, number][] = [
  [0.2, 0.36],
  [0.36, 0.38],
  [0.5, 0.4],
  [0.78, 0.38],
  [0.5, 0.72],
]
function journey(stage: number): Pose {
  const p = emptyPose()
  const active = STAGE_SYSTEMS[stage]
  const reached = new Set(STAGE_SYSTEMS.slice(0, stage + 1).flat())
  const centers: Partial<Record<SystemId, Center>> = {}
  for (const [s, c] of Object.entries(JOURNEY)) {
    centers[s as SystemId] = active.includes(s as SystemId) ? { ...c, r: c.r * 1.6 } : c
  }
  place(p, [...bySystem(centers), [['core.growlatics'], CORE_C(0.5, 0.58)]])
  parkMarkets(p)
  states(p, (s) =>
    s === 'market' ? 'hidden' : s === 'core' ? 'active' : active.includes(s) ? 'active' : reached.has(s) ? 'idle' : 'dormant',
  )
  edges(p, 'flowing')
  NODES.forEach((x, i) => (p.label[i] = active.includes(x.system) ? 1 : 0))
  p.cam.set([STAGE_FOCUS[stage][0], STAGE_FOCUS[stage][1], 1.8, 0])
  p.hero = 1
  return p
}

// ── Act 5: top-down ring, Sell at 12 o'clock and 1.25× larger ──
function act5(): Pose {
  const p = emptyPose()
  place(p, [
    ...bySystem({
      sell: { x: 0.72, y: 0.22, z: 0, r: 0.1 },
      operate: { x: 0.88, y: 0.5, z: 0, r: 0.07 },
      build: { x: 0.72, y: 0.8, z: 0, r: 0.08 },
      acquire: { x: 0.56, y: 0.5, z: 0, r: 0.075 },
    }),
    [['core.growlatics'], CORE_C(0.72, 0.5)],
  ])
  parkMarkets(p)
  states(p, (s) => (s === 'market' ? 'hidden' : s === 'core' ? 'active' : 'idle'))
  edges(p, 'flowing')
  return p
}

// ── Act 6: the network rests behind the trace comparison ──
function act6(): Pose {
  const p = act3()
  p.dim = 0.6
  return p
}

// ── Act 7: a 24-hour band; markets at their UTC offsets ──
function act7(): Pose {
  const p = emptyPose()
  const caps = NODES.filter((x) => !x.id.startsWith('market.') && x.system !== 'core')
  caps.forEach((x, k) => {
    const i = NODE_INDEX[x.id]
    p.pos.set([0.08 + (k / (caps.length - 1)) * 0.84, 0.62 + (k % 2 ? 0.02 : -0.02), -0.3], i * 3)
  })
  p.pos.set([0.5, 0.62, 0], CORE * 3)
  const utc = { 'market.us': -5, 'market.uk': 0, 'market.pk': 5 }
  for (const [id, off] of Object.entries(utc)) p.pos.set([(off + 12) / 24, 0.42, 0.2], NODE_INDEX[id] * 3)
  states(p, (s) => (s === 'market' ? 'active' : 'dormant'))
  edges(p, 'band')
  for (const id of Object.keys(utc)) p.label[NODE_INDEX[id]] = 1
  return p
}

// ── Act 8: work rail; the canvas dims so the DOM leads ──
function act8(): Pose {
  const p = act3()
  p.dim = 0.5
  return p
}

// ── Act 9: everything converges on the core, which resolves into the mark ──
function act9(): Pose {
  const p = emptyPose()
  place(p, [
    ...bySystem({
      acquire: { x: 0.44, y: 0.36, z: 0, r: 0.04 },
      sell: { x: 0.56, y: 0.36, z: 0.2, r: 0.045 },
      operate: { x: 0.56, y: 0.48, z: 0, r: 0.035 },
      build: { x: 0.44, y: 0.48, z: -0.6, r: 0.04 },
    }),
    [['core.growlatics'], CORE_C(0.5, 0.42)],
  ])
  parkMarkets(p)
  states(p, (s) => (s === 'market' ? 'hidden' : s === 'core' ? 'active' : 'idle'))
  edges(p, 'converge')
  p.mark = 1
  return p
}

export const KEYS: Pose[] = [act1(), act2(), act3(), ...[0, 1, 2, 3, 4].map(journey), act5(), act6(), act7(), act8(), act9()]

/** Phone/portrait: transpose so horizontal arrangements stack vertically. */
// ponytail: plain x/y transpose; hand-tune portrait keys if a phone act reads wrong.
export function transpose(p: Pose) {
  for (let i = 0; i < N; i++) {
    const x = p.pos[i * 3]
    p.pos[i * 3] = p.pos[i * 3 + 1]
    p.pos[i * 3 + 1] = x
  }
  const cx = p.cam[0]
  p.cam[0] = p.cam[1]
  p.cam[1] = cx
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Scroll position → continuous key position. 60% dwell on the act's end state, 40% travel to the next (§4.4). */
export function keyPosition(act: number, local: number, stage = 0, stageLocal = 0) {
  const k = keyFor(act, stage)
  const l = act === 4 ? stageLocal : local
  const travel = l < 0.6 ? 0 : easeInOut(Math.min(1, (l - 0.6) / 0.4))
  return Math.min(KEY_COUNT - 1, k + travel)
}

/** Writes the blended pose at key position `kp` into `out` (no allocation). */
export function poseAt(out: Pose, kp: number) {
  const i0 = Math.max(0, Math.min(KEY_COUNT - 1, Math.floor(kp)))
  const i1 = Math.min(KEY_COUNT - 1, i0 + 1)
  const t = kp - i0
  const a = KEYS[i0], b = KEYS[i1]
  const lerpArr = (o: Float32Array, x: Float32Array, y: Float32Array) => {
    for (let j = 0; j < o.length; j++) o[j] = x[j] + (y[j] - x[j]) * t
  }
  lerpArr(out.pos, a.pos, b.pos)
  lerpArr(out.node, a.node, b.node)
  lerpArr(out.edge, a.edge, b.edge)
  lerpArr(out.label, a.label, b.label)
  lerpArr(out.cam, a.cam, b.cam)
  out.field = a.field + (b.field - a.field) * t
  out.dim = a.dim + (b.dim - a.dim) * t
  out.mark = a.mark + (b.mark - a.mark) * t
  out.hero = a.hero + (b.hero - a.hero) * t
  return out
}

/** The spec's ActLayout shape for one act (or journey stage), e.g. for content-driven consumers. */
export function actLayout(act: number, stage = 0): ActLayout {
  const p = KEYS[keyFor(act, stage)]
  const names = Object.keys(LEVEL) as NodeState[]
  return Object.fromEntries(
    NODES.map((x, i) => [x.id, { x: p.pos[i * 3], y: p.pos[i * 3 + 1], z: p.pos[i * 3 + 2], state: names[Math.round(p.node[i])] }]),
  )
}
