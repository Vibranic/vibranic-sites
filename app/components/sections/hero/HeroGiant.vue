<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'
import { richText } from '~/utils/richText'
import { linkAttrs } from '~/utils/links'
import { giantChars } from '~/utils/giantWord'
import type { Cutout } from '~/types/site-config'

// hero.variant = 'giant-type-cutout' (DESIGN.md §4.1). Markup follows /design A + A2.
const { site, t } = useSite()
const { ui, fill } = useUi()
const { hero, decor } = site

const primary = linkAttrs(hero.primaryCta.href)
const secondary = hero.secondaryCta ? linkAttrs(hero.secondaryCta.href) : null

const giantText = hero.giantText ?? site.business.name
const chars = giantChars(giantText)
const showDoodles = decor?.doodles !== false

// No real cut-out? Show the normal hero photo in a blob window instead.
const cutout: Cutout = hero.cutout ?? { ...hero.image, kind: 'shaped' }
const isShaped = cutout.kind === 'shaped'

// Meta row: only the parts the config provides.
const meta = computed(() => {
  const m = decor?.meta
  return {
    left: t(m?.left),
    coords: m?.coords,
    right: t(m?.right),
    est: m?.est ? fill(ui.value.hero.est, { est: m.est }) : '',
  }
})
const hasMeta = computed(() => Object.values(meta.value).some(Boolean))
</script>

<template>
  <section :id="SECTION_ID.hero" class="section hero-giant" aria-labelledby="hero-title">
    <div class="container container--wide hero-giant__inner" :style="{ '--chars': chars }">
      <div v-if="hasMeta" class="meta-row label-mono hero-giant__meta">
        <span v-if="meta.left">{{ meta.left }}</span>
        <span v-if="meta.coords" class="hero-giant__hide-sm">{{ meta.coords }}</span>
        <span v-if="meta.right" class="hero-giant__hide-sm">{{ meta.right }}</span>
        <span v-if="meta.est">{{ meta.est }}</span>
      </div>

      <div class="hero-giant__stage" :style="isShaped ? { '--cutout-overlap': 0.4 } : undefined">
        <!-- Decor: the big word is aria-hidden, the real name is in the header and the h1. -->
        <p class="giant hero-giant__word" aria-hidden="true" data-intro>{{ giantText }}</p>

        <div
          class="cutout hero-giant__cutout"
          :class="isShaped ? 'cutout--shaped cutout--photo' : `cutout--${cutout.kind}`"
          :style="{ '--intro-delay': '120ms', '--intro-distance': '12%', ...(isShaped ? { '--cutout-width': 'min(64%, 22rem)' } : {}) }"
          data-intro
        >
          <!-- LCP element: eager + high priority + preload. -->
          <NuxtImg
            :src="cutout.src"
            :alt="t(cutout.alt)"
            :width="cutout.width"
            :height="cutout.height"
            sizes="xs:90vw md:45vw"
            format="webp"
            :quality="isShaped ? 72 : 85"
            loading="eager"
            fetchpriority="high"
            preload
            decoding="async"
          />
        </div>

        <template v-if="showDoodles">
          <span class="doodle doodle--motion-lines decor" aria-hidden="true" style="--x: 21%; --y: 40%; --doodle-size: clamp(2.5rem, 6vw, 5.5rem); --r: -8deg" />
          <span class="doodle doodle--sparkles decor" aria-hidden="true" style="--x: 73%; --y: 34%; --doodle-size: clamp(2rem, 4vw, 3.75rem)" />
        </template>
        <span v-if="hero.stickers?.[0]" class="sticker sticker--ink decor hero-giant__sticker" aria-hidden="true" style="--x: 64%; --y: 80%">{{ t(hero.stickers[0]) }}</span>
        <span v-if="hero.stickers?.[1]" class="sticker sticker--paper decor hero-giant__sticker" aria-hidden="true" style="--x: 80%; --y: 52%; --sticker-rotate: 5deg">{{ t(hero.stickers[1]) }}</span>

        <SpinBadge class="hero-giant__badge" />
      </div>

      <div class="hero-giant__copy">
        <h1 id="hero-title" class="h1" v-html="richText(t(hero.title))" />
        <p>{{ t(hero.subtitle) }}</p>
        <div class="cluster">
          <a class="btn btn--primary" v-bind="primary">
            {{ t(hero.primaryCta.label) }}<span v-if="primary.target" class="sr-only"> {{ ui.newTab }}</span>
          </a>
          <a v-if="hero.secondaryCta && secondary" class="btn btn--secondary" v-bind="secondary">
            {{ t(hero.secondaryCta.label) }}<span v-if="secondary.target" class="sr-only"> {{ ui.newTab }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Stickers and the middle meta labels collide with the subject on small screens (DESIGN.md §4.6). */
@media (max-width: 39.99rem) {
  .hero-giant__sticker,
  .hero-giant__hide-sm { display: none; }
}
</style>
