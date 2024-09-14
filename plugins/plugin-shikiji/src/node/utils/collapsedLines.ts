const COLLAPSED_LINES_REGEXP = /:collapsed-lines\b/
const COLLAPSED_LINES_START_REGEXP = /:collapsed-lines=(\d+)\b/
const NO_COLLAPSED_LINES_REGEXP = /:no-collapsed-lines\b/

/**
 * Resolve the `:collapsed-lines` `:collapsed-lines=num` / `:no-collapsed-lines` mark from token info
 */
export function resolveCollapsedLines(info: string): boolean | number | null {
  const lines = COLLAPSED_LINES_START_REGEXP.exec(info)?.[1]

  if (lines) {
    return Number(lines)
  }

  if (COLLAPSED_LINES_REGEXP.test(info)) {
    return true
  }

  if (NO_COLLAPSED_LINES_REGEXP.test(info)) {
    return false
  }

  return null
}
