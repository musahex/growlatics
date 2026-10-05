'use client'

import { useSyncExternalStore } from 'react'
import { subscribe, sys, type DiscreteKey } from './store'

const read: Record<DiscreteKey, () => unknown> = {
  tier: () => sys.tier,
  theme: () => sys.theme,
  reduced: () => sys.reduced,
  act: () => sys.act.index,
  stage: () => sys.journey.stage,
  focus: () => sys.focus,
  visible: () => sys.visible,
  fine: () => sys.pointer.fine,
  live: () => sys.live,
}
// SSR = tier 0, dark, act 1: the static composition every visitor sees first.
const server: Record<DiscreteKey, unknown> = {
  tier: 0, theme: 'dark', reduced: false, act: 1, stage: 0, focus: null, visible: true, fine: false, live: false,
}

type Values = {
  tier: typeof sys.tier
  theme: typeof sys.theme
  reduced: boolean
  act: number
  stage: number
  focus: typeof sys.focus
  visible: boolean
  fine: boolean
  live: boolean
}

/** Re-renders only when this discrete value changes. */
export function useSystem<K extends DiscreteKey>(key: K): Values[K] {
  return useSyncExternalStore(
    (fn) => subscribe(key, fn),
    read[key] as () => Values[K],
    () => server[key] as Values[K],
  )
}
