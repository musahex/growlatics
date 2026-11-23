import { MessageCircle } from 'lucide-react'
import { aeo, whatsappHref } from '@/content'
import Button from '@/components/ui/Button'

/** Floating WhatsApp button, phones and tablets only (the copy asks for it): the audit is always one tap away. */
export default function WhatsAppFab() {
  return (
    <Button
      href={whatsappHref}
      aria-label={aeo.finalCta.primary.label}
      className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] right-4 z-overlay rounded-full pl-4 pr-5 shadow-signal lg:hidden"
    >
      <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
      {aeo.fab.label}
    </Button>
  )
}
