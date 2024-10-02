import type { App } from 'vuepress'
import fs from 'node:fs/promises'
import path from 'node:path'
import { hash } from 'vuepress/utils'

interface CacheData<T = any> {
  hash: string
  data: T | null
}

export interface FsCache<T> {
  hash: string
  data: T | null
  read: () => Promise<T | null>
  write: (data: T) => Promise<void>
}

const CACHE_BASE = 'markdown'

export function createFsCache<T = any>(app: App, name: string): FsCache<T> {
  const filepath = app.dir.cache(`${CACHE_BASE}/${name}.json`)
  const cache: CacheData<T> = { hash: '', data: null }

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
      catch {}
    }
    return cache.data
  }

  let timer: NodeJS.Timeout | null = null
  const write = async (data: T) => {
    const currentHash = hash(data)
    if (cache.hash && currentHash === cache.hash)
      return

    cache.data = data
    cache.hash = currentHash

    timer && clearTimeout(timer)
    timer = setTimeout(async () => {
      await fs.mkdir(path.dirname(filepath), { recursive: true })
      await fs.writeFile(filepath, JSON.stringify(cache), 'utf-8')
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
