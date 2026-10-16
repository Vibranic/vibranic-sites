<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'
import { richText } from '~/utils/richText'
import { linkAttrs } from '~/utils/links'

defineProps<{ alt?: boolean }>()

const { site, t } = useSite()
const { ui } = useUi()
const { hero } = site

const primary = linkAttrs(hero.primaryCta.href)
const secondary = hero.secondaryCta ? linkAttrs(hero.secondaryCta.href) : null
</script>

<template>
  <section :id="SECTION_ID.hero" class="section hero" aria-labelledby="hero-title">
    <div class="container hero__grid">
      <div class="stack hero__text" style="--stack-gap: var(--space-5)">
        <p v-if="hero.eyebrow" class="eyebrow">{{ t(hero.eyebrow) }}</p>
        <h1 id="hero-title" class="h1" v-html="richText(t(hero.title))" />
        <p class="lead">{{ t(hero.subtitle) }}</p>
        <div class="cluster hero__actions">
          <a class="btn btn--primary btn--lg" v-bind="primary">
            {{ t(hero.primaryCta.label) }}<span v-if="primary.target" class="sr-only"> {{ ui.newTab }}</span>
          </a>
          <a v-if="hero.secondaryCta && secondary" class="btn btn--secondary btn--lg" v-bind="secondary">
            {{ t(hero.secondaryCta.label) }}<span v-if="secondary.target" class="sr-only"> {{ ui.newTab }}</span>
          </a>
        </div>
      </div>

      <div class="media media--feature hero__media">
        <!-- Above the fold: load eagerly and tell the browser it's the LCP image. -->
        <NuxtImg
          :src="hero.image.src"
          :alt="t(hero.image.alt)"
          :width="hero.image.width"
          :height="hero.image.height"
          sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:50vw"
          format="webp"
          :quality="72"
          loading="eager"
          fetchpriority="high"
          preload
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { padding-block: var(--space-8) var(--section-pad-y); }

.hero__grid {
  display: grid;
  gap: var(--space-8);
  align-items: center;
}

.hero__media > img {
  aspect-ratio: 4 / 3;
}

@media (min-width: 56rem) {
  .hero__grid { grid-template-columns: 1fr 1fr; gap: var(--space-9); }
  .hero__media > img { aspect-ratio: 4 / 5; }
}
</style>
