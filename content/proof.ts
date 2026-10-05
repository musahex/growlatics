import type { SystemId } from './types'

// Ships EMPTY. Proof components render null while their arrays are empty.
// approvedBy / approvedOn are required: no item without a recorded owner approval (IA §8).
export interface VerifiedMetric { value: string; label: string; source: string; approvedBy: string; approvedOn: string }
export interface CaseStudy { id: string; client: string; systems: SystemId[]; summary: string; metrics: VerifiedMetric[]; approvedBy: string; approvedOn: string }
export interface Testimonial { id: string; quote: string; name: string; role: string; company: string; approvedBy: string; approvedOn: string }
export interface ClientLogo { id: string; name: string; src: string; approvedBy: string; approvedOn: string }
export interface ProofContent { caseStudies: CaseStudy[]; testimonials: Testimonial[]; logos: ClientLogo[]; metrics: VerifiedMetric[] }

export const proof: ProofContent = { caseStudies: [], testimonials: [], logos: [], metrics: [] }
