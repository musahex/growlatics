// The site's only requestAnimationFrame (DIRECTION §6.4). Stops itself when there are no tasks
// or the tab is hidden; restarts on demand. Task order: 0 smoothing · 10 stage controller ·
// 20 canvases · 30 overlays/labels · 40 cursor.
import { sys } from './store'

/** Order-0 smoothing runs before every frame's tasks (pointer for the network, k = 6). */
function smooth(dt: number) {
  const p = sys.pointer
  if (p.sx < -1e3) {
    p.sx = p.x
    p.sy = p.y
  }
  p.sx = damp(p.sx, p.x, 6, dt)
  p.sy = damp(p.sy, p.y, 6, dt)
}

type Task = { id: string; fn: (dt: number, t: number) => void; order: number }
const tasks: Task[] = []
let raf = 0
let last = 0

function frame(now: number) {
  raf = 0
  const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
  last = now
  smooth(dt)
  for (let i = 0; i < tasks.length; i++) tasks[i].fn(dt, now)
  if (tasks.length && sys.visible) raf = requestAnimationFrame(frame)
  else last = 0
}

export function wake() {
  if (!raf && tasks.length && sys.visible && typeof window !== 'undefined') raf = requestAnimationFrame(frame)
}

export function addTask(id: string, fn: Task['fn'], order: number) {
  removeTask(id)
  tasks.push({ id, fn, order })
  tasks.sort((a, b) => a.order - b.order)
  wake()
}

export function removeTask(id: string) {
  const i = tasks.findIndex((x) => x.id === id)
  if (i >= 0) tasks.splice(i, 1)
  if (!tasks.length && raf) {
    cancelAnimationFrame(raf)
    raf = 0
    last = 0
  }
}

/** Frame-rate-independent damping (§4.2): v += (target - v) * (1 - exp(-k * dt)). */
export const damp = (v: number, target: number, k: number, dt: number) => v + (target - v) * (1 - Math.exp(-k * dt))

/** Debug/QA: number of live tasks and whether the loop is running. */
export const schedulerState = () => ({ tasks: tasks.map((x) => x.id), running: raf !== 0 })
