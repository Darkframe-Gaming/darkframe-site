# darkframegaming.com

Official website of the Darkframe game studio. Fully static — no build step; everything (fonts included) is served from this repository.

## Structure

```
index.html                       Home (hero / game index / studio / process / contact)
games/celestia.html              Game page — Celestia
games/darkroom-exposure.html     Game page — Darkroom Exposure
games/golden-dome.html           Game page — Golden Dome
games/monster-munch.html         Game page — Monster Munch
terms.html                       Terms of use
privacy.html                     Privacy policy
responsible-play.html            Responsible play
404.html                         Custom 404 page
CNAME                            GitHub Pages custom-domain record (darkframegaming.com)
css/site.css                     Full design system
js/site.js                       Scroll reveals + card tilt effects
assets/                          Optimized images (webp) + self-hosted fonts (woff2)
```

The home page lists the games compactly — thumbnail, hook, three feature tags, RTP / max win /
grid, and two buttons (**PLAY** → Stake, **DETAILS** → the game page). The long-form description,
feature breakdown and full specification table live on each game page.

Pages inside `games/` reference shared files with `../` (`../css/site.css`, `../assets/…`).

## Deploying to GitHub Pages

```bash
cd darkframe-site
git init -b main
git add -A
git commit -m "Darkframe studio site"
# Create an EMPTY repo on GitHub (e.g. darkframe/darkframegaming.com), then:
git remote add origin git@github.com:USERNAME/REPO.git
git push -u origin main
```

On GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save.**

Because the CNAME file is in the repo, the "Custom domain" field will automatically read
`darkframegaming.com`. After a few minutes, tick **Enforce HTTPS** (it activates once the
certificate is issued).

## DNS settings (at your domain registrar)

Four **A records** for the apex (darkframegaming.com):

```
A  @  185.199.108.153
A  @  185.199.109.153
A  @  185.199.110.153
A  @  185.199.111.153
```

One **CNAME record** for `www` (so www redirects to the apex):

```
CNAME  www  USERNAME.github.io.
```

DNS propagation takes anywhere from 5 minutes to 24 hours.
Check with: `dig darkframegaming.com +noall +answer`

## Email

The site lists `contact@darkframegaming.com` as the contact address. Enable free
**email forwarding** in your registrar's panel and point that address at your own inbox
(most registrars have an Email Forwarding tab). If you prefer a different address,
update the `mailto:` links in `index.html` and the legal pages.

## Updating

Edit a file → commit → push. Pages republishes within a minute or two.

### Cache busting — required whenever css/site.css or js/site.js changes

GitHub Pages serves static assets with `cache-control: max-age=14400` (4 hours) and Cloudflare
caches them on top of that. HTML gets a much shorter TTL. So after a deploy the **new HTML can
be served against the old stylesheet** — which renders the site broken until the cache expires.
This is exactly what happened on 2026-08-07.

The fix is the `?v=` token on every stylesheet and script link. Bump it in the same commit that
touches the CSS or JS:

```bash
V=$(date +%Y%m%d)   # or a serial number if you ship twice in one day
for f in index.html 404.html terms.html privacy.html responsible-play.html games/*.html; do
  perl -pi -e "s{(href=\"[^\"]*css/site\.css)(\?v=[0-9]+)?\"}{\$1?v=$V\"}g;
               s{(src=\"[^\"]*js/site\.js)(\?v=[0-9]+)?\"}{\$1?v=$V\"}g" "$f"
done
grep -ho 'site\.\(css\|js\)?v=[0-9]*' index.html 404.html terms.html privacy.html \
  responsible-play.html games/*.html | sort | uniq -c   # expect 9 css + 5 js, one version
```

Verify after the Pages build reports `built`:

```bash
curl -sI "https://darkframegaming.com/css/site.css?v=$V" | grep -i last-modified
```

## Stake links

Every PLAY button on the site points at the **studio profile**:

```
https://stake.bet/casino/group/darkframe
```

The `/tr/` locale prefix is deliberately omitted — the site is English, and Stake resolves the
visitor's own locale from the un-prefixed path.

Per-game deep links do not exist yet. When the individual `stake.bet` URLs for each game are
final, replace the group URL in that game's own page (`games/<slug>.html`) and in its row on
`index.html`; leave the nav, hero and footer buttons pointing at the group page.

Per game there are 2 links worth swapping to a deep link — the hero PLAY button on the game page
and the PLAY button on that game's index row. The nav, footer and bottom-CTA buttons should stay
on the group page. (Current totals: 4 per game page, 8 on the index.)

```bash
grep -c "casino/group/darkframe" index.html games/*.html
```

## Game facts

The numbers on each game page (grid, RTP, max win, spin counts, multiplier values) are taken
from the live math configs in `math-sdk/games/<id>/game_config.py`. If a config changes, the
game page is the thing to re-check — `celestia`, `darkroom`, `strike` (Golden Dome) and
`monster` (Monster Munch).
