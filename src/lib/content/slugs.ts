import type { CollectionEntry } from 'astro:content';

export function entrySlug(
  entry: CollectionEntry<'notes' | 'projects' | 'labs'>,
): string {
  return entry.id.replace(/\.(md|mdx)$/i, '');
}
