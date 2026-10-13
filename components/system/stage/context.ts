'use client'

import { createContext, useContext } from 'react'
import type { Field } from '../model/flow'
import type { Palette } from '../model/palette'

/** Mutable per-stage state shared by the stage, its renderer and its overlay (never triggers renders). */
export type StageCtx = {
  el: HTMLDivElement | null
  fixed: boolean
  tier: 0 | 1 | 2
  field: Field
  palette: Palette | null
  rect: { left: number; top: number; width: number; height: number }
  still: boolean
  pointerFx: boolean
  /** Renderer frame: draw `field` and write projected node positions into field.screen. */
  draw: ((dt: number, t: number) => void) | null
  /** Renderer calls this after its first frame; the stage cross-fades it in over the SVG. */
  ready: () => void
  /** Overlay frame work (labels), run by the stage's own task right after draw, so it pauses with the stage. */
  overlays: Set<(dt: number, t: number) => void>
  /** Renderer hook for theme changes (palette already re-read). */
  onPalette: (() => void) | null
}

export const StageContext = createContext<StageCtx | null>(null)
export const useStage = () => useContext(StageContext)
