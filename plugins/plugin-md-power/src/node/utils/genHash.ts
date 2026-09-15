import { createHash } from 'node:crypto'
import { isPrimitive } from '@pengzhanbo/utils'

/**
 * Generate a SHA-256 hash from the given data.
 *
 * 根据给定数据生成 SHA-256 哈希值。
 *
 * Primitive values are converted to strings directly, while objects are serialized
 * to JSON before hashing. When `length` is provided, the hash is truncated to the
 * specified length.
 *
 * 基本类型直接转为字符串，对象则序列化为 JSON 后再哈希。提供 `length` 时，
 * 哈希值会被截断到指定长度。
 *
 * @param data - The data to hash, can be any value / 要哈希的数据，可以是任意值
 * @param length - Optional length to truncate the hash / 可选的哈希值截断长度
 * @returns The SHA-256 hash string (truncated if length is given)
 *   / SHA-256 哈希字符串（指定长度时会被截断）
 * @example
 * ```ts
 * genHash('hello') // full sha256 hash
 * genHash({ a: 1 }, 8) // 8-character hash
 * ```
 */
export function genHash(data: unknown, length?: number): string {
  const str = isPrimitive(data) ? String(data) : JSON.stringify(data)
  const hash = createHash('sha256').update(str).digest('hex')
  return length ? hash.slice(0, length) : hash
}
