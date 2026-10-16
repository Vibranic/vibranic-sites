<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'

defineProps<{ alt?: boolean }>()

const { site, t, price } = useSite()
const { ui } = useUi()
const { services } = site

/** 60 → '60 min' (salons list minutes, so we keep them as minutes). */
const duration = (min: number) => `${min} ${ui.value.services.min}`
</script>

<template>
  <section :id="SECTION_ID.services" class="section" :class="{ 'section--alt': alt }" aria-labelledby="services-title">
    <div class="container">
      <SectionHeading id="services-title" :title="t(services.title)" :intro="t(services.intro)" />

      <div class="price-list">
        <div v-for="(category, index) in services.categories" :key="index" class="price-category">
          <h3 class="h3 price-category__name">{{ t(category.name) }}</h3>
          <ul class="price-category__items" role="list">
            <li v-for="(item, itemIndex) in category.items" :key="itemIndex" class="price-item">
              <div class="price-item__main">
                <p class="price-item__name">{{ t(item.name) }}</p>
                <p v-if="item.description" class="price-item__description muted">{{ t(item.description) }}</p>
              </div>
              <p class="price-item__price">
                <span v-if="item.priceFrom" class="price-item__from">{{ ui.services.from }}</span>
                {{ price(item.priceCents) }}
              </p>
              <p v-if="item.durationMin" class="price-item__duration muted">{{ duration(item.durationMin) }}</p>
            </li>
          </ul>
        </div>
      </div>

      <p v-if="services.note" class="muted price-note">{{ t(services.note) }}</p>
    </div>
  </section>
</template>

<style scoped>
.price-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.price-category {
  display: grid;
  gap: var(--space-4);
  padding-top: var(--space-5);
  border-top: var(--border-width) solid var(--color-border-strong);
}
.price-category__name { color: var(--color-accent); }

.price-category__items {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* name | price on row one, duration under the name on row two. */
.price-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--space-1) var(--space-4);
  padding-block: var(--space-4);
  border-bottom: var(--border-width) solid var(--color-border);
}
.price-item:first-child { padding-top: 0; }
.price-item:last-child { border-bottom: 0; }

.price-item__name { font-weight: var(--font-body-weight-strong); }
.price-item__description { font-size: var(--text-sm); margin-top: var(--space-1); }
.price-item__price {
  text-align: right;
  font-weight: var(--font-body-weight-strong);
  white-space: nowrap;
}
.price-item__from {
  margin-right: var(--space-1);
  font-weight: var(--font-body-weight);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
.price-item__duration {
  grid-column: 1;
  grid-row: 2;
  font-size: var(--text-sm);
}

.price-note { margin-top: var(--space-6); font-size: var(--text-sm); }

@media (min-width: 56rem) {
  .price-category { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: var(--space-8); }
}
</style>
