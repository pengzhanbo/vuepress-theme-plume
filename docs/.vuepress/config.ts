import * as path from 'path'
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { defineUserConfig } from '@vuepress/cli'
import themePlume from 'vuepress-theme-plume'
import { enNotes, zhNotes } from './notes.js'

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: 'Plume Theme',
  description: '',
  source: path.resolve(__dirname, '../'),
  public: path.resolve(__dirname, 'public'),
  locales: {
    '/': {
      title: 'Plume主题',
      description: '',
      lang: 'zh-CN',
    },
    '/en/': {
      title: 'Plume Theme',
      description: '',
      lang: 'en',
    },
  },

  bundler:
    process.env.DOCS_BUNDLER === 'webpack' ? webpackBundler() : viteBundler(),

  theme: themePlume({
    logo: 'https://pengzhanbo.cn/g.gif',
    hostname: 'https://pengzhanbo.cn',
    repo: 'https://github.com/pengzhanbo/vuepress-theme-plume',
    docsDir: 'docs',
    editLink: true,
    editLinkText: 'Edit this page on GitHub',
    appearance: true,
    avatar: {
      url: '/images/blogger.jpg',
      name: 'Plume Theme',
      description: 'The Theme for Vuepress 2.0',
    },
    social: [{ icon: 'github', link: 'https://github.com/pengzhanbo' }],
    notes: zhNotes,
    navbar: [
      { text: '首页', link: '/', icon: 'material-symbols:home-outline' },
      {
        text: '博客',
        link: '/blog/',
        icon: 'material-symbols:article-outline',
      },
      {
        text: 'VuePress',
        icon: 'vscode-icons:file-type-vue',
        items: [
          {
            text: 'theme-plume',
            link: '/note/vuepress-theme-plume/',
            icon: 'icon-park-outline:theme',
          },
          {
            text: '插件',
            icon: 'mingcute:plugin-2-line',
            items: [
              {
                text: 'caniuse',
                link: '/note/vuepress-plugin/caniuse/',
                icon: 'tabler:brand-css3',
              },
              {
                text: 'netlify-functions',
                link: '/note/vuepress-plugin/netlify-functions/',
                icon: 'teenyicons:netlify-outline',
              },
            ],
          },
        ],
      },
      { text: '友情链接', link: '/friends/', icon: 'emojione-monotone:roller-coaster' },
    ],
    footer: {
      copyright: 'Copyright © 2022-present pengzhanbo',
    },
    themePlugins: {
      markdownEnhance: { katex: true },
      search: {
        locales: {
          '/': {
            placeholder: '搜索',
          },
        },
      },
    },
    locales: {
      '/': { selectLanguageName: '简体中文', selectLanguageText: '选择语言' },
      '/en/': {
        selectLanguageName: 'English',
        selectLanguageText: 'Language',
        notes: enNotes,
        navbar: [
          { text: 'Home', link: '/en/', icon: 'material-symbols:home-outline' },
          {
            text: 'Blog',
            link: '/en/blog/',
            icon: 'material-symbols:article-outline',
          },
          {
            text: 'VuePress',
            icon: 'vscode-icons:file-type-vue',
            items: [
              {
                text: 'Plugin',
                icon: 'mingcute:plugin-2-line',
                items: [
                  {
                    text: 'caniuse',
                    link: '/en/note/vuepress-plugin/caniuse/',
                    icon: 'tabler:brand-css3',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  }),
})
