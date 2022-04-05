import * as path from 'path'
import type { PlumeThemeOptions } from '@vuepress-plume/vuepress-theme-plume'
import { defineUserConfig } from '@vuepress/cli'

export default defineUserConfig<PlumeThemeOptions>({
  lang: 'zh',
  title: 'Plume Theme',
  description: '',
  public: path.resolve(__dirname, '../public'),
  theme: '@vuepress-plume/vuepress-theme-plume',
  themeConfig: {
    logo: 'https://pengzhanbo.cn/g.gif',
    avatar: {
      url: 'https://via.placeholder.com/300?text=Profile+Photo',
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
      { text: '首页', link: '/' },
      {
        text: '分类',
        link: '/category/',
      },
      {
        text: '标签',
        link: '/tag/',
      },
      {
        text: '笔记',
        children: [
          // {
          //   text: '技术',
          //   children: [{ text: '《typescript学习笔记》', link: '/' }],
          // },
          // {
          //   text: '技术',
          //   children: [{ text: '《typescript学习笔记》', link: '/' }],
          // },
          {
            text: 'typescript',
            link: '/note/typescript/',
          },
          {
            text: '标签',
            link: '/tag/',
          },
        ],
      },
    ],
    footer: {
      copyright: 'Copyright © 2022-present pengzhanbo',
    },
    themePlugins: {
      caniuse: {
        mode: 'embed',
      },
      search: {
        // hotKeys: ['s', '/'],
        // maxSuggestions: 5,
        // isSearchable: (page) => page.path !== '/',
        // getExtraFields: () => [],
        locales: {
          '/': {
            placeholder: '搜索',
          },
        },
      },
    },
  },
})
