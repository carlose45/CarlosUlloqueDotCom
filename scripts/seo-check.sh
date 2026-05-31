#!/usr/bin/env bash
#
# SEO / indexing monitor and leak guard for ulloque.com.
#
#   1. Public health check  — sitemap, robots, key pages reachable and correct.
#   2. Leak guard            — every access-restricted entry (from the source of
#                              truth, restricted-content.json) must stay OUT of
#                              the sitemap, RSS feed, and listing pages, and its
#                              detail page must be noindex.
#   3. Crawler activity      — when Googlebot/Bingbot last fetched the sitemap and
#                              pages, read from the origin nginx access logs.
#
# Exits non-zero if any check fails, so it can run as a pre-deploy guard.
# The authoritative crawl status lives in Google Search Console; section 3 is the
# origin-side signal (some fetches may be served from Cloudflare's edge cache).
#
# Usage:
#   scripts/seo-check.sh            # default: scan last 96h of logs
#   SINCE=7d scripts/seo-check.sh   # custom window
#
set -uo pipefail

DOMAIN="${DOMAIN:-https://ulloque.com}"
CONTAINER="${CONTAINER:-ulloque-com}"
SINCE="${SINCE:-96h}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JSON="$SCRIPT_DIR/../src/config/restricted-content.json"
FAIL=0

bold() { printf '\n\033[1m%s\033[0m\n' "$1"; }
ok() { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad() {
  printf '  \033[31m✗\033[0m %s\n' "$1"
  FAIL=1
}

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

bold "2. Leak guard — restricted entries must stay out of public channels"

# /cv: disallowed + noindex.
curl -s "$DOMAIN/robots.txt" | grep -qi 'Disallow: /cv' && ok "robots Disallow: /cv" || bad "robots not disallowing /cv"
curl -s "$DOMAIN/cv/" | grep -qi 'noindex' && ok "/cv has noindex" || bad "/cv missing noindex"

# Restricted slugs from the source of truth, checked across every public surface.
if [ ! -f "$JSON" ]; then
  bad "cannot read $JSON (run from the repo checkout)"
else
  sitemap=$(curl -s "$DOMAIN/sitemap-0.xml")
  feed=$(curl -s "$DOMAIN/rss.xml")
  while read -r collection slug; do
    [ -z "${slug:-}" ] && continue
    index=$(curl -s "$DOMAIN/$collection/")
    detail=$(curl -s "$DOMAIN/$collection/$slug/")
    leaks=""
    printf '%s' "$sitemap" | grep -qF "$slug" && leaks="$leaks sitemap"
    printf '%s' "$feed" | grep -qF "$slug" && leaks="$leaks rss"
    printf '%s' "$index" | grep -qF "$slug" && leaks="$leaks index"
    printf '%s' "$detail" | grep -qi 'noindex' || leaks="$leaks no-noindex"
    if [ -z "$leaks" ]; then
      ok "$collection/$slug — contained (out of sitemap/rss/index, noindex)"
    else
      bad "$collection/$slug — LEAK:$leaks"
    fi
  done < <(python3 -c "
import json
d = json.load(open('$JSON'))
for c in ('notes', 'labs', 'projects'):
    for s in d.get(c, []):
        print(c, s)
")
fi

bold "3. Crawler activity at the origin (last $SINCE)"

if ! command -v docker >/dev/null 2>&1; then
  echo "  docker not available here — run this on the server for crawler activity."
  exit "$FAIL"
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

exit "$FAIL"
