export const site = {
  name: 'Carlos Ulloque',
  domain: 'ulloque.com',
  url: 'https://ulloque.com',
  owner: 'Carlos Ulloque',
  positioning:
    'Mission Critical Engineer · Security & Infrastructure · Product Engineering',
  description:
    'Carlos Ulloque is a Mission Critical Engineer focused on building reliable systems, securing what matters, and sharing real-world lessons from infrastructure and product engineering.',
  tagline:
    'Building reliable systems. Securing what matters. Sharing real-world lessons.',
  defaultImage: '/og/default.png',
  keywords: [
    'Ulloque',
    'Carlos Ulloque',
    'Carlos Ulloque Oracle',
    'Carlos Ulloque Exadata',
    'Carlos Ulloque Panama',
    'Ulloque engineering',
    'mission critical engineer',
    'security and infrastructure',
    'product engineering',
  ],
  // Public profiles that confirm this is the same person/entity. Shown in the
  // footer (with rel="me") and used to build the Person `sameAs` graph — the
  // strongest signal for search engines and AI to disambiguate "Ulloque".
  profiles: [
    { label: 'GitHub', href: 'https://github.com/carlose45' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/culloque' },
    { label: 'X', href: 'https://x.com/carlose45' },
  ],
  // Country-level association only (no street/city) — reinforces the entity
  // and "Carlos Ulloque Panama" without exposing sensitive location data.
  location: { country: 'Panama', countryCode: 'PA' },
} as const;
