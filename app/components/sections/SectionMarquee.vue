<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'

// Scrolling word strip (DESIGN.md §3.5 + §4.6). Words: decor.marquee, else the service names.
// `alt` is passed to every section by the page; the strip has its own ink background.
defineProps<{ alt?: boolean }>()

const { site, t } = useSite()
const { ui } = useUi()

const words = computed(() => {
  if (site.decor?.marquee?.length) return site.decor.marquee.map((word) => t(word))
  return site.services.categories.flatMap((category) => [t(category.name), ...category.items.map((item) => t(item.name))])
})

const showSeparators = site.decor?.doodles !== false
</script>

<template>
  <!--
    The wrapper exists for the section edge: .marquee clips its overflow, which would cut off
    the torn/wavy edge. The edge takes the wrapper's --section-bg, so it matches the ink strip.
  -->
  <div :id="SECTION_ID.marquee" class="section-marquee">
    <div class="marquee marquee--ink" role="group" :aria-label="ui.marquee.label">
      <div class="marquee__track">
        <!-- Two identical groups make the loop seamless; the copy is hidden from screen readers. -->
        <ul v-for="copy in 2" :key="copy" class="marquee__group" role="list" :aria-hidden="copy === 2 ? 'true' : undefined">
          <template v-for="(word, index) in words" :key="index">
            <li>{{ word }}</li>
            <li v-if="showSeparators" class="doodle doodle--sparkle" aria-hidden="true" />
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-marquee {
  --section-bg: var(--color-ink);
  position: relative;
}
</style>
