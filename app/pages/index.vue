<script setup lang="ts">
import SectionHero from '~/components/sections/SectionHero.vue'
import SectionMarquee from '~/components/sections/SectionMarquee.vue'
import SectionServices from '~/components/sections/SectionServices.vue'
import SectionAbout from '~/components/sections/SectionAbout.vue'
import SectionGallery from '~/components/sections/SectionGallery.vue'
import SectionReviews from '~/components/sections/SectionReviews.vue'
import SectionContact from '~/components/sections/SectionContact.vue'
import { absoluteUrl } from '~/utils/sections'
import { buildLocalBusinessJsonLd, jsonLdString } from '~/utils/jsonLd'
import type { SectionKey } from '~/types/site-config'

const { site } = useSite()

// Section key → component. The page renders `site.sections` in that order,
// so a key missing from the array removes the section (and its nav link).
const SECTION_COMPONENTS: Record<SectionKey, Component> = {
  hero: SectionHero,
  marquee: SectionMarquee,
  services: SectionServices,
  about: SectionAbout,
  gallery: SectionGallery,
  reviews: SectionReviews,
  contact: SectionContact,
}

// Section backgrounds (DESIGN.md §4.6). The hero and the marquee strip bring their own colour.
// The rest alternate plain / alt, and the menu-board services band is ink: after it the
// next section is plain again, so Fresh reads: services (ink) → about → gallery (alt) → reviews → contact (alt).
const sections = computed(() => {
  const edge = site.decor?.edge ?? 'none'
  let previous: 'plain' | 'alt' | 'ink' = 'ink'
  return site.sections.map((key, index) => {
    let alt = false
    if (key !== 'hero' && key !== 'marquee') {
      const isInk = key === 'services' && site.services.variant === 'menu-board'
      const band = isInk ? 'ink' : previous === 'plain' ? 'alt' : 'plain'
      alt = band === 'alt'
      previous = band
    }
    return {
      key,
      component: SECTION_COMPONENTS[key],
      alt,
      // Every section after the first gets the edge; it takes that section's own colour.
      edge: index > 0 && edge !== 'none' ? edge : undefined,
    }
  })
})

// framed-card hero: the header is drawn inside the hero card instead of above the page.
const overlayHeader = site.sections[0] === 'hero' && site.hero.variant === 'framed-card'

useSiteSeo()

const imageUrl = site.seo.ogImage ? absoluteUrl(site.seo.siteUrl, site.seo.ogImage) : undefined
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: jsonLdString(buildLocalBusinessJsonLd(site, site.seo.siteUrl, imageUrl)),
    },
  ],
})
</script>

<template>
  <SitePage :overlay-header="overlayHeader">
    <component
      :is="section.component"
      v-for="section in sections"
      :key="section.key"
      :alt="section.alt"
      :data-edge="section.edge"
    />
  </SitePage>
</template>
