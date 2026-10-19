<script setup lang="ts">
// Click-to-load: no request to OpenStreetMap until the visitor asks for the map (privacy + speed).
const { site } = useSite()
const { ui, fill } = useUi()
const { map } = site.contact
const { business } = site
const address = formatAddress(business.address)

const loaded = ref(false)
</script>

<template>
  <div class="map">
    <iframe
      v-if="loaded"
      class="map__frame"
      :src="map.embedUrl"
      :title="fill(ui.map.iframeTitle, { name: business.name })"
      loading="lazy"
      referrerpolicy="no-referrer"
    />
    <div v-else class="map__placeholder stack" style="--stack-gap: var(--space-4)">
      <svg class="map__pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
      <p class="map__address">
        <strong>{{ business.name }}</strong><br />
        {{ address }}
      </p>
      <p class="muted map__hint">{{ ui.map.placeholderText }}</p>
      <div class="cluster map__actions">
        <button type="button" class="btn btn--primary" @click="loaded = true">{{ ui.map.load }}</button>
        <a class="btn btn--secondary" :href="map.directionsUrl" target="_blank" rel="noopener">
          {{ ui.map.directions }}<span class="sr-only"> {{ ui.newTab }}</span>
        </a>
      </div>
    </div>

    <!-- Once the map is open the directions link stays reachable below it. -->
    <p v-if="loaded" class="map__after">
      <a class="btn btn--ghost" :href="map.directionsUrl" target="_blank" rel="noopener">
        {{ ui.map.directions }}<span class="sr-only"> {{ ui.newTab }}</span>
      </a>
    </p>
  </div>
</template>

<style scoped>
.map {
  overflow: hidden;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-card);
  background-color: var(--color-surface);
}

.map__frame {
  display: block;
  width: 100%;
  height: calc(var(--control-height) * 8);
  border: 0;
}

.map__placeholder {
  align-items: center;
  justify-content: center;
  min-height: calc(var(--control-height) * 8);
  padding: var(--space-6) var(--container-pad);
  background-color: var(--color-surface-alt);
  text-align: center;
}
.map__pin {
  width: var(--space-8);
  height: var(--space-8);
  color: var(--color-accent);
}
.map__hint { max-width: 36ch; font-size: var(--text-sm); }
.map__actions { justify-content: center; }
.map__after { padding: var(--space-2) var(--space-4); }
</style>
