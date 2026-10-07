import { describe, expect, it } from 'vitest'
import { createFilter } from '../src/node/autoFrontmatter/createFilter.js'

describe('createFilter', () => {
  it('should return the given matcher function unchanged', () => {
    const matcher = (filepath: string) => filepath === 'a.md'

    expect(createFilter(matcher)).toBe(matcher)
  })

  it('should match files with a single glob pattern', () => {
    const filter = createFilter('docs/**/*.md')

    expect(filter('docs/a.md')).toBe(true)
    expect(filter('docs/guide/a.md')).toBe(true)
    expect(filter('blog/a.md')).toBe(false)
  })

  it('should support an array of patterns with negative entries', () => {
    const filter = createFilter(['**/*.md', '!**/draft/**'])

    expect(filter('a.md')).toBe(true)
    expect(filter('guide/a.md')).toBe(true)
    // 以 `!` 开头的模式被当作 ignore，命中时不匹配。
    expect(filter('draft/a.md')).toBe(false)
    expect(filter('a.txt')).toBe(false)
  })

  it('should never match when every pattern is negative', () => {
    const filter = createFilter(['!**/draft/**'])

    expect(filter('a.md')).toBe(false)
    expect(filter('draft/a.md')).toBe(false)
  })

  it('should never match an empty pattern list', () => {
    const filter = createFilter([])

    expect(filter('a.md')).toBe(false)
  })

  it('should cache matchers for the same pattern', () => {
    // 相同的 pattern 内容（即使是不同数组实例）应复用同一个 matcher，避免重复构建。
    expect(createFilter(['cache/**/*.md'])).toBe(createFilter(['cache/**/*.md']))
    // 单个字符串 pattern 同样需要命中缓存。
    expect(createFilter('cache-single/**/*.md')).toBe(createFilter('cache-single/**/*.md'))
  })
})
