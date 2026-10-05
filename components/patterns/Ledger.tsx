import Link from 'next/link'
import { cn } from '@/lib/utils'
import Reveal from '@/components/ui/Reveal'

export interface LedgerRow {
  term: string
  description: string
  href?: string
}

/** P5 Ledger: two-column definition table with hairline rows and mono index; no boxes. */
export default function Ledger({ rows, className, termAs: Term = 'h3' }: { rows: LedgerRow[]; className?: string; termAs?: 'h3' | 'p' }) {
  return (
    <Reveal as="ol" group className={cn('border-b border-line', className)}>
      {rows.map((r, i) => (
        <Reveal
          as="li"
          item
          key={r.term}
          className="grid gap-2 border-t border-line py-6 md:grid-cols-[3rem_minmax(0,2fr)_minmax(0,3fr)] md:gap-8"
        >
          <span className="font-mono text-data text-text-3">{String(i + 1).padStart(2, '0')}</span>
          <Term className="text-body-l font-semibold text-text">
            {r.href ? (
              <Link href={r.href} className="hover:text-signal-ink">
                {r.term}
              </Link>
            ) : (
              r.term
            )}
          </Term>
          <p className="text-body text-text-2">{r.description}</p>
        </Reveal>
      ))}
    </Reveal>
  )
}
