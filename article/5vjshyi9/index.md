---
url: /article/5vjshyi9/index.md
---
近期的这几个版本主要围绕 **实现单独的主题配置文件** ，监听并支持热更新。

## Breaking Changes

以下内置插件被移除：

* 移除 `@vuepress-plume/plugin-blog-data` 插件
* 移除 `@vuepress-plume/plugin-notes-data` 插件
* 移除 `@vuepress-plume/plugin-auto-frontmatter` 插件

以上插件的功能全部移动到 `vuepress-theme-plume` 主题包内部重新实现。原因是，单独的主题配置文件，
在异步加载完配置、以及配置热更新时，需要对这些插件所实现的功能进行重载，为了使流程更加清晰可控，
在主题内重新实现了这些功能，并移除了相关插件。

**但相关的配置项并没有发生变更，因此版本更新后用户无需修改配置。**

## 主要更新

### 新增 主题配置文件

一般我们在使用 `VuePress` 构建站点时，通常会在 `.vuepress/config.js` 中引入主题并进行主题配置：

```ts :no-line-numbers
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 主题配置
  }),
})
```

主题配置 通常会包括 如 导航栏、侧边导航栏、多语言相关等的配置。
当我们启动了 VuePress 服务后，对 `.vuepress/config.js` 的修改会引起 VuePress 服务的重启，
这对于 VuePress 相关的配置而言是合理的行为。

但对于 主题相关的配置而言，大部分的配置更新是没有必要 重启 VuePress 服务的。
特别是当我们频繁的更新主题配置时，还可能引起 VuePress 服务崩溃，
这对于我们在编写站点内容时带来的体验是非常糟糕的。

因此，主题新增了一个 `plume.config.js` 的主题配置文件，将主题配置进行单独的维护。
该配置文件主要用于管理主题配置中与 构建流无关的配置。你对他的任意修改，都将以热更新的方式，
更新主题，并同步到 客户端站点实现无刷新更新，完全避免了 VuePress 服务多次重启的问题。

你可以直接在 VuePress 配置文件的相同目录下直接创建 `plume.config.js` ，主题会自动加载该文件，
也可以使用 `plume.config.ts` 文件，以获取更好的类型提示。

::: code-tabs
@tab .vuepress/config.ts

```ts :no-line-numbers
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme()
})
```

@tab .vuepress/plume.config.ts

```ts :no-line-numbers
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // 主题配置
})
```

:::

### 新增 编译缓存

VuePress 在每次启动时，都需要全量编译所有的 `markdown` 文件，在站点内容比较少，且内容不复杂时，
这一过程不算特别耗时，但是当 站点的内容越来越多，内容越来越复杂时，启动等待的时间就会变得越来越久。

以本主题的文档站点为例，虽然主题文档的内容并不算特别多，但是由于使用了 `shiki` 语法高亮，并支持了
`twoslash` 功能，由于 `twoslash` 需要对代码块进行类型编译，非常耗时，这导致 主题文档站点的启动时间
达到了夸张的 `15s` 以上！

为了缓解这一问题，主题对 `markdown` 文件的编译做了一层缓存，在首次启用 `VuePress` 服务时，主题会
对所有的 `markdown` 文件的编译结果进行缓存，在二次启动时，直接从缓存中读取 `markdown` 文件的编译结果。
且仅在 `markdown` 文件有发生变更时，才会重新编译。

**通过编译缓存，主题文档站点的启动耗时，从 `15s` 降低到了 `1.2s` 左右 ！**

另一方面， markdown 编译过程中耗时较为严重的是对 **代码块** 的编译，特别是 代码块使用了 `twoslash` 时。
主题原来的 `15s` 耗时主要就是由于 `twoslash` 的编译时间过长导致的。

主题同样对 代码块 进行了特殊的缓存处理，只有当 代码块 发生变化时，才会重新编译当前的代码块。

### 新增 autoFrontmatter 配置

在过去的版本，主题会自动为每个 `markdown` 文件添加了 `frontmatter` 配置，用户无法更改这个行为，
但部分用户可能不喜欢这一行为、或者只想给 部分 markdown 文件添加 `frontmatter` 配置、或者 只生成
部分的 `frontmatter` 配置。

为此，主题添加 `autoFrontmatter` 配置，用于控制是否自动为每个 `markdown` 文件添加 `frontmatter` 配置。
包括可以通过 `glob` 模式匹配过滤 `markdown` 文件，控制自动生成哪些 字段。

```ts :no-line-numbers
interface AutoFrontmatterOptions {
  /**
   * glob 匹配，被匹配的文件将会自动生成 frontmatter
   *
   * @default ['**\/*.md']
   */
  include?: string | string[]

  /**
   * glob 匹配，被匹配的文件将不会自动生成 frontmatter
   */
  exclude?: string | string[]

  /**
   * 是否自动生成 permalink
   *
   * @default true
   */
  permalink?: boolean
  /**
   * 是否自动生成 createTime
   *
   * 默认读取 文件创建时间，`createTitme` 比 vuepress 默认的 `date` 时间更精准到秒
   */
  createTime?: boolean
  /**
   * 是否自动生成 title
   *
   * 默认读取文件名作为标题
   */
  title?: boolean
}
```
