import type { App } from 'vuepress'
import type { Page } from 'vuepress/core'
import type { EncryptConfig } from '../src/node/prepare/prepareEncrypt.js'
import type { ThemePageData } from '../src/shared/index.js'
import { decodeData } from '@vuepress/helper'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { encryptPage } from '../src/node/pages/encryptPage.js'
import { isEncryptPage, prepareEncrypt } from '../src/node/prepare/prepareEncrypt.js'

const hoisted = vi.hoisted(() => ({
  writeTemp: vi.fn(async (_app: unknown, _file: string, _content: unknown) => {}),
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  getThemeConfig: vi.fn(() => ({})),
  genEncrypt: vi.fn(),
}))

vi.mock('../src/node/utils/index.js', () => ({
  createFsCache: vi.fn(),
  genEncrypt: hoisted.genEncrypt,
  hash: vi.fn((content: string) => `hashed-content(${content})`),
  logger: hoisted.logger,
  perf: { mark: vi.fn(), log: vi.fn() },
  resolveContent: vi.fn((_app: unknown, { content }: { content: unknown }) => content),
  writeTemp: hoisted.writeTemp,
}))

vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: hoisted.getThemeConfig,
}))

const app = { env: { isDev: false } } as unknown as App

function createPage(
  path: string,
  filePathRelative: string,
  frontmatter: Record<string, unknown> = {},
): Page<ThemePageData> {
  return {
    path,
    filePathRelative,
    frontmatter,
    data: { filePathRelative },
  } as unknown as Page<ThemePageData>
}

function decode<T>(data: string): T {
  return JSON.parse(decodeData(data)) as T
}

/** 执行 prepareEncrypt 并返回写入的加密配置。 */
async function resolveEncryptConfig(encrypt?: Record<string, unknown>): Promise<EncryptConfig> {
  hoisted.getThemeConfig.mockReturnValue({ encrypt })
  await prepareEncrypt(app)
  const call = hoisted.writeTemp.mock.calls.find(([, file]) => file === 'internal/encrypt.js')
  return call?.[2] as EncryptConfig
}

/**
 * Replace the mocked `genEncrypt` with an implementation that records the peak
 * number of concurrently running hashes, so the bounded concurrency can be asserted.
 *
 * 用能够记录并发峰值的实现替换被 mock 的 `genEncrypt`，以便断言并发上限。
 */
function trackHashConcurrency(): () => number {
  let inFlight = 0
  let peak = 0

  hoisted.genEncrypt.mockImplementation(async (password: string) => {
    inFlight++
    peak = Math.max(peak, inFlight)
    // 让并发有机会重叠，否则串行调用也会得到峰值 1。
    await new Promise(resolve => setTimeout(resolve, 1))
    inFlight--
    return `hashed(${password})`
  })

  return () => peak
}

beforeEach(() => {
  hoisted.genEncrypt.mockImplementation(async (password: string) => `hashed(${password})`)
})

describe('prepareEncrypt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should drop rules without a valid password and keep indexes aligned', async () => {
    const config = await resolveEncryptConfig({
      rules: { '/a/': 'pwd1', '/b/': '', '/c/': 'pwd3' },
    })

    expect(decode<string[]>(config[0]).map(key => decodeData(key))).toEqual(['/a/', '/c/'])
    expect(decode<Record<string, string>>(config[1])).toEqual({
      0: 'hashed(pwd1)',
      1: 'hashed(pwd3)',
    })
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('empty'))
  })

  it('should drop empty and invalid admins', async () => {
    const config = await resolveEncryptConfig({ global: true, admin: ['admin-pwd', ''] })

    expect(config[2]).toBe(1)
    expect(config[3]).toBe('hashed(admin-pwd)')
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('encrypt.admin'))
  })

  it('should bound the concurrency of bcrypt hashing for admin passwords', async () => {
    const peak = trackHashConcurrency()
    const admins = Array.from({ length: 12 }, (_, index) => `admin-${index}`)

    const config = await resolveEncryptConfig({ admin: admins })

    // bcrypt 是 CPU 密集型操作，必须限制并发（当前上限为 4）。
    // Bcrypt is CPU intensive, its concurrency must stay bounded (currently 4).
    expect(peak()).toBeLessThanOrEqual(4)
    // 限制并发不能丢失任何密码（admin 字段本身就是明文哈希串，未被 encodeData 编码）。
    expect(config[3].split(':')).toHaveLength(admins.length)
  })

  it('should bound the concurrency of bcrypt hashing for rule passwords', async () => {
    const peak = trackHashConcurrency()
    const passwords = Array.from({ length: 10 }, (_, index) => `pwd-${index}`)

    const config = await resolveEncryptConfig({ rules: { '/blog/': passwords } })

    expect(peak()).toBeLessThanOrEqual(4)
    expect(decode<Record<string, string>>(config[1])[0].split(':')).toHaveLength(passwords.length)
  })

  it('should warn when global encryption has no valid admin password', async () => {
    const config = await resolveEncryptConfig({ global: true, admin: [''] })

    expect(config[3]).toBe('')
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('can never be unlocked'))
  })
})

describe('isEncryptPage', () => {
  it('should return false without encrypt options', () => {
    expect(isEncryptPage(createPage('/blog/a/', 'blog/a.md'), undefined)).toBe(false)
  })

  it('should match rules with a valid password', () => {
    const page = createPage('/blog/a/', 'blog/a.md')

    expect(isEncryptPage(page, { rules: { '/blog/': 'pwd' } })).toBe(true)
    expect(isEncryptPage(page, { rules: { '/blog/': ['pwd'] } })).toBe(true)
    expect(isEncryptPage(page, { rules: { 'blog/a.md': 'pwd' } })).toBe(true)
  })

  it('should ignore rules without a valid password', () => {
    const page = createPage('/blog/a/', 'blog/a.md')

    expect(isEncryptPage(page, { rules: { '/blog/': '' } })).toBe(false)
    expect(isEncryptPage(page, { rules: { '/blog/': [] } })).toBe(false)
    expect(isEncryptPage(page, { rules: { '/blog/': [''] } })).toBe(false)
  })

  it('should return true when the page already has an encrypted password', () => {
    const page = createPage('/blog/a/', 'blog/a.md')
    page.data._e = 'hashed(pwd)'

    expect(isEncryptPage(page, { rules: {} })).toBe(true)
    // A page-level password must be detected even without any `encrypt` option,
    // otherwise the page would be treated as plain content (e.g. indexed by search).
    // 即使没有配置 `encrypt` 选项，也必须能识别页面级密码，
    // 否则该页面会被当作普通内容处理（例如被搜索索引收录）。
    expect(isEncryptPage(page, undefined)).toBe(true)
  })
})

describe('encryptPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should store the hashed password and remove the frontmatter password', async () => {
    const page = createPage('/a/', 'a.md', { password: '123456' })

    await encryptPage(page)

    expect(page.data._e).toBe('hashed(123456)')
    expect(page.frontmatter.password).toBeUndefined()
  })

  it('should support multiple passwords', async () => {
    const page = createPage('/a/', 'a.md', { password: ['123456', 654321] })

    await encryptPage(page)

    expect(page.data._e).toBe('hashed(123456):hashed(654321)')
  })

  it('should bound the concurrency of bcrypt hashing', async () => {
    const peak = trackHashConcurrency()
    const passwords = Array.from({ length: 12 }, (_, index) => `pwd-${index}`)
    const page = createPage('/a/', 'a.md', { password: passwords })

    await encryptPage(page)

    expect(peak()).toBeLessThanOrEqual(4)
    // 限制并发不能丢失任何密码。
    expect(page.data._e).toBe(passwords.map(password => `hashed(${password})`).join(':'))
  })

  it('should ignore an empty password instead of locking the page forever', async () => {
    const page = createPage('/a/', 'a.md', { password: '' })

    await encryptPage(page)

    expect(page.data._e).toBeUndefined()
    expect(page.frontmatter.password).toBeUndefined()
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('a.md'))
  })

  it('should not warn when no password is configured', async () => {
    const page = createPage('/a/', 'a.md')

    await encryptPage(page)

    expect(page.data._e).toBeUndefined()
    expect(hoisted.logger.warn).not.toHaveBeenCalled()
  })
})
