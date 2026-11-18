export const prerender = true;

import { SITE_ORIGIN } from '$lib/site.js';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
