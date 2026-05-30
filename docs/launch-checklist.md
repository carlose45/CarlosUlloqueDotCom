# Launch Checklist

Run this checklist before making the site public. Each section has a
dependency — do not skip ahead.

## 1. Production build

```sh
npm ci
npm run build
```

- [ ] Build exits with 0 errors
- [ ] Page count matches expected (`dist/` — currently 19 pages + assets)
- [ ] `dist/sitemap-index.xml` exists
- [ ] `dist/rss.xml` exists and is valid XML

## 2. SEO

- [ ] `/` has `<title>Carlos Ulloque | Mission Critical Engineer</title>`
- [ ] Every page has `<meta name="description">` (no empty values)
- [ ] Every page has `<link rel="canonical" href="https://ulloque.com/...">` with correct absolute URL
- [ ] `/cv` has `<meta name="robots" content="noindex,nofollow">`
- [ ] `/cv` is absent from `sitemap-0.xml`
- [ ] `robots.txt` contains `Disallow: /cv` and points to sitemap
- [ ] JSON-LD on homepage: `Person` and `BreadcrumbList`
- [ ] JSON-LD on note detail pages: `BlogPosting` and `BreadcrumbList`

```sh
# Quick canonical check
grep -r 'rel="canonical"' dist/ | head -5
# Verify /cv is not in sitemap
grep "cv" dist/sitemap-0.xml && echo "FAIL: cv in sitemap" || echo "OK: cv absent"
```

## 3. Privacy

- [ ] No phone numbers in `dist/`
- [ ] No physical addresses in `dist/`
- [ ] No personal IDs or document references in `dist/`
- [ ] No private employer or client names in `dist/`
- [ ] No API keys, tokens, or credentials in `dist/` or source
- [ ] `/cv` contains no actual CV data
- [ ] `/.well-known/security.txt` is accessible
- [ ] `/privacy` page is accessible

```sh
# Scan build output for potential personal data
grep -ri "password\|secret\|token\|api_key\|phone\|telephone" dist/ --include="*.html"
```

## 4. Accessibility

- [ ] Skip-to-content link is present in `<body>` before `<header>`
- [ ] `<html lang="en">` on every page
- [ ] `<main id="main-content">` landmark present
- [ ] All `<nav>` elements have `aria-label`
- [ ] Active nav item has `aria-current="page"`
- [ ] No missing `alt` attributes on `<img>` elements
- [ ] Keyboard navigation end-to-end (Tab through header, main, footer)

## 5. Performance

- [ ] No client-side JavaScript in page output (Astro static)
- [ ] No external CDN requests (fonts, scripts, analytics)
- [ ] No inline `style=""` attributes (use Tailwind classes)
- [ ] `theme-color` meta present
- [ ] RSS autodiscovery `<link rel="alternate">` present in head

```sh
# Check for external requests in HTML
grep -r 'src="http\|href="http' dist/ --include="*.html" | grep -v 'og:url\|canonical\|og:image\|twitter'
```

## 6. Cloudflare (pre-deployment)

- [ ] DNS A/AAAA records point to the VPS or Cloudflare Tunnel
- [ ] Cloudflare proxy is enabled (orange cloud) for `ulloque.com`
- [ ] SSL/TLS mode is set to "Full (strict)"
- [ ] Cloudflare Access application created for `ulloque.com/cv`
- [ ] `/cv` Access policy tested with an allowed email
- [ ] Cloudflare Tunnel configured OR firewall restricts origin to Cloudflare IPs only

## 7. Deployment (see `docs/deployment.md`)

- [ ] Docker image builds without errors
- [ ] Nginx serves static files correctly
- [ ] HTTP → HTTPS redirect works
- [ ] `www.ulloque.com` redirects to `ulloque.com`
- [ ] Security headers are present in HTTP response:
  - `Strict-Transport-Security`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Content-Security-Policy`

```sh
# Verify headers (replace with actual URL after deployment)
curl -sI https://ulloque.com | grep -iE "strict-transport|x-frame|x-content-type|referrer|permissions|content-security"
```

## 8. Post-launch — Google Search Console

- [ ] Property added for `https://ulloque.com`
- [ ] Ownership verified (DNS TXT record or HTML file)
- [ ] Sitemap submitted: `https://ulloque.com/sitemap-index.xml`
- [ ] URL inspection tool run on `/`, `/about`, `/notes`, one note detail page
- [ ] No coverage errors
- [ ] `Disallow: /cv` confirmed in robots.txt report

## 9. Launch blockers

If any of the following are unresolved, do not launch:

- [ ] `/cv` Cloudflare Access gate is working
- [ ] Origin is not reachable directly (Tunnel or firewall in place)
- [ ] No sensitive personal data in `dist/`
- [ ] Production build is passing CI

---

*Last updated: 2026-05-30. Cross-reference: `docs/qa.md`, `docs/privacy-security.md`, `docs/cv-access.md`.*
