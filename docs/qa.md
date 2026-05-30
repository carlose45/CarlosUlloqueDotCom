# QA and Lighthouse Checklist

## Targets

| Category        | Target | Notes                          |
| --------------- | ------ | ------------------------------ |
| Performance     | 95+    | Static Astro, no client JS     |
| SEO             | 100    | Metadata, canonical, JSON-LD   |
| Accessibility   | 95+    | Semantic HTML, WCAG 2.1 AA     |
| Best Practices  | 100    | HTTPS, no mixed content        |

## Accessibility

- [x] Skip to content link in BaseLayout (`#main-content`)
- [x] `<html lang="en">` on every page
- [x] `<main id="main-content">` landmark
- [x] `<header>`, `<footer>`, `<nav>`, `<article>`, `<aside>` landmarks used
- [x] `aria-label` on all `<nav>` elements
- [x] `aria-current="page"` on active nav items
- [x] `aria-label` on `<aside>` (TerminalPanel)
- [x] `aria-label` on TagList `<ul>`
- [x] `aria-hidden="true"` on decorative elements
- [x] `:focus-visible` ring on all interactive elements
- [x] Color contrast: `ink-text` (#e6edf3) on `ink` (#05070a) → ~18:1
- [x] Color contrast: `ink-muted` (#94a3b8) on `ink` (#05070a) → ~8.4:1
- [x] Color contrast: `signal` (#2dd4bf) on `ink` (#05070a) → ~11.2:1
- [x] `prefers-reduced-motion` disables transitions and animations
- [x] Core content usable without JavaScript

## Performance

- [x] No client-side JavaScript (Astro static output)
- [x] No external font CDN requests (system font fallbacks)
- [x] `theme-color` meta for mobile browsers
- [x] RSS autodiscovery `<link rel="alternate">` in head
- [x] `text-rendering: optimizeLegibility` on `:root`
- [x] `font-synthesis: none` on `:root`
- [x] `display: block` on `img` and `svg`
- [x] `max-width: 100%` on `img` and `svg`
- [x] No layout shifts from fonts (system fonts, no FOUT)

## SEO

- [x] `<title>` with owner name suffix on every page
- [x] `<meta name="description">` on every page
- [x] `<link rel="canonical">` on every page
- [x] Open Graph tags (og:type, og:title, og:description, og:url, og:image)
- [x] Twitter card tags
- [x] `noindex,nofollow` on `/cv`
- [x] JSON-LD: `Person` on homepage and /about
- [x] JSON-LD: `BreadcrumbList` on all pages
- [x] JSON-LD: `BlogPosting` on note detail pages
- [x] Sitemap excludes `/cv`
- [x] `robots.txt` disallows `/cv`
- [x] RSS feed at `/rss.xml`

## Pre-launch checks (Issue #15)

- [ ] Run Lighthouse on homepage, /about, /uses, /notes, one note detail
- [ ] Test keyboard navigation end-to-end
- [ ] Test with screen reader (VoiceOver or NVDA)
- [ ] Verify sitemap at `/sitemap-index.xml`
- [ ] Verify RSS at `/rss.xml`
- [ ] Verify `/.well-known/security.txt`
- [ ] Verify `/robots.txt`
- [ ] Test reduced motion preference
- [ ] Test on mobile viewport (375px)
