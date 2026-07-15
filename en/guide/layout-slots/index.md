---
url: /en/guide/layout-slots/index.md
---
## Overview

The theme provides extensive layout slots through `<Layout />` and `<NotFound />` components,
allowing content injection at different positions of the page. This enables users to personalize the theme according to their needs.

## Usage

Taking `<Layout />` as an example, first create a client configuration file: `.vuepress/client.ts`:

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
The `Layout` name in `layouts` is fixed. This uses JavaScript shorthand syntax,
essentially equivalent to `Layout: Layout`, which is crucial for implementing layout slots.
The same rule applies to `NotFound`.

Other components passed that are not `Layout`/`NotFound` are considered custom layout components.
:::

Then, create `.vuepress/layouts/Layout.vue` as the default component for layout slots,
and import the current theme's `<Layout />` component in this file.

```vue {7-11} title=".vuepress/layouts/Layout.vue"
<script setup>
import { Layout } from 'vuepress-theme-plume/client' // [!code hl]
</script>

<template>
  <Layout>
    <template #page-bottom>
      <div class="custom-content">
        Custom Content
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

Content injection can also be implemented using render functions in `.vuepress/client.ts`:

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

## Slots

::: info
You can preview <https://plume-layout-slots.netlify.app> to see the positions of all available slots in the site.
:::

### `<Layout />` Slots

* When `pageLayout: doc`:

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

* When `pageLayout: page`:

  * `page-top`
  * `page-bottom`

* In post collection related pages (applicable to post list pages, tags pages, and archives pages):

  * `posts-top`
  * `posts-bottom`
  * `posts-aside-top`
  * `posts-aside-bottom`
  * `posts-extract-before`
  * `posts-extract-after`

* In post list pages:

  * `posts-post-list-before`
  * `posts-post-list-after`
  * `posts-post-list-pagination-after`

* In tags pages:

  * `posts-tags-before`
  * `posts-tags-title-after`
  * `posts-tags-content-before`
  * `posts-tags-after`

* In archives pages:

  * `posts-archives-before`
  * `posts-archives-after`

* In categories pages:

  * `posts-categories-before`
  * `posts-categories-content-before`
  * `posts-categories-after`

### `<NotFound />` Slots

* `not-found`

### Common Slots

The following slots are supported in both `<Layout />` and `<NotFound />`:

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
