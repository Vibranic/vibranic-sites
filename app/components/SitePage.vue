<script setup lang="ts">
// Shared page frame: header, <main id="main"> and footer. Used by index, privacy and error.vue.
useHead({
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
})
</script>

<template>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <slot />
  </main>
  <SiteFooter />
</template>

<style scoped>
/* main is focus target of the skip link; no ring on the whole page. */
main:focus { outline: none; }
</style>
