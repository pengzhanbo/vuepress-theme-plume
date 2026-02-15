---
url: /en/guide/features/replace-assets/index.md
---
## Overview

This feature is powered by the [@vuepress/plugin-replace-assets](https://ecosystem.vuejs.press/en/plugins/tools/replace-assets.html) plugin.

It replaces local asset links within the site, such as images, videos, audio, PDFs, and other resources, rewriting local asset paths to new addresses.

## Why is this feature needed?

Many users choose to store site assets on CDN services to accelerate site access and improve availability.

In this process, assets typically need to be uploaded to the CDN service first, then CDN links are obtained, and finally used in the site content.

This may seem straightforward, but in practice, it often requires repeatedly performing:

```txt
Upload assets → Get asset links → Use full asset links in content
```

During this process, content creation is frequently interrupted.

This feature aims to solve this problem. During content creation,
you only need to use local asset paths directly, and the theme will handle the asset path replacement at the appropriate stage.

::: important This feature does not modify source files; replacements are only made in the compiled content.
:::

## Usage

The feature is disabled by default in the theme. You can enable it in the configuration:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // ReplaceAssetsPluginOptions
    replaceAssets: 'https://cdn.example.com' // [!code ++]
  })
})
```

\==It's recommended to enable asset path replacement only for production builds, using local asset paths directly during development=={.important}

```ts title=".vuepress/config.ts" twoslash
import process from 'node:process'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

const isProd = process.env.NODE_ENV === 'production' // [!code ++]

export default defineUserConfig({
  theme: plumeTheme({
    // Enable only in production environment
    replaceAssets: isProd ? 'https://cdn.example.com' : false // [!code ++]
  })
})
```

### Asset Management

**You should store assets in the [.vuepress/public](https://v2.vuepress.vuejs.org/guide/assets.html#public-files) directory**:

```sh
./docs
├── .vuepress
│ └── public  # [!code hl:6]
│     ├── images
│     │   ├── foo.jpg
│     │   └── bar.jpg
│     └── medias
│         └── foo.mp4
└── README.md
```

::: tip Why store assets in this directory?
When the site is compiled and ready for deployment, we can easily upload files from this directory directly to the CDN.
:::

In markdown, use local asset paths directly:

```md
![foo](/images/foo.jpg)

<img src="/images/foo.jpg">
```

In `javascript`:

```js
const foo = '/images/foo.jpg'

const img = document.createElement('img')
img.src = '/images/foo.jpg'
```

And in style files:

```css
.foo {
  background: url('/images/foo.jpg');
}
```

The plugin will correctly identify these assets and replace them in the compiled content.

:::warning The plugin does not support identifying concatenated paths like `'/images/' + 'foo.jpg'`.
:::

## Configuration Reference

```ts
/**
 * Asset link replacement configuration
 */
type ReplaceAssetsPluginOptions
  = | Replacement
    | ReplacementRule
    | ReplacementRule[]
    | ReplaceAssetsOptions

/**
 * - `string`: Prepended to the original asset link
 * - `function`: Returns the replaced asset link
 */
type Replacement = string | ((url: string) => string)

interface ReplacementRule {
  /**
   * Match asset links
   */
  find: RegExp | string
  /**
   * Asset link replacement
   */
  replacement: Replacement
}

interface ReplaceAssetsOptions {
  /**
   * Custom asset replacement rules
   */
  rules?: ReplacementRule | ReplacementRule[]
  /**
   * Replacement for built-in asset matching rules
   */
  all?: Replacement
  /**
   * Replacement for built-in image asset matching rules
   */
  image?: Replacement
  /**
   * Replacement for built-in media asset matching rules
   */
  media?: Replacement
}
```

## Built-in Asset Matching Rules

For convenience, the theme plugin provides built-in asset matching rules that you can use directly.

* `image`: Finds image assets, including local image resource links with formats `['apng','bmp','png','jpeg','jpg','jfif','pjpeg','pjp','gif','svg','ico','webp','avif','cur','jxl']`
* `media`: Finds media assets, including local media resource links with formats `['mp4','webm','ogg','mp3','wav','flac','aac','opus','mov','m4a','vtt','pdf']`
* `all`: Finds both image and media assets, combining both `image` and `media` rules

When directly passing a **asset link prefix** or **asset link replacement function**, the theme uses the `all` rule to replace asset links.

```ts title=".vuepress/config.ts"
import process from 'node:process'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // replaceAssets: 'https://cdn.example.com' // [!code hl]
    replaceAssets: url => `https://cdn.example.com${url}` // [!code ++]
  })
})
```

You can also apply different asset link prefixes or replacement functions to different built-in rules:

```ts title=".vuepress/config.ts"
import process from 'node:process'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // replaceAssets: {  // [!code hl:4]
    //   image: 'https://image.cdn.com/',
    //   media: 'https://media.cdn.com/'
    // },
    replaceAssets: { // [!code ++:4]
      image: url => `https://image.cdn.com${url}`,
      media: url => `https://media.cdn.com${url}`
    }
  })
})
```

## Custom Asset Matching Rules

You can also define custom asset matching rules:

```ts title=".vuepress/config.ts"
import process from 'node:process'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    replaceAssets: { // [!code ++:4]
      find: /^\/images\/.*\.(jpg|jpeg|png|gif|svg|webp|avif)$/,
      replacement: url => `https://image.cdn.com${url}`
    }
  })
})
```

You can also define multiple matching rules:

```ts title=".vuepress/config.ts"
import process from 'node:process'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    replaceAssets: [ // [!code ++:12]
      // Find image assets
      {
        find: /^\/images\/.*\.(jpg|jpeg|png|gif|svg|webp|avif)$/,
        replacement: 'https://image.cdn.com'
      },
      // Find media assets
      {
        find: /^\/medias\/.*\.(mp4|webm|ogg|mp3|wav|flac|aac|m3u8|m3u|flv|pdf)$/,
        replacement: url => `https://media.cdn.com${url}`
      },
    ]
  })
})
```

**`find` Field Explanation**

The `find` field is used to match asset links and can be a **regular expression** or **string**.

When a `string` is provided, if it starts with `^` or ends with `$`, it will be automatically converted to a **regular expression**.
Otherwise, it will check if the asset link ends with `find` or starts with `find`.

```txt
'^/images/foo.jpg' -> /^\/images\/foo.jpg/
'/images/foo.jpg$' -> /^\/images\/foo.jpg$/
```

::: important All matched asset paths start with `/`.
:::
