/**
 * Config headings mark the accent word with asterisks: 'Haar dat *bij jou* past'.
 * We HTML-escape the whole string FIRST, then turn *x* into <em>x</em>, so the only
 * markup that can ever reach v-html is the <em> we generate ourselves.
 */
const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char)
}

export function richText(input: string): string {
  return escapeHtml(input).replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
}

/** Same text without the markers, for <title>, meta tags and aria labels. */
export function stripAccent(input: string): string {
  return input.replace(/\*([^*\n]+)\*/g, '$1')
}
