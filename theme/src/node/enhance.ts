/**
 * Temporary enhancement for VuePress app.
 * This enhancement will be removed in the next version of vuepress/core.
 *
 * VuePress 应用的临时增强。
 * 此增强将在 vuepress/core 的下一个版本中被移除。
 */

import type { App } from 'vuepress'
import { fs, hash } from 'vuepress/utils'

/**
 * Cache structure for writeTemp operations.
 * Tracks content hash and writing promises for optimization.
 *
 * writeTemp 操作的缓存结构。
 * 跟踪内容哈希和写入承诺以进行优化。
 */
interface WriteTempCache {
  /** Content hash for change detection / 用于变更检测的内容哈希 */
  hash?: string
  /** Current writing promise / 当前写入承诺 */
  current?: Promise<void>
  /** Next writing promise to chain / 要链接的下一个写入承诺 */
  next?: () => Promise<void>
}

/**
 * Enhance the VuePress app with optimized writeTemp method.
 * Implements caching and promise chaining for better performance.
 *
 * 使用优化的 writeTemp 方法增强 VuePress 应用。
 * 实现缓存和承诺链接以获得更好的性能。
 *
 * @param app - VuePress application instance / VuePress 应用实例
 */
export function enhanceApp(app: App): void {
  // rewrite writeTemp to cache the writing promise
  const cache = new Map<string, WriteTempCache>()
  app.writeTemp = async function (file: string, content: string): Promise<string> {
    const filePath = app.dir.temp(file)
    const contentHash = hash(content)

    let item = cache.get(filePath)
    if (!item) {
      cache.set(filePath, (item = {}))
    }

    // if content hash is the same as the last one, skip writing
    if (item.hash === contentHash) {
      return filePath
    }

    item.hash = contentHash

    if (!item.current) {
      item.current = (async () => {
        await fs.outputFile(filePath, content)
        // if there is a next writing promise, chain it with the current one
        item.current = item.next?.()
        return item.current
      })()
    }
    else {
      // if there is a current writing promise, save the next writing promise
      item.next = async () => {
        await fs.outputFile(filePath, content)
        item.next = undefined
        item.current = undefined
      }
    }
    await item.current
    return filePath
  }
}
