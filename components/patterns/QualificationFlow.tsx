'use client'

import { useEffect, useRef, useState } from 'react'
import { leadForm as f, optionLabel, type LeadResult, type LeadSubmission, type MarketId, type NeedId, type StageOfBusiness, type StartWindow } from '@/content'
import { bookingHref, normalizeUrl, submitLead, validateEmail, validatePhone, validateText, validateUrl } from '@/lib/leads'
import Mark from '@/components/brand/Mark'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// P8 Qualification flow (IA §6): five steps, one question each, Mark progress, answers in state only.

const STEPS = ['needs', 'stage', 'markets', 'start', 'contact'] as const
type StepKey = (typeof STEPS)[number]
type ErrorKey = keyof typeof f.errors

interface Data {
  needs: NeedId[]
  stage: StageOfBusiness | ''
  markets: MarketId[]
  marketOther: string
  start: StartWindow | ''
  name: string
  email: string
  company: string
  website: string
  phone: string
  message: string
  company_website: string // honeypot
}

const EMPTY: Data = { needs: [], stage: '', markets: [], marketOther: '', start: '', name: '', email: '', company: '', website: '', phone: '', message: '', company_website: '' }
const NEEDS = f.steps.needs.options.map((o) => o.value)

type Errors = Partial<Record<keyof Data, ErrorKey>>

function fieldError(key: keyof Data, d: Data): ErrorKey | undefined {
  switch (key) {
    case 'needs':
      return d.needs.length ? undefined : 'chooseAny'
    case 'stage':
      return d.stage ? undefined : 'chooseOne'
    case 'markets':
      return d.markets.length ? undefined : 'chooseAny'
    case 'marketOther':
      return d.markets.includes('other') && validateText(d.marketOther, 1, 80) ? 'required' : undefined
    case 'start':
      return d.start ? undefined : 'chooseOne'
    case 'name':
      return validateText(d.name, 2, 80) ?? undefined
    case 'email':
      return validateEmail(d.email) ?? undefined
    case 'company':
      return validateText(d.company, 2, 100) ?? undefined
    case 'website':
      return validateUrl(d.website) ?? undefined
    case 'phone':
      return validatePhone(d.phone) ?? undefined
    case 'message':
      return d.message.length > 1000 ? 'required' : undefined
    default:
      return undefined
  }
}

const STEP_FIELDS: Record<StepKey, (keyof Data)[]> = {
  needs: ['needs'],
  stage: ['stage'],
  markets: ['markets', 'marketOther'],
  start: ['start'],
  contact: ['name', 'email', 'company', 'website', 'phone', 'message'],
}

function validateStep(step: StepKey, d: Data): Errors {
  const out: Errors = {}
  for (const k of STEP_FIELDS[step]) {
    const e = fieldError(k, d)
    if (e) out[k] = e
  }
  return out
}

function toLead(d: Data): LeadSubmission {
  const opt = (v: string) => (v.trim() ? v.trim() : undefined)
  return {
    needs: d.needs,
    stage: d.stage as StageOfBusiness,
    markets: d.markets,
    marketOther: d.markets.includes('other') ? opt(d.marketOther) : undefined,
    start: d.start as StartWindow,
    name: d.name.trim(),
    email: d.email.trim(),
    company: d.company.trim(),
    website: opt(normalizeUrl(d.website) ?? ''),
    phone: opt(d.phone),
    message: opt(d.message),
  }
}

// ─── Small field components ──────────────────────────────────────────────────

function ErrorText({ id, error }: { id: string; error?: ErrorKey }) {
  if (!error) return null
  return (
    <p id={id} className="mt-2 text-body-s text-signal-ink">
      {f.errors[error]}
    </p>
  )
}

function Choice({ type, name, value, label, checked, onChange, invalid }: { type: 'checkbox' | 'radio'; name: string; value: string; label: string; checked: boolean; onChange: () => void; invalid?: boolean }) {
  return (
    <label
      className={cn(
        'flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-body-s transition-colors duration-fast ease-out',
        'has-[:focus-visible]:shadow-focus',
        checked ? 'border-signal-line bg-signal-soft text-text' : 'border-line-2 bg-elevated text-text-2 hover:border-line-3',
      )}
    >
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} aria-invalid={invalid || undefined} className="sr-only" />
      <span aria-hidden className={cn('flex size-4 shrink-0 items-center justify-center border', type === 'radio' ? 'rounded-full' : 'rounded-xs', checked ? 'border-signal bg-signal' : 'border-line-3')}>
        {checked && <span className={cn('bg-on-signal', type === 'radio' ? 'size-1.5 rounded-full' : 'size-2 rounded-xs')} />}
      </span>
      {label}
    </label>
  )
}

function TextField({ name, label, value, onChange, onBlur, error, required, type = 'text', multiline, autoComplete, maxLength }: { name: keyof Data; label: string; value: string; onChange: (v: string) => void; onBlur: () => void; error?: ErrorKey; required?: boolean; type?: string; multiline?: boolean; autoComplete?: string; maxLength?: number }) {
  const id = `lead-${name}`
  const errId = `${id}-error`
  const cls = cn(
    'cursor-native mt-2 w-full rounded-sm border bg-inset px-3 py-3 text-body text-text placeholder:text-text-3 transition-colors duration-fast ease-out',
    error ? 'border-signal' : 'border-line-2 hover:border-line-3',
  )
  const common = {
    id,
    name,
    value,
    onBlur,
    required,
    maxLength,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errId : undefined,
  }
  return (
    <div>
      <label htmlFor={id} className="text-body-s font-medium text-text">
        {label}
        {!required && <span className="ml-2 font-normal text-text-3">{f.steps.contact.optional}</span>}
      </label>
      {multiline ? (
        <textarea {...common} rows={4} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input {...common} type={type} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      <ErrorText id={errId} error={error} />
    </div>
  )
}

// ─── Flow ────────────────────────────────────────────────────────────────────

export default function QualificationFlow({ id = 'book' }: { id?: string }) {
  const [step, setStep] = useState(0)
  const [d, setD] = useState<Data>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<LeadResult | null>(null)
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLElement>(null)
  const moved = useRef(false)

  // Pre-select a need from ?system=<service-slug> (service-page CTAs).
  useEffect(() => {
    const sys = new URLSearchParams(window.location.search).get('system') as NeedId | null
    if (sys && NEEDS.includes(sys)) setD((p) => (p.needs.length ? p : { ...p, needs: [sys] }))
  }, [])

  // Move focus to the step heading after a step change or a result (not on first render).
  useEffect(() => {
    if (!moved.current) return
    headRef.current?.focus()
  }, [step, result])

  const key = STEPS[step]
  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setD((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }
  const toggle = <K extends 'needs' | 'markets'>(k: K, v: Data[K][number]) => {
    const list = d[k] as string[]
    set(k, (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]) as Data[K])
  }
  const blur = (k: keyof Data) => () => setErrors((e) => ({ ...e, [k]: fieldError(k, d) }))

  const focusFirstError = (errs: Errors) => {
    const first = STEP_FIELDS[key].find((k) => errs[k])
    if (!first) return
    requestAnimationFrame(() => {
      const el = rootRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)
      el?.focus()
    })
  }

  const check = () => {
    const errs = validateStep(key, d)
    setErrors(errs)
    if (Object.keys(errs).length) {
      focusFirstError(errs)
      return false
    }
    return true
  }

  const next = () => {
    if (!check()) return
    moved.current = true
    setStep((s) => s + 1)
  }
  const back = () => {
    moved.current = true
    setErrors({})
    setStep((s) => Math.max(0, s - 1))
  }

  const send = async (forceMailto = false) => {
    if (!forceMailto && !check()) return
    moved.current = true
    // Honeypot filled: show success silently, send nothing.
    if (d.company_website) return setResult({ status: 'sent' })
    setSending(true)
    const r = await submitLead(toLead(d), { forceMailto })
    setSending(false)
    setResult(r)
    if (r.status === 'mailto') window.location.href = r.href
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const headingCls = 'text-title text-text focus:outline-none'

  // ── Result states ──
  if (result) {
    const lead = toLead(d)
    const booking = result.status === 'sent' ? bookingHref(lead) : ''
    return (
      <div id={id} ref={rootRef} aria-live="polite" className="scroll-mt-24 rounded-lg border border-line-2 bg-elevated p-6 shadow-2 sm:p-10">
        <Mark size={28} state="progress" value={5} />
        {result.status === 'sent' && (
          <>
            <h2 ref={headRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} className={cn(headingCls, 'mt-6')}>
              {f.success.heading}
            </h2>
            <p className="mt-3 text-body text-text-2">{f.success.body(lead.email || '')}</p>
            {booking && (
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-body text-text">{f.success.bookingPrompt}</p>
                <Button href={booking} className="mt-4" target="_blank" rel="noopener noreferrer" arrow>
                  {f.success.bookingLabel}
                </Button>
              </div>
            )}
          </>
        )}
        {result.status === 'mailto' && (
          <>
            <h2 ref={headRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} className={cn(headingCls, 'mt-6')}>
              {f.mailto.heading}
            </h2>
            <p className="mt-3 text-body text-text-2">{f.mailto.body}</p>
            <Button variant="secondary" className="mt-6" onClick={() => copy(result.body)}>
              {copied ? f.mailto.copiedLabel : f.mailto.copyLabel}
            </Button>
          </>
        )}
        {result.status === 'error' && (
          <>
            <h2 ref={headRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} className={cn(headingCls, 'mt-6')}>
              {f.failure.body}
            </h2>
            <Button className="mt-6" onClick={() => send(true)}>
              {f.failure.fallbackLabel}
            </Button>
          </>
        )}
      </div>
    )
  }

  // ── Steps ──
  const legend = (q: string, helper?: string) => (
    <>
      <legend className="w-full">
        <span ref={headRef as React.RefObject<HTMLSpanElement>} tabIndex={-1} className={cn(headingCls, 'block')}>
          {q}
        </span>
      </legend>
      {helper && <p className="mt-2 text-body-s text-text-3">{helper}</p>}
    </>
  )

  const choiceStep = (k: 'needs' | 'stage' | 'markets' | 'start') => {
    const s = f.steps[k]
    const multi = k === 'needs' || k === 'markets'
    const errId = `lead-${k}-error`
    return (
      <fieldset aria-describedby={errors[k] ? errId : undefined}>
        {legend(s.question, 'helper' in s ? s.helper : undefined)}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {s.options.map((o) => (
            <Choice
              key={o.value}
              type={multi ? 'checkbox' : 'radio'}
              name={k}
              value={o.value}
              label={o.label}
              checked={multi ? (d[k] as string[]).includes(o.value) : d[k] === o.value}
              onChange={() => (multi ? toggle(k as 'needs' | 'markets', o.value as never) : set(k, o.value as never))}
              invalid={!!errors[k]}
            />
          ))}
        </div>
        <ErrorText id={errId} error={errors[k]} />
        {k === 'markets' && d.markets.includes('other') && (
          <div className="mt-6 max-w-md">
            <TextField name="marketOther" label={f.steps.markets.otherLabel} value={d.marketOther} onChange={(v) => set('marketOther', v)} onBlur={blur('marketOther')} error={errors.marketOther} required maxLength={80} />
          </div>
        )}
      </fieldset>
    )
  }

  const c = f.steps.contact.fields
  const review: [string, string][] = [
    [f.steps.needs.question, d.needs.map((n) => optionLabel('needs', n)).join(', ')],
    [f.steps.stage.question, d.stage ? optionLabel('stage', d.stage) : ''],
    [f.steps.markets.question, d.markets.map((m) => (m === 'other' ? d.marketOther || optionLabel('markets', m) : optionLabel('markets', m))).join(', ')],
    [f.steps.start.question, d.start ? optionLabel('start', d.start) : ''],
  ]

  return (
    <div id={id} ref={rootRef} className="scroll-mt-24 rounded-lg border border-line-2 bg-elevated p-6 shadow-2 sm:p-10">
      <div className="mb-8 flex items-center gap-4">
        <Mark size={28} state="progress" value={step + 1} />
        <p className="font-mono text-data text-text-3" aria-live="polite">
          {f.nav.step(step + 1, STEPS.length)}
        </p>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (key === 'contact') send()
          else next()
        }}
      >
        {key !== 'contact' && choiceStep(key)}

        {key === 'contact' && (
          <fieldset>
            {legend(f.steps.contact.question)}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <TextField name="name" label={c.name} value={d.name} onChange={(v) => set('name', v)} onBlur={blur('name')} error={errors.name} required autoComplete="name" maxLength={80} />
              <TextField name="email" type="email" label={c.email} value={d.email} onChange={(v) => set('email', v)} onBlur={blur('email')} error={errors.email} required autoComplete="email" maxLength={254} />
              <TextField name="company" label={c.company} value={d.company} onChange={(v) => set('company', v)} onBlur={blur('company')} error={errors.company} required autoComplete="organization" maxLength={100} />
              <TextField name="website" type="url" label={c.website} value={d.website} onChange={(v) => set('website', v)} onBlur={blur('website')} error={errors.website} autoComplete="url" maxLength={200} />
              <TextField name="phone" type="tel" label={c.phone} value={d.phone} onChange={(v) => set('phone', v)} onBlur={blur('phone')} error={errors.phone} autoComplete="tel" maxLength={20} />
              <div className="sm:col-span-2">
                <TextField name="message" label={c.message} value={d.message} onChange={(v) => set('message', v)} onBlur={blur('message')} error={errors.message} multiline maxLength={1000} />
              </div>
            </div>
            {/* Honeypot: hidden from people and assistive tech */}
            <div aria-hidden className="sr-only">
              <label>
                company_website
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={d.company_website} onChange={(e) => set('company_website', e.target.value)} />
              </label>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <p className="font-mono text-data uppercase text-text-3">{f.nav.review}</p>
              <dl className="mt-3 grid gap-2">
                {review.map(([q, a], i) => (
                  <div key={q} className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-4">
                    <dt className="text-body-s text-text-3">{q}</dt>
                    <dd className="text-body-s text-text">{a}</dd>
                    <dd>
                      <button
                        type="button"
                        onClick={() => {
                          moved.current = true
                          setStep(i)
                        }}
                        className="min-h-11 text-body-s text-signal-ink hover:text-text sm:min-h-0"
                      >
                        {f.nav.edit}<span className="sr-only">: {q}</span>
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </fieldset>
        )}

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button variant="secondary" onClick={back}>
              {f.nav.back}
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={sending} arrow={key !== 'contact'}>
            {key === 'contact' ? (sending ? f.sendingLabel : f.submitLabel) : f.nav.next}
          </Button>
        </div>
        {key === 'contact' && <p className="mt-4 text-body-s text-text-3">{f.privacyNote}</p>}
      </form>
    </div>
  )
}
