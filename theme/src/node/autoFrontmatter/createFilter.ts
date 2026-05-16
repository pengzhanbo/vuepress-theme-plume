import { isArray, isFunction, LRUCache } from '@pengzhanbo/utils'
import picomatch from 'picomatch'
import { hash } from 'vuepress/utils'

type Matcher = (filepath: string) => boolean
type Pattern = Matcher | string[] | string

const matchers = new LRUCache<string[] | string, Matcher>({ maxSize: 1024 })

/**
 * Create Filter from pattern
 */
export function createFilter(pattern: Pattern): Matcher {
  if (isFunction(pattern)) {
    return pattern
  }
  const key = hash(pattern)
  const value = matchers.get(key)
  if (value)
    return value

  if (!isArray(pattern)) {
    const matcher = picomatch(pattern)
    matchers.set(pattern, matcher)
    return matcher
  }

  const patterns: string[] = []
  const ignorePatterns: string[] = []

  // find negative patterns, like `!*.md`
  for (const p of pattern) {
    if (p.startsWith('!')) {
      ignorePatterns.push(p.slice(1))
    }
    else {
      patterns.push(p)
    }
  }

  const matcher
    = patterns.length === 0
      ? () => false
      : picomatch(patterns, { ignore: ignorePatterns })

  matchers.set(key, matcher)
  return matcher
}
