<script setup lang="ts">
const { site } = useSite()
const { ui, fill, formatDate } = useUi()
const { business, contact, privacy } = site

useSiteSeo({
  title: `${ui.value.privacy.pageTitle} · ${business.name}`,
  description: ui.value.privacy.intro,
  path: '/privacy',
})

const hasForm = contact.form.enabled
</script>

<template>
  <SitePage>
    <article class="section">
      <div class="container container--narrow stack privacy" style="--stack-gap: var(--space-5)">
        <p class="eyebrow">{{ business.name }}</p>
        <h1 class="h1">{{ ui.privacy.pageTitle }}</h1>
        <p class="muted">{{ fill(ui.privacy.updated, { date: formatDate(privacy.lastUpdated) }) }}</p>
        <p class="lead">{{ ui.privacy.intro }}</p>

        <h2 class="h3">{{ ui.privacy.controllerTitle }}</h2>
        <p>{{ fill(ui.privacy.controllerText, { legalName: business.legal.legalName }) }}</p>
        <dl class="privacy__facts">
          <dt>{{ ui.privacy.controllerAddress }}</dt>
          <dd>{{ business.address.street }}, {{ business.address.postalCode }} {{ business.address.city }}</dd>
          <template v-if="business.legal.kbo">
            <dt>{{ ui.privacy.controllerKbo }}</dt>
            <dd>{{ business.legal.kbo }}</dd>
          </template>
          <dt>{{ ui.privacy.controllerEmail }}</dt>
          <dd><a :href="`mailto:${business.email}`">{{ business.email }}</a></dd>
        </dl>

        <h2 class="h3">{{ ui.privacy.dataTitle }}</h2>
        <p>{{ hasForm ? ui.privacy.dataText : ui.privacy.dataNoForm }}</p>

        <template v-if="hasForm">
          <h2 class="h3">{{ ui.privacy.processorTitle }}</h2>
          <p>{{ ui.privacy.processorText }}</p>

          <h2 class="h3">{{ ui.privacy.retentionTitle }}</h2>
          <p>{{ ui.privacy.retentionText }}</p>
        </template>

        <h2 class="h3">{{ ui.privacy.rightsTitle }}</h2>
        <p>{{ fill(ui.privacy.rightsText, { email: business.email }) }}</p>
        <p>
          {{ ui.privacy.complaintText }}
          <a :href="ui.privacy.complaintUrl" target="_blank" rel="noopener">{{ ui.privacy.complaintLink }}<span class="sr-only"> {{ ui.newTab }}</span></a>
        </p>

        <h2 class="h3">{{ ui.privacy.cookiesTitle }}</h2>
        <p>{{ ui.privacy.cookiesText }}</p>

        <template v-if="contact.map.enabled">
          <h2 class="h3">{{ ui.privacy.mapTitle }}</h2>
          <p>{{ ui.privacy.mapText }}</p>
        </template>

        <p><NuxtLink class="btn btn--secondary" to="/">{{ ui.privacy.backHome }}</NuxtLink></p>
      </div>
    </article>
  </SitePage>
</template>

<style scoped>
.privacy h2 { margin-top: var(--space-5); }
.privacy__facts {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2) var(--space-5);
}
.privacy__facts dt { font-weight: var(--font-body-weight-strong); }
.privacy__facts dd { margin: 0; overflow-wrap: anywhere; }
</style>
