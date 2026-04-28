---
url: /guide/layout-slots/index.md
---
## 概述

主题通过 `<Layout />` 和 `<NotFound />` 提供了 丰富的 布局插槽，可以通过这些插槽，在 页面 的不同位置注入内容。
以便用户可以个性化的使用主题。

## 使用

以 `<Layout />` 为例，首先，需要创建一个 客户端配置文件： `.vuepress/client.ts`:

```ts title=".vuepress/client.ts"
import { defineClientConfig } from 'vuepress/client'
import Layout from './layouts/Layout.vue'

export default defineClientConfig({
  layouts: {
    Layout,
  },
})
```

::: info
`layouts` 中的 `Layout` 名是固定的，这是 js 的简写语法， 实际上为 `Layout: Layout`，它是实现 布局插槽的关键。
`NotFound` 也是相同的规则。

你传入的其它非 `Layout` / `NotFound` 的组件，被认为是自定义布局组件。
:::

然后，创建一个 `.vuepress/layouts/Layout.vue`，作为布局插槽的默认组件，在该组件中引入 当前主题的 `<Layout />` 组件。

```vue {7-11} title=".vuepress/layouts/Layout.vue"
<script setup>
import { Layout } from 'vuepress-theme-plume/client' // [!code hl]
</script>

<template>
  <Layout>
    <template #page-bottom>
      <div class="custom-content">
        自定义内容
      </div>
    </template>
  </Layout>
</template>

<style>
.custom-content {
  width: 100%;
}
</style>
```

也可以使用 渲染函数 实现注入内容，在 `.vuepress/client.ts` 中：

::: code-tabs
@tab .vuepress/client.ts

```ts
import { h } from 'vue'
import { Layout } from 'vuepress-theme-plume/client'
import { defineClientConfig } from 'vuepress/client'
import CustomContent from './components/CustomContent.vue'

export default defineClientConfig({
  layouts: {
    Layout: () => h(Layout, null, {
      'page-bottom': () => h(CustomContent),
    }),
  },
})
```

@tab .vuepress/components/CustomContent.vue

```vue
<template>
  <div class="custom-content">
    Custom Content
  </div>
</template>
```

:::

## 插槽

::: info
您可以预览 <https://plume-layout-slots.netlify.app> 以查看所有可用的插槽在站点中的位置。
:::

### `<Layout />` 插槽

* 当 `pageLayout: doc` 时：

  * `doc-top`
  * `doc-bottom`
  * `doc-content-before`
  * `doc-footer-before`
  * `doc-before`
  * `doc-after`
  * `doc-title-before`
  * `doc-title-after`
  * `doc-meta-top`
  * `doc-meta-bottom`
  * `doc-meta-before`
  * `doc-meta-after`
  * `sidebar-nav-before`
  * `sidebar-nav-after`
  * `aside-top`
  * `aside-bottom`
  * `aside-outline-before`
  * `aside-outline-after`

* 当 `pageLayout: page` 时：

  * `page-top`
  * `page-bottom`

* 在 post 集合相关页面 中 （包括 文章列表页、标签页、归档页 均适用）：

  * `posts-top`
  * `posts-bottom`
  * `posts-aside-top`
  * `posts-aside-bottom`
  * `posts-extract-before`
  * `posts-extract-after`

* 在 文章列表页 中：

  * `posts-post-list-before`
  * `posts-post-list-after`
  * `posts-post-list-pagination-after`

* 在 标签页 中：

  * `posts-tags-before`
  * `posts-tags-title-after`
  * `posts-tags-content-before`
  * `posts-tags-after`

* 在 归档页 中：

  * `posts-archives-before`
  * `posts-archives-after`

* 在 分类页 中：

  * `posts-categories-before`
  * `posts-categories-content-before`
  * `posts-categories-after`

### `<NotFound />` 插槽

* `not-found`

### 通用插槽

以下插槽在 `<Layout />` 和 `<NotFound />` 中都支持：

* `layout-top`
* `layout-bottom`
* `nav-bar-title-before`
* `nav-bar-title-after`
* `nav-bar-content-before`
* `nav-bar-content-after`
* `nav-bar-menu-before`
* `nav-bar-menu-after`
* `nav-screen-content-before`
* `nav-screen-content-after`
* `nav-screen-menu-before`
* `nav-screen-menu-after`
* `footer-content`
* `bulletin-content`
