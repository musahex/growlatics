// Scroll → { act, local } and, inside act 4, { stage, local } (DIRECTION §6.7).
// DOM sections carry data-act="1".."9"; the journey section may carry data-journey-stage children,
// otherwise its height is split into five equal stages. Offsets are measured on resize only.
import { publish, sys } from '../runtime/store'
import { addTask, removeTask } from '../runtime/scheduler'
import { STAGE_COUNT } from '../model/layouts'

type Span = { act: number; top: number; h: number }
let spans: Span[] = []
let stages: { top: number; h: number }[] = []
let users = 0
let ro: ResizeObserver | null = null

function measure() {
  const y = scrollY
  spans = Array.from(document.querySelectorAll<HTMLElement>('[data-act]'), (el) => {
    const r = el.getBoundingClientRect()
    return { act: Number(el.dataset.act), top: r.top + y, h: Math.max(1, r.height) }
  }).sort((a, b) => a.top - b.top)
  stages = Array.from(document.querySelectorAll<HTMLElement>('[data-journey-stage]'), (el) => {
    const r = el.getBoundingClientRect()
    return { top: r.top + y, h: Math.max(1, r.height) }
  })
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function tick() {
  if (sys.manual || !spans.length) return
  const y = sys.scroll.y + sys.viewport.h * 0.5 // the act under the middle of the viewport
  let s = spans[0]
  for (const x of spans) if (y >= x.top) s = x
  const local = clamp01((y - s.top) / s.h)
  let stage = sys.journey.stage, stageLocal = sys.journey.local
  if (s.act === 4) {
    if (stages.length) {
      stage = 0
      for (let i = 0; i < stages.length; i++) if (y >= stages[i].top) stage = i
      stageLocal = clamp01((y - stages[stage].top) / stages[stage].h)
    } else {
      const v = local * STAGE_COUNT
      stage = Math.min(STAGE_COUNT - 1, Math.floor(v))
      stageLocal = clamp01(v - stage)
    }
  }
  const actChanged = s.act !== sys.act.index
  const stageChanged = stage !== sys.journey.stage
  sys.act.index = s.act
  sys.act.local = local
  sys.journey.stage = stage
  sys.journey.local = stageLocal
  if (actChanged) publish('act')
  if (stageChanged) publish('stage')
}

/** Ref-counted; the fixed home stage starts it. Returns a stop function. */
export function startStageController() {
  if (users++ === 0) {
    measure()
    ro = new ResizeObserver(measure)
    ro.observe(document.body)
    addTask('stage-controller', tick, 10)
  }
  return () => {
    if (--users === 0) {
      ro?.disconnect()
      ro = null
      removeTask('stage-controller')
    }
  }
}

/** Re-measure after a layout change that does not resize <body> (e.g. fonts). */
export const remeasure = measure
