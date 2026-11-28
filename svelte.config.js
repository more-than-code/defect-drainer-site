import adapter from '@sveltejs/adapter-static';
import { assertLaunchReady, assertLegalFinal, outDir, readFlags } from './src/lib/flags.js';

// Fails here, before any page renders, on a bad flag or an unready launch.
assertLaunchReady(readFlags());
assertLegalFinal(readFlags());

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Same Svelte version gate as console/: project components compile in runes mode.
  compilerOptions: {
    runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
  },
  kit: {
    // Plain HTML and CSS: every route prerendered, no SPA fallback.
    adapter: adapter({ pages: outDir(), assets: outDir(), strict: true }),
    prerender: {
      // /privacy and /terms have no entries until approved text exists.
      handleUnseenRoutes: 'ignore',
    },
  },
};

export default config;
