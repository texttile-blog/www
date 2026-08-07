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

## Deploy

Push to `main`. GitHub Pages publishes the branch root at `www.texttile.blog`.
The `www` name is a CNAME to `texttile-blog.github.io`; the apex carries no record.
