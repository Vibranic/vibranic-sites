import { UI, fill } from '~/utils/ui-strings'

/** Fixed UI labels for the active locale (see app/utils/ui-strings.ts). */
export function useUi() {
  const { locale } = useSite()
  const ui = computed(() => UI[locale.value])

  /** 'YYYY-MM-DD' → '24 december 2026' (always Brussels-neutral: pure calendar date). */
  const formatDate = (dateKey: string, withYear = true): string =>
    new Intl.DateTimeFormat(locale.value === 'nl' ? 'nl-BE' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      ...(withYear ? { year: 'numeric' } : {}),
      timeZone: 'UTC',
    }).format(new Date(`${dateKey}T12:00:00Z`))

  return { ui, fill, formatDate }
}
