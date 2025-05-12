export const EXTERNAL_URL_RE: RegExp = /^[a-z]+:/i
export const PATHNAME_PROTOCOL_RE: RegExp = /^pathname:\/\//
export const HASH_RE: RegExp = /#.*$/
export const EXT_RE: RegExp = /(index|README)?\.(md|html)$/

export const inBrowser: boolean = typeof document !== 'undefined'

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export function isActive(
  currentPath: string,
  matchPath?: string,
  asRegex = false,
): boolean {
  if (matchPath === undefined)
    return false

  currentPath = normalize(`/${currentPath.replace(/^\//, '')}`)

  if (asRegex)
    return new RegExp(matchPath).test(currentPath)

  if (normalize(matchPath) !== currentPath)
    return false

  const hashMatch = matchPath.match(HASH_RE)

  if (hashMatch)
    return (inBrowser ? location.hash : '') === hashMatch[0]

  return true
}

export function normalize(path: string): string {
  return decodeURI(path).replace(HASH_RE, '').replace(EXT_RE, '')
}

export function numToUnit(value?: string | number): string {
  if (typeof value === 'undefined')
    return ''
  if (String(Number(value)) === String(value)) {
    return `${value}px`
  }
  return value as string
}
