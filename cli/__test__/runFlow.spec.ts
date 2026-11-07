import type { PromptResult } from '../src/types.js'
import process from 'node:process'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DeployType, Mode } from '../src/constants.js'

/**
 * `run` 是 CLI 的编排层：提示 → 生成文件 → 初始化 git → 安装依赖。测试只验证编排
 * 与失败路径，因此 prompt、generate、子进程与终端输出都被替换为可断言桩。
 *
 * `run` is the CLI orchestration layer: prompt → generate → git init → install.
 * The test only verifies orchestration and failure paths, so prompt, generate,
 * child processes and terminal output are replaced with assertable stubs.
 */
const hoisted = vi.hoisted(() => ({
  prompt: vi.fn(),
  generate: vi.fn(),
  spawn: vi.fn(),
  getPackageManager: vi.fn(),
  intro: vi.fn(),
  outro: vi.fn(),
  progress: {
    start: vi.fn(),
    message: vi.fn(),
    stop: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@clack/prompts', () => ({
  intro: hoisted.intro,
  outro: hoisted.outro,
  spinner: () => hoisted.progress,
}))

vi.mock('nano-spawn', () => ({
  default: hoisted.spawn,
}))

vi.mock('../src/generate.js', () => ({
  generate: hoisted.generate,
}))

vi.mock('../src/utils/index.js', () => ({
  getPackageManager: hoisted.getPackageManager,
}))

// 保留真实的 `normalizeRoot`，只替换交互提示。
// Keep the real `normalizeRoot`, only the interactive prompt is replaced.
vi.mock('../src/prompt.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/prompt.js')>()
  return { ...actual, prompt: hoisted.prompt }
})

const { run } = await import('../src/run.js')

class ExitError extends Error {
  constructor(public code: number) {
    super(`exit:${code}`)
  }
}

let exitSpy: ReturnType<typeof vi.spyOn>
let errorSpy: ReturnType<typeof vi.spyOn>
let logSpy: ReturnType<typeof vi.spyOn>

const promptResult: PromptResult = {
  displayLang: 'en-US',
  root: 'my-project',
  siteName: 'My Site',
  siteDescription: '',
  bundler: 'vite',
  multiLanguage: false,
  defaultLanguage: 'en-US',
  injectNpmScripts: true,
  deploy: DeployType.custom,
  git: true,
  install: true,
}

beforeEach(() => {
  hoisted.prompt.mockReset()
  hoisted.generate.mockReset().mockResolvedValue({ written: [], skipped: [] })
  hoisted.spawn.mockReset().mockResolvedValue({ output: '' })
  hoisted.getPackageManager.mockReset().mockReturnValue('pnpm')
  hoisted.intro.mockClear()
  hoisted.outro.mockClear()
  Object.values(hoisted.progress).forEach(fn => fn.mockClear())

  exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code: number) => {
    throw new ExitError(code)
  }) as never)
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  exitSpy.mockRestore()
  errorSpy.mockRestore()
  logSpy.mockRestore()
})

describe('run > failures', () => {
  it('exits when the prompt fails', async () => {
    hoisted.prompt.mockRejectedValue(new Error('prompt failed'))

    await expect(run(Mode.create)).rejects.toThrow('exit:1')

    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('prompt failed'))
    // 提示失败后不应继续生成文件。
    expect(hoisted.generate).not.toHaveBeenCalled()
  })

  it('exits silently when the prompt is cancelled', async () => {
    hoisted.prompt.mockResolvedValue(undefined)

    await expect(run(Mode.create)).rejects.toThrow('exit:1')

    expect(errorSpy).not.toHaveBeenCalled()
    expect(hoisted.generate).not.toHaveBeenCalled()
  })

  it('reports a file generation failure and exits', async () => {
    hoisted.prompt.mockResolvedValue(promptResult)
    hoisted.generate.mockRejectedValue(new Error('write failed'))

    await expect(run(Mode.create)).rejects.toThrow('exit:1')

    expect(hoisted.progress.error).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('run > success flow', () => {
  it('generates the project, initializes git and installs dependencies', async () => {
    hoisted.prompt.mockResolvedValue(promptResult)

    await run(Mode.create)

    expect(hoisted.intro).toHaveBeenCalled()
    expect(hoisted.generate).toHaveBeenCalledWith(
      Mode.create,
      expect.objectContaining({
        packageManager: 'pnpm',
        docsDir: 'docs',
        install: true,
        git: true,
      }),
      {},
    )

    const cwd = expect.stringContaining('my-project')
    expect(hoisted.spawn).toHaveBeenNthCalledWith(1, 'git', ['init'], { cwd })
    expect(hoisted.spawn).toHaveBeenNthCalledWith(2, 'pnpm', ['install'], { cwd })
    expect(hoisted.progress.stop).toHaveBeenCalled()
    // `create` 模式给出进入目录并启动开发服务器的提示。
    expect(hoisted.outro).toHaveBeenCalledWith(expect.stringContaining('pnpm run docs:dev'))
    expect(exitSpy).not.toHaveBeenCalled()
  })

  it('skips install and git when the answers say so', async () => {
    hoisted.prompt.mockResolvedValue({ ...promptResult, git: false, install: false })

    await run(Mode.create)

    expect(hoisted.spawn).not.toHaveBeenCalled()
    expect(hoisted.generate).toHaveBeenCalledWith(
      Mode.create,
      expect.objectContaining({ install: false }),
      {},
    )
    // 仍会提示启动开发服务器。
    expect(hoisted.outro).toHaveBeenCalledWith(expect.stringContaining('pnpm run docs:dev'))
  })

  it('honors `--no-install` even when the prompt answer enables install', async () => {
    hoisted.prompt.mockResolvedValue(promptResult)

    await run(Mode.create, undefined, { install: false })

    expect(hoisted.generate).toHaveBeenCalledWith(
      Mode.create,
      expect.objectContaining({ install: false }),
      { install: false },
    )
    expect(hoisted.spawn).not.toHaveBeenCalledWith('pnpm', ['install'], expect.anything())
  })

  it('uses the normalized directory in init mode and does not print the create hint', async () => {
    hoisted.prompt.mockResolvedValue({ ...promptResult, root: './docs/', git: false, install: false })

    await run(Mode.init, './docs/')

    expect(hoisted.generate).toHaveBeenCalledWith(
      Mode.init,
      expect.objectContaining({ docsDir: 'docs' }),
      {},
    )
    expect(hoisted.outro).not.toHaveBeenCalled()
  })

  it('lists the skipped files so the user knows what was not overwritten', async () => {
    hoisted.prompt.mockResolvedValue({ ...promptResult, git: false, install: false })
    const skipped = `${process.cwd()}/my-project/docs/existing.md`
    hoisted.generate.mockResolvedValue({ written: [], skipped: [skipped] })

    await run(Mode.create)

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('docs/existing.md'))
  })
})
