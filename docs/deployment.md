# Deployment Guide

This document covers deploying `ulloque.com` to a VPS with Docker, Nginx, and Cloudflare in front.

## Prerequisites

- VPS running Ubuntu 22.04+
- Docker and Docker Compose installed
- Cloudflare account with `ulloque.com` under management
- Completed `docs/launch-checklist.md` sections 1-5 locally

## 1. Build locally

```sh
npm ci
npm run build
docker build -t ulloque-com:latest .
```

The Docker image is runtime-only: build `dist/` locally or in CI first, then Docker copies that static output into Nginx. No runtime Node.js process or secrets are included in the final image. This avoids npm instability inside Docker on the current VPS while keeping the production container minimal.

## 2. Run with Docker Compose

```sh
npm run build
docker compose up -d --build
```

The included `compose.yaml` publishes the container on host port `8080`:

```sh
docker compose ps
curl -sI http://localhost:8080 | head -20
curl -s http://localhost:8080/healthz
```

Put your host-level reverse proxy, Cloudflare Tunnel, or firewall in front of this port. If you prefer binding directly to port 80, change `8080:80` to `80:80` in `compose.yaml`.

## 3. Nginx configuration

The production Nginx config lives in `docker/nginx.conf`; shared headers live in `docker/security-headers.conf`.

Key behavior:

- Static files served from `/usr/share/nginx/html`
- `try_files $uri $uri/ =404` with no SPA fallback
- `/healthz` returns the static health file and is not cached
- `/cv` and `/cv/` add `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`
- Hashed Astro assets under `/_astro/` use `Cache-Control: public, max-age=31536000, immutable`
- Images/fonts/SVGs use long-lived immutable caching
- HTML/XML/TXT and normal routes use conservative `max-age=300, must-revalidate`
- gzip compression is enabled for text, XML, JSON, RSS, JS, CSS, and SVG
- Security headers align with `docs/privacy-security.md`

## 4. Cloudflare configuration

### DNS

| Type  | Name  | Content       | Proxy   |
| ----- | ----- | ------------- | ------- |
| A     | `@`   | `<VPS_IP>`    | Proxied |
| CNAME | `www` | `ulloque.com` | Proxied |

### SSL/TLS

- Mode: **Full (strict)**
- Minimum TLS version: 1.2
- TLS 1.3: enabled

### Redirect rules

- `www.ulloque.com/*` -> `https://ulloque.com/$1` (301)
- HTTP -> HTTPS at Cloudflare or your host-level reverse proxy

### Cloudflare Access: `/cv`

1. Zero Trust -> Access -> Applications -> Add application
2. Type: Self-hosted
3. Application domain: `ulloque.com/cv`
4. Policy: Allow only approved identities or one-time PIN
5. Test the policy with the intended email before announcing the URL

`noindex` is not access control. Do not publish real CV content until Access or an equivalent gate is active.

## 5. Origin lockdown

If exposing a host-level HTTP/HTTPS port publicly, restrict origin access to Cloudflare IPs or use Cloudflare Tunnel.

Cloudflare Tunnel is preferred because the origin does not need a public-facing port.

If using UFW with public HTTPS, confirm the current Cloudflare IP ranges first:

```sh
# https://www.cloudflare.com/ips/
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
    ufw allow from "$ip" to any port 443
done
ufw deny 443
```

## 6. Post-deployment verification

```sh
# Local container
curl -sI http://localhost:8080 | head -20
curl -sI http://localhost:8080/_astro/ 2>/dev/null || true
curl -s http://localhost:8080/healthz

# Public site
curl -sI https://ulloque.com | head -20
curl -sI https://ulloque.com | grep -iE "content-security-policy|x-frame|referrer|permissions"

# /cv noindex
curl -sI https://ulloque.com/cv | grep -i x-robots-tag
curl -s https://ulloque.com/cv | grep 'noindex'

# Sitemap, robots, RSS, security.txt
curl -s https://ulloque.com/robots.txt
curl -s https://ulloque.com/rss.xml | head -20
curl -s https://ulloque.com/.well-known/security.txt
```

## 7. Rebuild and rollback

```sh
# Rebuild current image
docker compose build --no-cache
docker compose up -d

# Tag current image before risky deploys
docker tag ulloque-com:latest ulloque-com:previous

# Rollback if needed
docker tag ulloque-com:previous ulloque-com:latest
docker compose up -d
```

## Related documentation

- `docs/launch-checklist.md` - complete pre-launch checklist
- `docs/privacy-security.md` - security headers and CSP baseline
- `docs/cv-access.md` - Cloudflare Access architecture for `/cv`
- `docs/qa.md` - accessibility and performance targets
