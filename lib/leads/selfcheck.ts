// Self-check for the lead adapter. Run: node -e "require('jiti')(process.cwd()+'/', {alias:{'@':process.cwd()}})('./lib/leads/selfcheck.ts')"
import assert from 'node:assert/strict'
import { buildMailto, leadEmailBody, normalizeUrl, submitLead, validateEmail, validatePhone, validateUrl } from './index'
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

assert.equal(validateEmail('a@b.co'), null)
assert.equal(validateEmail('nope'), 'email')
assert.equal(validateEmail(''), 'required')
assert.equal(validatePhone(''), null)
assert.equal(validatePhone('+1 (470) 755-6472'), null)
assert.equal(validatePhone('call me'), 'phone')
assert.equal(normalizeUrl('example.com'), 'https://example.com/')
assert.equal(validateUrl('not a url'), 'url')
assert.equal(validateUrl(''), null)

submitLead(lead).then((r) => {
  assert.equal(r.status, 'mailto') // no NEXT_PUBLIC_LEAD_WEBHOOK_URL set
  console.log('lib/leads selfcheck: ok')
})
