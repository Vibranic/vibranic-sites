<script setup lang="ts">
import { richText } from '~/utils/richText'

// Shared heading block for every section: h2 with accent word (*x* → <em>) + optional intro.
defineProps<{
  /** id for the <h2>, so the section can use aria-labelledby */
  id: string
  title: string
  intro?: string
}>()
</script>

<template>
  <div class="section-heading stack">
    <!-- richText() escapes first, so the only markup in here is the <em> it generates. -->
    <h2 :id="id" class="h2 section-heading__title" v-html="richText(title)" />
    <hr class="divider" />
    <p v-if="intro" class="lead">{{ intro }}</p>
  </div>
</template>

<style scoped>
.section-heading {
  --stack-gap: var(--space-4);
  margin-bottom: var(--space-8);
  max-width: var(--measure);
}
.section-heading .divider { width: min(var(--divider-width), var(--space-10)); }
</style>
