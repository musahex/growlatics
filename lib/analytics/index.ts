// Vendor-free event layer (docs/v2/CONVERSION_TRACKING_PLAN.md). track() pushes to window.dataLayer ONLY when a
// tag manager has already created it; otherwise it does nothing. No network, no cookies, no IDs, no PII in props.
// Events: contact_form_started, contact_step_completed, contact_email_intent, contact_phone_intent,
// booking_link_clicked, lead_submitted (webhook provider only, on a confirmed 2xx; never for a mailto open).

export type EventName =
  | 'contact_form_started'
  | 'contact_step_completed'
  | 'contact_email_intent'
  | 'contact_phone_intent'
  | 'booking_link_clicked'
  | 'lead_submitted'

type Props = Record<string, string | number | boolean | undefined>

export function track(event: EventName, props: Props = {}): void {
  if (typeof window === 'undefined') return
  const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer
  if (Array.isArray(dl)) dl.push({ event, page: window.location.pathname, ...props })
}

/** Link-click events for CTA buttons: /contact → booking_link_clicked, mailto: → email intent, tel: → phone intent. */
export function trackLink(href: string, location: string): void {
  if (href.startsWith('mailto:')) track('contact_email_intent', { method: 'link', location })
  else if (href.startsWith('tel:')) track('contact_phone_intent', { location })
  else if (href.includes('/contact')) {
    captureAttribution()
    track('booking_link_clicked', { target: 'contact_form', location })
  }
}

// ─── First-party attribution (sessionStorage only; first touch in the tab wins) ──────────────────────────────
// Captured once per tab by components/layout/Attribution (root layout), so UTMs survive client navigation; the
// /contact/ load and CTA-click calls stay as harmless fallbacks.

const KEY = 'gl_attribution'
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
export type Attribution = Partial<Record<(typeof PARAMS)[number] | 'landing_page' | 'referrer', string>>

export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(KEY)) return
    const q = new URLSearchParams(window.location.search)
    const a: Attribution = {}
    for (const p of PARAMS) {
      const v = q.get(p)?.trim().slice(0, 100)
      if (v) a[p] = v
    }
    if (!Object.keys(a).length) return
    a.landing_page = window.location.pathname // path only: never the query, which may carry other data
    if (document.referrer) {
      try {
        a.referrer = new URL(document.referrer).hostname // host only
      } catch {}
    }
    sessionStorage.setItem(KEY, JSON.stringify(a))
  } catch {
    // storage blocked: no attribution, the form still works
  }
}

export function getAttribution(): Attribution | undefined {
  try {
    const v = sessionStorage.getItem(KEY)
    return v ? (JSON.parse(v) as Attribution) : undefined
  } catch {
    return undefined
  }
}
