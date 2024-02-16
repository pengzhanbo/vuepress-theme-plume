import type { Plugin, PluginObject } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'

export interface BaiduTongjiOptions {
  key?: string
}

const __dirname = getDirname(import.meta.url)

export function baiduTongjiPlugin({ key = '' }: BaiduTongjiOptions): Plugin {
  return (app) => {
    const plugin: PluginObject = {
      name: '@vuepress-plume/plugin-baidu-tongji',
    }

    if (app.env.isDev)
      return plugin

    return {
      ...plugin,
      clientConfigFile: path.resolve(__dirname, '../client/config.js'),
      extendsPage: (page) => {
        page.frontmatter.head ??= []
        page.frontmatter.head?.push([
          'script',
          { type: 'text/javascript' },
          'window._hmt = window._hmt || []',
        ])
        page.frontmatter.head?.push([
          'script',
          { src: `https://hm.baidu.com/hm.js?${key}`, async: true },
        ])
      },
    }
  }
}
