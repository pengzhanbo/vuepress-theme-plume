import themePlume from 'vuepress-theme-plume'
import { enNotes, zhNotes } from './notes.js'
import { enNavbar, zhNavbar } from './navbar.js'

export const theme = themePlume({
  logo: 'https://pengzhanbo.cn/g.gif',
  hostname: 'https://pengzhanbo.cn',
  repo: 'https://github.com/pengzhanbo/vuepress-theme-plume',
  docsDir: 'docs',
  editLink: true,
  editLinkText: '在 GitHub 编辑此页',
  appearance: true,
  avatar: {
    url: '/images/blogger.jpg',
    name: 'Plume Theme',
    description: 'The Theme for Vuepress 2.0',
  },
  social: [{ icon: 'github', link: 'https://github.com/pengzhanbo' }],
  footer: { copyright: 'Copyright © 2022-present pengzhanbo' },

  locales: {
    '/': {
      selectLanguageName: '简体中文',
      selectLanguageText: '选择语言',
      notes: zhNotes,
      navbar: zhNavbar,
    },
    '/en/': {
      selectLanguageName: 'English',
      selectLanguageText: 'Language',
      editLinkText: 'Edit this page on GitHub',
      notes: enNotes,
      navbar: enNavbar,
    },
  },
  plugins: {
    markdownEnhance: { katex: true },
    search: {
      locales: {
        '/': {
          placeholder: '搜索',
        },
        '/en/': {
          placeholder: 'Search',
        },
      },
    },
  },
})
