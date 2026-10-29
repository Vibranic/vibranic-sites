import type { SiteConfig, Weekday } from '../types/site-config'
import { WEEKDAYS } from './openingHours'

const SCHEMA_DAY: Record<Weekday, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
}

/**
 * schema.org LocalBusiness data for Google. Deliberately NO aggregateRating:
 * Google ignores self-served reviews on the business's own site and it can get flagged.
 */
export function buildLocalBusinessJsonLd(site: SiteConfig, siteUrl: string, imageUrl?: string) {
  const { business, contact, socials } = site
  const sameAs = Object.values(socials ?? {}).filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': business.type,
    name: business.name,
    url: siteUrl,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(business.phoneE164 ? { telephone: business.phoneE164 } : {}),
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      ...(business.address.street ? { streetAddress: business.address.street } : {}),
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressCountry: business.address.country,
    },
    ...(business.geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng } }
      : {}),
    ...(business.priceRange ? { priceRange: business.priceRange } : {}),
    ...(contact.hours
      ? {
          openingHoursSpecification: WEEKDAYS.flatMap((day) =>
            contact.hours![day].map(([opens, closes]) => ({
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: SCHEMA_DAY[day],
              opens,
              closes,
            })),
          ),
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/** JSON for an inline <script>: escape "<" so a config value can never close the tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
