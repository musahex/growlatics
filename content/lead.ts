import type { ServiceSlug } from './types'
import { site } from './site'

// Book a Growth Call qualification flow (IA §6). Used by lib/leads/ and components/patterns/QualificationFlow.
export type NeedId = ServiceSlug | 'not-sure'
export type StageOfBusiness = 'early' | 'growing' | 'established' | 'enterprise'
export type MarketId = 'us' | 'uk' | 'pk' | 'other'
export type StartWindow = 'now' | 'quarter' | 'exploring'

export interface LeadSubmission {
  needs: NeedId[]
  stage: StageOfBusiness
  markets: MarketId[]
  marketOther?: string
  start: StartWindow
  name: string
  email: string
  company: string
  website?: string
  phone?: string
  message?: string
}

export type LeadResult =
  | { status: 'sent' }
  | { status: 'mailto'; href: string; body: string }
  | { status: 'error'; message: string }

type Option<V extends string> = { value: V; label: string }

export const leadForm = {
  steps: {
    needs: {
      question: 'What do you need help with?',
      helper: 'Choose all that apply.',
      options: [
        { value: 'sales-bpo', label: 'Sales & BPO' },
        { value: 'performance-marketing', label: 'Performance Marketing' },
        { value: 'customer-operations', label: 'Customer Operations' },
        { value: 'technology', label: 'Technology & Development' },
        { value: 'not-sure', label: 'Not sure yet — help me find the gap' },
      ] as Option<NeedId>[],
    },
    stage: {
      question: 'Where is your business today?',
      options: [
        { value: 'early', label: 'Early stage, finding traction' },
        { value: 'growing', label: 'Growing, with steady revenue' },
        { value: 'established', label: 'Established, adding capacity or markets' },
        { value: 'enterprise', label: 'Large or multi-location organization' },
      ] as Option<StageOfBusiness>[],
    },
    markets: {
      question: 'Which markets do you sell into?',
      helper: 'Choose all that apply.',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'pk', label: 'Pakistan' },
        { value: 'other', label: 'Other' },
      ] as Option<MarketId>[],
      otherLabel: 'Which other markets?',
    },
    start: {
      question: 'When do you want to start?',
      options: [
        { value: 'now', label: 'Within 30 days' },
        { value: 'quarter', label: 'In the next 3 months' },
        { value: 'exploring', label: 'Just exploring' },
      ] as Option<StartWindow>[],
    },
    contact: {
      question: 'How do we reach you?',
      fields: {
        name: 'Name',
        email: 'Work email',
        company: 'Company',
        website: 'Website',
        phone: 'Phone',
        message: 'Anything we should know?',
      },
      optional: 'Optional',
    },
  },
  nav: { next: 'Continue', back: 'Back', step: (n: number, total: number) => `Step ${n} of ${total}`, review: 'Your answers', edit: 'Edit' },
  submitLabel: 'Request my Growth Call',
  sendingLabel: 'Sending…',
  privacyNote: "We'll use these details only to respond to your request.",
  errors: {
    required: 'Please fill this in.',
    chooseOne: 'Please choose one.',
    chooseAny: 'Please choose at least one.',
    email: 'Please enter a valid email address.',
    url: 'Please enter a valid website, like example.com.',
    phone: 'Please enter a valid phone number.',
  },
  success: {
    heading: 'Thanks — your request is in.',
    // OWNER-VERIFY response time: god decision = fallback without a time.
    body: (email: string) => `We'll reply to ${email} with next steps.`,
    bookingPrompt: 'Want to lock in a time now?',
    bookingLabel: 'Pick a time',
  },
  mailto: {
    heading: 'One last step: send the email.',
    body: `We've opened an email with your answers filled in. Press send and we'll reply with next steps. If nothing opened, email us at ${site.contact.email} or call ${site.contact.phone}.`,
    copyLabel: 'Copy my answers',
    copiedLabel: 'Copied',
    to: site.contact.email,
    subject: (company: string) => `Growth Call request — ${company}`,
    source: 'growlatics.us/contact/',
  },
  failure: { body: 'Something went wrong sending your request.', fallbackLabel: 'Send by email instead' },
}

/** Label lookup for an option value of a step. */
export const optionLabel = (step: 'needs' | 'stage' | 'markets' | 'start', value: string) =>
  (leadForm.steps[step].options as Option<string>[]).find((o) => o.value === value)?.label ?? value
