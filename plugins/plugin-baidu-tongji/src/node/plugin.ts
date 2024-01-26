import type { Plugin } from 'vuepress/core'

export interface BaiduTongjiOptions {
  key?: string
}

export function baiduTongjiPlugin({ key = '' }: BaiduTongjiOptions): Plugin {
  return {
    name: '@vuepress-plume/plugin-baidu-tongji',
    extendsPage: (page) => {
      page.frontmatter.head ??= []
      page.frontmatter.head?.push([
        'script',
        { type: 'text/javascript' },
        'var _hmt = _hmt || []',
      ])
      page.frontmatter.head?.push([
        'script',
        { src: `https://hm.baidu.com/hm.js?${key}` },
      ])
    },
  }
}
