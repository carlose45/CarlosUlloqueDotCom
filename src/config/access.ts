import restricted from './restricted-content.json';

/**
 * Access control for published content (notes, labs, projects).
 *
 * The site is statically built, so "restricted" means the entry body is never
 * emitted into the public HTML — it is not hidden with CSS, it simply is not
 * rendered. The route still exists and renders a restricted notice inside the
 * normal layout, the page is served `noindex`, and it is dropped from the
 * sitemap (see astro.config.mjs, which reads the same source of truth).
 *
 * Source of truth: src/config/restricted-content.json
 *
 * To change an entry's state:
 *   - Publish publicly:   remove its slug from the relevant array
 *   - Restrict an entry:   add its slug to the relevant array
 *
 * Future controlled publication (whitelist / selective access): keep the entry
 * listed here so its body stays out of the static build, and serve the body
 * through an authenticated path gated at the edge by Cloudflare Access — the
 * same model documented in docs/cv-access.md. Identity checks belong at the
 * edge, not in the static output.
 */
export type RestrictableCollection = 'notes' | 'labs' | 'projects';

const restrictedByCollection: Record<RestrictableCollection, Set<string>> = {
  notes: new Set<string>(restricted.notes),
  labs: new Set<string>(restricted.labs),
  projects: new Set<string>(restricted.projects),
};

export function isRestricted(
  collection: RestrictableCollection,
  slug: string,
): boolean {
  return restrictedByCollection[collection].has(slug);
}

export function isNoteRestricted(slug: string): boolean {
  return isRestricted('notes', slug);
}
