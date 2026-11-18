export const prerender = true;

// llms.txt: what Defect Drainer is, its safety model, and how an agent files a
// defect. Gated wording follows the same build flags as the home page.
import { readFlags } from '$lib/flags.js';
import { CONSOLE_ORIGIN, INTAKE_URL, SITE_ORIGIN, SUPPORT_EMAIL, WORKER_REPO_URL } from '$lib/site.js';

export function GET() {
  const f = readFlags();
  const onWorker = f.WORKER_LIVE ? ', on your worker' : '';
  const lines = [
    '# Defect Drainer',
    '',
    '> Bugs in, verified fixes out. Defect Drainer collects bug reports with screenshots, runs your own coding agent on them in isolated git branches, re-runs your checks, has an independent reviewer look at every fix, and opens a pull request only for fixes that pass.',
    '',
    'Defect Drainer is invite-only during early access.',
    '',
    '## What it does',
    '',
    '- Defect inventory per app, with screenshot evidence, severity and status.',
    '- Batch fixes: each defect batch runs in its own git worktree, cut from the branch you choose.',
    "- Verification: Defect Drainer re-runs your app's own check commands and requires fix evidence before a defect is resolved.",
    '- Independent review: a separate read-only reviewer checks every fix; a critical or high finding blocks it.',
    '- Test plans and agent test runs; a failed step can be filed as a defect.',
    '- Ingest API, so scripts and detectors can file bugs.',
    '- Works with Claude Code or Grok, signed in on your own machine.',
    '',
    '## Safety model',
    '',
    'The coding agent can:',
    `- change code in a job branch${onWorker};`,
    '- run your check commands;',
    '- propose a fix for you to review.',
    '',
    "The coding agent can't:",
    '- merge anything;',
    '- push before you click Create PR;',
    "- see your other apps' secrets or Defect Drainer's own settings;",
    '- read test-account passwords from Defect Drainer, which never stores them.',
    '',
    '## Filing a defect as an agent or script',
    '',
    `POST ${INTAKE_URL} (multipart: up to 12 images) or ${INTAKE_URL}/json (JSON, body up to 1 MiB).`,
    '',
    '- Authenticate with an ingest token for the app: `Authorization: Bearer dd_ing_...`. An app owner creates it in the console. Keep it server-side; it works on no other route.',
    '- Fields: `comment` (or at least one image), `severity` (default `P2`), `client`, `surface`, `area`, `source`, `reporter`, optional `app_id` (defaults to the token\'s app), `repos`, and optional `context`.',
    '- Send `Idempotency-Key` set to your own report id, so a retry never files a second defect.',
    '- The first call answers 202 with `job.defectId`; the same call again answers 200 with `"duplicate": true`.',
    '',
    'Example (a made-up app):',
    '',
    '```',
    `curl -sS ${INTAKE_URL}/json \\`,
    '  -H "Authorization: Bearer $DD_INGEST_TOKEN" \\',
    "  -H 'Content-Type: application/json' \\",
    "  -H 'Idempotency-Key: acme-shop:report-123' \\",
    `  -d '{"comment":"Cart total shows NaN after removing the last coupon","severity":"P2","client":"web"}'`,
    '```',
    '',
    '## Links',
    '',
    `- Home: ${SITE_ORIGIN}/`,
    `- Console (sign in): ${CONSOLE_ORIGIN}/signin`,
    `- Contact: ${SUPPORT_EMAIL}`,
  ];
  if (f.OSS_RELEASE) {
    lines.push(`- The worker (open source, Apache-2.0): ${WORKER_REPO_URL}`);
  }
  return new Response(lines.join('\n') + '\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
