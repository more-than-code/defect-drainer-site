<script>
  import { page } from '$app/state';
  import { SIGN_IN_URL, SITE_ORIGIN, SUPPORT_EMAIL, TRADEMARK_LINE } from '$lib/site.js';

  let { data, children } = $props();

  const canonical = $derived(`${SITE_ORIGIN}${page.url.pathname === '/' ? '/' : page.url.pathname}`);
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
</svelte:head>

<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/" aria-label="Defect Drainer home">
      <img src="/favicon.svg" alt="" width="32" height="32" />
      <span>Defect Drainer</span>
    </a>
    <nav aria-label="Main">
      <a class="nav-link wide-only" href="/#cases">Use cases</a>
      <a class="nav-link wide-only" href="/#github">Compared with GitHub</a>
      <a class="button small" href={SIGN_IN_URL}>Sign in</a>
    </nav>
  </div>
</header>

<main id="main">
  {@render children()}
</main>

<footer class="site-footer">
  <div class="wrap footer-row">
    <p>{TRADEMARK_LINE}</p>
    <ul class="footer-links">
      {#if data.legal.includes('privacy')}<li><a href="/privacy">Privacy</a></li>{/if}
      {#if data.legal.includes('terms')}<li><a href="/terms">Terms</a></li>{/if}
      <li><a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a></li>
    </ul>
  </div>
</footer>

<style>
  :global(:root) {
    --bg: #ffffff;
    --bg-soft: #f4f7f6;
    --card: #ffffff;
    --text: #14201c;
    --muted: #4d5c57;
    --border: #d6e0dc;
    --brand: #0f6e56;
    --brand-text: #0b5a46;
    --on-brand: #ffffff;
    --ok: #0b6b3a;
    --danger: #b42318;
    --warn: #8a5300;
    --info: #1d5fb8;
    --code-bg: #eef3f1;
    --radius: 12px;
    --font: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --bg: #0e1513;
      --bg-soft: #141d1a;
      --card: #18231f;
      --text: #e6efeb;
      --muted: #a7b7b1;
      --border: #2b3a35;
      --brand: #5dcaa5;
      --brand-text: #7fd8b9;
      --on-brand: #06231b;
      --ok: #6fd69c;
      --danger: #f97066;
      --warn: #f5b94a;
      --info: #84adff;
      --code-bg: #101a17;
    }
  }
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }
  :global(html) {
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }
  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    font-size: 1rem;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
  :global(a) {
    color: var(--brand-text);
  }
  :global(.wrap) {
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 16px;
  }
  :global(.button) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    min-width: 44px;
    padding: 10px 20px;
    border-radius: 999px;
    border: 1px solid var(--brand);
    background: var(--brand);
    color: var(--on-brand);
    font-weight: 600;
    text-decoration: none;
  }
  :global(.button.secondary) {
    background: transparent;
    color: var(--brand-text);
  }
  :global(.button.small) {
    padding: 8px 16px;
  }
  :global(:focus-visible) {
    outline: 3px solid var(--brand);
    outline-offset: 2px;
  }

  .skip {
    position: absolute;
    left: -999px;
    top: 8px;
  }
  .skip:focus {
    left: 8px;
    padding: 8px 12px;
    background: var(--card);
    z-index: 10;
  }
  .site-header {
    border-bottom: 1px solid var(--border);
    background: var(--bg);
  }
  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 64px;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    color: var(--text);
    font-weight: 700;
    text-decoration: none;
  }
  nav {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .nav-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 8px;
    color: var(--muted);
    text-decoration: none;
  }
  .nav-link:hover {
    color: var(--text);
  }
  @media (max-width: 720px) {
    .wide-only {
      display: none;
    }
  }
  .site-footer {
    border-top: 1px solid var(--border);
    background: var(--bg-soft);
    color: var(--muted);
    font-size: 0.9rem;
  }
  .footer-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 24px;
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .footer-row p {
    margin: 0;
  }
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0 16px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .footer-links a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
</style>
