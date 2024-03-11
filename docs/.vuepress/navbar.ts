import type { NavItem } from 'vuepress-theme-plume'
import { version } from '../../package.json'

export const zhNavbar = [
  {
    text: '指南',
    icon: 'icon-park-outline:guide-board',
    link: '/guide/intro/',
    activeMatch: '^/guide/',
  },
  {
    text: '配置',
    icon: 'icon-park-outline:setting-two',
    link: '/config/intro/',
    activeMatch: '^/config/',
  },
  {
    text: '博客',
    link: '/blog/',
    icon: 'material-symbols:article-outline',
    activeMatch: '^/(blog|article)/',
  },
  {
    text: '更多',
    icon: 'icon-park-outline:more-three',
    items: [
      {
        text: 'Vuepress',
        items: [
          { text: '官方文档', link: 'https://v2.vuepress.vuejs.org' },
          { text: '生态系统', link: 'https://ecosystem.vuejs.press/' },
        ],
      },
    ],
  },
  {
    text: `${version}`,
    icon: 'codicon:versions',
    items: [
      { text: '更新日志', link: 'https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/CHANGELOG.md' },
      { text: '参与贡献', link: 'https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/CONTRIBUTING.md' },
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
      { text: 'Changelog', link: 'https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/CHANGELOG.md' },
      { text: 'Contributing', link: 'https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/CONTRIBUTING.md' },
    ],
  },
] as NavItem[]
