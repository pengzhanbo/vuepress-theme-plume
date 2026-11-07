import { describe, expect, it, vi } from 'vitest'

/**
 * `genAutoFrontmatterRules` reads from the `getThemeOptions()` singleton and the
 * node utils barrel. Both are replaced here to keep the test focused on rule ordering.
 *
 * `genAutoFrontmatterRules` 从 `getThemeOptions()` 单例与 node utils barrel 读取，
 * 这里将两者替换为桩，使测试聚焦于规则顺序。
 */
const hoisted = vi.hoisted(() => ({
  themeConfig: {} as any,
}))

vi.mock('../options.js', () => ({
  getThemeOptions: () => hoisted.themeConfig,
}))

vi.mock('../utils/index.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  nanoid: () => 'test-id',
  getPinyin: () => '',
  hasPinyin: () => false,
}))

const { genAutoFrontmatterRules, getRules } = await import('../features/autoFrontmatter/rules.js')
const { createFilter } = await import('../utils/createFilter.js')

/**
 * `generateMarkdownFrontmatter` picks the first rule whose filter matches the relative
 * path, so the same lookup is reproduced here to assert the rule precedence.
 *
 * `generateMarkdownFrontmatter` 取首条过滤器命中的规则，这里复现同一查找以断言规则优先级。
 */
function findRule(file: string) {
  return getRules().find(({ filter }) => createFilter(filter)(file))
}

/** The first pattern of a rule's filter identifies the collection it was generated from. */
function source(rule: ReturnType<typeof findRule>): string | undefined {
  return (rule?.filter as string[] | undefined)?.[0]
}

describe('autoFrontmatter rules', () => {
  it('assigns nested files to the collection with the longest dir', () => {
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [
            { type: 'doc', dir: 'blog', title: 'Blog' },
            { type: 'doc', dir: 'blog/sub', title: 'Sub' },
          ],
        },
      },
    }

    genAutoFrontmatterRules()

    expect(source(findRule('blog/sub/a.md'))).toBe('blog/sub/**/*.md')
    expect(source(findRule('blog/a.md'))).toBe('blog/**/*.md')
  })

  it('keeps sibling dirs that share a name prefix apart', () => {
    // `javaSpring` 以 `java` 开头但并非其子目录，glob 过滤不能把两者混在一起。
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [
            { type: 'doc', dir: 'java', title: 'Java' },
            { type: 'doc', dir: 'javaSpring', title: 'Java Spring' },
          ],
        },
      },
    }

    genAutoFrontmatterRules()

    expect(source(findRule('java/a.md'))).toBe('java/**/*.md')
    expect(source(findRule('javaSpring/b.md'))).toBe('javaSpring/**/*.md')
  })

  it('resolves the same way regardless of the config declaration order', () => {
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [
            { type: 'doc', dir: 'blog/sub', title: 'Sub' },
            { type: 'doc', dir: 'blog', title: 'Blog' },
          ],
        },
      },
    }

    genAutoFrontmatterRules()

    expect(source(findRule('blog/sub/a.md'))).toBe('blog/sub/**/*.md')
    expect(source(findRule('blog/a.md'))).toBe('blog/**/*.md')
  })

  it('falls back to the root rule for files outside any collection', () => {
    hoisted.themeConfig = {
      locales: {
        '/': { collections: [{ type: 'doc', dir: 'blog', title: 'Blog' }] },
      },
    }

    genAutoFrontmatterRules()

    expect(source(findRule('blog/a.md'))).toBe('blog/**/*.md')
    // 未归属任何集合的根级文件必须命中根兜底规则。
    expect(source(findRule('about.md'))).toBe('**/*.md')
  })

  it('falls back to the locale rule for files outside the locale collections', () => {
    hoisted.themeConfig = {
      locales: {
        '/': { collections: [{ type: 'doc', dir: 'blog', title: 'Blog' }] },
        '/en/': { collections: [{ type: 'doc', dir: 'docs', title: 'Docs' }] },
      },
    }

    genAutoFrontmatterRules()

    expect(source(findRule('en/docs/a.md'))).toBe('en/docs/**/*.md')
    // 未归属集合的 /en/ 文件命中该语言环境的兜底规则。
    expect(source(findRule('en/about.md'))).toBe('en/**/*.md')
  })

  it('builds the post filter from the include and exclude patterns', () => {
    hoisted.themeConfig = {
      locales: {
        '/': {
          collections: [{
            type: 'post',
            dir: 'blog',
            title: 'Blog',
            include: ['docs/**/*.md'],
            exclude: ['draft/**'],
          }],
        },
      },
    }

    genAutoFrontmatterRules()

    const filter = findRule('blog/a.md')?.filter as string[]
    expect(filter).toEqual(expect.arrayContaining(['blog/**/*.md', 'docs/**/*.md', '!draft/**']))
    // node_modules 始终被排除。
    expect(filter).toContain('!**/node_modules/**')
  })

  it('excludes node_modules from the fallback rules', () => {
    hoisted.themeConfig = { locales: { '/': {} } }

    genAutoFrontmatterRules()

    expect(source(findRule('about.md'))).toBe('**/*.md')
    expect(findRule('node_modules/a.md')).toBeUndefined()
  })
})
