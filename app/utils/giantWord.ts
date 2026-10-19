/**
 * The giant hero word is scaled with CSS so it fills its box exactly:
 * font-size = 100cqi × 0.97 / (--chars × --giant-char). `--chars` is the word's
 * WEIGHTED letter count. Weights were measured on Anybody 150% / 900 (DESIGN.md §3.9),
 * so a narrow "I" counts less than a wide "W".
 */
const WEIGHTS: Record<string, number> = {
  I: 0.5,
  F: 0.85, L: 0.85,
  E: 0.93,
  G: 1.1, H: 1.1, O: 1.1, Q: 1.1, U: 1.1, V: 1.1, X: 1.1, Y: 1.1,
  A: 1.15,
  N: 1.2,
  '&': 1.25,
  M: 1.35,
  W: 1.55,
  ' ': 0.35,
}

/** Everything not listed (B C D J K P R S T Z, digits, punctuation). */
const DEFAULT_WEIGHT = 1.03

/** 'Noor' → 4.43. Round to 2 decimals, matching the table in DESIGN.md. */
export function giantChars(word: string): number {
  const sum = [...word.toUpperCase()].reduce((total, char) => total + (WEIGHTS[char] ?? DEFAULT_WEIGHT), 0)
  return Math.round(sum * 100) / 100
}
