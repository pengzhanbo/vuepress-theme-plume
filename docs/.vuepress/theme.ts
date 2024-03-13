import themePlume from 'vuepress-theme-plume'
import type { Theme } from 'vuepress'
import { enNotes, zhNotes } from './notes.js'
import { enNavbar, zhNavbar } from './navbar.js'

export const theme: Theme = themePlume({
  logo: '/plume.png',
  hostname: 'https://plume.pengzhanbo.cn',
  repo: 'https://github.com/pengzhanbo/vuepress-theme-plume',
  docsDir: 'docs',

  avatar: {
    url: '/plume.png',
    name: 'Plume Theme',
    description: 'The Theme for Vuepress 2.0',
  },

  social: [{ icon: 'github', link: 'https://github.com/pengzhanbo/vuepress-theme-plume' }],

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
    shiki: { twoslash: true },
    markdownEnhance: {
      demo: true,
      include: true,
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

  },
  encrypt: {
    rules: {
      '/article/enx7c9s/': '123456',
    },
  },
})
