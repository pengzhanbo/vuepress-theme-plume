---
title: Feed 订阅
icon: mdi:rss
createTime: 2026/11/09 10:00:00
permalink: /guide/features/feed/
badge: 新
---

## 概述

主题支持在构建时为站点生成 **RSS 2.0**、**Atom 1.0** 与 **JSON Feed 1.1** 订阅文件，
并在页面 `<head>` 中注入 `<link rel="alternate">`，让读者与自动化工具可以直接发现订阅地址。

与「一个站点一个 feed」的通用方案不同，主题的 feed 与 `collections` 集合模型对齐，
支持 **按语言 × 集合** 拆分频道：

:::: file-tree

- .vuepress/dist
  - feed.xml
  - atom.xml
  - feed.json
  - blog
    - feed.xml
  - notes
    - feed.xml
  - en
    - feed.xml
    - blog
      - feed.xml
::::

## 快速开始

配置 `hostname` 与 `feed` 即可：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'https://example.com',
    feed: true, // 只输出 /feed.xml
  }),
})
```

:::: warning 必须配置 `hostname`
feed 中所有链接都必须是绝对地址，没有 `hostname` 时主题会跳过生成并输出警告。
`base` 也需要与站点实际部署路径一致，否则订阅地址会指向错误位置。
::::

:::: warning 仅在生产构建时生效
`feed` 在 `onGenerated` 阶段生成，即只有执行 `vuepress build` 时才会产出文件。
开发模式（`vuepress dev`）下不会生成任何 feed。
::::

## 多集合与多语言

### 集合频道

默认只输出全局频道。多集合站点可以开启 `perCollection`，为每个符合条件的集合输出独立频道：

```ts
export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'https://example.com',
    feed: {
      perCollection: true,
      formats: ['rss', 'atom', 'json'],
    },
    locales: {
      '/': {
        collections: [
          { type: 'post', dir: 'blog', title: '博客', link: '/blog/' },
          { type: 'post', dir: 'notes', title: '笔记', link: '/notes/' },
        ],
      },
    },
  }),
})
```

产物：

| 频道 | 输出文件 | 公开地址 |
| --- | --- | --- |
| 全局频道 | `dist/feed.xml` | `https://example.com/feed.xml` |
| 博客频道 | `dist/blog/feed.xml` | `https://example.com/blog/feed.xml` |
| 笔记频道 | `dist/notes/feed.xml` | `https://example.com/notes/feed.xml` |

同一篇文章可能同时出现在全局频道与集合频道中，这是预期行为。

### 集合级开关

集合上的 `feed` 决定该集合是否纳入订阅、是否生成独立频道：

```ts
// doc 集合默认不纳入 feed，`feed: true` 即为显式开启
const doc = { type: 'doc', dir: 'guide', title: '指南', sidebar: 'auto', feed: true }
```

```ts
// 关闭某个集合的订阅
const post = { type: 'post', dir: 'notes', title: '笔记', feed: false }
```

`feed: true` 等价于 `feed: {}`，都会让该集合纳入 feed 并生成独立频道，
且不再受主题级 `perCollection` / `includeDocCollections` 限制。

具体字段请参考 [集合配置](../../config/collections.md#集合级-feed-配置)。

### 多语言

每个语言环境至少输出一个全局频道，输出路径与 locale 前缀对齐：

```
dist/feed.xml        → https://example.com/feed.xml
dist/en/feed.xml     → https://example.com/en/feed.xml
```

`channel.link` 与集合的 `feed.link` 都是 **locale 相对路径**（例如 `/blog/`），
主题会自动补上当前语言前缀，不要在配置中重复写 `/en/`。

### 自定义文件名与目录

```ts
export default defineUserConfig({
  theme: plumeTheme({
    feed: {
      filename: {
        rss: 'rss.xml',
        atom: 'atom.xml',
        json: 'feed.json',
      },
      channel: {
        link: '/subscribe/', // 全局频道输出到 dist/subscribe/
        title: '订阅',
        author: { name: 'pengzhanbo', email: 'i@example.com' },
        ttl: 60,
      },
    }
  })
})
```

## 全文模式与体积权衡

`content` 默认为 `'excerpt'`，只输出摘要；设置为 `'full'` 时会输出正文 HTML。

:::: warning 全文模式不渲染 Vue 组件
feed 的正文来自构建期的 `page.contentRendered`，其中主题与 `vuepress-plugin-md-power`
提供的 Vue 组件（`<VPBadge>`、`<VPCard>`、REPL、图表等）尚未被浏览器解析。
生成时这些组件标签会被剥离，仅保留内部文本，读者需要回到原页面查看交互内容。
::::

全文模式会显著增大文件体积。单个频道超过 10 MB 时，构建日志会给出警告，建议改用
`content: 'excerpt'` 或调小 `limit`。

## 安全与隐私

以下页面/内容 **不会** 进入任何 feed：

| 场景 | 处理 |
| --- | --- |
| 页面设置了 `password` | 排除 |
| 命中 `encrypt.rules` | 排除 |
| `encrypt.global` 全站加密 | 整个 feed 功能禁用并警告 |
| `frontmatter.draft: true` | 排除 |
| `frontmatter.article: false` | 排除 |
| `frontmatter.feed: false` | 排除（优先级最高） |
| 首页 / 文章列表 / 标签页等非内容页 | 排除 |
| `::: encrypt` 加密片段 | 正文中的对应标签被移除 |

单页排除：

```yaml
---
title: 内部草稿思路
feed: false
---
```

也可以覆盖单个条目的元信息：

```yaml
---
title: 文章标题
feed:
  title: 订阅器中显示的标题
  summary: 自定义摘要
  guid: /custom-id/
---
```

## 自动发现

构建时，属于某个已生成频道的页面会在 `<head>` 中注入对应的链接：

```html
<link rel="alternate" type="application/rss+xml" title="博客" href="https://example.com/blog/feed.xml">
```

- 每种启用的格式注入一条；
- 页面已声明同类型的 `alternate` 链接时不会重复注入；
- `linkTag: false` 可关闭此行为。

读者只需在 Feedly / Inoreader / NetNewsWire 等阅读器中粘贴站点域名，即可自动发现订阅地址。

## 校验

- RSS / Atom：<https://validator.w3.org/feed/>
- JSON Feed：<https://validator.jsonfeed.org/>

本地验证确定性：

```bash
pnpm docs:build
shasum dist/feed.xml dist/atom.xml dist/feed.json
# 再次构建后比较，结果应当一致
```

## 常见问题

:::collapse

- 提示 `hostname` 相关警告，没有生成文件

  请检查站点配置中的 `hostname` 是否为合法的站点源（origin，例如 `https://example.com`）。
  若站点部署在子路径，请使用 `base`（例如 `/docs/`）而不是把路径写进 `hostname`。

- 两个集合的频道互相覆盖

  频道输出路径 = 频道主页路由 + 文件名。两个集合使用同一个 `link` 时会产生冲突，
  主题会保留先出现的频道并输出警告。请通过 `collections[].feed.link` 指定不同的频道链接。

- feed 中的时间与页面显示不一致

  feed 使用「本地时间 + 时区偏移」输出，例如 `2025-06-10T08:00:00+08:00`。
  若构建机器的时区与作者所在时区不同，字符串会不同，但表示的是同一时刻。
  CI 环境固定 `TZ=Etc/UTC` 时产物可复现。

- 某些文章没有出现在 feed 中

  feed 需要发布时间：`frontmatter.createTime` → `frontmatter.date` → `git.createdTime` →
  `git.updatedTime`，全部缺失的页面会被跳过，构建日志中会统计跳过数量。
  另外请检查页面是否被加密、标记为草稿，或设置了 `article: false` / `feed: false`。

- 开发模式下看不到 feed

  `onGenerated` 只在生产构建时触发。请执行 `vuepress build` 后使用静态服务器预览产物。

:::
