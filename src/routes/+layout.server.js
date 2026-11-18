import { builtLegalSlugs, readFlags } from '$lib/flags.js';

export function load() {
  return { flags: readFlags(), legal: builtLegalSlugs() };
}
