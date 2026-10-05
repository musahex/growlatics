// DRAFTS ONLY — pending owner legal approval (IA §10.1). Pages are noindex, unlinked and out of the sitemap.
// Needs from the owner: legal entity name, jurisdiction, data-request contact, retention period, form provider.
import { site } from './site'

export interface LegalDoc {
  verify: true
  title: string
  status: string
  sections: { heading: string; body: string }[]
}

const status = 'Draft — pending legal review. Not yet in effect.'

export const privacy: LegalDoc = {
  verify: true,
  title: 'Privacy Policy',
  status,
  sections: [
    {
      heading: 'What we collect',
      body: 'When you request a Growth Call we collect the details you enter: your name, work email, company, and optionally your website, phone number and a message, plus your answers about services, business stage, markets and timing.',
    },
    {
      heading: 'How we use it',
      body: 'We use these details only to respond to your request. This site sets no analytics or advertising cookies.',
    },
    {
      heading: 'Contact',
      body: `For questions about your data, email ${site.contact.email}.`,
    },
  ],
}

export const terms: LegalDoc = {
  verify: true,
  title: 'Terms of Use',
  status,
  sections: [
    {
      heading: 'Use of this site',
      body: 'This site describes the services Growlatics offers. Nothing on it is an offer or a contract; engagements are agreed in writing.',
    },
    {
      heading: 'Contact',
      body: `Questions about these terms: ${site.contact.email}.`,
    },
  ],
}
