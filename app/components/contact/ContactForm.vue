<script setup lang="ts">
/**
 * Netlify Forms: the <form> below is in the prerendered HTML, which is how Netlify finds it at deploy time.
 * We submit with fetch() so the visitor stays on the page. This can't succeed under `nuxt dev`
 * (only Netlify handles POSTs to "/"), so in dev you will see the error state.
 */
type FieldName = 'name' | 'email' | 'phone' | 'message'
type State = 'idle' | 'sending' | 'success' | 'error'

const { site } = useSite()
const { ui } = useUi()
const { form } = site.contact
const { business } = site

const fields: { name: FieldName; label: () => string; type: string; autocomplete: string; required: boolean; multiline?: boolean }[] = [
  { name: 'name', label: () => ui.value.form.name, type: 'text', autocomplete: 'name', required: true },
  { name: 'email', label: () => ui.value.form.email, type: 'email', autocomplete: 'email', required: true },
  { name: 'phone', label: () => ui.value.form.phone, type: 'tel', autocomplete: 'tel', required: false },
  { name: 'message', label: () => ui.value.form.message, type: 'text', autocomplete: 'off', required: true, multiline: true },
]

const values = reactive<Record<FieldName, string>>({ name: '', email: '', phone: '', message: '' })
const errors = reactive<Partial<Record<FieldName, string>>>({})
const state = ref<State>('idle')
const formEl = ref<HTMLFormElement | null>(null)
const resultEl = ref<HTMLElement | null>(null)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[\d\s./()-]{6,}$/

function validateField(name: FieldName): string {
  const value = values[name].trim()
  const e = ui.value.form.errors
  if (name === 'name') return value ? '' : e.nameRequired
  if (name === 'email') return !value ? e.emailRequired : EMAIL_PATTERN.test(value) ? '' : e.emailInvalid
  if (name === 'phone') return !value || PHONE_PATTERN.test(value) ? '' : e.phoneInvalid
  return value ? '' : e.messageRequired
}

function setError(name: FieldName) {
  const message = validateField(name)
  if (message) errors[name] = message
  else delete errors[name]
}

// Once a field was marked wrong, re-check while typing so the error disappears as soon as it's fixed.
function onInput(name: FieldName) {
  if (errors[name]) setError(name)
}

async function onSubmit() {
  if (state.value === 'sending') return // no double submit

  fields.forEach((field) => setError(field.name))
  const firstInvalid = fields.find((field) => errors[field.name])
  if (firstInvalid) {
    await nextTick()
    formEl.value?.querySelector<HTMLElement>(`[name="${firstInvalid.name}"]`)?.focus()
    return
  }

  state.value = 'sending'
  try {
    const body = new URLSearchParams(new FormData(formEl.value!) as unknown as Record<string, string>)
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    if (!response.ok) throw new Error(`Form POST failed: ${response.status}`)
    state.value = 'success'
  } catch {
    // The user's input stays in the fields, so they can simply try again.
    state.value = 'error'
  }
  await nextTick()
  resultEl.value?.focus()
}
</script>

<template>
  <div class="contact-form">
    <div
      v-if="state === 'success'"
      ref="resultEl"
      class="card contact-form__success stack"
      tabindex="-1"
      role="status"
      aria-live="polite"
    >
      <h3 class="h3">{{ ui.form.successTitle }}</h3>
      <p>{{ ui.form.successText }}</p>
    </div>

    <form
      v-else
      ref="formEl"
      class="stack"
      style="--stack-gap: var(--space-5)"
      :name="form.name"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      novalidate
      @submit.prevent="onSubmit"
    >
      <input type="hidden" name="form-name" :value="form.name" />
      <!-- Honeypot: invisible to people, bots fill it in and Netlify drops the message. -->
      <p class="sr-only" aria-hidden="true">
        <label>{{ ui.form.honeypot }} <input name="bot-field" tabindex="-1" autocomplete="off" /></label>
      </p>

      <h3 class="h3">{{ ui.form.title }}</h3>

      <div
        v-if="state === 'error'"
        ref="resultEl"
        class="contact-form__failed stack"
        style="--stack-gap: var(--space-2)"
        tabindex="-1"
        role="alert"
      >
        <p class="error">{{ ui.form.failedTitle }}</p>
        <p>
          {{ ui.form.failedText }}
          <template v-if="business.phone"><a :href="`tel:${business.phoneE164}`">{{ business.phone }}</a> · </template>
          <a :href="`mailto:${business.email}`">{{ business.email }}</a>
        </p>
      </div>

      <div v-for="field in fields" :key="field.name" class="field">
        <label class="label" :for="`cf-${field.name}`">
          {{ field.label() }}
          <span v-if="!field.required" class="optional">{{ ui.form.optional }}</span>
        </label>
        <textarea
          v-if="field.multiline"
          :id="`cf-${field.name}`"
          v-model="values[field.name]"
          class="textarea"
          :name="field.name"
          rows="5"
          :required="field.required"
          :aria-invalid="errors[field.name] ? 'true' : undefined"
          :aria-describedby="errors[field.name] ? `cf-${field.name}-error` : undefined"
          @blur="setError(field.name)"
          @input="onInput(field.name)"
        />
        <input
          v-else
          :id="`cf-${field.name}`"
          v-model="values[field.name]"
          class="input"
          :name="field.name"
          :type="field.type"
          :autocomplete="field.autocomplete"
          :required="field.required"
          :aria-invalid="errors[field.name] ? 'true' : undefined"
          :aria-describedby="errors[field.name] ? `cf-${field.name}-error` : undefined"
          @blur="setError(field.name)"
          @input="onInput(field.name)"
        />
        <p v-if="errors[field.name]" :id="`cf-${field.name}-error`" class="error">{{ errors[field.name] }}</p>
      </div>

      <button class="btn btn--primary btn--lg btn--block" type="submit" :disabled="state === 'sending'">
        {{ state === 'sending' ? ui.form.sending : ui.form.submit }}
      </button>

      <p class="help">
        {{ ui.form.privacyNote }}
        <NuxtLink to="/privacy">{{ ui.form.privacyLink }}</NuxtLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
.contact-form__success:focus,
.contact-form__failed:focus { outline: none; }

.contact-form__success {
  border-color: var(--color-success);
}
.contact-form__failed {
  padding: var(--space-4);
  border: var(--border-width) solid var(--color-error);
  border-radius: var(--radius-card);
}
</style>
