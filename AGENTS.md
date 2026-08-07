# AGENTS.md

Only deviations from default behavior. This repository is the product page for
texttile.blog: one HTML file and the stylesheets it borrows from the app.

## Git and GitHub

- Branches, commits, and PR texts in English. No co-author trailers, no
  "Generated with" lines, no mention of the tool that wrote the commit.
- Never merge; merging is the user's decision.

## Writing style

- All English prose output (PR descriptions, commit bodies, docs, READMEs, UI
  copy) follows the `/ste-writing` skill: strict mode for procedures and error
  messages, STE-flavored mode for everything else. Never use em dashes.

## The page

- No build step and no framework. GitHub Pages serves the files as they lie in
  the branch root. Keep it that way.
- Everything under `assets/` is a copy of what `texttile-blog/texttile` ships.
  Do not restyle it here; when the app's look moves, copy the files across
  again, so the product page and the product stay one design system.
- The page is static, so it has no form to receive. The hosting section is a
  mailto link to klaus@texttile.blog instead.
- A link worth counting gets `data-track="<name>"`. The click listener in
  `assets/js/analytics.js` sits on the document and needs nothing else.
- Cloudflare rewrites every mailto on this domain into a `/cdn-cgi/l/email-
  protection` URL. `analytics.js` reads it back before it reports, so do not
  report a raw href from anywhere else.
