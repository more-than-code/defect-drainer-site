<script>
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.title} · Defect Drainer</title>
</svelte:head>

<article class="wrap legal">
  <!-- Approved legal text, committed by hand to src/content/; never user input. -->
  {@html data.html}
</article>

<style>
  .legal {
    max-width: 760px;
    padding-top: 48px;
    padding-bottom: 56px;
  }
</style>
