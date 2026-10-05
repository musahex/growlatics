import type { Metadata } from 'next'
import { site, type Seo } from '@/content'

const OG_IMAGE = '/og-image.png'
const SUFFIX = ' | Growlatics'

/** Page metadata: canonical https://growlatics.us{route}, OG and Twitter (IA §7). */
export function pageMetadata(route: string, seo: Seo): Metadata {
  const ogTitle = seo.ogTitle ?? seo.title.replace(SUFFIX, '')
  const description = seo.description || undefined
  return {
    title: { absolute: seo.title },
    description,
    alternates: { canonical: route },
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: ogTitle,
      description,
      url: route,
      siteName: site.name,
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description, images: [OG_IMAGE] },
  }
}

// tel:+14707556472 → +1-470-755-6472
const telephone = site.contact.phoneHref.replace('tel:+1', '').replace(/(\d{3})(\d{3})(\d{4})/, '+1-$1-$2-$3')

/** Organization JSON-LD for Home. Every field comes from content; no address (IA §7). */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    description: site.description,
    email: site.contact.email,
    telephone,
    sameAs: site.social.map((s) => s.href),
    areaServed: site.markets.filter((m) => m.code !== 'INTL').map((m) => m.code),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.contact.email,
      telephone,
    },
  }
}

/** Service JSON-LD for a service page; provider → the Organization, no offers or prices. */
export function serviceJsonLd(name: string, route: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${site.url}${route}`,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    areaServed: site.markets.filter((m) => m.code !== 'INTL').map((m) => m.code),
  }
}

/** Indexable routes for the sitemap (privacy/terms excluded until approved). */
export const sitemapRoutes: { route: string; priority: number }[] = [
  { route: '/', priority: 1.0 },
  { route: '/services/', priority: 0.9 },
  { route: '/services/sales-bpo/', priority: 0.9 },
  { route: '/services/performance-marketing/', priority: 0.8 },
  { route: '/services/customer-operations/', priority: 0.8 },
  { route: '/services/technology/', priority: 0.8 },
  { route: '/about/', priority: 0.7 },
  { route: '/contact/', priority: 0.9 },
  { route: '/work/', priority: 0.5 },
]
