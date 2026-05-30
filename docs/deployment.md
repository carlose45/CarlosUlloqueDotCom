# Deployment Guide

This document covers the steps to deploy ulloque.com to a VPS with Docker,
Nginx, and Cloudflare in front.

## Prerequisites

- VPS running Ubuntu 22.04+
- Docker and Docker Compose installed
- Cloudflare account with `ulloque.com` under management
- Completed `docs/launch-checklist.md` sections 1–5 locally

## 1. Build the production image

```sh
# From the repo root
npm ci
npm run build
docker build -t ulloque-com:latest .
```

The Dockerfile (Issue #12) copies `dist/` into an Nginx image and serves
static files. No runtime Node.js process.

## 2. Nginx configuration

See the Nginx config in `docker/nginx.conf`. Key points:

- HTTP (80) redirects to HTTPS (443)
- `www.ulloque.com` redirects to `ulloque.com`
- Static files served from `/usr/share/nginx/html`
- `try_files $uri $uri/ =404` — no SPA fallback needed (Astro static)
- Security headers set at server block level (see `docs/privacy-security.md`)
- Cloudflare real IP restoration via `set_real_ip_from` directives

## 3. Docker Compose

```sh
docker compose up -d
```

Verify the container is running and Nginx is serving on port 443:

```sh
docker compose ps
curl -sI http://localhost:80 | head -5
```

## 4. Cloudflare configuration

### DNS

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `<VPS_IP>` | Proxied |
| CNAME | `www` | `ulloque.com` | Proxied |

### SSL/TLS

- Mode: **Full (strict)**
- Minimum TLS version: 1.2
- TLS 1.3: enabled

### Redirect rules

- `www.ulloque.com/*` → `https://ulloque.com/$1` (301)

### Cloudflare Access — `/cv`

1. Zero Trust → Access → Applications → Add application
2. Type: Self-hosted
3. Application domain: `ulloque.com/cv`
4. Policy: Allow — email is one of `[approved addresses]` OR one-time PIN
5. Test the policy with the intended email before announcing the URL

## 5. Origin lockdown

If not using Cloudflare Tunnel, restrict origin port 443 to Cloudflare IPs only:

```sh
# UFW example — run after confirming Cloudflare IP ranges
# https://www.cloudflare.com/ips/
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
    ufw allow from $ip to any port 443
done
ufw deny 443
```

With Cloudflare Tunnel (`cloudflared`), skip the above — the origin has no
public-facing port.

## 6. Post-deployment verification

```sh
# Verify HTTPS and redirect
curl -sI http://ulloque.com | grep -i location
curl -sI https://ulloque.com | head -5

# Verify security headers
curl -sI https://ulloque.com | grep -iE "strict-transport|x-frame|content-security|referrer"

# Verify /cv noindex
curl -s https://ulloque.com/cv | grep 'noindex'

# Verify /cv is absent from sitemap
curl -s https://ulloque.com/sitemap-index.xml
curl -s https://ulloque.com/sitemap-0.xml | grep cv && echo "FAIL" || echo "OK"

# Verify robots.txt
curl -s https://ulloque.com/robots.txt

# Verify RSS
curl -s https://ulloque.com/rss.xml | head -20

# Verify security.txt
curl -s https://ulloque.com/.well-known/security.txt
```

## 7. Rollback

```sh
# Tag current image before deploying
docker tag ulloque-com:latest ulloque-com:previous

# Rollback if needed
docker tag ulloque-com:previous ulloque-com:latest
docker compose up -d
```

## Related documentation

- `docs/launch-checklist.md` — complete pre-launch checklist
- `docs/privacy-security.md` — security headers and CSP baseline
- `docs/cv-access.md` — Cloudflare Access architecture for `/cv`
- `docs/qa.md` — accessibility and performance targets
