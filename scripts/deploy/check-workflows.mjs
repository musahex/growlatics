// Guards the production/preview split in .github/workflows. Run in PR CI and the deploy build.
//   node scripts/deploy/check-workflows.mjs [dir=.github/workflows]   |   --self-test
// Rules: only deploy-production.yml runs on push, and only for main, behind PRODUCTION_DEPLOY_ENABLED;
// GitHub Pages workflows are manual (dispatch/call) and build the noindex preview; Hostinger secrets only in the
// production workflows, which use the "production" environment; every action pinned to a commit SHA.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'
const yaml = createRequire(import.meta.url)('js-yaml') // installed with eslint (npm ci)

const PROD = ['deploy-production.yml', 'rollback-production.yml']

export function check(files) { // { name: text }
  const problems = []
  const bad = (f, m) => problems.push(`${f}: ${m}`)
  for (const [f, text] of Object.entries(files)) {
    const wf = yaml.load(text)
    const on = typeof wf.on === 'string' ? { [wf.on]: null } : Array.isArray(wf.on) ? Object.fromEntries(wf.on.map((k) => [k, null])) : wf.on || {}
    const triggers = Object.keys(on)
    const pages = /actions\/(deploy-pages|upload-pages-artifact)@/.test(text)
    const hostinger = /secrets\.HOSTINGER_/.test(text)
    for (const m of text.matchAll(/uses:\s*([^\s#]+)/g)) if (!m[1].startsWith('./') && !/@[0-9a-f]{40}$/.test(m[1])) bad(f, `action not pinned to a SHA: ${m[1]}`)
    if (triggers.includes('pull_request_target')) bad(f, 'pull_request_target is not allowed')

    if (f === 'deploy-production.yml') {
      if (triggers.join() !== 'push' || JSON.stringify(on.push) !== '{"branches":["main"]}') bad(f, 'must trigger on push to main only')
      if (wf.concurrency?.group !== 'growlatics-production' || wf.concurrency['cancel-in-progress'] !== false) bad(f, 'concurrency must be growlatics-production, cancel-in-progress false')
      if (!/vars\.PRODUCTION_DEPLOY_ENABLED == 'true'/.test(wf.jobs?.deploy?.if || '')) bad(f, 'deploy job lacks the PRODUCTION_DEPLOY_ENABLED kill switch')
    } else if (triggers.some((t) => ['push', 'schedule', 'workflow_run'].includes(t))) bad(f, `only deploy-production.yml may run on ${triggers.join(', ')}`)
    if (f === 'rollback-production.yml' && triggers.join() !== 'workflow_dispatch') bad(f, 'rollback must be manual only')

    if (pages) {
      if (triggers.some((t) => !['workflow_dispatch', 'workflow_call'].includes(t))) bad(f, 'GitHub Pages workflow must be manual (workflow_dispatch/workflow_call) only')
      if (hostinger) bad(f, 'GitHub Pages workflow must not use Hostinger secrets')
      if (/actions\/upload-pages-artifact@/.test(text) && !/NEXT_PUBLIC_SITE_ENV:\s*preview/.test(text)) bad(f, 'Pages may only receive the noindex preview build (NEXT_PUBLIC_SITE_ENV: preview)')
    }
    if (hostinger) {
      if (!PROD.includes(f)) bad(f, 'Hostinger secrets outside the production workflows')
      for (const [id, job] of Object.entries(wf.jobs || {})) if (/secrets\.HOSTINGER_/.test(JSON.stringify(job)) && (job.environment?.name ?? job.environment) !== 'production') bad(f, `job ${id} uses Hostinger secrets outside the production environment`)
    }
    if (triggers.includes('pull_request') && /secrets\./.test(text.replace(/secrets\.GITHUB_TOKEN/g, ''))) bad(f, 'PR workflow must not use secrets')
  }
  for (const f of PROD) if (!(f in files)) bad(f, 'missing')
  return problems
}

function selfTest() {
  const dir = '.github/workflows'
  const real = Object.fromEntries(readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).map((f) => [f, readFileSync(join(dir, f), 'utf8')]))
  const mut = (f, from, to) => ({ ...real, [f]: real[f].replace(from, to) })
  const cases = {
    'old main deploy.yml (push → Pages)': mut('deploy.yml', 'on:\n  workflow_dispatch:', 'on:\n  push:\n    branches: [main]\n  workflow_dispatch:'),
    'kill switch removed': mut('deploy-production.yml', "vars.PRODUCTION_DEPLOY_ENABLED == 'true' && ", ''),
    'deploy on v2 too': mut('deploy-production.yml', 'branches: [main]', 'branches: [main, v2]'),
    'unpinned action': mut('ci.yml', /actions\/checkout@[0-9a-f]{40}/, 'actions/checkout@v4'),
    'cancel-in-progress true': mut('deploy-production.yml', 'cancel-in-progress: false', 'cancel-in-progress: true'),
    'production build to Pages': mut('preview-pages.yml', 'NEXT_PUBLIC_SITE_ENV: preview', 'NEXT_PUBLIC_SITE_ENV: ""'),
  }
  let failed = check(real).length ? (console.log('FAIL real workflows:', check(real)), 1) : 0
  for (const [name, files] of Object.entries(cases)) if (!check(files).length) { failed++; console.log(`FAIL not caught: ${name}`) }
  console.log(failed ? `self-test: ${failed} failed` : `self-test: real workflows pass, ${Object.keys(cases).length} bad variants caught`)
  process.exitCode = failed ? 1 : 0
}

if (process.argv[2] === '--self-test') selfTest()
else {
  const dir = process.argv[2] || '.github/workflows'
  const files = Object.fromEntries(readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).map((f) => [f, readFileSync(join(dir, f), 'utf8')]))
  const problems = check(files)
  problems.forEach((p) => console.log(' - ' + p))
  console.log(`workflows: ${Object.keys(files).length} checked, ${problems.length} problem(s)`)
  process.exitCode = problems.length ? 1 : 0
}
