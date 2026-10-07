import { describe, expect, it, vi } from 'vitest'

/**
 * `genAutoFrontmatterRules` reads from the `getThemeConfig()` singleton and the
 * node utils barrel. Both are replaced here to keep the test focused on rule ordering.
 *
 * `genAutoFrontmatterRules` 从 `getThemeConfig()` 单例与 node utils barrel 读取，
 * 这里将两者替换为桩，使测试聚焦于规则顺序。
 */
const hoisted = vi.hoisted(() => ({
  themeConfig: {} as any,
}))

vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: () => hoisted.themeConfig,
}))

vi.mock('../src/node/utils/index.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  nanoid: () => 'test-id',
  getPinyin: () => '',
  hasPinyin: () => false,
}))

const { genAutoFrontmatterRules, getRules } = await import('../src/node/autoFrontmatter/rules.js')
const { findRule } = await import('../src/node/autoFrontmatter/generate.js')

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

    expect(source(findRule(getRules(), 'blog/sub/a.md'))).toBe('blog/sub/**/*.md')
    expect(source(findRule(getRules(), 'blog/a.md'))).toBe('blog/**/*.md')
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

    expect(source(findRule(getRules(), 'java/a.md'))).toBe('java/**/*.md')
    expect(source(findRule(getRules(), 'javaSpring/b.md'))).toBe('javaSpring/**/*.md')
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

    expect(source(findRule(getRules(), 'blog/sub/a.md'))).toBe('blog/sub/**/*.md')
    expect(source(findRule(getRules(), 'blog/a.md'))).toBe('blog/**/*.md')
  })
})
