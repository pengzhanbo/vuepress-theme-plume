---
url: /guide/collection/post/index.md
---
## 概述

**post 集合**用于管理碎片化的多篇文章集合。这里的"碎片化"指文章间无强关联关系，或仅需扁平化展示的场景，典型应用包括：

* 博客系统
* 专题专栏
* 新闻资讯
* 随笔记录

该集合提供完整的文章管理功能：

* **文章列表页** - 支持置顶、封面图、摘要展示
* **文章分类页** - 基于目录结构自动生成分类
* **文章标签页** - 根据页面 `frontmatter.tags` 生成标签
* **文章归档页** - 基于 `frontmatter.createTime` 生成时间线归档

各页面均预留个人信息展示区域，支持个人简介或组织信息配置。

::: info 主题支持配置多个 post 集合
:::

## 创建 post 集合

通过三个简单步骤即可完成 post 集合创建：

:::: steps

* **创建文章目录**

  ::: file-tree

  * docs
    * ++ blog
      * ++ post-1.md
      * ++ post-2.md
      * ++ …
        :::

* **配置集合参数**

  ::: code-tabs#config

  @tab .vuepress/config.ts

  ```ts twoslash
  import { defineUserConfig } from 'vuepress'
  import { plumeTheme } from 'vuepress-theme-plume'

  export default defineUserConfig({
    theme: plumeTheme({
      collections: [ // [!code focus:3]
        { type: 'post', dir: 'blog', title: '博客' }
      ]
    })
  })
  ```

  @tab .vuepress/plume.config.ts

  ```ts twoslash
  import { defineThemeConfig } from 'vuepress-theme-plume'

  export default defineThemeConfig({
    collections: [ // [!code focus:3]
      { type: 'post', dir: 'blog', title: '博客' }
    ]
  })
  ```

  :::

* **完成**

::::

配置完成后，主题自动扫描 `docs/blog` 目录并生成以下页面：

* 文章列表页：`/blog/`
* 文章分类页：`/blog/categories/`
* 文章标签页：`/blog/tags/`
* 文章归档页：`/blog/archives/`

启用 `autoFrontmatter` 后，系统自动为 Markdown 文件生成永久链接：

```md title="docs/blog/post-1.md"
---
title: post-1
createTime: 2025/03/24 20:15:12
permalink: /blog/a1b2c3d4/
---
```

### 多语言支持

在主题多语言配置中定义不同语言的 post 集合：

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': { // [!code focus:5]
        collections: [
          { type: 'post', dir: 'blog', title: '博客' }
        ]
      },
      '/en/': { // [!code focus:5]
        collections: [
          { type: 'post', dir: 'blog', title: 'Blog' }
        ]
      }
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  locales: {
    '/': { // [!code focus:5]
      collections: [
        { type: 'post', dir: 'blog', title: '博客' }
      ]
    },
    '/en/': { // [!code focus:5]
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' }
      ]
    }
  }
})
```

:::

## 集合目录配置

`dir` 参数指定集合的源文件目录，支持绝对路径和相对路径（均相对于源目录）：

```ts
dir: 'blog' // 指向 docs/blog
dir: '/blog/' // 等效写法
dir: './blog/' // 等效写法
dir: '/team/blog/' // 指向 docs/team/blog
```

::: info 在多语言下，则相对于多语言目录
:::

### 文件过滤

通过 `include` 和 `exclude` 配置过滤 Markdown 文件，
使用 [picomatch ::quill:search::](https://chat.baidu.com/search?word=picomatch+%E7%9A%84+glob+pattern+%E8%A7%84%E5%88%99){.no-icon} 模式匹配：

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        // [!code hl:4]
        include: ['**/*.md'], // 包含所有 .md 文件
        exclude: ['**/*.snippet.md'] // 排除代码片段文件
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:4]
      include: ['**/*.md'], // 包含所有 .md 文件
      exclude: ['**/*.snippet.md'] // 排除代码片段文件
    }
  ]
})
```

:::

## 页面生成配置

默认基于 `dir` 配置生成页面路径，支持完整自定义：

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        // [!code hl:16]
        postList: true, // 启用文章列表页
        link: '/blog/', // 列表页链接
        linkPrefix: '/blog/', // 文章链接前缀
        tags: true, // 启用标签页
        tagsLink: '/blog/tags/', // 标签页链接
        tagsTheme: 'colored', // 标签主题 colored|gray|brand
        tagsText: '标签', // 标签页标题
        archives: true, // 启用归档页
        archivesLink: '/blog/archives/', // 归档页链接
        archivesText: '归档', // 归档页标题
        categories: true, // 启用分类页
        categoriesLink: '/blog/categories/', // 分类页链接
        categoriesText: '分类', // 分类页标题
        categoriesExpand: 'deep', // 分类展开层级 number|'deep'
        categoriesTransform: categories => categories, // 分类转换函数
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:16]
      postList: true, // 启用文章列表页
      link: '/blog/', // 列表页链接
      linkPrefix: '/blog/', // 文章链接前缀
      tags: true, // 启用标签页
      tagsLink: '/blog/tags/', // 标签页链接
      tagsTheme: 'colored', // 标签主题 colored|gray|brand
      tagsText: '标签', // 标签页标题
      archives: true, // 启用归档页
      archivesLink: '/blog/archives/', // 归档页链接
      archivesText: '归档', // 归档页标题
      categories: true, // 启用分类页
      categoriesLink: '/blog/categories/', // 分类页链接
      categoriesText: '分类', // 分类页标题
      categoriesExpand: 'deep', // 分类展开层级 number|'deep'
      categoriesTransform: categories => categories, // 分类转换函数
    }
  ]
})
```

:::

## 自动 Frontmatter 生成

::: info 仅在执行 `vuepress dev` 或 `vuepress build` 后生效
:::

支持集合级别的 frontmatter 自动生成，可自定义转换逻辑：

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        // [!code hl:10]
        autoFrontmatter: {
          title: true, // 自动生成标题
          createTime: true, // 自动生成创建时间
          permalink: true, // 自动生成永久链接
          transform: (data, context, locale) => { // 自定义转换
            data.foo ??= 'foo'
            return data
          }
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:10]
      autoFrontmatter: {
        title: true, // 自动生成标题
        createTime: true, // 自动生成创建时间
        permalink: true, // 自动生成永久链接
        transform: (data, context, locale) => { // 自定义转换
          data.foo ??= 'foo'
          return data
        }
      }
    }
  ]
})
```

:::

生成示例：

```md title="docs/blog/post-1.md"
---
title: post-1
createTime: 2025/03/24 20:15:12
permalink: /blog/a1b2c3d4/
---
```

## 个人信息配置

每个 post 集合支持独立配置个人信息展示区域。未配置时继承[主题默认 profile 设置](../../config/theme.md#profile)。

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        // [!code hl:10]
        profile: {
          avatar: '/avatar.jpg', // 头像路径
          name: '张三', // 显示名称
          description: '个人简介', // 简介文本
          circle: true, // 圆形头像
          location: '广州', // 所在地
          organization: '组织名称', // 所属组织
          layout: 'right', // 布局位置 left|right
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:10]
      profile: {
        avatar: '/avatar.jpg', // 头像路径
        name: '张三', // 显示名称
        description: '个人简介', // 简介文本
        circle: true, // 圆形头像
        location: '广州', // 所在地
        organization: '组织名称', // 所属组织
        layout: 'right', // 布局位置 left|right
      }
    }
  ]
})
```

:::

## 社交链接

个人信息区域支持社交链接配置，未配置时继承 [主题默认 social 设置](../../config/theme.md#social)。

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        // [!code hl:9]
        social: [
        // 使用 iconify name
          { icon: 'github', link: 'https://github.com/zhangsan' },
          {
            // 使用自定义图标
            icon: { svg: '<svg>xxxxx</svg>', name: 'xxx' },
            link: 'https://xxx.com'
          },
        ],
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:9]
      social: [
        // 使用 iconify name
        { icon: 'github', link: 'https://github.com/zhangsan' },
        {
        // 使用自定义图标
          icon: { svg: '<svg>xxxxx</svg>', name: 'xxx' },
          link: 'https://xxx.com'
        },
      ],
    }
  ]
})
```

:::

支持 [Iconify](https://icon-sets.iconify.design/) 任意图标，直接使用 iconify name 即可自动加载。

对于 `simple-icons` 集合下的图标，可以省略 `simple-icons:` 前缀，如 `simple-icons:github` 可以简写为 `github`

常见的社交图标示例：

::: flex

* discord ::simple-icons:discord::
* telegram ::simple-icons:telegram::
* facebook ::simple-icons:facebook::
* github ::simple-icons:github::
* instagram ::simple-icons:instagram::
* linkedin ::simple-icons:linkedin::
* mastodon ::simple-icons:mastodon::
* npm  ::simple-icons:npm::
* slack ::simple-icons:slack::
* twitter ::simple-icons:twitter::
* x ::simple-icons:x::
* youtube ::simple-icons:youtube::
* bluesky ::simple-icons:bluesky::
* tiktok ::simple-icons:tiktok::

- qq ::simple-icons:qq::
- weibo ::simple-icons:sinaweibo::
- bilibili ::simple-icons:bilibili::
- gitlab ::simple-icons:gitlab::
- docker ::simple-icons:docker::
- juejin ::simple-icons:juejin::
- zhihu ::simple-icons:zhihu::
- douban ::simple-icons:douban::
- steam ::simple-icons:steam::
- stackoverflow ::simple-icons:stackoverflow::
- xbox ::simple-icons:xbox::
- kuaishou ::simple-icons:kuaishou::
- twitch ::simple-icons:twitch::
- xiaohongshu ::simple-icons:xiaohongshu::

:::

[你可以在这里查看 **simple-icons** 所有可用图标](https://icon-sets.iconify.design/simple-icons/){.readmore}

如果 **Iconify** 无法满足你的需求，可以传入 `{ svg: string, name?: string }`的格式，使用自定义图标，传入 svg 源码字符串。

## 文章封面配置

文章列表页支持封面图展示，提供多种布局和尺寸选项。

### 基础配置

在 frontmatter 中定义封面图路径：

```md{3}
---
title: 文章标题
cover: /images/cover.jpg
---
```

**路径规范**：仅支持绝对路径或远程 URL。本地图片需放置在 `.vuepress/public` 目录：

::: file-tree

* docs
  * .vuepress
    * public
      * images
        * cover.jpg
    * config.ts
  * article.md
    :::

默认展示效果：

### 高级布局

调整封面图位置和尺寸：

```md{4-7}
---
title: 文章标题
cover: /images/cover.jpg
coverStyle:
  layout: left
  ratio: 16:9
  width: 300
---
```

效果展示:

### 紧凑模式

无摘要时启用紧凑布局：

```md{8}
---
title: 文章标题
cover: /images/cover.jpg
coverStyle:
  layout: left
  ratio: 16:9
  width: 300
  compact: true
---
```

效果展示:

::: warning `compact: true` 仅在无摘要时生效
:::

### 顶部大图布局

```md{5}
---
title: 文章标题
cover: /images/cover.jpg
coverStyle:
  layout: top
  ratio: 16:9
  width: 300
---
```

效果展示:

### 预设配置

为保持视觉统一，支持集合级封面图预设：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        postCover: {
          layout: 'left',
          ratio: '16:9',
          width: 300,
          compact: true
        }
      }
    ],
  })
})
```

布局模式说明：

```ts
type PostCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

interface PostCoverStyle {
  layout?: PostCoverLayout // 布局位置
  ratio?: number | `${number}:${number}` // 宽高比，默认 '4:3'
  width?: number // 宽度（左右布局生效），默认 240
  compact?: boolean // 紧凑模式，默认 false
}
```

特殊布局模式：

* `odd-left` - 奇数项居左，偶数项居右
* `odd-right` - 奇数项居右，偶数项居左

`odd-left` 布局效果：

::: warning 移动端适配
窄屏设备上自动切换为 `top` 布局以确保显示效果
:::

## 文章元数据

在集合中通过 `meta` 选项，可以设置文章元数据的显示方式，
该设置将直接影响 **文章列表页** 和 **文章内容页** 的元数据显示：

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        // [!code hl:11]
        meta: {
          tags: true, // 是否显示标签
          /**
           * 是否显示创建时间，或设置时间格式
           * - 'short': 显示为 `2022-01-01`，默认
           * - 'long': 显示为 `2022-01-01 00:00:00`
           */
          createTime: true, // boolean | 'short' | 'long'
          readingTime: true, // 是否显示阅读时间估算
          wordCount: true, // 是否显示字数统计
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:11]
      meta: {
        tags: true, // 是否显示标签
        /**
         * 是否显示创建时间，或设置时间格式
         * - 'short': 显示为 `2022-01-01`，默认
         * - 'long': 显示为 `2022-01-01 00:00:00`
         */
        createTime: true, // boolean | 'short' | 'long'
        readingTime: true, // 是否显示阅读时间估算
        wordCount: true, // 是否显示字数统计
      }
    }
  ]
})
```

:::

在 markdown 中，通过 frontmatter 配置文章元数据：

```md
---
title: 文章标题
createTime: 2024/01/01 00:00:00
tags:
  - tag1
  - tag2
---
```

`title` 和 `createTime` 在文件创建时自动生成，支持手动修改。

### 可用属性

| 属性       | 类型                | 默认值   | 说明                       |
| ---------- | ------------------- | -------- | -------------------------- |
| title      | `string`            | 文件名   | 文章标题                   |
| createTime | `string`            | 当前时间 | 创建时间                   |
| tags       | `string[]`          | `[]`     | 文章标签                   |
| sticky     | `boolean \| number` | false    | 置顶标识，数字越大排序越前 |
| draft      | `boolean`           | false    | 草稿模式，构建后隐藏       |
| cover      | `string`            | `''`     | 封面图路径                 |
| coverStyle | `PostCoverStyle`    | `null`   | 封面样式配置               |
| excerpt    | `boolean \| string` | ''       | 摘要内容，支持自动提取     |

同时支持[通用 frontmatter 配置](../../config/frontmatter/basic.md)中的所有字段。

## 文章摘要配置

### 自动提取

使用 `<!-- more -->` 标记摘要截断点：

```md
---
title: 标题
---

摘要内容区域

<!-- more -->

正文剩余部分
```

### 手动定义

通过 excerpt 字段自定义摘要：

```md
---
title: 标题
excerpt: 自定义摘要内容
---
```

**配置说明**：

* `excerpt: false` - 禁用摘要（忽略 `<!-- more -->`）
* `excerpt: string` - 自定义内容（忽略 `<!-- more -->`）

::: tip 推荐使用 \<!-- more --> 注释定义摘要
:::

## 配置到站点首页

主题提供了两种方式来设置 post 集合 的文章列表页 到站点主页，满足不同的需求场景：

* **方式一：配置 主页的 `pageLayout` 属性为 `posts`**

```md title="docs/README.md"
---
pageLayout: posts
---
```

还可以通过 `collection` 配置项来指定读取哪个集合的文章列表页，默认读取第一个集合的文章列表页。

`collection` 需要与集合配置的 `dir` 的值相同。

```md title="docs/README.md"
---
pageLayout: posts
collection: blog
---
```

此配置会直接将页面应用 `posts` 布局，显示博客文章列表。

这是将主页修改为 博客页的 最简单的方式，但缺点是 缺少灵活性。

* **方式二：配置 主页的 `pageLayout` 属性为 `home`, 添加 `type: posts` 的首页区域类型**

```md title="docs/README.md"
---
pageLayout: home
config:
  - type: posts
    collection: blog
---
```

使用这种方式，你不仅可以在首页中添加 文章列表，还可以灵活的在页面的其他区域添加不同的内容。

比如，配置首屏为 `banner`，然后紧跟着 博客文章列表：

```md title="docs/README.md"
---
pageLayout: home
config:
  - type: banner
  - type: posts
---
```

更多自定义配置，请参考 [自定义首页](../custom/home.md)。

当使用以上两种方式 将首页配置为 文章列表页后，由于主题默认依然会生成 文章列表页，
这导致存在了重复功能的页面。为此，你可能需要在 集合配置中，
**关闭自动生成博客文章列表页**：

（还可以重新修改 分类页/标签页/归档页的链接地址）

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      { type: 'post', dir: 'blog', title: '博客', postList: false }
    ],
  })
})
```
