import type { SiteContent } from './types'

export const site: SiteContent = {
  name: 'Growlatics',
  url: 'https://growlatics.us',
  positioning:
    'Growlatics builds and operates the systems behind growth: demand, sales, customer operations and technology, connected and run by one accountable partner.',
  tagline: 'The systems behind growth.',
  geography: 'US / Pakistan business; serving US, UK, Pakistan and international clients.',
  description:
    'US / Pakistan-based international growth operations, Sales & BPO and technology partner connecting marketing, sales, customer operations and technology.',
  markets: [
    { code: 'US', label: 'United States' },
    { code: 'GB', label: 'United Kingdom' },
    { code: 'PK', label: 'Pakistan' },
    { code: 'INTL', label: 'International' },
  ],
  contact: { email: 'ahsan@growlatics.com', phone: '+1 (470) 755-6472', phoneHref: 'tel:+14707556472' },
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/growlatics/' },
    { label: 'Facebook', href: 'https://www.facebook.com/share/1bFSXzTp4i/' },
    { label: 'Instagram', href: 'https://www.instagram.com/growlatics' },
  ],
  primaryCta: { label: 'Book a Growth Call', href: '/contact/#book' },
  finalCta: {
    heading: 'Show us where growth is leaking.',
    body: "A Growth Call is a focused conversation about your pipeline, your teams and your tools. You'll leave with a clear view of where the system breaks and what to fix first.",
    primary: { label: 'Book a Growth Call', href: '/contact/#book' },
    secondary: { label: 'Email us', href: 'mailto:ahsan@growlatics.com' },
    note: 'No commitment. Just a clear conversation about your growth.',
  },
}
