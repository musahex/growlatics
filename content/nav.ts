import type { NavContent } from './types'
import { site } from './site'

export const nav: NavContent = {
  header: [
    {
      label: 'Services',
      href: '/services/',
      // Sell first in menus (commercial priority, IA §3)
      children: [
        { system: 'sell', label: 'Sales & BPO', href: '/services/sales-bpo/' },
        { system: 'acquire', label: 'Performance Marketing', href: '/services/performance-marketing/' },
        { system: 'operate', label: 'Customer Operations', href: '/services/customer-operations/' },
        { system: 'build', label: 'Technology & Development', href: '/services/technology/' },
      ],
    },
    { label: 'Work', href: '/work/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],
  servicesPanelFooter: { label: 'See how the four systems connect', href: '/services/' },
  footer: [
    {
      heading: 'Services',
      links: [
        { label: 'Sales & BPO', href: '/services/sales-bpo/' },
        { label: 'Performance Marketing', href: '/services/performance-marketing/' },
        { label: 'Customer Operations', href: '/services/customer-operations/' },
        { label: 'Technology & Development', href: '/services/technology/' },
        { label: 'All services', href: '/services/' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about/' },
        { label: 'Work', href: '/work/' },
        { label: 'Contact', href: '/contact/' },
      ],
    },
    {
      heading: 'Contact',
      links: [
        { label: 'Book a Growth Call', href: '/contact/#book' },
        { label: site.contact.email, href: `mailto:${site.contact.email}` },
        { label: site.contact.phone, href: site.contact.phoneHref },
      ],
    },
  ],
  // Empty until the owner approves /privacy/ and /terms/ (IA §10.1).
  legal: [],
  skipLink: 'Skip to content',
  copyright: (year) => `© ${year} Growlatics. All rights reserved.`,
}
