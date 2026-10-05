import { getLabel } from '@/content'
// The single source of network data (DIRECTION §6.3). Every renderer draws these nodes.
// Ids are `<system>.<capability>` (PLAN shared contract), kebab-case from IA_AND_COPY §3.

export type SystemId = 'acquire' | 'sell' | 'operate' | 'build' | 'core' | 'market'
export type GNode = { id: string; system: SystemId; labelKey: string; weight: 1 | 2 | 3 }
export type EdgeKind = 'internal' | 'handoff' | 'core'
export type GEdge = { id: string; a: string; b: string; kind: EdgeKind; bow: number }

export const SYSTEMS = ['acquire', 'sell', 'operate', 'build'] as const

const n = (id: string, weight: 1 | 2 | 3 = 1): GNode => ({
  id,
  system: id.split('.')[0] as SystemId,
  labelKey: `capability.${id}`,
  weight,
})

export const NODES: GNode[] = [
  // Acquire (6)
  n('acquire.paid-search', 3),
  n('acquire.seo', 2),
  n('acquire.social'),
  n('acquire.youtube'),
  n('acquire.funnels', 2),
  n('acquire.lead-generation', 2),
  // Sell (7): the largest cluster, commercial priority
  n('sell.lead-qualification', 3),
  n('sell.inbound', 2),
  n('sell.outbound-calling', 2),
  n('sell.cold-outreach'),
  n('sell.appointment-setting', 2),
  n('sell.telesales'),
  n('sell.sales-operations', 2),
  // Operate (5)
  n('operate.team-operations', 3),
  n('operate.chat-email'),
  n('operate.call'),
  n('operate.retention', 2),
  n('operate.cx-operations'),
  // Build (6): the infrastructure layer, drawn on a lower plane
  n('build.automation', 3),
  n('build.websites', 2),
  n('build.ecommerce'),
  n('build.apps'),
  n('build.ui-ux'),
  n('build.maintenance', 2),
  // Core
  n('core.growlatics', 3),
  // Markets (act 7 only)
  n('market.us', 2),
  n('market.gb', 2),
  n('market.pk', 2),
]

const e = (a: string, b: string, kind: EdgeKind, bow = 0.04): GEdge => ({ id: `${a}~${b}`, a, b, kind, bow })

export const EDGES: GEdge[] = [
  // Acquire internal
  e('acquire.paid-search', 'acquire.funnels', 'internal', -0.06),
  e('acquire.seo', 'acquire.funnels', 'internal', 0.05),
  e('acquire.social', 'acquire.seo', 'internal', -0.04),
  e('acquire.youtube', 'acquire.social', 'internal', 0.05),
  e('acquire.funnels', 'acquire.lead-generation', 'internal', -0.03),
  e('acquire.paid-search', 'acquire.lead-generation', 'internal', 0.06),
  // Sell internal
  e('sell.inbound', 'sell.lead-qualification', 'internal', 0.04),
  e('sell.cold-outreach', 'sell.outbound-calling', 'internal', -0.05),
  e('sell.outbound-calling', 'sell.lead-qualification', 'internal', 0.03),
  e('sell.lead-qualification', 'sell.appointment-setting', 'internal', -0.04),
  e('sell.appointment-setting', 'sell.telesales', 'internal', 0.05),
  e('sell.telesales', 'sell.sales-operations', 'internal', -0.03),
  e('sell.sales-operations', 'sell.lead-qualification', 'internal', 0.06),
  // Operate internal
  e('operate.chat-email', 'operate.team-operations', 'internal', 0.05),
  e('operate.call', 'operate.team-operations', 'internal', -0.04),
  e('operate.team-operations', 'operate.retention', 'internal', 0.03),
  e('operate.cx-operations', 'operate.team-operations', 'internal', -0.05),
  // Build internal
  e('build.websites', 'build.ecommerce', 'internal', 0.03),
  e('build.ui-ux', 'build.apps', 'internal', -0.03),
  e('build.apps', 'build.automation', 'internal', 0.04),
  e('build.websites', 'build.automation', 'internal', -0.04),
  e('build.automation', 'build.maintenance', 'internal', 0.03),
  // Handoffs between systems (broken when fragmented, routed through core when connected)
  e('acquire.lead-generation', 'sell.inbound', 'handoff', 0.08),
  e('acquire.funnels', 'sell.lead-qualification', 'handoff', -0.06),
  e('sell.appointment-setting', 'operate.team-operations', 'handoff', 0.07),
  e('operate.retention', 'acquire.social', 'handoff', -0.1),
  e('build.websites', 'acquire.funnels', 'handoff', 0.05),
  e('build.automation', 'sell.sales-operations', 'handoff', -0.05),
  e('build.maintenance', 'operate.cx-operations', 'handoff', 0.06),
  // Core spokes
  e('core.growlatics', 'acquire.lead-generation', 'core', 0.04),
  e('core.growlatics', 'acquire.funnels', 'core', -0.05),
  e('core.growlatics', 'sell.lead-qualification', 'core', 0.03),
  e('core.growlatics', 'sell.appointment-setting', 'core', -0.04),
  e('core.growlatics', 'operate.team-operations', 'core', 0.05),
  e('core.growlatics', 'operate.retention', 'core', -0.03),
  e('core.growlatics', 'build.automation', 'core', 0.02),
  e('core.growlatics', 'build.maintenance', 'core', -0.04),
  // Markets (act 7)
  e('market.us', 'market.gb', 'internal', -0.18),
  e('market.gb', 'market.pk', 'internal', -0.18),
  e('market.us', 'market.pk', 'internal', 0.22),
]

export const NODE_INDEX: Record<string, number> = Object.fromEntries(NODES.map((x, i) => [x.id, i]))
export const EDGE_INDEX: Record<string, number> = Object.fromEntries(EDGES.map((x, i) => [x.id, i]))
export const EDGE_A = Int16Array.from(EDGES, (x) => NODE_INDEX[x.a])
export const EDGE_B = Int16Array.from(EDGES, (x) => NODE_INDEX[x.b])
export const CORE = NODE_INDEX['core.growlatics']

/** Adjacency: for node i, the edge indices that touch it. */
export const ADJ: number[][] = NODES.map(() => [])
EDGES.forEach((_, i) => {
  ADJ[EDGE_A[i]].push(i)
  ADJ[EDGE_B[i]].push(i)
})

// Words come from content/ (getLabel); every graph id is a content id.
export const labelFor = (node: GNode) => getLabel(node.system === 'core' ? 'core' : node.id)
