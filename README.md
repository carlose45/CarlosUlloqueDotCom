# CarlosUlloqueDotCom

[![CI](https://github.com/carlose45/CarlosUlloqueDotCom/actions/workflows/ci.yml/badge.svg)](https://github.com/carlose45/CarlosUlloqueDotCom/actions/workflows/ci.yml)

Static Astro site for `ulloque.com`, focused on privacy-aware technical authority for Carlos Ulloque.

## Stack

- Astro
- TypeScript
- Tailwind CSS
- MDX

## Project Planning

- Content strategy: `docs/content-strategy.md`
- QA checklist: `docs/qa.md`
- Privacy and security headers: `docs/privacy-security.md`
- CV access architecture: `docs/cv-access.md`
- Launch checklist: `docs/launch-checklist.md`
- Deployment guide: `docs/deployment.md`

## Deployment

Build and run the production Nginx container:

```sh
npm run build
docker compose up -d --build
```

The container serves the static site on `http://localhost:8080` by default. See `docs/deployment.md` for Cloudflare and VPS notes.

## Local Development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

Run validation:

```sh
npm run check
npm run lint
npm run format:check
```
