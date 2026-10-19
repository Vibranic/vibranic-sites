<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'
import { richText } from '~/utils/richText'

defineProps<{ alt?: boolean }>()

const { site, t } = useSite()
const { ui } = useUi()
const { about, decor } = site

// 'torn-frame' is built around the photo; without one we keep the plain split layout.
const isTorn = about.variant === 'torn-frame' && !!about.image

// The accent word gets a hand-drawn scribble underline in this variant (class added to the <em> richText makes).
const tornTitle = richText(t(about.title)).replaceAll('<em>', '<em class="scribbled">')
</script>

<template>
  <!-- torn-frame (DESIGN.md §4.5): taped photo with a torn edge, stat stickers and a handwritten note. -->
  <section v-if="isTorn && about.image" :id="SECTION_ID.about" class="section" :class="{ 'section--alt': alt }" aria-labelledby="about-title">
    <div class="container container--wide about-torn__grid">
      <div class="stack" style="--stack-gap: var(--space-5)">
        <span class="eyebrow">{{ ui.nav.about }}</span>
        <h2 id="about-title" class="h2" v-html="tornTitle" />
        <p v-for="(paragraph, index) in about.paragraphs" :key="index" class="measure" :class="{ muted: index > 0 }">{{ t(paragraph) }}</p>
        <p v-if="about.note" class="about-torn__note" aria-hidden="true">
          {{ t(about.note) }}
          <span v-if="decor?.doodles !== false" class="doodle doodle--arrow-curve" style="--doodle-size: 4.5rem" />
        </p>
      </div>

      <div class="about-torn__media">
        <span class="tape about-torn__tape" aria-hidden="true" />
        <!-- data-reveal sits on a wrapper: the animation would lock the frame's own tilt and its hover. -->
        <div data-reveal="tilt">
          <div class="frame frame--torn about-torn__photo">
            <NuxtImg
              :src="about.image.src"
              :alt="t(about.image.alt)"
              :width="about.image.width"
              :height="about.image.height"
              sizes="xs:100vw md:45vw"
              format="webp"
              :quality="72"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <ul v-if="about.highlights?.length" class="about-torn__stats" role="list" data-reveal="pop">
          <li
            v-for="(highlight, index) in about.highlights"
            :key="index"
            class="sticker sticker--stat"
            :class="{ 'sticker--paper': index % 2 === 1 }"
          >
            <strong>{{ highlight.value }}</strong>
            <span class="label-mono">{{ t(highlight.label) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <section v-else :id="SECTION_ID.about" class="section" :class="{ 'section--alt': alt }" aria-labelledby="about-title">
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
