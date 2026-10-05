// Lead adapter (IA §6.4). One entry point; the UI never knows which provider ran.
// Order: NEXT_PUBLIC_LEAD_WEBHOOK_URL set → POST JSON (10s timeout) → sent | error.
//        Not set → prefilled mailto (§6.3) → mailto.
// No vendor SDK, no cookies, client-side only (static export).
import { leadForm, optionLabel, type LeadResult, type LeadSubmission } from '@/content/lead'

export type { LeadResult, LeadSubmission } from '@/content/lead'
export * from './validate'

export const leadConfig = {
  webhookUrl: process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL || '',
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || '',
}

const MAX_MAILTO = 2000
const dash = (v?: string) => (v && v.trim() ? v.trim() : '—')

export function leadEmailBody(lead: LeadSubmission, notes = dash(lead.message)): string {
  const markets = lead.markets
    .map((m) => (m === 'other' ? `Other: ${dash(lead.marketOther)}` : optionLabel('markets', m)))
    .join(', ')
  return [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company}`,
    `Website: ${dash(lead.website)}`,
    `Phone: ${dash(lead.phone)}`,
    '',
    `Needs: ${lead.needs.map((n) => optionLabel('needs', n)).join(', ')}`,
    `Stage: ${optionLabel('stage', lead.stage)}`,
    `Markets: ${markets}`,
    `Start: ${optionLabel('start', lead.start)}`,
    '',
    'Notes:',
    notes,
    '',
    `Sent from ${leadForm.mailto.source}`,
  ].join('\n')
}

/** Prefilled mailto; Notes are truncated with "…" to keep the URL under 2,000 chars. */
export function buildMailto(lead: LeadSubmission): { href: string; body: string } {
  const subject = encodeURIComponent(leadForm.mailto.subject(lead.company))
  const make = (body: string) => `mailto:${leadForm.mailto.to}?subject=${subject}&body=${encodeURIComponent(body)}`
  let notes = dash(lead.message)
  let body = leadEmailBody(lead, notes)
  while (make(body).length > MAX_MAILTO && notes.length > 1) {
    notes = notes.slice(0, Math.max(1, notes.length - 50)).trimEnd() + '…'
    body = leadEmailBody(lead, notes)
  }
  return { href: make(body), body }
}

async function postWebhook(url: string, lead: LeadSubmission): Promise<LeadResult> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 10_000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...lead,
        submittedAt: new Date().toISOString(),
        source: typeof window !== 'undefined' ? window.location.pathname : '/contact/',
      }),
      signal: ctrl.signal,
    })
    return res.ok ? { status: 'sent' } : { status: 'error', message: `HTTP ${res.status}` }
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'network error' }
  } finally {
    clearTimeout(timer)
  }
}

export async function submitLead(lead: LeadSubmission, opts: { forceMailto?: boolean } = {}): Promise<LeadResult> {
  if (leadConfig.webhookUrl && !opts.forceMailto) return postWebhook(leadConfig.webhookUrl, lead)
  return { status: 'mailto', ...buildMailto(lead) }
}

/** Booking link for the success state, with name/email as query params. */
export function bookingHref(lead: Pick<LeadSubmission, 'name' | 'email'>): string {
  if (!leadConfig.bookingUrl) return ''
  try {
    const u = new URL(leadConfig.bookingUrl)
    u.searchParams.set('name', lead.name)
    u.searchParams.set('email', lead.email)
    return u.toString()
  } catch {
    return leadConfig.bookingUrl
  }
}
