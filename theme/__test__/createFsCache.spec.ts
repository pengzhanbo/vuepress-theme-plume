import type { App } from 'vuepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { createFsCache } from '../src/node/utils/createFsCache.js'
import { logger } from '../src/node/utils/logger.js'

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))
fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const tmpDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'fs-cache-'))

afterAll(() => {
  // 仅清理本文件创建的临时目录，避免影响其它测试文件（它们共用 `.tmp` 根目录）。
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

/** 创建一个以 `tmpDir` 为缓存根目录的假 app。 */
function createApp(): App {
  return {
    dir: { cache: (file: string) => path.join(tmpDir, file) },
  } as unknown as App
}

describe('createFsCache', () => {
  it('should stay silent when the cache file does not exist yet', async () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {})

    const cache = createFsCache(createApp(), 'missing')

    // 首次运行没有缓存文件是正常情况，不应产生警告。
    await expect(cache.read()).resolves.toBeNull()
    expect(warn).not.toHaveBeenCalled()

    warn.mockRestore()
  })

  it('should persist and reload the cached data', async () => {
    const cache = createFsCache<{ a: number }>(createApp(), 'persist')

    await cache.write({ a: 1 })
    await new Promise(resolve => setTimeout(resolve, 400))
    expect(cache.hash).not.toBe('')

    // 新实例从磁盘读取缓存，命中已写入的数据。
    const reloaded = createFsCache<{ a: number }>(createApp(), 'persist')
    await expect(reloaded.read()).resolves.toEqual({ a: 1 })
    expect(reloaded.hash).not.toBe('')
    expect(reloaded.data).toEqual({ a: 1 })
  })

  it('should skip writing when the data is unchanged', async () => {
    const cache = createFsCache<{ a: number }>(createApp(), 'dedupe')

    await cache.write({ a: 1 })
    const firstHash = cache.hash
    await cache.write({ a: 1 })

    // 内容未变化时不应重新调度写入。
    expect(cache.hash).toBe(firstHash)
  })

  it('should clear the data after writing when requested', async () => {
    const cache = createFsCache<{ a: number }>(createApp(), 'clear')

    await cache.write({ a: 1 }, true)
    await new Promise(resolve => setTimeout(resolve, 400))

    expect(cache.data).toBeNull()
    expect(cache.hash).toBe('')
  })

  it('should return the cached data without re-reading the file', async () => {
    const app = createApp()
    const filepath = path.join(tmpDir, 'markdown/cached.json')
    fs.mkdirSync(path.dirname(filepath), { recursive: true })
    fs.writeFileSync(filepath, JSON.stringify({ hash: 'whatever', data: { a: 1 } }))

    const cache = createFsCache<{ a: number }>(app, 'cached')
    await expect(cache.read()).resolves.toEqual({ a: 1 })

    // 内存中已有数据时，删除磁盘文件也不影响再次读取。
    fs.rmSync(filepath)
    await expect(cache.read()).resolves.toEqual({ a: 1 })
  })

  it('should ignore an empty cache file', async () => {
    const filepath = path.join(tmpDir, 'markdown/empty.json')
    fs.mkdirSync(path.dirname(filepath), { recursive: true })
    fs.writeFileSync(filepath, '')

    const cache = createFsCache(createApp(), 'empty')

    await expect(cache.read()).resolves.toBeNull()
  })

  it('should debounce consecutive writes', async () => {
    const cache = createFsCache<{ a: number }>(createApp(), 'debounce')

    await cache.write({ a: 1 })
    await cache.write({ a: 2 })
    await new Promise(resolve => setTimeout(resolve, 400))

    // 只有最后一次写入落盘。
    const reloaded = createFsCache<{ a: number }>(createApp(), 'debounce')
    await expect(reloaded.read()).resolves.toEqual({ a: 2 })
  })

  it('should restore a cache entry that stored no data', async () => {
    const filepath = path.join(tmpDir, 'markdown/no-data.json')
    fs.mkdirSync(path.dirname(filepath), { recursive: true })
    fs.writeFileSync(filepath, JSON.stringify({ hash: 'h', data: null }))

    const cache = createFsCache(createApp(), 'no-data')

    await expect(cache.read()).resolves.toBeNull()
    expect(cache.hash).not.toBe('')
  })

  it('should warn and ignore a corrupted cache file', async () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {})
    const filepath = path.join(tmpDir, 'markdown/corrupted.json')
    fs.mkdirSync(path.dirname(filepath), { recursive: true })
    fs.writeFileSync(filepath, '{ invalid json')

    const cache = createFsCache(createApp(), 'corrupted')

    await expect(cache.read()).resolves.toBeNull()
    expect(warn).toHaveBeenCalled()

    warn.mockRestore()
  })

  it('should report a failed deferred write instead of rejecting', async () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {})
    // `blocker` 是文件，不能作为父目录，因此 `mkdir` 会失败。
    const blocker = path.join(tmpDir, 'blocker')
    fs.writeFileSync(blocker, '')

    const cache = createFsCache(
      { dir: { cache: (file: string) => path.join(blocker, file) } } as unknown as App,
      'failed',
    )

    // 定时写入的 rejection 若未被处理会变成 unhandled rejection。
    await cache.write({ foo: 'bar' })
    await new Promise(resolve => setTimeout(resolve, 400))

    expect(warn).toHaveBeenCalled()

    warn.mockRestore()
  })
})
