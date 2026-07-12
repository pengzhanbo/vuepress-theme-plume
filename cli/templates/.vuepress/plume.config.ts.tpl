<% if (it.isEN) { %>
/**
 * See the following documentation for theme configuration
 * - @see https://theme-plume.vuejs.press/config/intro/ Configuration instructions
 * - @see https://theme-plume.vuejs.press/config/theme/ Theme configuration items
 *
 * Please note that modifications to this file will not restart the vuepress service, but will take effect through hot updates.
 * However, some configuration items do not support hot updates; please refer to the documentation for details.
 * For configuration items that do not support hot updates, please configure them in the `.vuepress/config.ts` file.
 *
 * In particular, do not duplicate the same configuration items in both configuration files. The configuration items in this file will override those in the `.vuepress/config.ts` file.
 */
<% } else { %>
/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/ 配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/ 主题配置项
 *
 * 请注意，对此文件的修改不会重启 vuepress 服务，而是通过热更新的方式生效
 * 但同时部分配置项不支持热更新，请查看文档说明
 * 对于不支持热更新的配置项，请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会覆盖 `.vuepress/config.ts` 文件中的配置
 */
<% } %>

import { defineThemeConfig } from 'vuepress-theme-plume'
<% if (it.multiLanguage) { %>
import { enCollections, zhCollections } from './collections'
import { enNavbar, zhNavbar } from './navbar'
<% } else { %>
import collections from './collections'
import navbar from './navbar'
<% } %>

/**
 * @see https://theme-plume.vuejs.press/config/theme/
 */
export default defineThemeConfig({
  logo: 'https://theme-plume.vuejs.press/plume.png',

  social: [
    { icon: 'github', link: '/' },
  ],

<% if (!it.multiLanguage) { %>
  /**
   * @see https://theme-plume.vuejs.press/config/theme/#profile
   */
  profile: {
    avatar: 'https://theme-plume.vuejs.press/plume.png',
    name: '<%= it.siteName %>',
    description: '<%= it.siteDescription %>',
  },

  navbar,
  collections,

<% } %>
<% if (it.multiLanguage) { %>
  locales: {
<% it.locales.forEach(function (locale) {%>
    '<%= locale.path %>': {
      /**
       * @see https://theme-plume.vuejs.press/config/theme/#profile
       */
      profile: {
        avatar: 'https://theme-plume.vuejs.press/plume.png',
        name: '<%= it.siteName %>',
        description: '<%= it.siteDescription %>',
      },

      navbar: <%= locale.prefix %>Navbar,
      collections: <%= locale.prefix %>Collections,
    },
<% }) %>
  },
<% } %>
})
