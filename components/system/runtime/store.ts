// One mutable interaction store (DIRECTION §6.4). No React in the loop: frame code reads `sys`
// directly; React re-renders only on discrete keys through subscribe()/useSystem().
import type { SystemId } from '../model/graph'

export type Tier = 0 | 1 | 2
export type Theme = 'dark' | 'light'

export const sys = {
  pointer: { x: -1e4, y: -1e4, nx: 0, ny: 0, sx: -1e4, sy: -1e4, active: false, fine: false, target: null as Element | null }, // px, -1..1, smoothed px, element under pointer
  scroll: { y: 0, progress: 0, velocity: 0 },
  viewport: { w: 0, h: 0, dpr: 1 },
  theme: 'dark' as Theme,
  reduced: false,
  tier: 0 as Tier,
  /** Lab/QA override; null = detected tier. */
  tierOverride: null as Tier | null,
  visible: true,
  act: { index: 1, local: 0 },
  journey: { stage: 0, local: 0 },
  /** When true the StageController leaves act/journey alone (lab, inline figures). */
  manual: false,
  focus: null as SystemId | null,
  /** Nearest live node on the fixed home stage, viewport px; d = distance to pointer. Written by renderers. */
  near: { x: 0, y: 0, d: Infinity },
  /** True while the fixed home stage draws a live (tier 1/2) renderer; inline act figures hide then. */
  live: false,
}

/** Called on every pointer move/over, so idle frame tasks (the cursor) can wake themselves. */
export const pointerHooks = new Set<() => void>()

export type DiscreteKey = 'tier' | 'theme' | 'reduced' | 'act' | 'stage' | 'focus' | 'visible' | 'fine' | 'live'
type Fn = () => void
const subs = new Map<DiscreteKey, Set<Fn>>()

export function subscribe(key: DiscreteKey, fn: Fn) {
  let s = subs.get(key)
  if (!s) subs.set(key, (s = new Set()))
  s.add(fn)
  return () => void s!.delete(fn)
}

export function publish(key: DiscreteKey) {
  subs.get(key)?.forEach((fn) => fn())
}

/** UI entry point for focus (System index, inspector). */
export function setFocus(f: SystemId | null) {
  if (sys.focus === f) return
  sys.focus = f
  publish('focus')
}

/** Manual act/stage (lab page, or a section that drives the stage itself). */
export function setAct(index: number, local = 0, stage = sys.journey.stage, stageLocal = 0) {
  const changed = index !== sys.act.index || stage !== sys.journey.stage
  sys.act.index = index
  sys.act.local = local
  sys.journey.stage = stage
  sys.journey.local = stageLocal
  if (changed) {
    publish('act')
    publish('stage')
  }
}
