# Landing site (`defectdrainer.com`)

Static landing site. Spec: `docs/hosting-and-landing.md` §4.4 in the control-plane repo
(this site lived in its `site/` folder until 2026-11-27). SvelteKit 2 with
`adapter-static`, `prerender = true` and `csr = false`: the output in `build/` is
plain HTML and CSS with no client JavaScript. `scripts/postbuild.mjs` deletes the
client bundles SvelteKit still emits (they would carry gated wording). There is
no `_redirects`: the apex serves only the site, and the console lives on
`console.defectdrainer.com`, reached by the Sign in button (spec H9 as amended
2026-11-19).

## Build

Node 22 and pnpm 11 (`packageManager` in `package.json`):

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build      # writes build/
pnpm test       # the guards below
```

`pnpm dev` serves it on port 8898.

## Gate flags

Build-time environment variables, each `0` (default) or `1`; anything else fails
the build. A gated claim is absent from the HTML and `llms.txt` while its flag is off.

| Flag | Turns on | Set to 1 when |
|---|---|---|
| `WORKER_LIVE` | "on your worker" wording; How it works "Add a worker"; the short early-access line (while off, the hero and `llms.txt` say the worker arrives with its first release) | the worker (W3) is live in prod |
| `GITHUB_LIVE` | How it works "Sign in and connect GitHub" | the GitHub App (R4a) is live in prod |
| `OSS_RELEASE` | the "The worker is open source" section | the first non-prerelease worker release is out |
| `LAUNCH` | nothing in the output; it is the launch-readiness check (H8) | launch day; the build fails unless the other two live flags are on and approved legal text exists |

## Privacy and Terms

`/privacy` and `/terms` are built from the HTML fragments
`src/content/privacy.html` and `src/content/terms.html`. A missing file's page is
not built or linked, and `LAUNCH=1` fails. Blanks Joe still has to fill in are
marked `<mark data-draft>`: previews show them highlighted, and the production
build (`CF_PAGES_BRANCH=main`) and `LAUNCH=1` fail while any is left
(`src/content/README.md`).

## Guards (`pnpm test`)

`tests/guards.test.mjs` builds three variants into `.test-out/` (all flags off,
gates on, launch with placeholder legal fixtures) and checks every file: the
forbidden-names list, "open source" only about the worker, no `®`, no `<script>`
or `.js`, no URL outside our hosts and the public worker repo, gated wording, no
`_redirects` in any build, and the legal-page rules.

## Release (Cloudflare Pages)

Cloudflare Pages builds this repo itself through its GitHub integration:
merging into `main` publishes the site, and pushes to the agents' PR branches
(`claude/*`, `byoa/*`) get a preview URL. Preview URLs are public to anyone who
has the link. Pages keeps every deployment, so a rollback is "promote
the previous deployment" in the Pages dashboard.

| Pages setting | Value |
|---|---|
| Project name | `defectdrainer-site` (the older direct-upload project `defect-drainer-site` holds the name) |
| Preview branches | Custom: include `claude/*`, `byoa/*` |
| Production branch | `main` |
| Framework preset | None |
| Build command | `npx -y pnpm@11.1.3 install --frozen-lockfile && npx -y pnpm@11.1.3 build` |
| Build output directory | `build` |
| Root directory | (empty, the repo root) |
| Environment variables | `NODE_VERSION=22`, `SKIP_DEPENDENCY_INSTALL=1`; gate flags (above) only when each is approved |
| Custom domain | `defectdrainer.com` |

CI (`.github/workflows/ci.yml`) runs check, build and the guards on every push
and pull request. It never deploys.

## OG image

`static/og.png` (1200×630) is rendered from `og/og.html`; the command is in that
file's header comment.
