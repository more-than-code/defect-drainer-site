<!--
  Defect Drainer's loop as a ring: Report, Start, Fix, Prove, Ship, Learn.
  Adapted from the DD inner-ring visual (project files
  dd-assets/marketing/visuals/loop-ring-inner.html, Joe 2026-11-22: "Keep DD's
  ring", "mostly inner loop"). Pure SVG and CSS: a highlight walks the steps
  and a dot travels the track. Both stop under prefers-reduced-motion.
-->
<svg
  class="ring"
  viewBox="60 60 680 680"
  role="img"
  aria-label="Defect Drainer's loop, clockwise: Report, Start, Fix, Prove, Ship, Learn, then back to Report. A dashed path goes from Prove back to Fix: a fix that isn't proven is held, with the reason."
>
  <defs>
    <marker id="ring-ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 10 5 0 10Z" class="ah" />
    </marker>
  </defs>
  <circle class="track" cx="400" cy="400" r="334" />
  <g class="runner"><circle cx="400" cy="66" r="9" /></g>
  <circle class="core" cx="400" cy="400" r="196" />

  <g class="seg s1">
    <path d="M250.6 126.1A312 312 0 0 1 549.4 126.1L497.7 220.9A204 204 0 0 0 302.3 220.9Z" />
    <text class="num" x="400" y="118">01</text><text class="name" x="400" y="146">Report</text>
    <text class="sub" x="400" y="170">people, apps, agents</text>
  </g>
  <g class="seg s2">
    <path d="M562.6 133.7A312 312 0 0 1 711.9 392.4L603.9 395.0A204 204 0 0 0 506.3 225.9Z" />
    <text class="num" x="623.4" y="247">02</text><text class="name" x="623.4" y="275">Start</text>
    <text class="sub" x="623.4" y="299">ours or yours</text>
  </g>
  <g class="seg s3">
    <path d="M711.9 407.6A312 312 0 0 1 562.6 666.3L506.3 574.1A204 204 0 0 0 603.9 405.0Z" />
    <text class="num" x="623.4" y="505">03</text><text class="name" x="623.4" y="533">Fix</text>
    <text class="sub" x="623.4" y="557">own branch</text>
  </g>
  <g class="seg s4 key">
    <path d="M549.4 673.9A312 312 0 0 1 250.6 673.9L302.3 579.1A204 204 0 0 0 497.7 579.1Z" />
    <text class="num" x="400" y="634">04</text><text class="name" x="400" y="662">Prove</text>
    <text class="sub" x="400" y="686">checks, review, evidence</text>
  </g>
  <g class="seg s5">
    <path d="M237.4 666.3A312 312 0 0 1 88.1 407.6L196.1 405.0A204 204 0 0 0 293.7 574.1Z" />
    <text class="num" x="176.6" y="505">05</text><text class="name" x="176.6" y="533">Ship</text>
    <text class="sub" x="176.6" y="557">a pull request</text>
  </g>
  <g class="seg s6">
    <path d="M88.1 392.4A312 312 0 0 1 237.4 133.7L293.7 225.9A204 204 0 0 0 196.1 395.0Z" />
    <text class="num" x="176.6" y="247">06</text><text class="name" x="176.6" y="275">Learn</text>
    <text class="sub" x="176.6" y="299">gaps filed</text>
  </g>

  <path class="held" d="M425.3 580.2A182 182 0 0 0 543.4 512.1" marker-end="url(#ring-ah)" />
  <text class="held-t" x="478" y="522" text-anchor="end">Not proven?</text>
  <text class="held-t" x="478" y="540" text-anchor="end">Held, with the reason.</text>

  <g transform="translate(368 300) scale(1)">
    <rect width="64" height="64" rx="14" fill="#0F6E56" />
    <path d="M32 11C32 11 17 28 17 38.5a15 15 0 0 0 30 0C47 28 32 11 32 11Z" fill="#fff" />
    <path d="M24.5 39l5.5 5.5 10-11" fill="none" stroke="#0F6E56" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <text class="core-t" x="400" y="410">One list.</text>
  <text class="core-t" x="400" y="442">Proof before done.</text>
  <text class="core-s" x="400" y="474">Your agent or ours,</text>
  <text class="core-s" x="400" y="496">the same checks.</text>
</svg>

<style>
  .ring {
    --on-seg: #ffffff;
    display: block;
    width: 100%;
    height: auto;
    font-family: var(--font);
  }
  /* One colour per stage, cool to warm around the loop. All carry white
     text at 5:1 or better; Prove keeps the darkest brand green. */
  .s1 {
    --seg: #2b5fa3;
  }
  .s2 {
    --seg: #1d6f8f;
  }
  .s3 {
    --seg: #0e7268;
  }
  .s4 {
    --seg: #0a513f;
  }
  .s5 {
    --seg: #2f7a33;
  }
  .s6 {
    --seg: #8a5a0c;
  }
  .track {
    fill: none;
    stroke: var(--border);
    stroke-width: 1.5;
  }
  .core {
    fill: var(--card);
    stroke: var(--border);
    stroke-width: 1.5;
  }
  .seg path {
    fill: var(--seg);
  }
  .seg text {
    fill: var(--on-seg);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .num {
    font-family: var(--mono);
    font-size: 12px;
    opacity: 0.75;
    letter-spacing: 0.06em;
  }
  .name {
    font-size: 24px;
    font-weight: 700;
  }
  .sub {
    font-size: 14px;
    opacity: 0.92;
  }
  .held {
    fill: none;
    stroke: var(--brand);
    stroke-width: 2.5;
    stroke-dasharray: 6 6;
  }
  .ah {
    fill: var(--brand);
  }
  .held-t {
    fill: var(--brand-text);
    font-size: 14px;
    font-weight: 600;
  }
  .core-t {
    fill: var(--text);
    font-size: 27px;
    font-weight: 700;
    text-anchor: middle;
  }
  .core-s {
    fill: var(--muted);
    font-size: 15px;
    text-anchor: middle;
  }
  .runner {
    fill: var(--brand);
    transform-origin: 400px 400px;
  }
  @media (prefers-reduced-motion: no-preference) {
    .runner {
      animation: ring-spin 12s linear infinite;
    }
    .seg path {
      animation: ring-step 12s ease-in-out infinite;
    }
    .s2 path {
      animation-delay: 2s;
    }
    .s3 path {
      animation-delay: 4s;
    }
    .s4 path {
      animation-delay: 6s;
    }
    .s5 path {
      animation-delay: 8s;
    }
    .s6 path {
      animation-delay: 10s;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .runner {
      display: none;
    }
  }
  @keyframes ring-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes ring-step {
    0%,
    20%,
    100% {
      filter: none;
    }
    6%,
    14% {
      filter: brightness(1.25) saturate(1.1);
    }
  }
</style>
