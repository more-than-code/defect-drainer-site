# defect-drainer-site: notes for coding agents

The static landing site for defectdrainer.com. Read `README.md` first.

- Every claim on the page must match what Defect Drainer does today on the
  control plane's `dev` branch. Check the code before writing a claim; mark
  planned work as planned, or leave it out.
- Gated wording (worker, GitHub App, open source) stays behind its build
  flag. `pnpm test` enforces it.
- No client JavaScript, no third-party URLs, no real customer, project or
  infrastructure names (`tests/guards.test.mjs`).
- Work on a branch and open a PR into `main`. Merging into `main` publishes
  the site, so a merge needs Joe's OK.
- Gates before you push: `pnpm check && pnpm build && pnpm test`.
