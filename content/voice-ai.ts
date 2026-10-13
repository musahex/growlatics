import type { Cta, Hero, Seo } from './types'
import { site } from './site'

// Voice AI Testing & QA (owner-supplied page, 2026-10-12). A standalone service page outside the four-system
// model: no SystemId, no schematic, its own content here. Copy is the owner's, spelling normalized to US English.
// OWNER-VERIFY: "2,000+" concurrent calls confirmed by the owner 2026-10-12 (docs/v2/OWNER_VERIFY.md).

const mailto = (subject: string) => `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}`

export const voiceAiTesting: {
  route: '/services/voice-ai-testing/'
  slug: 'voice-ai-testing'
  name: string
  seo: Seo
  hero: Hero
  /** Accessible name of the hero network figure. */
  stageTitle: string
  /** P6 handoff strip under the hero: what we test → the test environment → what comes out. */
  handoff: { upstream: { label: string; sub: string }[]; current: { label: string; sub: string }; downstream: { label: string; sub: string }[] }
  proof: string[]
  console: {
    title: string
    status: string
    cards: { label: string; value: string; sub: string }[]
    live: { label: string; left: string; right: string }
  }
  strip: { title: string; body: string }[]
  problem: { eyebrow: string; heading: string; body: string; body2: string; risks: string[] }
  scale: { eyebrow: string; heading: string; body: string; levels: { level: string; title: string; body: string }[] }
  services: { id: string; eyebrow: string; heading: string; body: string; items: { title: string; body: string; tags: string[] }[] }
  deployment: { eyebrow: string; heading: string; body: string; body2: string; flow: { label: string; tag: string }[] }
  datasets: { eyebrow: string; heading: string; body: string; body2: string; tags: string[] }
  qa: { eyebrow: string; heading: string; body: string; items: { index: string; title: string; body: string; tags: string[] }[] }
  method: { eyebrow: string; heading: string; steps: { title: string; body: string }[] }
  outputs: { eyebrow: string; heading: string; body: string; items: { title: string; body: string }[] }
  industries: { eyebrow: string; heading: string; body: string; items: string[] }
  why: { eyebrow: string; heading: string; body: string; items: { index: string; title: string; body: string }[] }
  finalCta: { eyebrow: string; heading: string; body: string; primary: Cta; secondary: Cta }
} = {
  route: '/services/voice-ai-testing/',
  slug: 'voice-ai-testing',
  name: 'Voice AI Testing & QA',
  seo: {
    title: 'Enterprise Voice AI Testing & QA Services | Growlatics',
    description:
      'Growlatics provides enterprise Voice AI testing, high-volume call simulation, custom datasets, human QA and production-readiness validation for AI voice agents and contact center automation.',
    ogTitle: 'Enterprise Voice AI Testing & QA Services',
  },
  hero: {
    eyebrow: 'Enterprise Voice AI Testing',
    heading: 'Test Voice AI at Scale Before Your Customers Do',
    lead: 'Growlatics provides high-volume testing, conversation simulation, datasets and independent quality assurance for organizations building and deploying Voice AI.',
    lead2:
      'From thousands of concurrent calls to human-reviewed conversations, we help teams discover failures, validate configurations and determine whether Voice AI systems are ready for production.',
    primary: { label: 'Book a Voice AI Testing Consultation', href: '/contact/?system=voice-ai-testing#book' },
    secondary: { label: 'Discuss a Testing Project', href: mailto('Discuss a Voice AI Testing Project') },
  },
  stageTitle: 'Voice AI testing in the Growlatics network: the four systems at rest around the core while a test run flows',
  handoff: {
    upstream: [
      { label: 'Your Voice AI', sub: 'STT + LLM + TTS' },
      { label: 'Your systems', sub: 'Telephony, CRM, APIs' },
    ],
    current: { label: 'Growlatics', sub: 'Voice AI test environment' },
    downstream: [
      { label: 'Evidence', sub: 'Transcripts, metrics, findings' },
      { label: 'Release', sub: 'Production readiness' },
    ],
  },
  proof: ['High-Volume Call Testing', 'Custom Test Datasets', 'Human + Automated QA', 'Production Readiness'],
  console: {
    title: 'Enterprise Voice AI Test Run',
    status: 'Testing active',
    cards: [
      { label: 'Concurrent calls', value: '2,000+', sub: 'Load & scenario simulation' },
      { label: 'Test methods', value: 'Multi-Method', sub: 'Bots + transcripts + listeners' },
    ],
    live: { label: 'Live conversation simulation', left: 'Voice AI → Test environment', right: 'Human QA included' },
  },
  strip: [
    { title: 'High-Volume Testing', body: 'Concurrent voice interactions at scale' },
    { title: 'Scenario Engineering', body: 'Realistic customer journeys and edge cases' },
    { title: 'Human Quality Review', body: 'Listener assessment and conversation analysis' },
    { title: 'Release Validation', body: 'Evidence before production deployment' },
  ],
  problem: {
    eyebrow: 'The Real Risk',
    heading: "The Biggest Risk Isn't Building Voice AI. It's Deploying It Without Testing at Scale.",
    body: 'A Voice AI system may perform well in development and still fail once thousands of real conversations, network conditions, integrations and unpredictable customers are introduced.',
    body2: 'Growlatics helps expose those weaknesses in controlled testing environments before they affect customers, operations or your brand.',
    risks: [
      'Voice-pipeline degradation under load',
      'Speech recognition and name capture failures',
      'TTS quality and unnatural voice behavior',
      'Latency and time-to-first-audio problems',
      'Interruptions and customer talk-over',
      'Hallucinations and incorrect responses',
      'CRM, API and workflow failures',
      'Escalation and compliance issues',
    ],
  },
  scale: {
    eyebrow: 'Testing at Scale',
    heading: "A Few Test Calls Aren't Enough",
    body: 'Voice AI should be evaluated at the scale, complexity and operating conditions it is expected to experience in production.',
    levels: [
      { level: '10 Calls', title: 'Functional Validation', body: 'Confirm basic call flow, response and integration behavior.' },
      { level: '100 Calls', title: 'Scenario Testing', body: 'Test customer journeys, variations and expected exceptions.' },
      { level: '1,000+ Calls', title: 'Reliability Testing', body: 'Identify failures that emerge across volume, repetition and edge cases.' },
      { level: 'Enterprise Scale', title: 'Production Validation', body: 'Evaluate concurrent calls, infrastructure and operational readiness under realistic conditions.' },
    ],
  },
  services: {
    id: 'services',
    eyebrow: 'Core Services',
    heading: 'Enterprise Voice AI Testing & Quality Assurance',
    body: 'Growlatics provides the testing infrastructure, scenarios, datasets, quality review and performance evidence organizations need to evaluate Voice AI before deployment.',
    items: [
      {
        title: 'High-Volume Voice AI Load Testing',
        body: 'Test how Voice AI systems behave when subjected to large numbers of simultaneous or repeated conversations.',
        tags: ['Concurrent call testing', 'Peak-volume simulations', 'Call-spike testing', 'Latency monitoring', 'Pipeline stability', 'Infrastructure failure detection'],
      },
      {
        title: 'Contact Center Deployment Testing',
        body: 'Validate customer Voice AI technology in controlled contact-center and customer-service environments.',
        tags: ['Inbound calling', 'Outbound calling', 'AI receptionist workflows', 'Call routing', 'Human escalation', 'CRM and API workflows'],
      },
      {
        title: 'Voice AI Test Datasets',
        body: 'Build structured datasets and scenario libraries that enable repeatable, measurable evaluation.',
        tags: ['Customer intents', 'Names and terminology', 'Speech variations', 'Edge cases', 'Failure paths', 'Industry-specific scenarios'],
      },
      {
        title: 'Multi-Method Voice AI QA',
        body: 'Combine automated testing with transcript analysis, recordings and human listening.',
        tags: ['Automated test callers', 'Bot simulations', 'Transcript review', 'Audio recordings', 'Human listener assessment', 'Quality scoring'],
      },
      {
        title: 'Model & Configuration Evaluation',
        body: 'Compare different models, prompts and technical configurations using repeatable test scenarios.',
        tags: ['STT models', 'LLM configurations', 'TTS voices', 'System prompts', 'Context management', 'Escalation logic'],
      },
      {
        title: 'Production Readiness Validation',
        body: 'Provide structured evidence to help teams decide whether a Voice AI configuration is ready for release.',
        tags: ['Test plans', 'Failure analysis', 'Performance metrics', 'Risk reporting', 'Re-testing', 'Release readiness assessment'],
      },
    ],
  },
  deployment: {
    eyebrow: 'Real Operating Environments',
    heading: 'Test Your Technology Inside Realistic Contact Center Workflows',
    body: 'Growlatics helps AI companies and enterprises move beyond isolated demonstrations by validating Voice AI within operational customer-contact environments.',
    body2: 'This allows teams to test how Voice AI interacts with telephony, workflows, customer data, integrations and human agents before broader rollout.',
    flow: [
      { label: 'Customer / Test Caller', tag: 'Voice input' },
      { label: 'Voice AI Agent', tag: 'STT + LLM + TTS' },
      { label: 'Business Systems', tag: 'CRM / API / Tools' },
      { label: 'Human Agent Escalation', tag: 'Contact center' },
      { label: 'QA & Performance Review', tag: 'Growlatics' },
    ],
  },
  datasets: {
    eyebrow: 'Evaluation Data',
    heading: 'Custom Voice AI Test Datasets',
    body: 'Internal teams often test against predictable prompts. Real customers do not behave predictably.',
    body2: 'Growlatics designs test datasets and conversation scenarios that expose Voice AI systems to realistic variations, exceptions and failure conditions.',
    tags: [
      'Customer Intents',
      'Names',
      'Uncommon Names',
      'Accents',
      'Speech Variations',
      'Interruptions',
      'Talk-Over',
      'Missing Information',
      'Background Noise',
      'Objections',
      'Escalation Requests',
      'Edge Cases',
      'Failure Paths',
      'Industry Terminology',
      'Compliance Scenarios',
      'Confirmation Flows',
      'Playback Scenarios',
      'Unexpected Responses',
    ],
  },
  qa: {
    eyebrow: 'Quality Assurance',
    heading: 'Automated Scale. Human Judgment.',
    body: 'Voice AI quality cannot always be reduced to a single automated score. Growlatics combines machine-scale testing with evidence review and human assessment.',
    items: [
      {
        index: 'A',
        title: 'Automated Execution',
        body: 'Run repeatable scenarios across large volumes of calls using automated test agents and simulated callers.',
        tags: ['Bot-to-agent calls', 'Concurrent execution', 'Regression scenarios', 'Repeatable test runs'],
      },
      {
        index: 'D',
        title: 'Data & Evidence',
        body: 'Capture the evidence required to understand failures and compare configurations.',
        tags: ['Transcripts', 'Call recordings', 'Timings', 'Performance metrics', 'Failure observations'],
      },
      {
        index: 'H',
        title: 'Human Review',
        body: 'Add human analysis for areas where subjective customer experience and natural conversation quality matter.',
        tags: ['Call listening', 'Naturalness review', 'Customer experience', 'Behavior assessment', 'Escalation quality'],
      },
    ],
  },
  method: {
    eyebrow: 'Testing Methodology',
    heading: 'From Test Design to Production Readiness',
    steps: [
      { title: 'Define the Evaluation', body: 'Understand the Voice AI configuration, customer journey, expected behavior and technical environment.' },
      { title: 'Build Test Scenarios', body: 'Develop datasets, conversation paths, edge cases and expected outcomes.' },
      { title: 'Deploy the Test Environment', body: "Connect the customer's Voice AI and relevant telephony, contact-center or integration environment." },
      { title: 'Generate Conversations', body: 'Execute simulated and automated conversations at the required volume and scenario bandwidth.' },
      { title: 'Capture Evidence', body: 'Collect recordings, transcripts, timings, outputs and operational metrics.' },
      { title: 'Human QA Review', body: 'Review selected calls and outputs for naturalness, accuracy, behavior and customer experience.' },
      { title: 'Analyze & Report', body: 'Identify recurring failures, risk patterns and opportunities for improvement.' },
      { title: 'Re-test & Validate', body: 'Repeat relevant scenarios after changes to confirm whether issues have been resolved.' },
    ],
  },
  outputs: {
    eyebrow: 'Testing Evidence',
    heading: 'Structured Outputs for Product, Engineering & Operations Teams',
    body: 'Growlatics can provide structured testing evidence that helps clients understand what was tested, how systems performed and where failures occurred.',
    items: [
      { title: 'Test Plans & Scope', body: 'Defined configuration, objectives, scenarios and expected outcomes.' },
      { title: 'Scenario Definitions', body: 'Structured customer journeys, edge cases and test conditions.' },
      { title: 'Concurrent Call Evidence', body: 'Test volumes, execution conditions and environment details.' },
      { title: 'Transcripts & Recordings', body: 'Conversation evidence for analysis, replay and validation.' },
      { title: 'Metrics & Failure Observations', body: 'Structured findings on quality, performance and defects.' },
      { title: 'Production Readiness Findings', body: 'Risks, unresolved issues and evidence supporting deployment decisions.' },
    ],
  },
  industries: {
    eyebrow: 'Industries',
    heading: 'Voice AI Testing Across Customer-Facing Industries',
    body: 'Growlatics adapts testing scenarios to the customer journeys, workflows, terminology and risk environments of each industry.',
    items: [
      'Contact Centers',
      'Customer Service',
      'Healthcare',
      'Dental Clinics',
      'Hospitality',
      'Real Estate',
      'Finance',
      'Insurance',
      'Telecommunications',
      'Government Services',
      'E-Commerce',
      'Professional Services',
    ],
  },
  why: {
    eyebrow: 'Why Growlatics',
    heading: 'Beyond Software Testing',
    body: 'Software tools can automate individual tests. Growlatics can provide the people, scenarios, operational environment and structured testing process around the technology.',
    items: [
      { index: 'Testing infrastructure', title: 'Test at Meaningful Scale', body: 'Execute large-volume and concurrent Voice AI testing under controlled operating conditions.' },
      { index: 'Testing workforce', title: 'Human Quality Review', body: 'Combine automated execution with people listening, reviewing transcripts and evaluating conversation quality.' },
      { index: 'Testing data', title: 'Purpose-Built Scenarios', body: 'Create structured datasets that test expected behaviors, failures, customer journeys and edge cases.' },
      { index: 'Operational environments', title: 'Contact Center Validation', body: 'Evaluate technology within realistic telephony, contact-center and business workflow environments.' },
      { index: 'Performance analysis', title: 'Evidence, Not Assumptions', body: 'Use recordings, transcripts, metrics and structured observations to identify where systems fail.' },
      { index: 'Release validation', title: 'Confidence Before Deployment', body: 'Re-test revised configurations and provide evidence that supports informed production decisions.' },
    ],
  },
  finalCta: {
    eyebrow: 'Voice AI Testing Project',
    heading: 'Ready to Test Your Voice AI Under Real-World Conditions?',
    body: 'Talk to Growlatics about high-volume testing, custom evaluation datasets, contact-center validation, human QA or production-readiness testing for your Voice AI solution.',
    primary: { label: 'Book a Consultation', href: '/contact/?system=voice-ai-testing#book' },
    secondary: { label: 'Discuss a Testing Project', href: mailto('Discuss a Voice AI Testing Project') },
  },
}
