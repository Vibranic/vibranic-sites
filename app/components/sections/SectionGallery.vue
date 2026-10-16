<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'

defineProps<{ alt?: boolean }>()

const { site, t } = useSite()
const { ui, fill } = useUi()
const { gallery } = site

// ── Lightbox on a native <dialog>: Esc, focus trap and focus return come from the browser. ──
const dialog = ref<HTMLDialogElement | null>(null)
const current = ref(0)
const opener = ref<HTMLElement | null>(null)
const total = gallery.images.length

function openAt(index: number, event: Event) {
  current.value = index
  opener.value = event.currentTarget as HTMLElement
  dialog.value?.showModal()
  document.documentElement.style.overflow = 'hidden' // no scrolling behind the dialog
}

function step(direction: 1 | -1) {
  current.value = (current.value + direction + total) % total
}

function onDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') step(1)
  if (event.key === 'ArrowLeft') step(-1)
}

// Click on the dark backdrop (the dialog element itself) closes it.
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close()
}

function onClose() {
  document.documentElement.style.overflow = ''
  opener.value?.focus()
}

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <section :id="SECTION_ID.gallery" class="section" :class="{ 'section--alt': alt }" aria-labelledby="gallery-title">
    <div class="container">
      <SectionHeading id="gallery-title" :title="t(gallery.title)" :intro="t(gallery.intro)" />

      <ul class="grid gallery__grid" role="list" style="--grid-min: 11rem; --grid-gap: var(--space-4)">
        <li v-for="(image, index) in gallery.images" :key="image.src">
          <button
            type="button"
            class="gallery__item media"
            :aria-label="fill(ui.gallery.open, { alt: t(image.alt) })"
            aria-haspopup="dialog"
            @click="openAt(index, $event)"
          >
            <NuxtImg
              :src="image.src"
              :alt="t(image.alt)"
              :width="image.width"
              :height="image.height"
              sizes="xs:50vw sm:50vw md:25vw lg:25vw xl:25vw"
              format="webp"
              :quality="72"
              loading="lazy"
              decoding="async"
            />
          </button>
        </li>
      </ul>
    </div>

    <dialog
      ref="dialog"
      class="lightbox"
      :aria-label="ui.gallery.dialogLabel"
      @keydown="onDialogKeydown"
      @click="onDialogClick"
      @close="onClose"
    >
      <div class="lightbox__frame">
        <!--
          All lightbox images are in the markup (hidden + lazy) so the build can pre-generate
          their resized files: there is no image server on static hosting.
        -->
        <NuxtImg
          v-for="(image, index) in gallery.images"
          v-show="index === current"
          :key="image.src"
          class="lightbox__image"
          :src="image.src"
          :alt="t(image.alt)"
          :width="image.width"
          :height="image.height"
          sizes="xs:100vw md:60vw xl:50vw"
          format="webp"
          :quality="75"
          loading="lazy"
        />
        <p class="lightbox__counter" aria-live="polite">
          {{ fill(ui.gallery.counter, { n: current + 1, total }) }}
        </p>
        <div class="lightbox__controls">
          <button type="button" class="btn btn--secondary" @click="step(-1)">{{ ui.gallery.previous }}</button>
          <button type="button" class="btn btn--secondary" @click="step(1)">{{ ui.gallery.next }}</button>
          <button type="button" class="btn btn--primary" autofocus @click="dialog?.close()">{{ ui.gallery.close }}</button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<style scoped>
.gallery__grid { margin: 0; padding: 0; list-style: none; }

.gallery__item {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  cursor: zoom-in;
}
.gallery__item > img {
  aspect-ratio: 3 / 4;
  transition: transform var(--duration-slow) var(--ease-out);
}
@media (prefers-reduced-motion: no-preference) {
  .gallery__item:hover > img { transform: scale(1.04); }
}

.lightbox {
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: var(--space-4);
  border: 0;
  background-color: var(--color-bg);
  color: var(--color-text);
  /* The dialog fills the screen; the frame inside is centered. */
  place-items: center;
}
.lightbox[open] { display: grid; }
.lightbox::backdrop { background-color: var(--color-bg); }

.lightbox__frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  max-width: 100%;
  max-height: 100%;
}
.lightbox__image {
  width: auto;
  max-width: 100%;
  max-height: calc(100dvh - var(--control-height) * 3 - var(--space-8));
  object-fit: contain;
  border-radius: var(--radius-image);
}
.lightbox__counter { font-size: var(--text-sm); color: var(--color-text-muted); }
.lightbox__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
}
</style>
