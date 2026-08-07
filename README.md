# www

The product page for [www.texttile.blog](https://www.texttile.blog).

One HTML file and the stylesheets it borrows from the app. No build step and no
framework: GitHub Pages serves the files as they lie here.

| Path | What it is |
|---|---|
| `index.html` | the page |
| `assets/css/base.css` | the app's element defaults: prose, inputs, focus ring, hairlines |
| `assets/css/theme-*.css` | the five themes, one file of tokens each |
| `assets/css/theme-front.css` | six tokens the app has no use for: a band, a hero wash, a measure, a gutter |
| `assets/css/front.css` | what the app does not have: header, hero, bands, the two lists, the mockup |
| `assets/js/front-boot.js` | picks the theme and draws the tab icon from the live tokens |
| `assets/js/analytics.js` | PostHog: the page view, every click, the sections read, the scroll depth |
| `assets/img/texttile-mark.svg` | the mark, and the favicon before the script runs |

## Where it points

- Source: [texttile-blog/texttile](https://github.com/texttile-blog/texttile)
- Demo blog: [demo.texttile.blog](https://demo.texttile.blog)
- Hosting: the "Or let us run it" button is a mailto link to <klaus@texttile.blog>.
  The page is static, so there is nothing to receive a form.

## Look at it

Open `index.html` from disk, or serve the folder:

```sh
python3 -m http.server 8000
```

`?theme=iris|paper|signal|darkroom` swaps the look, because a theme here is the
same one file of tokens it is in the app. Without the parameter the page is
elixir.

## The design comes from the app

Everything under `assets/` is a copy of what
[texttile-blog/texttile](https://github.com/texttile-blog/texttile) ships, so the
product page and the product are one design system and not two that look alike.
When the app's look moves, copy the files across again.

## What is counted

PostHog (EU host). Three layers:

- **Autocapture**, which PostHog does by itself: page view, page leave, and
  every click with the element it hit.
- **`cta_click`**, one event for every link and button, with the `data-track`
  name of the ones that matter (`hero_source`, `hosting_mail`, `run_demo` and
  so on), plus the section it sits in and whether the target is outbound.
- **Reading**: `section_viewed` per section, `scroll_depth` at 25/50/75/100,
  and `docker_command_copied` when somebody copies the `docker run` line.

The theme rides on every event as a registered property, so a `?theme=` visit
can be told apart afterwards.

To add a name to a new link, put `data-track="the_name"` on it. Nothing else
has to change; the click listener sits on the document.

## Deploy

Push to `main`. GitHub Pages publishes the branch root at `www.texttile.blog`.
The `www` name is a CNAME to `texttile-blog.github.io`; the apex carries no record.
