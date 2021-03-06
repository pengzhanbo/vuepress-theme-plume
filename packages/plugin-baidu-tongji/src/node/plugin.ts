import type { Plugin } from '@vuepress/core'

export interface BaiduTongjiOptions {
  key?: string
}

export const baiduTongjiPlugin = ({ key }: BaiduTongjiOptions): Plugin => {
  return {
    name: '@vuepress-plume/vuepress-plugin-baidu-tongji',
    extendsPage: (page) => {
      page.frontmatter.head?.push([
        'script',
        {
          type: 'text/javascript',
        },
        'var _hmt = _hmt || []',
      ])
      page.frontmatter.head?.push([
        'script',
        { src: `https://hm.baidu.com/hm.js?${key}` },
      ])
    },
  }
}
