FROM nginx:1.27-alpine AS runtime
LABEL org.opencontainers.image.title="CarlosUlloqueDotCom"
LABEL org.opencontainers.image.description="Static Astro site for ulloque.com served by Nginx"

RUN mkdir -p /etc/nginx/snippets
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
