import { cn } from '@/lib/utils'
import Reveal from '@/components/ui/Reveal'

export interface RailItem {
  index: string
  title: string
  body?: string
  tags?: string[]
  note?: string
}

/** P2 Signal rail: hairline with numbered nodes, horizontal from lg, vertical below. */
export default function SignalRail({
  items,
  isActive = () => true,
  className,
}: {
  items: RailItem[]
  /** Lit nodes (signal); others render dormant. */
  isActive?: (i: number) => boolean
  className?: string
}) {
  return (
    <Reveal
      as="ol"
      group
      className={cn('relative grid gap-10 lg:auto-cols-fr lg:grid-flow-col lg:gap-8', className)}
    >
      <span aria-hidden className="absolute bottom-2 left-1.5 top-2 w-px bg-line-2 lg:inset-x-0 lg:bottom-auto lg:top-1.5 lg:h-px lg:w-auto" />
      {items.map((item, i) => {
        const lit = isActive(i)
        return (
          <Reveal as="li" item key={item.index} className="relative pl-10 lg:pl-0 lg:pt-10">
            <span
              aria-hidden
              className={cn(
                'absolute left-0 top-0 size-3 rounded-full border',
                lit ? 'border-signal bg-signal' : 'border-line-3 bg-bg',
              )}
            />
            <p className={cn('font-mono text-data', lit ? 'text-signal-ink' : 'text-text-3')}>{item.index}</p>
            <h3 className="mt-2 text-title text-text">{item.title}</h3>
            {item.body && <p className="mt-3 max-w-measure text-body-s text-text-2">{item.body}</p>}
            {item.note && <p className="mt-3 font-mono text-data text-text-3">{item.note}</p>}
            {item.tags && item.tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <li key={t} className="rounded-sm border border-line px-2 py-1 font-mono text-data-s text-text-3">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        )
      })}
    </Reveal>
  )
}
