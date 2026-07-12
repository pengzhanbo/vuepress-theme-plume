<% if (it.isEN) { %>
/**
 * @see https://theme-plume.vuejs.press/config/navigation/ View the documentation for configuration details
 *
 * Navbar configuration file, which is imported in `.vuepress/plume.config.ts`.
 */
<% } else { %>
/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */
<% } %>

import { defineNavbarConfig } from 'vuepress-theme-plume'

<% if (it.multiLanguage) { %>
<% it.locales.forEach(function (locale) { %>
export const <%= locale.prefix %>Navbar = defineNavbarConfig([

  { text: '<% output(locale.isEN ? 'Home' : '首页') %>', link: '<%= locale.path %>' },
  { text: '<% output(locale.isEN ? 'Blog' : '博客') %>', link: '<%= locale.path %>blog/' },
  { text: '<% output(locale.isEN ? 'Tags' : ' 标签') %>', link: '<%= locale.path %>blog/tags/' },
  { text: '<% output(locale.isEN ? 'Archives' : '归档') %>', link: '<%= locale.path %>blog/archives/' },
  {
    text: '<% output(locale.isEN ? 'Notes' : '笔记') %>',
    items: [{ text: '<% output(locale.isEN ? 'Demo' : '示例') %>', link: '<%= locale.path %>demo/README.md' }]
  },
])
<% }) %>
<% } else { %>
export default defineNavbarConfig([
  { text: '<% output(it.isEN ? 'Home' : '首页') %>', link: '/' },
  { text: '<% output(it.isEN ? 'Blog' : '博客') %>', link: '/blog/' },
  { text: '<% output(it.isEN ? 'Tags' : ' 标签') %>', link: '/blog/tags/' },
  { text: '<% output(it.isEN ? 'Archives' : '归档') %>', link: '/blog/archives/' },
  {
    text: '<% output(it.isEN ? 'Notes' : '笔记') %>',
    items: [{ text: '<% output(it.isEN ? 'Demo' : ' 示例') %>', link: '/demo/README.md' }]
  },
])
<% } %>
