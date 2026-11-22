import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  getCurrentDirname,
  normalizeLink,
  normalizePath,
  resolve,
  templates,
  withBase,
} from '../utils/path.js'

type PathModule = typeof import('../utils/path.js')
type PlatformPath = typeof path.win32

/** 将路径统一为正斜杠，便于与 `normalizePath()` 的输出比较。 */
function toUnix(value: string): string {
  return value.replace(/\\/g, '/')
}

/** `theme/src/node`，即 `resolve()` 的基准目录。 */
const NODE_DIR = toUnix(path.resolve(fileURLToPath(new URL('..', import.meta.url))))

/**
 * 构造与 `vuepress/utils` 导出的 `path`（基于 `upath`）等价的对象：
 * 入参先统一为正斜杠，再交给指定平台的实现处理，输出同样统一为正斜杠。
 *
 * Build a `path`-like object equivalent to the one exported by `vuepress/utils`
 * (backed by `upath`), so that a specific platform's semantics can be simulated.
 */
function createPlatformPath(impl: PlatformPath): PlatformPath {
  return {
    ...impl,
    normalize: (filepath: string) => toUnix(impl.normalize(toUnix(filepath))),
    resolve: (...segments: string[]) => toUnix(impl.resolve(...segments.map(toUnix))),
    dirname: (filepath: string) => toUnix(impl.dirname(toUnix(filepath))),
  }
}

/**
 * 在隔离的模块上下文中加载 `path.ts`，并替换 `vuepress/utils` 暴露的 `path`，
 * 从而在任意操作系统上模拟 posix / win32 的路径实现。
 *
 * Load `path.ts` in an isolated module context with `path` from `vuepress/utils`
 * replaced, so posix / win32 semantics can be simulated on any operating system.
 */
async function loadPathUtils(platform: 'posix' | 'win32'): Promise<PathModule> {
  vi.resetModules()
  vi.doMock('vuepress/utils', async (importOriginal: any) => {
    const actual = await importOriginal()
    return {
      ...actual,
      path: createPlatformPath(platform === 'win32' ? path.win32 : path.posix),
    }
  })

  const mod = await import('../utils/path.js')

  vi.doUnmock('vuepress/utils')
  vi.resetModules()
  return mod
}

let posixUtils: PathModule
let win32Utils: PathModule

beforeAll(async () => {
  posixUtils = await loadPathUtils('posix')
  win32Utils = await loadPathUtils('win32')
})

afterAll(() => {
  vi.doUnmock('vuepress/utils')
  vi.resetModules()
})

describe('resolve', () => {
  it('resolves paths relative to the parent of the utils directory', () => {
    // `resolve()` 以 utils 目录的上一级（主题包的 node 目录）为基准。
    expect(resolve()).toBe(NODE_DIR)
    expect(resolve('a/b.txt')).toBe(`${NODE_DIR}/a/b.txt`)
    expect(resolve('a', 'b', 'c.txt')).toBe(`${NODE_DIR}/a/b/c.txt`)
  })

  it('keeps absolute path segments untouched', () => {
    expect(resolve('/absolute/x.txt')).toBe(toUnix(path.resolve('/absolute/x.txt')))
  })

  // `resolve()` 以模块自身所在目录这一绝对路径为基准，而绝对路径的形态由运行平台决定
  // （Windows 带盘符 `D:/...`，posix 以 `/` 开头），无法用另一种平台的语义复现，
  // 因此这里不再做跨语义比较，跨平台的一致性由上面的绝对路径断言保证。
})

describe('templates', () => {
  it('resolves template paths relative to the templates directory', () => {
    expect(templates('index.html')).toBe(toUnix(path.resolve(NODE_DIR, '../templates/index.html')))
    expect(templates('post/card.vue')).toBe(toUnix(path.resolve(NODE_DIR, '../templates/post/card.vue')))
  })
})

describe('normalizePath', () => {
  // 所有用例在 posix 与 win32 语义下都必须得到相同的结果。
  // Every case must produce the same result under both posix and win32 semantics.
  const cases: [input: string, expected: string][] = [
    // 分隔符统一
    ['a/b/c', 'a/b/c'],
    ['a\\b\\c', 'a/b/c'],
    ['\\a\\b', '/a/b'],
    ['a/b/c.md', 'a/b/c.md'],
    // 重复分隔符折叠
    ['a//b///c', 'a/b/c'],
    ['//', '/'],
    // `.` 与 `..` 片段
    ['./a/../b', 'b'],
    ['a/./b', 'a/b'],
    ['a/b/../../c', 'c'],
    ['../a/../../b', '../../b'],
    ['..\\..\\a\\b', '../../a/b'],
    ['a/b\\..\\c', 'a/c'],
    // 尾部分隔符保留
    ['a/b/', 'a/b/'],
    ['/a/b/', '/a/b/'],
    ['a/', 'a/'],
    // 根路径
    ['/', '/'],
    // 空路径归一化为当前目录
    ['', '.'],
    ['.', '.'],
    ['..', '..'],
    // Windows 盘符
    ['C:\\Users\\foo\\bar.md', 'C:/Users/foo/bar.md'],
    ['C:/Users/foo', 'C:/Users/foo'],
    // 含空格的文件名
    ['a b/c d.md', 'a b/c d.md'],
  ]

  it.each(cases)('%j -> %j', (input, expected) => {
    expect(normalizePath(input)).toBe(expected)
  })

  it.each(cases)('is platform independent: %j', (input, expected) => {
    expect(posixUtils.normalizePath(input)).toBe(expected)
    expect(win32Utils.normalizePath(input)).toBe(expected)
  })

  it('only diverges on UNC-style leading double slashes', () => {
    // 前导双斜杠是唯一无法抹平的平台差异：
    // POSIX 会将其折叠为单个 `/`，Windows 则保留为 UNC 前缀（并补全共享根路径的尾斜杠）。
    expect(posixUtils.normalizePath('//server/share/file')).toBe('/server/share/file')
    expect(win32Utils.normalizePath('//server/share/file')).toBe('//server/share/file')

    expect(posixUtils.normalizePath('\\\\server\\share')).toBe('/server/share')
    expect(win32Utils.normalizePath('\\\\server\\share')).toBe('//server/share/')
  })

  it('normalizes idempotently', () => {
    for (const [input] of cases) {
      const once = normalizePath(input)
      expect(normalizePath(once)).toBe(once)
    }
  })
})

describe('normalizeLink', () => {
  it('joins the base path and the link with a trailing slash', () => {
    expect(normalizeLink('/blog/', 'a')).toBe('/blog/a/')
    expect(normalizeLink('/blog', 'guide/a')).toBe('/blog/guide/a/')
    expect(normalizeLink('blog', 'a')).toBe('/blog/a/')
  })

  it('falls back to the base path for an empty link', () => {
    expect(normalizeLink('/blog')).toBe('/blog/')
    expect(normalizeLink('/blog', '')).toBe('/blog/')
  })

  it('normalizes separators inside the link', () => {
    expect(normalizeLink('/blog/', 'a\\b')).toBe('/blog/a/b/')
    expect(normalizeLink('/blog/', 'a//b')).toBe('/blog/a/b/')
  })

  it('keeps absolute and protocol links untouched', () => {
    expect(normalizeLink('/blog/', '/absolute')).toBe('/absolute')
    expect(normalizeLink('/blog/', '/blog/guide')).toBe('/blog/guide')
    expect(normalizeLink('/blog/', 'https://example.com')).toBe('https://example.com')
    expect(normalizeLink('/blog/', 'mailto:foo@example.com')).toBe('mailto:foo@example.com')
    // 协议相对链接同样不作为相对路径拼接。
    expect(normalizeLink('/blog/', '//cdn.example.com/a.js')).toBe('//cdn.example.com/a.js')
  })

  it('always returns a leading slash', () => {
    expect(normalizeLink('/', 'a')).toBe('/a/')
    expect(normalizeLink('', 'a')).toBe('/a/')
    expect(normalizeLink('', '')).toBe('/')
  })

  it('produces the same result under both platform semantics', () => {
    for (const link of ['a', 'a\\b', 'guide/a', '/absolute', 'https://example.com']) {
      expect(win32Utils.normalizeLink('/blog/', link)).toBe(posixUtils.normalizeLink('/blog/', link))
    }
  })
})

describe('getCurrentDirname', () => {
  it('extracts the last segment of the base path', () => {
    expect(getCurrentDirname('blog/guide', 'a.md')).toBe('guide')
    expect(getCurrentDirname('blog/guide/', 'a.md')).toBe('guide')
    expect(getCurrentDirname('//a//b/', 'a.md')).toBe('b')
  })

  it('normalizes Windows style base paths', () => {
    expect(getCurrentDirname('blog\\guide', 'a.md')).toBe('guide')
    expect(getCurrentDirname('C:\\blog\\guide', 'a.md')).toBe('guide')
  })

  it('falls back to the directory of the file path', () => {
    expect(getCurrentDirname('', '/a/b/c.md')).toBe('b')
    expect(getCurrentDirname(undefined, 'a/b/c.md')).toBe('b')
    expect(getCurrentDirname(undefined, 'C:\\a\\b.md')).toBe('a')
  })

  it('returns an empty string when nothing is left after stripping slashes', () => {
    expect(getCurrentDirname('/', 'a.md')).toBe('')
  })

  it('documents the fallback for a file path without directory', () => {
    // `path.dirname('a.md')` 为 `.`，因此这里得到 `.` 而不是空字符串。
    expect(getCurrentDirname(undefined, 'a.md')).toBe('.')
  })

  it('produces the same result under both platform semantics', () => {
    const args: [string | undefined, string][] = [
      ['blog/guide', 'a.md'],
      ['blog\\guide', 'a.md'],
      [undefined, 'a/b/c.md'],
      [undefined, 'C:\\a\\b.md'],
      ['//a//b/', 'a.md'],
      ['/', 'a.md'],
    ]

    for (const [basePath, filepath] of args) {
      expect(win32Utils.getCurrentDirname(basePath, filepath)).toBe(
        posixUtils.getCurrentDirname(basePath, filepath),
      )
    }
  })
})

describe('withBase', () => {
  it('prefixes the base path when it is missing', () => {
    expect(withBase('guide', '/blog/')).toBe('/blog/guide/')
    expect(withBase('guide', '/blog')).toBe('/blog/guide/')
    expect(withBase('a\\b', '/blog/')).toBe('/blog/a/b/')
  })

  it('keeps the url untouched when it already starts with the base', () => {
    expect(withBase('/blog/guide', '/blog/')).toBe('/blog/guide/')
    expect(withBase('/blog/', '/blog/')).toBe('/blog/')
  })

  it('uses "/" as the default base', () => {
    expect(withBase('guide')).toBe('/guide/')
    expect(withBase()).toBe('/')
    expect(withBase('', '/')).toBe('/')
  })

  it('produces the same result under both platform semantics', () => {
    expect(win32Utils.withBase('a\\b', '/blog/')).toBe(posixUtils.withBase('a\\b', '/blog/'))
    expect(win32Utils.withBase('guide', '/blog/')).toBe(posixUtils.withBase('guide', '/blog/'))
  })
})
