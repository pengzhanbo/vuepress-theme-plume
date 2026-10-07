import type { Page } from 'vuepress'
import type { ThemeCollectionItem } from '../src/shared/index.js'
import { describe, expect, it, vi } from 'vitest'

/**
 * `findCollection` reads collections from the `getThemeConfig()` singleton, so the
 * config is captured here and replaced per test case.
 *
 * `findCollection` 从 `getThemeConfig()` 单例读取集合配置，因此在这里捕获配置并按用例替换。
 */
const hoisted = vi.hoisted(() => ({
  themeConfig: {} as any,
}))

vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: () => hoisted.themeConfig,
}))

const { findCollection } = await import('../src/node/collections/findCollection.js')

/** Build a minimal page with the fields `findCollection` reads. */
function createPage(filePathRelative: string, pathLocale = '/'): Page<any> {
  return { pathLocale, filePathRelative } as unknown as Page<any>
}

function setCollections(collections: ThemeCollectionItem[]): void {
  hoisted.themeConfig = { locales: { '/': { collections } } }
}

function dir(collection: ThemeCollectionItem | undefined): string | undefined {
  return collection?.dir
}

describe('findCollection', () => {
  it('resolves nested collections to the collection with the longest dir', () => {
    // 父集合声明在前，嵌套文件仍应归属到更具体的子集合。
    setCollections([
      { type: 'doc', dir: 'blog', title: 'Blog' },
      { type: 'doc', dir: 'blog/sub', title: 'Sub' },
    ])

    expect(dir(findCollection(createPage('blog/sub/a.md')))).toBe('blog/sub')
    expect(dir(findCollection(createPage('blog/a.md')))).toBe('blog')

    // 调换声明顺序，结果保持不变。
    setCollections([
      { type: 'doc', dir: 'blog/sub', title: 'Sub' },
      { type: 'doc', dir: 'blog', title: 'Blog' },
    ])

    expect(dir(findCollection(createPage('blog/sub/a.md')))).toBe('blog/sub')
    expect(dir(findCollection(createPage('blog/a.md')))).toBe('blog')
  })

  it('does not let an empty dir collection swallow other collections', () => {
    setCollections([
      { type: 'doc', dir: '', title: 'Root' },
      { type: 'doc', dir: 'blog', title: 'Blog' },
    ])

    expect(dir(findCollection(createPage('blog/a.md')))).toBe('blog')
    // 只有不属于其它集合的页面才落到空 dir 的兜底集合。
    expect(dir(findCollection(createPage('other/a.md')))).toBe('')
  })

  it('treats a leading-slash root dir the same as an empty dir', () => {
    setCollections([
      { type: 'doc', dir: '/', title: 'Root' },
      { type: 'doc', dir: 'blog', title: 'Blog' },
    ])

    expect(dir(findCollection(createPage('blog/a.md')))).toBe('blog')
    expect(dir(findCollection(createPage('other/a.md')))).toBe('/')
  })

  it('keeps sibling dirs that share a name prefix apart', () => {
    // `javaSpring` 以 `java` 开头，但并不是 `java` 的子目录，
    // 两者必须各自命中自己的页面，不能互相串扰。
    setCollections([
      { type: 'doc', dir: 'java', title: 'Java' },
      { type: 'doc', dir: 'javaSpring', title: 'Java Spring' },
    ])

    expect(dir(findCollection(createPage('java/a.md')))).toBe('java')
    expect(dir(findCollection(createPage('javaSpring/b.md')))).toBe('javaSpring')

    // 调换声明顺序，结果保持不变。
    setCollections([
      { type: 'doc', dir: 'javaSpring', title: 'Java Spring' },
      { type: 'doc', dir: 'java', title: 'Java' },
    ])

    expect(dir(findCollection(createPage('java/a.md')))).toBe('java')
    expect(dir(findCollection(createPage('javaSpring/b.md')))).toBe('javaSpring')
  })

  it('returns undefined when no collection matches', () => {
    setCollections([{ type: 'doc', dir: 'blog', title: 'Blog' }])

    expect(findCollection(createPage('other/a.md'))).toBeUndefined()
  })
})
