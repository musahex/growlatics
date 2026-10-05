import { terms } from '@/content'
import { pageMetadata } from '@/lib/seo'
import LegalDraft from '@/components/patterns/LegalDraft'

export const metadata = pageMetadata('/terms/', { title: `${terms.title} | Growlatics`, description: '', noindex: true })

export default function TermsPage() {
  return <LegalDraft doc={terms} />
}
