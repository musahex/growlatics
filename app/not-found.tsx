import type { Metadata } from 'next'
import { notFoundPage } from '@/content'
import { siteMetadata } from '@/lib/seo'
import Mark from '@/components/brand/Mark'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'

// og:title without the brand suffix (siteName already carries it); spread keeps the layout's OG image and siteName.
export const metadata: Metadata = { title: { absolute: notFoundPage.seo.title }, openGraph: { ...siteMetadata.openGraph, title: notFoundPage.seo.title.replace(' | Growlatics', '') }, robots: { index: false, follow: process.env.NEXT_PUBLIC_SITE_ENV !== 'preview' } }

export default function NotFound() {
  return (
    <Section space="none" className="pb-section pt-[calc(var(--header-clear)+5rem)]">
      <Mark size={48} state="progress" value={2} />
      <h1 className="mt-10 text-display-l text-text">{notFoundPage.heading}</h1>
      <p className="mt-6 max-w-measure text-body-l text-text-2">{notFoundPage.body}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        {notFoundPage.links.map((l, i) => (
          <Button key={l.href} href={l.href} variant={i === notFoundPage.links.length - 1 ? 'primary' : 'secondary'}>
            {l.label}
          </Button>
        ))}
      </div>
    </Section>
  )
}
