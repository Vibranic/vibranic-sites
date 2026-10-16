<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'
import { richText } from '~/utils/richText'

defineProps<{ alt?: boolean }>()

const { site, t } = useSite()
const { about } = site
</script>

<template>
  <section :id="SECTION_ID.about" class="section" :class="{ 'section--alt': alt }" aria-labelledby="about-title">
    <div class="container about" :class="{ 'about--with-image': about.image }">
      <div v-if="about.image" class="media media--feature about__media">
        <NuxtImg
          :src="about.image.src"
          :alt="t(about.image.alt)"
          :width="about.image.width"
          :height="about.image.height"
          sizes="xs:100vw sm:100vw md:45vw lg:45vw xl:45vw"
          format="webp"
          :quality="72"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="stack about__text" style="--stack-gap: var(--space-5)">
        <h2 id="about-title" class="h2" v-html="richText(t(about.title))" />
        <hr class="divider about__divider" />
        <p v-for="(paragraph, index) in about.paragraphs" :key="index" class="measure">{{ t(paragraph) }}</p>

        <dl v-if="about.highlights?.length" class="about__highlights">
          <div v-for="(highlight, index) in about.highlights" :key="index" class="about__highlight">
            <dt class="about__value">{{ highlight.value }}</dt>
            <dd class="muted">{{ t(highlight.label) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  gap: var(--space-8);
  align-items: center;
}
.about__media > img { aspect-ratio: 2 / 3; }
.about__divider { width: min(var(--divider-width), var(--space-10)); }

.about__highlights {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5) var(--space-8);
  margin-top: var(--space-3);
}
.about__highlight { margin: 0; }
.about__highlight dd { margin: 0; font-size: var(--text-sm); }
.about__value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
  color: var(--color-accent);
}

/* Narrow image so a portrait photo doesn't tower over the text on phones. */
.about--with-image .about__media { max-width: min(100%, 26rem); }

@media (min-width: 56rem) {
  .about--with-image { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: var(--space-9); }
  .about--with-image .about__media { max-width: none; }
}
</style>
