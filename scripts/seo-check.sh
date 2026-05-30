#!/usr/bin/env bash
#
# SEO / indexing monitor for ulloque.com.
#
#   1. Public health check  — sitemap, robots, key pages reachable and correct.
#   2. Crawler activity      — when Googlebot/Bingbot last fetched the sitemap and
#                              pages, read from the origin nginx access logs.
#
# The authoritative "last read" date lives in Google Search Console; this is the
# origin-side signal (requests that reach the server through Cloudflare). Some
# crawler fetches may be served from Cloudflare's edge cache and not appear here.
#
# Usage:
#   scripts/seo-check.sh            # default: scan last 96h of logs
#   SINCE=7d scripts/seo-check.sh   # custom window
#
set -uo pipefail

DOMAIN="${DOMAIN:-https://ulloque.com}"
CONTAINER="${CONTAINER:-ulloque-com}"
SINCE="${SINCE:-96h}"

bold() { printf '\n\033[1m%s\033[0m\n' "$1"; }
ok() { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad() { printf '  \033[31m✗\033[0m %s\n' "$1"; }

bold "1. Public health check ($DOMAIN)"

# Key pages must be 200.
for path in / /about/ /notes/ /projects/ /uses/ /labs/ /privacy/; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$DOMAIN$path")
  [ "$code" = "200" ] && ok "$code  $path" || bad "$code  $path"
done

# Sitemap reachable + URL count.
sm_code=$(curl -s -o /dev/null -w '%{http_code}' "$DOMAIN/sitemap-0.xml")
sm_count=$(curl -s "$DOMAIN/sitemap-0.xml" | grep -o '<loc>' | wc -l | tr -d ' ')
[ "$sm_code" = "200" ] && ok "sitemap-0.xml  $sm_code  ($sm_count URLs)" || bad "sitemap-0.xml  $sm_code"

# robots points to the sitemap index.
curl -s "$DOMAIN/robots.txt" | grep -qi 'Sitemap:' && ok "robots.txt advertises sitemap" || bad "robots.txt missing Sitemap line"

bold "2. Intentionally NOT indexed (must stay out)"

# /cv: disallowed + noindex.
curl -s "$DOMAIN/robots.txt" | grep -qi 'Disallow: /cv' && ok "robots Disallow: /cv" || bad "robots not disallowing /cv"
curl -s "$DOMAIN/cv/" | grep -qi 'noindex' && ok "/cv has noindex" || bad "/cv missing noindex"

# Restricted entries: absent from sitemap.
leak=$(curl -s "$DOMAIN/sitemap-0.xml" | grep -ciE 'exadata-datapatch|oracle-rac-node-eviction|zdlra-backup-validation|control-m-kafka' || true)
[ "$leak" = "0" ] && ok "restricted entries absent from sitemap" || bad "restricted entries LEAKING into sitemap ($leak)"

bold "3. Crawler activity at the origin (last $SINCE)"

if ! command -v docker >/dev/null 2>&1; then
  echo "  docker not available here — run this on the server."
  exit 0
fi

logs=$(sudo docker logs --since "$SINCE" "$CONTAINER" 2>&1 || true)

for bot in Googlebot Bingbot; do
  hits=$(printf '%s\n' "$logs" | grep -c "$bot" || true)
  sm=$(printf '%s\n' "$logs" | grep "$bot" | grep -E 'GET /sitemap' || true)
  if [ "$hits" -gt 0 ]; then
    ok "$bot: $hits request(s) hit the origin"
    if [ -n "$sm" ]; then
      last=$(printf '%s\n' "$sm" | tail -1)
      ok "$bot last sitemap fetch:"
      printf '      %s\n' "$last"
    else
      echo "    ($bot has not fetched /sitemap* at the origin yet)"
    fi
  else
    echo "  $bot: no origin hits in the last $SINCE (normal right after submitting; check GSC too)"
  fi
done

bold "Notes"
echo "  - Authoritative status: Search Console → Sitemaps / Pages, and Cloudflare → Security → Bots."
echo "  - 'Couldn't fetch' in GSC right after submitting is usually transient (queued, not failed)."
