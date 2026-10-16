<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

// error.vue replaces app.vue, so the brand has to be applied here too.
useTheme()

const { site } = useSite()
const { ui } = useUi()

const is404 = computed(() => props.error?.statusCode === 404)

useHead({ title: () => `${is404.value ? ui.value.notFound.title : ui.value.notFound.errorTitle} · ${site.business.name}` })
useSeoMeta({ robots: 'noindex' })

const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <SitePage>
    <section class="section">
      <div class="container container--narrow stack not-found" style="--stack-gap: var(--space-5)">
        <p class="eyebrow">{{ is404 ? '404' : error?.statusCode }}</p>
        <h1 class="h1">{{ is404 ? ui.notFound.title : ui.notFound.errorTitle }}</h1>
        <p class="lead">{{ is404 ? ui.notFound.text : ui.notFound.errorText }}</p>
        <p>
          <a class="btn btn--primary btn--lg" href="/" @click.prevent="goHome">{{ ui.notFound.home }}</a>
        </p>
      </div>
    </section>
  </SitePage>
</template>
