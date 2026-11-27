<script>
  // Every claim maps to shipped behaviour (brief Appendix A). Gated wording is
  // behind a build flag and absent from the HTML while the flag is off:
  //   WORKER_LIVE  "on your worker" wording, How it works "Add a worker"
  //   GITHUB_LIVE  How it works "connect GitHub"
  //   OSS_RELEASE  the Open source section
  import {
    DESCRIPTION,
    EARLY_ACCESS_NOTE,
    EARLY_ACCESS_NOTE_PRE_WORKER,
    SIGN_IN_URL,
    SITE_ORIGIN,
    SUPPORT_EMAIL,
    TITLE,
    WORKER_REPO_URL,
  } from '$lib/site.js';
  import Icon from '$lib/components/Icon.svelte';
  import LoopRing from '$lib/components/LoopRing.svelte';

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

  // DD vs GitHub (lh0w). DD facts are checked against the control plane's dev
  // branch on 2026-11-27; GitHub facts against GitHub's own docs. No URLs:
  // the guards allow only our hosts. Columns: Defect Drainer, GitHub Issues
  // (with issue forms and Projects), the Copilot coding agent (with Actions).
  /** @type {{ topic: string, dd: string, issues: string, agent: string }[]} */
  const compare = $derived(
    [
      {
        topic: 'Who can report on a private repo',
        dd: 'Anyone you invite to your organisation, signed in with Google. No GitHub account and no access to the repository.',
        issues: 'Only people with read access to the repository, which also lets them read the code. Issue forms shape a report but don\'t widen who can file one.',
        agent: 'Works from issues that are already filed.',
      },
      {
        topic: 'Reports from your app and tools',
        dd: 'An intake API with a token that can only file defects, up to 12 screenshots each. A retry with the same key never files twice.',
        issues: 'The REST API, with a token that has access to the repository.',
        agent: '-',
      },
      {
        topic: 'Who fixes it',
        dd: 'Your coding agent: Claude Code or Grok run by Defect Drainer, or any agent that connects over MCP and claims the defect.',
        issues: 'The person you assign.',
        agent: 'The coding agent you assign the issue to.',
      },
      {
        topic: 'Where the code is checked out',
        dd: 'On a machine you own, through the Defect Drainer worker: a seccomp filter and per-job CPU and memory limits around each job. An MCP agent works in its own checkout.',
        issues: 'Wherever the person works.',
        agent: 'In a GitHub Actions environment, on GitHub\'s runners unless you set up your own.',
      },
      {
        topic: 'Many agents on one backlog',
        dd: 'A claim gives one holder per defect, at most 5 open claims each, and lapses after 4 hours without progress. Progress notes go on the defect\'s timeline.',
        issues: 'Assignees and comments. Nothing stops two people or agents working the same issue.',
        agent: 'One agent session and pull request per assigned issue.',
      },
      {
        topic: 'Proof of the fix',
        dd: 'An after-fix screenshot from this claim, or a stated reason when nothing is visible. Your check commands re-run, and an independent reviewer\'s critical or high finding blocks it.',
        issues: 'Whatever someone attaches to a comment.',
        agent: 'The agent can run your tests. You review its pull request.',
      },
      {
        topic: 'What closes it',
        dd: 'Defect Drainer resolves a defect once it checks on GitHub that the merged pull request is the claim\'s fix. Closing without proof is allowed and recorded as unproven.',
        issues: 'Anyone with triage access, or a merged pull request that says "Fixes #123".',
        agent: 'Merging its pull request closes the issue, as with any pull request.',
      },
      {
        topic: 'Where the fix lands',
        dd: 'A normal GitHub pull request. A fix Defect Drainer runs is pushed only when you click Create PR.',
        issues: 'A pull request.',
        agent: 'A pull request opened by the agent.',
      },
      f.OSS_RELEASE && {
        topic: 'Code you can read',
        dd: 'The worker is open source (Apache-2.0). Read what it does and build it yourself.',
        issues: 'A hosted service.',
        agent: 'A hosted service.',
      },
    ].filter((r) => !!r),
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
  <div class="wrap hero-grid">
    <div>
      <h1>Your bug backlog, fixed by agents and proven before you review.</h1>
      <p class="lede">
        Anyone can report a bug. A coding agent fixes it. Defect Drainer checks the fix itself, so your team only
        reviews fixes that already pass.
      </p>
      <div class="actions">
        <a class="button" href={SIGN_IN_URL}>Sign in</a>
        <a class="button secondary" href="#action">See it in action</a>
      </div>
      <p class="note">{f.WORKER_LIVE ? EARLY_ACCESS_NOTE : EARLY_ACCESS_NOTE_PRE_WORKER}</p>
    </div>
    <div class="hero-art"><LoopRing /></div>
  </div>
</section>

<section class="band" aria-labelledby="value-title">
  <div class="wrap">
    <h2 id="value-title">Less time on bugs, more on your product</h2>
    <div class="values">
      <article class="value">
        <div class="mini" aria-hidden="true">
          <div class="mini-col">
            <span class="chip"><Icon name="people" size={16} /> Tester</span>
            <span class="chip"><Icon name="inbox" size={16} /> Your app</span>
            <span class="chip"><Icon name="agent" size={16} /> Agent</span>
          </div>
          <span class="arrow"></span>
          <span class="chip strong"><Icon name="inventory" size={16} /> One list</span>
        </div>
        <h3>Bugs from anyone</h3>
        <p>Testers and customers report without GitHub access. Your app and agents file bugs too.</p>
      </article>
      <article class="value">
        <div class="mini" aria-hidden="true">
          <div class="mini-col">
            <span class="chip"><Icon name="agent" size={16} /> Our agent</span>
            <span class="chip"><Icon name="plug" size={16} /> Your agent</span>
          </div>
          <span class="arrow"></span>
          <span class="chip strong"><Icon name="fix" size={16} /> Fix branch</span>
        </div>
        <h3>Fixing is the agent's job</h3>
        <p>Our coding agent or yours takes each bug in its own branch. No two agents work the same bug.</p>
      </article>
      <article class="value">
        <div class="mini" aria-hidden="true">
          <div class="mini-col">
            <span class="chip ok"><Icon name="check" size={16} /> Your checks</span>
            <span class="chip ok"><Icon name="check" size={16} /> Reviewer</span>
            <span class="chip ok"><Icon name="check" size={16} /> Evidence</span>
          </div>
          <span class="arrow"></span>
          <span class="chip strong"><Icon name="ship" size={16} /> Your PR</span>
        </div>
        <h3>You review only proven fixes</h3>
        <p>Defect Drainer re-runs your checks and an independent reviewer. A fix that fails is held, with the reason.</p>
      </article>
    </div>
  </div>
</section>

<section id="action" aria-labelledby="action-title">
  <div class="wrap example-grid">
    <div>
      <h2 id="action-title">See it in action</h2>
      <p class="section-lede">One bug in a made-up shop app, from report to merge.</p>
      <ol class="walk">
        <li><span class="walk-icon"><Icon name="camera" size={18} /></span><span><strong>A tester reports it</strong> with a screenshot: the cart total shows NaN.</span></li>
        <li><span class="walk-icon"><Icon name="fix" size={18} /></span><span><strong>An agent fixes it</strong> in its own branch.</span></li>
        <li><span class="walk-icon"><Icon name="prove" size={18} /></span><span><strong>Defect Drainer proves it:</strong> your checks re-run, a separate reviewer, an after-fix screenshot.</span></li>
        <li><span class="walk-icon"><Icon name="ship" size={18} /></span><span><strong>You open the pull request</strong> and merge it. The bug closes.</span></li>
      </ol>
    </div>
    <figure class="example-art">
      <div class="window example">
        <div class="window-bar" aria-hidden="true"><i></i><i></i><i></i><span>BATCH-0031 · acme-shop</span></div>
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
      </div>
      <figcaption class="illustrative">Illustrative interface, made-up shop app.</figcaption>
    </figure>
  </div>
</section>

<section class="band" id="cases" aria-labelledby="cases-title">
  <div class="wrap">
    <h2 id="cases-title">Use cases</h2>
    <div class="cases">
      <article class="case">
        <span class="case-icon"><Icon name="people" /></span>
        <h3>QA finds it, an agent fixes it</h3>
        <p>Your testers file what they see, in plain words, with screenshots. Pick a batch, and each verified fix waits for you as a branch ready for a pull request.</p>
      </article>
      <article class="case">
        <span class="case-icon"><Icon name="agent" /></span>
        <h3>Your own agent works the backlog</h3>
        <p>Connect Claude Code or any MCP agent. It claims a bug, fixes it and submits its branch. Its fix passes the same checks as ours.</p>
      </article>
      <article class="case">
        <span class="case-icon"><Icon name="inbox" /></span>
        <h3>Feedback from your live app</h3>
        <p>Your app sends user reports and screenshots to the intake API. They land in the same list, ready to fix.</p>
      </article>
    </div>
  </div>
</section>

<section id="how-it-works" aria-labelledby="how-title">
  <div class="wrap">
    <h2 id="how-title">How it's built</h2>
    <div class="parts">
      <article class="part">
        <span class="case-icon"><Icon name="inventory" /></span>
        <h3>Console</h3>
        <p>The bug list for each project, batches, test plans and review. Sign in with Google.</p>
      </article>
      <article class="part">
        <span class="case-icon"><Icon name="plug" /></span>
        <h3>MCP server</h3>
        <p>Any agent can report, claim, post progress, attach evidence and submit a fix.</p>
      </article>
      <article class="part">
        <span class="case-icon"><Icon name="server" /></span>
        <h3>Worker</h3>
        <p>{#if f.WORKER_LIVE}Runs the coding agent on your own worker, in a sandbox with per-job limits.{:else}Runs the coding agent in a sandbox on a machine you own. Arrives with its first release.{/if}</p>
      </article>
      <article class="part">
        <span class="case-icon"><Icon name="prove" /></span>
        <h3>Verification</h3>
        <p>Your check commands, an independent reviewer and fix evidence, run by Defect Drainer itself.</p>
      </article>
    </div>
    <p class="limits"><Icon name="claim" size={18} /> Defect Drainer's agent can't merge, and nothing is pushed until you click Create PR. Test-account passwords are never stored.</p>
  </div>
</section>

<section class="band" id="github" aria-labelledby="github-title">
  <div class="wrap">
    <h2 id="github-title">Keep GitHub Issues. Add the fixing.</h2>
    <ul class="gh-points">
      <li><Icon name="people" /><span><strong>Reporters don't need the repo.</strong> Invite testers and customers with a Google sign-in.</span></li>
      <li><Icon name="claim" /><span><strong>Many agents, no collisions.</strong> One claim per bug, visible to everyone.</span></li>
      <li><Icon name="merge" /><span><strong>Closed means fixed.</strong> A bug closes only when its proven fix is merged.</span></li>
    </ul>
    <details class="more">
      <summary>Full comparison with GitHub Issues and the Copilot coding agent</summary>
    <div class="compare-scroll">
      <table class="compare">
        <caption class="visually-hidden">Defect Drainer compared with GitHub Issues and the Copilot coding agent</caption>
        <thead>
          <tr>
            <th scope="col"><span class="visually-hidden">Topic</span></th>
            <th scope="col" class="dd-col">Defect Drainer</th>
            <th scope="col">GitHub Issues, issue forms, Projects</th>
            <th scope="col">Copilot coding agent, Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each compare as row (row.topic)}
            <tr>
              <th scope="row">{row.topic}</th>
              <td class="dd-col" data-label="Defect Drainer">{row.dd}</td>
              <td data-label="GitHub Issues">{row.issues}</td>
              <td data-label="Copilot coding agent">{row.agent}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p class="note">
      <strong>Planned, not built yet:</strong> two-way sync with GitHub Issues, so your issues and Defect Drainer's
      defects stay in step. GitHub facts as of November 2026, from GitHub's documentation.
    </p>
    </details>
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
  <div class="wrap">
    <div class="cta">
      <h2 id="start-title">Drain your first bug</h2>
      <ol class="start-steps">
        {#each steps as step (step.title)}
          <li><strong>{step.title}.</strong> {step.text}</li>
        {/each}
      </ol>
      <a class="button" href={SIGN_IN_URL}>Sign in</a>
      <p class="email">Ask for an invite: <a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a></p>
    </div>
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
    padding: 56px 0 40px;
  }
  .hero h1 {
    font-size: clamp(2rem, 4.2vw, 2.9rem);
    line-height: 1.12;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 40px;
    align-items: center;
  }
  .hero-art {
    width: 100%;
    max-width: 440px;
    justify-self: center;
  }
  @media (max-width: 860px) {
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
  .illustrative {
    color: var(--muted);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
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
  .example {
    font-size: 0.92rem;
  }
  .defect {
    padding: 16px;
    border-bottom: 1px solid var(--border);
  }
  .defect p {
    margin: 0;
    color: var(--muted);
  }
  .tag {
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
  .compare-scroll {
    margin: 8px 0 16px;
  }
  .compare {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--card);
    font-size: 0.93rem;
    overflow: hidden;
  }
  .compare th,
  .compare td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
  }
  .compare tbody tr:last-child th,
  .compare tbody tr:last-child td {
    border-bottom: 0;
  }
  .compare thead th {
    background: var(--bg-soft);
    font-size: 0.85rem;
  }
  .compare tbody th {
    width: 16%;
    font-weight: 600;
  }
  .compare td {
    color: var(--muted);
  }
  .compare .dd-col {
    width: 32%;
    color: var(--text);
    background: color-mix(in srgb, var(--brand) 8%, var(--card));
  }
  .compare thead .dd-col {
    color: var(--brand-text);
    background: color-mix(in srgb, var(--brand) 14%, var(--card));
  }
  @media (max-width: 760px) {
    .compare thead {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }
    .compare,
    .compare tbody,
    .compare tr,
    .compare th,
    .compare td {
      display: block;
      width: auto;
    }
    .compare tbody tr {
      border-bottom: 1px solid var(--border);
    }
    .compare tbody tr:last-child {
      border-bottom: 0;
    }
    .compare tbody th {
      width: auto;
      padding-bottom: 4px;
      border-bottom: 0;
      font-size: 1rem;
    }
    .compare td {
      padding-top: 8px;
      padding-bottom: 8px;
      border-bottom: 0;
    }
    .compare td::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 2px;
      color: var(--brand-text);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .compare td:not(.dd-col)::before {
      color: var(--muted);
    }
    .compare .dd-col {
      width: auto;
      margin: 0 10px;
      border-radius: 8px;
    }
    .compare tbody tr > :last-child {
      padding-bottom: 16px;
    }
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
  .window {
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--card);
    box-shadow: 0 18px 40px -24px rgb(10 40 30 / 0.35);
    overflow: hidden;
  }
  .window-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 12px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-soft);
    color: var(--muted);
    font-size: 0.78rem;
  }
  .window-bar i {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--border);
  }
  .window-bar span {
    margin-left: 8px;
  }
  .cta {
    padding: 48px 24px;
    border-radius: 18px;
    background: var(--bg-soft);
    text-align: center;
  }
  .cta p {
    color: var(--muted);
  }
  .cta .email {
    margin-top: 16px;
    font-size: 1rem;
  }
  .values,
  .cases,
  .parts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .parts {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 960px) {
    .parts {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 760px) {
    .values,
    .cases,
    .parts {
      grid-template-columns: 1fr;
    }
  }
  .value,
  .case,
  .part {
    padding: 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--card);
  }
  .value p,
  .case p,
  .part p {
    margin: 0;
    color: var(--muted);
  }
  .mini {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 132px;
    margin-bottom: 16px;
    padding: 14px;
    border-radius: 10px;
    background: var(--bg-soft);
  }
  .mini-col {
    display: grid;
    gap: 6px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--card);
    font-size: 0.82rem;
    white-space: nowrap;
  }
  .chip.ok {
    color: var(--brand-text);
  }
  .chip.strong {
    border-color: var(--brand);
    color: var(--bg);
    background: var(--brand);
    font-weight: 600;
  }
  .arrow {
    flex: 1;
    min-width: 18px;
    height: 2px;
    background: var(--brand);
    position: relative;
  }
  .arrow::after {
    content: '';
    position: absolute;
    right: -1px;
    top: -4px;
    border: 5px solid transparent;
    border-left: 7px solid var(--brand);
    border-right: 0;
  }
  .example-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: 40px;
    align-items: center;
  }
  @media (max-width: 860px) {
    .example-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
  .example-art {
    margin: 0;
  }
  .example-art .illustrative {
    display: block;
    margin-top: 10px;
    text-align: center;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
  }
  .walk {
    display: grid;
    gap: 14px;
    margin: 20px 0 0;
    padding: 0;
    list-style: none;
  }
  .walk li,
  .gh-points li {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .walk-icon,
  .case-icon {
    display: inline-flex;
    flex: none;
    padding: 8px;
    border-radius: 10px;
    color: var(--brand-text);
    background: color-mix(in srgb, var(--brand) 12%, transparent);
  }
  .case-icon {
    margin-bottom: 12px;
  }
  .limits {
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 20px 0 0;
    color: var(--muted);
    font-size: 0.95rem;
  }
  .gh-points {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 0 0 20px;
    padding: 0;
    list-style: none;
  }
  .gh-points :global(.icon) {
    margin-top: 2px;
    color: var(--brand-text);
  }
  @media (max-width: 760px) {
    .gh-points {
      grid-template-columns: 1fr;
    }
  }
  .more summary {
    cursor: pointer;
    color: var(--brand-text);
    font-weight: 600;
  }
  .more[open] summary {
    margin-bottom: 12px;
  }
  .start-steps {
    max-width: 36rem;
    margin: 0 auto 20px;
    padding-left: 1.2em;
    color: var(--muted);
    text-align: left;
  }
</style>
