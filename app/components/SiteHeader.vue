<script setup lang="ts">
import { SECTION_ID, navSections } from '~/utils/sections'
import { linkAttrs } from '~/utils/links'

/**
 * `overlay` = transparent header that lives INSIDE the framed-card hero (DESIGN.md §4.6).
 * It is not sticky and has no skip link (SitePage renders that one instead).
 */
defineProps<{ overlay?: boolean }>()

const { site, t } = useSite()
const { ui, fill } = useUi()

const navItems = computed(() =>
  navSections(site.sections).map((key) => ({
    key,
    label: ui.value.nav[key],
    // "/#id" so the links also work from the privacy page and the 404 page.
    to: `/#${SECTION_ID[key]}`,
  })),
)

// Booking link is the main CTA; without one we fall back to calling the salon,
// and without a phone number to the contact section.
const cta = computed(() => {
  if (site.booking) {
    const attrs = linkAttrs(site.booking.href)
    return { label: t(site.booking.label), target: attrs.target, rel: attrs.rel, href: attrs.href, external: !!attrs.target }
  }
  if (!site.business.phone) {
    return { label: ui.value.nav.contact, href: `/#${SECTION_ID.contact}`, target: undefined, rel: undefined, external: false }
  }
  return {
    label: fill(ui.value.nav.callUs, { phone: site.business.phone }),
    href: `tel:${site.business.phoneE164}`,
    target: undefined,
    rel: undefined,
    external: false,
  }
})

// ── Mobile menu ──────────────────────────────────────────────────
const open = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const nav = ref<HTMLElement | null>(null)

function setOpen(value: boolean, returnFocus = false) {
  open.value = value
  document.documentElement.style.overflow = value ? 'hidden' : '' // no scrolling behind the menu
  if (!value && returnFocus) menuButton.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'Escape') {
    setOpen(false, true)
    return
  }
  if (event.key !== 'Tab' || !nav.value || !menuButton.value) return
  // Small focus loop: button -> menu links -> back to the button.
  const focusable = [...nav.value.querySelectorAll<HTMLElement>('a[href]')]
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === menuButton.value) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    menuButton.value.focus()
  }
}

// The menu is only an overlay on small screens: close it when the viewport grows.
let wideQuery: MediaQueryList | null = null
const onWide = (e: MediaQueryListEvent) => {
  if (e.matches) setOpen(false)
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  wideQuery = window.matchMedia('(min-width: 48rem)')
  wideQuery.addEventListener('change', onWide)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  wideQuery?.removeEventListener('change', onWide)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <header class="site-header" :class="{ 'site-header--overlay': overlay }">
    <a v-if="!overlay" class="skip-link" href="#main">{{ ui.skipToContent }}</a>

    <div class="site-header__bar" :class="{ container: !overlay }">
      <NuxtLink to="/" class="brand" :aria-label="ui.homeLink(site.business.name)" @click="setOpen(false)">
        <!-- SVG logos stay as they are; raster logos get the same build-time optimization as photos. -->
        <img
          v-if="site.business.logo && site.business.logo.src.endsWith('.svg')"
          class="brand__logo"
          :src="site.business.logo.src"
          :alt="t(site.business.logo.alt)"
          :width="site.business.logo.width"
          :height="site.business.logo.height"
        />
        <NuxtImg
          v-else-if="site.business.logo"
          class="brand__logo"
          :src="site.business.logo.src"
          :alt="t(site.business.logo.alt)"
          :width="site.business.logo.width"
          :height="site.business.logo.height"
          format="webp"
          :quality="80"
        />
        <span v-else class="brand__name">{{ site.business.name }}</span>
      </NuxtLink>

      <button
        ref="menuButton"
        class="menu-button"
        type="button"
        aria-controls="site-nav"
        :aria-expanded="open"
        @click="setOpen(!open, true)"
      >
        <svg class="menu-button__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path v-if="!open" d="M4 7h16M4 12h16M4 17h16" />
          <path v-else d="M6 6l12 12M18 6L6 18" />
        </svg>
        <span>{{ open ? ui.nav.closeMenu : ui.nav.menu }}</span>
      </button>

      <nav id="site-nav" ref="nav" class="site-nav" :class="{ 'site-nav--open': open }" :aria-label="ui.nav.label">
        <ul class="site-nav__list" role="list">
          <li v-for="item in navItems" :key="item.key">
            <NuxtLink :to="item.to" class="site-nav__link" @click="setOpen(false)">{{ item.label }}</NuxtLink>
          </li>
          <li class="site-nav__cta">
            <a class="btn btn--primary" :href="cta.href" :target="cta.target" :rel="cta.rel" @click="setOpen(false)">
              {{ cta.label }}<span v-if="cta.external" class="sr-only"> {{ ui.newTab }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background-color: var(--color-bg);
  border-bottom: var(--border-width) solid var(--color-border);
}

/* Overlay (framed-card hero): transparent, in normal flow, text colour comes from the card's .invert tokens. */
.site-header--overlay {
  position: relative;
  width: 100%;
  background: none;
  border-bottom: 0;
}

.site-header__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: var(--control-height-lg);
}

.brand {
  display: inline-flex;
  align-items: center;
  min-height: var(--control-height);
  color: var(--color-text);
  text-decoration: none;
}
.brand:hover { color: var(--color-text); }
.brand__name {
  font-family: var(--font-display);
  font-weight: var(--font-display-weight);
  font-size: var(--text-lg);
  letter-spacing: var(--heading-tracking);
  text-transform: var(--heading-transform);
  line-height: var(--leading-snug);
}
.brand__logo {
  height: var(--space-8);
  width: auto;
}

.menu-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--control-height);
  padding: var(--space-2) var(--space-3);
  background: none;
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-btn);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: var(--font-body-weight-strong);
}
.menu-button__icon {
  width: var(--space-5);
  height: var(--space-5);
}

/* Mobile: the nav is a full-height panel under the header. Closed = removed from tab order. */
.site-nav {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: calc(100dvh - 100%);
  overflow-y: auto;
  padding: var(--space-5) var(--container-pad) var(--space-8);
  background-color: var(--color-bg);
}
.site-nav--open { display: block; }

.site-nav__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}
.site-nav__link {
  display: flex;
  align-items: center;
  min-height: var(--control-height-lg);
  border-bottom: var(--border-width) solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  text-decoration: none;
}
.site-nav__link:hover,
.site-nav__link.router-link-active:hover { color: var(--color-accent); }
.site-nav__cta { margin-top: var(--space-5); }
.site-nav__cta .btn { width: 100%; }

@media (min-width: 48rem) {
  .menu-button { display: none; }

  .site-nav {
    display: block;
    position: static;
    height: auto;
    overflow: visible;
    padding: 0;
    background: none;
  }
  .site-nav__list {
    flex-direction: row;
    align-items: center;
    gap: var(--space-5);
  }
  .site-nav__link {
    min-height: var(--control-height);
    border-bottom: 0;
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-weight: var(--font-body-weight-strong);
    text-decoration: underline;
    text-decoration-color: transparent;
    text-underline-offset: 0.4em;
    text-decoration-thickness: var(--border-width);
  }
  .site-nav__link:hover { text-decoration-color: currentColor; }
  .site-nav__cta { margin-top: 0; }
  .site-nav__cta .btn { width: auto; }
}
</style>
