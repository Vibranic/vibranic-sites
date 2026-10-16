<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'
import { linkAttrs } from '~/utils/links'

defineProps<{ alt?: boolean }>()

const { site, t } = useSite()
const { ui, fill } = useUi()
const { reviews } = site

const STARS = [1, 2, 3, 4, 5]
const formatRating = (value: number) => new Intl.NumberFormat('nl-BE', { maximumFractionDigits: 1 }).format(value)
const summaryLink = reviews.summary?.url ? linkAttrs(reviews.summary.url) : null
</script>

<template>
  <section :id="SECTION_ID.reviews" class="section" :class="{ 'section--alt': alt }" aria-labelledby="reviews-title">
    <div class="container">
      <SectionHeading id="reviews-title" :title="t(reviews.title)" />

      <p v-if="reviews.summary" class="reviews__summary cluster">
        <strong class="reviews__score">{{ formatRating(reviews.summary.rating) }}</strong>
        <span>{{ fill(ui.reviews.summary, { rating: formatRating(reviews.summary.rating), count: reviews.summary.count }) }}</span>
        <a v-if="summaryLink" v-bind="summaryLink">
          {{ ui.reviews.all }}<span v-if="summaryLink.target" class="sr-only"> {{ ui.newTab }}</span>
        </a>
      </p>

      <ul class="grid reviews__grid" role="list" style="--grid-min: 17rem">
        <li v-for="(review, index) in reviews.items" :key="index" class="card reviews__card">
          <div class="stars" role="img" :aria-label="fill(ui.reviews.stars, { n: review.rating })">
            <svg
              v-for="star in STARS"
              :key="star"
              class="stars__star"
              :class="{ 'stars__star--off': star > review.rating }"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />
            </svg>
          </div>
          <blockquote class="reviews__text">{{ t(review.text) }}</blockquote>
          <p class="reviews__author">
            <strong>{{ review.author }}</strong>
            <span v-if="review.source" class="muted"> · {{ ui.reviews.sourcePrefix }} {{ review.source }}</span>
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.reviews__summary {
  --cluster-gap: var(--space-2) var(--space-3);
  margin-bottom: var(--space-6);
}
.reviews__score {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
  color: var(--color-accent);
}

.reviews__grid { margin: 0; padding: 0; list-style: none; }
.reviews__card { margin: 0; }
.reviews__text {
  margin: 0;
  flex: 1;
}
.reviews__author { font-size: var(--text-sm); }

.stars { display: flex; gap: var(--space-1); }
.stars__star {
  width: var(--space-5);
  height: var(--space-5);
  fill: var(--color-accent);
}
.stars__star--off { fill: var(--color-border); }
</style>
