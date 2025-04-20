import { h } from 'vue'
import { Layout, NotFound } from 'vuepress-theme-plume/client'
import { defineClientConfig } from 'vuepress/client'
import SlotDemo from './theme/components/SlotDemo.vue'

import './theme/styles/custom.css'

export default defineClientConfig({
  layouts: {
    Layout: () => h(Layout, null, {
      'layout-top': () => h(SlotDemo, { name: 'layout-top' }),
      'layout-bottom': () => h(SlotDemo, { name: 'layout-bottom' }),

      'nav-bar-title-before': () => h(SlotDemo, { name: 'nav-bar-title-before', w: 64, h: 44, small: true }),
      'nav-bar-title-after': () => h(SlotDemo, { name: 'nav-bar-title-after', w: 64, h: 44, small: true }),
      'nav-bar-content-before': () => h(SlotDemo, { name: 'nav-bar-content-before', h: 44, small: true }),
      'nav-bar-content-after': () => h(SlotDemo, { name: 'nav-bar-content-after', h: 44, small: true }),
      'nav-bar-menu-before': () => h(SlotDemo, { name: 'nav-bar-menu-before', h: 44, small: true }),
      'nav-bar-menu-after': () => h(SlotDemo, { name: 'nav-bar-menu-after', h: 44, small: true }),
      'nav-screen-content-before': () => h(SlotDemo, { name: 'nav-screen-content-before', h: 44, small: true }),
      'nav-screen-content-after': () => h(SlotDemo, { name: 'nav-screen-content-after', h: 44, small: true }),
      'nav-screen-menu-before': () => h(SlotDemo, { name: 'nav-screen-menu-before', h: 44, small: true }),
      'nav-screen-menu-after': () => h(SlotDemo, { name: 'nav-screen-menu-after', h: 44, small: true }),

      'footer-content': () => h(SlotDemo, { name: 'footer-content' }),
      'bulletin-content': () => h(SlotDemo, { name: 'bulletin-content' }),

      'doc-top': () => h(SlotDemo, { name: 'doc-top' }),
      'doc-bottom': () => h(SlotDemo, { name: 'doc-bottom' }),
      'doc-footer-before': () => h(SlotDemo, { name: 'doc-footer-before' }),
      'doc-before': () => h(SlotDemo, { name: 'doc-before', mt: 16 }),
      'doc-after': () => h(SlotDemo, { name: 'doc-after' }),
      'doc-meta-before': () => h(SlotDemo, { name: 'doc-meta-before', h: 24 }),
      'doc-meta-after': () => h(SlotDemo, { name: 'doc-meta-after', h: 24 }),
      'doc-meta-top': () => h(SlotDemo, { name: 'doc-meta-top' }),
      'doc-meta-bottom': () => h(SlotDemo, { name: 'doc-meta-bottom' }),

      'sidebar-nav-before': () => h(SlotDemo, { name: 'sidebar-nav-before' }),
      'sidebar-nav-after': () => h(SlotDemo, { name: 'sidebar-nav-after' }),
      'aside-top': () => h(SlotDemo, { name: 'aside-top' }),
      'aside-bottom': () => h(SlotDemo, { name: 'aside-bottom' }),
      'aside-outline-before': () => h(SlotDemo, { name: 'aside-outline-before', mt: 16 }),
      'aside-outline-after': () => h(SlotDemo, { name: 'aside-outline-after' }),

      'page-top': () => h(SlotDemo, { name: 'page-top' }),
      'page-bottom': () => h(SlotDemo, { name: 'page-bottom' }),

      'blog-top': () => h(SlotDemo, { name: 'blog-top' }),
      'blog-bottom': () => h(SlotDemo, { name: 'blog-bottom', mt: 16 }),
      'blog-aside-top': () => h(SlotDemo, { name: 'blog-aside-top', h: 44, mt: 16 }),
      'blog-aside-bottom': () => h(SlotDemo, { name: 'blog-aside-bottom', h: 44 }),
      'blog-extract-before': () => h(SlotDemo, { name: 'blog-extract-before' }),
      'blog-extract-after': () => h(SlotDemo, { name: 'blog-extract-after' }),
      'blog-post-list-before': () => h(SlotDemo, { name: 'blog-post-list-before', mt: 16 }),
      'blog-post-list-after': () => h(SlotDemo, { name: 'blog-post-list-after' }),
      'blog-post-list-pagination-after': () => h(SlotDemo, {
        name: 'blog-post-list-pagination-after',
      }),
      'blog-tags-before': () => h(SlotDemo, { name: 'blog-tags-before', mt: 16 }),
      'blog-tags-after': () => h(SlotDemo, { name: 'blog-tags-after', mt: 16 }),
      'blog-tags-content-before': () => h(SlotDemo, { name: 'blog-tags-content-before', mt: 16 }),
      'blog-tags-title-after': () => h(SlotDemo, { name: 'blog-tags-title-after' }),
      'blog-archives-before': () => h(SlotDemo, { name: 'blog-archives-before', mt: 16 }),
      'blog-archives-after': () => h(SlotDemo, { name: 'blog-archives-after' }),
      'blog-categories-before': () => h(SlotDemo, { name: 'blog-categories-before' }),
      'blog-categories-content-before': () => h(SlotDemo, { name: 'blog-categories-content-before' }),
      'blog-categories-after': () => h(SlotDemo, { name: 'blog-categories-after' }),
    }),
    NotFound: () => h(NotFound, null, {
      'layout-top': () => h(SlotDemo, { name: 'layout-top' }),
      'layout-bottom': () => h(SlotDemo, { name: 'layout-bottom' }),

      'nav-bar-title-before': () => h(SlotDemo, { name: 'nav-bar-title-before', w: 64, h: 44, small: true }),
      'nav-bar-title-after': () => h(SlotDemo, { name: 'nav-bar-title-after', w: 64, h: 44, small: true }),
      'nav-bar-content-before': () => h(SlotDemo, { name: 'nav-bar-content-before', h: 44, small: true }),
      'nav-bar-content-after': () => h(SlotDemo, { name: 'nav-bar-content-after', h: 44, small: true }),
      'nav-bar-menu-before': () => h(SlotDemo, { name: 'nav-bar-menu-before', h: 44, small: true }),
      'nav-bar-menu-after': () => h(SlotDemo, { name: 'nav-bar-menu-after', h: 44, small: true }),
      'nav-screen-content-before': () => h(SlotDemo, { name: 'nav-screen-content-before', h: 44, small: true }),
      'nav-screen-content-after': () => h(SlotDemo, { name: 'nav-screen-content-after', h: 44, small: true }),
      'nav-screen-menu-before': () => h(SlotDemo, { name: 'nav-screen-menu-before', h: 44, small: true }),
      'nav-screen-menu-after': () => h(SlotDemo, { name: 'nav-screen-menu-after', h: 44, small: true }),

      'footer-content': () => h(SlotDemo, { name: 'footer-content' }),

      'not-found': () => h(SlotDemo, { name: 'not-found' }),
    }),
  },
})
