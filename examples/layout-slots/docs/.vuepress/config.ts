import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: 'Plume',
  description: 'vuepress-theme-plume',

  head: [
    // 配置站点图标
    ['link', { rel: 'icon', type: 'image/png', href: 'https://theme-plume.vuejs.press/favicon-32x32.png' }],
  ],

  bundler: viteBundler(),
  shouldPrefetch: false, // 站点较大，页面数量较多时，不建议启用

  theme: plumeTheme({
    /* 添加您的部署域名, 有助于 SEO, 生成 sitemap */
    hostname: 'https://plume-layout-slots.netlify.app/',

    /* 文档仓库配置，用于 editLink */
    docsRepo: 'pengzhanbo/vuepress-theme-plume',
    docsDir: 'examples/layout-slots/docs',

    /* 页内信息 */
    contributors: { mode: 'block' },
    changelog: true,

    /* 本地搜索, 默认启用 */
    search: { provider: 'local' },
  }),
})
