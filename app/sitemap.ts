import type { MetadataRoute } from 'next'
import { site } from '@/content'
import { sitemapRoutes } from '@/lib/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.map(({ route, priority }) => ({ url: `${site.url}${route}`, priority }))
}
