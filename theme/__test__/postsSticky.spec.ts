import { describe, expect, it } from 'vitest'
import { resolveSticky, sortPostsBySticky } from '../src/client/utils/posts.js'

describe('resolveSticky', () => {
  it('maps `true` to the highest priority', () => {
    expect(resolveSticky(true)).toBe(Number.MAX_SAFE_INTEGER)
  })

  it('keeps finite positive numbers as-is', () => {
    expect(resolveSticky(1)).toBe(1)
    expect(resolveSticky(42)).toBe(42)
    expect(resolveSticky(0.5)).toBe(0.5)
  })

  it('treats non-sticky values as 0', () => {
    expect(resolveSticky(0)).toBe(0)
    expect(resolveSticky(false)).toBe(0)
    expect(resolveSticky(undefined)).toBe(0)
    expect(resolveSticky(null)).toBe(0)
    expect(resolveSticky(-1)).toBe(0)
    expect(resolveSticky(Number.NaN)).toBe(0)
    expect(resolveSticky(Number.POSITIVE_INFINITY)).toBe(0)
  })
})

describe('sortPostsBySticky', () => {
  it('moves sticky posts to the front without mutating the input', () => {
    const posts = [
      { title: 'a' },
      { title: 'b', sticky: true },
      { title: 'c' },
    ]

    const sorted = sortPostsBySticky(posts)

    expect(sorted.map(post => post.title)).toEqual(['b', 'a', 'c'])
    expect(posts.map(post => post.title)).toEqual(['a', 'b', 'c'])
  })

  it('orders sticky posts by descending numeric priority', () => {
    const posts = [
      { title: 'a', sticky: 1 },
      { title: 'b', sticky: 10 },
      { title: 'c', sticky: 5 },
    ]

    expect(sortPostsBySticky(posts).map(post => post.title)).toEqual(['b', 'c', 'a'])
  })

  it('ranks `true` above any number, matching the documented "number is priority" semantics', () => {
    const posts = [
      { title: 'a', sticky: 9999 },
      { title: 'b', sticky: true },
      { title: 'c', sticky: 1 },
    ]

    expect(sortPostsBySticky(posts).map(post => post.title)).toEqual(['b', 'a', 'c'])
  })

  it('keeps the original relative order for equal priorities (stable sort)', () => {
    const posts = [
      { title: 'a', sticky: 5 },
      { title: 'b', sticky: 5 },
      { title: 'c' },
      { title: 'd' },
    ]

    expect(sortPostsBySticky(posts).map(post => post.title)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('treats `sticky: 0` as not sticky instead of dropping the post', () => {
    const posts = [
      { title: 'a', sticky: 1 },
      { title: 'b', sticky: 0 },
      { title: 'c' },
    ]

    expect(sortPostsBySticky(posts).map(post => post.title)).toEqual(['a', 'b', 'c'])
  })
})
