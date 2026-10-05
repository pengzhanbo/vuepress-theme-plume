import process from 'node:process'
import { cancel, confirm, select, text } from '@clack/prompts'
import osLocale from 'os-locale'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DeployType, Mode } from '../src/constants.js'
import { prompt } from '../src/prompt.js'

/** 交互式提示对象的捕获容器，用于在测试中直接调用回调与校验函数。 */
const hoisted = vi.hoisted(() => ({
  prompts: {} as Record<string, () => any>,
  onCancel: undefined as undefined | (() => void),
}))

vi.mock('os-locale', () => ({ default: vi.fn(() => 'en-US') }))

// `group` 逐个执行提示回调并汇总结果，等价于真实交互中用户按序作答。
vi.mock('@clack/prompts', () => ({
  group: vi.fn(async (prompts: Record<string, () => any>, opts?: { onCancel?: () => void }) => {
    hoisted.prompts = prompts
    hoisted.onCancel = opts?.onCancel
    const result: Record<string, any> = {}
    for (const key of Object.keys(prompts))
      result[key] = await prompts[key]()
    return result
  }),
  select: vi.fn(),
  text: vi.fn(),
  confirm: vi.fn(),
  cancel: vi.fn(),
}))

/** 覆盖 stdout/stdin 的 TTY 状态，模拟交互式或管道环境。 */
function setTTY(value: boolean) {
  for (const stream of [process.stdout, process.stdin])
    Object.defineProperty(stream, 'isTTY', { value, configurable: true })
}

describe('prompt > non-interactive', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setTTY(false)
    vi.mocked(osLocale).mockReturnValue('en-US')
  })

  afterEach(() => {
    setTTY(false)
  })

  it('should use the init defaults with --yes', async () => {
    const result = await prompt(Mode.init, undefined, { yes: true })

    expect(result.root).toBe('./docs')
    expect(result.git).toBe(false)
    expect(result.deploy).toBe(DeployType.custom)
    expect(result.displayLang).toBe('en-US')
  })

  it('should use the create defaults with --yes', async () => {
    const result = await prompt(Mode.create, undefined, { yes: true })

    expect(result.root).toBe('./my-project')
    expect(result.git).toBe(true)
  })

  it('should keep a valid root passed from the command line', async () => {
    const result = await prompt(Mode.create, 'site', { yes: true })

    expect(result.root).toBe('site')
  })

  it('should resolve zh-CN from the os locale', async () => {
    vi.mocked(osLocale).mockReturnValue('zh-CN')
    const result = await prompt(Mode.create, undefined, { yes: true })

    expect(result.displayLang).toBe('zh-CN')
  })

  it('should fall back to en-US for unknown os locales', async () => {
    vi.mocked(osLocale).mockReturnValue('fr-FR')
    const result = await prompt(Mode.create, 'site', { yes: true })

    expect(result.displayLang).toBe('en-US')
  })

  it('should reject an invalid root', async () => {
    await expect(prompt(Mode.init, '../evil', { yes: true })).rejects.toThrow()
  })

  it('should log a hint when degrading to non-interactive automatically', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})

    // 未传 `--yes` 且无 TTY 时自动降级，并提示用户使用了默认选项。
    await prompt(Mode.create)

    expect(log).toHaveBeenCalled()
    log.mockRestore()
  })
})

describe('prompt > interactive', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setTTY(true)
    vi.mocked(osLocale).mockReturnValue('en-US')
    vi.mocked(select).mockImplementation(async (opts: any) => opts.options[0].value)
    vi.mocked(text).mockImplementation(async (opts: any) => opts.defaultValue)
    vi.mocked(confirm).mockImplementation(async (opts: any) => opts.initialValue)
  })

  afterEach(() => {
    setTTY(false)
  })

  it('should collect every answer in create mode', async () => {
    const result = await prompt(Mode.create)

    expect(result.root).toBe('./my-project')
    expect(result.siteName).toBe('My Vuepress Site')
    expect(result.bundler).toBe('vite')
    expect(result.injectNpmScripts).toBe(true)
    expect(result.git).toBe(true)
    expect(result.deploy).toBe(DeployType.custom)
  })

  it('should apply init mode defaults and honour --no-install', async () => {
    const result = await prompt(Mode.init, 'site', { install: false })

    expect(result.root).toBe('site')
    expect(result.injectNpmScripts).toBe(true)
    expect(result.git).toBe(false)
    expect(result.deploy).toBe(DeployType.custom)
    expect(result.install).toBe(false)
  })

  it('should default the root to ./docs in init mode', async () => {
    const result = await prompt(Mode.init)

    expect(result.root).toBe('./docs')
    const configs = vi.mocked(text).mock.calls.map(([opts]) => opts as any)
    expect(configs[0].defaultValue).toBe('./docs')
  })

  it('should use zh-CN when the os locale is zh-CN', async () => {
    vi.mocked(osLocale).mockReturnValue('zh-CN')
    const result = await prompt(Mode.create)

    expect(result.displayLang).toBe('zh-CN')
  })

  it('should use zh-CN when the os locale is zh-Hans', async () => {
    vi.mocked(osLocale).mockReturnValue('zh-Hans')
    const result = await prompt(Mode.create)

    expect(result.displayLang).toBe('zh-CN')
  })

  it('should ask for the language when the os locale is unknown', async () => {
    vi.mocked(osLocale).mockReturnValue('fr-FR')
    const result = await prompt(Mode.create)

    expect(result.displayLang).toBe('en-US')
    expect(select).toHaveBeenCalled()
  })

  it('should reject an invalid root passed from the command line', async () => {
    await expect(prompt(Mode.create, '/abs')).rejects.toThrow()
  })

  it('should validate root and site name inputs', async () => {
    await prompt(Mode.create)
    const configs = vi.mocked(text).mock.calls.map(([opts]) => opts as any)

    const rootConfig = configs[0]
    expect(rootConfig.validate('../evil')).toBeTruthy()
    expect(rootConfig.validate('docs')).toBeUndefined()

    const siteNameConfig = configs[1]
    expect(siteNameConfig.validate('   ')).toBeTruthy()
    expect(siteNameConfig.validate('')).toBeUndefined()
    expect(siteNameConfig.validate(undefined)).toBeUndefined()
    expect(siteNameConfig.validate('name')).toBeUndefined()
  })

  it('should exit with a non-zero code when the user cancels', async () => {
    const exit = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as any)

    await prompt(Mode.create)
    expect(typeof hoisted.onCancel).toBe('function')

    hoisted.onCancel!()
    expect(cancel).toHaveBeenCalled()
    expect(exit).toHaveBeenCalledWith(1)
    exit.mockRestore()
  })
})
