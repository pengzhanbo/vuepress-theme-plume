/**
 * 此增强为临时性措施，vuepress/core 将会在下个版本中实现
 * 在 vuepress/core 下个版本是，应该删除此增强
 */

import type { App } from 'vuepress'
import { fs, hash } from 'vuepress/utils'

interface WriteTempCache {
  hash?: string // content hash
  current?: Promise<void> // the current writing promise
  next?: () => Promise<void> // the next writing promise
}

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
