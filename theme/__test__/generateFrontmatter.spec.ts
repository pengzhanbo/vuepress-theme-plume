import type { App } from 'vuepress'
import type { AutoFrontmatterData } from '../src/shared/index.js'
import fs from 'node:fs'
import nodeFs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  warn: vi.fn(),
  error: vi.fn(),
  seq: 0,
  themeConfig: {} as Record<string, unknown>,
}))

/**
 * `generateFileFrontmatter` reads `logger` / `nanoid` from the node utils barrel and
 * (transitively, through `rules.js`) the theme config singleton. Both are stubbed so
 * the test can exercise the real file system without a VuePress app.
 *
 * `generateFileFrontmatter` 从 node utils barrel 读取 `logger` / `nanoid`，
 * 并（经 `rules.js` 间接）读取主题配置单例。这里以桩替换两者，
 * 使测试可以在没有 VuePress app 的情况下操作真实文件系统。
 */
vi.mock('../src/node/utils/index.js', () => ({
  logger: { info: vi.fn(), warn: hoisted.warn, error: hoisted.error },
  nanoid: () => `id${++hoisted.seq}`,
  getPinyin: () => '',
  hasPinyin: () => false,
}))

vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: () => hoisted.themeConfig,
}))

const { generateFileFrontmatter, generateFileListFrontmatter } = await import('../src/node/autoFrontmatter/generate.js')

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))
fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const cwd = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'frontmatter-'))
const batchCwd = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'frontmatter-batch-'))
fs.mkdirSync(path.join(batchCwd, 'blog'), { recursive: true })

afterEach(() => {
  hoisted.warn.mockClear()
  hoisted.error.mockClear()
  hoisted.themeConfig = {}
})

afterAll(() => {
  // 仅清理本文件创建的临时目录，避免影响其它测试文件（它们共用 `.tmp` 根目录）。
  fs.rmSync(cwd, { recursive: true, force: true })
  fs.rmSync(batchCwd, { recursive: true, force: true })
})

function read(name: string, from = cwd): Promise<string> {
  return nodeFs.readFile(path.join(from, name), 'utf-8')
}

function write(name: string, content: string, to = cwd): Promise<void> {
  return nodeFs.writeFile(path.join(to, name), content, 'utf-8')
}

/** Adds a `permalink` so the generated data always differs from the original. */
async function handle(data: AutoFrontmatterData): Promise<AutoFrontmatterData> {
  return { ...data, permalink: '/generated/' }
}

describe('generateFileFrontmatter', () => {
  it('keeps LF line endings for LF files', async () => {
    await write('lf.md', '---\ntitle: Old\n---\n# Hello\n')

    await generateFileFrontmatter('lf.md', cwd, handle)

    await expect(read('lf.md')).resolves.toBe('---\ntitle: Old\npermalink: /generated/\n---\n# Hello\n')
  })

  it('preserves CRLF line endings instead of mixing LF into the file', async () => {
    await write('crlf.md', '---\r\ntitle: Old\r\n---\r\n# Hello\r\n')

    await generateFileFrontmatter('crlf.md', cwd, handle)

    const result = await read('crlf.md')
    expect(result).toContain('---\r\ntitle: Old\r\npermalink: /generated/\r\n---\r\n')
    // 不应出现落单的 LF，否则文件会变成混合换行符。
    expect(result.replace(/\r\n/g, '')).not.toContain('\n')
  })

  it.skipIf(process.platform === 'win32')('skips symbolic links and warns', async () => {
    await write('target.md', '---\ntitle: Real\n---\nbody\n')
    await nodeFs.symlink('target.md', path.join(cwd, 'link.md'))

    await generateFileFrontmatter('link.md', cwd, handle)

    await expect(read('target.md')).resolves.toBe('---\ntitle: Real\n---\nbody\n')
    expect(hoisted.warn).toHaveBeenCalledWith(expect.stringContaining('symbolic link'))
  })

  it('writes atomically and leaves no temporary file behind', async () => {
    await write('atomic.md', '---\ntitle: Old\n---\nbody\n')

    await generateFileFrontmatter('atomic.md', cwd, handle)

    await expect(read('atomic.md')).resolves.toContain('permalink: /generated/')
    const files = await nodeFs.readdir(cwd)
    expect(files.some(file => file.endsWith('.tmp'))).toBe(false)
  })

  it.skipIf(process.platform === 'win32')('preserves the file permissions when replacing it', async () => {
    const filepath = path.join(cwd, 'mode.md')
    await write('mode.md', '---\ntitle: Old\n---\nbody\n')
    // 0600 在默认 umask 022 下若使用新建文件的默认权限会变成 0644。
    await nodeFs.chmod(filepath, 0o600)

    await generateFileFrontmatter('mode.md', cwd, handle)

    await expect(read('mode.md')).resolves.toContain('permalink: /generated/')
    expect((await nodeFs.stat(filepath)).mode & 0o7777).toBe(0o600)
  })

  it('does not rewrite the file when the data is unchanged', async () => {
    const original = '---\ntitle: Old\n---\nbody\n'
    await write('untouched.md', original)

    await generateFileFrontmatter('untouched.md', cwd, async data => data)

    await expect(read('untouched.md')).resolves.toBe(original)
    const files = await nodeFs.readdir(cwd)
    expect(files.some(file => file.endsWith('.tmp'))).toBe(false)
  })

  it('refuses to overwrite a file changed while generating frontmatter', async () => {
    await write('race.md', '---\ntitle: Old\n---\nbody\n')

    async function competingHandle(data: AutoFrontmatterData): Promise<AutoFrontmatterData> {
      // 模拟编辑器在生成器读取原文之后保存同一文件。
      await write('race.md', '---\ntitle: Old\n---\nedited by the user\n')
      return { ...data, permalink: '/generated/' }
    }

    await generateFileFrontmatter('race.md', cwd, competingHandle)

    // 编辑器的新内容被保留，生成器的替换被拒绝。
    await expect(read('race.md')).resolves.toBe('---\ntitle: Old\n---\nedited by the user\n')
    const files = await nodeFs.readdir(cwd)
    expect(files.some(file => file.endsWith('.tmp'))).toBe(false)

    // 冲突同样会进入汇总上报（空批次也会 flush 失败清单）。
    await generateFileListFrontmatter({
      options: { pagePatterns: ['**/*.nothing'] },
      dir: { source: () => cwd },
    } as unknown as App)

    expect(hoisted.error).toHaveBeenCalledTimes(1)
    expect(hoisted.error.mock.calls[0][0]).toContain('the file was modified while generating frontmatter')
  })

  it('only processes the same file once when requests overlap', async () => {
    await write('dedup.md', '---\ntitle: Old\n---\nbody\n')

    let calls = 0
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })

    async function slowHandle(data: AutoFrontmatterData): Promise<AutoFrontmatterData> {
      calls++
      await gate
      return { ...data, permalink: '/generated/' }
    }

    // 全量扫描与 watcher 可能同时命中同一文件，此时只应处理一次。
    const first = generateFileFrontmatter('dedup.md', cwd, slowHandle)
    const second = generateFileFrontmatter('dedup.md', cwd, slowHandle)
    release()
    await Promise.all([first, second])

    expect(calls).toBe(1)
    await expect(read('dedup.md')).resolves.toContain('permalink: /generated/')
  })
})

describe('generateFileListFrontmatter', () => {
  it('reports files whose frontmatter could not be written', async () => {
    // 声明一个集合，使待处理文件命中自动生成 frontmatter 的规则。
    hoisted.themeConfig = {
      locales: {
        '/': { collections: [{ type: 'post', dir: 'blog', title: 'Blog' }] },
      },
    }

    await write('blog/ok.md', '---\ntitle: Ok\n---\nbody\n', batchCwd)
    await write('blog/readonly.md', '---\ntitle: Read only\n---\nbody\n', batchCwd)
    await nodeFs.chmod(path.join(batchCwd, 'blog/readonly.md'), 0o444)

    const app = {
      options: { pagePatterns: ['**/*.md'] },
      dir: { source: () => batchCwd },
    } as unknown as App

    await generateFileListFrontmatter(app)

    // 可写文件正常生成，只读文件保持原样。
    await expect(read('blog/ok.md', batchCwd)).resolves.toContain('permalink:')
    await expect(read('blog/readonly.md', batchCwd)).resolves.toBe('---\ntitle: Read only\n---\nbody\n')

    // 失败被汇总上报，而不是静默吞掉。
    expect(hoisted.error).toHaveBeenCalledTimes(1)
    expect(hoisted.error.mock.calls[0][0]).toContain('blog/readonly.md')

    // 恢复可写后再次扫描：失败清单已清空，不会重复上报。
    hoisted.error.mockClear()
    await nodeFs.chmod(path.join(batchCwd, 'blog/readonly.md'), 0o644)
    await generateFileListFrontmatter(app)

    expect(hoisted.error).not.toHaveBeenCalled()
    await expect(read('blog/readonly.md', batchCwd)).resolves.toContain('permalink:')
  })
})
