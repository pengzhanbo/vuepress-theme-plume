import { describe, expect, it } from 'vitest'
import { resolveLinkBySidebar } from '../src/node/autoFrontmatter/resolveLinkBySidebar.js'

describe('resolveLinkBySidebar', () => {
  it('returns an empty map for the `auto` sidebar', () => {
    expect(resolveLinkBySidebar('auto', '/')).toEqual({})
  })

  it('ignores string sidebar items', () => {
    // 纯字符串项没有可解析的目录结构，不产生任何映射。
    expect(resolveLinkBySidebar(['a.md', 'b.md'], '/')).toEqual({})
  })

  it('maps the directory of flat items to the collection link', () => {
    const res = resolveLinkBySidebar(
      [{ prefix: 'guide', link: '/guide/', items: ['intro', 'setup'] }],
      '/',
    )

    // 两个字符串项共享同一个目录键，后写入的链接一致。
    expect(res).toEqual({ '/guide/': '/guide/' })
  })

  it('joins the collection prefix when resolving the directory', () => {
    const res = resolveLinkBySidebar(
      [{ dir: 'blog', link: '/blog/', items: ['a'] }],
      '/docs',
    )

    expect(Object.keys(res)).toEqual(['/docs/blog/'])
    expect(res['/docs/blog/']).toBe('/blog/')
  })

  it('expands nested sidebar groups into nested directory keys', () => {
    const res = resolveLinkBySidebar(
      [
        {
          prefix: 'guide',
          link: '/guide/',
          items: [
            'intro',
            { dir: 'advanced', items: ['config'] },
            { prefix: 'faq', items: ['a'] },
          ],
        },
      ],
      '/',
    )

    expect(res).toEqual({
      '/guide/': '/guide/',
      '/guide/advanced/': '/guide/',
      '/guide/faq/': '/guide/',
    })
  })

  it('skips groups whose items are `auto` or undefined', () => {
    const res = resolveLinkBySidebar(
      [
        { prefix: 'a', link: '/a/', items: 'auto' },
        { prefix: 'b', link: '/b/' },
      ],
      '/',
    )

    expect(res).toEqual({})
  })

  it('keeps an absolute prefix as-is', () => {
    const res = resolveLinkBySidebar(
      [{ prefix: 'guide', link: '/guide/', items: [{ prefix: '/abs', items: ['a'] }] }],
      '/',
    )

    // 以 `/` 开头的 prefix 直接作为目录，不再拼接父目录。
    expect(Object.keys(res)).toEqual(['/abs/'])
  })

  it('accumulates the link of nested groups', () => {
    const res = resolveLinkBySidebar(
      [
        {
          prefix: 'guide',
          link: '/guide/',
          items: [{ dir: 'advanced', link: '/advanced/', items: ['a'] }],
        },
      ],
      '/',
    )

    // 子分组的链接与父链接拼接。
    expect(res['/guide/advanced/']).toBe('/guide/advanced/')
  })
})
