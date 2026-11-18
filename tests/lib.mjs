// Shared helpers for the site guards: build variants and walk their output.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE = fileURLToPath(new URL('..', import.meta.url));
export const BUILD = join(SITE, 'build');
const TEST_OUT = join(SITE, '.test-out');

const FLAGS_OFF = { WORKER_LIVE: '0', GITHUB_LIVE: '0', OSS_RELEASE: '0', LAUNCH: '0' };

/**
 * Builds the site into .test-out/<name> with the given flags.
 * @param {string} name
 * @param {Record<string, string>} flags
 * @param {{ legalFixtures?: boolean }} [opts] legalFixtures puts placeholder
 *   (non-legal) fragments in a temp content dir so a LAUNCH build can run.
 */
export function buildVariant(name, flags, opts = {}) {
  const out = join(TEST_OUT, name);
  rmSync(out, { recursive: true, force: true });
  /** @type {Record<string, string>} */
  const env = { ...process.env, ...FLAGS_OFF, ...flags, SITE_OUT: out };
  if (opts.legalFixtures) {
    const content = join(TEST_OUT, `${name}-content`);
    mkdirSync(content, { recursive: true });
    writeFileSync(join(content, 'privacy.html'), '<h1>Privacy</h1><p>TEST FIXTURE privacy.</p>\n');
    writeFileSync(join(content, 'terms.html'), '<h1>Terms</h1><p>TEST FIXTURE terms.</p>\n');
    env.SITE_CONTENT_DIR = content;
  }
  execFileSync('pnpm', ['run', '--silent', 'build'], { cwd: SITE, env, stdio: 'pipe' });
  return out;
}

/** Runs a build expected to fail; returns its combined output. */
export function buildFails(flags) {
  const env = { ...process.env, ...FLAGS_OFF, ...flags, SITE_OUT: join(TEST_OUT, 'should-fail') };
  try {
    execFileSync('pnpm', ['run', '--silent', 'build'], { cwd: SITE, env, stdio: 'pipe' });
  } catch (err) {
    const e = /** @type {{ stdout?: Buffer, stderr?: Buffer }} */ (err);
    return `${e.stdout ?? ''}${e.stderr ?? ''}`;
  }
  throw new Error(`build with ${JSON.stringify(flags)} should have failed`);
}

/**
 * Every file under dir, as { rel, text } (text is '' for binary files).
 * @param {string} dir
 * @returns {{ rel: string, path: string, text: string }[]}
 */
export function files(dir) {
  /** @type {{ rel: string, path: string, text: string }[]} */
  const list = [];
  const walk = (/** @type {string} */ d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const path = join(d, entry.name);
      if (entry.isDirectory()) walk(path);
      else {
        const binary = /\.(png|jpe?g|webp|gif|ico)$/i.test(entry.name);
        list.push({ rel: relative(dir, path), path, text: binary ? '' : readFileSync(path, 'utf8') });
      }
    }
  };
  walk(resolve(dir));
  return list;
}
