'use client'

import { useEffect } from 'react'
import { SystemStage } from '@/components/system/stage/SystemStage'
import { setFocus } from '@/components/system/runtime'
import type { SystemId } from '@/content'

/**
 * L2 hero figure (DIRECTION §8.1): one inline SystemStage per page. With `focus`, that system's
 * cluster is lit at full detail and the others rest dormant (live tiers; tier 0 shows the act's SVG).
 * Shown lg+ only (PageHero hides it below): there the HandoffStrip carries the story
 * (a display:none stage never intersects, so it never loads a renderer).
 */
export default function PageStage({ act, focus, title }: { act: number; focus?: SystemId; title: string }) {
  useEffect(() => {
    if (!focus) return
    setFocus(focus)
    return () => setFocus(null)
  }, [focus])

  return <SystemStage act={act} title={title} className="h-full w-full" />
}
