/**
 * LRU (Least Recently Used) Cache Implementation
 *
 * LRU（最近最少使用）缓存实现
 *
 * Adapted from https://stackoverflow.com/a/46432113/11613622
 *
 * @module plugin-search/client/utils/lru
 */

/**
 * Generic LRU Cache implementation using Map.
 *
 * 使用 Map 实现的通用 LRU 缓存。
 *
 * Automatically evicts the least recently used item when the cache reaches
 * its maximum size.
 *
 * 当缓存达到最大容量时，自动淘汰最近最少使用的项。
 *
 * @template K - Key type / 键类型
 * @template V - Value type / 值类型
 * @example
 * const cache = new LRUCache<string, number>(3)
 * cache.set('a', 1)
 * cache.set('b', 2)
 * cache.set('c', 3)
 * cache.set('d', 4) // 'a' is evicted
 * cache.get('b') // returns 2, 'b' becomes most recent
 */
export class LRUCache<K, V> {
  /** Maximum number of items in the cache / 缓存中的最大项数 */
  private max: number
  /** Internal Map storage / 内部 Map 存储 */
  private cache: Map<K, V>

  /**
   * Create a new LRU Cache instance.
   *
   * 创建新的 LRU 缓存实例。
   *
   * @param max - Maximum cache size (default: 10) / 最大缓存大小（默认：10）
   */
  constructor(max: number = 10) {
    this.max = max
    this.cache = new Map<K, V>()
  }

  /**
   * Get a value from the cache.
   *
   * 从缓存中获取值。
   *
   * Accessing an item moves it to the end (most recently used position).
   *
   * 访问项会将其移动到末尾（最近使用的位置）。
   *
   * @param key - Cache key / 缓存键
   * @returns Cached value or undefined if not found / 缓存值，未找到则返回 undefined
   */
  get(key: K): V | undefined {
    const item = this.cache.get(key)
    if (item !== undefined) {
      // refresh key
      this.cache.delete(key)
      this.cache.set(key, item)
    }
    return item
  }

  /**
   * Set a value in the cache.
   *
   * 在缓存中设置值。
   *
   * If the key already exists, it is moved to the end. If the cache is full,
   * the oldest item is evicted.
   *
   * 如果键已存在，则将其移动到末尾。如果缓存已满，则淘汰最旧的项。
   *
   * @param key - Cache key / 缓存键
   * @param val - Value to cache / 要缓存的值
   */
  set(key: K, val: V): void {
    // refresh key
    if (this.cache.has(key))
      this.cache.delete(key)
    // evict oldest
    else if (this.cache.size === this.max)
      this.cache.delete(this.first()!)
    this.cache.set(key, val)
  }

  /**
   * Get the first (oldest) key in the cache.
   *
   * 获取缓存中的第一个（最旧的）键。
   *
   * @returns The oldest key or undefined if cache is empty / 最旧的键，缓存为空则返回 undefined
   */
  first(): K | undefined {
    return this.cache.keys().next().value
  }

  /**
   * Clear all items from the cache.
   *
   * 清空缓存中的所有项。
   */
  clear(): void {
    this.cache.clear()
  }
}
