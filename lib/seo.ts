import type { Metadata } from 'next'
import { nav, site, type Seo } from '@/content'

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: site.positioning }
const SUFFIX = ' | Growlatics'
const ORG_ID = `${site.url}/#organization`
// GitHub Pages preview (docs/v2/PREVIEW.md): every page noindex; canonical/OG stay on site.url.
const NOINDEX = { index: false, follow: false }
const PREVIEW = process.env.NEXT_PUBLIC_SITE_ENV === 'preview'

/** Site-wide defaults for the root layout only: no canonical, so 404 and noindex routes never inherit Home's.
 *  Icons are file conventions (app/icon.svg, app/favicon.ico, app/apple-icon.png): those override metadata `icons`. */
export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: { default: site.name, template: `%s${SUFFIX}` },
  description: site.description,
  openGraph: { siteName: site.name, type: 'website', locale: 'en_US', images: [OG_IMAGE] },
  twitter: { card: 'summary_large_image', images: [OG_IMAGE] },
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/site.webmanifest`,
  robots: PREVIEW ? NOINDEX : undefined,
}

/** JSON-LD as a string safe to drop into <script type="application/ld+json">. */
export const ldJson = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c')

/** Page metadata: canonical https://growlatics.us{route}, OG and Twitter (IA §7). */
export function pageMetadata(route: string, seo: Seo): Metadata {
  const ogTitle = seo.ogTitle ?? seo.title.replace(SUFFIX, '')
  const description = seo.description || undefined
  return {
    title: { absolute: seo.title },
    description,
    alternates: { canonical: route },
    robots: seo.noindex || PREVIEW ? NOINDEX : undefined,
    openGraph: {
      title: ogTitle,
      description,
      url: route,
      siteName: site.name,
      type: 'website',
      locale: 'en_US',
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description, images: [OG_IMAGE] },
  }
}

// tel:+14707556472 → +1-470-755-6472
const telephone = site.contact.phoneHref.replace('tel:+1', '').replace(/(\d{3})(\d{3})(\d{4})/, '+1-$1-$2-$3')

const areaServed = site.markets.filter((m) => m.code !== 'INTL').map((m) => m.code)

/** Organization + WebSite JSON-LD for Home. Every field comes from content; no address, ratings or counts (IA §7). */
export function homeJsonLd() {
  const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: site.url,
    logo: { '@type': 'ImageObject', url: `${site.url}/logo.png`, width: 512, height: 512 },
    description: site.description,
    email: site.contact.email,
    telephone,
    sameAs: site.social.map((s) => s.href),
    areaServed,
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: site.contact.email, telephone },
  }
  const website = { '@type': 'WebSite', '@id': `${site.url}/#website`, name: site.name, url: site.url, publisher: { '@id': ORG_ID } }
  return { '@context': 'https://schema.org', '@graph': [organization, website] }
}

// Breadcrumb names: nav labels for sections, service names for service pages.
const crumbNames: Record<string, string> = Object.fromEntries(
  nav.header.flatMap((i) => [[i.href, i.label], ...(i.children ?? []).map((c) => [c.href, c.label])]),
)

/** BreadcrumbList JSON-LD for an inner route, e.g. /services/sales-bpo/ → Home › Services › Sales & BPO. */
export function breadcrumbJsonLd(route: string) {
  const trail = ['/', ...route.split('/').filter(Boolean).map((_, i, parts) => `/${parts.slice(0, i + 1).join('/')}/`)]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r === '/' ? 'Home' : crumbNames[r] ?? r, item: `${site.url}${r}` })),
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
    serviceType: name,
    provider: { '@type': 'Organization', '@id': ORG_ID, name: site.name, url: site.url },
    areaServed,
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
