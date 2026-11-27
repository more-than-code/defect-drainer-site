export const prerender = true;

// llms.txt: what Defect Drainer is, its safety model, and how an agent files a
// defect. Gated wording follows the same build flags as the home page.
import { readFlags } from '$lib/flags.js';
import {
  CONSOLE_ORIGIN,
  EARLY_ACCESS_NOTE_PRE_WORKER,
  INTAKE_URL,
  SITE_ORIGIN,
  SUPPORT_EMAIL,
  WORKER_REPO_URL,
} from '$lib/site.js';

export function GET() {
  const f = readFlags();
  const onWorker = f.WORKER_LIVE ? ', on your worker' : '';
  const lines = [
    '# Defect Drainer',
    '',
    '> Bugs in, verified fixes out. Defect Drainer collects bug reports with screenshots, runs your own coding agent on them in isolated git branches, re-runs your checks, has an independent reviewer look at every fix, and opens a pull request only for fixes that pass.',
    '',
    f.WORKER_LIVE ? 'Defect Drainer is invite-only during early access.' : EARLY_ACCESS_NOTE_PRE_WORKER,
    '',
    '## What it does',
    '',
    '- Defect inventory per project, with screenshot evidence, severity and status.',
    '- Batch fixes: each defect batch runs in its own git worktree, cut from the branch you choose.',
    "- Verification: Defect Drainer re-runs your app's own check commands and requires fix evidence before a defect is resolved.",
    '- Independent review: a separate read-only reviewer checks every fix; a critical or high finding blocks it.',
    '- Test plans and agent test runs; a failed step can be filed as a defect.',
    '- Ingest API, so scripts and detectors can file bugs.',
    '- Works with Claude Code or Grok, signed in on your own machine, or with your own agent over MCP (bring your own agent): it claims a defect, posts progress, attaches evidence and submits its branch, under the same proof rules.',
    '',
    '## How it differs from GitHub Issues and the Copilot coding agent',
    '',
    'Defect Drainer works next to GitHub Issues; every fix lands as a normal GitHub pull request.',
    '',
    '- Reporting: anyone invited to the organisation reports with a Google sign-in, with no GitHub account or repository access. On a private repository, GitHub Issues needs read access, which also shows the code.',
    '- Intake: apps and tools file through an intake-only token; a retry with the same Idempotency-Key never files twice.',
    "- Many agents: a claim gives one holder per defect, at most 5 open claims each, and lapses after 4 hours without progress. GitHub assignees don't stop two agents working the same issue.",
    "- Proof: an after-fix screenshot from the claim (or a stated reason when nothing is visible), the project's check commands re-run, and an independent review where a critical or high finding blocks the fix.",
    "- Closing: Defect Drainer resolves a defect once it checks on GitHub that the merged pull request is the claim's fix. Closing without proof is recorded as unproven. On GitHub, anyone with triage access can close an issue.",
    '- Where code runs: on a machine you own through the Defect Drainer worker, with a seccomp filter and per-job CPU and memory limits. The Copilot coding agent runs in GitHub Actions.',
    '- Planned, not built yet: two-way sync with GitHub Issues.',
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
    "- see your other projects' secrets or Defect Drainer's own settings;",
    '- read test-account passwords from Defect Drainer, which never stores them.',
    '',
    '## Filing a defect as an agent or script',
    '',
    `POST ${INTAKE_URL} (multipart: up to 12 images) or ${INTAKE_URL}/json (JSON, body up to 1 MiB).`,
    '',
    '- Authenticate with an ingest token for the project: `Authorization: Bearer dd_ing_...`. An org admin or owner creates it in the project\'s Settings. Keep it server-side; it works on no other route.',
    '- Fields: `comment` (or at least one image), `severity` (default `P2`), `client`, `surface`, `area`, `source`, `reporter`, optional `project_id` (defaults to the token\'s project; the old name `app_id` is accepted until 1.0), `repos`, and optional `context`.',
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
