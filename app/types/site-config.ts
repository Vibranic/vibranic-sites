/**
 * The shape of a client site. Every client = one `site.config.ts` that satisfies this type.
 * If a client needs something this type can't express, extend the KIT (here + the section),
 * so the next client gets it for free.
 */

export type Locale = 'nl' | 'en'

/** Plain string = same text in every language. Object = per-language text (nl is required). */
export type Text = string | ({ nl: string } & Partial<Record<Exclude<Locale, 'nl'>, string>>)

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

/** 24h 'HH:MM' strings, Europe/Brussels local time. */
export type TimeRange = [open: string, close: string]

export interface Image {
  /** Path under /public, e.g. '/images/demo/hero.jpg' */
  src: string
  alt: Text
  width: number
  height: number
}

export interface Link {
  label: Text
  href: string
}

export type SectionKey = 'hero' | 'services' | 'about' | 'gallery' | 'reviews' | 'contact'

/** schema.org type used for local-SEO structured data. */
export type BusinessType = 'HairSalon' | 'BeautySalon' | 'BarberShop' | 'NailSalon' | 'DaySpa' | 'LocalBusiness'

/** Brand presets defined in app/assets/css/themes.css */
export type ThemePreset = 'atelier' | 'barber' | 'fresh'

export interface ServiceItem {
  name: Text
  description?: Text
  /** Integer euro cents, incl. VAT (consumer prices). 5200 = €52 */
  priceCents: number
  /** Show "vanaf" / "from" before the price */
  priceFrom?: boolean
  durationMin?: number
}

export interface SiteConfig {
  locales: { default: Locale; enabled: Locale[] }

  business: {
    name: string
    type: BusinessType
    tagline: Text
    /** Display format, e.g. '011 12 34 56' */
    phone: string
    /** E.164 for tel: links, e.g. '+3211123456' */
    phoneE164: string
    email: string
    address: { street: string; postalCode: string; city: string; country: 'BE' }
    geo?: { lat: number; lng: number }
    priceRange?: '€' | '€€' | '€€€'
    /** Shown in the footer + privacy page (Belgian law: company details on the site). */
    legal: { legalName: string; kbo?: string; vat?: string }
  }

  theme: {
    preset: ThemePreset
    /** Per-client token tweaks, e.g. { '--color-accent': '#B4532A' }. Keys must be tokens from tokens.css. */
    overrides?: Partial<Record<`--${string}`, string>>
  }

  seo: {
    /** Absolute production URL, no trailing slash. */
    siteUrl: string
    title: Text
    description: Text
    /** 1200×630 image under /public */
    ogImage?: string
  }

  /** Which sections show, in this order. Remove a key to hide that section. */
  sections: SectionKey[]

  /** External booking link (Salonized, Treatwell, Planity…). Shown as the main CTA when set. */
  booking?: Link

  socials?: { instagram?: string; facebook?: string; tiktok?: string }

  hero: {
    eyebrow?: Text
    title: Text
    subtitle: Text
    image: Image
    primaryCta: Link
    secondaryCta?: Link
  }

  services: {
    title: Text
    intro?: Text
    note?: Text
    categories: { name: Text; items: ServiceItem[] }[]
  }

  about: {
    title: Text
    paragraphs: Text[]
    image?: Image
    highlights?: { value: string; label: Text }[]
  }

  gallery: {
    title: Text
    intro?: Text
    images: Image[]
  }

  reviews: {
    title: Text
    items: { author: string; text: Text; rating: 1 | 2 | 3 | 4 | 5; source?: 'Google' | 'Facebook' | 'Treatwell' }[]
    summary?: { rating: number; count: number; url?: string }
  }

  contact: {
    title: Text
    intro?: Text
    /** Netlify Forms. `name` must be unique per site. */
    form: { enabled: boolean; name: string }
    /** Empty array = closed that day. Multiple ranges = lunch break. */
    hours: Record<Weekday, TimeRange[]>
    hoursNote?: Text
    /** Holidays / vacation. Dates are 'YYYY-MM-DD', inclusive. */
    closures?: { from: string; to: string; label: Text }[]
    /** Click-to-load map (no third-party request until the visitor opts in). */
    map: { enabled: boolean; embedUrl: string; directionsUrl: string }
  }

  privacy: {
    /** 'YYYY-MM-DD' */
    lastUpdated: string
  }
}

/** Identity helper so site.config.ts gets full type-checking + autocomplete. */
export const defineSiteConfig = (config: SiteConfig): SiteConfig => config
