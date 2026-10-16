import site from '~~/site.config'
import type { Locale, Text } from '~/types/site-config'

/** Single access point for site content + small formatting helpers. */
export function useSite() {
  const locale = useState<Locale>('locale', () => site.locales.default)

  /** Resolve a Text to the active language (falls back to Dutch). */
  const t = (text?: Text): string => {
    if (!text) return ''
    if (typeof text === 'string') return text
    return text[locale.value] ?? text.nl
  }

  /** 5200 → "€ 52", 5250 → "€ 52,50" (nl-BE formatting). */
  const price = (cents: number): string =>
    new Intl.NumberFormat('nl-BE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100)

  return { site, locale, t, price }
}
