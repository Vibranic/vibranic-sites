<script setup lang="ts">
import { linkAttrs } from '~/utils/links'

/**
 * Rotating text badge (DESIGN.md §3.1). Text and link come from `site.decor`,
 * falling back to the booking link, then to the contact section.
 * Pass `pop` for the lime version. Extra classes (placement) fall through to the <a>.
 */
defineProps<{ pop?: boolean }>()

const { site, t } = useSite()
const { ui } = useUi()

const text = computed(() => t(site.decor?.badgeText) || t(site.booking?.label) || ui.value.nav.contact)
const link = computed(() => linkAttrs(site.decor?.badgeHref ?? site.booking?.href ?? '#contact'))

// Unique per badge: the ring text follows an SVG path referenced by id.
const pathId = useId()
</script>

<template>
  <a
    class="spin-badge"
    :class="{ 'spin-badge--pop': pop }"
    v-bind="link"
    :aria-label="link.target ? `${text} ${ui.newTab}` : text"
  >
    <svg class="spin-badge__ring" viewBox="0 0 200 200" aria-hidden="true">
      <defs><path :id="pathId" d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" /></defs>
      <!-- textLength = the circle's length, so any text fills it exactly. -->
      <text><textPath :href="`#${pathId}`" textLength="500" lengthAdjust="spacing">{{ text }} • {{ text }} • </textPath></text>
    </svg>
    <span class="spin-badge__core" aria-hidden="true"><span class="icon-arrow icon-arrow--ne" /></span>
  </a>
</template>
