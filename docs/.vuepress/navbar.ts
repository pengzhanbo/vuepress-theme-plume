import type { NavItem } from 'vuepress-theme-plume'

export const zhNavbar = [
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
] as NavItem[]

export const enNavbar = [
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
] as NavItem[]
