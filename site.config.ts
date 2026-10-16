/**
 * ─── CLIENT CONTENT ────────────────────────────────────────────────
 * This file IS the client site. New client = copy this file and change it.
 * Brand look = `theme.preset` (+ optional `theme.overrides`).
 *
 * DEMO DATA: "Studio Noor" is a fictional salon used to show prospects the kit.
 */
import { defineSiteConfig } from './app/types/site-config'

export default defineSiteConfig({
  locales: { default: 'nl', enabled: ['nl'] },

  business: {
    name: 'Studio Noor',
    type: 'HairSalon',
    tagline: 'Kapsalon in hartje Hasselt',
    phone: '011 00 00 00',
    phoneE164: '+3211000000',
    email: 'hallo@studionoor.be',
    address: { street: 'Voorbeeldstraat 12', postalCode: '3500', city: 'Hasselt', country: 'BE' },
    geo: { lat: 50.9307, lng: 5.3378 },
    priceRange: '€€',
    legal: { legalName: 'Studio Noor BV', kbo: '0000.000.000', vat: 'BE 0000.000.000' },
  },

  theme: {
    preset: 'atelier',
  },

  seo: {
    siteUrl: 'https://demo.vibranic.be',
    title: 'Studio Noor · Kapsalon in Hasselt',
    description:
      'Knippen, kleuren en balayage in hartje Hasselt. Bekijk onze prijzen en maak online een afspraak.',
    ogImage: '/images/demo/og.jpg',
  },

  sections: ['hero', 'services', 'about', 'gallery', 'reviews', 'contact'],

  booking: { label: 'Maak een afspraak', href: 'https://example.com/boeken' },

  socials: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
  },

  hero: {
    eyebrow: 'Kapsalon · Hasselt',
    title: 'Haar dat *bij jou* past',
    subtitle:
      'Rustige salon, eerlijk advies en kleur die lang mooi blijft. Je bent welkom van dinsdag tot zaterdag.',
    image: {
      src: '/images/demo/hero.jpg',
      alt: 'Kapster die het haar van een klant föhnt in een lichte salon',
      width: 1600,
      height: 1067,
    },
    primaryCta: { label: 'Maak een afspraak', href: 'https://example.com/boeken' },
    secondaryCta: { label: 'Bekijk prijzen', href: '#prijzen' },
  },

  services: {
    title: 'Behandelingen & *prijzen*',
    intro: 'Alle prijzen zijn inclusief btw. Lang of dik haar? We bespreken het vooraf, zonder verrassingen.',
    note: 'Prijzen kunnen afwijken bij extra lang haar of meer product.',
    categories: [
      {
        name: 'Knippen',
        items: [
          { name: 'Dames knippen & brushing', priceCents: 5200, durationMin: 60 },
          { name: 'Heren knippen', priceCents: 2900, durationMin: 30 },
          { name: 'Kinderen (tot 12 jaar)', priceCents: 1800, durationMin: 30 },
          { name: 'Brushing', priceCents: 3000, durationMin: 30 },
        ],
      },
      {
        name: 'Kleuren',
        items: [
          { name: 'Uitgroei kleuren', priceCents: 5500, priceFrom: true, durationMin: 75 },
          { name: 'Volledige kleuring', priceCents: 6500, priceFrom: true, durationMin: 90 },
          {
            name: 'Balayage',
            description: 'Zachte, natuurlijke highlights, met toner en verzorging.',
            priceCents: 14000,
            priceFrom: true,
            durationMin: 180,
          },
        ],
      },
      {
        name: 'Verzorging & feest',
        items: [
          { name: 'Keratinebehandeling', priceCents: 18000, priceFrom: true, durationMin: 150 },
          { name: 'Opsteekkapsel', priceCents: 6000, priceFrom: true, durationMin: 60 },
          { name: 'Bruidskapsel (incl. proefsessie)', priceCents: 19500, priceFrom: true },
        ],
      },
    ],
  },

  about: {
    title: 'Over *Studio Noor*',
    paragraphs: [
      'Noor opende haar salon in 2019 met één idee: elke klant krijgt de tijd. Geen lopende band, maar een kapsel dat past bij je haar, je gezicht en je ochtendroutine.',
      'We werken met een klein team en met producten die we zelf gebruiken. Twijfel je over een nieuwe kleur? Kom gerust eerst langs voor gratis advies.',
    ],
    image: {
      src: '/images/demo/about.jpg',
      alt: 'Kapster steekt het haar van een klant op voor een bruiloft',
      width: 1000,
      height: 1500,
    },
    highlights: [
      { value: '2019', label: 'Sinds' },
      { value: '4,9', label: 'Google-score' },
      { value: '3', label: 'Kapsters' },
    ],
  },

  gallery: {
    title: 'Ons *werk*',
    intro: 'Een greep uit de kapsels van de afgelopen maanden.',
    images: [
      { src: '/images/demo/gallery-1.jpg', alt: 'Lang haar met balayage in warme blonde tinten', width: 800, height: 1067 },
      { src: '/images/demo/gallery-2.jpg', alt: 'Haar gestyled met een krultang in zachte krullen', width: 800, height: 1067 },
      { src: '/images/demo/gallery-3.jpg', alt: 'Halflang haar met een gevlochten knoop, in warme koperkleur', width: 800, height: 1067 },
      { src: '/images/demo/gallery-4.jpg', alt: 'Opgestoken haar met een witte bloem', width: 800, height: 1067 },
      { src: '/images/demo/gallery-5.jpg', alt: 'Lang, golvend haar met veel volume', width: 800, height: 1067 },
      { src: '/images/demo/gallery-6.jpg', alt: 'Kapster en klant lachen samen in de salon', width: 800, height: 1067 },
    ],
  },

  reviews: {
    title: 'Wat klanten *zeggen*',
    summary: { rating: 4.9, count: 127, url: 'https://maps.google.com/' },
    items: [
      {
        author: 'Sarah V.',
        rating: 5,
        source: 'Google',
        text: 'Eindelijk een kapster die echt luistert. Mijn balayage is precies wat ik in gedachten had.',
      },
      {
        author: 'Tom D.',
        rating: 5,
        source: 'Google',
        text: 'Snel geholpen, fijne sfeer en een goede knipbeurt. Online boeken werkt heel handig.',
      },
      {
        author: 'Lien M.',
        rating: 5,
        source: 'Google',
        text: 'Mijn bruidskapsel bleef de hele dag zitten. De proefsessie gaf me veel rust.',
      },
    ],
  },

  contact: {
    title: 'Contact & *openingsuren*',
    intro: 'Vraag of opmerking? Stuur een bericht, we antwoorden binnen één werkdag.',
    form: { enabled: true, name: 'contact' },
    hours: {
      mon: [],
      tue: [['09:00', '18:00']],
      wed: [
        ['09:00', '12:30'],
        ['13:30', '18:00'],
      ],
      thu: [['09:00', '20:00']],
      fri: [['09:00', '18:00']],
      sat: [['08:30', '16:00']],
      sun: [],
    },
    hoursNote: 'Enkel op afspraak.',
    closures: [{ from: '2026-12-24', to: '2027-01-02', label: 'Kerstvakantie' }],
    map: {
      enabled: true,
      embedUrl:
        'https://www.openstreetmap.org/export/embed.html?bbox=5.3278%2C50.9257%2C5.3478%2C50.9357&layer=mapnik&marker=50.9307%2C5.3378',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=50.9307,5.3378',
    },
  },

  privacy: {
    lastUpdated: '2026-10-16',
  },
})
