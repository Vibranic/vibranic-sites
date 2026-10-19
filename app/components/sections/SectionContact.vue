<script setup lang="ts">
import { SECTION_ID } from '~/utils/sections'

defineProps<{ alt?: boolean }>()

const { site, t } = useSite()
const { contact } = site
const hasHours = !!contact.hours
</script>

<template>
  <section :id="SECTION_ID.contact" class="section" :class="{ 'section--alt': alt }" aria-labelledby="contact-title">
    <div class="container">
      <SectionHeading id="contact-title" :title="t(contact.title)" :intro="t(contact.intro)" />

      <div class="contact__grid" :class="{ 'contact__grid--single': !hasHours }">
        <ContactHours v-if="hasHours" />
        <ContactForm v-if="contact.form.enabled" />
      </div>

      <div v-if="contact.map.enabled" class="contact__map">
        <ContactMap />
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact__grid {
  display: grid;
  gap: var(--space-8);
  align-items: start;
}
.contact__map { margin-top: var(--space-8); }

@media (min-width: 56rem) {
  .contact__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: var(--space-9); }
  /* No opening hours: the form alone, at a comfortable reading width. */
  .contact__grid--single { grid-template-columns: minmax(0, 40rem); }
}
</style>
