// Lead adapter (IA §6.4, GLASS_BRIEF §12 D). One entry point, submitLead(); the UI never knows which provider ran.
// A provider is (lead) => Promise<LeadResult>. Chosen at BUILD time by NEXT_PUBLIC_LEAD_PROVIDER:
//   mailto  (default) prefilled email to ahsan@growlatics.com (§6.3) → 'mailto'
//   webhook POST JSON to NEXT_PUBLIC_LEAD_WEBHOOK_URL (10s timeout) → 'sent' | 'error' (UI offers mailto fallback)
// Unset provider + webhook URL set → webhook (backwards compatible). Unknown or misconfigured → mailto.
// Booking (Calendly / Cal.com): NEXT_PUBLIC_BOOKING_URL, shown after a 'sent' result with name/email prefilled.
// CRM form / Zapier / Make / n8n: use webhook. HubSpot: add a provider here (see docs/v2/LAUNCH.md §4).
// No vendor SDK, no cookies, client-side only (static export).
import { leadForm, optionLabel, type LeadResult, type LeadSubmission } from '@/content/lead'

export type { LeadResult, LeadSubmission } from '@/content/lead'
export * from './validate'

export type LeadProvider = (lead: LeadSubmission) => Promise<LeadResult>

const webhookUrl = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL || ''
export const leadConfig = {
  provider: process.env.NEXT_PUBLIC_LEAD_PROVIDER || (webhookUrl ? 'webhook' : 'mailto'),
  webhookUrl,
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
  let msg = lead.message?.trim() ?? ''
  let body = leadEmailBody(lead)
  // msg shrinks every pass, so this ends even when the other fields alone exceed the limit.
  while (make(body).length > MAX_MAILTO && msg) {
    msg = msg.slice(0, -50).trimEnd()
    body = leadEmailBody(lead, msg + '…')
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

export const providers: Record<string, LeadProvider> = {
  mailto: async (lead) => ({ status: 'mailto', ...buildMailto(lead) }),
  webhook: (lead) => (leadConfig.webhookUrl ? postWebhook(leadConfig.webhookUrl, lead) : providers.mailto(lead)),
}

export async function submitLead(lead: LeadSubmission, opts: { forceMailto?: boolean } = {}): Promise<LeadResult> {
  const provider = (!opts.forceMailto && providers[leadConfig.provider]) || providers.mailto
  return provider(lead)
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
