import type { FaqItem } from './types'

// Factual answers only: each restates copy already on the site (no contract, SLA or integration promises).
export const faq: Record<'services' | 'salesBpo' | 'performanceMarketing' | 'customerOperations' | 'technology', FaqItem[]> = {
  services: [
    {
      question: 'What does Growlatics do?',
      answer:
        'Growlatics builds and operates the systems behind growth: Sales & BPO, performance marketing, customer operations and technology, run as one connected operation or one system at a time.',
    },
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
      question: 'Where is Growlatics based, and which markets do you serve?',
      answer:
        'Growlatics is a US / Pakistan business serving clients in the United States, the United Kingdom, Pakistan and other international markets.',
    },
    {
      question: 'How do you report?',
      answer: 'Against metrics agreed with you before launch, on a cadence set with you, covering the whole system rather than one channel.',
    },
    {
      question: 'What is a Growth Call?',
      answer:
        'A focused conversation about your pipeline, your teams and your tools. We map where leads, context or customers drop out between functions and suggest which system to start with.',
    },
  ],
  salesBpo: [
    {
      question: 'Is this a call center?',
      answer:
        'No. We run sales work as part of your revenue process — targets, scripts, qualification rules and CRM included — measured on quality and pipeline, not call volume.',
    },
    {
      question: 'Do you do cold outreach and appointment setting?',
      answer:
        "Yes. Cold outreach, outbound calling and list building generate pipeline; qualified leads are booked into your team's calendars as appointments.",
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
  performanceMarketing: [
    {
      question: 'Which ad platforms do you run?',
      answer: 'Google Ads, including shopping campaigns, and Meta.',
    },
    {
      question: 'Do you handle SEO, social media and YouTube as well as paid ads?',
      answer:
        'Yes. SEO and content, social media management and YouTube performance programs are part of Performance Marketing, alongside paid search and paid social.',
    },
    {
      question: 'Do you run ecommerce campaigns?',
      answer: 'Yes, including Google Ads shopping campaigns. Store builds sit with Technology & Development.',
    },
  ],
  customerOperations: [
    {
      question: 'Which support channels do you cover?',
      answer: 'Chat, phone and email, including inbound and outbound voice support for service, orders and follow-up.',
    },
    {
      question: 'Can you work in our help desk?',
      answer:
        "Yes, where you have one. If you don't, CX operations covers help-desk setup, macros, a knowledge base and service reporting.",
    },
    {
      question: 'Which hours and languages do you cover?',
      answer: 'Coverage hours and languages are agreed per engagement.',
    },
  ],
  technology: [
    {
      question: 'Do you build ecommerce stores?',
      answer: 'Yes. Ecommerce builds integrated with marketing, payments and support.',
    },
    {
      question: 'Do you build on WordPress?',
      answer: 'Where it fits. We also build web and mobile applications full-stack.',
    },
    {
      question: 'Do you maintain what you build?',
      answer: 'Yes. QA and testing before launch and ongoing maintenance of digital systems are part of Build.',
    },
  ],
}
