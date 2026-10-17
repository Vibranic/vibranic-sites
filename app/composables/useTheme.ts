import type { Locale, ThemePreset } from '~/types/site-config'

/**
 * Preset metadata for things CSS can't do (the browser theme-color meta)
 * and for the /design style guide. Keep `themeColor` equal to the preset's
 * --color-bg in app/assets/css/themes.css.
 */
export const THEME_META: Record<
  ThemePreset,
  {
    label: string
    personality: string
    /** One-line art-direction concept (DESIGN.md). */
    concept: string
    display: string
    body: string
    /** Supporting faces (accent word, micro-labels), if the preset has them. */
    extras?: string
    themeColor: string
  }
> = {
  atelier: {
    label: 'Atelier',
    personality: 'Warm en verfijnd, zoals een modemagazine. Voor kapsalons en beautysalons met een rustige, elegante sfeer.',
    concept: 'Modemagazine: boogvormige spiegelbeelden en cursieve accentwoorden.',
    display: 'Bodoni Moda',
    body: 'Jost',
    themeColor: '#f5efe6',
  },
  barber: {
    label: 'Barber',
    personality: 'Donker, stoer en zelfzeker. Messing op zwart, strakke hoeken. Voor barbershops en herenkappers.',
    concept: 'Chicago-uithangbord: torenhoge koppen en een barberpaal-streep.',
    display: 'Big Shoulders Display',
    body: 'Archivo',
    themeColor: '#111110',
  },
  fresh: {
    label: 'Fresh',
    personality: 'Jong, eigenzinnig en met de hand afgewerkt. Papier, inkt en één felle limoenkleur. Voor kapsalons, nagel-, lash- en beautystudio’s met karakter.',
    concept: 'Studio Zine: het eigen magazine van de salon, met reuzentype, stickers en krabbels in de kantlijn.',
    display: 'Anybody',
    body: 'Figtree',
    extras: 'Instrument Serif · DM Mono',
    themeColor: '#f2efe7',
  },
}

export const THEME_PRESETS = Object.keys(THEME_META) as ThemePreset[]

const HTML_LANG: Record<Locale, string> = { nl: 'nl-BE', en: 'en' }

/** Only `--token: value` pairs that can't break out of the style attribute. */
function overridesToStyle(overrides: Record<string, string | undefined> = {}): string | undefined {
  const css = Object.entries(overrides)
    .filter(([key, value]) => /^--[a-z0-9-]+$/i.test(key) && value && !/[;{}<>]/.test(value))
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')
  return css || undefined
}

/**
 * Applies the client's brand to <html>: data-theme (preset), token overrides
 * as inline custom properties, lang and theme-color. Runs during prerender,
 * so the static HTML already carries the theme (no flash).
 */
export function useTheme() {
  const { site, locale } = useSite()
  const { preset, overrides } = site.theme
  const style = overridesToStyle(overrides)

  useHead({
    htmlAttrs: {
      lang: () => HTML_LANG[locale.value],
      'data-theme': preset,
      ...(style ? { style } : {}),
    },
    meta: [{ name: 'theme-color', content: overrides?.['--color-bg'] ?? THEME_META[preset].themeColor }],
  })

  return { preset, meta: THEME_META[preset] }
}
