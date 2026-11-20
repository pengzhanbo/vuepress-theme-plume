---
url: /guide/features/series/index.md
---
## 概述

系列把多篇文章串成一个有顺序的专栏。写连载时，你不必再手动维护目录：在每篇文章开头写两行标记，
主题会替你在正文顶部标出「本文收录于《某专栏》· 第 3 / 共 12 篇」，在文末给出「下一篇：xxx」，
并生成一个专栏目录页，按顺序列出所有文章。

博客文章、文档、不同目录下的页面，都可以放在同一个专栏里，文章原来的网址不会变。

该功能默认关闭，打开一个开关即可使用。

::::: tip 本站就是用它写的

* [主题功能](/series/features/)：主题每个功能的用法
* [版本更新](/series/version-update/)：每个版本的更新与破坏性变更
* [全部专栏](/series/)：总览页，汇总站内所有专栏

点进任意一篇，就能看到正文顶部的提示和文末的「下一篇」。

:::::

## 快速开始

:::::: steps

1. **打开开关**

   ```ts title=".vuepress/config.ts"
   import { defineUserConfig } from 'vuepress'
   import { plumeTheme } from 'vuepress-theme-plume'

   export default defineUserConfig({
     theme: plumeTheme({
       series: true, // [!code hl]
     }),
   })
   ```

   `true` 表示使用全部默认值，完整配置项见 [主题配置 · series](../../config/theme.md#series)。

2. **给文章加标记**

   同一个专栏的每篇文章，都在 frontmatter 里写上 `series` 与 `seriesOrder`：

   ```yaml title="blog/vue3-reactivity.md"
   ---
   title: 响应式原理
   series: vue3 # [!code hl]
   seriesOrder: 1 # [!code hl]
   ---
   ```

   `series` 是专栏的标识，自己起一个，同一个专栏保持一致；`seriesOrder` 是这篇在专栏里排第几。

3. **运行并查看**

   重启开发服务器，打开其中一篇文章：正文顶部出现专栏提示，文末出现「下一篇」，
   最后一篇显示「已完结」。同时会生成专栏目录页 `/series/vue3/`，篇数与顺序都由主题算好。

::::::

::::: warning 篇章规则

加密页面、`article: false` 的页面，以及生产构建时的草稿不会被算进专栏。
只要专栏里至少有一篇公开文章，就会生成目录页与页内提示，单篇专栏也不例外。

:::::

## 导航栏入口

专栏目录页的地址是 `/series/<id>/`，总览页是 `/series/`。加进导航栏，读者才找得到：

::::: code-tabs#configs

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    series: true,
    navbar: [
      {
        text: '专栏',
        link: '/series/', // [!code hl]
        icon: 'lucide:library-big',
        activeMatch: '^/series/', // [!code hl]
      },
    ],
  }),
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  navbar: [
    {
      text: '专栏',
      link: '/series/',
      icon: 'lucide:library-big',
      activeMatch: '^/series/',
    },
  ],
})
```

:::::

几种常见写法：

| 想要的效果 | 写法 |
| --- | --- |
| 一个入口看全部专栏 | `link: '/series/'`，同时开启 `index` |
| 只放某一个专栏 | `link: '/series/features/'` |
| 放进下拉菜单 | 用 `items: [{ text, link }]` 代替 `link` |

`activeMatch` 让导航栏在阅读专栏内的文章时保持高亮，写路径前缀即可，例如 `^/series/`。

::::: tip 总览页需要单独开启

只写 `series: true` 时，只有每个专栏自己的目录页。想要一个汇总页，再加一行 `index: true`：

```ts title=".vuepress/plume.config.ts"
export default defineThemeConfig({
  series: {
    index: true, // [!code hl]
  },
})
```

:::::

## 专栏信息

`series` 只是标识，读者看到的名字在配置里指定：

```ts title=".vuepress/plume.config.ts"
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  series: {
    items: {
      vue3: {
        title: 'Vue 3 从入门到进阶',
        description: '用 12 篇文章，把响应式、组件和编译器讲清楚。',
        cover: '/images/vue3.png',
      },
    },
  },
})
```

| 字段 | 说明 |
| --- | --- |
| `title` | 专栏标题，目录页上的大标题 |
| `description` | 一句话介绍，显示在目录页与总览页 |
| `cover` | 可选，目录页顶部图片，填写 `public` 目录下的路径 |

本站的配置放在 `docs/.vuepress/series.ts`，可以直接参考：

```ts title="docs/.vuepress/series.ts"
export const zhSeries: SeriesOptions = {
  page: true,
  autoCreate: true,
  index: true,
  items: {
    'features': {
      title: '主题功能',
      description: '主题功能列表，详细介绍主题提供的各类功能，以及如何在配置中开启和配置它们。',
    },
    'version-update': {
      title: '版本更新',
      description: '主题的版本更新记录，包括新特性、Bug 修复和改动等。',
    },
  },
}
```

未在 `items` 中声明的专栏依然可用，主题会把 `series` 的值当作标题，并在终端提示你补充。

## 目录页与总览页

| 页面 | 地址 | 内容 |
| --- | --- | --- |
| 目录页 | `/series/<id>/` | 专栏标题、简介、封面、篇数与总时长、章节目录 |
| 总览页 | `/series/` | 当前语言下的全部专栏，各带前 3 篇预览（需 `index: true`） |

两者都在构建时生成，是普通的静态页面：不加 JavaScript 也能阅读，可以被搜索引擎收录，
但不会出现在文章列表、搜索索引与 RSS 中。多语言站点每个语言各有一份，互不影响。

## 订阅专栏

专栏也可以被订阅。开启 feed 并为系列输出频道后，目录页标题下方会出现「订阅」按钮：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'https://example.com', // [!code hl]
    feed: {
      perSeries: true, // [!code hl]
    },
    series: true,
  }),
})
```

产物：

| 订阅项 | 地址 |
| --- | --- |
| 专栏 `features` | `/series/features/feed.xml` |
| 专栏 `features`（英文站） | `/en/series/features/feed.xml` |

系列频道的条目按篇目顺序排列（不是发布时间），且默认不截断，订阅方可以拿到完整的目录；
只有一篇文章的专栏同样有频道，频道主页就是它的目录页 `/series/<id>/`。

单个专栏可以覆盖或关闭订阅：

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  series: {
    items: {
      vue3: { feed: { title: 'Vue 3 连载', limit: 50 } },
      archive: { feed: false },
    },
  },
})
```

关闭落地页（`page: false`）又没有配置 `link` 的系列没有可指向的主页，不会生成订阅频道；
补一个 `feed.link` 即可。

::: warning 需要 `hostname`

feed 中的链接必须是绝对地址，未配置 `hostname` 时不会生成任何订阅文件，按钮也不会出现。
订阅文件只在生产构建（`vuepress build`）中生成。

:::

更多细节见 [Feed 订阅](./feed.md#系列频道)。

## 配置

### 排序

专栏里的文章**都写了** `seriesOrder` 就按序号排；只要有文章漏写，整体改用发布时间，避免顺序错乱。
也可以强制指定：

| 取值 | 效果 |
| --- | --- |
| `'auto'`（默认） | 都写了序号就按序号，否则按发布时间 |
| `'order'` | 一定按序号，没写序号的排在最后 |
| `'time'` | 一定按发布时间 |

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  series: {
    order: 'order', // 全局默认
    items: {
      vue3: { order: 'time' }, // 单个专栏覆盖
    },
  }
})
```

### 关闭页内提示

| 范围 | 写法 |
| --- | --- |
| 某篇文章 | frontmatter `seriesNav: false` |
| 整个站点 | `series: { nav: false }` |

关闭后只是不显示正文顶部与底部的提示，目录页照常生成，页脚翻页也不受影响。

### 自定义路径

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  series: {
    linkPrefix: '/collections/', // 目录页前缀，默认 '/series/'
    items: {
      vue3: { link: '/vue3/' }, // 单独指定某个专栏的地址
      notes: { page: false, link: '/notes/' }, // 不生成目录页，指向自己写的页面
    },
  }
})
```

目录页地址与已有页面冲突时，主题会跳过生成并在终端提示，不会覆盖你写好的页面。

### 多语言

每个语言各自一套专栏，`/series/` 与 `/en/series/` 互不混合。本站就是在 `locales` 中分别配置的：

```ts title=".vuepress/plume.config.ts"
export default defineThemeConfig({
  locales: {
    '/': { series: zhSeries },
    '/en/': { series: enSeries },
  },
})
```

### 完整配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `page` | `boolean` | `true` | 是否生成目录页 |
| `index` | `boolean` | `false` | 是否生成总览页 `/series/` |
| `linkPrefix` | `string` | `'/series/'` | 目录页地址前缀 |
| `order` | `'auto' \| 'order' \| 'time'` | `'auto'` | 文章排序方式 |
| `nav` | `boolean` | `true` | 是否显示正文顶部、底部的提示 |
| `autoCreate` | `boolean` | `true` | 未在 `items` 中声明时是否自动建专栏 |
| `items` | `Record<string, SeriesItemOptions>` | `{}` | 每个专栏的标题、简介、封面等 |

frontmatter 字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `series` | `string` | 所属专栏的标识 |
| `seriesOrder` | `number` | 在专栏中的序号，供排序使用 |
| `seriesNav` | `boolean` | 当前页是否显示专栏提示，默认 `true` |

完整说明见 [主题配置 · series](../../config/theme.md#series)。

## 与相关文章联动

开启 [相关文章推荐](./related-posts.md) 后，系列关系会作为额外信号参与推荐：

* 文末的「下一篇」已经单独展示，所以相关文章默认不再重复推荐它；
* 同系列的其他章节由 `relatedPosts.seriesBoost` 控制：`1` 不改变分数、`0` 完全不推荐、
  大于 `1` 时优先推荐。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    series: true,
    relatedPosts: { seriesBoost: 1.2 },
  }),
})
```

更多细节见 [相关文章推荐 - 与系列联动](./related-posts.md#与系列联动)。
