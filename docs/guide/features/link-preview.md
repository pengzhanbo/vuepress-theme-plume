---
title: 内链预览
icon: fluent:preview-link-24-regular
createTime: 2026/11/10 10:00:00
permalink: /guide/features/link-preview/
badge: 新
---

## 概述

阅读文档时，正文里的 `详见 [配置说明](../config/theme.md)` 往往需要点进去才知道值不值得看。
内链预览会在鼠标停留在站内链接上时，展示目标页面的标题、摘要、标签与更新时间，
让读者在**不离开当前页面**的情况下判断是否跳转。

::: info **内链预** 览默认关闭
:::

## 快速开始

::::: steps

1. **开启功能**

   在主题配置中开启，`true` 表示使用全部默认值：

   ```ts title=".vuepress/config.ts"
   import { defineUserConfig } from 'vuepress'
   import { plumeTheme } from 'vuepress-theme-plume'

   export default defineUserConfig({
     theme: plumeTheme({
       linkPreview: true,
     }),
   })
   ```

2. **按需调整**

   传入对象可以覆盖任意默认值。文档站通常建议同时展示目标页的标题结构：

   ```ts title=".vuepress/config.ts"
   export default defineUserConfig({
     theme: plumeTheme({
       linkPreview: {
         showHeadings: true,
         excerptLength: 120,
         maxWidth: 360,
       },
     }),
   })
   ```

3. **构建并查看**

   数据在构建时生成，直接访问任意文档页并悬停正文链接即可：

   ```sh
   pnpm docs:build
   ```

:::::

### 只对某个语言开启

配置按**语言环境**生效，语言级配置优先于主题级：

```ts
export default defineUserConfig({
  theme: plumeTheme({
    linkPreview: true,
    locales: {
      '/en/': { linkPreview: false },
    },
  }),
})
```

## 卡片内容

| 内容 | 来源 | 说明 |
| --- | --- | --- |
| 标题 | 目标页渲染后的标题 | 始终与目标页 **标题** 一致 |
| 摘要 | `frontmatter.description` → 正文首个段落 | 纯文本，不含 Markdown 语法、HTML 标签、代码块 |
| 标题结构 | 目标页的 `##` 及以下标题 | 仅在 `showHeadings: true` 时展示 |
| 标签 | 目标页 `frontmatter.tags` | 最多 4 个 |
| 更新时间 | git 插件的 `updatedTime` | 无 git 数据时自动省略 |

## 关闭预览

按粒度从大到小：

| 粒度 | 写法 |
| --- | --- |
| 全站 | `linkPreview: false`（默认） |
| 某语言 | `locales: { '/en/': { linkPreview: false } }` |
| 某页面 | frontmatter `linkPreview: false` |
| 某目标页永不出现 | `linkPreview: { exclude: ['/changelog/**'] }` |
| 某链接 | `<a href="/x/" data-no-link-preview>` 或 `<a href="/x/" class="no-link-preview">` |

单条链接的关闭标记同时支持 Markdown 链接与裸 HTML 锚点：

```md
[不展示预览](/guide/features/link-preview/){.no-link-preview}
```

## 覆盖范围

预览依赖构建期的内链数据，以下写法**不会**触发预览：

- 裸 HTML 相对锚点，例如 `<a href="../x.md">`：浏览器会按当前页面 URL 解析，
  若指向的不是真实路由，则不会有预览；
- Vue 组件内部生成的链接，例如 `<VPLinkCard>`、`<VPLink>`；
- 外链：预览只针对站内链接。

## 安全性

- **加密页面与草稿页面永远不会出现在预览数据中**
- 预览数据只包含公开页面的元数据，不改变任何既有产物；
- 关闭功能时，构建期不产生任何字段，客户端不绑定任何监听、不渲染任何 DOM。

## 常见问题

:::: details 为什么某条链接没有预览？

- 该链接指向的页面不存在（改名、拼写错误、`permalink` 变更后的旧链接）；
- 目标页是加密页面或草稿；
- 目标页命中了 `exclude`；
- 链接不是 Markdown 内链（见 [覆盖范围](#覆盖范围)）；
- 当前页配置了 `linkPreview: false`，或功能整体未开启。

::::

:::: details 开发模式下修改了目标页标题，为什么预览还是旧的？

预览数据属于源页的页面数据。修改目标页后，源页的数据已重新计算，
但源页的页面模块需要重新渲染才会更新 —— **刷新页面即可**。

::::

:::: details 为什么卡片不能点击？

悬停 → 移动鼠标 → 卡片消失，会让「可点击的卡片」变成新的可用性问题；
卡片内出现第二个可点击目标也会污染 `Tab` 序列。卡片只做信息补充，
它展示的正是当前链接本身。

::::
