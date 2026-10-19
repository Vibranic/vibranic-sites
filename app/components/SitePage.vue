<script setup lang="ts">
// Shared page frame: header, <main id="main"> and footer. Used by index, privacy and error.vue.
// `overlayHeader`: the page's hero draws the header itself (framed-card), so skip the sticky one.
defineProps<{ overlayHeader?: boolean }>()

const { site } = useSite()
const { ui } = useUi()

// Paper grain is on unless the client switches it off (strength comes from the preset's tokens).
const grain = site.decor?.grain !== false

// Favicon per site (seo.favicon), default the kit's /favicon.svg.
const favicon = site.seo.favicon ?? '/favicon.svg'
useHead({
  link: [
    { rel: 'icon', type: favicon.endsWith('.svg') ? 'image/svg+xml' : 'image/png', href: favicon },
    ...(site.seo.appleTouchIcon ? [{ rel: 'apple-touch-icon' as const, href: site.seo.appleTouchIcon }] : []),
  ],
})
</script>

<template>
  <div :class="{ grain }">
    <!-- The overlay header lives inside <main>, so the skip link has to stay out here. -->
    <a v-if="overlayHeader" class="skip-link" href="#main">{{ ui.skipToContent }}</a>
    <SiteHeader v-else />
    <main id="main" tabindex="-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
/* main is focus target of the skip link; no ring on the whole page. */
main:focus { outline: none; }
</style>
