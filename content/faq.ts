import type { FaqItem } from './types'

export const faq: { services: FaqItem[]; salesBpo: FaqItem[] } = {
  services: [
    {
      question: 'Can we start with one system?',
      answer:
        'Yes. Start where the pressure is highest — often sales capacity or lead flow — and connect other systems once the first is running.',
    },
    {
      question: 'Do you work in our tools?',
      answer:
        "Yes, where you have them. Sales and support work can run inside your CRM and help desk so your data stays yours. If you don't have the right tools yet, Build can set them up.",
    },
    {
      question: 'Which markets do you work with?',
      answer: 'We serve clients in the United States, the United Kingdom, Pakistan and other international markets.',
    },
    {
      question: 'How do you report?',
      answer: 'Against metrics agreed with you before launch, on a cadence set with you, covering the whole system rather than one channel.',
    },
  ],
  salesBpo: [
    {
      question: 'Is this a call center?',
      answer:
        'No. We run sales work as part of your revenue process — targets, scripts, qualification rules and CRM included — measured on quality and pipeline, not call volume.',
    },
    {
      // OWNER-VERIFY: data ownership is a contract term (docs/v2/OWNER_VERIFY.md)
      question: 'Who owns the leads and data?',
      answer: 'You do. Where you have the systems, we work in yours.',
      verify: true,
    },
    {
      question: 'Can you sell into the US and UK?',
      answer:
        'We serve clients selling in the United States, the United Kingdom, Pakistan and other international markets. Coverage hours and languages are agreed per engagement.',
    },
    {
      question: 'How quickly can a team start?',
      answer: "It depends on scope and hiring needs; we'll give you a timeline on the Growth Call.",
    },
  ],
}
