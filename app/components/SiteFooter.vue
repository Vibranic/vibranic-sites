<script setup lang="ts">
import { WEEKDAYS, formatRanges } from '~/utils/openingHours'

const { site, t } = useSite()
const { ui, fill } = useUi()

const { business, contact, socials } = site

const socialLinks = (['instagram', 'facebook', 'tiktok'] as const)
  .filter((name) => socials?.[name])
  .map((name) => ({ name, href: socials![name]!, label: ui.value.footer[name] }))

const legalParts = computed(() =>
  [
    business.legal.legalName,
    business.legal.kbo ? fill(ui.value.footer.legalLine, { kbo: business.legal.kbo }) : '',
    business.legal.vat ? fill(ui.value.footer.vatLine, { vat: business.legal.vat }) : '',
  ].filter(Boolean),
)

const year = new Date().getFullYear()
const showCredit = site.showCredit !== false
const hours = contact.hours
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="stack" style="--stack-gap: var(--space-3)">
        <p class="site-footer__name">{{ business.name }}</p>
        <p class="muted">{{ t(business.tagline) }}</p>
        <ul v-if="socialLinks.length" class="cluster site-footer__socials" role="list" :aria-label="ui.footer.social">
          <li v-for="link in socialLinks" :key="link.name">
            <a class="site-footer__social" :href="link.href" target="_blank" rel="noopener" :aria-label="`${link.label} ${ui.newTab}`">
              <SocialIcon :name="link.name" />
            </a>
          </li>
        </ul>
      </div>

      <div class="stack" style="--stack-gap: var(--space-3)">
        <h2 class="site-footer__heading">{{ ui.footer.contact }}</h2>
        <address class="site-footer__address">
          <template v-if="business.address.street">{{ business.address.street }}<br /></template>
          {{ business.address.postalCode }} {{ business.address.city }}
        </address>
        <p class="stack" style="--stack-gap: 0">
          <a v-if="business.phone" class="site-footer__link" :href="`tel:${business.phoneE164}`">{{ business.phone }}</a>
          <a class="site-footer__link" :href="`mailto:${business.email}`">{{ business.email }}</a>
        </p>
      </div>

      <div v-if="hours" class="stack" style="--stack-gap: var(--space-3)">
        <h2 class="site-footer__heading">{{ ui.footer.hours }}</h2>
        <dl class="site-footer__hours">
          <template v-for="day in WEEKDAYS" :key="day">
            <dt>{{ ui.days[day].short }}</dt>
            <dd>{{ formatRanges(hours[day]) || ui.hours.closed }}</dd>
          </template>
        </dl>
      </div>
    </div>

    <div class="container site-footer__bottom">
      <p class="muted site-footer__legal">
        © {{ year }} {{ legalParts.join(' · ') }}
      </p>
      <p class="cluster site-footer__links">
        <NuxtLink to="/privacy">{{ ui.footer.privacy }}</NuxtLink>
        <a v-if="showCredit" href="https://vibranic.be" target="_blank" rel="noopener">
          {{ ui.footer.credit }}<span class="sr-only"> {{ ui.newTab }}</span>
        </a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding-block: var(--section-pad-y) var(--space-6);
  background-color: var(--color-surface-alt);
  border-top: var(--border-width) solid var(--color-border);
  font-size: var(--text-sm);
}

.site-footer__grid {
  display: grid;
  gap: var(--space-8);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
}

.site-footer__name {
  font-family: var(--font-display);
  font-weight: var(--font-display-weight);
  font-size: var(--text-xl);
  line-height: var(--leading-snug);
}

.site-footer__heading {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--eyebrow-weight);
  letter-spacing: var(--eyebrow-tracking);
  text-transform: var(--eyebrow-transform);
  color: var(--color-accent);
}

.site-footer__address { font-style: normal; }

.site-footer__link,
.site-footer__links a {
  display: inline-flex;
  align-items: center;
  min-height: var(--control-height);
  color: var(--color-text);
  overflow-wrap: anywhere;
}
.site-footer__link:hover,
.site-footer__links a:hover { color: var(--color-accent); }

.site-footer__socials { padding: 0; list-style: none; }
.site-footer__social {
  display: inline-grid;
  place-items: center;
  width: var(--control-height);
  height: var(--control-height);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-pill);
  color: var(--color-text);
}
.site-footer__social:hover {
  background-color: var(--color-text);
  color: var(--color-bg);
}

.site-footer__hours {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-1) var(--space-4);
}
.site-footer__hours dt { font-weight: var(--font-body-weight-strong); }
.site-footer__hours dd { margin: 0; }

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2) var(--space-6);
  margin-top: var(--space-8);
  padding-top: var(--space-4);
  border-top: var(--border-width) solid var(--color-border);
}
.site-footer__legal { overflow-wrap: anywhere; }
.site-footer__links { --cluster-gap: var(--space-5); }
</style>
