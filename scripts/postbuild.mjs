// After `vite build`: make build/ plain HTML and CSS, then write _redirects.
//
// With csr = false no page loads JavaScript, but SvelteKit still emits its
// client bundles and __data.json files. They would carry every gated claim
// (the client code holds the whole template), so they are deleted here, and
// the guards check that no .js file and no <script> is left.
import { copyFileSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { outDir, readFlags } from '../src/lib/flags.js';

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

const variant = readFlags().LAUNCH ? 'launch' : 'prelaunch';
copyFileSync(join(root, 'redirects', `${variant}.txt`), join(build, '_redirects'));
console.log(`site postbuild: pruned client bundles, _redirects = ${variant}`);
