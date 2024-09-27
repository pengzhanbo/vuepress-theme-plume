import type { NavItem } from 'vuepress-theme-plume'
import { version } from '../../package.json'

export const zhNavbar = [
  {
    text: '指南',
    icon: 'icon-park-outline:guide-board',
    // link: '/guide/intro/',
    link: '/notes/theme/guide/介绍.md',
    activeMatch: '^/guide/',
  },
  {
    text: '配置',
    icon: 'icon-park-outline:setting-two',
    // link: '/config/intro/',
    link: '/notes/theme/config/配置说明.md',
    activeMatch: '^/config/',
  },
  // {
  //   text: '插件',
  //   icon: 'clarity:plugin-line',
  //   // link: '/plugins/',
  //   link: '/notes/plugins/README.md',
  //   activeMatch: '^/plugins/',
  // },
  {
    text: '博客',
    link: '/blog/',
    icon: 'material-symbols:article-outline',
    activeMatch: '^/(blog|article)/',
  },
  {
    text: '案例',
    link: '/demos/',
    icon: 'map:wind-surfing',
  },
  {
    text: '更多',
    icon: 'icon-park-outline:more-three',
    items: [
      { text: '常见问题', link: '/faq/', icon: 'wpf:faq' },
      { text: '喝杯奶茶', link: '/sponsor/', icon: 'line-md:coffee-loop' },
      { text: '主题工具', link: '/tools/', icon: 'jam:tools' },
      { text: '友情链接', link: '/friends/', icon: 'carbon:friendship' },
      {
        text: 'Vuepress',
        icon: 'logos:vue',
        items: [
          { text: '官方文档', link: 'https://v2.vuepress.vuejs.org', icon: 'logos:vue' },
          { text: '生态系统', link: 'https://ecosystem.vuejs.press/', icon: 'logos:vue' },
        ],
      },
    ],
  },
  {
    text: `${version}`,
    icon: 'codicon:versions',
    items: [
      { text: '更新日志', link: '/changelog/' },
      { text: '参与贡献', link: '/contributing/' },
    ],
  },
] as NavItem[]

export const enNavbar = [
  {
    text: 'Guide',
    icon: 'icon-park-outline:guide-board',
    link: '/en/guide/intro/',
    activeMatch: '^/en/guide/',
  },
  {
    text: 'Config',
    icon: 'icon-park-outline:setting-two',
    link: '/en/config/intro/',
    activeMatch: '^/en/config/',
  },
  {
    text: 'Blog',
    link: '/en/blog/',
    icon: 'material-symbols:article-outline',
    activeMatch: '^/en/(blog|article)/',
  },
  {
    text: 'More',
    icon: 'icon-park-outline:more-three',
    items: [
      {
        text: 'Vuepress',
        items: [
          { text: 'Official Docs', link: 'https://v2.vuepress.vuejs.org' },
          { text: 'Ecosystem', link: 'https://ecosystem.vuejs.press/' },
        ],
      },
    ],
  },
  {
    text: `${version}`,
    icon: 'codicon:versions',
    items: [
      { text: 'Changelog', link: '/changelog/' },
      { text: 'Contributing', link: '/contributing/' },
    ],
  },
] as NavItem[]
