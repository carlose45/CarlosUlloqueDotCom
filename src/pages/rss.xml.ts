import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config/site';
import { getPublishedEntries } from '../lib/content';
import { entrySlug } from '../lib/content';

export async function GET(context: APIContext) {
  const notes = await getPublishedEntries('notes');
  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.publishDate,
      link: `/notes/${entrySlug(note)}/`,
    })),
  });
}
