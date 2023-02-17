import * as path from 'path'
import themePlume from '@vuepress-plume/vuepress-theme-plume'
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { defineUserConfig } from '@vuepress/cli'
import notes from './notes.js'

export default defineUserConfig({
  base: '/',
  lang: 'zh',
  title: 'Plume Theme',
  description: '',
  source: path.resolve(__dirname, '../'),
  public: path.resolve(__dirname, 'public'),

  bundler:
    process.env.DOCS_BUNDLER === 'webpack' ? webpackBundler() : viteBundler(),

  theme: themePlume({
    logo: 'https://pengzhanbo.cn/g.gif',
    hostname: 'https://pengzhanbo.cn',
    appearance: true,
    avatar: {
      url: '/images/blogger.jpg',
      name: 'Plume Theme',
      description: 'The Theme for Vuepress 2.0',
    },
    social: [{ icon: 'github', link: 'https://github.com/pengzhanbo' }],
    notes,
    navbar: [
      { text: 'Home', link: '/', icon: 'material-symbols:home-outline' },
      {
        text: 'Blog',
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
            text: 'Plugin',
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
    ],
    footer: {
      copyright: 'Copyright © 2022-present pengzhanbo',
    },
    themePlugins: {
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
