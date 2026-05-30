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

# Detect whether the nginx config actually changed. The config is a single-file
# bind mount: replacing the file changes its inode and the container keeps the
# old one until recreated, so a plain reload is not enough for config changes.
config_changed=1
if [ -f "$SITE_DIR/nginx.conf" ] && \
   sudo cmp -s deploy/nginx.prod.conf "$SITE_DIR/nginx.conf"; then
  config_changed=0
fi
# Write in place (truncate, same inode) so the bind mount reflects it.
sudo cp deploy/nginx.prod.conf "$SITE_DIR/nginx.conf"

# --delete purges files that no longer exist (e.g. newly restricted pages).
sudo rsync -a --delete dist/ "$SITE_DIR/www/"

echo "==> Updating the ulloque service"
# Content (www) is a directory bind mount — nginx serves new files immediately.
sudo docker compose -f "$PROD_DIR/docker-compose.yml" up -d ulloque
if [ "$config_changed" = "1" ]; then
  # Config changed: recreate so the container re-binds the config file inode.
  echo "    nginx config changed — recreating container"
  sudo docker compose -f "$PROD_DIR/docker-compose.yml" up -d --force-recreate ulloque
else
  sudo docker exec ulloque-com nginx -s reload 2>/dev/null || true
fi

echo "==> Done. https://ulloque.com"
