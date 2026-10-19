import type { SectionKey } from '~/types/site-config'

/**
 * Anchor id per section (Dutch slugs, they show up in the URL: /#prijzen).
 * The hero has an id (for "back to top") but no nav link.
 */
export const SECTION_ID: Record<SectionKey, string> = {
  hero: 'home',
  marquee: 'marquee',
  services: 'prijzen',
  about: 'over-ons',
  gallery: 'werk',
  reviews: 'reviews',
  contact: 'contact',
}

/** Section keys that can have a header nav link (hero and the marquee strip can't). */
export type NavSectionKey = Exclude<SectionKey, 'hero' | 'marquee'>

/** Sections that get a link in the header nav, in `site.sections` order. */
export function navSections(sections: SectionKey[]): NavSectionKey[] {
  return sections.filter((key): key is NavSectionKey => key !== 'hero' && key !== 'marquee')
}

/** Absolute URL for SEO tags. `path` may be '/x' or already absolute. */
export function absoluteUrl(siteUrl: string, path = '/'): string {
  if (/^https?:\/\//.test(path)) return path
  return `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
