import { describe, expect, it } from 'vitest'
import { LRUCache } from '../src/client/utils/lru.js'

describe('lru cache', () => {
  it('stores and retrieves values', () => {
    const cache = new LRUCache<string, number>(2)
    cache.set('a', 1)
    expect(cache.get('a')).toBe(1)
    expect(cache.get('missing')).toBeUndefined()
  })

  it('evicts the least recently used item', () => {
    const cache = new LRUCache<string, number>(2)
    cache.set('a', 1)
    cache.set('b', 2)
    cache.get('a') // 'a' becomes the most recently used
    cache.set('c', 3) // 'b' should be evicted
    expect(cache.get('b')).toBeUndefined()
    expect(cache.get('a')).toBe(1)
    expect(cache.get('c')).toBe(3)
  })

  it('clears all items', () => {
    const cache = new LRUCache<string, number>(2)
    cache.set('a', 1)
    cache.clear()
    expect(cache.get('a')).toBeUndefined()
    expect(cache.first()).toBeUndefined()
  })
})
