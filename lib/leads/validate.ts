// Field rules for the qualification flow (IA §6.1). Return an error key or null.
export type FieldError = 'required' | 'email' | 'url' | 'phone' | null

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[0-9 +()-]{7,20}$/

export const validateText = (v: string, min: number, max: number): FieldError => {
  const t = v.trim()
  return t.length < min || t.length > max ? 'required' : null
}
export const validateEmail = (v: string): FieldError => (!v.trim() ? 'required' : EMAIL.test(v.trim()) ? null : 'email')
export const validatePhone = (v: string): FieldError => (!v.trim() || PHONE.test(v.trim()) ? null : 'phone')

/** Accepts "example.com"; returns the normalised https URL, or null when invalid. */
export function normalizeUrl(v: string): string | null {
  const t = v.trim()
  if (!t) return ''
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`)
    return u.hostname.includes('.') ? u.toString() : null
  } catch {
    return null
  }
}
export const validateUrl = (v: string): FieldError => (normalizeUrl(v) === null ? 'url' : null)
