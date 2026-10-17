<script setup lang="ts">
import type { ThemePreset } from '~/types/site-config'
import { THEME_META, THEME_PRESETS } from '~/composables/useTheme'

/**
 * Living style guide. Part 1 shows the Fresh flagship art direction: the hero
 * variants, section variants and every signature element, built ONLY from kit
 * classes (signature.css + compositions.css), so it doubles as the markup
 * reference for frontend (DESIGN.md). Part 2 shows every preset's tokens.
 * Kilian also uses it with prospects, so copy is Dutch. Not linked, not indexed.
 */
useHead({
  title: 'Stijlgids · Vibranic',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

/** Unique ids for the SVG textPaths of the rotating badges. */
const uid = useId()

const active = ref<ThemePreset>(useSite().site.theme.preset)

const marqueeItems = ['Knippen', 'Kleuren', 'Balayage', 'Brushing', 'Bruidskapsels', 'Lash lift']
const marqueeItems2 = ['Online in 7 dagen', 'Jouw stijl', 'Mobiel eerst', 'Snel als de bliksem']
const doodles = ['arrow-curve', 'arrow-loop', 'sparkle', 'sparkles', 'underline', 'swirl', 'motion-lines', 'scribble-circle', 'dash-trail']

const menu = [
  {
    name: 'Knippen',
    items: [
      { name: 'Dames knippen & brushing', price: 52, meta: '60 min' },
      { name: 'Heren knippen', price: 29, meta: '30 min' },
      { name: 'Kinderen (tot 12 jaar)', price: 18, meta: '30 min' },
    ],
  },
  {
    name: 'Kleuren',
    items: [
      { name: 'Uitgroei kleuren', price: 55, from: true, meta: '75 min · incl. verzorging' },
      { name: 'Balayage', price: 140, from: true, meta: '180 min · met toner' },
      { name: 'Toner / gloss', price: 35, meta: '30 min' },
    ],
  },
]

const swatches = [
  { token: '--color-bg', label: 'Achtergrond' },
  { token: '--color-surface', label: 'Vlak' },
  { token: '--color-surface-alt', label: 'Vlak alt' },
  { token: '--color-text', label: 'Tekst' },
  { token: '--color-text-muted', label: 'Tekst zacht' },
  { token: '--color-accent', label: 'Accent' },
  { token: '--color-accent-hover', label: 'Accent hover' },
  { token: '--color-on-accent', label: 'Op accent' },
  { token: '--color-pop', label: 'Pop (fel)' },
  { token: '--color-ink', label: 'Inkt' },
  { token: '--color-invert-bg', label: 'Inkt-band' },
  { token: '--color-highlight', label: 'Highlight' },
  { token: '--color-border', label: 'Lijn' },
  { token: '--color-border-strong', label: 'Lijn sterk' },
  { token: '--color-error', label: 'Fout' },
]

// [foreground, background, minimum ratio, what it's used for]
const pairs: [string, string, number, string][] = [
  ['--color-text', '--color-bg', 4.5, 'Lopende tekst'],
  ['--color-text-muted', '--color-bg', 4.5, 'Zachte tekst'],
  ['--color-accent', '--color-bg', 4.5, 'Links, eyebrow'],
  ['--btn-primary-fg', '--btn-primary-bg', 4.5, 'Primaire knop'],
  ['--btn-primary-fg', '--btn-primary-bg-hover', 4.5, 'Knop hover'],
  ['--color-on-pop', '--color-pop', 4.5, 'Sticker, marquee, hero'],
  ['--color-text', '--color-surface-alt', 4.5, 'Tekst op alt-sectie'],
  ['--color-text-muted', '--color-surface-alt', 4.5, 'Zacht op alt-sectie'],
  ['--color-accent', '--color-surface-alt', 4.5, 'Accent op alt-sectie'],
  ['--color-invert-text', '--color-invert-bg', 4.5, 'Tekst op inkt-band'],
  ['--color-invert-muted', '--color-invert-bg', 4.5, 'Zacht op inkt-band'],
  ['--color-invert-accent', '--color-invert-bg', 4.5, 'Prijs op inkt-band'],
  ['--color-text', '--color-highlight', 4.5, 'Badge'],
  ['--color-error', '--color-bg', 4.5, 'Foutmelding'],
  ['--color-border-strong', '--color-bg', 3, 'Rand invoerveld'],
  ['--color-border-strong', '--color-surface-alt', 3, 'Rand op alt-sectie'],
]

const typeScale = [
  { cls: 'giant', token: '--text-giant', sample: 'Noor' },
  { cls: 'display', token: '--text-display', sample: 'Knippen & kleur' },
  { cls: 'h1', token: '--h1-size', sample: 'Haar dat bij jou past' },
  { cls: 'h2', token: '--h2-size', sample: 'Behandelingen & prijzen' },
  { cls: 'h3', token: '--h3-size', sample: 'Balayage met toner' },
  { cls: 'lead', token: '--text-md', sample: 'Rustige salon, eerlijk advies en kleur die lang mooi blijft.' },
  { cls: '', token: '--text-base', sample: 'Lopende tekst. Twijfel je over een nieuwe kleur? Kom gerust eerst langs voor gratis advies.' },
  { cls: 'eyebrow', token: '--text-xs', sample: 'Kapsalon · Hasselt' },
  { cls: 'label-mono', token: '--label-size', sample: '50.93°N 5.34°E · Est. 2019' },
]

const radii = ['--radius-btn', '--radius-input', '--radius-card', '--radius-image', '--radius-feature']
const spaces = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-8', '--space-10', '--space-12']

// ── Live contrast: read computed colors, so overrides are checked too ──
const ratios = ref<Record<number, number>>({})
const tokenValues = ref<Record<string, string>>({})
const detailEl = ref<HTMLElement>()

function luminance(rgb: string): number {
  const [r = 0, g = 0, b = 0] = (rgb.match(/[\d.]+/g) ?? []).map(Number)
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100
}

function measure() {
  const next: Record<number, number> = {}
  detailEl.value?.querySelectorAll<HTMLElement>('[data-pair]').forEach((el) => {
    const cs = getComputedStyle(el)
    next[Number(el.dataset.pair)] = contrast(cs.color, cs.backgroundColor)
  })
  ratios.value = next
  if (detailEl.value) {
    const cs = getComputedStyle(detailEl.value)
    tokenValues.value = Object.fromEntries(swatches.map((s) => [s.token, cs.getPropertyValue(s.token).trim()]))
  }
}

onMounted(measure)
watch(active, () => nextTick(measure))
</script>

<template>
  <div class="sg">
    <a class="skip-link" href="#varianten">Naar de hero-varianten</a>

    <!-- ═══ PART 1 · FRESH flagship. Built from kit classes only, so this is
         also the markup reference for frontend (DESIGN.md §4). ═══ -->
    <div data-theme="fresh" class="grain grain--local sg-fresh">
      <!-- Cover -->
      <header class="section sg-cover">
        <div class="container container--wide stack" style="--stack-gap: var(--space-5)">
          <div class="meta-row label-mono label-mono--ink">
            <span>Vibranic · Stijlgids</span>
            <span class="sg-hide-sm">Websites voor Limburgse zaken</span>
            <span class="tag-est">Ed. 02 · 2026</span>
          </div>
          <span class="rule-dashed" aria-hidden="true" />
          <div class="fit-box sg-cover__word">
            <h1 class="giant giant--fit" style="--chars: 4.94">Fresh</h1>
            <span class="sticker decor sg-cover__sticker" aria-hidden="true">Vlaggenschip</span>
            <span class="doodle doodle--sparkles decor sg-cover__spark" aria-hidden="true" />
          </div>
          <div class="sg-cover__row">
            <p class="h2 sg-cover__lead">Het eigen <em>magazine</em> van je salon.</p>
            <p class="lead">
              Papier, inkt en één felle limoenkleur. Reuzentype als uithangbord, stickers en krabbels in de
              kantlijn. Alles hieronder stuur je per klant vanuit <code>site.config.ts</code>.
            </p>
            <a class="spin-badge spin-badge--pop sg-cover__badge" href="#varianten" aria-label="Naar de hero-varianten">
              <svg class="spin-badge__ring" viewBox="0 0 200 200" aria-hidden="true">
                <defs><path :id="`${uid}-c`" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" /></defs>
                <text><textPath :href="`#${uid}-c`" textLength="500" lengthAdjust="spacing">Scroll naar beneden • Scroll naar beneden • </textPath></text>
              </svg>
              <span class="spin-badge__core" aria-hidden="true"><span class="icon-arrow" style="rotate: 90deg" /></span>
            </a>
          </div>
        </div>
      </header>

      <div class="marquee" role="group" aria-label="Behandelingen">
        <div class="marquee__track">
          <ul v-for="copy in 2" :key="copy" class="marquee__group" role="list" :aria-hidden="copy === 2 ? 'true' : undefined">
            <template v-for="item in marqueeItems" :key="item">
              <li>{{ item }}</li>
              <li class="doodle doodle--sparkle" aria-hidden="true" />
            </template>
          </ul>
        </div>
      </div>

      <!-- ── 01 · Hero variants ── -->
      <section id="varianten" aria-labelledby="varianten-title">
        <div class="section section--tight">
          <div class="container container--wide stack" style="--stack-gap: var(--space-3)">
            <span class="eyebrow">01 · Hero</span>
            <h2 id="varianten-title" class="h2">Drie hero's, <em>één</em> config-regel</h2>
            <p class="muted measure">Kies met <code>hero.variant</code>. Elke variant werkt in elke stijl; hier in Fresh.</p>
          </div>
        </div>

        <!-- A · giant-type-cutout + illustration (vibranic.be) -->
        <p class="sg-tag label-mono label-mono--ink"><span>A</span> hero.variant = 'giant-type-cutout' · illustratie (vibranic.be)</p>
        <div class="section hero-giant">
          <div class="container container--wide hero-giant__inner" style="--chars: 7.54">
            <div class="meta-row label-mono hero-giant__meta">
              <span>Webstudio — Limburg</span>
              <span class="sg-hide-sm">50.93°N 5.34°E</span>
              <span>Est. 2026</span>
            </div>
            <div class="hero-giant__stage">
              <p class="giant hero-giant__word" aria-hidden="true" data-intro>Vibranic</p>
              <div class="cutout hero-giant__cutout" data-intro style="--intro-delay: 120ms; --intro-distance: 12%">
                <img src="/images/brand/vibranic-character.png" alt="Het Vibranic-personage: figuur met blauwe hoodie, koptelefoon en zonnebril" width="550" height="550">
              </div>
              <span class="doodle doodle--motion-lines decor" aria-hidden="true" style="--x: 21%; --y: 40%; --doodle-size: clamp(2.5rem, 6vw, 5.5rem); --r: -8deg" />
              <span class="doodle doodle--sparkles decor" aria-hidden="true" style="--x: 73%; --y: 34%; --doodle-size: clamp(2rem, 4vw, 3.75rem)" />
              <span class="sticker decor sg-hide-sm" aria-hidden="true" style="--x: 63%; --y: 74%; --sticker-rotate: 6deg; --sticker-bg: var(--color-surface); --sticker-fg: var(--color-ink)">Nieuw in Limburg</span>
              <a class="spin-badge hero-giant__badge" href="#varianten" aria-label="Vraag je demo aan">
                <svg class="spin-badge__ring" viewBox="0 0 200 200" aria-hidden="true">
                  <defs><path :id="`${uid}-a`" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" /></defs>
                  <text><textPath :href="`#${uid}-a`" textLength="500" lengthAdjust="spacing">Vraag je demo aan • Vraag je demo aan • </textPath></text>
                </svg>
                <span class="spin-badge__core" aria-hidden="true"><span class="icon-arrow icon-arrow--ne" /></span>
              </a>
            </div>
            <div class="hero-giant__copy">
              <p class="h1">Websites met <em>karakter</em> voor Limburgse zaken</p>
              <p>Een site die past bij je zaak, online binnen 7 dagen.</p>
              <div class="cluster">
                <a class="btn btn--primary" href="#varianten">Bekijk voorbeelden</a>
                <a class="btn btn--secondary" href="#varianten">Plan een gesprek</a>
              </div>
            </div>
          </div>
        </div>

        <!-- A2 · giant-type-cutout + normal photo (shaped fallback) -->
        <p class="sg-tag label-mono label-mono--ink"><span>A2</span> zelfde variant · gewone foto → blob-venster (cutout.kind = 'shaped')</p>
        <div class="section hero-giant" style="--hero-bg: var(--color-surface-alt); --hero-fg: var(--color-ink)">
          <div class="container container--wide hero-giant__inner" style="--chars: 4.43">
            <div class="meta-row label-mono hero-giant__meta">
              <span>Kapsalon — Hasselt</span>
              <span class="sg-hide-sm">Di – za · op afspraak</span>
              <span>Est. 2019</span>
            </div>
            <div class="hero-giant__stage" style="--cutout-overlap: 0.4">
              <p class="giant hero-giant__word" aria-hidden="true">Noor</p>
              <div class="cutout cutout--shaped cutout--photo hero-giant__cutout" style="--cutout-width: min(64%, 22rem)">
                <img src="/images/demo/hero.jpg" alt="Kapster die het haar van een klant föhnt" width="1600" height="1067" loading="lazy">
              </div>
              <span class="doodle doodle--swirl decor" aria-hidden="true" style="--x: 72%; --y: 44%; --doodle-size: clamp(2.5rem, 5vw, 4.5rem)" />
              <span class="sticker sticker--ink decor sg-hide-sm" aria-hidden="true" style="--x: 64%; --y: 80%">Balayage-specialist</span>
            </div>
            <div class="hero-giant__copy">
              <p class="h1">Haar dat <em>bij jou</em> past</p>
              <p>Rustige salon, eerlijk advies en kleur die lang mooi blijft.</p>
              <div class="cluster">
                <a class="btn btn--primary" href="#varianten">Maak een afspraak</a>
              </div>
            </div>
          </div>
        </div>

        <!-- B · framed-card -->
        <p class="sg-tag label-mono label-mono--ink"><span>B</span> hero.variant = 'framed-card' · foto met navigatie erover</p>
        <div class="hero-card">
          <div class="hero-card__frame invert">
            <div class="hero-card__media">
              <img src="/images/demo/gallery-2.jpg" alt="" width="1200" height="1500" loading="lazy">
            </div>
            <div class="hero-card__top">
              <a class="hero-card__brand" href="#varianten">Studio Noor</a>
              <nav class="hero-card__nav label-mono label-mono--ink" aria-label="Voorbeeldmenu">
                <a class="link-draw" href="#varianten">Prijzen</a>
                <a class="link-draw" href="#varianten">Over ons</a>
                <a class="link-draw" href="#varianten">Contact</a>
              </nav>
              <a class="btn btn--primary" href="#varianten">Afspraak</a>
            </div>
            <div class="fit-box hero-card__word">
              <p class="giant giant--fit" aria-hidden="true" style="--chars: 4.43">Noor</p>
            </div>
            <div class="hero-card__bottom">
              <div class="hero-card__copy">
                <span class="eyebrow">Kapsalon · Hasselt</span>
                <p class="h1">Haar dat <em>bij jou</em> past</p>
                <a class="cta-pill" href="#varianten">
                  Bekijk prijzen
                  <span class="cta-pill__icon" aria-hidden="true"><span class="icon-arrow" /></span>
                </a>
              </div>
              <a class="spin-badge spin-badge--pop hero-card__badge" href="#varianten" aria-label="Maak een afspraak">
                <svg class="spin-badge__ring" viewBox="0 0 200 200" aria-hidden="true">
                  <defs><path :id="`${uid}-b`" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" /></defs>
                  <text><textPath :href="`#${uid}-b`" textLength="500" lengthAdjust="spacing">Maak een afspraak • Maak een afspraak • </textPath></text>
                </svg>
                <span class="spin-badge__core" aria-hidden="true"><span class="icon-arrow icon-arrow--ne" /></span>
              </a>
            </div>
          </div>
        </div>

        <!-- C · collage -->
        <p class="sg-tag label-mono label-mono--ink"><span>C</span> hero.variant = 'collage' · gedraaid fotokader + stickertype</p>
        <div class="section hero-collage">
          <div class="container container--wide hero-collage__inner">
            <p class="hero-collage__title giant--outline">Knip, <em>kleur</em> &amp; klaar</p>
            <div class="hero-collage__media">
              <div class="frame hero-collage__frame">
                <img src="/images/demo/hero.jpg" alt="Kapster die het haar van een klant föhnt in een lichte salon" width="1600" height="1067" loading="lazy">
              </div>
              <span class="sticker sticker--vertical sticker--ink hero-collage__vsticker" aria-hidden="true">Kapsalon · Hasselt</span>
              <span class="hero-collage__letters">
                <span class="sticker-letters" aria-hidden="true"><span>N</span><span>i</span><span>e</span><span>u</span><span>w</span></span>
                <span class="sr-only">Nieuw</span>
              </span>
            </div>
            <div class="hero-collage__copy">
              <p class="lead">Rustige salon, eerlijk advies en kleur die lang mooi blijft. Je bent welkom van dinsdag tot zaterdag.</p>
              <div class="cluster">
                <a class="btn btn--primary btn--lg" href="#varianten">Maak een afspraak</a>
                <a class="btn btn--ghost" href="#varianten">Bekijk prijzen</a>
              </div>
              <span class="doodle doodle--arrow-loop hero-collage__arrow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <div class="marquee marquee--ink marquee--tilt marquee--reverse" role="group" aria-label="Wat je krijgt">
        <div class="marquee__track">
          <ul v-for="copy in 2" :key="copy" class="marquee__group" role="list" :aria-hidden="copy === 2 ? 'true' : undefined">
            <template v-for="item in marqueeItems2" :key="item">
              <li>{{ item }}</li>
              <li class="doodle doodle--swirl" aria-hidden="true" />
            </template>
          </ul>
        </div>
      </div>

      <!-- ── 02 · Services: menu-board ── -->
      <p class="sg-tag label-mono label-mono--ink"><span>02</span> services.variant = 'menu-board' · inkt-band + topo + gescheurde rand</p>
      <section class="section section--invert texture-topo" data-edge="torn" aria-labelledby="menu-title">
        <div class="container container--wide">
          <div class="menu-board__head">
            <div class="stack">
              <span class="eyebrow">Prijslijst · incl. btw</span>
              <h2 id="menu-title" class="h2">Behandelingen &amp; <em>prijzen</em></h2>
            </div>
            <p class="muted">Lang of dik haar? We bespreken het vooraf, zonder verrassingen.</p>
          </div>
          <div class="menu-board__cols">
            <div v-for="cat in menu" :key="cat.name" class="menu-board__cat">
              <h3 class="menu-board__cat-title"><span class="sticker">{{ cat.name }}</span></h3>
              <ul class="menu-board__list" role="list">
                <li v-for="row in cat.items" :key="row.name" class="menu-row">
                  <span class="menu-row__name">{{ row.name }}</span>
                  <span class="leader" aria-hidden="true" />
                  <span class="menu-row__price"><small v-if="row.from">vanaf</small>€&nbsp;{{ row.price }}</span>
                  <span class="menu-row__meta label-mono">{{ row.meta }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 03 · About: torn-frame ── -->
      <p class="sg-tag label-mono label-mono--ink"><span>03</span> about.variant = 'torn-frame' · tape, stat-stickers, notitie</p>
      <section class="section" data-edge="wavy" aria-labelledby="about-title">
        <div class="container container--wide about-torn__grid">
          <div class="stack" style="--stack-gap: var(--space-5)">
            <span class="eyebrow">Over ons</span>
            <h2 id="about-title" class="h2">Een salon waar je <em class="scribbled">even</em> tot rust komt</h2>
            <p class="measure">Noor opende de salon in 2019 met één stoel en een grote liefde voor kleur. Vandaag zijn we met drie, maar de aanpak bleef dezelfde: eerst luisteren, dan knippen.</p>
            <p class="measure muted">We werken met verzorgende producten en nemen de tijd voor advies. Twijfel je? Kom gerust eerst langs.</p>
            <p class="about-torn__note" aria-hidden="true">dat zijn wij! <span class="doodle doodle--arrow-curve" style="--doodle-size: 4.5rem" /></p>
          </div>
          <div class="about-torn__media">
            <span class="tape about-torn__tape" aria-hidden="true" />
            <div class="frame frame--torn about-torn__photo">
              <img src="/images/demo/about.jpg" alt="Noor in haar salon" width="1200" height="1500" loading="lazy">
            </div>
            <ul class="about-torn__stats" role="list">
              <li class="sticker sticker--stat"><strong>7 jaar</strong><span class="label-mono">in Hasselt</span></li>
              <li class="sticker sticker--stat sticker--paper"><strong>4,9★</strong><span class="label-mono">212 reviews</span></li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ── 04 · Gallery: collage ── -->
      <p class="sg-tag label-mono label-mono--ink"><span>04</span> gallery.variant = 'collage' · desktop verspreid, mobiel strak raster</p>
      <section class="section section--alt" data-edge="scallop" aria-labelledby="gallery-title">
        <div class="container container--wide stack" style="--stack-gap: var(--space-6)">
          <div class="meta-row">
            <h2 id="gallery-title" class="h2">Recent <em>werk</em></h2>
            <span class="label-mono label-mono--ink">@studionoor · Instagram</span>
          </div>
          <ul class="gallery-collage" role="list">
            <li v-for="n in 6" :key="n">
              <div class="frame">
                <img :src="`/images/demo/gallery-${n}.jpg`" :alt="`Voorbeeld van ons werk ${n}`" width="1200" height="1500" loading="lazy">
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- ── 05 · Signature elements catalogue ── -->
      <section class="section" data-edge="torn" aria-labelledby="kit-title">
        <div class="container container--wide stack" style="--stack-gap: var(--space-8)">
          <div class="stack" style="--stack-gap: var(--space-3)">
            <span class="eyebrow">05 · Signatuur-elementen</span>
            <h2 id="kit-title" class="h2">De <em>handgemaakte</em> laag</h2>
            <p class="muted measure">Eén keer gebouwd, bruikbaar in elke stijl. Kleur, rand en schaduw komen uit de tokens van de actieve stijl.</p>
          </div>

          <div class="sg-specs">
            <div class="sg-spec">
              <p class="label-mono">.spin-badge · --pop · in .invert</p>
              <div class="cluster" style="--cluster-gap: var(--space-5)">
                <a class="spin-badge" href="#kit-title" aria-label="Maak een afspraak">
                  <svg class="spin-badge__ring" viewBox="0 0 200 200" aria-hidden="true">
                    <defs><path :id="`${uid}-d`" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" /></defs>
                    <text><textPath :href="`#${uid}-d`" textLength="500" lengthAdjust="spacing">Maak een afspraak • Maak een afspraak • </textPath></text>
                  </svg>
                  <span class="spin-badge__core" aria-hidden="true"><span class="icon-arrow icon-arrow--ne" /></span>
                </a>
                <span class="invert sg-invert-chip">
                  <a class="spin-badge spin-badge--pop" href="#kit-title" aria-label="Bel ons">
                    <svg class="spin-badge__ring" viewBox="0 0 200 200" aria-hidden="true">
                      <defs><path :id="`${uid}-e`" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" /></defs>
                      <text><textPath :href="`#${uid}-e`" textLength="500" lengthAdjust="spacing">Bel ons even • Bel ons even • Bel ons even • </textPath></text>
                    </svg>
                    <span class="spin-badge__core" aria-hidden="true"><span class="icon-arrow" /></span>
                  </a>
                </span>
              </div>
            </div>

            <div class="sg-spec">
              <p class="label-mono">.sticker · --ink · --paper --pill · --vertical · -burst · -letters · .tape</p>
              <div class="cluster" style="--cluster-gap: var(--space-5)">
                <span class="sticker">Nieuw</span>
                <span class="sticker sticker--ink sticker--right">Lash lift</span>
                <span class="sticker sticker--paper sticker--pill">-15% op dinsdag</span>
                <span class="sticker sticker--vertical">Hasselt</span>
                <span class="sticker-burst"><span>Gratis<br>advies</span></span>
                <span class="sticker-letters" style="font-size: var(--text-xl)" aria-hidden="true"><span>W</span><span>o</span><span>w</span></span>
                <span class="tape" aria-hidden="true" />
              </div>
            </div>

            <div class="sg-spec sg-spec--wide">
              <p class="label-mono">.doodle--* (kleur = --doodle-color)</p>
              <ul class="sg-doodles" role="list">
                <li v-for="d in doodles" :key="d">
                  <span class="doodle" :class="`doodle--${d}`" aria-hidden="true" />
                  <code>{{ d }}</code>
                </li>
              </ul>
            </div>

            <div class="sg-spec sg-spec--wide">
              <p class="label-mono">[data-edge="torn | wavy | scallop"] · .rule-dashed · .leader</p>
              <div class="sg-edges">
                <div v-for="e in ['torn', 'wavy', 'scallop']" :key="e" class="sg-edge-demo" :data-edge="e">
                  <code>{{ e }}</code>
                </div>
              </div>
              <span class="rule-dashed" aria-hidden="true" />
              <p class="cluster sg-leader-demo"><span>Brushing</span><span class="leader" aria-hidden="true" /><strong>€ 30</strong></p>
            </div>

            <div class="sg-spec">
              <p class="label-mono">.label-mono · .meta-row · .tag-est · .rail</p>
              <div class="meta-row label-mono label-mono--ink">
                <span>Op afspraak — di tot za</span>
                <span class="tag-est">Est. 2019</span>
              </div>
              <p class="label-mono">50.93°N 5.34°E · Hasselt, BE</p>
              <p class="rail label-mono" aria-hidden="true">Studio Noor — Kapsalon — Hasselt</p>
            </div>

            <div class="sg-spec">
              <p class="label-mono">.btn--primary (hover: optillen, klik: indrukken) · .cta-pill · .link-draw</p>
              <div class="cluster" style="--cluster-gap: var(--space-4)">
                <button type="button" class="btn btn--primary">Maak een afspraak</button>
                <button type="button" class="btn btn--secondary">Bekijk prijzen</button>
                <a class="cta-pill" href="#kit-title">Ontdek de salon<span class="cta-pill__icon" aria-hidden="true"><span class="icon-arrow" /></span></a>
                <a class="link-draw" href="#kit-title">Route plannen</a>
              </div>
            </div>

            <div class="sg-spec sg-spec--wide">
              <p class="label-mono">.frame · .frame--polaroid · .frame--torn · .cutout--shaped</p>
              <div class="sg-frames">
                <div class="frame"><img src="/images/demo/gallery-3.jpg" alt="" width="1200" height="1500" loading="lazy"></div>
                <figure class="frame frame--polaroid frame--right">
                  <img src="/images/demo/gallery-4.jpg" alt="" width="1200" height="1500" loading="lazy">
                  <figcaption class="frame__caption label-mono label-mono--ink">Balayage · maart</figcaption>
                </figure>
                <div class="frame frame--torn"><img src="/images/demo/gallery-5.jpg" alt="" width="1200" height="1500" loading="lazy"></div>
                <div class="cutout cutout--shaped"><img src="/images/demo/gallery-6.jpg" alt="" width="1200" height="1500" loading="lazy"></div>
              </div>
            </div>

            <div class="sg-spec sg-spec--wide fit-box">
              <p class="label-mono">.giant--fit (--chars) · .giant--outline · em = Instrument Serif · .circled</p>
              <p class="giant giant--fit" style="--chars: 7.05">Kapsels</p>
              <p class="giant giant--outline" style="font-size: var(--text-4xl)">Zine</p>
              <p class="h2">Haar dat <em>bij jou</em> past, <em class="circled">elke</em> keer</p>
            </div>

            <div class="sg-spec">
              <p class="label-mono">.grain (papierkorrel) · .texture-topo</p>
              <div class="sg-textures">
                <div class="grain grain--local sg-texture" style="--grain-opacity: 0.4"><code>grain</code></div>
                <div class="texture-topo sg-texture" style="--texture-opacity: 0.4"><code>topo</code></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ═══ PART 2 · the three presets + all tokens ═══ -->
    <section id="stijlen" class="sg-compare" aria-label="De drie stijlen naast elkaar">
      <article v-for="key in THEME_PRESETS" :key="key" :data-theme="key" class="sg-postcard">
        <div class="stack" style="--stack-gap: var(--space-5)">
          <div class="cluster sg-postcard__top">
            <span class="eyebrow">Stijl · {{ THEME_META[key].label }}</span>
            <span class="badge">{{ THEME_META[key].display }} + {{ THEME_META[key].body }}</span>
          </div>
          <div class="media media--feature sg-ph" role="img" :aria-label="`Voorbeeldfoto in stijl ${THEME_META[key].label}`" />
          <h2 class="h2">Haar dat <em>bij jou</em> past</h2>
          <p class="muted">{{ THEME_META[key].personality }}</p>
          <p class="label-mono">{{ THEME_META[key].concept }}</p>
          <span class="divider" aria-hidden="true" />
          <div class="cluster">
            <a class="btn btn--primary" href="#detail" @click="active = key">Bekijk {{ THEME_META[key].label }}</a>
            <a class="btn btn--ghost" href="#detail" @click="active = key">Details</a>
          </div>
        </div>
      </article>
    </section>

    <!-- Detail: every token + primitive for one preset -->
    <section id="detail" class="section" aria-labelledby="detail-title">
      <div class="container stack" style="--stack-gap: var(--space-6)">
        <div class="cluster sg-switch" role="group" aria-label="Kies een stijl">
          <h2 id="detail-title" class="h3">Details per stijl</h2>
          <button
            v-for="key in THEME_PRESETS"
            :key="key"
            type="button"
            class="btn"
            :class="active === key ? 'btn--primary' : 'btn--secondary'"
            :aria-pressed="active === key"
            @click="active = key"
          >
            {{ THEME_META[key].label }}
          </button>
        </div>
      </div>

      <div ref="detailEl" :data-theme="active" class="sg-detail">
        <!-- Colors -->
        <div class="section">
          <div class="container stack" style="--stack-gap: var(--space-6)">
            <div class="stack">
              <span class="eyebrow">Kleur</span>
              <h3 class="h2">Palet · {{ THEME_META[active].label }}</h3>
            </div>
            <ul role="list" class="sg-swatches">
              <li v-for="s in swatches" :key="s.token" class="sg-swatch">
                <span class="sg-swatch__chip" :style="{ background: `var(${s.token})` }" />
                <strong>{{ s.label }}</strong>
                <code>{{ s.token }}</code>
                <code class="muted">{{ tokenValues[s.token] || '…' }}</code>
              </li>
            </ul>

            <h4>Contrast (WCAG 2.1 AA)</h4>
            <ul role="list" class="sg-pairs">
              <li v-for="([fg, bg, min, use], i) in pairs" :key="i" class="sg-pair">
                <span
                  class="sg-pair__sample"
                  :data-pair="i"
                  :style="{ color: `var(${fg})`, background: `var(${bg})` }"
                >Aa</span>
                <span class="stack" style="--stack-gap: 0">
                  <strong>{{ use }}</strong>
                  <code class="muted">{{ fg }} / {{ bg }}</code>
                </span>
                <span
                  class="badge"
                  :class="{ 'badge--accent': (ratios[i] ?? 0) >= min }"
                >
                  {{ ratios[i] ? `${ratios[i]}:1` : '…' }}
                  {{ ratios[i] ? (ratios[i]! >= min ? 'ok' : `te laag (min ${min})`) : '' }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Type -->
        <div class="section section--alt">
          <div class="container stack" style="--stack-gap: var(--space-6)">
            <div class="stack">
              <span class="eyebrow">Typografie</span>
              <h3 class="h2">{{ THEME_META[active].display }} <em>&amp;</em> {{ THEME_META[active].body }}</h3>
              <p v-if="THEME_META[active].extras" class="label-mono">+ {{ THEME_META[active].extras }}</p>
            </div>
            <dl class="sg-type">
              <template v-for="row in typeScale" :key="row.token">
                <dt><code>{{ row.cls ? `.${row.cls}` : 'body' }}</code><br><code class="muted">{{ row.token }}</code></dt>
                <dd :class="row.cls">{{ row.sample }}</dd>
              </template>
            </dl>
          </div>
        </div>

        <!-- Components -->
        <div class="section">
          <div class="container stack" style="--stack-gap: var(--space-8)">
            <div class="stack">
              <span class="eyebrow">Onderdelen</span>
              <h3 class="h2">Knoppen, kaarten, <em>formulieren</em></h3>
            </div>

            <div class="stack">
              <h4>Knoppen <code class="muted">.btn</code></h4>
              <div class="cluster">
                <button type="button" class="btn btn--primary">Maak een afspraak</button>
                <button type="button" class="btn btn--secondary">Bekijk prijzen</button>
                <button type="button" class="btn btn--ghost">Route plannen</button>
                <button type="button" class="btn btn--primary btn--lg">Groot</button>
                <button type="button" class="btn btn--primary" disabled>Uitgeschakeld</button>
              </div>
            </div>

            <div class="grid" style="--grid-min: 18rem">
              <article class="card">
                <div class="cluster" style="justify-content: space-between">
                  <span class="badge">Populair</span>
                  <span class="muted">180 min</span>
                </div>
                <h4>Balayage</h4>
                <p class="muted">Zachte, natuurlijke highlights, met toner en verzorging.</p>
                <p><strong>vanaf € 140</strong></p>
              </article>

              <div class="stack">
                <h4>Badges <code class="muted">.badge</code></h4>
                <div class="cluster">
                  <span class="badge">Nieuw</span>
                  <span class="badge badge--accent">Vandaag open</span>
                </div>
                <h4>Scheiding <code class="muted">.divider</code></h4>
                <span class="divider" aria-hidden="true" />
                <h4>Signatuur <code class="muted">.sticker .spin-badge</code></h4>
                <div class="cluster">
                  <span class="sticker">Nieuw</span>
                  <span class="sticker sticker--ink sticker--right">Lash lift</span>
                </div>
              </div>

              <div class="sg-media">
                <div class="stack" style="--stack-gap: var(--space-2)">
                  <div class="media sg-ph" role="img" aria-label="Voorbeeld .media" />
                  <code class="muted">.media</code>
                </div>
                <div class="stack" style="--stack-gap: var(--space-2)">
                  <div class="media media--feature sg-ph" role="img" aria-label="Voorbeeld .media--feature" />
                  <code class="muted">.media--feature</code>
                </div>
              </div>
            </div>

            <form class="card stack sg-form" style="--stack-gap: var(--space-5)" novalidate @submit.prevent>
              <h4>Formulier <code class="muted">.field</code></h4>
              <div class="field">
                <label class="label" :for="`naam-${active}`">Naam</label>
                <input :id="`naam-${active}`" class="input" type="text" autocomplete="name" placeholder="Bv. Sarah Peeters">
              </div>
              <div class="field">
                <label class="label" :for="`tel-${active}`">Telefoon <span class="optional">(optioneel)</span></label>
                <input :id="`tel-${active}`" class="input sg-force-focus" type="tel" value="011 23 45 67" :aria-describedby="`tel-help-${active}`">
                <p :id="`tel-help-${active}`" class="help">Focus-staat (zo ziet een veld eruit met het toetsenbord).</p>
              </div>
              <div class="field">
                <label class="label" :for="`mail-${active}`">E-mail</label>
                <input
                  :id="`mail-${active}`"
                  class="input"
                  type="email"
                  value="sarah@gmail"
                  aria-invalid="true"
                  :aria-describedby="`mail-err-${active}`"
                >
                <p :id="`mail-err-${active}`" class="error">Vul een volledig e-mailadres in, bv. naam@voorbeeld.be</p>
              </div>
              <div class="field">
                <label class="label" :for="`bericht-${active}`">Bericht</label>
                <textarea :id="`bericht-${active}`" class="textarea" placeholder="Waarmee kunnen we je helpen?" />
              </div>
              <button type="submit" class="btn btn--primary btn--block">Verstuur bericht</button>
            </form>
          </div>
        </div>

        <!-- Shape + space -->
        <div class="section section--alt">
          <div class="container stack" style="--stack-gap: var(--space-6)">
            <div class="stack">
              <span class="eyebrow">Vorm &amp; ruimte</span>
              <h3 class="h2">Hoeken en <em>witruimte</em></h3>
            </div>
            <ul role="list" class="sg-radii">
              <li v-for="r in radii" :key="r" class="stack" style="--stack-gap: var(--space-2)">
                <span class="sg-radius" :style="{ borderRadius: `var(${r})` }" />
                <code class="muted">{{ r }}</code>
              </li>
            </ul>
            <ul role="list" class="stack" style="--stack-gap: var(--space-2)">
              <li v-for="s in spaces" :key="s" class="sg-space">
                <code class="muted">{{ s }}</code>
                <span class="sg-space__bar" :style="{ width: `var(${s})` }" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Part 1 · Fresh showcase (layout glue for the style guide only) ── */
.sg-fresh { overflow-x: clip; }

.sg-cover { padding-block: var(--space-6) var(--space-9); }
.sg-cover__word { position: relative; margin-block-end: var(--space-6); } /* room for the sticker on small screens */
.sg-cover__word .giant { text-align: start; }
.sg-cover__sticker { --x: 36%; --y: 70%; --sticker-rotate: -7deg; --sticker-size: var(--text-md); }
.sg-cover__spark { --x: 88%; --y: -6%; --doodle-size: clamp(2.5rem, 6vw, 5.5rem); }
.sg-cover__row {
  display: grid;
  gap: var(--space-5);
  align-items: end;
}
.sg-cover__lead { max-width: 14ch; }
.sg-cover__badge { --spin-size: 6.5rem; }
@media (min-width: 56rem) {
  .sg-cover__row { grid-template-columns: 5fr 5fr auto; gap: var(--space-9); }
  .sg-cover__badge { --spin-size: 8.5rem; }
  .sg-cover__word { margin-block-end: 0; }
}

.sg-tag {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  padding: var(--space-3) var(--container-pad);
  background-color: var(--color-bg);
  border-block: var(--border-width) dashed var(--color-border-strong);
}
.sg-tag:has(+ [data-edge]) { padding-block-end: calc(var(--space-3) + var(--edge-height)); }
.sg-tag span {
  display: inline-grid;
  place-items: center;
  min-width: 2rem;
  padding: 0 var(--space-2);
  background-color: var(--color-ink);
  color: var(--color-pop);
  border-radius: var(--radius-pill);
}

.sg-hide-sm { display: none; }
@media (min-width: 40rem) {
  .sg-hide-sm { display: initial; }
}

.sg-specs {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr));
}
.sg-spec {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-6);
  background-color: var(--color-surface);
  border: var(--outline-width) solid var(--color-ink);
  border-radius: var(--radius-card);
  overflow: hidden;
}
.sg-spec--wide { grid-column: 1 / -1; }
.sg-invert-chip {
  display: inline-grid;
  padding: var(--space-4);
  border-radius: var(--radius-card);
}

.sg-doodles {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
}
.sg-doodles li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
.sg-doodles .doodle { --doodle-size: 4.5rem; height: 3.5rem; width: auto; max-width: 100%; aspect-ratio: auto; min-width: 4rem; }

.sg-edges {
  display: grid;
  gap: var(--space-7) var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  padding-block-start: var(--space-6);
}
.sg-edge-demo {
  --section-bg: var(--color-ink);
  --edge-height: 1.25rem;
  --edge-tile: 3rem;
  display: grid;
  place-items: center;
  min-height: 5rem;
  background-color: var(--section-bg);
  color: var(--color-pop);
}
.sg-leader-demo { flex-wrap: nowrap; }

.sg-frames {
  display: grid;
  gap: var(--space-7);
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  padding: var(--space-3);
}
.sg-frames > * { aspect-ratio: 4 / 5; margin: 0; }
.sg-frames .frame--polaroid { aspect-ratio: auto; }
.sg-frames .frame--polaroid img { aspect-ratio: 1; }

.sg-textures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.sg-texture {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 8rem;
  background-color: var(--color-surface-alt);
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* ── Part 2 · presets + tokens ── */
.sg-compare {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
}

.sg-postcard {
  padding: var(--space-8) var(--container-pad);
}

.sg-postcard__top { justify-content: space-between; }

.sg-ph {
  aspect-ratio: 4 / 5;
  background:
    radial-gradient(circle at 30% 25%, var(--color-highlight), transparent 60%),
    linear-gradient(160deg, var(--color-surface-alt), var(--color-accent));
}

.sg-postcard .sg-ph { max-height: 22rem; width: 100%; }

.sg-switch { gap: var(--space-3); }
.sg-switch h2 { margin-inline-end: auto; }

.sg-swatches {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 9.5rem), 1fr));
}

.sg-swatch {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-sm);
}

.sg-swatch__chip {
  display: block;
  aspect-ratio: 3 / 2;
  margin-block-end: var(--space-2);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-card);
}

code {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  overflow-wrap: anywhere;
}

.sg-pairs {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 21rem), 1fr));
}

.sg-pair {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
}

.sg-pair__sample {
  display: grid;
  place-items: center;
  width: var(--control-height);
  height: var(--control-height);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-display-weight);
}

.sg-type {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-2) var(--space-6);
  align-items: baseline;
  min-width: 0;
}

.sg-type dt { padding-block-start: var(--space-5); }
.sg-type dd { min-width: 0; overflow: hidden; }
/* The real giant fills the viewport; scaled down here so the row stays readable. */
.sg-type dd.giant { font-size: clamp(3rem, 12vw, 9rem); }

@media (min-width: 48rem) {
  .sg-type { grid-template-columns: 11rem minmax(0, 1fr); }
  .sg-type dt { padding-block-start: 0; }
  .sg-type dd { padding-block: var(--space-3); border-block-end: var(--border-width) solid var(--color-border); }
}

.sg-media {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  align-items: end;
}

.sg-form { max-width: var(--container-narrow); }

/* Demo only: show the keyboard-focus state statically. */
.sg-force-focus {
  border-color: var(--color-focus);
  outline: var(--focus-width) solid var(--color-focus);
  outline-offset: 0;
}

.sg-radii {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 8rem), 1fr));
}

.sg-radius {
  display: block;
  aspect-ratio: 1;
  background: var(--color-surface);
  border: var(--border-width) solid var(--color-border-strong);
}

.sg-space {
  display: grid;
  grid-template-columns: 7rem 1fr;
  align-items: center;
  gap: var(--space-4);
}

.sg-space__bar {
  display: block;
  height: var(--space-3);
  background: var(--color-accent);
  border-radius: var(--radius-sm);
}
</style>
