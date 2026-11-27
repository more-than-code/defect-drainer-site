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
// Early-access line (brief Appendix C.2, Joe 2026-11-19): the long form while
// WORKER_LIVE=0, the short one once the worker is live.
export const EARLY_ACCESS_NOTE = 'Invite only during early access.';
export const EARLY_ACCESS_NOTE_PRE_WORKER =
  'Invite only during early access. Fixes run on your own machine through the Defect Drainer worker, which arrives with its first release.';
