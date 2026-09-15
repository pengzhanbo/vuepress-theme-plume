import type { Matcher } from 'picomatch'
import { isArray, LRUCache, toArray, uniq } from '@pengzhanbo/utils'
import picomatch from 'picomatch'
import { genHash } from './genHash.js'

const cache = new LRUCache<string, Matcher>({ maxSize: 100 })

/**
 * Create a matcher for the given include and exclude patterns.
 *
 * 创建一个用于给定 include 和 exclude 模式的匹配器。
 *
 * @param include - Patterns to include, can be string or array / 要包含的模式，可以是字符串或数组
 * @param exclude - Patterns to exclude, can be string or array / 要排除的模式，可以是字符串或数组
 * @returns Matcher instance / 匹配器实例
 */
export function createMatcher(include?: string | string[], exclude?: string | string[]): Matcher {
  const key = genHash([normalize(include), normalize(exclude)])
  if (cache.has(key))
    return cache.get(key)!

  const { pattern, ignore } = resolveMatcherPattern(include, exclude)
  const matcher = picomatch(pattern, { ignore })
  cache.set(key, matcher)
  return matcher
}

/**
 * Resolve include and exclude patterns into pattern and ignore arrays.
 * Converts various pattern formats into a standardized format for matching.
 *
 * 将 include 和 exclude 模式解析为 pattern 和 ignore 数组。
 * 将各种模式格式转换为用于匹配的标准化格式。
 *
 * @param include - Patterns to include, can be string or array / 要包含的模式，可以是字符串或数组
 * @param exclude - Patterns to exclude, can be string or array / 要排除的模式，可以是字符串或数组
 * @returns Object containing pattern and ignore arrays / 包含 pattern 和 ignore 数组的对象
 */
export function resolveMatcherPattern(include?: string | string[], exclude?: string | string[]): {
  pattern: string[]
  ignore: string[]
} {
  const pattern: string[] = []
  const ignore: string[] = uniq(toArray(exclude))

  toArray(include).forEach((item) => {
    if (item.startsWith('!')) {
      ignore.push(item.slice(1))
    }
    else {
      pattern.push(item)
    }
  })

  if (pattern.length === 0)
    pattern.push('*')

  return { pattern, ignore }
}

function normalize(arr?: string | string[]) {
  return isArray(arr) ? [...arr].sort((a, b) => a.localeCompare(b)) : arr
}
