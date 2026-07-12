<% if (it.isEN) { %>
/**
 * @see https://theme-plume.vuejs.press/guide/collection/ View documentation for configuration details.
 *
 * Collections configuration file, which is imported in `.vuepress/plume.config.ts`.
 *
 * Please note that you should configure Collections here first, then start vuepress.
 * The theme will, upon starting vuepress, read the Collections configured here and automatically generate permalinks in Markdown files related to the Collections.
 *
 * When the `type` of a collection is `post`, it represents a document list type (i.e., no sidebar navigation, with a document list page).
 * This can be used to implement document collections aggregated as article lists, such as blogs or columns (relatively fragmented content).
 *
 * When the `type` of a collection is `doc`, it represents a document type (i.e., with sidebar navigation).
 * This can be used to implement document collections with sidebar navigation, such as notes, knowledge bases, or documentation (strongly correlated and systematic content).
 * If the sidebar does not appear, please check if your configuration is correct and whether the permalink in the Markdown file
 * starts with the prefix of the corresponding Collection's configured `link`. Whether the sidebar is displayed is determined by
 * matching the prefix of the page link with the prefix of `collection.link`.
 */

/**
 * Configuration items will be intelligently prompted in supported IDEs.
 *
 * - `defineCollections` is a helper function for defining a set of collections.
 * - `defineCollection` is a helper function for defining a single collection configuration.
 *
 * Collection configurations defined using `defineCollection` should be placed inside `defineCollections`.
 */
<% } else { %>
/**
 * @see https://theme-plume.vuejs.press/guide/collection/ 查看文档了解配置详情。
 *
 * Collections 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 *
 * 请注意，你应该先在这里配置好 Collections，然后再启动 vuepress，主题会在启动 vuepress 时，
 * 读取这里配置的 Collections，然后在与 Collection 相关的 Markdown 文件中，自动生成 permalink。
 *
 * collection 的  type 为 `post` 时，表示为 文档列表类型（即没有侧边导航栏，有文档列表页）
 * 可用于实现如 博客、专栏 等以文章列表聚合形式的文档集合 （内容相对碎片化的）
 *
 * collection 的 type 为 `doc` 时，表示为文档类型（即有侧边导航栏）
 * 可用于实现如 笔记、知识库、文档等以侧边导航栏形式的文档集合 （内容强关联、成体系的）
 * 如果发现 侧边栏没有显示，那么请检查你的配置是否正确，以及 Markdown 文件中的 permalink
 * 是否是以对应的 Collection 配置的 link 的前缀开头。 是否展示侧边栏是根据 页面链接 的前缀 与 `collection.link`
 * 的前缀是否匹配来决定。
 */

/**
 * 在受支持的 IDE 中会智能提示配置项。
 *
 * - `defineCollections` 是用于定义 collection 集合的帮助函数
 * - `defineCollection` 是用于定义单个 collection 配置的帮助函数
 *
 * 通过 `defineCollection` 定义的 collection 配置，应该填入 `defineCollections` 中
 */
<% } %>
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

<% if (it.multiLanguage) { %>
<% it.locales.forEach(function (locale) { %>
/* =================== locale: <%= locale.lang %> ======================= */

const <%= locale.prefix %>Blog = defineCollection({
  type: 'post',
  dir: 'blog',
  title: 'Blog',
  link: '/blog/',
})

const <%= locale.prefix %>DemoDoc = defineCollection({
  type: 'doc',
  dir: 'demo',
  linkPrefix: '/demo',
  title: 'Demo',
  sidebar: ['', 'foo', 'bar'],
  // <%=t('Auto-generate sidebar based on file structure', '根据文件结构自动生成侧边栏')%>

  // sidebar: 'auto',
})

export const <%= locale.prefix %>Collections = defineCollections([
  <%= locale.prefix %>Blog,
  <%= locale.prefix %>DemoDoc,
])

<% }) %>
<% } else { %>
const blog = defineCollection({
  type: 'post',
  dir: 'blog',
  title: 'Blog',
  link: '/blog/',
})

const demoDoc = defineCollection({
  type: 'doc',
  dir: 'demo',
  linkPrefix: '/demo',
  title: 'Demo',
  sidebar: ['', 'foo', 'bar'],
  // <%=t('Auto-generate sidebar based on file structure', '根据文件结构自动生成侧边栏')%>

  // sidebar: 'auto',
})

export default defineCollections([
  blog,
  demoDoc,
])
<% } %>
