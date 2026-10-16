<script setup lang="ts">
import SectionHero from '~/components/sections/SectionHero.vue'
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
  services: SectionServices,
  about: SectionAbout,
  gallery: SectionGallery,
  reviews: SectionReviews,
  contact: SectionContact,
}

// Alternate the section background, skipping the hero (it sits on the plain page color).
const sections = computed(() => {
  let sectionIndex = 0
  return site.sections.map((key) => ({
    key,
    component: SECTION_COMPONENTS[key],
    alt: key === 'hero' ? false : sectionIndex++ % 2 === 1,
  }))
})

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
  <SitePage>
    <component :is="section.component" v-for="section in sections" :key="section.key" :alt="section.alt" />
  </SitePage>
</template>
