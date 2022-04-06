import * as path from 'path'
import type { PlumeThemeOptions } from '@vuepress-plume/vuepress-theme-plume'
import { defineUserConfig } from '@vuepress/cli'

export default defineUserConfig<PlumeThemeOptions>({
  lang: 'zh',
  title: 'Plume Theme',
  description: '',
  public: path.resolve(__dirname, 'public'),
  theme: '@vuepress-plume/vuepress-theme-plume',
  themeConfig: {
    logo: 'https://pengzhanbo.cn/g.gif',
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
    notes: {
      notes: [
        {
          link: 'typescript',
          dir: 'typescript',
          text: 'Typescript',
          sidebar: [],
        },
      ],
    },
    darkMode: true,
    navbar: [
      {
        text: '笔记',
        children: [
          {
            text: 'typescript',
            link: '/note/typescript/',
          },
        ],
      },
    ],
    footer: {
      copyright: 'Copyright © 2022-present pengzhanbo',
      content: '',
    },
    themePlugins: {
      caniuse: {
        mode: 'embed',
      },
      search: {
        locales: {
          '/': {
            placeholder: '搜索',
          },
        },
      },
    },
  },
})
