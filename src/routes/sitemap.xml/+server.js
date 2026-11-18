export const prerender = true;

import { builtLegalSlugs } from '$lib/flags.js';
import { SITE_ORIGIN } from '$lib/site.js';

export function GET() {
  const paths = ['/', ...builtLegalSlugs().map((slug) => `/${slug}`)];
  const urls = paths.map((p) => `  <url><loc>${SITE_ORIGIN}${p}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
