// JS mirror of the colour tokens in app/globals.css, for legacy canvas/three code that cannot read
// Tailwind classes. SYSTEM-3D replaces this with components/system/model/palette.ts (reads CSS at runtime).
export type RGB = readonly [number, number, number]

export const signal: RGB = [210, 64, 26]
export const signalHex = '#D2401A'
export const signalDeepHex = '#A83216'
export const bgHex = { light: '#F5F3F0', dark: '#070605' } as const
export const textHex = { light: '#0C0B0A', dark: '#F4F1EC' } as const
export const text4Hex = { light: '#A39D96', dark: '#4F4943' } as const
export const ink: Record<'light' | 'dark', RGB> = { light: [12, 11, 10], dark: [244, 241, 236] }

/** CSS colour string with alpha, for Canvas2D fill/stroke styles. */
export const alpha = ([r, g, b]: RGB, a: number) => `rgb(${r} ${g} ${b} / ${a})`
