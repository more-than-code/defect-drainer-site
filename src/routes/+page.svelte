<script>
  // Every claim maps to shipped behaviour (brief Appendix A). Gated wording is
  // behind a build flag and absent from the HTML while the flag is off:
  //   WORKER_LIVE  "on your worker" wording, How it works "Add a worker"
  //   GITHUB_LIVE  How it works "connect GitHub"
  //   OSS_RELEASE  the Open source section
  import {
    DESCRIPTION,
    SIGN_IN_URL,
    SITE_ORIGIN,
    SUPPORT_EMAIL,
    TITLE,
    WORKER_REPO_URL,
  } from '$lib/site.js';

  let { data } = $props();
  const f = $derived(data.flags);

  const steps = $derived(
    [
      f.GITHUB_LIVE
        ? {
            title: 'Sign in and connect GitHub',
            text: 'Install the Defect Drainer GitHub App on the repositories you want fixed. Only those.',
          }
        : { title: 'Sign in', text: 'Defect Drainer is invite-only during early access.' },
      f.WORKER_LIVE && {
        title: 'Add a worker',
        text: 'Install the worker on a machine you own and sign in your coding agent there. Your code is checked out on that machine.',
      },
      {
        title: 'Report, batch, review',
        text: 'File bugs, start a batch, and review each verified fix before you open its pull request.',
      },
    ].filter((s) => !!s),
  );
</script>

<svelte:head>
  <title>{TITLE}</title>
  <meta name="description" content={DESCRIPTION} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Defect Drainer" />
  <meta property="og:title" content={TITLE} />
  <meta property="og:description" content={DESCRIPTION} />
  <meta property="og:url" content="{SITE_ORIGIN}/" />
  <meta property="og:image" content="{SITE_ORIGIN}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Report, Inventory, Fix, Prove, Ship: the Defect Drainer loop." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={TITLE} />
  <meta name="twitter:description" content={DESCRIPTION} />
  <meta name="twitter:image" content="{SITE_ORIGIN}/og.png" />
</svelte:head>

<section class="hero">
  <div class="wrap">
    <h1>Bugs in, verified fixes out.</h1>
    <p class="lede">
      Collect bugs with screenshots. Defect Drainer runs your own coding agent on them in isolated branches,
      re-runs your checks and has an independent reviewer look at every fix, then opens a pull request.
    </p>
    <div class="actions">
      <a class="button" href={SIGN_IN_URL}>Sign in</a>
      <a class="button secondary" href="#how-it-works">How it works</a>
    </div>
    <p class="note">Invite only during early access.</p>
  </div>
</section>

<section class="band" aria-labelledby="loop-title">
  <div class="wrap">
    <h2 id="loop-title" class="visually-hidden">The loop</h2>
    <ol class="loop">
      <li>
        <span class="step-name">Report</span>
        <strong>A bug with a screenshot</strong>
        <span>From the console, the ingest API, or a detector script.</span>
        <code>DEF-0142</code>
      </li>
      <li>
        <span class="step-name">Inventory</span>
        <strong>One record per bug</strong>
        <span>Per app, with evidence, severity and status.</span>
        <code>open · high</code>
      </li>
      <li>
        <span class="step-name">Fix</span>
        <strong>Your agent, a fresh branch</strong>
        <span>In an isolated git worktree{#if f.WORKER_LIVE}&nbsp;on your own worker{/if}.</span>
        <code>BATCH-0031</code>
      </li>
      <li>
        <span class="step-name">Prove</span>
        <strong>Checks and review</strong>
        <span>Your check commands re-run, plus an independent reviewer.</span>
        <code>✓ verified</code>
      </li>
      <li>
        <span class="step-name">Ship</span>
        <strong>A PR you approve</strong>
        <span>Nothing is pushed until you click Create PR.</span>
        <code>PR #87</code>
      </li>
    </ol>
  </div>
</section>

<section aria-labelledby="action-title">
  <div class="wrap">
    <h2 id="action-title">See it in action</h2>
    <p class="section-lede">
      One defect from a made-up shop app, after the agent's run. Every gate below has to pass before the
      defect can be resolved.
    </p>
    <figure class="example">
      <figcaption>
        <span>Example · <code>BATCH-0031 · acme-shop</code></span>
        <span class="ok">✓ ready to ship</span>
      </figcaption>
      <div class="defect">
        <span class="tag">DEF-0142 · high</span>
        <h3>Cart total shows NaN after removing the last coupon</h3>
        <p>Reported from the console with one screenshot. Steps: add 2 items, apply SAVE10, remove it.</p>
      </div>
      <ul class="gates">
        <li>
          <span><strong>Baseline recorded.</strong> Your checks ran before the change: 1 failing test reproduced the bug.</span>
          <span class="ok">pass</span>
        </li>
        <li>
          <span><strong>Agent run.</strong> Claude Code{#if f.WORKER_LIVE}&nbsp;on your worker{/if} · 2 iterations · 3 files changed.</span>
          <span class="ok">done</span>
        </li>
        <li>
          <span><strong>Your checks re-run by Defect Drainer.</strong> <code>pnpm test</code> · <code>pnpm check</code> · 412 passed.</span>
          <span class="ok">pass</span>
        </li>
        <li>
          <span><strong>Fix evidence.</strong> After-screenshot shows the correct total.</span>
          <span class="ok">attached</span>
        </li>
        <li>
          <span><strong>Independent review.</strong> A separate read-only run, one lens at a time. A critical or high finding blocks the fix.</span>
          <span class="ok">0 blocking</span>
        </li>
      </ul>
      <p class="branch">Branch <code>defect-drainer/BATCH-0031</code> · not pushed until you click Create PR.</p>
    </figure>
  </div>
</section>

<section class="band" aria-labelledby="why-title">
  <div class="wrap">
    <h2 id="why-title">Why not just ask an agent?</h2>
    <div class="grid three">
      <div class="card">
        <h3>Chat with a coding agent</h3>
        <ul class="plain">
          <li>Fast for one bug</li>
          <li>No record of what was asked or fixed</li>
          <li>Edits your working copy</li>
          <li>You check the result yourself</li>
        </ul>
      </div>
      <div class="card">
        <h3>Tracker plus manual fixes</h3>
        <ul class="plain">
          <li>A record of every bug</li>
          <li>Every fix waits for a person</li>
          <li>Proof lives in someone's head</li>
        </ul>
      </div>
      <div class="card highlight">
        <h3>Defect Drainer</h3>
        <ul class="plain">
          <li>A record of every bug, with evidence</li>
          <li>Isolated branches, many bugs per batch</li>
          <li>Your checks re-run, plus an independent review</li>
          <li>A PR only for fixes that pass</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section aria-labelledby="get-title">
  <div class="wrap">
    <h2 id="get-title">What you get</h2>
    <div class="grid three">
      <div class="card">
        <span class="kicker">inventory</span>
        <h3>Every bug in one place</h3>
        <p>Defects per app, with screenshots, severity and status. Search and analytics included.</p>
      </div>
      <div class="card">
        <span class="kicker">batch fix</span>
        <h3>Many bugs, one batch</h3>
        <p>Pick defects and start a batch. Each runs in its own git worktree, cut from the branch you choose.</p>
      </div>
      <div class="card">
        <span class="kicker">verify</span>
        <h3>Proof you don't have to trust</h3>
        <p>Defect Drainer runs your app's own check commands itself and requires fix evidence before anything is resolved.</p>
      </div>
      <div class="card">
        <span class="kicker">review</span>
        <h3>A second pair of eyes</h3>
        <p>A separate read-only reviewer checks every fix. Critical or high findings block it.</p>
      </div>
      <div class="card">
        <span class="kicker">test plans</span>
        <h3>Test runs, too</h3>
        <p>Run a test plan by hand or with an agent, and file a defect straight from a failed step.</p>
      </div>
      <div class="card">
        <span class="kicker">your agent</span>
        <h3>The agent you already use</h3>
        <p>Claude Code or Grok, signed in on your own machine. Defect Drainer never holds your agent's login.</p>
      </div>
    </div>
  </div>
</section>

<section class="band" id="agent" aria-labelledby="agent-title">
  <div class="wrap">
    <h2 id="agent-title">What the agent can and can't do</h2>
    <div class="grid two">
      <div class="card">
        <h3>Can</h3>
        <ul class="plain">
          <li>Change code in a job branch{#if f.WORKER_LIVE}, on your worker{/if}</li>
          <li>Run your check commands</li>
          <li>Propose a fix for you to review</li>
        </ul>
      </div>
      <div class="card">
        <h3>Can't</h3>
        <ul class="plain">
          <li>Merge anything</li>
          <li>Push before you click Create PR</li>
          <li>See your other apps' secrets or Defect Drainer's own settings</li>
          <li>Read test-account passwords from Defect Drainer: it never stores them</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="how-it-works" aria-labelledby="how-title">
  <div class="wrap">
    <h2 id="how-title">How it works</h2>
    <ol class="steps">
      {#each steps as step (step.title)}
        <li class="card">
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      {/each}
    </ol>
  </div>
</section>

{#if f.OSS_RELEASE}
  <section class="band" aria-labelledby="oss-title">
    <div class="wrap">
      <h2 id="oss-title">The worker is open source</h2>
      <p class="section-lede">
        The worker that runs on your machine is open source under Apache-2.0. Read exactly what it does with your
        code and what it sends to Defect Drainer, and build it yourself if you prefer.
      </p>
      <pre class="code"><code>git clone {WORKER_REPO_URL}
cd defect-drainer-worker
go build ./cmd/dd-worker</code></pre>
      <p><a class="tap" href={WORKER_REPO_URL}>The worker on GitHub</a></p>
    </div>
  </section>
{/if}

<section aria-labelledby="start-title">
  <div class="wrap start">
    <h2 id="start-title">Get started</h2>
    <p>Defect Drainer is invite-only during early access. Ask for an invite, or sign in if you have one.</p>
    <p class="email"><a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a></p>
    <a class="button" href={SIGN_IN_URL}>Sign in</a>
  </div>
</section>

<style>
  section {
    padding: 56px 0;
  }
  .band {
    background: var(--bg-soft);
  }
  h1 {
    margin: 0 0 16px;
    font-size: clamp(2.1rem, 7vw, 3.6rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  h2 {
    margin: 0 0 20px;
    font-size: clamp(1.5rem, 4.5vw, 2.1rem);
    line-height: 1.2;
  }
  h3 {
    margin: 0 0 8px;
    font-size: 1.1rem;
    line-height: 1.3;
  }
  p {
    margin: 0 0 12px;
  }
  code {
    font-family: var(--mono);
    font-size: 0.88em;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  .hero {
    padding: 72px 0 56px;
  }
  .lede {
    max-width: 44rem;
    color: var(--muted);
    font-size: 1.15rem;
  }
  .section-lede {
    max-width: 44rem;
    color: var(--muted);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 24px 0 12px;
  }
  .note {
    color: var(--muted);
    font-size: 0.95rem;
  }
  .loop {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: loop;
  }
  .loop li {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--card);
    font-size: 0.95rem;
  }
  .loop li span:not(.step-name) {
    color: var(--muted);
  }
  .loop code {
    margin-top: auto;
    color: var(--brand-text);
  }
  .step-name {
    color: var(--brand-text);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .step-name::before {
    counter-increment: loop;
    content: counter(loop) '. ';
  }
  @media (max-width: 860px) {
    .loop {
      grid-template-columns: 1fr;
    }
  }
  .example {
    margin: 0;
    max-width: 760px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--card);
    overflow: hidden;
  }
  .example figcaption {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-soft);
    font-size: 0.9rem;
  }
  .defect {
    padding: 16px;
    border-bottom: 1px solid var(--border);
  }
  .defect p {
    margin: 0;
    color: var(--muted);
  }
  .tag,
  .kicker {
    display: inline-block;
    margin-bottom: 6px;
    color: var(--brand-text);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .gates {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .gates li {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 0.95rem;
  }
  .ok {
    flex: none;
    color: var(--ok);
    font-weight: 600;
  }
  .branch {
    margin: 0;
    padding: 12px 16px;
    color: var(--muted);
    font-size: 0.9rem;
  }
  .grid {
    display: grid;
    gap: 16px;
  }
  .grid.three {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid.two {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 860px) {
    .grid.three,
    .grid.two {
      grid-template-columns: 1fr;
    }
  }
  .card {
    padding: 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--card);
  }
  .card p {
    margin: 0;
    color: var(--muted);
  }
  .card.highlight {
    border: 2px solid var(--brand);
  }
  .plain {
    margin: 0;
    padding-left: 1.2em;
  }
  .plain li + li {
    margin-top: 4px;
  }
  .steps {
    display: grid;
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: step;
  }
  .steps li h3::before {
    counter-increment: step;
    content: counter(step) '. ';
    color: var(--brand-text);
  }
  .code {
    max-width: 44rem;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--code-bg);
    overflow-x: auto;
    white-space: pre;
    overflow-wrap: normal;
  }
  .start {
    text-align: center;
  }
  .email {
    font-size: 1.2rem;
    font-weight: 600;
    user-select: all;
  }
  .email a,
  .tap {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
</style>
