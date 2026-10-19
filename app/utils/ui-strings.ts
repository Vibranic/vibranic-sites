import type { Locale, Weekday } from '../types/site-config'

/**
 * Every label that is NOT client content lives here, per locale.
 * Client content (names, prices, headings…) stays in site.config.ts.
 * Placeholders look like {name}; fill them with fill() from useUi().
 * Add a language: copy the `nl` block, translate, and add the locale to the type + UI map.
 */
const nl = {
  skipToContent: 'Ga naar de inhoud',
  homeLink: (name: string) => `${name}, naar de startpagina`,

  nav: {
    label: 'Hoofdmenu',
    menu: 'Menu',
    openMenu: 'Menu openen',
    closeMenu: 'Menu sluiten',
    services: 'Prijzen',
    about: 'Over ons',
    gallery: 'Werk',
    reviews: 'Reviews',
    contact: 'Contact',
    callUs: 'Bel {phone}',
  },

  newTab: '(opent in een nieuw tabblad)',

  days: {
    mon: { long: 'maandag', short: 'Ma' },
    tue: { long: 'dinsdag', short: 'Di' },
    wed: { long: 'woensdag', short: 'Wo' },
    thu: { long: 'donderdag', short: 'Do' },
    fri: { long: 'vrijdag', short: 'Vr' },
    sat: { long: 'zaterdag', short: 'Za' },
    sun: { long: 'zondag', short: 'Zo' },
  } as Record<Weekday, { long: string; short: string }>,

  services: {
    from: 'vanaf',
    min: 'min',
    hour: 'u',
    priceList: 'Prijslijst',
  },

  hero: {
    est: 'Est. {est}',
  },

  marquee: {
    label: 'Wat we doen',
  },

  gallery: {
    open: 'Vergroot foto: {alt}',
    dialogLabel: 'Fotogalerij',
    close: 'Sluiten',
    previous: 'Vorige foto',
    next: 'Volgende foto',
    counter: 'Foto {n} van {total}',
  },

  reviews: {
    stars: '{n} van 5 sterren',
    summary: '{rating} uit 5 op basis van {count} reviews',
    all: 'Bekijk alle reviews',
    sourcePrefix: 'via',
  },

  hours: {
    title: 'Openingsuren',
    closed: 'Gesloten',
    today: 'Vandaag',
    openNow: 'Nu open',
    openUntil: 'Nu open · tot {time}',
    closedOpens: 'Gesloten · opent {when} {time}',
    closedClosure: 'Gesloten ({label}) · opent {when} {time}',
    closedOnly: 'Gesloten',
    todayWord: 'vandaag',
    tomorrowWord: 'morgen',
    closuresTitle: 'Uitzonderlijk gesloten',
    closureRange: '{from} tot {to}',
    closureSingle: '{from}',
  },

  form: {
    title: 'Stuur een bericht',
    name: 'Naam',
    email: 'E-mailadres',
    phone: 'Telefoonnummer',
    message: 'Bericht',
    optional: '(optioneel)',
    submit: 'Verstuur',
    sending: 'Bezig met versturen…',
    honeypot: 'Laat dit veld leeg',
    errors: {
      summary: 'Het bericht is nog niet verstuurd. Controleer de gemarkeerde velden.',
      nameRequired: 'Vul je naam in, zodat we weten met wie we praten.',
      emailRequired: 'Vul je e-mailadres in, zodat we je kunnen antwoorden.',
      emailInvalid: 'Dit e-mailadres lijkt niet te kloppen. Gebruik de vorm naam@voorbeeld.be.',
      phoneInvalid: 'Dit telefoonnummer lijkt niet te kloppen. Gebruik enkel cijfers, spaties en een eventuele +, bv. 0470 12 34 56.',
      messageRequired: 'Schrijf kort waarmee we je kunnen helpen.',
    },
    successTitle: 'Bedankt, je bericht is verstuurd',
    successText: 'We hebben je bericht ontvangen en antwoorden zo snel mogelijk.',
    failedTitle: 'Je bericht kon niet verstuurd worden',
    failedText: 'Probeer het zo meteen opnieuw. Lukt het niet, neem dan rechtstreeks contact op:',
    privacyNote: 'We gebruiken je gegevens enkel om je te antwoorden.',
    privacyLink: 'Lees onze privacyverklaring',
  },

  map: {
    title: 'Kaart',
    iframeTitle: 'Kaart met de locatie van {name}',
    placeholderText: 'De kaart komt van OpenStreetMap. Pas als je klikt, maakt je browser verbinding met hun server.',
    load: 'Kaart laden',
    loadHint: 'Laadt een kaart van OpenStreetMap',
    directions: 'Route plannen',
  },

  footer: {
    contact: 'Contact',
    address: 'Adres',
    hours: 'Openingsuren',
    social: 'Volg ons',
    privacy: 'Privacyverklaring',
    credit: 'Website door Vibranic',
    legalLine: 'KBO {kbo}',
    vatLine: 'BTW {vat}',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
  },

  notFound: {
    title: 'Pagina niet gevonden',
    text: 'Deze pagina bestaat niet (meer). Misschien is het adres anders getypt of is de pagina verplaatst.',
    home: 'Terug naar de startpagina',
    errorTitle: 'Er ging iets mis',
    errorText: 'Probeer het later opnieuw of ga terug naar de startpagina.',
  },

  privacy: {
    pageTitle: 'Privacyverklaring',
    updated: 'Laatst bijgewerkt op {date}',
    intro: 'Op deze pagina leggen we in gewone taal uit welke persoonsgegevens we verwerken als je onze website gebruikt, waarom, en wat je rechten zijn.',
    controllerTitle: 'Wie is verantwoordelijk?',
    controllerText: '{legalName} is verantwoordelijk voor de verwerking van je gegevens.',
    controllerAddress: 'Adres',
    controllerKbo: 'Ondernemingsnummer (KBO)',
    controllerEmail: 'E-mail',
    dataTitle: 'Welke gegevens verzamelen we?',
    dataText: 'Enkel de gegevens die je zelf invult in het contactformulier: je naam, e-mailadres, eventueel je telefoonnummer en je bericht. Daarmee kunnen we je antwoorden. We gebruiken ze niet voor reclame en we verkopen ze niet door.',
    dataNoForm: 'Deze website heeft geen formulieren waarmee je gegevens kan doorsturen.',
    processorTitle: 'Wie verwerkt het formulier?',
    processorText: 'Een bericht via het contactformulier wordt via onze hostingprovider, Netlify, afgeleverd bij ons. Netlify verwerkt je bericht in onze opdracht, enkel om het te bezorgen.',
    retentionTitle: 'Hoelang bewaren we je gegevens?',
    retentionText: 'Zolang nodig om je vraag te beantwoorden, en nooit langer dan 12 maanden.',
    rightsTitle: 'Je rechten',
    rightsText: 'Je kan ons altijd vragen om je gegevens in te kijken, te verbeteren of te verwijderen, of om je tegen de verwerking te verzetten. Stuur daarvoor een mail naar {email}.',
    complaintText: 'Ben je niet tevreden over hoe we met je gegevens omgaan? Dan kan je een klacht indienen bij de Gegevensbeschermingsautoriteit:',
    complaintLink: 'gegevensbeschermingsautoriteit.be',
    complaintUrl: 'https://www.gegevensbeschermingsautoriteit.be',
    cookiesTitle: 'Cookies',
    cookiesText: 'Deze website gebruikt geen cookies.',
    mapTitle: 'Kaart',
    mapText: 'De kaart op onze contactpagina komt van OpenStreetMap. Ze wordt pas geladen als je zelf op "Kaart laden" klikt. Vanaf dat moment ontvangt OpenStreetMap je IP-adres, zoals bij elke website die je bezoekt. Klik je niet, dan wordt er niets bij hen geladen.',
    backHome: 'Terug naar de startpagina',
  },
}

export type UiStrings = typeof nl

const en: UiStrings = {
  skipToContent: 'Skip to content',
  homeLink: (name: string) => `${name}, go to the home page`,

  nav: {
    label: 'Main menu',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    services: 'Prices',
    about: 'About us',
    gallery: 'Work',
    reviews: 'Reviews',
    contact: 'Contact',
    callUs: 'Call {phone}',
  },

  newTab: '(opens in a new tab)',

  days: {
    mon: { long: 'Monday', short: 'Mon' },
    tue: { long: 'Tuesday', short: 'Tue' },
    wed: { long: 'Wednesday', short: 'Wed' },
    thu: { long: 'Thursday', short: 'Thu' },
    fri: { long: 'Friday', short: 'Fri' },
    sat: { long: 'Saturday', short: 'Sat' },
    sun: { long: 'Sunday', short: 'Sun' },
  },

  services: {
    from: 'from',
    min: 'min',
    hour: 'h',
    priceList: 'Price list',
  },

  hero: {
    est: 'Est. {est}',
  },

  marquee: {
    label: 'What we do',
  },

  gallery: {
    open: 'Enlarge photo: {alt}',
    dialogLabel: 'Photo gallery',
    close: 'Close',
    previous: 'Previous photo',
    next: 'Next photo',
    counter: 'Photo {n} of {total}',
  },

  reviews: {
    stars: '{n} out of 5 stars',
    summary: '{rating} out of 5 based on {count} reviews',
    all: 'See all reviews',
    sourcePrefix: 'via',
  },

  hours: {
    title: 'Opening hours',
    closed: 'Closed',
    today: 'Today',
    openNow: 'Open now',
    openUntil: 'Open now · until {time}',
    closedOpens: 'Closed · opens {when} {time}',
    closedClosure: 'Closed ({label}) · opens {when} {time}',
    closedOnly: 'Closed',
    todayWord: 'today',
    tomorrowWord: 'tomorrow',
    closuresTitle: 'Exceptionally closed',
    closureRange: '{from} to {to}',
    closureSingle: '{from}',
  },

  form: {
    title: 'Send a message',
    name: 'Name',
    email: 'Email address',
    phone: 'Phone number',
    message: 'Message',
    optional: '(optional)',
    submit: 'Send',
    sending: 'Sending…',
    honeypot: 'Leave this field empty',
    errors: {
      summary: 'Your message has not been sent yet. Please check the marked fields.',
      nameRequired: 'Enter your name so we know who we are talking to.',
      emailRequired: 'Enter your email address so we can reply.',
      emailInvalid: 'This email address does not look right. Use the form name@example.com.',
      phoneInvalid: 'This phone number does not look right. Use digits, spaces and an optional +, e.g. 0470 12 34 56.',
      messageRequired: 'Briefly tell us how we can help.',
    },
    successTitle: 'Thank you, your message has been sent',
    successText: 'We received your message and will reply as soon as possible.',
    failedTitle: 'Your message could not be sent',
    failedText: 'Please try again in a moment. If it keeps failing, contact us directly:',
    privacyNote: 'We only use your details to reply to you.',
    privacyLink: 'Read our privacy statement',
  },

  map: {
    title: 'Map',
    iframeTitle: 'Map showing the location of {name}',
    placeholderText: 'The map comes from OpenStreetMap. Your browser only connects to their server after you click.',
    load: 'Load map',
    loadHint: 'Loads a map from OpenStreetMap',
    directions: 'Get directions',
  },

  footer: {
    contact: 'Contact',
    address: 'Address',
    hours: 'Opening hours',
    social: 'Follow us',
    privacy: 'Privacy statement',
    credit: 'Website by Vibranic',
    legalLine: 'Company no. {kbo}',
    vatLine: 'VAT {vat}',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
  },

  notFound: {
    title: 'Page not found',
    text: 'This page does not exist (anymore). The address may be mistyped or the page may have moved.',
    home: 'Back to the home page',
    errorTitle: 'Something went wrong',
    errorText: 'Please try again later or go back to the home page.',
  },

  privacy: {
    pageTitle: 'Privacy statement',
    updated: 'Last updated on {date}',
    intro: 'This page explains in plain language which personal data we process when you use our website, why, and what your rights are.',
    controllerTitle: 'Who is responsible?',
    controllerText: '{legalName} is responsible for processing your data.',
    controllerAddress: 'Address',
    controllerKbo: 'Company number (KBO)',
    controllerEmail: 'Email',
    dataTitle: 'What data do we collect?',
    dataText: 'Only what you enter yourself in the contact form: your name, email address, optionally your phone number, and your message. We use it to reply to you. We do not use it for advertising and we do not sell it.',
    dataNoForm: 'This website has no forms that send us your data.',
    processorTitle: 'Who processes the form?',
    processorText: 'A message sent through the contact form is delivered to us by our hosting provider, Netlify. Netlify processes your message on our behalf, only to deliver it.',
    retentionTitle: 'How long do we keep your data?',
    retentionText: 'As long as needed to answer your question, and never longer than 12 months.',
    rightsTitle: 'Your rights',
    rightsText: 'You can ask us at any time to see, correct or delete your data, or to object to the processing. Email us at {email}.',
    complaintText: 'Not happy with how we handle your data? You can file a complaint with the Belgian Data Protection Authority:',
    complaintLink: 'gegevensbeschermingsautoriteit.be',
    complaintUrl: 'https://www.gegevensbeschermingsautoriteit.be',
    cookiesTitle: 'Cookies',
    cookiesText: 'This website does not use cookies.',
    mapTitle: 'Map',
    mapText: 'The map on our contact section comes from OpenStreetMap. It only loads when you click "Load map". From that moment OpenStreetMap receives your IP address, like any website you visit. If you do not click, nothing is loaded from them.',
    backHome: 'Back to the home page',
  },
}

export const UI: Record<Locale, UiStrings> = { nl, en }

/** Replace {placeholders} in a UI string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}
