import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  { text: '404', link: '/404/' },
  { text: '笔记', link: '/notes/demo/README.md' },
])
