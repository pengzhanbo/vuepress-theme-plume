import process from 'node:process'
import themePlume from 'vuepress-theme-plume'
import type { Theme } from 'vuepress'
import { enNotes, zhNotes } from './notes.js'
import { enNavbar, zhNavbar } from './navbar.js'

export const theme: Theme = themePlume({
  logo: '/plume.png',
  hostname: process.env.SITE_HOST || 'https://plume.pengzhanbo.cn',
  repo: 'https://github.com/pengzhanbo/vuepress-theme-plume',
  docsDir: 'docs',

  avatar: {
    url: '/plume.png',
    name: 'Plume Theme',
    description: 'The Theme for Vuepress 2.0',
    location: 'GuangZhou, China',
    organization: 'pengzhanbo',
  },

  social: [
    { icon: 'github', link: 'https://github.com/pengzhanbo/vuepress-theme-plume' },
    { icon: 'gitlab', link: 'https://pengzhanbo.cn' },
    { icon: 'npm', link: 'https://pengzhanbo.cn' },
    { icon: 'docker', link: 'https://pengzhanbo.cn' },
    { icon: 'stackoverflow', link: 'https://pengzhanbo.cn' },
    { icon: 'juejin', link: 'https://pengzhanbo.cn' },
    { icon: 'discord', link: 'https://pengzhanbo.cn' },
    { icon: 'instagram', link: 'https://pengzhanbo.cn' },
    { icon: 'mastodon', link: 'https://pengzhanbo.cn' },
    { icon: 'slack', link: 'https://pengzhanbo.cn' },
    { icon: 'bilibili', link: 'https://pengzhanbo.cn' },
    { icon: 'linkedin', link: 'https://pengzhanbo.cn' },
    { icon: 'qq', link: 'https://pengzhanbo.cn' },
    { icon: 'twitter', link: 'https://pengzhanbo.cn' },
    { icon: 'x', link: 'https://pengzhanbo.cn' },
    { icon: 'weibo', link: 'https://pengzhanbo.cn' },
    { icon: 'youtube', link: 'https://pengzhanbo.cn' },
    { icon: 'zhihu', link: 'https://pengzhanbo.cn' },
    { icon: 'douban', link: 'https://pengzhanbo.cn' },
    { icon: 'steam', link: 'https://pengzhanbo.cn' },
    { icon: 'xbox', link: 'https://pengzhanbo.cn' },
  ],
  navbarSocialInclude: ['github'],

  footer: { copyright: 'Copyright © 2021-present pengzhanbo' },

  locales: {
    '/': {
      notes: zhNotes,
      navbar: zhNavbar,
    },
    '/en/': {
      notes: enNotes,
      navbar: enNavbar,
    },
  },
  plugins: {
    frontmatter: { exclude: ['**/*.snippet.*'] },

    shiki: { twoslash: true },

    markdownEnhance: {
      demo: true,
      include: true,
      chart: true,
      echarts: true,
      mermaid: true,
      flowchart: true,
    },
    markdownPower: {
      pdf: true,
      caniuse: true,
      plot: true,
      bilibili: true,
      youtube: true,
      icons: true,
      codepen: true,
      replit: true,
      codeSandbox: true,
      jsfiddle: true,
      repl: {
        go: true,
        rust: true,
        kotlin: true,
      },
    },

    comment: {
      provider: 'Giscus',
      comment: true,
      repo: 'pengzhanbo/vuepress-theme-plume',
      repoId: 'R_kgDOG_ebNA',
      category: 'docs-comment',
      categoryId: 'DIC_kwDOG_ebNM4Cd0uF',
      mapping: 'url',
      reactionsEnabled: true,
      inputPosition: 'top',
      darkTheme: 'dark_protanopia',
      lightTheme: 'light_protanopia',
    },

    watermark: {
      enabled: false,
      watermarkOptions: {
        content: 'vuepress-theme-plume',
      },
    },

  },
  encrypt: {
    rules: {
      '/article/enx7c9s/': '123456',
    },
  },
})
