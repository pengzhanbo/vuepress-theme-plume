---
url: /config/collections/index.md
---
## 概述

**Collections（集合）** 是主题中用于组织和管理文档的核心概念。每个集合指向源目录下的特定文件夹，将其中的所有 Markdown 文件作为一个逻辑单元进行管理。

通过灵活的集合配置，您可以轻松构建多种内容体系：

* **博客** - 个人随笔与技术分享
* **专栏** - 专题系列文章
* **使用手册** - 产品使用文档
* **笔记** - 学习笔记与知识整理
* **产品文档** - 完整的项目文档
* **知识库** - 团队知识管理体系

集合主要分为两种类型，适应不同的内容组织需求：

* **`post` 类型**：适用于碎片化内容，文章间关联较弱，如博客、专栏等
* **`doc` 类型**：适用于结构化文档，内容关联紧密，如使用手册、产品文档、知识库等

::: tip 配置位置
集合配置支持在 `.vuepress/config.ts` 或独立的 `plume.config.ts` 文件中进行配置。
:::

## 基础配置

假设您的项目采用以下目录结构：

::: file-tree title="项目结构"

* docs
  * **blog**
    * post-1.md
    * post-2.md
  * **typescript**
    * basic
      * intro.md
      * variable.md
    * types.md
      :::

对应的集合配置示例如下：

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 集合配置 // [!code focus:7]
    collections: [
      // 注册 post 类型集合，实现博客功能
      { type: 'post', dir: 'blog', title: '博客' },
      // 注册 doc 类型集合，实现 TypeScript 文档功能
      { type: 'doc', dir: 'typescript', title: 'TypeScript 文档', sidebar: 'auto' }
    ],
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // 独立配置文件中的集合配置 // [!code focus:7]
  collections: [
    { type: 'post', dir: 'blog', title: '博客' },
    { type: 'doc', dir: 'typescript', title: 'TypeScript 文档', sidebar: 'auto' }
  ],
})
```

:::

## 多语言配置

对于多语言项目，您可以在 `locales` 字段中为每种语言单独配置集合：

::: file-tree title="多语言项目结构"

* docs
  * **blog/**
    * post-1.md
    * post-2.md
  * **typescript/**
    * basic
      * intro.md
      * variable.md
    * types.md
  * en
    * **blog/**
      * post-1.md
      * post-2.md
    * **typescript/**
      * basic
        * intro.md
        * variable.md
      * types.md
        :::

::: code-tabs#configs

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': {
        // 中文集合配置 // [!code focus:4]
        collections: [
          { type: 'post', dir: 'blog', title: '博客' },
          { type: 'doc', dir: 'typescript', title: 'TypeScript 文档', sidebar: 'auto' }
        ],
      },
      '/en/': {
        // 英文集合配置 // [!code focus:4]
        collections: [
          { type: 'post', dir: 'blog', title: 'Blog' },
          { type: 'doc', dir: 'typescript', title: 'TypeScript Note', sidebar: 'auto' }
        ],
      }
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  locales: {
    '/': {
      // 中文集合配置 // [!code focus:4]
      collections: [
        { type: 'post', dir: 'blog', title: '博客' },
        { type: 'doc', dir: 'typescript', title: 'TypeScript 文档', sidebar: 'auto' }
      ],
    },
    '/en/': {
      // 英文集合配置 // [!code focus:4]
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' },
        { type: 'doc', dir: 'typescript', title: 'TypeScript Note', sidebar: 'auto' }
      ],
    }
  }
})
```

:::

## Post 集合详解

Post 集合专为博客、专栏等碎片化内容设计，提供完整的文章管理体系：

### 核心功能

* **文章列表页** - 支持文章置顶、封面图、摘要显示、个人信息等
* **文章分类页** - 基于目录结构自动生成分类
* **文章标签页** - 灵活的标签管理
* **文章归档页** - 按时间维度组织内容

### 配置示例

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    // 博客集合配置
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      link: '/blog/', // 列表页链接
      linkPrefix: '/article/', // 文章链接前缀
      postCover: 'top', // 封面图位置
      autoFrontmatter: { permalink: true }, // 自动 frontmatter
    },
    // 面试专栏配置
    {
      type: 'post',
      dir: 'interview',
      title: '面试专栏',
      link: '/interview/', // 列表页链接
    }
  ]
})
```

## Doc 集合详解

Doc 集合适用于结构化文档，强调内容间的逻辑关系：

### 核心功能

* **侧边导航栏** - 提供清晰的文档结构导航
* **自动生成目录** - 基于文件结构智能生成侧边栏
* **多级嵌套支持** - 支持复杂的文档层次结构

### 配置示例

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    // TypeScript 文档 - 自动生成侧边栏
    {
      type: 'doc',
      dir: 'typescript',
      title: 'TypeScript 文档',
      sidebar: 'auto'
    },
    // Python 文档 - 手动配置侧边栏
    {
      type: 'doc',
      dir: 'python',
      title: 'Python 文档',
      sidebar: [
        { text: '基础语法', link: 'basic' },
        {
          text: 'API 文档',
          items: [
            { text: 'asyncio', link: 'asyncio' }
          ]
        },
        'advanced' // 简写形式
      ]
    }
  ]
})
```

## 配置类型声明

### 基础集合配置

```ts
/* 集合配置数组 */
type ThemeCollections = ThemeCollectionItem[]

/* 单个集合项 */
type ThemeCollectionItem = ThemePostCollection | ThemeDocCollection

/* 集合公共配置 */
interface ThemeBaseCollection {
  /**
   * 集合类型
   * - `post`: 文章列表（博客、专栏）
   * - `doc`: 结构化文档（笔记、知识库）
   */
  type: 'post' | 'doc'
  /**
   * 文档目录（相对于源目录）
   */
  dir: string
  /**
   * 文章链接前缀
   */
  linkPrefix?: string
  /**
   * 集合标题（用于面包屑导航）
   */
  title: string
  /**
   * 标签颜色主题
   * @default 'colored'
   */
  tagsTheme?: 'colored' | 'gray' | 'brand'
  /**
   * 自动生成 frontmatter
   */
  autoFrontmatter?: AutoFrontmatterOptions | false
  /**
   * 相关文章推荐配置，覆盖主题级的 `relatedPosts` 配置
   * - `true`：按默认配置启用
   * - `false`：在该集合内关闭
   */
  relatedPosts?: boolean | RelatedPostsOptions
  /**
   * 集合级 Feed 配置，覆盖主题级 `feed` 配置
   * - `true`：纳入 feed 并生成独立频道，等价于 `{}`
   * - `false`：完全不进入任何 feed
   * - 对象：出现即 opt-in，字段可单独覆盖
   */
  feed?: boolean | FeedCollectionOptions
}
```

### 集合级 Feed 配置

`feed` 用于控制该集合是否纳入订阅、是否生成独立频道，以及频道的标题、链接、条数与格式。
可以写成布尔值或对象：

* `true`：纳入 feed 并生成独立频道，等价于 `{}`；
* `false`：该集合完全不进入任何 feed；
* `{}` / 对象：出现即 opt-in，字段可单独覆盖。

它需要主题级 `feed` 已启用（详见 [Feed 配置](../config/theme.md#feed)）。

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `include` | `boolean` | `true` | 是否将该集合的页面纳入 feed |
| `channel` | `boolean` | `true` | 是否为该集合生成独立频道 |
| `link` | `string` | 集合链接 | 频道主页链接，同时决定输出目录 |
| `title` | `string` | 集合标题 | 频道标题 |
| `description` | `string` | 主题级描述 | 频道描述 |
| `limit` | `number` | 主题级 `limit` | 最多条目数 |
| `content` | `'excerpt' \| 'full'` | 主题级 `content` | 内容模式 |
| `formats` | `FeedFormat[]` | 主题级 `formats` | 输出格式 |

::: tip 出现即 opt-in
未设置 `feed` 时，`post` 集合会被纳入 feed（受 `perCollection` 影响是否生成独立频道），
`doc` 集合默认不纳入。
:::

```ts title="plume.config.ts"
import { defineConfig } from 'vuepress-theme-plume'

export default defineConfig({
  collections: [
    // doc 集合默认不进入 feed，`feed: true` 即为显式开启（也可写 `feed: {}`）
    { type: 'doc', dir: 'guide', title: '指南', sidebar: 'auto', feed: true },
    // 关闭某个集合的订阅
    { type: 'post', dir: 'notes', title: '笔记', feed: false },
  ],
})
```

### Post 集合专用配置

```ts title="Post 集合配置"
interface ThemePostCollection extends ThemeBaseCollection {
  type: 'post'
  /**
   * 包含文件规则（glob 模式）
   * @default ['**\/*.md']
   */
  include?: string[]
  /**
   * 排除文件规则（glob 模式）
   * @default []
   */
  exclude?: string[]
  /**
   * 分页配置
   */
  pagination?: false | number | {
    /**
     * 每页文章数量
     * @default 15
     */
    perPage?: number
  }
  /**
   * 文章列表页链接
   * @default '/{dir}/'
   */
  link?: string
  /**
   * 是否启用文章列表页
   * @default true
   */
  postList?: boolean
  /**
   * 是否启用标签页
   * @default true
   */
  tags?: boolean
  /**
   * 标签页链接
   * @default '/{link}/tags/'
   */
  tagsLink?: string
  /**
   * 标签页文本
   */
  tagsText?: string
  /**
   * 是否启用归档页
   * @default true
   */
  archives?: boolean
  /**
   * 归档页链接
   * @default '/{link}/archives/'
   */
  archivesLink?: string
  /**
   * 归档页文本
   */
  archivesText?: string
  /**
   * 是否启用分类功能
   * @default true
   */
  categories?: boolean
  /**
   * 分类页链接
   * @default '/{link}/categories/'
   */
  categoriesLink?: string
  /**
   * 分类页文本
   */
  categoriesText?: string
  /**
   * 分类展开深度
   * @default 'deep'
   */
  categoriesExpand?: number | 'deep'
  /**
   * 分类列表转换函数
   */
  categoriesTransform?: (categories: PostsCategoryItem[]) => PostsCategoryItem[]
  /**
   * 文章封面图配置
   * @default 'right'
   */
  postCover?: PostsCoverLayout | PostsCoverStyle
  /**
   * 个人信息配置
   */
  profile?: ProfileOptions | false
  /**
   * 社交账号配置
   */
  social?: SocialLink[] | false
}
/* 文章分类项 */
interface PostsCategoryItem {
  id: string
  sort: number
  name: string
}
/* 封面图布局 */
type PostsCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
/* 封面图样式 */
interface PostsCoverStyle {
  layout?: PostsCoverLayout
  ratio?: number | `${number}:${number}` | `${number}/${number}`
  width?: number
  compact?: boolean
}
/* 社交链接图标 */
type SocialLinkIcon = SocialLinkIconUnion | { svg: string, name?: string }
/* 社交链接 */
interface SocialLink {
  icon: SocialLinkIcon
  link: string
  ariaLabel?: string
}

/**
 * 个人资料
 */
export interface ProfileOptions {
  /**
   * 头像链接地址
   */
  avatar?: string
  /**
   * 名称
   */
  name?: string
  /**
   * 描述 / 简介 / 座右铭 / 签名
   */
  description?: string
  /**
   * 是否显示为圆形头像
   */
  circle?: boolean
  /**
   * 地理位置
   */
  location?: string
  /**
   * 组织，公司
   */
  organization?: string
  /**
   * 布局位置，左侧或者右侧
   * @default 'right'
   */
  layout?: 'left' | 'right'
}
```

### Doc 集合专用配置

```ts title="Doc 集合配置"
interface ThemeDocCollection extends ThemeBaseCollection {
  type: 'doc'
  /**
   * 侧边栏配置
   */
  sidebar?: 'auto' | (string | ThemeSidebarItem)[]
  /**
   * 是否显示侧边栏滚动条
   * @default true
   */
  sidebarScrollbar?: boolean
  /**
   * 侧边栏默认折叠状态
   * @default false
   */
  sidebarCollapsed?: boolean
}

/* 侧边栏项配置 */
interface ThemeSidebarItem {
  text?: string
  link?: string
  icon?: ThemeIcon
  badge?: string | ThemeBadge
  items?: 'auto' | (string | ThemeSidebarItem)[]
  collapsed?: boolean
  prefix?: string
  rel?: string
  target?: string
}

/* 图标类型 */
type ThemeIcon = string | { svg: string }

/* 徽章配置 */
export interface ThemeBadge {
  text?: string
  type?: string
  color?: string
  bgColor?: string
  borderColor?: string
}
```

### 自动侧边栏生成

将 Doc 集合的 `sidebar` 设置为 `'auto'` 时，系统会根据目录结构自动生成侧边栏导航。排序规则遵循[文件夹命名约定](../guide/quick-start/write.md#文件夹命名约定)。

### 侧边栏图标配置

主题支持两种方式配置侧边栏图标：

* **在侧边栏配置中直接定义**：

  ```ts
  sidebar: [
    { text: '介绍', link: 'intro', icon: 'mdi:tooltip-text-outline' }
  ]
  ```

* **在文档 frontmatter 中定义**：

  ```md
  ---
  title: 主题介绍
  icon: mdi:tooltip-text-outline
  ---
  ```

两种方式具有相同的效果，您可以根据具体场景选择使用。

如需了解侧边栏的完整配置选项和使用技巧，请参阅[侧边栏配置指南](../guide/quick-start/sidebar.md)。
