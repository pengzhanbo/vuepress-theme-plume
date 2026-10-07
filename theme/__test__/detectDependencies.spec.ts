import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `detectDependencies` reports missing optional peers. The node utils barrel is
 * stubbed so the assertion can inspect the emitted message, and `local-pkg` is
 * forced to report every package as missing.
 *
 * `detectDependencies` 用于提示缺失的可选依赖。这里对 node utils barrel 打桩，
 * 以便断言输出的提示信息，并让 `local-pkg` 始终报告依赖缺失。
 */
const hoisted = vi.hoisted(() => ({
  error: vi.fn(),
}))

vi.mock('../src/node/utils/index.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: hoisted.error },
  // Minimal interpolation stub: join the params so the assertion can read them.
  createTranslate: () => (key: string, data?: Record<string, unknown>) =>
    `${key} ${Object.values(data || {}).flat().join(' ')}`,
}))

vi.mock('local-pkg', () => ({
  isPackageExists: () => false,
}))

vi.mock('package-manager-detector', () => ({
  getUserAgent: () => null,
  resolveCommand: () => null,
}))

const { detectDependencies } = await import('../src/node/detector/dependency.js')

/** The first argument of the last `logger.error` call, as a plain string. */
function errorMessage(): string {
  const call = hoisted.error.mock.calls.at(-1)
  return String(call?.[0] ?? '')
}

describe('detectDependencies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hints the `@mathjax/src` peer when `mathjax` is selected', () => {
    detectDependencies({ markdown: { math: { type: 'mathjax' } } } as any, {} as any)

    expect(errorMessage()).toContain('mathjax')
    expect(errorMessage()).toContain('@mathjax/src')
    expect(errorMessage()).not.toContain('mathjax-full')
  })

  it('stays silent when `katex` is selected', () => {
    detectDependencies({ markdown: { math: { type: 'katex' } } } as any, {} as any)

    expect(hoisted.error).not.toHaveBeenCalled()
  })
})
