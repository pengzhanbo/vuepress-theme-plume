import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'
import { notes } from './notes'

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

  navbar,
  notes,
})
