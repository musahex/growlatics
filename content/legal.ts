// DRAFTS ONLY — pending owner legal approval (IA §10.1, GLASS_BRIEF §12 C). Pages are noindex, unlinked and out of the sitemap.
// Structurally complete; every owner-only fact is an OWNER placeholder below. No registration details are invented.
// To publish: owner replaces each placeholder and approves the text, then link the pages, drop noindex, add to the sitemap.
import { site } from './site'

export interface LegalDoc {
  verify: true
  title: string
  status: string
  /** Owner-required facts still shown as placeholders in the text. Empty = none left. */
  ownerRequired: string[]
  sections: { heading: string; body: string }[]
}

/** Clearly marked owner placeholders: rendered verbatim in the draft so they cannot be missed. */
export const OWNER = {
  entity: '[LEGAL ENTITY NAME — OWNER TO PROVIDE]',
  law: '[GOVERNING LAW / JURISDICTION — OWNER TO PROVIDE]',
  retention: '[RETENTION PERIOD — OWNER TO PROVIDE]',
  effective: '[EFFECTIVE DATE — SET ON APPROVAL]',
}

const status = `Draft — pending legal review. Not yet in effect. Effective date: ${OWNER.effective}.`
const email = site.contact.email

export const privacy: LegalDoc = {
  verify: true,
  title: 'Privacy Policy',
  status,
  ownerRequired: ['Legal entity name', 'Retention period', 'Effective date'],
  sections: [
    {
      heading: 'Who we are',
      body: `This site, ${site.url.replace('https://', '')}, is operated by ${OWNER.entity} ("Growlatics", "we"). This policy explains what we collect through the site and how we use it.`,
    },
    {
      heading: 'What we collect',
      body: 'When you request a Growth Call we collect the details you enter: your name, work email, company, and optionally your website, phone number and a message, plus your answers about services, business stage, markets and timing. If you email or call us directly, we receive what you send.',
    },
    {
      heading: 'How we use it',
      body: 'We use these details only to respond to your request and to discuss a possible engagement with you. We do not sell your details or use them for advertising.',
    },
    {
      heading: 'How your request reaches us',
      body: 'By default the form opens a pre-filled email in your own email app, which you send to us; nothing is sent until you press send. If we later route requests through a form, booking or CRM provider, we will name that provider here before it is switched on.',
    },
    {
      heading: 'Cookies and local storage',
      body: 'This site sets no analytics or advertising cookies. It stores your light or dark theme choice in your browser’s local storage; that value never leaves your device.',
    },
    {
      heading: 'How long we keep it',
      body: `We keep enquiry details for ${OWNER.retention}, or for as long as we have an active business relationship with you, and then delete them.`,
    },
    {
      heading: 'Your choices',
      body: `You can ask us to see, correct or delete the details we hold about you by emailing ${email}. Depending on where you live, you may have further rights under local data-protection law.`,
    },
    {
      heading: 'Changes to this policy',
      body: 'If this policy changes, the updated version will be posted on this page with a new effective date.',
    },
    {
      heading: 'Contact',
      body: `For questions about your data, email ${email}.`,
    },
  ],
}

export const terms: LegalDoc = {
  verify: true,
  title: 'Terms of Use',
  status,
  ownerRequired: ['Legal entity name', 'Governing law / jurisdiction', 'Effective date'],
  sections: [
    {
      heading: 'Who we are',
      body: `This site is operated by ${OWNER.entity} ("Growlatics", "we"). By using it you agree to these terms.`,
    },
    {
      heading: 'Use of this site',
      body: 'This site describes the services Growlatics offers. Nothing on it is an offer or a contract; engagements are agreed in writing.',
    },
    {
      heading: 'Content and trademarks',
      body: 'The text, design and the Growlatics name and mark on this site belong to Growlatics. You may share links to the site; please do not copy or reuse its content without permission.',
    },
    {
      heading: 'No warranty',
      body: 'We aim to keep the site accurate and available, but it is provided as is. Information on it is general and may change without notice.',
    },
    {
      heading: 'Links to other sites',
      body: 'Links to other sites, such as our social profiles, are provided for convenience. We are not responsible for their content or policies.',
    },
    {
      heading: 'Governing law',
      body: `These terms are governed by ${OWNER.law}.`,
    },
    {
      heading: 'Changes to these terms',
      body: 'We may update these terms; the current version is always on this page with its effective date.',
    },
    {
      heading: 'Contact',
      body: `Questions about these terms: ${email}.`,
    },
  ],
}
