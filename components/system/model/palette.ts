// The only file in components/ allowed to hold colour literals (DIRECTION §2, §10.2).
// Tokens are RGB channels ("210 64 26" or "210 64 26 / 0.45"). Canvases read them here and cache
// them as numbers; DOM/SVG uses the `css` strings, which resolve per subtree (data-surface="dark").

export type RGBA = [number, number, number, number]
export type Palette = {
  dark: boolean
  additive: boolean
  bg: RGBA
  text: RGBA
  line3: RGBA
  glow: RGBA
  dormant: RGBA
  idle: RGBA
  active: RGBA
  edge: RGBA
  edgeHot: RGBA
  edgeBroken: RGBA
  packet: RGBA
}

type Key = Exclude<keyof Palette, 'dark' | 'additive'>
const VARS: Record<Key, string> = {
  bg: '--c-bg',
  text: '--c-text',
  line3: '--c-line-3',
  glow: '--c-glow',
  dormant: '--net-dormant',
  idle: '--net-idle',
  active: '--net-active',
  edge: '--net-edge',
  edgeHot: '--net-edge-hot',
  edgeBroken: '--net-edge-broken',
  packet: '--net-packet',
}

// Fallbacks = DIRECTION §2.1/§2.2 values, used only if a token is missing.
const LIGHT: Record<Key, string> = {
  bg: '245 243 240', text: '12 11 10', line3: '12 11 10 / 0.24', glow: '210 64 26 / 0.12',
  dormant: '12 11 10 / 0.22', idle: '210 64 26 / 0.45', active: '210 64 26 / 0.95', edge: '210 64 26 / 0.12',
  edgeHot: '210 64 26 / 0.48', edgeBroken: '12 11 10 / 0.18', packet: '210 64 26',
}
const DARK: Record<Key, string> = {
  bg: '7 6 5', text: '244 241 236', line3: '244 241 236 / 0.22', glow: '210 64 26 / 0.16',
  dormant: '244 241 236 / 0.20', idle: '210 64 26 / 0.52', active: '210 64 26 / 1', edge: '210 64 26 / 0.14',
  edgeHot: '210 64 26 / 0.44', edgeBroken: '244 241 236 / 0.16', packet: '240 102 60',
}

export function parseColor(v: string): RGBA | null {
  v = v.trim()
  if (!v) return null
  if (v[0] === '#') {
    const h = v.length === 4 ? v.slice(1).split('').map((c) => c + c).join('') : v.slice(1)
    const n = parseInt(h.slice(0, 6), 16)
    return Number.isNaN(n) ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1]
  }
  const m = v.replace(/rgba?\(|\)/g, '').split(/[\s,/]+/).filter(Boolean).map(Number)
  if (m.length < 3 || m.some(Number.isNaN)) return null
  return [m[0], m[1], m[2], m[3] ?? 1]
}

/** Reads the palette as resolved on `el` (so a data-surface="dark" ancestor wins). Call on theme change only. */
export function readPalette(el: Element, theme: 'dark' | 'light'): Palette {
  const cs = getComputedStyle(el)
  const surfaceDark = !!el.closest('[data-surface="dark"]')
  const dark = theme === 'dark' || surfaceDark
  const fb = dark ? DARK : LIGHT
  const out = { dark } as Palette
  for (const k of Object.keys(VARS) as Key[]) out[k] = parseColor(cs.getPropertyValue(VARS[k])) ?? parseColor(fb[k])!
  const blend = cs.getPropertyValue('--net-blend').trim()
  out.additive = blend ? blend === 'additive' : dark
  return out
}

/** Canvas2D colour string. */
export const paint = (c: RGBA, mul = 1) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, c[3] * mul))})`

/** White radial sprite stops for WebGL halos (tinted per instance). */
export const SPRITE_STOPS: [number, string][] = [
  [0, 'rgba(255,255,255,1)'],
  [0.35, 'rgba(255,255,255,0.35)'],
  [1, 'rgba(255,255,255,0)'],
]

/** CSS colour strings for DOM/SVG. They follow the cascade, so dark surfaces recolour themselves. */
export const css = {
  bg: 'rgb(var(--c-bg, 7 6 5))',
  text: 'rgb(var(--c-text, 244 241 236))',
  line3: 'rgb(var(--c-line-3, 244 241 236 / 0.22))',
  signal: 'rgb(var(--c-signal, 210 64 26))',
  signalLine: 'rgb(var(--c-signal-line, 210 64 26 / 0.38))',
  glow: 'rgb(var(--c-glow, 210 64 26 / 0.16))',
  glowStop: 'radial-gradient(circle, rgb(var(--c-glow, 210 64 26 / 0.16)) 0%, transparent 60%)',
  shSignal: 'var(--sh-signal, 0 0 0 1px rgb(210 64 26 / .38), 0 6px 28px -6px rgb(210 64 26 / .45))',
  dormant: 'rgb(var(--net-dormant, 244 241 236 / 0.20))',
  idle: 'rgb(var(--net-idle, 210 64 26 / 0.52))',
  active: 'rgb(var(--net-active, 210 64 26 / 1))',
  edge: 'rgb(var(--net-edge, 210 64 26 / 0.14))',
  edgeHot: 'rgb(var(--net-edge-hot, 210 64 26 / 0.44))',
  edgeBroken: 'rgb(var(--net-edge-broken, 244 241 236 / 0.16))',
  packet: 'rgb(var(--net-packet, 240 102 60))',
  label: 'rgb(var(--c-text-3, 138 131 123))',
  panel: 'rgb(var(--c-elevated, 20 18 15) / 0.9)',
}

/** Mixes `c` (alpha × `a`) over `bg` into an opaque sRGB 0..1 triple at `out[o..o+2]`, for WebGL vertex/instance colours. */
export function mixInto(out: Float32Array | number[], o: number, c: RGBA, a: number, p: Palette) {
  const t = Math.max(0, Math.min(1, c[3] * a))
  for (let k = 0; k < 3; k++) out[o + k] = p.additive ? (c[k] / 255) * t : (p.bg[k] + (c[k] - p.bg[k]) * t) / 255
}
