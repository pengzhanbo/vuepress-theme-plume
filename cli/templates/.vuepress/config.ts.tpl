<% if (it.isEN) { %>
/**
 * View the following documentation for theme configuration
 * - @see https://theme-plume.vuejs.press/config/intro/ Configuration guide
 * - @see https://theme-plume.vuejs.press/config/theme/ Theme configuration items
 *
 * Please note that modifications to this file will restart the vuepress service.
 * Some configuration updates do not require restarting the vuepress service. It is recommended to configure them in the `.vuepress/config.ts` file.
 *
 * In particular, do not duplicate the same configuration items in both configuration files, as the configuration items in the current file will be overwritten.
 */
<% } else { %>
/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/ 配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/ 主题配置项
 *
 * 请注意，对此文件的修改都会重启 vuepress 服务。
 * 部分配置项的更新没有必要重启 vuepress 服务，建议请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会被覆盖
 */
<% } %>

import { <%= it.bundler %>Bundler } from '@vuepress/bundler-<%= it.bundler %>'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  base: '/',
  lang: '<%= it.defaultLanguage %>',
<% if (it.multiLanguage) { %>
  locales: {
<% it.locales.forEach(function (locale) {%>
    '<%= locale.path %>': {
      title: '<%= it.siteName %>',
      lang: '<%= locale.lang %>',
      description: '<%= it.siteDescription %>',
    },
<% }) %>
  },
<%  } else { %>
  title: '<%= it.siteName %>',
  description: '<%= it.siteDescription %>',
<% } %>

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'https://theme-plume.vuejs.press/favicon-32x32.png' }],
  ],

  bundler: <%= it.bundler %>Bundler(),
  shouldPrefetch: false,

  theme: plumeTheme(),
})
