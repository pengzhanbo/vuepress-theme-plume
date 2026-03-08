/**
 * Write to temporary file only when content changes.
 * Optimizes file I/O by caching content hashes.
 *
 * 仅内容发生变更时，才写入临时文件。
 * 通过缓存内容哈希优化文件 I/O。
 */
import type { App } from 'vuepress'
import { hash } from './hash.js'

/**
 * Cache for content hashes to detect changes.
 * Maps file paths to their content hashes.
 *
 * 内容哈希缓存，用于检测变更。
 * 将文件路径映射到其内容哈希。
 */
export const contentHash: Map<string, string> = new Map()

/**
 * Write content to a temporary file if it has changed.
 * Uses hash comparison to avoid unnecessary writes.
 *
 * 如果内容已更改，则写入临时文件。
 * 使用哈希比较避免不必要的写入。
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param filepath - Relative path to the temporary file / 临时文件的相对路径
 * @param content - Content to write / 要写入的内容
 */
export async function writeTemp(
  app: App,
  filepath: string,
  content: string,
): Promise<void> {
  const currentHash = hash(content)
  if (!contentHash.has(filepath) || contentHash.get(filepath) !== currentHash) {
    contentHash.set(filepath, currentHash)
    await app.writeTemp(filepath, content)
  }
}

/**
 * Set or clear the content hash for a file.
 * Used to manually manage the hash cache.
 *
 * 设置或清除文件的内容哈希。
 * 用于手动管理哈希缓存。
 *
 * @param filepath - File path to manage / 要管理的文件路径
 * @param content - Content to hash, or empty to clear / 要哈希的内容，或为空以清除
 */
export function setContentHash(filepath: string, content: string): void {
  if (content) {
    const currentHash = hash(content)
    contentHash.set(filepath, currentHash)
  }
  else {
    contentHash.delete(filepath)
  }
}
