export const COLLAPSED_LINES_REGEXP = /:collapsed-lines(?:=(\d+))?\b/
export const NO_COLLAPSED_LINES_REGEXP = /:no-collapsed-lines\b/

const DEFAULT_LINES = 15

export function resolveCollapsedLines(info: string, defaultLines: boolean | number): number | false {
  if (NO_COLLAPSED_LINES_REGEXP.test(info))
    return false

  const lines = defaultLines === true ? DEFAULT_LINES : defaultLines

  const match = info.match(COLLAPSED_LINES_REGEXP)

  if (match) {
    return Number(match[1]) || lines || DEFAULT_LINES
  }
  return lines ?? false
}
