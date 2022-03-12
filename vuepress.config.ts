import * as path from 'path'
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'zh',
  title: '示例博客',
  description: '热爱生活',
  dest: 'docs',
  temp: 'example/.vuepress/.temp',
  cache: 'example/.vuepress/.cache',
  public: 'example/public',
  theme: path.resolve(__dirname, './lib/node/index.js'),
  themeConfig: {
    bannerImg: '/big-banner.jpg', // 1200x300
    avatarUrl: '/avatar.gif',
    avatar: '未闻花名',
    github: 'https://github.com/',
    email: '_@outlook.com',
    description: '学习，生活，娱乐，我全都要',
  },
})
