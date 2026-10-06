import type { App } from 'vuepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  /** 已注册的监听事件名，用于断言监听器只注册一次。 */
  registeredEvents: [] as string[],
  readFileSync: vi.fn(),
}))

// chokidar 用轻量假对象替代，避免真实监听文件系统。
vi.mock('chokidar', () => {
  const handlers: Record<string, (...args: any[]) => any> = {}
  const watcher = {
    add: vi.fn(() => watcher),
    unwatch: vi.fn(),
    close: vi.fn(),
    on: vi.fn((event: string, cb: (...args: any[]) => any) => {
      hoisted.registeredEvents.push(event)
      handlers[event] = cb
      return watcher
    }),
  }
  return { watch: vi.fn(() => watcher) }
})

vi.mock('../src/node/demo/supports/file.js', () => ({
  readFileSync: hoisted.readFileSync,
}))

vi.mock('../src/node/demo/normal.js', () => ({
  compileCode: vi.fn(),
  parseEmbedCode: vi.fn(() => ({})),
}))

const { demoWatcher } = await import('../src/node/demo/watcher.js')
const { logger } = await import('../src/node/utils/logger.js')

const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))
fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const tmpDir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'demo-watcher-'))

afterAll(() => {
  // 仅清理本文件创建的临时目录，避免影响其它测试文件（它们共用 `.tmp` 根目录）。
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

function createApp(): App {
  return {
    dir: { temp: (...args: string[]) => path.join(tmpDir, ...args) },
  } as unknown as App
}

/** 等待 `updateWatchFiles` 的异步写入完成。 */
function flushTasks(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 20))
}

describe('demoWatcher', () => {
  beforeEach(() => {
    hoisted.readFileSync.mockReset()
    hoisted.readFileSync.mockReturnValue('')
  })

  it('should register listeners and the watcher wrapper only once', async () => {
    const watchers: any[] = []

    demoWatcher(createApp(), watchers)
    demoWatcher(createApp(), watchers)

    expect(hoisted.registeredEvents).toEqual(['change', 'unlink'])
    // 每次调用都 push 包装对象会导致泄漏与重复关闭。
    expect(watchers).toHaveLength(1)

    await flushTasks()
  })

  it('should warn instead of throwing when the cached watch file is corrupted', async () => {
    const warn = vi.spyOn(logger, 'warn').mockImplementation(() => {})
    hoisted.readFileSync.mockReturnValueOnce('{ invalid json')

    const watchers: any[] = []

    expect(() => demoWatcher(createApp(), watchers)).not.toThrow()
    expect(warn).toHaveBeenCalled()
    expect(hoisted.registeredEvents).toHaveLength(2)

    await flushTasks()
    warn.mockRestore()
  })
})
