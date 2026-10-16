import type { Locale, ThemePreset } from '~/types/site-config'

/**
 * Preset metadata for things CSS can't do (the browser theme-color meta)
 * and for the /design style guide. Keep `themeColor` equal to the preset's
 * --color-bg in app/assets/css/themes.css.
 */
export const THEME_META: Record<
  ThemePreset,
  { label: string; personality: string; display: string; body: string; themeColor: string }
> = {
  atelier: {
    label: 'Atelier',
    personality: 'Warm en verfijnd, zoals een modemagazine. Voor kapsalons en beautysalons met een rustige, elegante sfeer.',
    display: 'Bodoni Moda',
    body: 'Jost',
    themeColor: '#f5efe6',
  },
  barber: {
    label: 'Barber',
    personality: 'Donker, stoer en zelfzeker. Messing op zwart, strakke hoeken. Voor barbershops en herenkappers.',
    display: 'Big Shoulders Display',
    body: 'Archivo',
    themeColor: '#111110',
  },
  fresh: {
    label: 'Fresh',
    personality: 'Licht, fris en speels. Ronde knoppen en een perzik accent. Voor nagelstudio’s, lash- en beautystudio’s.',
    display: 'Bricolage Grotesque',
    body: 'Figtree',
    themeColor: '#f3f7f5',
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
