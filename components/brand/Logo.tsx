'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { site } from '@/content'
import Mark from './Mark'

/** Header/footer logo: 20px mark + wordmark. On client navigation the mark replays R3 (§5 use 4). */
export default function Logo({ replayOnNavigate = false }: { replayOnNavigate?: boolean }) {
  const pathname = usePathname()
  const first = useRef(true)
  const [navs, setNavs] = useState(0)

  useEffect(() => {
    if (!replayOnNavigate) return
    if (first.current) {
      first.current = false
      return
    }
    setNavs((n) => n + 1)
  }, [pathname, replayOnNavigate])

  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-sm" aria-label={`${site.name} home`}>
      <Mark key={navs} size={20} state={navs > 0 ? 'rise' : 'static'} />
      <span className="text-body-l font-bold tracking-[-0.02em] text-text">{site.name}</span>
    </Link>
  )
}
