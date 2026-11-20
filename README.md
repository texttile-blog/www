# www

The product page for [www.texttile.blog](https://www.texttile.blog).

Static HTML files and the stylesheets they borrow from the app. No build step
and no framework: bunny.net stores and serves the files as they are.

| Path | What it is |
|---|---|
| `index.html` | the page |
| `privacy.html` | what the page stores and what it counts |
| `imprint.html` | the details of the law, and the address to reach a person |
| `press.html` | the press kit as a page: the words, the mark and the pictures, each a file to take |
| `press/` | what the press page hands out, and the whole of it once more as `texttile-press-kit.zip` |
| `bunny.jsonc` | the Bunny site name and deployment directory |
| `.github/workflows/bunny-sites.yml` | publishes the website after a push to `main` |
| `Makefile` | opens the page locally or copies public files into `.site/` |
| `assets/css/base.css` | the app's element defaults: prose, inputs, focus ring, hairlines |
| `assets/css/theme.css` | the app's theme: every colour, wash and radius, in one file of tokens |
| `assets/css/theme-front.css` | six tokens the app has no use for: a band, a hero wash, a measure, a gutter |
| `assets/css/front.css` | what the app does not have: header and its menu for a narrow window, hero, bands, the feature groups, the picture rows, the packages table, the mockup |
| `assets/js/front-boot.js` | draws the tab icon from the live tokens |
| `assets/js/analytics.js` | PostHog: the page view, every click, the sections read, the scroll depth |
| `assets/img/texttile-mark.svg` | the mark, and the favicon before the script runs |
| `assets/img/social-card.png` | the 1200 x 630 picture a link to the page shows on LinkedIn, Mastodon and the like: the mark, the words and the two screens |
| `shots/` | the product photographed: the screenshots `index.html` shows, in WebP |
| `videos/writing.mp4` | the product filmed: two browsers, one entry, one takes the text over. 1080 x 1080, 27 seconds, no sound, H.264 |
| `videos/writing.webp` | the first frame of that video, shown until it plays |
| `videos/*.mov` | the screen recordings the video is cut from. Not in the repository; `ffmpeg -i writing.mov -an -vf scale=1080:1080,fps=30 -c:v libx264 -crf 27 -preset slow -movflags +faststart writing.mp4` |
| `design/screenshots.sketch` | the Sketch file the screenshots are cropped from. Export to PNG, then `cwebp -q 80 -m 6 -sharp_yuv` |

## Where it points

- Source: [texttile-blog/texttile](https://github.com/texttile-blog/texttile)
- Demo blog: [demo.texttile.blog](https://demo.texttile.blog)
- Privacy: `privacy.html`, in the same stylesheets. It has to stay true to
  `assets/js/analytics.js`, so change it with that file.
- Imprint: `imprint.html`, in the same stylesheets. Name, address, mail, the
  person who answers for the content, and the two paragraphs the law asks for.
- Hosting: "Or let me run it" is the section `#hosting`, a table of four
  packages and two things that cost once. Every button is a mailto link to <klaus@texttile.blog>. The page is
  static, so there is nothing to receive a form.

## The press kit

`press.html` hands out four kinds of files, all under `press/`:

- `press/press.txt`: the name, the two descriptions, the facts and the rules,
  as plain text.
- `press/mark/`: the mark with the ink fixed for a light and for a dark ground,
  as SVG and as PNG at 1024 px. The adaptive original stays
  `assets/img/texttile-mark.svg`. The PNGs come from
  `rsvg-convert -w 1024 -h 1024`.
- `press/shots/`: the nine screenshots as original PNG files, plus
  `writing-pair.png`. This file stacks and labels the two writing screenshots,
  so one picture shows both sides of the same minute. Its WebP preview sits next
  to it, made with the same `cwebp` line as the files in `shots/`.
- `press/texttile-press-kit.zip`: all of the above in one folder named
  `texttile-press-kit`. There is no build step, so after changing a file under
  `press/`, zip that folder layout again and commit the zip with it.

## Look at it

Open `index.html` from disk, or serve the folder:

```sh
python3 -m http.server 8000
```

The app ships one theme, so the page wears that one. There is nothing to
switch.

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
  name of the ones that matter (`hero_run`, `hosting_mail`, `run_demo` and
  so on), plus the section it sits in and whether the target is outbound.
- **Reading**: `section_viewed` per section, `scroll_depth` at 25/50/75/100,
  and `docker_command_copied` when somebody copies the `docker run` line, by
  hand or with the Copy button.

`persistence: 'memory'` keeps the id in the tab, so the page writes no cookie
and no local storage and needs no consent banner. A reload is therefore a new
anonymous person: read "unique visitors" as "visits". Clicks, sections and
scroll marks happen inside one visit and are unaffected.

To add a name to a new link, put `data-track="the_name"` on it. Nothing else
has to change; the click listener sits on the document.

## Deploy

After a merge to `main`, GitHub Actions copies the public files and deploys them
to the Bunny site `texttile-www`. The workflow uses the repository secret
`BUNNYNET_API_KEY`. `make site` copies the four HTML pages, `assets/`, `shots/`,
`press/`, and the published video and poster into `.site/`. It does not compile
anything. Repository files, the Sketch file, and raw videos are not deployed.

After each successful deployment, the workflow deletes old deployments and
keeps the three most recent versions. Bunny always preserves the live version
and the previous version, even if a rollback places them outside those three.

The storage zone is in Germany. Bunny CDN serves the files at
`www.texttile.blog`. Cloudflare provides DNS only: `www` is an unproxied CNAME
to `sites-texttile-www-va5gga.b-cdn.net`. Bunny provides the HTTPS certificate.

To deploy manually from a checkout that is ready to publish:

```sh
make site
bunny sites deploy .site --site texttile-www --no-link
```

To restore the previous deployment:

```sh
bunny sites deployments publish --previous --site texttile-www --force
```
