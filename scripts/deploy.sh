#!/usr/bin/env bash
#
# Build the static site and publish it into the operador production stack.
# The `ulloque` service (see deploy/ulloque.compose-snippet.yml) serves the
# published files via nginx behind Traefik.
#
# Usage: scripts/deploy.sh
#
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/ulloque/CarlosUlloqueDotCom}"
PROD_DIR="${PROD_DIR:-/home/operador/production}"
SITE_DIR="$PROD_DIR/ulloque"

cd "$REPO_DIR"

echo "==> Building (clean install + production build)"
npm ci
npm run build

echo "==> Publishing nginx config and content to $SITE_DIR"
sudo install -d -m 755 "$SITE_DIR" "$SITE_DIR/www"
sudo install -m 644 deploy/nginx.prod.conf "$SITE_DIR/nginx.conf"
# --delete purges files that no longer exist (e.g. newly restricted pages).
sudo rsync -a --delete dist/ "$SITE_DIR/www/"

echo "==> Reloading the ulloque service"
# Content is a read-only bind mount, so nginx serves new files immediately.
# This brings the service up the first time and is a no-op reload afterward.
sudo docker compose -f "$PROD_DIR/docker-compose.yml" up -d ulloque
# Pick up an updated nginx.conf if it changed.
sudo docker exec ulloque-com nginx -s reload 2>/dev/null || true

echo "==> Done. https://ulloque.com"
