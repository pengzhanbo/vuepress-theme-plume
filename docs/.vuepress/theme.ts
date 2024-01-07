import themePlume from 'vuepress-theme-plume'
import { enNotes, zhNotes } from './notes.js'
import { enNavbar, zhNavbar } from './navbar.js'

export const theme = themePlume({
  logo: 'https://pengzhanbo.cn/g.gif',
  hostname: 'https://pengzhanbo.cn',
  repo: 'https://github.com/pengzhanbo/vuepress-theme-plume',
  docsDir: 'docs',

  avatar: {
    url: '/images/blogger.jpg',
    name: 'Plume Theme',
    description: 'The Theme for Vuepress 2.0',
  },

  social: [{ icon: 'github', link: 'https://github.com/pengzhanbo' }],
  footer: { copyright: 'Copyright © 2022-present pengzhanbo' },

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
    docsearch: {
      apiKey: '111',
      appId: '111',
      indexName: '1234',
    },
  },
})
