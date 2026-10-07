import type { App } from 'vuepress'
import { watch as chokidarWatch } from 'chokidar'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { compiler } from '../src/node/loadConfig/compiler.js'
import { ConfigLoader, configLoader, getThemeConfig } from '../src/node/loadConfig/ConfigLoader.js'
import { findConfigPath } from '../src/node/loadConfig/findConfigPath.js'
import { logger } from '../src/node/utils/index.js'

/** 捕获被 mock 的 chokidar watcher，便于在测试中触发 change 事件。 */
const hoisted = vi.hoisted(() => ({ watcher: undefined as any }))

vi.mock('../src/node/utils/index.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  normalizePath: (filepath: string) => filepath,
  perf: { mark: vi.fn(), log: vi.fn() },
}))

// `ConfigLoader` imports the implementation module directly (not the `config/index.js`
// barrel), so the mock must target the same specifier to take effect.
// `ConfigLoader` 直接导入实现模块（而非 `config/index.js` 桶文件），因此 mock 必须指向同一路径才生效。
vi.mock('../src/node/config/initThemeOptions.js', () => ({
  initThemeOptions: vi.fn(() => ({})),
}))

vi.mock('../src/node/loadConfig/compiler.js', () => ({
  compiler: vi.fn(),
}))

vi.mock('../src/node/loadConfig/findConfigPath.js', () => ({
  findConfigPath: vi.fn(),
}))

// chokidar 的 watcher 用轻量假对象替代，避免真实监听文件系统。
vi.mock('chokidar', () => {
  const handlers: Record<string, (...args: any[]) => any> = {}
  const watcher = {
    on: vi.fn((event: string, cb: (...args: any[]) => any) => {
      handlers[event] = cb
      return watcher
    }),
    add: vi.fn(),
    emit: (event: string, ...args: any[]) => handlers[event]?.(...args),
  }
  hoisted.watcher = watcher
  return { watch: vi.fn(() => watcher) }
})

const app = {} as App

describe('configLoader', () => {
  beforeEach(() => {
    vi.mocked(findConfigPath).mockReset()
    vi.mocked(compiler).mockReset()
    vi.mocked(chokidarWatch).mockClear()
    hoisted.watcher?.add.mockClear()
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

  it('should reject waiting() when init fails with a falsy reason while waiting', async () => {
    vi.mocked(findConfigPath).mockRejectedValue(null)

    const loader = new ConfigLoader()
    const waiting = loader.waiting()

    await expect(loader.init(app, {}, undefined)).rejects.toBeNull()
    await expect(waiting).rejects.toBeNull()
  })

  it('should reject waiting() when init already failed with an undefined reason', async () => {
    vi.mocked(findConfigPath).mockRejectedValue(undefined)

    const loader = new ConfigLoader()

    await expect(loader.init(app, {}, undefined)).rejects.toBeUndefined()
    // a falsy rejection reason must not be mistaken for "no failure"
    await expect(loader.waiting()).rejects.toBeUndefined()
  })

  it('should clear the previous failure state after a successful init', async () => {
    vi.mocked(findConfigPath).mockRejectedValueOnce(null)
    vi.mocked(findConfigPath).mockResolvedValue(undefined)
    vi.mocked(compiler).mockResolvedValue({ config: {}, dependencies: [] })

    const loader = new ConfigLoader()

    await expect(loader.init(app, {}, undefined)).rejects.toBeNull()
    await expect(loader.init(app, {}, undefined)).resolves.toBeUndefined()
    await expect(loader.waiting()).resolves.toBeUndefined()
  })

  it('should skip watching when no config file was found', () => {
    vi.mocked(findConfigPath).mockResolvedValue(undefined)

    const loader = new ConfigLoader()
    const watchers: any[] = []
    loader.watch(watchers)

    expect(watchers).toHaveLength(0)
    expect(chokidarWatch).not.toHaveBeenCalled()
  })

  it('should watch the config file and reload on change', async () => {
    vi.mocked(findConfigPath).mockResolvedValue('/project/plume.config.ts')
    vi.mocked(compiler)
      .mockResolvedValueOnce({ config: {}, dependencies: ['a'] })
      .mockResolvedValueOnce({ config: {}, dependencies: ['a', 'b'] })

    const loader = new ConfigLoader()
    await loader.init(app, {}, undefined)

    const changes: any[] = []
    loader.on('change', config => changes.push(config))
    const watchers: any[] = []
    loader.watch(watchers)

    expect(watchers).toHaveLength(1)
    expect(chokidarWatch).toHaveBeenCalledTimes(1)

    await hoisted.watcher.emit('change', '/project/plume.config.ts')

    // 重新加载后新增的依赖需要被追加到监听列表。
    expect(changes).toHaveLength(1)
    expect(hoisted.watcher.add).toHaveBeenCalledWith(['b'])
    expect(logger.info).toHaveBeenCalled()
  })

  it('should keep the previous config when reloading on change fails', async () => {
    vi.mocked(findConfigPath).mockResolvedValue('/project/plume.config.ts')
    vi.mocked(compiler)
      .mockResolvedValueOnce({ config: {}, dependencies: [] })
      .mockRejectedValueOnce(new Error('broken config'))

    const loader = new ConfigLoader()
    await loader.init(app, {}, undefined)

    const changes: any[] = []
    loader.on('change', config => changes.push(config))
    const watchers: any[] = []
    loader.watch(watchers)

    // 编译失败的回调不能抛出（否则会成为未处理的 rejection），
    // 也不能派发 change 事件，避免使用不完整的配置。
    // A failing recompile must neither reject (unhandled rejection) nor emit `change`.
    await expect(hoisted.watcher.emit('change', '/project/plume.config.ts')).resolves.toBeUndefined()

    expect(changes).toHaveLength(0)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })

  it('should ignore node_modules files while watching', async () => {
    vi.mocked(findConfigPath).mockResolvedValue('/project/plume.config.ts')
    vi.mocked(compiler).mockResolvedValue({ config: {}, dependencies: [] })

    const loader = new ConfigLoader()
    await loader.init(app, {}, undefined)
    loader.watch([])

    const options = vi.mocked(chokidarWatch).mock.calls[0][1] as any
    expect(options.ignored('node_modules/pkg/index.js', { isFile: () => true })).toBe(true)
    expect(options.ignored('docs/index.md', { isFile: () => true })).toBe(false)
    expect(options.ignored('node_modules', { isFile: () => false })).toBe(false)
  })

  it('should expose the current config through getThemeConfig', () => {
    expect(getThemeConfig()).toBe(configLoader.config)
  })
})
