---
title: post 集合
icon: mdi:post-outline
createTime: 2025/10/05 17:10:57
permalink: /guide/collection/post/
---

## 概述

**post 集合** 指 碎片化的多篇文章的集合。
**碎片化** 指 多篇文章之间没有关联、或者仅弱关联关系，或者只需要以扁平化的方式展示。

常见的场景如：博客、专栏、新闻、随笔 等等。

post 集合 提供了以下的功能实现：

- 文章列表页 - 文章置顶、文章封面图、文章摘要等。
- 文章分类页 - 根据目录结构自动生成分类。
- 文章标签页 - 根据页面 `frontmatter.tags` 生成标签。
- 文章归档页 - 根据页面 `frontmatter.createTime` 生成归档。

在这些页面中，还提供了 个人/组织 信息展示区域，可以用于展示个人信息，或者组织信息等等。

::: info 主题支持配置多个 post 集合
:::

## 创建 post 集合

只需要简单的几个步骤和配置，就可以完成一个 post 集合的创建。

创建一个集合，最重要的是，通过 `dir` 配置项指向一个目录（该目录相对于 源目录）。

一个典型的例子是，创建一个 博客：

:::: steps

- **创建一个 `blog` 目录，用于存放博客文章**

  ::: file-tree

  - docs \# 源目录
    - ++ blog
      - ++ post-1.md
      - ++ post-2.md
      - ++ …
  :::

- **添加 `collections` 配置**

  最简单的配置是：

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

- **完成**
::::

主题根据该配置，读取 `docs/blog` 目录下的所有 `.md` 文件，并生成以下页面：

- 博客文章列表页： `/blog/`
- 博客文章分类页： `/blog/categories/`
- 博客文章标签页： `/blog/tags/`
- 博客文章归档页： `/blog/archives/`

当启用了 `autoFrontmatter` 时，对 `docs/blog` 目录下的 `.md` 文件，自动生成 `permalink` 永久链接：

```md title="docs/blog/post-1.md"
---
title: post-1
createTime: 2025/03/24 20:15:12
permalink: /blog/a1b2c3d4/
---
```

### 多语言

可以在 [主题配置 > 多语言](../../config/theme.md#locales) 中配置多语言的 post 集合。

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

## 集合目录

通过配置 `dir` 选项，指定该目录下的所有 `.md` 文件，都属于该集合。

为了便于理解与管理，`dir` 仅接受一个字符串，指向一个目录。
无论是绝对路径还是相对路径，该目录相对于源目录

```
dir: 'blog' // 指向 docs/blog 目录
dir: '/blog/' // 相同作用，也指向 docs/blog 目录
dir: './blog/' // 相同作用，也指向 docs/blog 目录
dir: '/team/blog/' // 指向 docs/team/blog 目录
```

**过滤 `.md` 文件**：

在某些场景中，可能不需要包含 `dir` 目录下的所有的 `.md` 文件。
主题提供了 `include` 和 `exclude` 配置，用于过滤 `.md` 文件。
请注意，它们是根据文件路径，使用 [glob pattern ::line-md:search::](https://chat.baidu.com/search?word=picomatch+%E7%9A%84+glob+pattern+%E8%A7%84%E5%88%99){.no-icon}
进行匹配的，且相对于 `dir` 指向的目录。

配置示例：

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
        // 表示包含 `docs/blog` 目录下的所有 `.md` 文件
        include: ['**/*.md'],
        // 但是排除所有后缀为 `.snippet.md` 的文件
        exclude: ['**/*.snippet.md']
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
      // 表示包含 `docs/blog` 目录下的所有 `.md` 文件
      include: ['**/*.md'],
      // 但是排除所有后缀为 `.snippet.md` 的文件
      exclude: ['**/*.snippet.md']
    }
  ]
})
```

:::

## 生成功能页面

创建 `post` 集合时，主题会为该集合生成相关页面，默认情况下，主题根据 `dir` 配置项作为页面链接的前缀。

以 `dir: blog` 为例：

- 文章列表页： `/blog/`
- 文章分类页： `/blog/categories/`
- 文章标签页： `/blog/tags/`
- 文章归档页： `/blog/archives/`
- 文章页面： `/blog/` + `8 位随机字符串` + `/`

主题支持在 `post` 集合配置中自定义它们：

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
        postList: true, // 是否启用文章列表页
        link: '/blog/', // 文章列表页链接
        linkPrefix: '/blog/', // 文章链接前缀
        tags: true, // 是否启用文章标签页
        tagsLink: '/blog/tags/', // 文章标签页链接
        tagsTheme: 'colored', // 标签颜色主题 `colored` | `gray` | `brand`
        tagsText: '标签', // 文章标签页标题
        archives: true, // 是否启用文章归档页
        archivesLink: '/blog/archives/', // 文章归档页链接
        archivesText: '归档', // 文章归档页标题
        categories: true, // 是否启用文章分类页
        categoriesLink: '/blog/categories/', // 文章分类页链接
        categoriesText: '分类', // 文章分类页标题
        categoriesExpand: 'deep', // 文章分类页展开层级 number | 'deep'
        // 文章分类列表转换函数，比如排除不需要的一级分类
        categoriesTransform: categories => categories,
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
      postList: true, // 是否启用文章列表页
      link: '/blog/', // 文章列表页链接
      linkPrefix: '/blog/', // 文章链接前缀
      tags: true, // 是否启用文章标签页
      tagsLink: '/blog/tags/', // 文章标签页链接
      tagsText: '标签', // 文章标签页标题
      tagsTheme: 'colored', // 标签颜色主题 `colored` | `gray` | `brand`
      archives: true, // 是否启用文章归档页
      archivesLink: '/blog/archives/', // 文章归档页链接
      archivesText: '归档', // 文章归档页标题
      categories: true, // 是否启用文章分类页
      categoriesLink: '/blog/categories/', // 文章分类页链接
      categoriesText: '分类', // 文章分类页标题
      categoriesExpand: 'deep', // 文章分类页展开层级 number | 'deep'
      // 文章分类列表转换函数，比如排除不需要的一级分类
      categoriesTransform: categories => categories,
    }
  ]
})
```

:::

## 自动生成 frontmatter

::: info 仅在启动 `vuepress dev`/`vuepress build` 命令后，才会自动生成 frontmatter
:::

主题支持为每个集合都单独配置 `frontmatter` 自动生成规则，
还可以自定义 `transform` 方法添加额外的 frontmatter 数据。

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
        // autoFrontmatter: false, // 禁用
        autoFrontmatter: {
          title: true, // 启用生成标题
          createTime: true, // 启用生成创建时间
          permalink: true, // 启用生成 permalink
          // 自定义 frontmatter 生成函数
          transform: (data, context, locale) => {
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

``` ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:10]
      // autoFrontmatter: false, // 禁用
      autoFrontmatter: {
        title: true, // 启用生成标题
        createTime: true, // 启用生成创建时间
        permalink: true, // 启用生成 permalink
        // 自定义 frontmatter 生成函数
        transform: (data, context, locale) => {
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

## profile

对于 post 集合，可以每个集合都单独配置 `profile` 。

::: info profile 为 个人信息 或者 组织信息的展示区域的配置。
:::

如果集合中未配置 `profile` ，会使用 [主题配置 > profile](../../config/theme.md#profile) 为默认值。

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
        // profile: false, // 禁用
        profile: {
          avatar: '/avatar.jpg', // 个人头像 或 组织头像
          name: '张三', // 个人名称 或 组织名称
          description: '个人简介 或 组织简介', // 个人简介 或 组织简介
          circle: true, // 是否为圆形头像
          location: '广州', // 个人所在地 或 组织所在地
          organization: '组织名称', // 个人所属组织 或 组织名称
          layout: 'right', // 个人资料栏的位置 left | right
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

``` ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:10]
      // profile: false, // 禁用
      profile: {
        avatar: '/avatar.jpg', // 个人头像 或 组织头像
        name: '张三', // 个人名称 或 组织名称
        description: '个人简介 或 组织简介', // 个人简介 或 组织简介
        circle: true, // 是否为圆形头像
        location: '广州', // 个人所在地 或 组织所在地
        organization: '组织名称', // 个人所属组织 或 组织名称
        layout: 'right', // 个人资料栏的位置 left | right
      }
    }
  ]
})
```

:::

## 社交链接

在 个人/组织 信息区域，还可以通过 `social` 配置社交链接。

如果集合中未配置 `social` ，会使用 [主题配置 > social](../../config/theme.md#social) 为默认值。

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
        // [!code hl:4]
        // social: false, // 禁用
        social: [
          { icon: 'github', link: 'https://github.com/pengzhanbo' },
        ],
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

``` ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      // [!code hl:4]
      // social: false, // 禁用
      social: [
        { icon: 'github', link: 'https://github.com/pengzhanbo' },
      ],
    }
  ]
})
```

:::

内置社交图标：

::: flex

<div style="flex: 1">

- 'discord'
- 'telegram'
- 'facebook'
- 'github'
- 'instagram'
- 'linkedin'
- 'mastodon'
- 'npm'
- 'slack'
- 'twitter'
- 'x'
- 'youtube'

</div><div style="flex: 1">

- 'qq'
- 'weibo'
- 'bilibili'
- 'gitlab'
- 'docker'
- 'juejin'
- 'zhihu'
- 'douban'
- 'steam'
- 'stackoverflow'
- 'xbox'

</div>

:::

## 文章封面

在文章列表页，主题支持为 文章添加封面图，并支持不同的 排版 和 灵活的尺寸配置。

为文章添加 封面图，可以在 `frontmatter` 中配置 `cover`:

```md{3}
---
title: 标题
cover: /images/cover.jpg
---
```

**封面图** 仅支持 绝对路径 或 远程路径。当使用 绝对路径时，从 `.vuepress/public` 目录中加载图片。

::: file-tree

- docs
  - .vuepress
    - public
      - images
        - cover.jpg
    - config.ts
  - article.md
- …
:::

默认效果如下：

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: '文章标题',
  categoryList: [{id:'65f30c',sort:4,name:'教程'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing' }"
  :index="1"
/>
</div>

还可以为 封面图 调整 布局位置，以及 尺寸比例：

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

效果如下:

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: '文章标题',
  categoryList: [{id:'65f30c',sort:4,name:'教程'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing', coverStyle: { layout: 'left', ratio: '16:9', width: 300 } }"
  :index="1"
/>
</div>

当文章没有摘要时，可能会显得比较空，为此你还可以通过 `compact: true` 使 封面图 贴合容器边缘，使整体变得更紧凑：

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

效果如下:

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: '文章标题',
  categoryList: [{id:'65f30c',sort:4,name:'教程'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing',
  coverStyle: { layout: 'left', ratio: '16:9', width: 300, compact: true } }"
  :index="1"
/>
</div>

::: warning `compact: true` 仅在文章没有摘要时生效
:::

还可以设置 封面图在 标题上方，此时变为 大图风格：

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

效果如下:

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: '文章标题',
  categoryList: [{id:'65f30c',sort:4,name:'教程'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing',
  coverStyle: { layout: 'top', ratio: '16:9', width: 300 } }"
  :index="1"
/>
</div>

### 预设配置

虽然主题支持为每个文章的封面图使用不同的配置，出于整体布局风格的考虑，以及简化配置的目的，
主题还支持为封面图预设配置：

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
        // 配置 封面图 布局位置
        // postCover: 'left', // 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
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

```ts
type BlogPostCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

interface BlogPostCoverStyle {
  /**
   * 博客文章封面图的位置
   */
  layout?: BlogPostCoverLayout
  /**
   * 博客文章封面图的比例
   *
   * @default '4:3'
   */
  ratio?: number | `${number}:${number}`

  /**
   * 封面图的宽度, 仅在 layout 为 'left' 或 'right' 时生效
   *
   * @default 240
   */
  width?: number
  /**
   * 是否使用紧凑模式，紧凑模式下，封面图紧贴容器边缘
   * @default false
   */
  compact?: boolean
}
```

你可能已经注意到，在预设配置的 `layout` 中，还支持 `odd-left` 和 `odd-right` 两种配置。

- `odd-left`: 表示 单数项在左侧，偶数项在右侧
- `odd-right`: 表示 单数项在右侧，偶数项在左侧

比如 `odd-left` 效果如下：

<div style="background-color: var(--vp-c-bg-alt); padding: 20px 24px;display: flex;flex-direction: column;gap: 24px;transition: var(--vp-t-color)">
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: '文章标题',
  categoryList: [{id:'65f30c',sort:4,name:'教程'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing',
  coverStyle: { layout: 'odd-left', ratio: '16:9', width: 300, compact: true } }"
  :index="0"
/>
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: '文章标题',
  categoryList: [{id:'65f30c',sort:4,name:'教程'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing',
  coverStyle: { layout: 'odd-left', ratio: '16:9', width: 300,compact: true } }"
  :index="1"
/>
<VPPostItem
  :post="{ path: '/article/ecxnxxd0/', title: '文章标题',
  categoryList: [{id:'65f30c',sort:4,name:'教程'}], createTime: '2024/09/18 09:19:36',
  lang:'zh-CN', excerpt:'', cover: 'https://api.pengzhanbo.cn/wallpaper/bing',
  coverStyle: { layout: 'odd-left', ratio: '16:9', width: 300, compact: true } }"
  :index="2"
/>
</div>

::: warning
当在 移动设备窄屏 上时，出于视觉效果考虑，`layout` 配置强制重置为 `top`。
:::

## 文章元数据

你可以配置展示博客文章的元数据，如标题、日期、标签等。这些数据通过 `frontmatter` 配置。

```md
---
title: 文章标题
createTime: 2024/01/01 00:00:00
tags:
  - tag1
  - tag2
---
```

其中，`title` / `createTime` 会在新建 md 文件时由主题自动填充，你可以随意修改它们。

以下是在 博客文章中可用的 `frontmatter` 属性。

| 属性       | 类型                        | 默认值             | 说明                                         |
| ---------- | --------------------------- | ------------------ | -------------------------------------------- |
| title      | `string`                    | 默认自动填入文件名 | 文章标题                                     |
| createTime | `string`                    | 当前时间           | 文章创建时间                                 |
| tags       | `string[]`                  | `[]`               | 文章标签                                     |
| sticky     | `boolean \| number`         | false              | 是否置顶, 如果为数字，则数字越大，置顶越靠前 |
| draft      | `boolean`                   | false              | 是否为草稿，草稿文章仅在开发时展示，部署后不会被展示 |
| cover      | `string`                    | `''`               | 文章封面                                     |
| coverStyle | `BlogPostCoverStyle`        | `null`             | 文章封面样式                                 |
| excerpt    | `boolean \| string`         | ''                 | 文章摘要，默认通过 `<!-- more -->` 注释生成, 传入字符串表示自定义内容，不再从正文提取 |

除了以上的字段，你还可以使用 [通用 frontmatter 配置](../../config/frontmatter/basic.md) 中的字段，
灵活的控制当前页面的行为。

## 文章摘要

如果你想要为文章添加摘要，你可以使用 `<!-- more -->` 注释来标记它。任何在此注释之前的内容会被视为摘要。

**示例：**

```md
---
title: 标题
---

这里的内容会被作为摘要

<!-- more -->

这里的内容不会被作为摘要
```

还可以使用 `frontmatter.excerpt` 来控制文章是否显示摘要，以及 自定义摘要内容。

- `frontmatter.excerpt` 默认为 `false`，表示不显示摘要，此时 `<!-- more -->` 注释会被忽略。
- `frontmatter.excerpt` 为 `string` 类型时，表示自定义摘要内容，此时 `<!-- more -->` 注释会被忽略。

**示例：**

```md
---
title: 标题
excerpt: 自定义摘要内容
---
```

您可以根据需要使用不同的方式来控制文章的摘要。

::: tip 主题更建议使用 <code>&lt;!-- more --&gt;</code> 注释来添加摘要
:::
