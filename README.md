# www

The product page for [www.texttile.blog](https://www.texttile.blog).

One HTML file and the stylesheets it borrows from the app. No build step and no
framework: GitHub Pages serves the files as they lie here.

| Path | What it is |
|---|---|
| `index.html` | the page |
| `privacy.html` | what the page counts, and what happens to the demo address |
| `imprint.html` | the details of the law, and the address to reach a person |
| `press.html` | the press kit as a page: the words, the mark and the pictures, each a file to take |
| `press/` | what the press page hands out, and the whole of it once more as `texttile-press-kit.zip` |
| `assets/css/base.css` | the app's element defaults: prose, inputs, focus ring, hairlines |
| `assets/css/theme.css` | the app's theme: every colour, wash and radius, in one file of tokens |
| `assets/css/theme-front.css` | six tokens the app has no use for: a band, a hero wash, a measure, a gutter |
| `assets/css/front.css` | what the app does not have: header, hero, bands, the two lists, the mockup |
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
- A demo of your own: the "Try it" section calls Warper at
  `https://warper.texttile.blog`. See below.
- Privacy: `privacy.html`, in the same stylesheets. It has to stay true to
  `assets/js/analytics.js` and to the demo client, so change it with them.
- Imprint: `imprint.html`, in the same stylesheets. Name, address, mail, the
  person who answers for the content, and the two paragraphs the law asks for.
- Hosting: the "Or let us run it" button is a mailto link to <klaus@texttile.blog>.
  The page is static, so there is nothing to receive a form.

## The one thing the page does

"Try it with a blog of your own" starts a real Texttile for the reader.
[Warper](https://github.com/texttile-blog/warper) creates it on Fly, runs it for
24 hours, stops it and deletes it 30 days later. The script at the foot of
`index.html` is the whole client:

1. `GET /altcha/challenge`, and solve the hash puzzle with Web Crypto. It is a
   few thousand SHA-256 rounds, about a tenth of a second.
2. `POST /demo` with the address, the consent and the proof. Warper holds the
   request open while Fly starts the machine, so this takes 30 to 60 seconds.
   The page reports what is being done while it waits. Warper refuses the
   request without `contact_consent: true`, so the page always sends it. The
   checkbox states the 24 hours the blog runs and the 30 days before it is
   deleted, and the line under the button says what the address is used for.
3. On `201`, ask the reader to check their mail, and show one link: the blog at
   `url`, in a new tab. Warper hands the address to the new Texttile as its
   first admin address, and the blog mails the one-time link that sets the
   password. The account is not open yet, the address is the sign-in name, and
   the page has no second door to offer. The page sends the browser nowhere by
   itself.

The answers the page knows:

| Answer | What the reader sees |
|---|---|
| `201` | check your mail, the address the link went to, the day and hour it stops, a link to the blog |
| `503 at_capacity` | all demos are in use, try again in a few minutes |
| `429 rate_limited` | one demo at a time from one connection, try again in N minutes |
| `422 invalid_email` | back to the form, with the field named |
| `502` / `504` / no answer | an apology, Try again, and a link to the repository |

Two numbers must agree with Warper:

- `LIFETIME` is the copy of `demo_ttl_minutes`, which is 1440. It stands once in
  the script and every sentence on the page that names the lifetime reads it
  from there. The 30 days that Warper keeps a stopped demo stand in the
  sentences themselves, because nothing else on the page needs the number.
- `TIMEOUT_MS` is 75 seconds and must stay above Warper's
  `request_timeout_seconds` (60), so that the server's own reason arrives before
  the browser gives up.

## The press kit

`press.html` hands out four kinds of files, all under `press/`:

- `press/press.txt`: the name, the two descriptions, the facts and the rules,
  as plain text.
- `press/mark/`: the mark with the ink fixed for a light and for a dark ground,
  as SVG and as PNG at 1024 px. The adaptive original stays
  `assets/img/texttile-mark.svg`. The PNGs come from
  `rsvg-convert -w 1024 -h 1024`.
- `press/shots/`: the nine screenshots as the original PNGs, restored from git
  history (they left `shots/` for WebP in `8944594`), plus `writing-pair.png`:
  the two writing shots stacked and labeled, so one picture shows both sides of
  the same minute. Its WebP preview sits next to it, made with the same `cwebp`
  line as the ones in `shots/`.
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

The "Try it" section is the one part that a local copy cannot do: Warper answers
only requests from `https://www.texttile.blog`, so from `localhost` or from a
file the browser is refused. Test it on the deployed page, or against a local
Warper with `allowed_origin` set to the address you serve from.

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
  name of the ones that matter (`hero_try`, `hosting_mail`, `run_demo` and
  so on), plus the section it sits in and whether the target is outbound.
- **Reading**: `section_viewed` per section, `scroll_depth` at 25/50/75/100,
  and `docker_command_copied` when somebody copies the `docker run` line.
- **The demo**, from the script in the page: `demo_requested` on the click,
  then one of `demo_created`, `demo_at_capacity`, `demo_rate_limited` or
  `demo_failed` with the reason. It is the one funnel the page has, so the
  outcome is counted where it happens and not by the click alone.

`persistence: 'memory'` keeps the id in the tab, so the page writes no cookie
and no local storage and needs no consent banner. A reload is therefore a new
anonymous person: read "unique visitors" as "visits". Clicks, sections and
scroll marks happen inside one visit and are unaffected.

To add a name to a new link, put `data-track="the_name"` on it. Nothing else
has to change; the click listener sits on the document.

## Deploy

Push to `main`. GitHub Pages publishes the branch root at `www.texttile.blog`.
The `www` name is a CNAME to `texttile-blog.github.io`; the apex carries no record.
