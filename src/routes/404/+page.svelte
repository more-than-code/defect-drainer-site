<script>
  import { SIGN_IN_URL } from '$lib/site.js';
</script>

<svelte:head>
  <title>Page not found · Defect Drainer</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="wrap notfound">
  <h1>Page not found</h1>
  <p>There is nothing at this address.</p>
  <p class="links">
    <a class="button" href="/">Home</a>
    <a class="button secondary" href={SIGN_IN_URL}>Sign in</a>
  </p>
</section>

<style>
  .notfound {
    padding-top: 72px;
    padding-bottom: 72px;
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>
