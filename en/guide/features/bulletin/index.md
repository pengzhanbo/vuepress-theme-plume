---
url: /en/guide/features/bulletin/index.md
---
## Overview

The bulletin is a real-time notification component that enables convenient display of notification messages within the site.

Such as the bulletin in the top-right corner.

## Usage

The theme provides very convenient and flexible methods for using the bulletin.
You can choose the appropriate configuration method based on your requirements.

### Configuration Options

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    bulletin: {
      // more options...
    }
  })
})
```

```ts
interface BulletinOptions {
  /**
   * Bulletin position
   * @default 'top-right'
   */
  layout?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

  /**
   * Whether to display gradient border
   *
   * @default true
   */
  border?: boolean

  /**
   * Pages where the bulletin is displayed
   *
   * - `true` indicates all pages
   * - `false` indicates no display
   * - Pass a function that returns `true` when display is enabled
   */
  enablePage?: boolean | ((page: Page) => boolean)

  /**
   * Bulletin display duration
   *
   * @default 'always'
   *
   * - `'session'`: After closing the bulletin, it won't display again during the current session cycle. It will reappear in new session cycles. Refreshing the page won't make it reappear.
   * - `'always'`: Always display. After closing, refreshing the page will make it reappear.
   * - `'once'`: Display only in the current cycle. After closing, it won't display again. Neither new sessions nor page refreshes will make it reappear.
   */
  lifetime?: 'session' | 'always' | 'once'

  /**
   * Bulletin ID
   *
   * The bulletin display duration uses the `id` as a unique identifier
   */
  id?: string

  /**
   * Bulletin title
   */
  title?: string

  /**
   * Bulletin content
   *
   * Markdown syntax or HTML text can be used.
   * When using markdown, declare `contentType` as `markdown`
   */
  content?: string

  /**
   * Bulletin content type
   *
   * - `markdown` indicates using markdown syntax
   * - `text` indicates using plain text (can be HTML content)
   *
   * @default 'text'
   */
  contentType?: 'markdown' | 'text'

  /**
   * Pass a `markdown` or `html` file path and use the file content as bulletin content
   *
   * - When using `.md` files, markdown syntax will be parsed
   * - When using `.html` files, only include bulletin content. Please avoid using tags like `<html>`, `<body>`, `<script>`, etc.
   */
  contentFile?: string
}
```

## Simple Bulletin

When you only need to configure a simple bulletin with brief content, you can directly use `bulletin.content` to add content.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    bulletin: {
      layout: 'top-right',
      title: 'Bulletin Title',
      content: 'Bulletin content',
    }
  })
})
```

You can also declare `bulletin.contentType` as `markdown` to use markdown syntax in the `content`.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    bulletin: {
      layout: 'top-right',
      title: 'Bulletin Title',
      contentType: 'markdown', // [!code hl]
      content: `\
**Update Notes**

- Added some features
- Fixed some bugs
`,
    }
  })
})
```

## Long Content Bulletin

When you need to configure a bulletin with lengthy content, writing long content in the configuration file
may appear bloated and difficult to read. In such cases, use `bulletin.contentFile` to specify a content
file path, separating the long content from the configuration file.

`bulletin.contentFile` requires an absolute path to a `markdown` or `html` file.
The theme will use the content of this file as the bulletin content.

::: code-tabs
@tab .vuepress/config.ts

```ts
import path from 'node:path'

export default defineUserConfig({
  theme: plumeTheme({
    bulletin: {
      layout: 'top-right',
      title: 'Bulletin Title',
      contentFile: path.join(__dirname, '_bulletin.md'),
    }
  })
})
```

@tab .vuepress/\_bulletin.md

```md
**Update Notes**

- Added some features
- Fixed some bugs
```

:::

The theme monitors changes to `bulletin.contentFile`. When the file content changes, the bulletin will be re-rendered.

## Bulletin with Custom Content Interactions

Using `bulletin.content` or `bulletin.contentFile` only allows writing plain text bulletin content and
some interactive content supported by `markdown` syntax. It does not support writing bulletin content with other custom interactions.

For such scenarios, the theme also provides corresponding support.

First, configure the basic content of `bulletin`. You don't need to configure `bulletin.content` or `bulletin.contentFile` at this point.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    bulletin: {
      layout: 'top-right',
      title: 'Bulletin Title',
    }
  })
})
```

Then, register the global component `BulletinContent` in `.vuepress/client.ts`.
The theme will automatically detect this component and use it as the bulletin content.

```ts title=".vuepress/client.ts"
import { defineClientConfig } from '@vuepress/client'
import BulletinContent from './components/BulletinContent.vue'

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component('BulletinContent', BulletinContent)
  }
})
```

Next, write the `BulletinContent.vue` component.

```vue title=".vuepress/components/BulletinContent.vue"
<script setup>
// Write custom bulletin content interactions
</script>

<template>
  <div class="bulletin-content">
    <!-- Custom bulletin content -->
  </div>
</template>

<style scoped>
/* Custom bulletin content styles */
</style>
```

## Custom Bulletin Styles

You can directly override the bulletin styles via CSS.

Modify the following CSS variables to easily control the bulletin styles.

```css
:root {
  --vp-bulletin-bg-color: var(--vp-c-bg);
  --vp-bulletin-text-color: var(--vp-c-text-1);
  --vp-bulletin-title-color: var(--vp-c-text-1);
  --vp-bulletin-font-size: 16px;
  --vp-bulletin-title-font-size: 18px;
  --vp-bulletin-line-height: 24px;
  --vp-bulletin-border-width: 2px;
  --vp-bulletin-border: conic-gradient(var(--vp-c-important-3), var(--vp-c-danger-3), var(--vp-c-success-3), var(--vp-c-important-3));
  --vp-bulletin-width: 320px;
}
```

Alternatively, override the bulletin styles globally via the `.vp-bulletin` class.

```css
.vp-bulletin {
  /* Bulletin styles */
}
```

## Fully Custom Bulletin

When you don't want to use the theme's built-in bulletin at all, you can completely customize the
bulletin by registering a global `Bulletin` component.

::: code-tabs
@tab .vuepress/client.ts

```ts
import { defineClientConfig } from '@vuepress/client'
import Bulletin from './components/Bulletin.vue'

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component('Bulletin', Bulletin)
  }
})
```

:::

Next, write the `Bulletin.vue` component.

::: code-tabs
@tab .vuepress/components/Bulletin.vue

```vue
<script setup>
// Write custom bulletin
</script>

<template>
  <div class="bulletin">
    <!-- Custom bulletin -->
  </div>
</template>

<style scoped>
/* Custom bulletin styles */
</style>
```

:::

You need to write the bulletin component from scratch. To facilitate writing the bulletin, the theme
provides the composable API `useBulletinControl()`, which you can use directly in the `Bulletin.vue` component.

```ts
import { useBulletinControl } from 'vuepress-theme-plume/composables'

const {
  bulletin, // Bulletin configuration, read from theme configuration
  showBulletin, // Whether to show the bulletin
  enableBulletin, // Whether the bulletin is enabled on the current page
  close, // Close the bulletin
} = useBulletinControl()
```

## Related Notes

### Bulletin Unique Identifier

The bulletin's unique identifier is configured via `bulletin.id`.

The unique identifier is used to distinguish bulletins and determine the validity period of `bulletin.lifetime` based on this identifier.

```ts
export default defineUserConfig({
  theme: plumeTheme({
    bulletin: {
      layout: 'top-right',
      title: 'Bulletin Title',
      id: 'my-bulletin', // [!code hl]
    }
  })
})
```

When you don't explicitly configure `bulletin.id`, the theme generates a hash value based on the `bulletin` object as the unique identifier.

### Bulletin Display Duration

The bulletin display duration is configured via `bulletin.lifetime`.

* `session`: During the current session cycle, if the user doesn't close the bulletin,
  it will continue to display, including into the next session cycle. When the user closes the bulletin,
  it is considered expired and won't display again during the current session cycle, but will reappear in the next session cycle.

* `always`: Even if the user closes the bulletin, it will reappear not only in the next session cycle but also when refreshing the page.

* `once`: Once the bulletin is closed during the current session cycle, it won't display again afterward.

::: details What is a session?
**Session** refers to the period when you visit a site. As long as the browser tab where the site is
located remains open, the site maintains the same session, even if the page is refreshed.
:::

### Bulletin Position

The bulletin position is configured via `bulletin.layout`.

* `top-left`: Top left
* `top-right`: Top right
* `bottom-left`: Bottom left
* `bottom-right`: Bottom right
* `center`: Top center

### Pages Where Bulletin is Displayed

The pages where the bulletin is displayed are configured via `bulletin.enablePage`.

* `true` indicates all pages
* `false` indicates no display
* Pass a function that returns `true` when display is enabled

```ts
export default defineUserConfig({
  theme: plumeTheme({
    bulletin: {
      layout: 'top-right',
      title: 'Bulletin Title',
      enablePage: (page) => {
        return page.path === '/custom-path/'
      }
    }
  })
})
```
