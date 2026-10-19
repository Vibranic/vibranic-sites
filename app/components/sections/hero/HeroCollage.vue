<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'
import { richText } from '~/utils/richText'
import { linkAttrs } from '~/utils/links'

// hero.variant = 'collage' (DESIGN.md §4.3). Keep hero.title to about 4 short words.
const { site, t } = useSite()
const { ui } = useUi()
const { hero, decor } = site

const primary = linkAttrs(hero.primaryCta.href)
const secondary = hero.secondaryCta ? linkAttrs(hero.secondaryCta.href) : null

const sticker = computed(() => t(hero.stickers?.[0]))
// One <span> per letter for the stacked-tile look; spaces are skipped.
const letters = computed(() => [...sticker.value].filter((char) => char.trim()))
</script>

<template>
  <section :id="SECTION_ID.hero" class="section hero-collage" aria-labelledby="hero-title">
    <div class="container container--wide hero-collage__inner">
      <h1 id="hero-title" class="hero-collage__title giant--outline" v-html="richText(t(hero.title))" />

      <div class="hero-collage__media">
        <div class="frame hero-collage__frame">
          <!-- LCP element. -->
          <NuxtImg
            :src="hero.image.src"
            :alt="t(hero.image.alt)"
            :width="hero.image.width"
            :height="hero.image.height"
            sizes="xs:100vw md:60vw"
            format="webp"
            :quality="72"
            loading="eager"
            fetchpriority="high"
            preload
            decoding="async"
          />
        </div>
        <span v-if="hero.eyebrow" class="sticker sticker--vertical sticker--ink hero-collage__vsticker">{{ t(hero.eyebrow) }}</span>
        <span v-if="sticker" class="hero-collage__letters">
          <span class="sticker-letters" aria-hidden="true"><span v-for="(letter, index) in letters" :key="index">{{ letter }}</span></span>
          <span class="sr-only">{{ sticker }}</span>
        </span>
      </div>

      <div class="hero-collage__copy">
        <p class="lead">{{ t(hero.subtitle) }}</p>
        <div class="cluster">
          <a class="btn btn--primary btn--lg" v-bind="primary">
            {{ t(hero.primaryCta.label) }}<span v-if="primary.target" class="sr-only"> {{ ui.newTab }}</span>
          </a>
          <a v-if="hero.secondaryCta && secondary" class="btn btn--ghost" v-bind="secondary">
            {{ t(hero.secondaryCta.label) }}<span v-if="secondary.target" class="sr-only"> {{ ui.newTab }}</span>
          </a>
        </div>
        <span v-if="decor?.doodles !== false" class="doodle doodle--arrow-loop hero-collage__arrow" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>
