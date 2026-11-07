import type { Page } from 'vuepress'
import type { ThemeOptions } from '../../shared/index.js'
import { describe, expect, it } from 'vitest'
import { getIconsWithPage, getIconWithThemeConfig } from '../features/icons.js'

function createPage(frontmatter: Record<string, any> = {}, contentRendered = ''): Page {
  return { frontmatter, contentRendered } as unknown as Page
}

describe('getIconsWithPage', () => {
  it('collects iconify icons rendered in the page content', () => {
    const page = createPage({}, `
      <VPIcon name="mdi:home" />
      <VPIcon name="https://example.com/icon.svg" />
      <VPIcon name="plain" />
      <VPIcon name="iconify mdi:star" />
      <Card icon="mdi:card" />
    `)

    expect(getIconsWithPage(page, { provider: 'iconify' })).toEqual([
      'mdi:home',
      'mdi:star',
      'mdi:card',
    ])
  })

  it('collects icons from the frontmatter and the home configuration', () => {
    const page = createPage({
      icon: 'mdi:page',
      home: true,
      config: [
        {
          type: 'features',
          features: [
            { title: 'Fast', icon: 'mdi:rocket' },
            { title: 'Safe', icon: 'plain' },
          ],
        },
        {
          type: 'hero',
          hero: {
            actions: [
              { text: 'Start', icon: 'mdi:play' },
              { text: 'Docs', suffixIcon: 'mdi:arrow-right' },
            ],
          },
        },
      ],
    })

    expect(getIconsWithPage(page, { provider: 'iconify' })).toEqual([
      'mdi:page',
      'mdi:rocket',
      'mdi:play',
      'mdi:arrow-right',
    ])
  })

  it('ignores the home configuration of non-home pages', () => {
    const page = createPage({
      config: [{ type: 'features', features: [{ icon: 'mdi:rocket' }] }],
    })

    expect(getIconsWithPage(page, { provider: 'iconify' })).toEqual([])
  })

  it('maps friends social links to simple-icons', () => {
    const page = createPage({
      pageLayout: 'friends',
      list: [
        { socials: [{ icon: 'twitter' }, { icon: 'mdi:github' }] },
      ],
      groups: [
        {
          list: [
            { socials: [{ icon: 'weibo' }, { icon: 'iconify mdi:bluesky' }] },
          ],
        },
      ],
    })

    // 旧别名映射回 simple-icons 中的名称，显式的 iconify 名称保持原集合。
    expect(getIconsWithPage(page, { provider: 'iconify' })).toEqual([
      'simple-icons:x',
      'mdi:github',
      'simple-icons:sinaweibo',
      'mdi:bluesky',
    ])
  })

  it('only accepts explicitly iconify icons for other providers', () => {
    const page = createPage({ icon: 'iconify mdi:page' }, `
      <VPIcon provider="iconify" name="mdi:home" />
      <VPIcon name="mdi:ignored" />
    `)

    expect(getIconsWithPage(page, { provider: 'iconfont' })).toEqual([
      'mdi:home',
      'mdi:page',
    ])
  })
})

describe('getIconWithThemeConfig', () => {
  it('collects icons from the navbar, sidebars, collections and social links', () => {
    const options = {
      locales: {
        '/': {
          navbar: [
            'Home',
            { text: 'Guide', icon: 'mdi:book', items: [{ text: 'A', icon: 'mdi:a' }] },
            { text: 'No icon', icon: 'plain' },
          ],
          sidebar: {
            '/guide': [
              { text: 'Guide', icon: 'mdi:sidebar' },
              { text: 'Group', items: [{ text: 'Child', icon: 'mdi:child' }] },
            ],
          },
          collections: [
            { type: 'post', dir: 'blog', social: [{ icon: 'weibo' }] },
            { type: 'doc', dir: 'docs', sidebar: [{ text: 'Doc', icon: 'mdi:doc' }] },
          ],
          social: [{ icon: 'twitter' }, { icon: 'github' }],
        },
      },
    } as unknown as ThemeOptions

    expect(getIconWithThemeConfig(options, { provider: 'iconify' })).toEqual([
      'mdi:book',
      'mdi:a',
      'mdi:sidebar',
      'mdi:child',
      'mdi:doc',
      'simple-icons:x',
      'simple-icons:github',
      'simple-icons:sinaweibo',
    ])
  })

  it('drops icons that are not iconify when another provider is configured', () => {
    const options = {
      locales: {
        '/': {
          navbar: [
            { text: 'Home', icon: 'iconify mdi:home' },
            { text: 'Other', icon: 'mdi:other' },
          ],
        },
      },
    } as unknown as ThemeOptions

    expect(getIconWithThemeConfig(options, { provider: 'iconfont' })).toEqual(['mdi:home'])
  })
})
