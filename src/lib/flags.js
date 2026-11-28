// Build flags (docs/hosting-and-landing.md §4.4). Read once at build time; the
// page never sees them in the browser (csr = false). Every flag defaults to
// off. Only "0" and "1" are accepted so a typo such as "true" fails the build
// instead of silently leaving a claim out.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** @typedef {{ WORKER_LIVE: boolean, GITHUB_LIVE: boolean, OSS_RELEASE: boolean, LAUNCH: boolean }} Flags */

const NAMES = /** @type {const} */ (['WORKER_LIVE', 'GITHUB_LIVE', 'OSS_RELEASE', 'LAUNCH']);

/** Legal pages that exist only when Joe-approved text is in src/content/. */
export const LEGAL_SLUGS = /** @type {const} */ (['privacy', 'terms']);

// SITE_CONTENT_DIR exists for the guard tests only (a temp dir of fixtures).
// The default is relative to the working directory, not import.meta.url: the
// build bundles this file into .svelte-kit/output, where ../content/ is not
// src/content/. Every build runs from the repo root (package.json scripts, Pages).
const contentDir = process.env.SITE_CONTENT_DIR || join(process.cwd(), 'src', 'content');

/** @param {string} slug */
export function legalPath(slug) {
  return join(contentDir, `${slug}.html`);
}

/** Build output dir. SITE_OUT exists for the guard tests only. */
export function outDir() {
  return process.env.SITE_OUT || 'build';
}

/** @returns {string[]} the legal slugs whose approved text exists */
export function builtLegalSlugs() {
  return LEGAL_SLUGS.filter((slug) => existsSync(legalPath(slug)));
}

/**
 * @param {Record<string, string | undefined>} env
 * @returns {Flags}
 */
export function readFlags(env = process.env) {
  /** @type {Record<string, boolean>} */
  const flags = {};
  for (const name of NAMES) {
    const raw = env[name];
    if (raw === undefined || raw === '' || raw === '0') flags[name] = false;
    else if (raw === '1') flags[name] = true;
    else throw new Error(`site build: ${name} must be 0 or 1, got ${JSON.stringify(raw)}`);
  }
  return /** @type {Flags} */ (flags);
}

/** Marks a blank in draft legal text; see src/content/README.md. */
export const DRAFT_MARK = 'data-draft';

/** @returns {string[]} the legal slugs whose text still has a draft blank */
export function draftLegalSlugs() {
  return builtLegalSlugs().filter((slug) => readFileSync(legalPath(slug), 'utf8').includes(DRAFT_MARK));
}

/**
 * The production build (Cloudflare Pages on main sets CF_PAGES_BRANCH=main) and
 * a LAUNCH build publish only finished legal text: fail while a draft blank is left.
 * Preview and CI builds render drafts so Joe can read them.
 * @param {Flags} flags
 * @param {Record<string, string | undefined>} env
 */
export function assertLegalFinal(flags, env = process.env) {
  if (!flags.LAUNCH && env.CF_PAGES_BRANCH !== 'main') return;
  const drafts = draftLegalSlugs();
  if (drafts.length) {
    throw new Error(
      `site build: draft legal text can't be published: ${drafts.map((s) => `src/content/${s}.html`).join(', ')} still has ${DRAFT_MARK} blanks`,
    );
  }
}

/**
 * LAUNCH=1 is the public site. It needs approved Privacy and Terms text, and
 * (H8) the worker and the GitHub App live in prod. Fail the build otherwise.
 * @param {Flags} flags
 */
export function assertLaunchReady(flags) {
  if (!flags.LAUNCH) return;
  const problems = [];
  for (const slug of LEGAL_SLUGS) {
    if (!existsSync(legalPath(slug))) problems.push(`missing approved text src/content/${slug}.html`);
  }
  if (!flags.WORKER_LIVE) problems.push('WORKER_LIVE=1 is required (H8: launch waits for W3)');
  if (!flags.GITHUB_LIVE) problems.push('GITHUB_LIVE=1 is required (H8: launch waits for R4a)');
  if (problems.length) {
    throw new Error(`site build: LAUNCH=1 is not ready:\n  - ${problems.join('\n  - ')}`);
  }
}
