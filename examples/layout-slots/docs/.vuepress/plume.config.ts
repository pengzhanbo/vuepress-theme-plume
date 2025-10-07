import { defineThemeConfig } from 'vuepress-theme-plume'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: 'https://theme-plume.vuejs.press/plume.png',

  appearance: true, // 配置 深色模式

  social: [
    { icon: 'github', link: '/' },
  ],

  /**
   * @see https://theme-plume.vuejs.press/config/basic/#profile
   */
  profile: {
    avatar: 'https://theme-plume.vuejs.press/plume.png',
    name: 'VuePress Plume',
    description: 'vuepress-theme-plume',
    // circle: true,
    // location: '',
    // organization: '',
  },

  navbar: [
    { text: '首页', link: '/' },
    { text: '博客', link: '/blog/' },
    { text: '404', link: '/404/' },
    { text: '笔记', link: '/demo/README.md' },
  ],
  collections: [
    { type: 'post', dir: 'blog', title: '博客' },
    {
      type: 'doc',
      dir: 'demo',
      linkPrefix: '/demo/',
      title: '笔记',
      sidebar: ['', 'foo', 'bar'],
    },
  ],
})
