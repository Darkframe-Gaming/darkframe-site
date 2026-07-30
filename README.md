# darkframegaming.com

Official website of the Darkframe game studio. Fully static — no build step; everything (fonts included) is served from this repository.

## Structure

```
index.html            Main page (single page: games / studio / process / contact)
terms.html            Terms of use
privacy.html          Privacy policy
responsible-play.html Responsible play
404.html              Custom 404 page
CNAME                 GitHub Pages custom-domain record (darkframegaming.com)
css/site.css          Full design system
js/site.js            Scroll reveals + card tilt effects
assets/               Optimized images (webp) + self-hosted fonts (woff2)
```

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

## Game links

Game cards currently show a "LIVE ON STAKE" badge with no clickable play link.
Once the stake.com URLs for the games are final, a "PLAY" button can be added to each card.
