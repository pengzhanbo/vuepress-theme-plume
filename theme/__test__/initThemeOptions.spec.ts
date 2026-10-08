import type { App } from 'vuepress'
import type { ThemeOptions } from '../src/shared/index.js'
import { describe, expect, it } from 'vitest'
import { initThemeOptions } from '../src/node/config/initThemeOptions.js'

/**
 * 仅提供多语言信息的最小 App 假对象，`initThemeOptions` 只需要据此解析语言环境。
 *
 * A minimal App stub carrying only the locale information; `initThemeOptions`
 * needs nothing else to resolve the locale configs.
 */
const app = {
  options: { locales: { '/': { lang: 'zh-CN' }, '/en/': { lang: 'en-US' } } },
} as unknown as App

/** 生成便于断言的集合摘要，忽略 `completeCollections` 补全的可选字段。 */
function brief(collections: ThemeOptions['collections']) {
  return collections?.map(({ type, dir }) => ({ type, dir }))
}

describe('initThemeOptions > blog/notes compatibility', () => {
  it('should migrate the root legacy blog and notes into every locale', () => {
    const options = initThemeOptions(app, {
      blog: { include: ['blog/**'] },
      notes: { dir: 'notes', link: '/notes/', notes: [{ dir: 'guide', link: 'guide' }] },
      locales: { '/en/': {} },
    } as unknown as ThemeOptions)

    // 根级 legacy 配置是全局配置，会迁移到根级与每个未自行配置集合的语言环境。
    expect(brief(options.collections)).toEqual([
      { type: 'post', dir: '/' },
      { type: 'doc', dir: 'notes/guide' },
    ])
    expect(brief(options.locales?.['/en/']?.collections)).toEqual([
      { type: 'post', dir: '/' },
      { type: 'doc', dir: 'notes/guide' },
    ])
  })

  it('should migrate a locale legacy notes even when it inherits the root collections', () => {
    // 回归：语言环境从根级"继承"了 collections 时，其自身的 legacy `notes`
    // 曾被误判为已被取代而静默删除，既不迁移也不告警。
    // Regression: when a locale merely inherited the root `collections`, its own
    // legacy `notes` was mistaken for "already superseded" and silently deleted.
    const options = initThemeOptions(app, {
      collections: [{ type: 'post', dir: 'blog' }],
      locales: {
        '/en/': {
          notes: { dir: 'en/notes', link: '/en/notes/', notes: [{ dir: 'guide', link: 'guide' }] },
        },
      },
    } as unknown as ThemeOptions)

    // 根级显式配置的集合保持不变。
    expect(brief(options.collections)).toEqual([{ type: 'post', dir: 'blog' }])
    // 语言环境继承根级集合，并追加自身 legacy `notes` 迁移出的 doc 集合。
    expect(brief(options.locales?.['/en/']?.collections)).toEqual([
      { type: 'post', dir: 'blog' },
      { type: 'doc', dir: 'en/notes/guide' },
    ])
  })

  it('should honour blog:false declared by a locale', () => {
    const options = initThemeOptions(app, {
      article: '/article/',
      blog: { include: ['blog/**'] },
      locales: { '/en/': { blog: false } },
    } as unknown as ThemeOptions)

    expect(brief(options.collections)).toEqual([{ type: 'post', dir: '/' }])
    // `blog: false` 的语言环境不再获得由根级 `blog` 迁移出的 post 集合。
    expect(options.locales?.['/en/']?.collections ?? []).toEqual([])
  })

  it('should prefer a locale own blog and article over the root ones', () => {
    const options = initThemeOptions(app, {
      article: '/article/',
      blog: { include: ['blog/**'] },
      locales: { '/en/': { blog: { include: ['en/blog/**'] }, article: '/en/article/' } },
    } as unknown as ThemeOptions)

    const collections = options.locales?.['/en/']?.collections
    expect(collections).toHaveLength(1)
    expect(collections?.[0]).toMatchObject({
      type: 'post',
      dir: '/',
      include: ['en/blog/**'],
      linkPrefix: '/en/article/',
    })
  })
})
