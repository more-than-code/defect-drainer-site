# Legal text

`privacy.html` and `terms.html` are the HTML fragments behind `/privacy` and
`/terms`. While a file is missing its page is not built, and a `LAUNCH=1` build
fails (docs/hosting-and-landing.md §4.4 in the control-plane repo).

A blank Joe still has to fill in is marked `<mark data-draft>…</mark>`. Preview
and CI builds render drafts, highlighted, so they can be read; the production
build (Cloudflare Pages on `main`, `CF_PAGES_BRANCH=main`) and a `LAUNCH=1`
build fail while any `data-draft` is left. Only Joe approves the final wording.
