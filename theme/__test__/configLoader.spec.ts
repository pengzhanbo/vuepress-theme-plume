import type { App } from 'vuepress'
import type { ThemeOptions } from '../src/shared/index.js'
import { watch as chokidarWatch } from 'chokidar'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { compiler } from '../src/node/features/loadConfig/compiler.js'
import { ConfigLoader } from '../src/node/features/loadConfig/ConfigLoader.js'
import { findConfigPath } from '../src/node/features/loadConfig/findConfigPath.js'
import { getThemeOptions, initConfigLoader } from '../src/node/options.js'
import { logger } from '../src/node/utils/index.js'

/** 捕获被 mock 的 chokidar watcher，便于在测试中触发 change 事件。 */
const hoisted = vi.hoisted(() => ({ watcher: undefined as any }))

vi.mock('../src/node/utils/index.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  normalizePath: (filepath: string) => filepath,
  perf: { mark: vi.fn(), log: vi.fn() },
  THEME_NAME: 'vuepress-theme-plume',
}))

vi.mock('../src/node/features/loadConfig/compiler.js', () => ({
  compiler: vi.fn(),
}))

vi.mock('../src/node/features/loadConfig/findConfigPath.js', () => ({
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

/** `ConfigLoader` 不再自行合并默认配置，由调用方注入 `update`。 */
const update = (config: ThemeOptions): ThemeOptions => config

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
    await loader.init({ app, defaultConfig: {}, update })

    await expect(waiting).resolves.toBeUndefined()
    await expect(loader.waiting()).resolves.toBeUndefined()
  })

  it('should reject waiting() when init fails while waiting', async () => {
    const error = new Error('config load failed')
    vi.mocked(findConfigPath).mockRejectedValue(error)

    const loader = new ConfigLoader()
    const waiting = loader.waiting()

    await expect(loader.init({ app, defaultConfig: {}, update })).resolves.toBeUndefined()
    await expect(waiting).rejects.toThrow(error)
  })

  it('should reject waiting() when init already failed before waiting() is called', async () => {
    const error = new Error('config load failed')
    vi.mocked(findConfigPath).mockRejectedValue(error)

    const loader = new ConfigLoader()

    await expect(loader.init({ app, defaultConfig: {}, update })).resolves.toBeUndefined()
    // should not hang forever with no visible error
    await expect(loader.waiting()).rejects.toThrow(error)
  })

  it('should reject waiting() when init fails with a falsy reason while waiting', async () => {
    vi.mocked(findConfigPath).mockRejectedValue(null)

    const loader = new ConfigLoader()
    const waiting = loader.waiting()

    await expect(loader.init({ app, defaultConfig: {}, update })).resolves.toBeUndefined()
    await expect(waiting).rejects.toBeNull()
  })

  it('should reject waiting() when init already failed with an undefined reason', async () => {
    vi.mocked(findConfigPath).mockRejectedValue(undefined)

    const loader = new ConfigLoader()

    await expect(loader.init({ app, defaultConfig: {}, update })).resolves.toBeUndefined()
    // a falsy rejection reason must not be mistaken for "no failure"
    await expect(loader.waiting()).rejects.toBeUndefined()
  })

  it('should clear the previous failure state after a successful init', async () => {
    vi.mocked(findConfigPath).mockRejectedValueOnce(null)
    vi.mocked(findConfigPath).mockResolvedValue(undefined)
    vi.mocked(compiler).mockResolvedValue({ config: {}, dependencies: [] })

    const loader = new ConfigLoader()

    await expect(loader.init({ app, defaultConfig: {}, update })).resolves.toBeUndefined()
    await expect(loader.init({ app, defaultConfig: {}, update })).resolves.toBeUndefined()
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
    await loader.init({ app, defaultConfig: {}, update })

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
    await loader.init({ app, defaultConfig: {}, update })

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
    await loader.init({ app, defaultConfig: {}, update })
    loader.watch([])

    const options = vi.mocked(chokidarWatch).mock.calls[0][1] as any
    expect(options.ignored('node_modules/pkg/index.js', { isFile: () => true })).toBe(true)
    expect(options.ignored('docs/index.md', { isFile: () => true })).toBe(false)
    expect(options.ignored('node_modules', { isFile: () => false })).toBe(false)
  })

  it('should expose the current config through getThemeOptions', async () => {
    vi.mocked(findConfigPath).mockResolvedValue(undefined)
    vi.mocked(compiler).mockResolvedValue({ config: {}, dependencies: [] })

    // 单例在 `options.ts` 中维护，`initConfigLoader` 返回同一个实例。
    const loader = initConfigLoader({ options: { locales: { '/': { lang: 'zh-CN' } } } } as unknown as App, {})
    await loader.waiting()

    expect(getThemeOptions()).toBe(loader.config)
  })
})
