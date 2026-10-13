import { privacy } from '@/content/legal'
import { pageMetadata } from '@/lib/seo'
import LegalDraft from '@/components/patterns/LegalDraft'

export const metadata = pageMetadata('/privacy/', { title: `${privacy.title} | Growlatics`, description: '', noindex: true })

export default function PrivacyPage() {
  return <LegalDraft doc={privacy} />
}
