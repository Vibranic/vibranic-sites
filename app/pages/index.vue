<script setup lang="ts">
const { site, t } = useSite()
</script>

<template>
  <main>
    <h1>{{ t(site.hero.title) }}</h1>
  </main>
</template>
