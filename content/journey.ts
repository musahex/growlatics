import type { JourneyContent } from './types'

// The only source of the five journey stages (IA §4). Used identically everywhere.
export const journey: JourneyContent = {
  eyebrow: 'The growth journey',
  heading: 'From first click to long-term customer, every stage connected.',
  intro: 'Follow a lead through the system. Each stage hands the next one everything it needs.',
  closing: { label: 'See the four systems', href: '/services/' },
  stages: [
    {
      id: 'attract',
      number: '01',
      name: 'Attract',
      line: 'Bring in the right demand.',
      copy: 'Paid, search, social and video programs reach the buyers you actually want. Every campaign is tracked to what it sends downstream, not just to clicks.',
      systems: ['acquire'],
    },
    {
      id: 'qualify',
      number: '02',
      name: 'Qualify',
      line: 'Turn interest into real conversations.',
      copy: 'Leads are answered fast, checked against your criteria and routed with full context. Nothing waits in an inbox and nothing reaches sales without a reason to be there.',
      systems: ['acquire', 'sell'],
    },
    {
      id: 'close',
      number: '03',
      name: 'Close',
      line: 'Move qualified buyers to a decision.',
      copy: 'Trained sales teams run follow-up, booked meetings and telesales inside your process and your CRM. Pipeline stays visible, so you see what is moving and what is stuck.',
      systems: ['sell'],
    },
    {
      id: 'retain',
      number: '04',
      name: 'Retain',
      line: "Keep the customers you've won.",
      copy: 'Support and retention teams answer on chat, phone and email to your standards. What customers say flows back to sales and marketing instead of disappearing in a ticket queue.',
      systems: ['operate'],
    },
    {
      id: 'scale',
      number: '05',
      name: 'Scale',
      line: 'Grow without rebuilding.',
      copy: 'Technology and automation connect every stage, so more volume does not mean more manual work. The system grows as one, instead of as five separate vendors.',
      systems: ['build'],
    },
  ],
}
