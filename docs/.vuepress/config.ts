import * as path from 'path'
import { themePlume } from '@vuepress-plume/vuepress-theme-plume'
import { defineUserConfig } from '@vuepress/cli'

export default defineUserConfig({
  base: '/',
  lang: 'zh',
  title: 'Plume Theme',
  description: '',
  public: path.resolve(__dirname, 'public'),
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
    notes: {
      notes: [
        {
          link: 'typescript',
          dir: 'typescript',
          text: 'Typescript',
          sidebar: [
            '',
            {
              text: '123',
              children: ['1', '2'],
            },
            {
              text: 'css',
              dir: 'css',
              children: ['1', '2'],
            },
          ],
        },
        {
          link: '/interview-question',
          text: '面试题解析',
          dir: '面试题',
          sidebar: [
            {
              text: 'HTML',
              dir: 'HTML',
              children: [],
            },
            {
              text: 'CSS',
              dir: 'CSS',
              children: ['盒模型'],
            },
            {
              text: 'JavaScript',
              dir: 'JavaScript',
              children: [],
            },
          ],
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
          {
            text: '面试题',
            link: '/note/interview-question',
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
  }),
})
