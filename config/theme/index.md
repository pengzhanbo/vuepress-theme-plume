---
url: /config/theme/index.md
---
## 概述

主题配置用于定制主题的各项功能，以控制主题的行为，
您可以在 `.vuepress/config.ts` 或者 `.vuepress/plume.config.ts` 中进行配置。

当字段说明包含以下声明时，表示该字段不支持在 `.vuepress/plume.config.ts` 中进行配置：

::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
:::

无以上声明的字段，您可以在 `.vuepress/config.ts` 或者 `.vuepress/plume.config.ts` 的任意一个文件中进行配置，一般情况下建议在 `.vuepress/plume.config.ts` 中进行配置。

::: warning 已经在一个配置文件中进行配置的字段，尽量不要在另一个配置文件中重复配置
:::

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 主题配置
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // 主题配置
})
```

:::

## 基础配置

### configFile

* **类型：** `string`
* **默认值：** `''`
* **详情：**

  自定义主题配置文件的路径。

  查看 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 了解更多。

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### plugins

* **类型：**`PlumeThemePluginOptions`
* **默认值：** `{}`
* **详情：**

  对主题内部使用的插件进行自定义配置。

  主题使用的插件默认已进行了配置，大多数情况下您不需要进行修改，如果需要使用到细致的定制化，请查阅
  [此文档](./plugins/README.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### markdown&#x20;

* **类型：** `MarkdownOptions`
* **默认值：** `{}`
* **详情：**

  Markdown 功能配置， 参考 [此文档](./markdown.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### codeHighlighter&#x20;

* **类型：** `false | ShikiPluginOptions`
* **默认值：** `{}`
* **详情：**

  代码高亮配置， 参考 [此文档](../guide/code/intro.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### search&#x20;

* **类型：** `false | SearchOptions`
* **默认值：** `{ provider: 'local' }`
* **详情：**

  搜索配置， 参考 [此文档](../guide/features/search.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### comment&#x20;

* **类型：** `false | CommentPluginOptions`
* **默认值：** `false`
* **详情：**

  评论配置， 参考 [此文档](../guide/features/comments.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### watermark&#x20;

* **类型：** `false | WatermarkPluginOptions`
* **默认值：** `false`
* **详情：**

  水印配置， 参考 [此文档](../guide/features/watermark.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### readingTime&#x20;

* **类型：** `false | ReadingTimePluginOptions`
* **默认值：** `false`
* **详情：**

  阅读时长配置， 参考 [此文档](./plugins/reading-time.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### copyCode&#x20;

* **类型：** `false | CopyCodePluginOptions`
* **默认值：** `{}`
* **详情：**

  复制代码配置， 参考 [此文档](../guide/code/copy-code.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### replaceAssets&#x20;

* **类型：** `false | ReplaceAssetsPluginOptions`
* **默认值：** `false`
* **详情：**

  替换资源配置， 参考 [此文档](../guide/features/replace-assets.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### hostname

* **类型：** `string`
* **默认值：** `''`
* **详情：**

  部署站点域名。

  当 `hostname` 配置为有效域名时，主题将会生成 `sitemap` 和 `seo` 相关的内容。

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### autoFrontmatter

* **类型：** `false | AutoFrontmatterOptions`
* **详情：**

  是否为 markdown 文件自动添加 frontmatter 配置

  ```ts
  interface AutoFrontmatterOptions {
    /**
     * 是否自动生成 permalink
     *
     * @default true
     * - true: 自动生成 permalink
     * - false: 不生成 permalink
     * - 'filepath': 根据文件路径生成 permalink
     */
    permalink?: boolean | 'filepath'

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

### cache

* **类型：** `false | 'memory' | 'filesystem'`
* **默认值：** `filesystem`
* **详情：**

  是否启用 编译缓存，或配置缓存方式

  此配置项用于解决 VuePress 启动速度慢的问题，在首次启动服务时，对编译结果进行缓存，二次启动时
  直接读取缓存，跳过编译，从而加快启动速度。

  * `false`：禁用 缓存
  * `'memory'`：使用内存缓存，此方式可获得更快的启动速度，但随着项目文件数量增加，内存占用会增加，
    适合文章数量较少的项目使用
  * `'filesystem'`：使用文件系统缓存，此方式可获得相对快且稳定的启动速度，更适合内容多的项目使用

  ::: warning
  该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。

  为了使缓存能够生效，您应该 **删除** `package.json` 中 `vuepress dev` 开发服务启动脚本中的 `--clean-cache` 参数。
  :::

### docsRepo

* **类型：** `string`
* **默认值：** `''`
* **详情：** 文档仓库配置, 用于生成 `Edit this page` 链接。

### docsBranch

* **类型：** `string`
* **默认值：** `''`
* **详情：** 文档仓库分支配置，用于生成 `Edit this page` 链接。

### docsDir

* **类型：** `string`
* **默认值：** `''`
* **详情：** 文档仓库目录配置，用于生成 `Edit this page` 链接。

### editLink

* **类型：** `boolean`
* **默认值：** `true`
* **详情：** 是否启用 编辑链接

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### lastUpdated

* **类型：** `false | LastUpdatedOptions`
* **默认值：** `{ formatOptions: { dateStyle: 'short', timeStyle: 'short' } }`
* **详情：** 最后更新时间

```ts
interface LastUpdatedOptions {

  /**
   * 设置最后更新时间格式的选项。
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @default
   * { dateStyle: 'short', timeStyle: 'short' }
   */
  formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean }
}
```

::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
:::

### contributors

* **类型：** `boolean | ContributorsOptions`
* **默认值：** `true`
* **详情：** 是否显示贡献者

  更多配置请参考 [此文档](../guide/features/contributors.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### changelog

* **类型：** `boolean | ChangelogOptions`
* **默认值：** `false`
* **详情：** 是否显示页面变更历史

  更多配置请参考 [此文档](../guide/features/changelog.md)

  ::: warning 该字段不支持在 [主题配置文件 `plume.config.ts`](./intro.md#主题配置文件) 中进行配置。
  :::

### locales

* **类型：** `Record<string, ThemeLocaleData>`
* **默认值：** `{}`
* **详情：** 多语言配置

不同语言的文本配置，参考 [此文档](./locales.md)

多语言配置支持以下 [Locale](#locale-配置) 所有配置选项以控制不同语言下的主题行为。

## Locale 配置

::: tip 以下所有字段也均是基础配置字段，可以与 `locales` 等字段平级配置。
:::

### home

* **类型：** `false | string`
* **默认值：** `/`
* **详情：**
  首页的路径， 它将被用于：
  * 导航栏中 logo的链接；
  * 404页面的 *返回首页* 的链接；

### logo

* 类型: `false | string`
* **默认值：** `false`
* **详情：** 导航栏中的logo。

### logoDark

* 类型 `false | string`
* **默认值：** `false`
* **详情：** Dark模式下，导航栏中的logo。

### appearance

* **类型：** `boolean | 'dark' | 'force-dark`
* **默认值：** `true`

是否启用 深色模式。

* 如果该选项设置为 `true`，则默认主题将由用户的首选配色方案决定。
* 如果该选项设置为 `dark`，则默认情况下主题将是深色的，除非用户手动切换它。
* 如果该选项设置为 `false`，用户将无法切换主题。
* 如果该选项设置为 `force-dark`，则用户将无法切换主题，但会强制将主题更改为深色。

此选项注入一个内联脚本，从本地存储恢复用户设置。这确保在呈现页面之前应用 `[data-theme="dark"]` 以避免闪烁。

### profile

* 类型: `ProfileOptions`
* 默认值: `undefined`

配置博主个人资料，显示在博客右侧侧边栏。

```ts title=".vuepress/plume.config.ts"
import { definePlumeThemeConfig } from 'vuepress-theme-plume'

export default definePlumeThemeConfig({
  profile: {
    avatar: '/avatar.png',
    name: 'Your Name',
    description: 'Your description',
    circle: true,
    location: 'Hangzhou, China',
    organization: 'Your Company',
    layout: 'right',
  },
})
```

### avatar

* 类型: `string`
* 默认值: `undefined`

头像图片链接，支持本地路径或网络地址。

#### name

* 类型: `string`
* 默认值: `undefined`

博主名称，显示在头像下方。

#### description

* 类型: `string`
* 默认值: `undefined`

个人描述或签名，显示在名称下方。

#### circle

* 类型: `boolean`
* 默认值: `false`

是否以圆形裁剪显示头像。

#### location

* 类型: `string`
* 默认值: `undefined`

地理位置信息，显示在个人资料中。

#### organization

* 类型: `string`
* 默认值: `undefined`

组织或公司信息，显示在个人资料中。

#### layout

* 类型: `'left' | 'right'`
* 默认值: `'right'`

个人资料的布局位置。`right` 显示在右侧侧边栏，`left` 显示在左侧侧边栏。

### social

* 类型: `SocialLink[]`
* 默认值: `[]`

配置社交账号链接，显示在个人资料区域。支持 30+ 内置图标（如 `github`、`twitter`、`discord`、`weibo`、`bilibili`、`zhihu` 等），也支持自定义 SVG 图标。

```ts title=".vuepress/plume.config.ts"
import { definePlumeThemeConfig } from 'vuepress-theme-plume'

export default definePlumeThemeConfig({
  social: [
    { icon: 'github', link: 'https://github.com/your-username' },
    { icon: 'twitter', link: 'https://twitter.com/your-username' },
    { icon: 'weibo', link: 'https://weibo.com/your-username' },
    // 自定义 SVG 图标
    { icon: { svg: '<svg>...</svg>', name: 'custom' }, link: 'https://example.com' },
  ],
})
```

#### icon

* 类型: `string | { svg: string, name?: string }`
* 必填

社交图标。可以是内置图标名称（如 `github`、`twitter`、`discord`、`facebook`、`instagram`、`linkedin`、`mastodon`、`npm`、`slack`、`youtube`、`qq`、`weibo`、`bilibili`、`gitlab`、`docker`、`juejin`、`zhihu`、`douban`、`steam`、`stackoverflow`、`xbox`、`tiktok`、`kuaishou`、`bytedance`、`xiaohongshu`、`bluesky`、`gmail` 等），也可以是包含 `svg` 和可选 `name` 的自定义图标对象。

#### link

* 类型: `string`
* 必填

社交链接地址。

#### ariaLabel

* 类型: `string`
* 默认值: `undefined`

无障碍标签，用于屏幕阅读器读取。未设置时将根据图标名称自动生成。

### navbarSocialInclude

* 类型: `string[]`
* 默认值: `['github', 'twitter', 'discord', 'facebook']`

控制哪些社交链接同时显示在导航栏中。仅 `social` 中配置的且 `icon` 在此列表中的社交链接会显示在导航栏右侧。

```ts title=".vuepress/plume.config.ts"
import { definePlumeThemeConfig } from 'vuepress-theme-plume'

export default definePlumeThemeConfig({
  social: [
    { icon: 'github', link: 'https://github.com/your-username' },
    { icon: 'twitter', link: 'https://twitter.com/your-username' },
    { icon: 'weibo', link: 'https://weibo.com/your-username' },
  ],
  navbarSocialInclude: ['github', 'weibo'], // 只有 github 和 weibo 显示在导航栏
})
```

### navbar

* **类型：** `NavItem[]`
* **默认值：** `[]`
* **详情：** 导航栏配置。

  为了配置导航栏元素，你可以将其设置为 导航栏数组 ，其中的每个元素是 `string` 或 `NavItem` 对象

  * `NavItem` 对象应该有一个 text 字段和一个 link 字段，还有一个可选的 `activeMatch` 字段。
  * `string` 表示是一个页面文件路径，或者是一个页面的访问路径。

```ts
type NavItem = string | {
  text: string
  link: string

  /**
   * 当前分组的页面前缀
   */
  prefix?: string
  /**
   * 该分组下的导航项
   */
  items?: NavItem[]
  /**
   * 支持 iconify 图标，直接使用 iconify name 即可自动加载
   *
   * @see https://icon-sets.iconify.design/
   */
  icon: string
  /**
   * 控制元素何时被激活
   */
  activeMatch?: string
}
```

* 示例1：

  ```js
  export default defineUserConfig({
    theme: plumeTheme({
      navbar: [
        // NavbarItem
        { text: 'Foo', link: '/foo/' },
        // NavbarGroup
        {
          text: 'Group',
          prefix: '/group/',
          items: ['foo/', 'bar/'],
        },
        // 字符串 - 页面文件路径
        '/bar', // 可以直接省略后缀 `.md`
      ],
    }),
  })
  ```

* 示例2：

  ```js
  export default defineUserConfig({
    theme: plumeTheme({
      navbar: [
        // 嵌套 Group - 最大深度为 2
        {
          text: 'Group',
          items: [
            {
              text: 'SubGroup',
              items: ['/group/sub/', '/group/sub/bar/'],
            },
          ],
        },
        // 控制元素何时被激活
        {
          text: 'Group 2',
          items: [
            {
              text: 'Always active',
              link: '/',
              // 该元素将一直处于激活状态
              activeMatch: '/',
            },
            {
              text: 'Active on /foo/',
              link: '/not-foo/',
              // 该元素在当前路由路径是 /foo/ 开头时激活
              // 支持正则表达式
              activeMatch: '^/foo/',
            },
          ],
        },
      ],
    }),
  })
  ```

### collections

* **类型：** `ThemeCollectionItem[]`

* **默认值：** `[]`

* **详情：** 文档集合配置

  [查看 **集合指南**](../guide/quick-start/collection.md){.read-more}

  [查看 **集合配置** 了解更多](./collections.md){.read-more}

### sidebar

* **类型：** `false | SidebarMulti`

* **详情：**

  侧边栏配置。**主题更推荐在 [collections 配置](./collections.md) 中进行侧边栏配置。**

  配置对象的 `key` 为侧边栏公共访问路径前缀。

  对于 `value`:

  * `'auto'` 表示自动根据目录结构生成侧边栏
  * `string` 表示侧边栏对应的页面文件路径
  * `SidebarItem` 表示侧边栏单项配置

```ts
type ThemeIcon = string | { svg: string }

type SidebarMulti = Record<
  string,
  | 'auto'
  | (string | SidebarItem)[]
  | { items: 'auto' | (string | SidebarItem)[], prefix?: string }
>
interface SidebarItem {
  /**
   * 侧边栏文本
   */
  text?: string

  /**
   * 侧边栏链接
   */
  link?: string

  /**
   * 侧边栏图标
   */
  icon?: ThemeIcon

  /**
   * 次级侧边栏分组
   */
  items?: 'auto' | (string | SidebarItem)[]

  /**
   * 如果未指定，组不可折叠。
   * 如果为`true`，组可折叠，并默认折叠。
   * 如果为`false`，组可折叠，但默认展开。
   */
  collapsed?: boolean

  /**
   * 当前分组的链接前缀
   */
  prefix?: string

  rel?: string
  target?: string
}
```

### sidebarScrollbar

* **类型：** `boolean`
* **默认值：** `true`
* **详情：** 是否显示侧边栏滚动条

  设置为 `false` 时，仅隐藏滚动条，但不改变滚动行为。

### aside

* **类型：** `boolean | 'left'`
* **默认值：** `true`
* **详情：**

  是否显示侧边栏

  * `false` 表示禁用 右侧边栏
  * `true` 表示启用 右侧边栏
  * `'left` 表示将有侧边栏移动到文章内容左侧，sidebar 右侧

  每个页面可以通过 [frontmatter aside](./frontmatter/basic.md#aside) 覆盖层级配置。

### outline

* **类型：** `false | number | [number, number] | 'deep'`
* **默认值：** `[2, 3]`
* **详情：**

  要显示的标题级别。

  单个数字表示只显示该级别的标题。

  如果传递的是一个元组，第一个数字是最小级别，第二个数字是最大级别。

  `'deep'` 与 `[2, 6]` 相同，将显示从 `<h2>` 到 `<h6>` 的所有标题。

  当 [aside](#aside) 被禁用时，`outline` 也会被禁用

  每个页面可以通过 [frontmatter outline](./frontmatter/basic.md#outline) 覆盖层级配置。

### transition

* 类型: `boolean | TransitionOptions`
* 默认值: `true`

是否启用过渡动画效果。设置为 `false` 可完全禁用所有过渡动画。传入对象可分别控制各类动画。

```ts title=".vuepress/plume.config.ts"
import { definePlumeThemeConfig } from 'vuepress-theme-plume'

export default definePlumeThemeConfig({
  transition: {
    page: true,
    postList: true,
    appearance: 'fade',
  },
})
```

### page

* 类型: `boolean`
* 默认值: `true`

是否启用页面跳转时的过渡动画。

### postList

* 类型: `boolean`
* 默认值: `true`

是否启用文章列表的过渡动画。

### appearance

* 类型: `'fade' | 'circle-clip' | 'horizontal-clip' | 'vertical-clip' | 'skew-clip' | 'blinds-vertical' | 'blinds-horizontal' | 'soft-blur-fade' | 'diamond-reveal'`
* 默认值: `'fade'`

深色/浅色模式切换时的过渡动画类型。支持以下 9 种动画效果：

* `fade`：淡入淡出（默认）
* `circle-clip`：圆形裁剪
* `horizontal-clip`：水平裁剪
* `vertical-clip`：垂直裁剪
* `skew-clip`：倾斜裁剪
* `blinds-vertical`：垂直百叶窗
* `blinds-horizontal`：水平百叶窗
* `soft-blur-fade`：柔和模糊淡出
* `diamond-reveal`：菱形揭示

### footer

* **类型：** `false | { message: string; copyright: string }`
* **默认值：** `false`
* **详情：** 页脚配置。

### bulletin

* **类型：** `boolean | BulletinOptions`
* **默认值：** `false`
* **详情：** 公告板配置

  详情请参考 [公告板](../guide/features/bulletin.md)

### editLinkPattern

* **类型：** `string`
* **默认值：** `''`
* **详情：** 编辑链接的正则表达式

  示例： `':repo/edit/:branch/:path'`

### copyright

* **类型：** `boolean | CopyrightLicense | CopyrightOptions`
* **默认值：** `false`
* **详情：** 版权配置

  详情请参考 [版权所有](../guide/features/copyright.md)

### prevPage

* **类型：** `boolean`
* **默认值：** `true`
* **详情：** 是否显示上一页

### nextPage

* **类型：** `boolean`
* **默认值：** `true`
* **详情：** 是否显示下一页

### createTime

* **类型：** `boolean | 'only-posts'`
* **默认值：** `true`
* **详情：** 是否显示创建时间

  * `false` - 不显示
  * `'only-posts'` - 只显示在文章列表页面
  * `true` - 显示在所有文章页面
