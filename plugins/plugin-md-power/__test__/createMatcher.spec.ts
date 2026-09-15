import { describe, expect, it } from 'vitest'
import { createMatcher, resolveMatcherPattern } from '../src/node/utils/createMatcher.js'

describe('resolveMatcherPattern', () => {
  it('should resolve include and exclude patterns', () => {
    expect(resolveMatcherPattern('*.md', 'test/**')).toEqual({
      pattern: ['*.md'],
      ignore: ['test/**'],
    })
  })

  it('should treat negated include patterns as ignore patterns', () => {
    expect(resolveMatcherPattern(['*.md', '!test/**', '!docs/**'], 'dist/**')).toEqual({
      pattern: ['*.md'],
      ignore: ['dist/**', 'test/**', 'docs/**'],
    })
  })

  it('should fallback to wildcard when all include patterns are negated', () => {
    expect(resolveMatcherPattern(['!test/**'])).toEqual({
      pattern: ['*'],
      ignore: ['test/**'],
    })
  })

  it('should fallback to wildcard when no include pattern is provided', () => {
    expect(resolveMatcherPattern()).toEqual({
      pattern: ['*'],
      ignore: [],
    })
  })
})

describe('createMatcher', () => {
  it('should match files by include and exclude patterns', () => {
    const matcher = createMatcher('**/*.md', '**/node_modules/**')
    expect(matcher('docs/guide.md')).toBe(true)
    expect(matcher('node_modules/pkg/readme.md')).toBe(false)
  })

  it('should reuse cached matcher for same patterns', () => {
    expect(createMatcher(['src/**'], ['test/**'])).toBe(createMatcher(['src/**'], ['test/**']))
  })

  it('should cache matcher with sorted patterns', () => {
    expect(createMatcher(['a/**', 'b/**'], ['c/**'])).toBe(createMatcher(['b/**', 'a/**'], ['c/**']))
  })

  it('should create matcher from negated include patterns', () => {
    const matcher = createMatcher(['!docs/**'])
    expect(matcher('docs/guide.md')).toBe(false)
    expect(matcher('other.md')).toBe(true)
  })
})
