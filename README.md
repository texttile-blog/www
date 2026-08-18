# www

The product page for [www.texttile.blog](https://www.texttile.blog).

One HTML file and the stylesheets it borrows from the app. No build step and no
framework: GitHub Pages serves the files as they lie here.

| Path | What it is |
|---|---|
| `index.html` | the page |
| `privacy.html` | what the page counts, and what happens to the demo address |
| `imprint.html` | the details of the law, and the address to reach a person |
| `assets/css/base.css` | the app's element defaults: prose, inputs, focus ring, hairlines |
| `assets/css/theme.css` | the app's theme: every colour, wash and radius, in one file of tokens |
| `assets/css/theme-front.css` | six tokens the app has no use for: a band, a hero wash, a measure, a gutter |
| `assets/css/front.css` | what the app does not have: header, hero, bands, the two lists, the mockup |
| `assets/js/front-boot.js` | draws the tab icon from the live tokens |
| `assets/js/analytics.js` | PostHog: the page view, every click, the sections read, the scroll depth |
| `assets/img/texttile-mark.svg` | the mark, and the favicon before the script runs |
| `shots/` | the product photographed: the screenshots `index.html` shows, in WebP |
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
[Warper](https://github.com/texttile-blog/warper) creates it on Fly, keeps it for
one hour and destroys it again. The script at the foot of `index.html` is the
whole client:

1. `GET /altcha/challenge`, and solve the hash puzzle with Web Crypto. It is a
   few thousand SHA-256 rounds, about a tenth of a second.
2. `POST /demo` with the address, the consent and the proof. Warper holds the
   request open while Fly starts the machine, so this takes 30 to 60 seconds.
   The page reports what is being done while it waits. Warper refuses the
   request without `contact_consent: true`, so the page always sends it. The
   checkbox states the hour the blog lives, and the line under the button says
   what the address is used for.
3. On `201`, show two links: the admin area at `<url>/admin`, where the reader
   signs in as `admin` and the first sign-in sets the password, and the blog at
   `url`. Both open in a new tab. The page sends the browser nowhere by itself.

The answers the page knows:

| Answer | What the reader sees |
|---|---|
| `201` | the hour it ends, a link to the admin area and a link to the blog, with the admin name |
| `503 at_capacity` | all demos are in use, try again in a few minutes |
| `429 rate_limited` | one demo at a time from one connection, try again in N minutes |
| `422 invalid_email` | back to the form, with the field named |
| `502` / `504` / no answer | an apology, Try again, and a link to the repository |

Two numbers must agree with Warper:

- `LIFETIME` is the copy of `demo_ttl_minutes`. It stands once in the script and
  every sentence on the page that names the hour reads it from there. When the
  setting moves to 24 hours, change those two words.
- `TIMEOUT_MS` is 75 seconds and must stay above Warper's
  `request_timeout_seconds` (60), so that the server's own reason arrives before
  the browser gives up.

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
