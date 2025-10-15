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
  },

  navbar: [
    { text: '首页', link: '/' },
    { text: '标签', link: '/tags/' },
    { text: '分类', link: '/categories/' },
    { text: '归档', link: '/archives/' },
  ],
  collections: [
    {
      type: 'post',
      dir: '/', // dir 设置为 `/`，直接指向 docs 目录
      title: '博客',
      postList: false,
      link: '/', // link 设置为 `/`, 其它生成的页面相对于 `/` 拼接，如 `/tags/`
      linkPrefix: '/', // linkPrefix 设置为 `/`, 则文章页面的 permalink 为 `/xxxx/`， xxxx 由 nanoid 生成
      exclude: ['README.md'], // 排除 README.md，避免添加到文章列表中
    },
  ],
})
