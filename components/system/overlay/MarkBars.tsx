// Five-bar mark geometry (DIRECTION §5): 66×70u, bars 10u wide, 4u gap, heights 32/52/70/86/100%,
// 3u radius on all corners. Local to the network overlays; the brand component is components/brand/Mark.tsx.
import { css } from '../model/palette'

export const MARK_HEIGHTS = [22.4, 36.4, 49, 60.2, 70]

/** Bars as SVG <rect>s in a 66×70 box. `rise` 0..1 scales them up from the bottom (R3). */
export function MarkRects({ rise = 1 }: { rise?: number }) {
  return (
    <>
      {MARK_HEIGHTS.map((h, i) => {
        const hh = h * Math.min(1, Math.max(0, rise * 1.25 - i * 0.06))
        return <rect key={i} x={i * 14} y={70 - hh} width={10} height={hh} rx={3} ry={3} fill={css.signal} />
      })}
    </>
  )
}
