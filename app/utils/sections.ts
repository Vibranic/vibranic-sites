import type { SectionKey } from '~/types/site-config'

/**
 * Anchor id per section (Dutch slugs, they show up in the URL: /#prijzen).
 * The hero has an id (for "back to top") but no nav link.
 */
export const SECTION_ID: Record<SectionKey, string> = {
  hero: 'home',
  services: 'prijzen',
  about: 'over-ons',
  gallery: 'werk',
  reviews: 'reviews',
  contact: 'contact',
}

/** Sections that get a link in the header nav, in `site.sections` order. */
export function navSections(sections: SectionKey[]): SectionKey[] {
  return sections.filter((key) => key !== 'hero')
}

/** Absolute URL for SEO tags. `path` may be '/x' or already absolute. */
export function absoluteUrl(siteUrl: string, path = '/'): string {
  if (/^https?:\/\//.test(path)) return path
  return `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
