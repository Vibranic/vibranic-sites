<script setup lang="ts">
import HeroSplit from '~/components/sections/hero/HeroSplit.vue'
import HeroGiant from '~/components/sections/hero/HeroGiant.vue'
import HeroCard from '~/components/sections/hero/HeroCard.vue'
import HeroCollage from '~/components/sections/hero/HeroCollage.vue'
import type { HeroVariant } from '~/types/site-config'

// `alt` is passed to every section by the page; the hero has no alternating background.
defineProps<{ alt?: boolean }>()

const { site } = useSite()

// hero.variant → layout. No variant = the original split hero.
const HERO_VARIANTS: Record<HeroVariant, Component> = {
  split: HeroSplit,
  'giant-type-cutout': HeroGiant,
  'framed-card': HeroCard,
  collage: HeroCollage,
}

const variant = computed(() => HERO_VARIANTS[site.hero.variant ?? 'split'])
</script>

<template>
  <component :is="variant" />
</template>
