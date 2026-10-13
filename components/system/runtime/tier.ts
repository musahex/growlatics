// Capability tiers (DIRECTION §6.5). 0 static SVG · 1 Canvas2D · 2 WebGL (R3F).
import type { Tier } from './store'

export const FINE_QUERY = '(hover: hover) and (pointer: fine)'
export const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

let webgl2: boolean | null = null
function hasWebGL2() {
  if (webgl2 === null) {
    try {
      const gl = document.createElement('canvas').getContext('webgl2')
      webgl2 = !!gl
      gl?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      webgl2 = false
    }
  }
  return webgl2
}

function hasCanvas2D() {
  try {
    return !!document.createElement('canvas').getContext('2d')
  } catch {
    return false
  }
}

export function detectTier(): Tier {
  if (typeof window === 'undefined') return 0
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  if (matchMedia(REDUCED_QUERY).matches || nav.connection?.saveData) return 0
  const fine = matchMedia(FINE_QUERY).matches
  const lite =
    !fine ||
    innerWidth < 1024 ||
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) < 4
  if (!lite && hasWebGL2()) return 2
  return hasCanvas2D() ? 1 : 0
}
