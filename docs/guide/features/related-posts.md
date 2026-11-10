---
title: 相关文章推荐
icon: hugeicons:chart-relationship
createTime: 2026/11/08 10:00:00
permalink: /guide/features/related-posts/
badge: 新
---

## 概述

在文章 / 文档页底部展示相关内容，帮助读者继续阅读，同时增强站内链接。

推荐结果在 ==构建期== 计算完成并写入页面数据，客户端只负责渲染。

:::: info 默认关闭

`relatedPosts` 默认关闭，需要显式开启（`relatedPosts: true` 即可使用默认配置）。

::::

## 快速开始

:::: steps

1. **开启功能**

   在主题配置中开启，`true` 表示使用全部默认值：

   ```ts title=".vuepress/config.ts"
   import { defineUserConfig } from 'vuepress'
   import { plumeTheme } from 'vuepress-theme-plume'

   export default defineUserConfig({
     theme: plumeTheme({
       relatedPosts: true,
     }),
   })
   ```

2. **按需调整**

   传入对象可以覆盖任意默认值：

   ```ts title=".vuepress/config.ts"
   export default defineUserConfig({
     theme: plumeTheme({
       relatedPosts: {
         limit: 4,
         minScore: 0.12,
         diversity: 0.3,
       },
     }),
   })
   ```

3. **运行并查看**

::::

### 只对某个集合开启

集合级配置优先于主题级配置，未设置的集合不会受到影响：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        relatedPosts: { limit: 6 },
      },
    ],
  }),
})
```

### 相似度信号

对每个集合内的页面，提取以下信号并加权：

| 信号 | 来源 | 默认权重 |
| --- | --- | --- |
| 标签 | `frontmatter.tags` | 3 |
| 分类 | 自动分类结果 | 2 |
| 标题 | 页面标题 | 2 |
| 标题结构 | 正文中的 `##` ~ `######` | 1.5 |
| 正文 | Markdown 正文（默认取前 2000 字符） | 1 |

信号被转换为带字段前缀的词项（例如标签 `vue` 记为 `#g:vue`），再以
**TF-IDF + 余弦相似度** 计算两两相关度。

- **同集合、同语言**：默认只在当前集合、当前语言内推荐，博客与文档、中文站与英文站互不影响
- **候选裁剪**：先建立倒排索引，只对存在共享词项的页面打分，复杂度接近线性
- **高频词抑制**：正文中出现在 30% 以上文档中的词会被忽略（仅在文档数 ≥ 10 时生效），
  标签、分类、标题不受影响
- **多样性**：取 Top-N 前用 MMR（最大边际相关性）在更宽的候选池里重新挑选，
  避免 N 条推荐都是同一系列的相邻文章
- **多语言分词**：中文使用 `Intl.Segmenter`（可切换为 2-gram），日文、韩文自动使用
  对应语言的分词器；拉丁（含变音符号）、西里尔、希腊文字按词切分
- **确定性**：相同分数按创建时间、路径排序，同一份源码重复构建结果一致

:::: note 为什么不使用向量检索

文档站的规模通常在数百到数千篇之间，TF-IDF 在可解释性、构建耗时、产物体积上
都更有优势，也不需要在构建时调用任何外部服务。

::::

## 配置

完整的配置项说明见 [主题配置 - relatedPosts](../../config/theme.md#relatedposts)。

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `limit` | `number` | `4` | 推荐条数，取值 1–12 |
| `minScore` | `number` | `0.12` | 相似度阈值，低于该值不展示 |
| `diversity` | `number` | `0.3` | 结果多样性，`0` 关闭 |
| `recency` | `number` | `0` | 时间衰减半衰期（年），`0` 不考虑新旧 |
| `scope` | `'collection' \| 'locale'` | `'collection'` | 候选范围 |
| `weights` | `object` | 见上文 | 各信号权重 |
| `showExcerpt` | `boolean` | `false` | 是否展示摘要 |
| `contentLimit` | `number` | `2000` | 参与计算的正文长度 |
| `cjk` | `'segmenter' \| 'bigram'` | `'segmenter'` | 中文分词策略 |
| `exclude` | `string[]` | `[]` | 排除的路径，支持 glob |
| `debug` | `boolean` | `false` | 输出评分明细 |

::: tip 常用组合

- **更聚焦**：降低 `diversity`（如 `0.1`）或提高 `minScore`
- **更发散**：提高 `diversity`（如 `0.5`）或降低 `minScore`
- **优先新文章**：设置 `recency`（如 `0.5`，即半衰期半年）
- **跨集合推荐**：设置 `scope: 'locale'`

:::

## 手动指定

单篇文章可以用 frontmatter 完全接管推荐结果：

```yaml title="blog/hello.md"
---
relatedPosts:
  - /blog/vue3-reactivity/
  - /blog/vue3-computed/
---
```

或者关闭当前页的推荐：

```yaml title="blog/hello.md"
---
relatedPosts: false
---
```

手动列表在 ==构建期== 解析：链接指向的页面不存在时会在构建日志中给出警告，
不会生成失效链接。

## 调优

:::: steps

1. **打开调试日志**

   ```ts title=".vuepress/config.ts"
   export default defineUserConfig({
     theme: plumeTheme({
       relatedPosts: { debug: true },
     }),
   })
   ```

2. **观察分数分布**

   构建时会输出每篇页面的 Top-N 分数：

   ```log
   [related-posts]
   /blog/vue3-reactivity/
     0.482  /blog/vue3-ref/
     0.311  /blog/vue3-computed/
   ```

3. **按目标调整**

   | 现象 | 调整方式 |
   | --- | --- |
   | 大部分页面没有推荐 | 降低 `minScore`（如 `0.08`）或提高 `weights.content` |
   | 推荐内容明显无关 | 提高 `minScore`（如 `0.2`）、提高 `weights.tags`、降低 `weights.content` |
   | 推荐高度重复 | 提高 `diversity` |
   | 旧文章长期占位 | 设置 `recency` |

::::

## 注意事项

- **加密页面与草稿页面不会作为推荐结果出现**
- 只处理真实 Markdown 内容页：`article: false`、`home` / `friends` 等布局页面、
  主题生成的虚拟列表页（标签页、归档页等）均不参与推荐
- `frontmatter.relatedPosts` 只在功能已开启的集合内生效
