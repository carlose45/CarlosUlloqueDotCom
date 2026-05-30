import { site } from '../../config/site';
import { absoluteUrl } from './url';

export type JsonLd = Record<string, unknown>;

export function personJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.owner,
    url: site.url,
    jobTitle: 'Mission Critical Engineer',
    description: site.description,
    knowsAbout: [
      'Mission critical systems',
      'Security infrastructure',
      'Product engineering',
      'Oracle Exadata',
      'Oracle RAC',
      'Cloudflare Access',
      'Client-side encryption',
    ],
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
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(`/notes/${input.slug}/`),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    image: input.image ? absoluteUrl(input.image) : undefined,
    author: {
      '@type': 'Person',
      name: site.owner,
      url: site.url,
    },
    publisher: {
      '@type': 'Person',
      name: site.owner,
      url: site.url,
    },
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
    dateCreated: input.dateCreated,
    dateModified: input.dateModified,
    image: input.image ? absoluteUrl(input.image) : undefined,
    author: {
      '@type': 'Person',
      name: site.owner,
      url: site.url,
    },
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
