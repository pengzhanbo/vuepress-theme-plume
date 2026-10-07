import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import {
  createMatcher,
  resolveMatcherPattern,
} from '../src/node/utils/createMatcher.js'
import { hash, nanoid } from '../src/node/utils/hash.js'
import { interopDefault } from '../src/node/utils/interopDefault.js'
import { logger, perf } from '../src/node/utils/logger.js'
import {
  getCurrentDirname,
  normalizeLink,
  normalizePath,
  pathJoin,
  resolve,
  templates,
  withBase,
} from '../src/node/utils/path.js'
import { resolveContent } from '../src/node/utils/resolveContent.js'
import { createTranslate, setTranslateLang } from '../src/node/utils/translate.js'

describe('resolveMatcherPattern', () => {
  it('defaults to all markdown files when no include is given', () => {
    expect(resolveMatcherPattern()).toEqual({ pattern: ['**/*.md'], ignore: [] })
    expect(resolveMatcherPattern([])).toEqual({ pattern: ['**/*.md'], ignore: [] })
  })

  it('turns negated include entries into ignore patterns', () => {
    const { pattern, ignore } = resolveMatcherPattern(['blog/**/*.md', '!blog/draft/**'])

    expect(pattern).toEqual(['blog/**/*.md'])
    expect(ignore).toEqual(['blog/draft/**'])
  })

  it('deduplicates excludes and merges them into the ignore list', () => {
    // 重复的 exclude 不应产生重复的 ignore 项。
    const { ignore } = resolveMatcherPattern(['**/*.md'], ['draft/**', 'draft/**'])

    expect(ignore).toEqual(['draft/**'])
  })
})

describe('createMatcher', () => {
  it('matches markdown files and always ignores vuepress internals', () => {
    const matcher = createMatcher()

    expect(matcher('guide/a.md')).toBe(true)
    expect(matcher('a/b/c.md')).toBe(true)
    expect(matcher('a/b/c.txt')).toBe(false)
    expect(matcher('node_modules/a.md')).toBe(false)
    expect(matcher('.vuepress/a.md')).toBe(false)
  })

  it('respects the provided include and exclude patterns', () => {
    const matcher = createMatcher(['blog/**/*.md'], ['blog/draft/**'])

    expect(matcher('blog/a.md')).toBe(true)
    expect(matcher('blog/draft/a.md')).toBe(false)
    // 未包含在 include 中的目录不匹配。
    expect(matcher('docs/a.md')).toBe(false)
  })
})

describe('hash', () => {
  it('produces a stable md5 hex digest', () => {
    expect(hash('hello')).toBe(hash('hello'))
    expect(hash('hello')).toHaveLength(32)
    expect(hash('hello')).not.toBe(hash('hello world'))
  })
})

describe('nanoid', () => {
  it('generates an 8-char lowercase alphanumeric id', () => {
    const id = nanoid()

    expect(id).toHaveLength(8)
    expect(id).toMatch(/^[0-9a-z]{8}$/)
    // 随机 ID 不应重复。
    expect(nanoid()).not.toBe(id)
  })
})

describe('interopDefault', () => {
  it('unwraps a module default export', async () => {
    await expect(interopDefault(Promise.resolve({ default: 'value' }))).resolves.toBe('value')
  })

  it('keeps the value when there is no default export', async () => {
    await expect(interopDefault(Promise.resolve('value'))).resolves.toBe('value')
  })

  it('accepts a non-promise awaitable value', async () => {
    await expect(interopDefault({ default: 1 })).resolves.toBe(1)
  })
})

describe('resolveContent', () => {
  const prodApp = { env: { isDev: false } } as any
  const devApp = { env: { isDev: true } } as any

  it('serializes the content as an exported constant', () => {
    const content = resolveContent(prodApp, { name: 'postsData', content: { a: 1 } })

    expect(content).toBe('export const postsData = {"a":1}')
  })

  it('wraps the export with the before and after snippets', () => {
    const content = resolveContent(prodApp, {
      name: 'data',
      content: [1, 2],
      before: 'import { x } from "y"',
      after: 'export default data',
    })

    expect(content).toBe(
      'import { x } from "y"\nexport const data = [1,2]\nexport default data',
    )
  })

  it('appends HMR handling in dev mode only', () => {
    const content = resolveContent(devApp, { name: 'themeData', content: {} })

    expect(content).toContain('import.meta.hot')
    expect(content).toContain('import.meta.webpackHot')
    // 依据变量名推导出的 HMR 更新函数名首字母大写。
    expect(content).toContain('__VUE_HMR_RUNTIME__.updateThemeData(themeData)')
    expect(resolveContent(prodApp, { name: 'themeData', content: {} })).not.toContain('import.meta.hot')
  })
})

describe('setTranslateLang / createTranslate', () => {
  const locales = {
    en: { hello: 'Hello, {{ name }}!', plain: 'Plain' },
    zh: { hello: '你好，{{name}}！', plain: '纯文本' },
  } as const
  const t = createTranslate(locales)

  it('switches between Chinese and English variants', () => {
    setTranslateLang('zh-CN')
    expect(t('plain')).toBe('纯文本')
    setTranslateLang('zh-Hant')
    expect(t('plain')).toBe('纯文本')

    setTranslateLang('en-US')
    expect(t('plain')).toBe('Plain')
    // 未知语言回退到英文。
    setTranslateLang('fr')
    expect(t('plain')).toBe('Plain')
  })

  it('interpolates the template placeholders', () => {
    setTranslateLang('en')
    expect(t('hello', { name: 'World' })).toBe('Hello, World!')

    setTranslateLang('zh')
    expect(t('hello', { name: '世界' })).toBe('你好，世界！')
  })

  it('returns the key when the translation is missing', () => {
    setTranslateLang('en')
    expect(t('missing' as any)).toBe('missing')
  })

  it('leaves the placeholder untouched when the data is empty', () => {
    setTranslateLang('en')
    // 空对象不触发插值，原样返回模板。
    expect(t('hello', {})).toBe('Hello, {{ name }}!')
    expect(t('hello')).toBe('Hello, {{ name }}!')
  })

  it('keeps the raw placeholder when the value is missing', () => {
    setTranslateLang('en')
    expect(t('hello', { other: 'x' } as any)).toBe('Hello, {{ name }}!')
  })
})

describe('path utils', () => {
  it('normalizes path separators and collapses duplicates', () => {
    expect(normalizePath('a\\b\\c')).toBe('a/b/c')
    expect(normalizePath('a//b///c')).toBe('a/b/c')
  })

  it('joins and normalizes path segments', () => {
    expect(pathJoin('a', 'b', 'c')).toBe('a/b/c')
    expect(pathJoin('a\\b', 'c')).toBe('a/b/c')
  })

  it('normalizes links with the base path', () => {
    expect(normalizeLink('/blog/', 'a')).toBe('/blog/a/')
    // 空 link 退化为 base 本身。
    expect(normalizeLink('/blog', '')).toBe('/blog/')
    // 绝对链接与带协议的链接保持原样。
    expect(normalizeLink('/blog/', '/absolute')).toBe('/absolute')
    expect(normalizeLink('/blog/', 'https://example.com')).toBe('https://example.com')
  })

  it('extracts the last directory segment', () => {
    expect(getCurrentDirname('blog/guide', 'a.md')).toBe('guide')
    // basePath 为空时回退到 filepath 的目录名。
    expect(getCurrentDirname('', '/a/b/c.md')).toBe('b')
    expect(getCurrentDirname(undefined, 'a/b/c.md')).toBe('b')
  })

  it('prefixes the base path when it is missing', () => {
    expect(withBase('guide', '/blog/')).toBe('/blog/guide/')
    // 已包含 base 时不重复添加。
    expect(withBase('/blog/guide', '/blog/')).toBe('/blog/guide/')
    expect(withBase('', '/')).toBe('/')
  })

  it('resolves paths relative to the parent of the utils directory', () => {
    // `resolve` 以 utils 目录的上一级为基准（构建产物中即主题包根目录）。
    const nodeDir = fileURLToPath(new URL('../src/node', import.meta.url))
    expect(resolve('foo.txt')).toBe(path.join(nodeDir, 'foo.txt'))
    // templates 在 resolve 的基础上又上溯一级。
    expect(templates('index.html')).toBe(path.resolve(nodeDir, '..', 'templates', 'index.html'))
  })
})

describe('perf logger', () => {
  it('only logs the elapsed time in debug mode', () => {
    const info = vi.spyOn(logger, 'info').mockImplementation(() => {})

    perf.init(false)
    perf.mark('prepare')
    perf.log('prepare')
    expect(info).not.toHaveBeenCalled()

    perf.init(true)
    perf.mark('prepare')
    perf.log('prepare')
    expect(info).toHaveBeenCalledWith('[perf spent time] ', expect.stringContaining('prepare'))

    // 未标记过的 checkpoint 不输出日志。
    info.mockClear()
    perf.log('never-marked')
    expect(info).not.toHaveBeenCalled()

    info.mockRestore()
  })
})
