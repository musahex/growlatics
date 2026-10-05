import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface HandoffNode {
  label: string
  sub?: string
  href?: string
}

function Node({ node, current }: { node: HandoffNode; current?: boolean }) {
  const inner = (
    <>
      <span aria-hidden className={cn('size-3 shrink-0 rounded-full border', current ? 'border-signal bg-signal' : 'border-net-idle bg-bg')} />
      <span className="flex flex-col">
        <span className={cn('font-mono text-data uppercase', current ? 'text-signal-ink' : 'text-text-3')}>{node.label}</span>
        {node.sub && <span className={cn('text-body-s', current ? 'font-semibold text-text' : 'text-text-2')}>{node.sub}</span>}
      </span>
    </>
  )
  const cls = 'flex min-h-11 items-center gap-3'
  return node.href && !current ? (
    <Link href={node.href} className={cn(cls, 'rounded-sm hover:[&_span]:text-text')}>
      {inner}
    </Link>
  ) : (
    <div className={cls} aria-current={current ? 'true' : undefined}>
      {inner}
    </div>
  )
}

/** A live edge: hairline with one packet travelling along it (static dot under reduced motion). */
function Edge() {
  return (
    <span aria-hidden className="relative flex h-8 w-px self-start bg-net-edge-hot md:h-px md:w-auto md:flex-1 md:self-center">
      <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-net-packet md:hidden" />
      {/* full-width carrier translates 0→100% of the edge; the dot rides its left end */}
      <span className="absolute inset-0 hidden motion-safe:animate-travel md:block">
        <span className="absolute -top-0.5 left-0 size-1.5 rounded-full bg-net-packet motion-reduce:left-1/2" />
      </span>
    </span>
  )
}

/** P6 Handoff strip: [upstream] → this service → [downstream], with the live edge animated. */
export default function HandoffStrip({
  upstream,
  current,
  downstream,
  base,
  label,
}: {
  upstream: HandoffNode[]
  current: HandoffNode
  downstream: HandoffNode[]
  /** Layer underneath the flow (Build), drawn under a hairline. */
  base?: HandoffNode
  label?: string
}) {
  return (
    <div className="border-y border-line py-6">
      {label && <p className="mb-4 font-mono text-data text-text-3">{label}</p>}
      <div className="flex flex-col gap-2 pl-1 md:flex-row md:items-center md:gap-6 md:pl-0">
        {upstream.length > 0 && (
          <>
            <div className="flex flex-col gap-1">{upstream.map((n) => <Node key={n.label} node={n} />)}</div>
            <Edge />
          </>
        )}
        <Node node={current} current />
        {downstream.length > 0 && (
          <>
            <Edge />
            <div className="flex flex-col gap-1">{downstream.map((n) => <Node key={n.label} node={n} />)}</div>
          </>
        )}
      </div>
      {base && (
        <div className="mt-4 border-t border-dashed border-line-2 pt-4">
          <Node node={base} />
        </div>
      )}
    </div>
  )
}
