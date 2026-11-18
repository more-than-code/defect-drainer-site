// Guards for the landing site (docs/hosting-and-landing.md §4.4 and §5.7).
// They build three variants into .test-out/ and check every file in each,
// plus `build/` when `pnpm build` made one (as `make site` does):
//   off    every flag 0: the build Ops uploads before launch
//   on     WORKER_LIVE, GITHUB_LIVE, OSS_RELEASE = 1, LAUNCH = 0
//   launch every flag 1, with placeholder (non-legal) Privacy/Terms fixtures
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { before, describe, test } from 'node:test';
import { BUILD, SITE, buildFails, buildVariant, files } from './lib.mjs';

// Real customer, app, project and infra names that must never appear in the
// site: in file contents, file names or SVG text. Joe approved this list on
// 2026-11-18 ("Approve as proposed"). Matched case-insensitively as words.
const FORBIDDEN_NAMES = ['Tutored', 'ttd', 'Deploybot', 'Skill Forge', 'skill-forge', 'pi1', 'pi4'];

// Hosts a built file may link to. Everything else is a third-party URL.
const SITE_HOSTS = new Set(['defectdrainer.com', 'console.defectdrainer.com', 'api.defectdrainer.com']);
const WORKER_REPO = 'https://github.com/more-than-code/defect-drainer-worker';
const XML_NAMESPACES = new Set(['http://www.w3.org/2000/svg', 'http://www.sitemaps.org/schemas/sitemap/0.9']);

// Wording each gate controls. Absent from every file while its flag is off.
const GATED = {
  WORKER_LIVE: [/on your (own )?worker/i, /Add a worker/],
  GITHUB_LIVE: [/connect GitHub/i, /GitHub App/],
  OSS_RELEASE: [/open[\s-]*source/i, /Apache-2\.0/, /github\.com\/more-than-code/],
};

/** @type {Record<string, string>} */
const outputs = {};

before(() => {
  outputs.off = buildVariant('off', {});
  outputs.on = buildVariant('on', { WORKER_LIVE: '1', GITHUB_LIVE: '1', OSS_RELEASE: '1' });
  outputs.launch = buildVariant(
    'launch',
    { WORKER_LIVE: '1', GITHUB_LIVE: '1', OSS_RELEASE: '1', LAUNCH: '1' },
    { legalFixtures: true },
  );
  if (existsSync(BUILD)) outputs.build = BUILD;
});

/** Built files of every variant. */
function builtFiles() {
  return Object.entries(outputs).flatMap(([variant, dir]) => files(dir).map((f) => ({ ...f, variant })));
}

/** Hand-written sources that end up in, or produce, the output. */
function sourceFiles() {
  return ['src', 'static', 'og'].flatMap((d) =>
    files(join(SITE, d)).map((f) => ({ ...f, rel: `${d}/${f.rel}`, variant: 'source' })),
  );
}

/** @param {string} html */
function visibleText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

describe('forbidden names', () => {
  const patterns = FORBIDDEN_NAMES.map(
    (name) => new RegExp(`(^|[^a-z0-9])${name.replace(/[-\s]/g, '[-\\s_]?')}($|[^a-z0-9])`, 'i'),
  );
  test('no real name in any built or source file, or its file name', () => {
    const hits = [];
    for (const f of [...builtFiles(), ...sourceFiles()]) {
      for (const [i, re] of patterns.entries()) {
        if (re.test(f.rel)) hits.push(`${f.variant}: file name ${f.rel} matches ${FORBIDDEN_NAMES[i]}`);
        if (re.test(f.text)) hits.push(`${f.variant}: ${f.rel} contains ${FORBIDDEN_NAMES[i]}`);
      }
    }
    assert.deepEqual(hits, []);
  });
});

describe('wording', () => {
  test('"open source" only ever describes the worker', () => {
    const hits = [];
    for (const f of builtFiles()) {
      if (!/\.(html|txt|xml)$/.test(f.rel)) continue;
      const text = f.rel.endsWith('.html') ? visibleText(f.text) : f.text;
      for (const sentence of text.split(/(?<=[.!?:])\s+|\n+/)) {
        if (/open[\s-]*source/i.test(sentence) && !/\bworker\b/i.test(sentence)) {
          hits.push(`${f.variant}: ${f.rel}: "${sentence.trim()}"`);
        }
      }
    }
    assert.deepEqual(hits, []);
  });

  test('early-access line: the pre-worker sentence only while WORKER_LIVE=0 (brief C.2)', () => {
    const pre =
      'Invite only during early access. Fixes run on your own machine through the Defect Drainer worker, which arrives with its first release.';
    const hero = (dir) => visibleText(readFileSync(join(dir, 'index.html'), 'utf8')).replace(/\s+/g, ' ');
    const llms = (dir) => readFileSync(join(dir, 'llms.txt'), 'utf8');
    assert.ok(hero(outputs.off).includes(pre), 'off: hero');
    assert.ok(llms(outputs.off).includes(pre), 'off: llms.txt');
    for (const variant of ['on', 'launch']) {
      assert.ok(!hero(outputs[variant]).includes('arrives with its first release'), `${variant}: hero`);
      assert.ok(!llms(outputs[variant]).includes('arrives with its first release'), `${variant}: llms.txt`);
      assert.ok(hero(outputs[variant]).includes('Invite only during early access.'), `${variant}: hero short line`);
    }
  });

  test('no registered-trademark sign anywhere (™ wording only)', () => {
    const hits = [...builtFiles(), ...sourceFiles()]
      .filter((f) => /®|&reg;|&#174;|&#xae;/i.test(f.text))
      .map((f) => `${f.variant}: ${f.rel}`);
    assert.deepEqual(hits, []);
  });

  test('the footer carries the trademark line and the support address', () => {
    const html = readFileSync(join(outputs.off, 'index.html'), 'utf8');
    assert.match(html, /Defect Drainer is a trademark of Mi Zhou\./);
    assert.match(html, /support@defectdrainer\.com/);
  });
});

describe('no client JavaScript, no third parties', () => {
  test('zero <script> tags and no .js files', () => {
    const hits = builtFiles()
      .filter((f) => f.rel.endsWith('.js') || /<script\b/i.test(f.text) || /javascript:/i.test(f.text))
      .map((f) => `${f.variant}: ${f.rel}`);
    assert.deepEqual(hits, []);
  });

  test('every URL is ours or the public worker repo', () => {
    const hits = [];
    for (const f of builtFiles()) {
      for (const url of f.text.match(/https?:\/\/[^\s"'<>)`\\]+/g) ?? []) {
        const clean = url.replace(/[.,;]+$/, '');
        if (XML_NAMESPACES.has(clean)) continue;
        if (clean === WORKER_REPO || clean.startsWith(`${WORKER_REPO}/`)) continue;
        const host = new URL(clean).hostname;
        if (clean.startsWith('https://') && SITE_HOSTS.has(host)) continue;
        hits.push(`${f.variant}: ${f.rel}: ${clean}`);
      }
    }
    assert.deepEqual(hits, []);
  });
});

describe('gate flags', () => {
  for (const [flag, patterns] of Object.entries(GATED)) {
    test(`${flag} off: its wording is absent from every file`, () => {
      const hits = [];
      for (const f of files(outputs.off)) {
        for (const re of patterns) if (re.test(f.text)) hits.push(`${f.rel} matches ${re}`);
      }
      assert.deepEqual(hits, []);
    });

    test(`${flag} on: its wording is on the page`, () => {
      const html = readFileSync(join(outputs.on, 'index.html'), 'utf8');
      for (const re of patterns) assert.match(html, re);
    });
  }

  test('a flag that is not 0 or 1 fails the build', () => {
    assert.match(buildFails({ WORKER_LIVE: 'true' }), /WORKER_LIVE must be 0 or 1/);
  });
});

describe('launch', () => {
  test('no build writes _redirects: the apex serves only the site (H9 as amended)', () => {
    for (const [variant, dir] of Object.entries(outputs)) {
      assert.equal(existsSync(join(dir, '_redirects')), false, variant);
    }
  });

  test('no legal text: /privacy and /terms are not built, nor linked or in the sitemap', () => {
    for (const variant of ['off', 'on']) {
      const dir = outputs[variant];
      assert.equal(existsSync(join(dir, 'privacy.html')), false);
      assert.equal(existsSync(join(dir, 'terms.html')), false);
      assert.doesNotMatch(readFileSync(join(dir, 'index.html'), 'utf8'), /href="\/(privacy|terms)"/);
      assert.doesNotMatch(readFileSync(join(dir, 'sitemap.xml'), 'utf8'), /privacy|terms/);
    }
  });

  test('with approved text: /privacy and /terms are built, linked and in the sitemap', () => {
    const dir = outputs.launch;
    assert.match(readFileSync(join(dir, 'privacy.html'), 'utf8'), /TEST FIXTURE privacy/);
    assert.match(readFileSync(join(dir, 'terms.html'), 'utf8'), /TEST FIXTURE terms/);
    assert.match(readFileSync(join(dir, 'index.html'), 'utf8'), /href="\/privacy"[\s\S]*href="\/terms"/);
    const sitemap = readFileSync(join(dir, 'sitemap.xml'), 'utf8');
    assert.match(sitemap, /defectdrainer\.com\/privacy/);
    assert.match(sitemap, /defectdrainer\.com\/terms/);
  });

  test('LAUNCH=1 fails without approved legal text or live gates', () => {
    const out = buildFails({ LAUNCH: '1' });
    assert.match(out, /LAUNCH=1 is not ready/);
    assert.match(out, /missing approved text src\/content\/privacy\.html/);
    assert.match(out, /WORKER_LIVE=1 is required/);
    assert.match(out, /GITHUB_LIVE=1 is required/);
  });
});

describe('machine-readable files', () => {
  test('robots.txt names the sitemap; llms.txt names the intake address', () => {
    const dir = outputs.off;
    assert.match(readFileSync(join(dir, 'robots.txt'), 'utf8'), /^Sitemap: https:\/\/defectdrainer\.com\/sitemap\.xml$/m);
    assert.match(readFileSync(join(dir, 'llms.txt'), 'utf8'), /https:\/\/api\.defectdrainer\.com\/api\/intake/);
  });

  test('home page has canonical, Open Graph and Twitter tags; 404 is noindex', () => {
    const html = readFileSync(join(outputs.off, 'index.html'), 'utf8');
    assert.match(html, /<link rel="canonical" href="https:\/\/defectdrainer\.com\/"/);
    assert.match(html, /property="og:image" content="https:\/\/defectdrainer\.com\/og\.png"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(readFileSync(join(outputs.off, '404.html'), 'utf8'), /name="robots" content="noindex"/);
    assert.ok(existsSync(join(outputs.off, 'og.png')));
  });
});
