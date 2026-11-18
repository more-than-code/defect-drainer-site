// /privacy and /terms render only Joe-approved text from src/content/<slug>.html.
// Until that file exists, entries() leaves the slug out and the page is not built.
import { readFileSync } from 'node:fs';
import { error } from '@sveltejs/kit';
import { builtLegalSlugs, legalPath } from '$lib/flags.js';

/** @type {import('./$types').EntryGenerator} */
export function entries() {
  return builtLegalSlugs().map((legal) => ({ legal }));
}

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  if (!builtLegalSlugs().includes(params.legal)) error(404, 'Not found');
  return {
    title: params.legal === 'privacy' ? 'Privacy' : 'Terms',
    html: readFileSync(legalPath(params.legal), 'utf8'),
  };
}
