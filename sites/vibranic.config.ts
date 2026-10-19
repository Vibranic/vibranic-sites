/**
 * ─── VIBRANIC.BE ───────────────────────────────────────────────────
 * Kilian's own site, built from the kit like any client site.
 * Build: `SITE=vibranic npm run generate` (Netlify: env var SITE=vibranic).
 * Pop colour = the character's patch yellow (decided 2026-10-19).
 */
import { defineSiteConfig } from '../app/types/site-config'

const character = {
  src: '/images/brand/vibranic-character-2000.webp',
  alt: 'Het Vibranic-personage: koptelefoon, ronde zonnebril en een blauwe hoodie',
  width: 1698,
  height: 2000,
}

export default defineSiteConfig({
  locales: { default: 'nl', enabled: ['nl'] },

  business: {
    name: 'Vibranic',
    type: 'LocalBusiness',
    tagline: 'Websites voor Limburgse zaken',
    // No phone and no street on purpose: Kilian works from home (private address).
    email: 'Vibranic-webapps@outlook.com',
    address: { postalCode: '3582', city: 'Koersel', country: 'BE' },
    // TODO after the KBO registration: add kbo + vat, and legalName if it changes.
    legal: { legalName: 'Kilian Frederix (Vibranic)' },
  },

  theme: {
    preset: 'fresh',
    overrides: {
      '--color-pop': '#f6ca43', // ink on it 11.4
      '--color-pop-hover': '#efbd2a',
    },
  },

  decor: {
    edge: 'wavy',
    badgeText: 'Vraag je gratis demo',
    badgeHref: '#contact',
    meta: { left: 'Webdesign · Limburg', est: '2026' },
    marquee: ['Kapsalons', 'Barbers', 'Beautystudio’s', 'Nagelstudio’s', 'Mobielvriendelijk', 'Online in 7 dagen'],
  },

  seo: {
    siteUrl: 'https://vibranic.be',
    title: 'Vibranic · Websites voor Limburgse zaken',
    description:
      'Moderne websites voor kapsalons, barbers en beautystudio’s in Limburg. Vaste prijs vanaf € 600, online binnen 7 dagen.',
    ogImage: '/images/vibranic/og.png',
    favicon: '/images/vibranic/favicon-32.png',
    appleTouchIcon: '/images/vibranic/apple-touch-icon-180.png',
  },

  showCredit: false,

  sections: ['hero', 'marquee', 'services', 'about', 'gallery', 'contact'],

  booking: { label: 'Vraag je demo', href: '/#contact' },

  hero: {
    variant: 'giant-type-cutout',
    giantText: 'Vibranic',
    eyebrow: 'Webdesign · Limburg',
    title: 'Websites voor *Limburgse* zaken',
    subtitle:
      'Een moderne website voor je kapsalon, barbershop of beautystudio. Snel op je gsm, met je prijzen en je boekingsknop, en online binnen 7 dagen.',
    image: character,
    cutout: { ...character, kind: 'illustration' },
    stickers: ['Online in 7 dagen'],
    primaryCta: { label: 'Vraag je gratis demo', href: '#contact' },
    secondaryCta: { label: 'Bekijk prijzen', href: '#prijzen' },
  },

  services: {
    variant: 'menu-board',
    title: 'Pakketten & *prijzen*',
    intro: 'Eén vaste prijs, vooraf afgesproken. Geen uurtarief en geen verrassingen achteraf.',
    note: 'Prijzen excl. btw. Je domeinnaam staat op jouw naam: je website is en blijft van jou.',
    categories: [
      {
        name: 'Website',
        items: [
          {
            name: 'Start',
            description: 'One-pager: je zaak, je prijzen, wie je bent, reviews, contact, kaart en openingsuren.',
            priceCents: 60000,
          },
          {
            name: 'Pro',
            description: 'Meerdere pagina’s, Nederlands en Engels, een fotogalerij en je boekingslink.',
            priceCents: 120000,
          },
        ],
      },
      {
        name: 'Onderhoud',
        items: [
          {
            name: 'Hosting & onderhoud',
            description: 'Hosting, kleine tekstwijzigingen, en ik hou in de gaten dat je site online blijft.',
            priceCents: 2500,
            priceSuffix: '/maand',
          },
        ],
      },
    ],
  },

  about: {
    variant: 'torn-frame',
    note: 'dat ben ik!',
    title: 'Hoi, ik ben *Kilian*',
    paragraphs: [
      'Ik ben webdeveloper uit Koersel en ik bouw websites voor zaken uit Limburg. Geen sjabloon dat op elke andere site lijkt, maar een site die past bij jouw zaak en jouw klanten.',
      'Ik werk met een eigen bouwpakket dat ik zelf ontwikkeld heb. Daardoor gaat het snel: jij bezorgt je teksten en foto’s, en binnen 7 dagen staat je site online. Daarna blijf ik je vaste aanspreekpunt.',
    ],
    image: {
      src: '/images/vibranic/about.png',
      alt: 'Het Vibranic-personage met koptelefoon, tussen zwevende muzieknoten',
      width: 550,
      height: 550,
    },
    highlights: [
      { value: '7', label: 'Dagen tot online' },
      { value: '€ 600', label: 'Vanaf' },
      { value: '100%', label: 'Van jou' },
    ],
  },

  gallery: {
    variant: 'collage',
    title: 'Zo kan *jouw* site eruitzien',
    intro: 'Studio Noor is een demosalon, gebouwd met hetzelfde bouwpakket als jouw site. Zo ziet hij eruit op je gsm.',
    images: [
      { src: '/images/vibranic/work-1.png', alt: 'Demo Studio Noor op een gsm: de openingsfoto met de knop om een afspraak te maken', width: 780, height: 1040 },
      { src: '/images/vibranic/work-2.png', alt: 'Demo Studio Noor op een gsm: de prijslijst op een donker bord', width: 780, height: 1040 },
      { src: '/images/vibranic/work-3.png', alt: 'Demo Studio Noor op een gsm: het verhaal van de salon met een foto', width: 780, height: 1040 },
      { src: '/images/vibranic/work-4.png', alt: 'Demo Studio Noor op een gsm: openingsuren en contactformulier', width: 780, height: 1040 },
    ],
  },

  contact: {
    title: 'Vraag je *gratis demo*',
    intro:
      'Stuur je naam, je zaak en je huidige website (als je er een hebt). Ik maak vrijblijvend een voorbeeld van je nieuwe site en antwoord binnen één werkdag.',
    form: { enabled: true, name: 'contact' },
    map: { enabled: false, embedUrl: '', directionsUrl: '' },
  },

  privacy: {
    lastUpdated: '2026-10-19',
  },
})
