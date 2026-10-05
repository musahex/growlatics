'use client'

// Wires the R3F root to the scheduler (frameloop="never" + advance()) and adapts DPR (§6.6):
// start at min(dpr, 1.5); if the mean frame time over 90 frames exceeds 20ms, drop to 1.25, then
// to 1.0, once each, never raising it again this session.
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import type { StageCtx } from '../stage/context'

const STEPS = [1.25, 1]
let session = { step: -1 } // shared across mounts: never raise DPR again this session

export const initialDpr = () => (session.step >= 0 ? STEPS[session.step] : Math.min(typeof window === 'undefined' ? 1 : devicePixelRatio || 1, 1.5))

export function SceneEnvironment({ stage }: { stage: StageCtx }) {
  const advance = useThree((s) => s.advance)
  const setDpr = useThree((s) => s.setDpr)

  useEffect(() => {
    let first = true
    let sum = 0, n = 0
    stage.draw = (dt, t) => {
      advance(t / 1000, true) // R3F "never" loop takes seconds
      if (first) {
        first = false
        stage.ready()
        return
      }
      sum += dt
      if (++n === 90) {
        // Next step strictly below the current DPR (a 1× screen must not "drop" to 1.25).
        const cur = initialDpr()
        const next = STEPS.findIndex((d) => d < cur)
        if (sum / n > 0.02 && next >= 0) {
          session = { step: next }
          setDpr(STEPS[next])
        }
        sum = n = 0
      }
    }
    return () => {
      stage.draw = null
    }
  }, [stage, advance, setDpr])
  return null
}
