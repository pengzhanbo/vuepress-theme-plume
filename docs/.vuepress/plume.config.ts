import { defineThemeConfig } from 'vuepress-theme-plume'
import { enNavbar, zhNavbar } from './navbar.js'
import { enNotes, zhNotes } from './notes/index.js'

export default defineThemeConfig({
  logo: '/plume.png',
  docsRepo: 'https://github.com/pengzhanbo/vuepress-theme-plume',
  docsDir: 'docs',

  profile: {
    avatar: '/plume.png',
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

  encrypt: {
    rules: {
      '/article/enx7c9s/': '123456',
    },
  },
  autoFrontmatter: { exclude: ['**/*.snippet.*'] },
})
