import { site } from '../../config/site';
import { absoluteUrl } from './url';

export type JsonLd = Record<string, unknown>;

// Stable entity node IDs. Other schemas reference these by @id so search
// engines and AI systems resolve one consistent "Ulloque" entity across pages.
export const PERSON_ID = `${site.url}/#person`;
export const WEBSITE_ID = `${site.url}/#website`;

export function personJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.owner,
    givenName: 'Carlos',
    familyName: 'Ulloque',
    alternateName: 'Ulloque',
    url: site.url,
    mainEntityOfPage: site.url,
    image: absoluteUrl('/icon-512.png'),
    jobTitle: 'Mission Critical Engineer',
    description: site.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: site.location.countryCode,
    },
    homeLocation: {
      '@type': 'Place',
      name: site.location.country,
    },
    knowsAbout: [
      'Mission critical systems',
      'Infrastructure engineering',
      'Networking',
      'High availability and recovery',
      'Oracle Exadata',
      'Oracle RAC',
      'Oracle Data Guard',
      'ZDLRA',
      'Linux',
      'Docker',
      'Kubernetes',
      'Software architecture',
      'Microservices',
      'Resilience engineering',
      'Security',
      'Zero Trust',
      'Product ownership',
    ],
    sameAs: site.profiles.map((p) => p.href),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.owner,
    alternateName: ['Ulloque', 'Ulloque engineering'],
    url: site.url,
    inLanguage: 'en',
    description: site.description,
    publisher: { '@id': PERSON_ID },
    about: { '@id': PERSON_ID },
  };
}

export function profilePageJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${site.url}/about/#profilepage`,
    url: `${site.url}/about`,
    name: `About ${site.owner}`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': PERSON_ID },
  };
}

export interface BlogPostingInput {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
}

export function blogPostingJsonLd(input: BlogPostingInput): JsonLd {
  const url = absoluteUrl(`/notes/${input.slug}/`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en',
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    image: input.image ? absoluteUrl(input.image) : undefined,
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  };
}

export interface ProjectInput {
  title: string;
  description: string;
  slug: string;
  dateCreated?: string;
  dateModified?: string;
  image?: string;
}

export function projectJsonLd(input: ProjectInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.title,
    description: input.description,
    url: absoluteUrl(`/projects/${input.slug}/`),
    inLanguage: 'en',
    dateCreated: input.dateCreated,
    dateModified: input.dateModified,
    image: input.image ? absoluteUrl(input.image) : undefined,
    isPartOf: { '@id': WEBSITE_ID },
    author: { '@id': PERSON_ID },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
