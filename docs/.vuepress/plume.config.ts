import type { ThemeConfig } from 'vuepress-theme-plume'
import path from 'node:path'
import { defineThemeConfig } from 'vuepress-theme-plume'
import { enCollections, zhCollections } from './collections/index.js'
import { enNavbar, zhNavbar } from './navbar.js'

export default defineThemeConfig({
  logo: '/plume.png',

  profile: {
    avatar: '/plume.png',
    name: 'Plume Theme',
    description: 'The Theme for Vuepress 2.0',
    location: 'GuangZhou, China',
    organization: 'pengzhanbo',
  },

  readAid: 'left',

  transition: { appearance: 'circle-clip' },

  social: [
    { icon: 'github', link: 'https://github.com/pengzhanbo/vuepress-theme-plume' },
    { icon: 'qq', link: 'https://qm.qq.com/q/FbPPoOIscE' },
  ],
  navbarSocialInclude: ['github', 'qq'],

  footer: {
    copyright: 'Copyright © 2021-present pengzhanbo',
  },

  locales: {
    '/': {
      navbar: zhNavbar,
      collections: zhCollections,
    },
    '/en/': {
      navbar: enNavbar,
      collections: enCollections,
    },
  },

  encrypt: {
    rules: {
      '/article/enx7c9s/': '123456',
    },
  },

  bulletin: {
    layout: 'top-right',
    lifetime: 'always',
    // title: '🎉 公告 🎉',
    contentFile: path.join(__dirname, 'bulletin.md'),
    enablePage: page => page.path === '/guide/features/bulletin/',
  },
}) as ThemeConfig
