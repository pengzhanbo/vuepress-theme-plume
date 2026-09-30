import type { App } from 'vuepress'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { compiler } from '../src/node/loadConfig/compiler.js'
import { ConfigLoader } from '../src/node/loadConfig/ConfigLoader.js'
import { findConfigPath } from '../src/node/loadConfig/findConfigPath.js'

vi.mock('../src/node/utils/index.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  normalizePath: (filepath: string) => filepath,
  perf: { mark: vi.fn(), log: vi.fn() },
}))

vi.mock('../src/node/config/index.js', () => ({
  initThemeOptions: vi.fn(() => ({})),
}))

vi.mock('../src/node/loadConfig/compiler.js', () => ({
  compiler: vi.fn(),
}))

vi.mock('../src/node/loadConfig/findConfigPath.js', () => ({
  findConfigPath: vi.fn(),
}))

const app = {} as App

describe('configLoader', () => {
  beforeEach(() => {
    vi.mocked(findConfigPath).mockReset()
    vi.mocked(compiler).mockReset()
  })

  it('should resolve waiting() after a successful init', async () => {
    vi.mocked(findConfigPath).mockResolvedValue(undefined)
    vi.mocked(compiler).mockResolvedValue({ config: {}, dependencies: [] })

    const loader = new ConfigLoader()
    const waiting = loader.waiting()
    await loader.init(app, {}, undefined)

    await expect(waiting).resolves.toBeUndefined()
    await expect(loader.waiting()).resolves.toBeUndefined()
  })

  it('should reject waiting() when init fails while waiting', async () => {
    const error = new Error('config load failed')
    vi.mocked(findConfigPath).mockRejectedValue(error)

    const loader = new ConfigLoader()
    const waiting = loader.waiting()

    await expect(loader.init(app, {}, undefined)).rejects.toThrow(error)
    await expect(waiting).rejects.toThrow(error)
  })

  it('should reject waiting() when init already failed before waiting() is called', async () => {
    const error = new Error('config load failed')
    vi.mocked(findConfigPath).mockRejectedValue(error)

    const loader = new ConfigLoader()

    await expect(loader.init(app, {}, undefined)).rejects.toThrow(error)
    // should not hang forever with no visible error
    await expect(loader.waiting()).rejects.toThrow(error)
  })
})
