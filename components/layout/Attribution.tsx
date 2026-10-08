'use client'

import { useEffect } from 'react'
import { captureAttribution, trackLink } from '@/lib/analytics'

// Mounted once in the root layout: keeps landing UTMs for the whole visit (sessionStorage, lib/analytics) and emits
// contact intent events for plain server-rendered links marked data-track="<location>" (footer, contact aside).
export default function Attribution() {
  useEffect(() => {
    captureAttribution()
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[data-track]')
      if (a) trackLink(a.getAttribute('href') ?? '', a.getAttribute('data-track') ?? '')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
