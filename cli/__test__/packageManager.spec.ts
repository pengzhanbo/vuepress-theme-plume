import process from 'node:process'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  spawn: vi.fn(),
}))

vi.mock('nano-spawn', () => ({
  default: hoisted.spawn,
}))

const originalUserAgent = process.env.npm_config_user_agent

beforeEach(() => {
  hoisted.spawn.mockReset()
})

afterEach(() => {
  if (originalUserAgent === undefined)
    delete process.env.npm_config_user_agent
  else
    process.env.npm_config_user_agent = originalUserAgent
  vi.restoreAllMocks()
})

describe('getPackageManager', () => {
  async function load() {
    vi.resetModules()
    return await import('../src/utils/getPackageManager.js')
  }

  it('detects the supported package managers from the user agent', async () => {
    const { getPackageManager } = await load()

    process.env.npm_config_user_agent = 'pnpm/10.0.0 npm/? node/v24.0.0 darwin arm64'
    expect(getPackageManager()).toBe('pnpm')

    process.env.npm_config_user_agent = 'yarn/1.22.19 npm/? node/v24.0.0'
    expect(getPackageManager()).toBe('yarn')

    process.env.npm_config_user_agent = 'npm/10.0.0 node/v24.0.0'
    expect(getPackageManager()).toBe('npm')
  })

  it('falls back to npm when no user agent is available', async () => {
    const { getPackageManager } = await load()
    delete process.env.npm_config_user_agent

    expect(getPackageManager()).toBe('npm')
  })

  it('warns and falls back to npm for an unsupported package manager', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { getPackageManager } = await load()
    process.env.npm_config_user_agent = 'bun/1.1.0 node/v24.0.0'

    expect(getPackageManager()).toBe('npm')
    // 生成错误的 npm scripts 比直接提示用户更糟糕。
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('bun'))
  })
})

describe('getPackageManagerVersion', () => {
  async function load() {
    vi.resetModules()
    return await import('../src/utils/getPackageManagerVersion.js')
  }

  it('probes the version once and caches the result', async () => {
    hoisted.spawn.mockResolvedValue({ output: '10.2.0\n' })
    const { getPackageManagerVersion } = await load()

    await expect(getPackageManagerVersion('pnpm')).resolves.toBe('10.2.0')
    await expect(getPackageManagerVersion('pnpm')).resolves.toBe('10.2.0')

    // 多个步骤共用同一个探测结果。
    expect(hoisted.spawn).toHaveBeenCalledTimes(1)
    expect(hoisted.spawn).toHaveBeenCalledWith('pnpm', ['--version'])
  })

  it('resolves null when the package manager command fails', async () => {
    hoisted.spawn.mockRejectedValue(new Error('command not found'))
    const { getPackageManagerVersion } = await load()

    await expect(getPackageManagerVersion('yarn')).resolves.toBeNull()
  })

  it('resolves the major version of pnpm', async () => {
    hoisted.spawn.mockResolvedValue({ output: '11.3.2\n' })
    const { getPnpmMajorVersion } = await load()

    await expect(getPnpmMajorVersion()).resolves.toBe(11)
  })

  it('returns 0 when the pnpm version cannot be probed', async () => {
    hoisted.spawn.mockRejectedValue(new Error('command not found'))
    const { getPnpmMajorVersion } = await load()

    await expect(getPnpmMajorVersion()).resolves.toBe(0)
  })
})
