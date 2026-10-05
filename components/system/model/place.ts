// Greedy label placement shared by the live label overlay and the tier-0 SVG: right of the node,
// then left, below, above; the first slot that does not overlap a label placed before it wins.
// `h` is the label height in the caller's units (px live, viewBox units in the SVG).
export const SLOT_COUNT = 4

/** Top-left-ish anchor of slot k for a node at (nx, ny) and a label of width w. */
export function slotXY(k: number, nx: number, ny: number, w: number, h: number): [number, number] {
  const gap = h
  return k === 0 ? [nx + gap, ny - h * 0.5] : k === 1 ? [nx - gap - w, ny - h * 0.5] : k === 2 ? [nx + gap, ny + h * 0.9] : [nx + gap, ny - h * 2]
}

/** placed: flat [x, y, w, ...]. Returns [x, y, slot], trying `first` first (no flicker live); pushes the box. */
export function place(placed: number[], nx: number, ny: number, w: number, h: number, first = 0): [number, number, number] {
  for (let t = 0; t < SLOT_COUNT; t++) {
    const k = (first + t) % SLOT_COUNT
    const [x, y] = slotXY(k, nx, ny, w, h)
    let ok = true
    for (let j = 0; j < placed.length && ok; j += 3) ok = !(x < placed[j] + placed[j + 2] + h * 0.5 && placed[j] < x + w + h * 0.5 && Math.abs(y - placed[j + 1]) < h * 1.15)
    if (ok) {
      placed.push(x, y, w)
      return [x, y, k]
    }
  }
  const [x, y] = slotXY(first, nx, ny, w, h) // crowded everywhere: keep the preferred slot
  placed.push(x, y, w)
  return [x, y, first]
}

// Self-check: two labels on the same spot do not stack.
if (process.env.NODE_ENV === 'test') {
  const p: number[] = []
  const a = place(p, 100, 100, 80, 11)
  const b = place(p, 102, 100, 80, 11)
  if (a[2] === b[2]) throw new Error('place(): overlapping labels share a slot')
}
