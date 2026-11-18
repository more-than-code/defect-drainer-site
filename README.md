# Landing site (`defectdrainer.com`)

Static landing site, spec `docs/hosting-and-landing.md` §4.4. SvelteKit 2 with
`adapter-static`, `prerender = true` and `csr = false`: the output in `build/` is
plain HTML and CSS with no client JavaScript. `scripts/postbuild.mjs` deletes the
client bundles SvelteKit still emits (they would carry gated wording) and writes
`build/_redirects`.

## Build

From the repo root: `make site` (install, `pnpm check`, `pnpm build`, `pnpm test`).
Or in `site/`: `pnpm install --frozen-lockfile && pnpm build`.

## Gate flags

Build-time environment variables, each `0` (default) or `1`; anything else fails
the build. A gated claim is absent from the HTML and `llms.txt` while its flag is off.

| Flag | Turns on | Set to 1 when |
|---|---|---|
| `WORKER_LIVE` | "on your worker" wording; How it works "Add a worker" | the worker (W3) is live in prod |
| `GITHUB_LIVE` | How it works "Sign in and connect GitHub" | the GitHub App (R4a) is live in prod |
| `OSS_RELEASE` | the "The worker is open source" section | the first non-prerelease worker release is out |
| `LAUNCH` | the launch `_redirects` (console paths only, 301) | launch day; needs the other two live flags and approved legal text |

Without `LAUNCH`, `_redirects` sends every path to `https://console.defectdrainer.com/:splat`
with a 302 (pre-launch, H9).

## Privacy and Terms

`/privacy` and `/terms` are built only from Joe-approved HTML fragments at
`src/content/privacy.html` and `src/content/terms.html`. Until both exist, neither
page is built or linked, and `LAUNCH=1` fails.

## Guards (`pnpm test`)

`tests/guards.test.mjs` builds three variants into `.test-out/` (all flags off,
gates on, launch with placeholder legal fixtures) and checks every file: the
forbidden-names list, "open source" only about the worker, no `®`, no `<script>`
or `.js`, no URL outside our hosts and the public worker repo, gated wording, the
two `_redirects` versions, and the legal-page rules.

## Release

CI (`.github/workflows/site.yml`) runs check, build and test; it never deploys.
Ops uploads `site/build` to Cloudflare Pages with Wrangler, on Joe's yes.

## OG image

`static/og.png` (1200×630) is rendered from `og/og.html`; the command is in that
file's header comment.
