// Self-check for the lead adapter. Run: node -e "require('jiti')(process.cwd()+'/', {alias:{'@':process.cwd()}})('./lib/leads/selfcheck.ts')"
import assert from 'node:assert/strict'
import { buildMailto, leadConfig, leadEmailBody, normalizeUrl, providers, submitLead, validateEmail, validatePhone, validateUrl } from './index'
import type { LeadSubmission } from './index'

const lead: LeadSubmission = {
  needs: ['sales-bpo', 'not-sure'],
  stage: 'growing',
  markets: ['us', 'other'],
  marketOther: 'UAE',
  start: 'now',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Acme & Co',
}

const body = leadEmailBody(lead)
assert.match(body, /^Name: Ada Lovelace\nEmail: ada@example.com\nCompany: Acme & Co\nWebsite: —\nPhone: —\n\nNeeds: Sales & BPO, Not sure yet/)
assert.match(body, /Markets: United States, Other: UAE\nStart: Within 30 days\n\nNotes:\n—\n\nSent from growlatics.us\/contact\/$/)

const m = buildMailto(lead)
assert.ok(m.href.startsWith('mailto:ahsan@growlatics.com?subject=Growth%20Call%20request%20%E2%80%94%20Acme%20%26%20Co&body='))

const long = buildMailto({ ...lead, message: 'ü'.repeat(1000) })
assert.ok(long.href.length <= 2000, `mailto too long: ${long.href.length}`)
assert.ok(long.body.includes('…'))

// Fields other than Notes already over the limit: must return, not loop forever.
const huge = buildMailto({ ...lead, website: 'https://example.com/' + 'a'.repeat(2100), message: 'hello there' })
assert.ok(huge.body.includes('Notes:\n…'))

assert.equal(validateEmail('a@b.co'), null)
assert.equal(validateEmail('nope'), 'email')
assert.equal(validateEmail(''), 'required')
assert.equal(validatePhone(''), null)
assert.equal(validatePhone('+1 (470) 755-6472'), null)
assert.equal(validatePhone('call me'), 'phone')
assert.equal(normalizeUrl('example.com'), 'https://example.com/')
assert.equal(validateUrl('not a url'), 'url')
assert.equal(validateUrl(''), null)

assert.equal(leadConfig.provider, 'mailto') // no NEXT_PUBLIC_LEAD_PROVIDER / _WEBHOOK_URL set
assert.ok(providers.mailto && providers.webhook)

;(async () => {
  assert.equal((await submitLead(lead)).status, 'mailto')
  assert.equal((await providers.webhook(lead)).status, 'mailto') // webhook without a URL falls back, never throws
  leadConfig.provider = 'nope'
  assert.equal((await submitLead(lead)).status, 'mailto') // unknown provider → mailto
  leadConfig.provider = 'mailto'

  // Events: lead_submitted only on a confirmed webhook 2xx; never on a mailto open; no dataLayer → no-op.
  await submitLead(lead) // no window/dataLayer: must not throw
  const g = globalThis as unknown as { window: unknown; fetch: unknown }
  const dataLayer: { event: string }[] = []
  g.window = { dataLayer, location: { pathname: '/contact/' } }
  const realFetch = g.fetch
  const events = () => dataLayer.map((e) => e.event)
  await submitLead(lead)
  assert.deepEqual(events(), [], 'mailto must not emit lead_submitted')
  Object.assign(leadConfig, { provider: 'webhook', webhookUrl: 'https://hook.test/x' })
  g.fetch = async () => ({ ok: false, status: 500 })
  assert.equal((await submitLead(lead)).status, 'error')
  assert.deepEqual(events(), [], 'HTTP 500 must not emit lead_submitted')
  g.fetch = async () => ({ ok: true, status: 200 })
  assert.equal((await submitLead(lead)).status, 'sent')
  assert.deepEqual(events(), ['lead_submitted'])
  await submitLead(lead, { forceMailto: true })
  assert.deepEqual(events(), ['lead_submitted'], 'forced mailto fallback must not emit lead_submitted')
  Object.assign(leadConfig, { provider: 'mailto', webhookUrl: '' })
  g.fetch = realFetch
  console.log('lib/leads selfcheck: ok')
})()
