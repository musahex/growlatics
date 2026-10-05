import type { FaqItem } from './types'

export const faq: { services: FaqItem[]; salesBpo: FaqItem[] } = {
  services: [
    {
      question: 'Can we start with one system?',
      answer:
        'Yes. Most clients start where the pressure is highest — often sales capacity or lead flow — and connect other systems once the first is running.',
    },
    {
      // OWNER-VERIFY: work in client tools by default
      question: 'Do your teams use our tools?',
      answer:
        "Yes, by default. Sales and support work inside your CRM and help desk so your data stays yours. If you don't have the right tools yet, Build can set them up.",
      verify: true,
    },
    {
      question: 'Which markets do you work with?',
      answer: 'We serve clients in the United States, the United Kingdom, Pakistan and other international markets.',
    },
    {
      // OWNER-VERIFY: metrics agreed before launch
      question: 'How do you report?',
      answer: 'Against metrics agreed before launch, on a regular cadence set with you, covering the whole system rather than one channel.',
      verify: true,
    },
  ],
  salesBpo: [
    {
      // OWNER-VERIFY: managers accountable for quality
      question: 'Is this a call center?',
      answer:
        'No. We run sales work as part of your revenue process — targets, scripts, qualification rules and CRM included — with managers accountable for quality and pipeline, not just call volume.',
      verify: true,
    },
    {
      // OWNER-VERIFY: work in client systems by default
      question: 'Who owns the leads and data?',
      answer: 'You do. We work in your systems by default.',
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
