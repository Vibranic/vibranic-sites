/** True for links that leave this site (http/https/mailto/tel are never in-page). */
export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

/** Attributes for a link: external http(s) links open in a new tab, safely. */
export function linkAttrs(href: string): { href: string; target?: string; rel?: string } {
  return isExternal(href) ? { href, target: '_blank', rel: 'noopener' } : { href }
}
