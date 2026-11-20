# www.texttile.blog

This repository is the product page for Texttile. Three HTML files, the
stylesheets the app ships, and two small scripts. Bunny CDN serves the public
files copied by `make site`. `README.md` says what each file is. This file
holds the rules.

The product itself lives in `texttile-blog/texttile`. Read its `AGENTS.md`
before you argue about what Texttile is.

## What the page promises

- **The page and the product are one design system.** Everything under
  `assets/` is a copy of what the app ships. Never restyle it here. When the
  app's look moves, copy the files across again. New markup that only the page
  needs goes in `front.css` and its six tokens in `theme-front.css`.
- **No build step and no framework.** The reader gets the files as they are in
  the branch. Keep it that way. Tailwind runs from the browser build in the
  head, so a class works without a compile step, and nothing else is needed.
- **The page writes nothing to the browser.** PostHog runs on
  `persistence: 'memory'`: no cookie, no local storage, no consent banner. That
  is the only answer that agrees with what the page says about the product. The
  price is the visitor count, so do not read it as people. Read it as visits.
- **The page is static.** There is no server to receive a form. The hosting
  section is a mailto link to klaus@texttile.blog.

## A note from Klaus

Keep it simple, and channel YAGNI. A part is right when nothing is left to take
away. Propose a bold idea when it truly helps, and say so instead of building it
behind my back.

A question is read-only. If I ask how hard something is or whether something
should be done, answer it and offer the change. Do not start editing.

Match the ceremony to the task. This is one page. One agent in one pass beats a
panel.

My preferences in the moment beat anything written here.

## Counting

- A link worth counting gets `data-track="<name>"`. The click listener in
  `assets/js/analytics.js` sits on the document and needs nothing else.
- Cloudflare provides DNS only. Bunny serves mailto links as written, without
  email-address rewriting.

## Before you call it done

- **All three pages.** `index.html`, `privacy.html` and `imprint.html` wear the
  same stylesheets. A style change touches all three.
- **`privacy.html` stays true.** It describes what `analytics.js` counts.
  Change it in the same commit as that file.
- **`README.md` stays true.** It is the map of the files.
- **Phone and desktop.** Judge both screenshots together, phone first.
- **Look at it.** After every change, open the changed HTML file from disk in
  the browser with `open`, no webserver. The pages work as plain files.
- Avoid a CSS animation that repaints without end. The one animation on the page
  is the gallery mockup, and it stops for `prefers-reduced-motion`.

## Git and GitHub

- `main` is live. A push publishes the page. Never commit on `main`; every
  change starts on a branch.
- Follow the global worktree location and session rules.
- Branch names, commits and pull request text are English. Do not add agent co-author
  trailers. End commits with the global model and harness attribution.
- Rebase onto the latest `main` before you open a pull request.
- Open a normal pull request, never a draft: a draft gets no review bot. Title
  in plain language, body with the problem in a sentence or two and then how you
  solved it. End with the model and the harness that did the work. Describe a
  visible change in words; commit no screenshots for a pull request.
- Merge only when explicitly requested, including an explicit `full-send`, after the
  required checks and reviews pass. Follow repository protections. Merging deploys.

## Prose

- Apply the shared `ste-writing` skill to English pull request text, documentation and the copy
  on the page. Strict mode for procedures and errors, flavored mode everywhere
  else.
- Never use an em dash. Use a comma, a colon, parentheses or two sentences.
- Call each thing one name, and use the app's names: **entry**, **admin area**,
  **reader**, **admin**, **tile**, **gallery**.
- Keep it short. A sentence a reader has to read twice is a sentence to rewrite.
