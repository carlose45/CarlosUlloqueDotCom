# Privacy and Security Headers Policy

## Analytics decision

**Decision: no analytics.**

Rationale: the site is a privacy-first engineering portfolio. Installing any
analytics — even privacy-preserving ones — contradicts the stated position and
adds unnecessary data exposure. Traffic intelligence is not required to justify
the site's existence.

If analytics become necessary in the future, the only acceptable options are:
self-hosted Plausible or Umami, deployed on the same VPS, with no data leaving
the origin infrastructure.

## Data collection

| Category          | Status |
| ----------------- | ------ |
| Analytics         | None   |
| Tracking cookies  | None   |
| Fingerprinting    | None   |
| External scripts  | None   |
| External fonts    | None   |
| Third-party CDNs  | None   |
| Server access log | Yes — operational use only, not shared |

## Referrer policy

Set via `<meta name="referrer" content="strict-origin-when-cross-origin">` in
BaseLayout. Nginx should also send the equivalent HTTP header:

```
Referrer-Policy: strict-origin-when-cross-origin
```

## Recommended HTTP security headers (Nginx / Cloudflare)

These headers belong in `nginx.conf` or Cloudflare Transform Rules.
They cannot be set by a static Astro build.

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=()" always;
add_header X-XSS-Protection "0" always;
```

Note: `X-XSS-Protection: 0` is intentional. The directive is deprecated and
disabling it prevents older browsers from misusing it.

## Content Security Policy

This site loads no external scripts, fonts, or stylesheets. All assets are
same-origin. `<script type="application/ld+json">` tags are not blocked by
`script-src` because `application/ld+json` is not a JavaScript MIME type.

Recommended CSP for production:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'none';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'none';
  upgrade-insecure-requests;
```

Test with `Content-Security-Policy-Report-Only` before enforcing.

## Sensitive-data review checklist (pre-launch)

Run before every public deployment:

- [ ] No phone numbers in source or content
- [ ] No physical addresses in source or content
- [ ] No personal ID numbers or document references
- [ ] No employer names or client names not already public
- [ ] No private email addresses in public pages (security@ulloque.com is fine)
- [ ] No credentials, API keys, or tokens in source or git history
- [ ] `/cv` carries `noindex` and is excluded from sitemap
- [ ] `docs/cv-access.md` does not contain actual CV data
- [ ] Git history reviewed for accidental secrets (`git log -p | grep -i key`)

## Related issues

- Issue #10: Private CV route
- Issue #12: Docker and Nginx deployment (where HTTP headers are set)
- Issue #15: Final QA and launch checklist
