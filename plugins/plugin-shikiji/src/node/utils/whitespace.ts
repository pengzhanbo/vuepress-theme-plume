export const WHITESPACE_REGEXP = /:whitespace(?:=(all|boundary|trailing)?)?\b/
export const NO_WHITESPACE_REGEXP = /:no-whitespace\b/

export type WhitespacePosition = 'all' | 'boundary' | 'trailing'

export function resolveWhitespacePosition(info: string, defaultPosition?: boolean | WhitespacePosition): WhitespacePosition | false {
  if (NO_WHITESPACE_REGEXP.test(info)) {
    return false
  }

  const position = defaultPosition === true ? undefined : defaultPosition

  const match = info.match(WHITESPACE_REGEXP)
  if (match) {
    return (match[1] || position || 'all') as WhitespacePosition
  }
  return defaultPosition === true ? 'all' : defaultPosition ?? false
}
