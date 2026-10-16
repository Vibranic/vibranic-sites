<script setup lang="ts">
// Simple stroke icons, drawn with currentColor so they follow the theme.
defineProps<{ name: 'instagram' | 'facebook' | 'tiktok' }>()
</script>

<template>
  <svg
    class="social-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="name === 'instagram'">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </template>
    <path
      v-else-if="name === 'facebook'"
      d="M14 8.5h2.5V4.5H14a4 4 0 0 0-4 4V11H7.5v4H10v6h4v-6h2.5l.5-4H14V8.9c0-.3.2-.4.4-.4z"
    />
    <path v-else d="M15 3v10.5a3.5 3.5 0 1 1-3.5-3.5M15 3c.3 2.4 2 4.2 4.5 4.5" />
  </svg>
</template>

<style scoped>
.social-icon {
  width: var(--space-5);
  height: var(--space-5);
}
</style>
