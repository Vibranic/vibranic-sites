import type { SiteConfig } from '../types/site-config'

/** "Straat 12, 3500 Hasselt", or just "3500 Hasselt" when the business has no public street. */
export function formatAddress(address: SiteConfig['business']['address']): string {
  return [address.street, `${address.postalCode} ${address.city}`].filter(Boolean).join(', ')
}
