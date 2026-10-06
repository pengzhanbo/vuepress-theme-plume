import type { App } from 'vuepress'
import fs from 'node:fs/promises'
import path from 'node:path'
import { hash } from 'vuepress/utils'
import { logger } from './logger.js'

/**
 * Cache data structure
 * Stores data with its hash for change detection
 *
 * 缓存数据结构
 * 存储数据及其哈希值用于变更检测
 */
interface CacheData<T = any> {
  /** Hash of the cached data / 缓存数据的哈希值 */
  hash: string
  /** Cached data / 缓存的数据 */
  data: T | null
}

/**
 * File system cache interface
 * Provides methods for reading and writing cached data
 *
 * 文件系统缓存接口
 * 提供读写缓存数据的方法
 */
export interface FsCache<T> {
  /** Current hash of cached data / 缓存数据的当前哈希值 */
  hash: string
  /** Current cached data / 当前缓存的数据 */
  data: T | null
  /**
   * Read data from cache
   * 从缓存读取数据
   */
  read: () => Promise<T | null>
  /**
   * Write data to cache
   * 将数据写入缓存
   */
  write: (data: T, clear?: boolean) => Promise<void>
}

const CACHE_BASE = 'markdown'

/**
 * Create a file system cache instance
 * Provides persistent caching using the file system
 *
 * 创建文件系统缓存实例
 * 使用文件系统提供持久化缓存
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param name - Cache file name / 缓存文件名
 * @returns File system cache instance / 文件系统缓存实例
 */
export function createFsCache<T = any>(app: App, name: string): FsCache<T> {
  const filepath = app.dir.cache(`${CACHE_BASE}/${name}.json`)
  const cache: CacheData<T> = { hash: '', data: null }

  /**
   * Read cached data from file
   * Loads and parses the cache file if it exists
   *
   * 从文件读取缓存数据
   * 如果存在则加载并解析缓存文件
   */
  const read = async (): Promise<T | null> => {
    if (!cache.data) {
      try {
        const content = await fs.readFile(filepath, 'utf-8')
        if (content) {
          const res = JSON.parse(content) as CacheData<T>
          cache.data = res.data ?? null
          cache.hash = hash(res.hash || '')
        }
      }
      catch (error) {
        // A missing cache file is the normal first-run case and must stay silent;
        // a corrupted/unreadable one should be visible, otherwise the cache is
        // silently ignored and the build gets slower for no apparent reason.
        // 缓存文件不存在是首次运行的正常情况，不应提示；文件损坏或不可读时需要可见，
        // 否则缓存被静默忽略，构建变慢却查不到原因。
        if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT')
          logger.warn(`Failed to read the cache file ${filepath}, it will be ignored.`, error)
      }
    }
    return cache.data
  }

  let timer: NodeJS.Timeout | null = null

  /**
   * Write data to cache file
   * Only writes if the data has changed (hash comparison)
   *
   * 将数据写入缓存文件
   * 仅在数据已更改时写入（哈希比较）
   *
   * @param data - Data to cache / 要缓存的数据
   * @param clear - Whether to clear cache after writing / 写入后是否清除缓存
   */
  const write = async (data: T, clear?: boolean) => {
    const currentHash = hash(data)
    if (cache.hash && currentHash === cache.hash)
      return

    cache.data = data
    cache.hash = currentHash

    timer && clearTimeout(timer)
    timer = setTimeout(async () => {
      // The timer callback runs outside any awaiting caller, so a rejected promise
      // here would become an unhandled rejection and may crash the process.
      // 定时回调不在任何 await 调用链中，这里的 rejection 会变成未处理的 rejection，
      // 甚至可能使进程崩溃。
      try {
        await fs.mkdir(path.dirname(filepath), { recursive: true })
        await fs.writeFile(filepath, JSON.stringify(cache), 'utf-8')
        if (clear) {
          cache.data = null
          cache.hash = ''
        }
      }
      catch (error) {
        logger.warn(`Failed to write the cache file ${filepath}.`, error)
      }
    }, 300)
  }

  return {
    get hash() {
      return cache.hash
    },
    get data() {
      return cache.data
    },
    read,
    write,
  }
}
