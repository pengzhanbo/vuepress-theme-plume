import type { MarkdownInfo } from '../features/markdown-source.js'
import fs from 'node:fs'
import nodeFs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'

/**
 * `MarkdownSource` reads / writes markdown files without a VuePress app, so the tests
 * only need the logger stub from the node utils barrel (everything else is the real
 * module: the file system, `gray-matter` and the atomic write helper).
 *
 * `MarkdownSource` 不依赖 VuePress app 即可读写 markdown 文件，因此测试只需要桩化
 * node utils barrel 的 logger，其余（文件系统、`gray-matter`、原子写入）都使用真实实现。
 */
const hoisted = vi.hoisted(() => ({
  warn: vi.fn(),
  error: vi.fn(),
  seq: 0,
}))

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>()
  return {
    ...actual,
    logger: { info: vi.fn(), warn: hoisted.warn, error: hoisted.error },
    nanoid: () => `id${++hoisted.seq}`,
  }
})

const { MarkdownSource } = await import('../features/markdown-source.js')

// 测试在测试目录内创建临时文件。
// `.tmp` 目录已被 gitignore 忽略，并在测试结束后清理。
const TEST_TMP_DIR = fileURLToPath(new URL('.tmp', import.meta.url))
fs.mkdirSync(TEST_TMP_DIR, { recursive: true })
const cwd = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'markdown-source-'))
const batchCwd = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'markdown-source-batch-'))
const extraDirs: string[] = []
fs.mkdirSync(path.join(batchCwd, 'blog'), { recursive: true })

afterEach(() => {
  hoisted.warn.mockClear()
  hoisted.error.mockClear()
})

afterAll(() => {
  // 仅清理本文件创建的临时目录，避免影响其它测试文件（它们共用 `.tmp` 根目录）。
  fs.rmSync(cwd, { recursive: true, force: true })
  fs.rmSync(batchCwd, { recursive: true, force: true })
  for (const dir of extraDirs)
    fs.rmSync(dir, { recursive: true, force: true })
})

function read(name: string, from = cwd): Promise<string> {
  return nodeFs.readFile(path.join(from, name), 'utf-8')
}

function write(name: string, content: string, to = cwd): Promise<void> {
  return nodeFs.writeFile(path.join(to, name), content, 'utf-8')
}

/** Whether a temporary file left behind by the atomic write exists. */
async function hasTempFile(dir = cwd): Promise<boolean> {
  const files = await nodeFs.readdir(dir)
  return files.some(file => file.endsWith('.tmp'))
}

function createSource(
  pagePatterns: string[] = ['**/*.md'],
  dir = cwd,
): InstanceType<typeof MarkdownSource> {
  return new MarkdownSource({ cwd: dir, pagePatterns })
}

/** Adds a `permalink` so the generated data always differs from the original. */
function writePermalink(source: InstanceType<typeof MarkdownSource>): void {
  source.onWrite((info) => {
    info.data.permalink = '/generated/'
  })
}

describe('markdownSource', () => {
  it('matches relative paths against the page patterns', () => {
    const source = createSource(['**/*.md', '!**/draft/**'])

    expect(source.match('blog/a.md')).toBe(true)
    expect(source.match('draft/a.md')).toBe(false)
    expect(source.match('a.txt')).toBe(false)
  })

  it('enumerates markdown files relative to the source directory', async () => {
    const dir = fs.mkdtempSync(path.join(TEST_TMP_DIR, 'markdown-source-glob-'))
    extraDirs.push(dir)
    fs.mkdirSync(path.join(dir, 'nested'), { recursive: true })
    await write('a.md', '', dir)
    await write('nested/b.md', '', dir)
    await write('c.txt', '', dir)

    const files = await createSource(undefined, dir).glob()

    expect(files.sort()).toEqual(['a.md', 'nested/b.md'])
  })

  it('reads the frontmatter data, body and line ending of a file', async () => {
    await write('read.md', '---\ntitle: Old\n---\n# Hello\n')

    const info = await createSource().read('read.md')

    expect(info.filepath).toBe(path.join(cwd, 'read.md'))
    expect(info.relativePath).toBe('read.md')
    expect(info.data).toEqual({ title: 'Old' })
    expect(info.content).toBe('# Hello\n')
    expect(info.eol).toBe('\n')
  })
})

describe('markdownSource.process', () => {
  it('keeps LF line endings for LF files', async () => {
    const source = createSource()
    writePermalink(source)
    await write('lf.md', '---\ntitle: Old\n---\n# Hello\n')

    await expect(source.process('lf.md')).resolves.toBe(true)

    await expect(read('lf.md')).resolves.toBe('---\ntitle: Old\npermalink: /generated/\n---\n# Hello\n')
  })

  it('preserves CRLF line endings instead of mixing LF into the file', async () => {
    const source = createSource()
    writePermalink(source)
    await write('crlf.md', '---\r\ntitle: Old\r\n---\r\n# Hello\r\n')

    await source.process('crlf.md')

    const result = await read('crlf.md')
    expect(result).toContain('---\r\ntitle: Old\r\npermalink: /generated/\r\n---\r\n')
    // 不应出现落单的 LF，否则文件会变成混合换行符。
    expect(result.replace(/\r\n/g, '')).not.toContain('\n')
  })

  it('writes atomically and leaves no temporary file behind', async () => {
    const source = createSource()
    writePermalink(source)
    await write('atomic.md', '---\ntitle: Old\n---\nbody\n')

    await source.process('atomic.md')

    await expect(read('atomic.md')).resolves.toContain('permalink: /generated/')
    await expect(hasTempFile()).resolves.toBe(false)
  })

  it.skipIf(process.platform === 'win32')('preserves the file permissions when replacing it', async () => {
    const filepath = path.join(cwd, 'mode.md')
    const source = createSource()
    writePermalink(source)
    await write('mode.md', '---\ntitle: Old\n---\nbody\n')
    // 0600 在默认 umask 022 下若使用新建文件的默认权限会变成 0644。
    await nodeFs.chmod(filepath, 0o600)

    await source.process('mode.md')

    await expect(read('mode.md')).resolves.toContain('permalink: /generated/')
    expect((await nodeFs.stat(filepath)).mode & 0o7777).toBe(0o600)
  })

  it.skipIf(process.platform === 'win32')('tolerates a chown failure when the ownership is preserved', async () => {
    // 某些文件系统不允许 chown（如挂载的卷），此时只要归属未变化就应继续写入。
    const chown = vi.spyOn(nodeFs, 'chown').mockRejectedValue(new Error('EPERM') as never)
    const source = createSource()
    writePermalink(source)
    await write('chown.md', '---\ntitle: Old\n---\nbody\n')

    await source.process('chown.md')

    await expect(read('chown.md')).resolves.toContain('permalink: /generated/')
    await expect(hasTempFile()).resolves.toBe(false)

    chown.mockRestore()
  })

  it('does not rewrite the file when the data is unchanged', async () => {
    const original = '---\ntitle: Old\n---\nbody\n'
    const source = createSource()
    source.onWrite(() => {})
    await write('untouched.md', original)

    await expect(source.process('untouched.md')).resolves.toBe(false)

    await expect(read('untouched.md')).resolves.toBe(original)
    await expect(hasTempFile()).resolves.toBe(false)
  })

  it('applies the write hooks in order and keeps the content when a hook returns nothing', async () => {
    const source = createSource()
    const calls: string[] = []
    source.onWrite((info) => {
      calls.push('first')
      info.data.permalink = '/generated/'
    })
    source.onWrite((info) => {
      calls.push('second')
      return `${info.content}<!-- second -->`
    })
    await write('hooks.md', '---\ntitle: Old\n---\nbody\n')

    await source.process('hooks.md')

    expect(calls).toEqual(['first', 'second'])
    // 第一个钩子返回 void，保留原始内容；第二个钩子返回的内容被采用。
    await expect(read('hooks.md'))
      .resolves
      .toBe('---\ntitle: Old\npermalink: /generated/\n---\nbody\n<!-- second -->')
  })

  it('stops applying a removed write hook', async () => {
    const original = '---\ntitle: Old\n---\nbody\n'
    const source = createSource()
    const dispose = source.onWrite(() => 'replaced')
    dispose()
    await write('disposed.md', original)

    await expect(source.process('disposed.md')).resolves.toBe(false)

    await expect(read('disposed.md')).resolves.toBe(original)
  })

  it('refuses to overwrite a file changed while generating frontmatter', async () => {
    const source = createSource()
    source.onWrite(async (info) => {
      // 模拟编辑器在读取原文之后保存同一文件。
      await write('race.md', '---\ntitle: Old\n---\nedited by the user\n')
      info.data.permalink = '/generated/'
    })
    await write('race.md', '---\ntitle: Old\n---\nbody\n')

    await expect(source.process('race.md'))
      .rejects
      .toThrow('the file was modified while generating frontmatter')

    // 编辑器的新内容被保留，生成器的替换被拒绝。
    await expect(read('race.md')).resolves.toBe('---\ntitle: Old\n---\nedited by the user\n')
    await expect(hasTempFile()).resolves.toBe(false)
  })

  it('only processes the same file once when requests overlap', async () => {
    const source = createSource()
    let calls = 0
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    source.onWrite(async (info) => {
      calls++
      await gate
      info.data.permalink = '/generated/'
    })
    await write('dedup.md', '---\ntitle: Old\n---\nbody\n')

    // 全量扫描与 watcher 可能同时命中同一文件，此时只应处理一次。
    const first = source.process('dedup.md')
    const second = source.process('dedup.md')
    release()
    await Promise.all([first, second])

    expect(calls).toBe(1)
    await expect(read('dedup.md')).resolves.toContain('permalink: /generated/')
  })

  it.skipIf(process.platform === 'win32')('skips symbolic links and warns', async () => {
    const source = createSource()
    writePermalink(source)
    await write('target.md', '---\ntitle: Real\n---\nbody\n')
    await nodeFs.symlink('target.md', path.join(cwd, 'link.md'))

    await expect(source.process('link.md')).resolves.toBe(false)

    await expect(read('target.md')).resolves.toBe('---\ntitle: Real\n---\nbody\n')
    expect(hoisted.warn).toHaveBeenCalledWith(expect.stringContaining('symbolic link'))
  })
})

describe('markdownSource.run', () => {
  it('reports files whose frontmatter could not be written', async () => {
    const source = createSource(['**/*.md'], batchCwd)
    writePermalink(source)

    await write('blog/ok.md', '---\ntitle: Ok\n---\nbody\n', batchCwd)
    await write('blog/readonly.md', '---\ntitle: Read only\n---\nbody\n', batchCwd)
    await nodeFs.chmod(path.join(batchCwd, 'blog/readonly.md'), 0o444)

    await source.run()

    // 可写文件正常生成，只读文件保持原样。
    await expect(read('blog/ok.md', batchCwd)).resolves.toContain('permalink:')
    await expect(read('blog/readonly.md', batchCwd)).resolves.toBe('---\ntitle: Read only\n---\nbody\n')

    // 失败被汇总上报，而不是静默吞掉。
    expect(hoisted.error).toHaveBeenCalledTimes(1)
    expect(hoisted.error.mock.calls[0][0]).toContain('blog/readonly.md')

    // 恢复可写后再次扫描：失败清单已清空，不会重复上报。
    hoisted.error.mockClear()
    await nodeFs.chmod(path.join(batchCwd, 'blog/readonly.md'), 0o644)
    await source.run()

    expect(hoisted.error).not.toHaveBeenCalled()
    await expect(read('blog/readonly.md', batchCwd)).resolves.toContain('permalink:')
  })
})

describe('global markdown source', () => {
  it('throws when it is not initialized', async () => {
    vi.resetModules()
    const mod = await import('../features/markdown-source.js')

    expect(() => mod.getMarkdownSource()).toThrow('without initialization')
  })

  it('reuses the instance and its hooks for the same source directory', async () => {
    vi.resetModules()
    const mod = await import('../features/markdown-source.js')
    const first = mod.initMarkdownSource({ cwd: '/root', pagePatterns: ['**/*.md'] })
    const hook = (info: MarkdownInfo) => {
      info.data.permalink = '/generated/'
    }
    first.onWrite(hook)

    const second = mod.initMarkdownSource({ cwd: '/root', pagePatterns: ['docs/**/*.md'] })

    expect(second).toBe(first)
    expect(mod.getMarkdownSource()).toBe(first)
    // 复用实例时更新页面匹配模式，已注册的钩子得以保留。
    expect(second.pagePatterns).toEqual(['docs/**/*.md'])
  })

  it('creates a new instance when the source directory changes', async () => {
    vi.resetModules()
    const mod = await import('../features/markdown-source.js')
    const first = mod.initMarkdownSource('/root')

    const second = mod.initMarkdownSource('/other')

    expect(second).not.toBe(first)
    expect(second.cwd).toBe('/other')
  })
})
