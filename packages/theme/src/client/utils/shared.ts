export const EXTERNAL_URL_RE = /^[a-z]+:/i
export const PATHNAME_PROTOCOL_RE = /^pathname:\/\//
export const APPEARANCE_KEY = 'vuepress-theme-appearance'
export const HASH_RE = /#.*$/
export const EXT_RE = /(index)?\.(md|html)$/

export const inBrowser = typeof document !== 'undefined'

export function isActive(
  currentPath: string,
  matchPath?: string,
  asRegex = false
): boolean {
  if (matchPath === undefined) {
    return false
  }

  currentPath = normalize(`/${currentPath.replace(/^\//, '')}`)

  if (asRegex) {
    return new RegExp(matchPath).test(currentPath)
  }

  if (normalize(matchPath) !== currentPath) {
    return false
  }

  const hashMatch = matchPath.match(HASH_RE)

  if (hashMatch) {
    return (inBrowser ? location.hash : '') === hashMatch[0]
  }

  return true
}

export function normalize(path: string): string {
  return decodeURI(path).replace(HASH_RE, '').replace(EXT_RE, '')
}

export function isExternal(path: string): boolean {
  return EXTERNAL_URL_RE.test(path)
}

export function throttleAndDebounce(fn: () => void, delay: number): () => void {
  // eslint-disable-next-line no-undef
  let timeoutId: NodeJS.Timeout
  let called = false

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (!called) {
      fn()
      called = true
      setTimeout(() => {
        called = false
      }, delay)
    } else {
      timeoutId = setTimeout(fn, delay)
    }
  }
}
