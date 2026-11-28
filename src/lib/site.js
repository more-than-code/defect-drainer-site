// Public addresses used on the page. Nothing here is a secret or an infra detail.
export const SITE_ORIGIN = 'https://defectdrainer.com';
export const CONSOLE_ORIGIN = 'https://console.defectdrainer.com';
export const SIGN_IN_URL = `${CONSOLE_ORIGIN}/signin`;
export const INTAKE_URL = 'https://api.defectdrainer.com/api/intake';
export const SUPPORT_EMAIL = 'support@defectdrainer.com';
export const WORKER_REPO_URL = 'https://github.com/more-than-code/defect-drainer-worker';
export const TITLE = 'Defect Drainer: verified bug fixes from your coding agent';
export const DESCRIPTION =
  'Collect bugs with screenshots. Defect Drainer runs your coding agent on them in isolated branches, re-runs your checks and reviews every fix before a pull request.';
// Sign-up line under the hero (open sign-up, Joe 2026-11-28; it was "Invite
// only during early access"): the long form while WORKER_LIVE=0, the short one
// once the worker is live.
export const START_NOTE = 'Sign in with Google and create your organisation.';
export const START_NOTE_PRE_WORKER =
  'Sign in with Google and create your organisation. Fixes run on your own machine through the Defect Drainer worker, which arrives with its first release.';
