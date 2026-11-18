// After `vite build`: make build/ plain HTML and CSS. The site writes no
// _redirects (H9 as amended 2026-11-19): the apex serves only the site.
//
// With csr = false no page loads JavaScript, but SvelteKit still emits its
// client bundles and __data.json files. They would carry every gated claim
// (the client code holds the whole template), so they are deleted here, and
// the guards check that no .js file and no <script> is left.
import { readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { outDir } from '../src/lib/flags.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const build = resolve(root, outDir());

/** @param {string} dir */
function prune(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      prune(path);
      if (readdirSync(path).length === 0) rmSync(path, { recursive: true });
    } else if (entry.name.endsWith('.js') || entry.name === '__data.json' || entry.name === 'version.json') {
      rmSync(path);
    }
  }
}

prune(build);

console.log('site postbuild: pruned client bundles');
