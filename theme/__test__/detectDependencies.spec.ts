import type { ThemeBuiltinPlugins, ThemeOptions } from '../src/shared/index.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `detectDependencies` checks package availability, the package manager agent and the
 * theme logger. All three are stubbed so the installed / missing combinations can be
 * driven deterministically.
 *
 * `detectDependencies` 依赖包可用性、包管理器检测与主题 logger。
 * 这里将三者桩化，以便确定性地覆盖「已安装 / 缺失」的组合。
 */
const hoisted = vi.hoisted(() => ({
  installed: new Set<string>(),
  agent: null as string | null,
  command: null as { command?: string, args?: string[] } | null,
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
}))

vi.mock('local-pkg', () => ({
  isPackageExists: (name: string) => hoisted.installed.has(name),
}))

vi.mock('package-manager-detector', () => ({
  getUserAgent: () => hoisted.agent,
  resolveCommand: () => hoisted.command,
}))

vi.mock('../src/node/utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/node/utils/index.js')>()
  return {
    ...actual,
    logger: { info: hoisted.info, warn: hoisted.warn, error: hoisted.error },
  }
})

const { detectDependencies } = await import('../src/node/detector/dependency.js')

beforeEach(() => {
  hoisted.installed = new Set()
  hoisted.agent = null
  hoisted.command = null
  vi.clearAllMocks()
})

function detect(options: ThemeOptions = {}, plugins: ThemeBuiltinPlugins = {}): void {
  detectDependencies(options, plugins)
}

describe('detectDependencies', () => {
  it('does nothing when no optional feature is enabled', () => {
    detect()

    expect(hoisted.error).not.toHaveBeenCalled()
    expect(hoisted.info).not.toHaveBeenCalled()
  })

  it('stays silent when the required dependency is installed', () => {
    hoisted.installed.add('@vuepress/shiki-twoslash')

    detect({ codeHighlighter: { twoslash: true } } as ThemeOptions)

    expect(hoisted.error).not.toHaveBeenCalled()
  })

  it('reports the missing twoslash dependency', () => {
    detect({ codeHighlighter: { twoslash: true } } as ThemeOptions)

    expect(hoisted.error).toHaveBeenCalledTimes(1)
    const message = hoisted.error.mock.calls[0][0] as string
    expect(message).toContain('twoslash')
    expect(message).toContain('@vuepress/shiki-twoslash')
  })

  it('reports missing markdown chart dependencies', () => {
    detect({ markdown: { chartjs: true, mermaid: true } } as ThemeOptions)

    const message = hoisted.error.mock.calls[0][0] as string
    expect(message).toContain('chart.js')
    expect(message).toContain('mermaid')
  })

  it('reports missing dependencies of the markdown-chart plugin', () => {
    detect({}, { markdownChart: { echarts: true, markmap: true } } as ThemeBuiltinPlugins)

    const message = hoisted.error.mock.calls[0][0] as string
    expect(message).toContain('echarts')
    expect(message).toContain('markmap-lib')
    expect(message).toContain('markmap-toolbar')
    expect(message).toContain('markmap-view')
  })

  it('reports the python repl dependency', () => {
    detect({ markdown: { repl: { python: true } } } as ThemeOptions)

    expect(hoisted.error.mock.calls[0][0] as string).toContain('pyodide')
  })

  it('reports the mathjax dependency only for the mathjax type', () => {
    detect({ markdown: { math: { type: 'mathjax' } } } as ThemeOptions)
    expect(hoisted.error.mock.calls[0][0] as string).toContain('@mathjax/src')

    hoisted.error.mockClear()
    // 其它 math 类型不需要 mathjax。
    detect({ markdown: { math: { type: 'katex' } } } as ThemeOptions)
    expect(hoisted.error).not.toHaveBeenCalled()
  })

  it('detects artPlayer enabled through markdown or the power plugin', () => {
    detect({ markdown: { artPlayer: true } } as ThemeOptions)
    expect(hoisted.error.mock.calls[0][0] as string).toContain('artplayer')

    hoisted.error.mockClear()
    detect({}, { markdownPower: { artPlayer: true } } as ThemeBuiltinPlugins)
    expect(hoisted.error.mock.calls[0][0] as string).toContain('artplayer')
  })

  it('still reports the dependencies when no install command can be resolved', () => {
    hoisted.agent = 'pnpm'
    // 无法解析安装命令时，回退为空命令而不是抛错。
    hoisted.command = null

    detect({ codeHighlighter: { twoslash: true } } as ThemeOptions)

    expect(hoisted.info).toHaveBeenCalledTimes(1)
    expect(hoisted.info.mock.calls[0][0]).toContain('install')
  })

  it('suggests an install command when a package manager is detected', () => {
    hoisted.agent = 'pnpm'
    hoisted.command = { command: 'pnpm', args: ['add', '@vuepress/shiki-twoslash'] }

    detect({ codeHighlighter: { twoslash: true } } as ThemeOptions)

    expect(hoisted.info).toHaveBeenCalledTimes(1)
    const message = hoisted.info.mock.calls[0][0] as string
    // twoslash 需要 `@next` 版本。
    expect(message).toContain('@vuepress/shiki-twoslash@next')
  })
})
