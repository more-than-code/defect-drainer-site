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
      <p class="eyebrow">A defect harness, not just a tracker</p>
      <h1>Report it anywhere.<br />Fix it with any agent.<br />Ship only what's proven.</h1>
      <p class="lede">
        Testers, customers and agents file bugs with screenshots. A coding agent fixes each one in its own branch:
        ours, or yours over MCP. Defect Drainer re-runs your checks and has an independent reviewer look at every fix
        before a pull request opens.
      </p>
      <div class="actions">
        <a class="button" href={SIGN_IN_URL}>Sign in</a>
        <a class="button secondary" href="#how-it-works">How it works</a>
      </div>
      <p class="note">{f.WORKER_LIVE ? EARLY_ACCESS_NOTE : EARLY_ACCESS_NOTE_PRE_WORKER}</p>
    </div>
    <figure class="hero-art">
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
      <figcaption class="illustrative">Illustrative interface. One defect from a made-up shop app, after the agent's run.</figcaption>
    </figure>
  </div>
</section>

<section class="band" aria-labelledby="loop-title">
  <div class="wrap">
    <h2 id="loop-title" class="visually-hidden">The loop</h2>
    <ol class="loop">
      <li>
        <span class="step-icon"><Icon name="report" /></span>
        <span class="step-name">Report</span>
        <strong>A bug with a screenshot</strong>
        <span>From the console, an agent over MCP, or the intake API.</span>
        <code>DEF-0142</code>
      </li>
      <li>
        <span class="step-icon"><Icon name="inventory" /></span>
        <span class="step-name">Inventory</span>
        <strong>One record per bug</strong>
        <span>Per project, with evidence, severity and status.</span>
        <code>open · high</code>
      </li>
      <li>
        <span class="step-icon"><Icon name="fix" /></span>
        <span class="step-name">Fix</span>
        <strong>Your agent, a fresh branch</strong>
        <span>In an isolated git worktree{#if f.WORKER_LIVE}&nbsp;on your own worker{/if}.</span>
        <code>BATCH-0031</code>
      </li>
      <li>
        <span class="step-icon"><Icon name="prove" /></span>
        <span class="step-name">Prove</span>
        <strong>Checks and review</strong>
        <span>Your check commands re-run, plus an independent reviewer.</span>
        <code>✓ verified</code>
      </li>
      <li>
        <span class="step-icon"><Icon name="ship" /></span>
        <span class="step-name">Ship</span>
        <strong>A PR you approve</strong>
        <span>Nothing is pushed until you click Create PR.</span>
        <code>PR #87</code>
      </li>
    </ol>
  </div>
</section>

<section aria-labelledby="get-title">
  <div class="wrap">
    <h2 id="get-title">What you get</h2>
    <div class="feature">
      <div class="feature-text">
        <span class="num">01</span>
        <h3>Report from anywhere</h3>
        <p class="feature-lede">Everyone who sees the bug can file it, with or without GitHub.</p>
        <ul class="ticks">
          <li><Icon name="check" size={16} /><span>Testers and customers you invite report with a Google sign-in. No GitHub access needed.</span></li>
          <li><Icon name="check" size={16} /><span>Your app or tools file through the intake API, with an intake-only token and up to 12 screenshots.</span></li>
          <li><Icon name="check" size={16} /><span>File a defect straight from a failed step of a test run, by hand or by an agent.</span></li>
          <li><Icon name="check" size={16} /><span>One inventory per project, with evidence, severity and status.</span></li>
        </ul>
      </div>
      <div class="feature-art">
        <div class="window">
          <div class="window-bar" aria-hidden="true"><i></i><i></i><i></i><span>Inventory · acme-shop</span></div>
          <ul class="rows">
            <li><span class="row-icon"><Icon name="camera" size={18} /></span><span class="row-text"><strong>Cart total shows NaN after removing the last coupon</strong><small>DEF-0142 · 1 screenshot · from the console</small></span><span class="pill high">high</span></li>
            <li><span class="row-icon"><Icon name="inbox" size={18} /></span><span class="row-text"><strong>Checkout button hidden behind the keyboard</strong><small>DEF-0139 · 2 screenshots · from the intake API</small></span><span class="pill">claimed</span></li>
            <li><span class="row-icon"><Icon name="plan" size={18} /></span><span class="row-text"><strong>Search ignores accented letters</strong><small>DEF-0131 · from a failed test-run step</small></span><span class="pill ok-pill">verified</span></li>
            <li><span class="row-icon"><Icon name="agent" size={18} /></span><span class="row-text"><strong>Order email shows the wrong currency</strong><small>DEF-0128 · filed by an agent over MCP</small></span><span class="pill">open</span></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="feature flip">
      <div class="feature-text">
        <span class="num">02</span>
        <h3>Any agent, one work log</h3>
        <p class="feature-lede">Our harness or your own agent. The same record either way.</p>
        <ul class="ticks">
          <li><Icon name="check" size={16} /><span>Claude Code or Grok run by Defect Drainer, many defects in one batch, each in its own git worktree.</span></li>
          <li><Icon name="check" size={16} /><span>Or your own agent over MCP: it claims a defect, posts progress, attaches evidence and submits its branch.</span></li>
          <li><Icon name="check" size={16} /><span>A claim keeps other agents off the defect, and lapses after 4 idle hours.</span></li>
          <li><Icon name="check" size={16} /><span>Defect Drainer never holds your agent's login.</span></li>
        </ul>
      </div>
      <div class="feature-art">
        <div class="window">
          <div class="window-bar" aria-hidden="true"><i></i><i></i><i></i><span>Your agent · MCP</span></div>
          <ol class="chat-log">
            <li class="you"><span class="who">You</span><p>Fix DEF-0142 in acme-shop.</p></li>
            <li><span class="who">Agent</span><p><code>claim_defect</code> DEF-0142 · claimed, other sessions are refused</p></li>
            <li><span class="who">Agent</span><p><code>report_progress</code> “Reproduced: the total is NaN once the coupon list is empty.”</p></li>
            <li><span class="who">Agent</span><p><code>attach_evidence</code> after.png · <code>submit_fix</code> branch <code>fix/def-0142</code></p></li>
            <li class="dd"><span class="who">Defect Drainer</span><p>Re-ran your checks and the reviewer on that commit. <strong>Verified.</strong></p></li>
          </ol>
        </div>
      </div>
    </div>
    <div class="feature">
      <div class="feature-text">
        <span class="num">03</span>
        <h3>Proof you don't have to trust</h3>
        <p class="feature-lede">A fix counts only when Defect Drainer has checked it itself.</p>
        <ul class="ticks">
          <li><Icon name="check" size={16} /><span>Your own check commands, re-run by Defect Drainer on the exact commit.</span></li>
          <li><Icon name="check" size={16} /><span>A separate read-only reviewer. A critical or high finding blocks the fix.</span></li>
          <li><Icon name="check" size={16} /><span>An after-fix screenshot, or "no visual change" with a reason.</span></li>
          <li><Icon name="check" size={16} /><span>Not proven? It stays open with the reason. Your agent gets the same rules as ours.</span></li>
        </ul>
      </div>
      <div class="feature-art">
        <div class="window">
          <div class="window-bar" aria-hidden="true"><i></i><i></i><i></i><span>DEF-0139 · verdict</span></div>
          <div class="verdict">
            <span class="verdict-icon"><Icon name="x" size={22} /></span>
            <div>
              <strong>Not verified</strong>
              <p><code>pnpm test</code> failed on the submitted commit: 2 failing. The defect stays open with the reason, and the agent can push again and ask for a new check.</p>
            </div>
          </div>
          <ul class="checks">
            <li><Icon name="check" size={16} /> Baseline recorded before the change</li>
            <li class="bad"><Icon name="x" size={16} /> Your check commands, re-run by Defect Drainer</li>
            <li class="wait"><Icon name="review" size={16} /> Independent review, after the checks pass</li>
            <li class="wait"><Icon name="camera" size={16} /> Fix evidence, or no visual change with a reason</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="feature flip">
      <div class="feature-text">
        <span class="num">04</span>
        <h3>You ship it</h3>
        <p class="feature-lede">Nothing reaches your repository until you say so.</p>
        <ul class="ticks">
          <li><Icon name="check" size={16} /><span>Each verified fix waits on its branch until you click Create PR.</span></li>
          <li><Icon name="check" size={16} /><span>Merge the pull request in your repository as usual.</span></li>
          <li><Icon name="check" size={16} /><span>Defect Drainer resolves the defect only when it can see on GitHub that the merged pull request is that fix.</span></li>
        </ul>
      </div>
      <div class="feature-art">
        <div class="window">
          <div class="window-bar" aria-hidden="true"><i></i><i></i><i></i><span>BATCH-0031 · ready</span></div>
          <div class="ship">
            <p class="ship-branch"><Icon name="ship" size={18} /> <code>defect-drainer/BATCH-0031</code> · 3 files · not pushed yet</p>
            <div class="ship-actions"><span class="fake-button">Create PR</span><span class="muted">You review the diff first.</span></div>
            <ol class="timeline">
              <li><Icon name="ship" size={16} /> PR #87 opened in your repository</li>
              <li><Icon name="merge" size={16} /> You merge it, as usual</li>
              <li><Icon name="check" size={16} /> Defect Drainer checks the merge on GitHub and resolves DEF-0142</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="band" id="github" aria-labelledby="github-title">
  <div class="wrap">
    <h2 id="github-title">Already on GitHub Issues? Keep it.</h2>
    <p class="section-lede">
      GitHub Issues records what's broken. Defect Drainer gets it fixed and proves it. It works next to your tracker,
      and every fix still lands as a normal pull request in your repository.
    </p>
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
  </div>
</section>

<section id="agent" aria-labelledby="agent-title">
  <div class="wrap">
    <h2 id="agent-title">What the agent can and can't do</h2>
    <div class="grid two">
      <div class="card">
        <h3>Can</h3>
        <ul class="marks">
          <li><span class="yes"><Icon name="check" size={18} /></span><span>Change code in a job branch{#if f.WORKER_LIVE}, on your worker{/if}</span></li>
          <li><span class="yes"><Icon name="check" size={18} /></span><span>Run your check commands</span></li>
          <li><span class="yes"><Icon name="check" size={18} /></span><span>Propose a fix for you to review</span></li>
        </ul>
      </div>
      <div class="card">
        <h3>Can't</h3>
        <ul class="marks">
          <li><span class="no"><Icon name="x" size={18} /></span><span>Merge anything</span></li>
          <li><span class="no"><Icon name="x" size={18} /></span><span>Push before you click Create PR</span></li>
          <li><span class="no"><Icon name="x" size={18} /></span><span>See your other projects' secrets or Defect Drainer's own settings</span></li>
          <li><span class="no"><Icon name="x" size={18} /></span><span>Read test-account passwords from Defect Drainer: it never stores them</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="band" id="how-it-works" aria-labelledby="how-title">
  <div class="wrap">
    <h2 id="how-title">How it works</h2>
    <div class="how-grid">
    <ol class="steps">
      {#each steps as step (step.title)}
        <li class="card">
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      {/each}
    </ol>
    <div class="ring"><LoopRing /></div>
    </div>
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
      <h2 id="start-title">Drain your first defect</h2>
      <p>Defect Drainer is invite-only during early access. Ask for an invite, or sign in if you have one.</p>
      <a class="button" href={SIGN_IN_URL}>Sign in</a>
      <p class="email"><a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a></p>
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
    margin: 0;
    width: 100%;
  }
  .hero-art .illustrative {
    margin-top: 10px;
    text-align: center;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
  }
  @media (max-width: 860px) {
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }
  .step-icon {
    display: flex;
  }
  .illustrative {
    color: var(--muted);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .chat-log {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 16px;
    list-style: none;
  }
  .chat-log li {
    padding: 10px 12px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--muted) 8%, transparent);
    font-size: 0.92rem;
  }
  .chat-log li.you {
    background: color-mix(in srgb, var(--brand) 12%, transparent);
  }
  .chat-log li.dd {
    border: 1px solid color-mix(in srgb, var(--brand) 40%, transparent);
    background: color-mix(in srgb, var(--brand) 6%, transparent);
  }
  .chat-log p {
    margin: 2px 0 0;
  }
  .who {
    color: var(--muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .marks {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .marks li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .yes {
    color: var(--brand-text);
  }
  .no {
    color: var(--muted);
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
  .grid {
    display: grid;
    gap: 16px;
  }
  .grid.two {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 860px) {
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
  .eyebrow {
    margin: 0 0 14px;
    color: var(--brand-text);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
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
  .feature {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 48px;
    align-items: center;
    padding: 36px 0;
  }
  .feature.flip .feature-text {
    order: 2;
  }
  @media (max-width: 860px) {
    .feature {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 24px 0;
    }
    .feature.flip .feature-text {
      order: 0;
    }
  }
  .num {
    display: block;
    margin-bottom: 8px;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 0.85rem;
  }
  .feature h3 {
    font-size: 1.45rem;
    letter-spacing: -0.01em;
  }
  .feature-lede {
    color: var(--muted);
  }
  .ticks,
  .checks,
  .timeline {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .ticks li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .ticks :global(.icon) {
    margin-top: 4px;
    color: var(--brand-text);
  }
  .rows {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 12px;
    list-style: none;
  }
  .rows li {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .row-icon {
    display: inline-flex;
    padding: 7px;
    border-radius: 8px;
    color: var(--brand-text);
    background: color-mix(in srgb, var(--brand) 12%, transparent);
  }
  .row-text {
    flex: 1;
    min-width: 0;
    font-size: 0.9rem;
  }
  .row-text strong,
  .row-text small {
    display: block;
  }
  .row-text small {
    color: var(--muted);
    font-size: 0.78rem;
  }
  .pill {
    flex: none;
    padding: 2px 9px;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--muted);
    font-size: 0.75rem;
  }
  .pill.high {
    border-color: color-mix(in srgb, var(--danger) 45%, transparent);
    color: var(--danger);
  }
  .pill.ok-pill {
    border-color: color-mix(in srgb, var(--brand) 45%, transparent);
    color: var(--brand-text);
  }
  .verdict {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid var(--border);
  }
  .verdict p {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 0.9rem;
  }
  .verdict-icon,
  .checks .bad {
    color: var(--danger);
  }
  .checks,
  .timeline {
    padding: 14px 16px;
    font-size: 0.9rem;
  }
  .checks li,
  .timeline li {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .checks li {
    color: var(--brand-text);
  }
  .checks li.wait {
    color: var(--muted);
  }
  .ship {
    padding: 16px;
  }
  .ship-branch {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    font-size: 0.9rem;
  }
  .ship-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
    font-size: 0.85rem;
  }
  .fake-button {
    padding: 7px 14px;
    border-radius: 8px;
    color: #fff;
    background: var(--brand);
    font-weight: 600;
  }
  .muted {
    color: var(--muted);
  }
  .ship .timeline {
    padding: 14px 0 0;
  }
  .timeline :global(.icon) {
    color: var(--brand-text);
  }
  .how-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 40px;
    align-items: center;
  }
  .ring {
    max-width: 420px;
    justify-self: center;
    width: 100%;
  }
  @media (max-width: 860px) {
    .how-grid {
      grid-template-columns: 1fr;
    }
    .ring {
      max-width: 340px;
    }
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
</style>
