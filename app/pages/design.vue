<script setup lang="ts">
import type { ThemePreset } from '~/types/site-config'
import { THEME_META, THEME_PRESETS } from '~/composables/useTheme'

/**
 * Living style guide. Shows every preset with real tokens + primitives.
 * Kilian also uses it to show prospects the style options, so copy is Dutch.
 * Not linked from the site and not indexed.
 */
useHead({
  title: 'Stijlgids · Vibranic',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const active = ref<ThemePreset>(useSite().site.theme.preset)

const swatches = [
  { token: '--color-bg', label: 'Achtergrond' },
  { token: '--color-surface', label: 'Vlak' },
  { token: '--color-surface-alt', label: 'Vlak alt' },
  { token: '--color-text', label: 'Tekst' },
  { token: '--color-text-muted', label: 'Tekst zacht' },
  { token: '--color-accent', label: 'Accent' },
  { token: '--color-accent-hover', label: 'Accent hover' },
  { token: '--color-on-accent', label: 'Op accent' },
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
  ['--color-on-accent', '--color-accent', 4.5, 'Primaire knop'],
  ['--color-on-accent', '--color-accent-hover', 4.5, 'Knop hover'],
  ['--color-text', '--color-surface-alt', 4.5, 'Tekst op alt-sectie'],
  ['--color-text-muted', '--color-surface-alt', 4.5, 'Zacht op alt-sectie'],
  ['--color-accent', '--color-surface-alt', 4.5, 'Accent op alt-sectie'],
  ['--color-text', '--color-highlight', 4.5, 'Badge'],
  ['--color-error', '--color-bg', 4.5, 'Foutmelding'],
  ['--color-border-strong', '--color-bg', 3, 'Rand invoerveld'],
  ['--color-border-strong', '--color-surface-alt', 3, 'Rand op alt-sectie'],
]

const typeScale = [
  { cls: 'display', token: '--text-display', sample: 'Knippen & kleur' },
  { cls: 'h1', token: '--h1-size', sample: 'Haar dat bij jou past' },
  { cls: 'h2', token: '--h2-size', sample: 'Behandelingen & prijzen' },
  { cls: 'h3', token: '--h3-size', sample: 'Balayage met toner' },
  { cls: 'lead', token: '--text-md', sample: 'Rustige salon, eerlijk advies en kleur die lang mooi blijft.' },
  { cls: '', token: '--text-base', sample: 'Lopende tekst. Twijfel je over een nieuwe kleur? Kom gerust eerst langs voor gratis advies.' },
  { cls: 'eyebrow', token: '--text-xs', sample: 'Kapsalon · Hasselt' },
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
    <a class="skip-link" href="#stijlen">Naar de stijlen</a>

    <header class="section section--tight">
      <div class="container stack sg-intro">
        <span class="eyebrow">Vibranic · Stijlgids</span>
        <h1 class="h1">Eén website, <em>drie karakters</em></h1>
        <p class="lead">
          Elke stijl gebruikt dezelfde onderdelen, maar met eigen lettertypes, kleuren en vormen. Kies de stijl
          die bij je zaak past; kleuren en details stemmen we daarna af op jouw huisstijl.
        </p>
      </div>
    </header>

    <!-- Side by side: what a hero looks like in each preset -->
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
.sg-intro { --stack-gap: var(--space-5); }

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
  font-family: ui-monospace, 'Cascadia Code', Menlo, monospace;
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
}

.sg-type dt { padding-block-start: var(--space-5); }

@media (min-width: 48rem) {
  .sg-type { grid-template-columns: 11rem 1fr; }
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
