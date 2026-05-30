import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from 'astro:content';
import { readingTime } from './reading-time';

type Entry = CollectionEntry<CollectionKey>;

function byPublishDateDesc(a: Entry, b: Entry): number {
  return b.data.publishDate.getTime() - a.data.publishDate.getTime();
}

export function isPublished(entry: Entry): boolean {
  return entry.data.draft !== true;
}

export async function getPublishedEntries<TCollection extends CollectionKey>(
  collection: TCollection,
): Promise<CollectionEntry<TCollection>[]> {
  const entries = await getCollection(collection, (entry) =>
    isPublished(entry as Entry),
  );
  return entries.sort(
    byPublishDateDesc as (
      a: CollectionEntry<TCollection>,
      b: CollectionEntry<TCollection>,
    ) => number,
  );
}

export async function getLatestEntries<TCollection extends CollectionKey>(
  collection: TCollection,
  limit: number,
): Promise<CollectionEntry<TCollection>[]> {
  return (await getPublishedEntries(collection)).slice(0, limit);
}

export function getReadingTime(entry: CollectionEntry<'notes'>): string {
  return readingTime(entry.body ?? '');
}
