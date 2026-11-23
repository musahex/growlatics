'use client'

import { useState } from 'react'
import { aeo, whatsapp } from '@/content'
import { cn } from '@/lib/utils'
import { glassClass } from '@/components/ui/Glass'
import { flat } from '@/components/patterns/glass'
import Button from '@/components/ui/Button'

/** The ready-made WhatsApp message as a bubble, with a copy button for people who would rather paste it themselves. */
export default function WhatsAppMessage({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const c = aeo.finalCta
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(whatsapp.message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard refused (older browsers, some app views): the text is selectable, so the user can copy it by hand.
    }
  }
  return (
    <div className={cn('w-full max-w-xl', className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-data uppercase text-text-3">{c.messageLabel}</p>
        <p className="font-mono text-data text-text-3">{whatsapp.number}</p>
      </div>
      <blockquote className={glassClass('base', {}, cn('mt-3 px-5 py-4 text-left text-body text-text', flat))}>
        {whatsapp.message}
      </blockquote>
      <div className="mt-3 flex justify-end">
        <Button variant="text" onClick={copy} aria-live="polite">
          {copied ? c.copiedLabel : c.copyLabel}
        </Button>
      </div>
    </div>
  )
}
