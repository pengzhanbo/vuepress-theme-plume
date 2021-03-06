import * as path from 'path'
import { themePlume } from '@vuepress-plume/vuepress-theme-plume'
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { defineUserConfig } from '@vuepress/cli'
import notes from './notes'

export default defineUserConfig({
  base: '/',
  lang: 'zh',
  title: 'Plume Theme',
  description: '',
  source: path.resolve(__dirname, '../'),
  public: path.resolve(__dirname, 'public'),

  bundler:
    process.env.DOCS_BUNDLER === 'webpack' ? webpackBundler() : viteBundler(),

  theme: themePlume({
    logo: 'https://pengzhanbo.cn/g.gif',
    hostname: 'https://pengzhanbo.cn',
    avatar: {
      url: '/images/blogger.jpg',
      name: 'Plume Theme',
      description: 'The Theme for Vuepress 2.0',
    },
    social: {
      email: 'volodymyr@foxmail.com',
      github: 'pengzhanbo',
      QQ: '942450674',
      weiBo: 'https://weibo.com',
      zhiHu: 'https://zhihu.com',
      facebook: 'https://baidu.com',
      twitter: 'https://baidu.com',
      linkedin: 'https://baidu.com',
    },
    notes,
    darkMode: true,
    navbar: [
      {
        text: 'VuePress',
        children: [
          { text: 'theme-plume', link: '/note/vuepress-theme-plume/' },
          {
            text: 'Plugin',
            children: [
              { text: 'caniuse', link: '/note/vuepress-plugin/caniuse/' },
              {
                text: 'netlify-functions',
                link: '/note/vuepress-plugin/netlify-functions/',
              },
            ],
          },
        ],
      },
    ],
    footer: {
      copyright: 'Copyright © 2022-present pengzhanbo',
      content: '',
    },
    themePlugins: {
      search: {
        locales: {
          '/': {
            placeholder: '搜索',
          },
        },
      },
    },
  }),
})
