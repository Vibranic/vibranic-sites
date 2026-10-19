<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'
import { richText } from '~/utils/richText'
import { linkAttrs } from '~/utils/links'
import { giantChars } from '~/utils/giantWord'

// hero.variant = 'framed-card' (DESIGN.md §4.2). The site header sits INSIDE the card (overlay mode).
const { site, t } = useSite()
const { ui } = useUi()
const { hero } = site

const giantText = hero.giantText ?? site.business.name
const chars = giantChars(giantText)

// The card has one CTA: the secondary link when there is one (the badge already pushes booking).
const cta = hero.secondaryCta ?? hero.primaryCta
const ctaLink = linkAttrs(cta.href)
</script>

<template>
  <section :id="SECTION_ID.hero" class="hero-card" aria-labelledby="hero-title">
    <div class="hero-card__frame invert">
      <div class="hero-card__media">
        <!-- LCP element; the scrim in compositions.css keeps the text readable. -->
        <NuxtImg
          :src="hero.image.src"
          :alt="t(hero.image.alt)"
          :width="hero.image.width"
          :height="hero.image.height"
          sizes="xs:100vw md:90vw"
          format="webp"
          :quality="72"
          loading="eager"
          fetchpriority="high"
          preload
          decoding="async"
        />
      </div>

      <div class="hero-card__top">
        <SiteHeader overlay />
      </div>

      <div class="fit-box hero-card__word">
        <p class="giant giant--fit" aria-hidden="true" :style="{ '--chars': chars }">{{ giantText }}</p>
      </div>

      <div class="hero-card__bottom">
        <div class="hero-card__copy">
          <span v-if="hero.eyebrow" class="eyebrow">{{ t(hero.eyebrow) }}</span>
          <h1 id="hero-title" class="h1" v-html="richText(t(hero.title))" />
          <a class="cta-pill" v-bind="ctaLink">
            <span>{{ t(cta.label) }}<span v-if="ctaLink.target" class="sr-only"> {{ ui.newTab }}</span></span>
            <span class="cta-pill__icon" aria-hidden="true"><span class="icon-arrow" /></span>
          </a>
        </div>
        <SpinBadge pop class="hero-card__badge" />
      </div>
    </div>
  </section>
</template>
