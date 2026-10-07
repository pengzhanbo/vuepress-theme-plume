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
    // 用与查询一致的 `key`（pattern 的哈希）写入缓存，否则字符串 pattern 每次都会
    // 重新创建 matcher，缓存失效。Store under the same hashed `key` used for the lookup,
    // otherwise a single string pattern would rebuild a matcher on every call.
    matchers.set(key, matcher)
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
