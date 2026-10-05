// Greedy label placement shared by the live label overlay and the tier-0 SVG: right of the node,
// then left, below, above; the first slot that does not overlap a label placed before it wins.
// `h` is the label height in the caller's units (px live, viewBox units in the SVG).
export const SLOT_COUNT = 4

/** Top-left-ish anchor of slot k for a node at (nx, ny) and a label of width w. */
export function slotXY(k: number, nx: number, ny: number, w: number, h: number): [number, number] {
  const gap = h
  return k === 0 ? [nx + gap, ny - h * 0.5] : k === 1 ? [nx - gap - w, ny - h * 0.5] : k === 2 ? [nx + gap, ny + h * 0.9] : [nx + gap, ny - h * 2]
}

/** Reserve a node's dot (radius r) so labels never print over other nodes. */
export function reserveNode(placed: number[], nx: number, ny: number, r: number, h: number) {
  placed.push(nx - r, ny - h * 0.5, r * 2)
}

/**
 * placed: flat [x, y, w, ...]; maxX = figure width. Returns [x, y, slot], trying `first` first (no flicker
 * live), and pushes the box. Returns null when every slot collides: the caller drops that label
 * (REVIEW_CREATIVE #7: a missing label beats two overprinted ones). Callers place important labels first.
 */
export function place(placed: number[], nx: number, ny: number, w: number, h: number, first = 0, maxX = Infinity): [number, number, number] | null {
  for (let t = 0; t < SLOT_COUNT; t++) {
    const k = (first + t) % SLOT_COUNT
    const [x, y] = slotXY(k, nx, ny, w, h)
    let ok = x >= 0 && x + w <= maxX // stay inside the figure
    for (let j = 0; j < placed.length && ok; j += 3) ok = !(x < placed[j] + placed[j + 2] + h * 0.6 && placed[j] < x + w + h * 0.6 && Math.abs(y - placed[j + 1]) < h * 1.3)
    if (ok) {
      placed.push(x, y, w)
      return [x, y, k]
    }
  }
  return null
}

// Self-check: no two labels share a spot, and a crowded label drops.
if (process.env.NODE_ENV === 'test') {
  const p: number[] = []
  reserveNode(p, 300, 100, 4, 11)
  const a = place(p, 100, 100, 80, 11)
  const b = place(p, 102, 100, 80, 11)
  if (!a || (b && b[2] === a[2])) throw new Error('place(): overlapping labels share a slot')
  for (let i = 0; i < 6; i++) place(p, 101, 100, 80, 11)
  if (place(p, 100, 100, 80, 11)) throw new Error('place(): a crowded label must drop')
}
