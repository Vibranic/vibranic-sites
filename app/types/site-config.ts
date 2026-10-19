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

export type SectionKey = 'hero' | 'marquee' | 'services' | 'about' | 'gallery' | 'reviews' | 'contact'

/** Hero layouts (see DESIGN.md §4). 'split' is the original text + photo hero. */
export type HeroVariant = 'split' | 'giant-type-cutout' | 'framed-card' | 'collage'

/** Edge between two sections (signature.css [data-edge]). */
export type EdgeStyle = 'none' | 'torn' | 'wavy' | 'scallop'

export interface Cutout extends Image {
  /** photo = transparent PNG/WebP of a person/object (gets a soft contact shadow)
   *  illustration = transparent drawing with its own outlines (no shadow)
   *  shaped = a NORMAL photo, shown in a blob window (fallback when there's no cut-out) */
  kind: 'photo' | 'illustration' | 'shaped'
}

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
    /** Optional logo image. Without it the header shows the business name as text. */
    logo?: Image
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

  /** Show the small "Website door Vibranic" credit in the footer. Default: true. */
  showCredit?: boolean

  /** Which sections show, in this order. Remove a key to hide that section. */
  sections: SectionKey[]

  /** External booking link (Salonized, Treatwell, Planity…). Shown as the main CTA when set. */
  booking?: Link

  socials?: { instagram?: string; facebook?: string; tiktok?: string }

  /** Hand-made art direction ("Studio Zine"). All optional; omit for the plain look. */
  decor?: {
    /** Paper grain overlay. Default true (strength comes from the preset; 0 in atelier/barber). */
    grain?: boolean
    /** Edge between sections. Default 'none'. */
    edge?: EdgeStyle
    /** Rotating badge text. Default = booking.label. Keep it 12–24 characters; it repeats twice around the circle. */
    badgeText?: Text
    /** Badge link. Default = booking.href, else '#contact'. */
    badgeHref?: string
    /** Built-in doodles in the variants. Default true. */
    doodles?: boolean
    /** Mono micro-labels in the hero meta row. `est` is a year, shown as "Est. 2019". */
    meta?: { left?: Text; right?: Text; est?: string; coords?: string }
    /** Words for the marquee strip (section key 'marquee'). Default = service category + item names. */
    marquee?: Text[]
  }

  hero: {
    eyebrow?: Text
    title: Text
    subtitle: Text
    image: Image
    primaryCta: Link
    secondaryCta?: Link
    /** Default 'split' (the original hero). */
    variant?: HeroVariant
    /** Giant word. Default = business.name. ≤ 10 letters looks best; 1 word. */
    giantText?: string
    /** Used by 'giant-type-cutout'. Without it that variant falls back to kind 'shaped' using hero.image. */
    cutout?: Cutout
    /** Up to 2 short sticker labels ("Nieuw", "Balayage-specialist"). */
    stickers?: Text[]
  }

  services: {
    /** Default 'cards'. */
    variant?: 'cards' | 'menu-board'
    title: Text
    intro?: Text
    note?: Text
    categories: { name: Text; items: ServiceItem[] }[]
  }

  about: {
    /** Default 'split'. 'torn-frame' needs `image` (without it, 'split' is used). */
    variant?: 'split' | 'torn-frame'
    /** Handwritten aside next to the text in 'torn-frame', e.g. 'dat zijn wij!' */
    note?: Text
    title: Text
    paragraphs: Text[]
    image?: Image
    highlights?: { value: string; label: Text }[]
  }

  gallery: {
    /** Default 'grid'. */
    variant?: 'grid' | 'collage'
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
