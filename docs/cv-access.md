# CV Access Architecture

## Overview

`/cv` is a private route. CV content is not published in the static build.
Page-level `noindex,nofollow` and sitemap exclusion are disclosure hints, not
access controls.

Real access protection must be implemented at the infrastructure layer.

## Recommended access model: Cloudflare Access + one-time tokens

### Gate: Cloudflare Access

1. Create a Cloudflare Zero Trust application scoped to `ulloque.com/cv*`.
2. Set the policy to **one-time PIN** (OTP) via email or an allow-list of known
   email addresses.
3. Cloudflare validates the identity before the origin ever receives the request.
4. The static build behind Nginx never serves CV content to unauthenticated users
   regardless of what the HTML source contains.

### Alternative: server-side one-time token

If Cloudflare Access is not available:

1. A separate service (e.g. a small Cloudflare Worker or VPS endpoint) generates
   a signed, time-limited token (JWT, HMAC, or opaque random string).
2. Token is sent to the requester out-of-band (email, Signal).
3. Nginx `auth_request` or a Worker validates the token before proxying to the
   static CV page or a separate protected asset.
4. Token expires after a configurable TTL (e.g. 24 hours or one use).

### What NOT to rely on

- `noindex` / `robots.txt` — these are crawl hints, not gates. Any human or
  crawler that ignores them sees the content.
- Security through obscurity (hidden URLs) — not sufficient on its own.
- Static file permissions — Nginx serves files to all authenticated TCP connections
  unless a gate is configured.

## Checklist before publishing CV content

- [ ] Cloudflare Access application created and tested
- [ ] `/cv` path is excluded from public sitemap (see Issue #11)
- [ ] `robots.txt` does not advertise the `/cv` path
- [ ] No real phone numbers, addresses, or document IDs committed to the repo
- [ ] CV content lives outside `src/pages/cv.astro` static build until gate is live

## Related issues

- Issue #10: Prepare private CV route
- Issue #11: RSS, sitemap, robots.txt
- Issue #12: Docker and Nginx deployment
- Issue #17: Privacy, analytics, and security header policy
