---
url: /guide/features/replace-assets/index.md
---
## 概述

此功能由 [@vuepress/plugin-replace-assets](https://ecosystem.vuejs.press/zh/plugins/tools/replace-assets.html) 插件提供。

替换站点内的本地资源链接，比如 图片、视频、音频、PDF 等资源的链接地址，将本地资源地址改写到新的地址。

## 为什么需要这个功能？

不少用户会选择将站点的资源存放到 CDN 服务上，从而加速站点的访问速度，提升站点的可用性。

在这个过程中，通常需要先将资源上传到 CDN 服务，然后再获取 CDN 服务的资源链接，最后才在站点内容中使用。

这看起来并没有什么问题，然而在实际使用过程中，可能需要频繁的进行

```txt
上传资源 -> 获取资源链接 -> 在内容中使用全量资源链接
```

在此过程中，内容创作被频繁的打断。

此功能旨在解决这个问题。在内容创作过程中，只需要直接使用本地资源地址，由主题内部在合适的阶段，完成资源地址的替换。

::: important 此功能不会修改源文件，仅在编译后的内容中进行替换
:::

## 使用

主题默认不启用该功能，你可以在配置中启用它：

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

\==建议仅在生产构建时启用资源路径替换，在开发时直接使用本地资源路径=={.important}

```ts title=".vuepress/config.ts" twoslash
import process from 'node:process'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

const isProd = process.env.NODE_ENV === 'production' // [!code ++]

export default defineUserConfig({
  theme: plumeTheme({
    // 仅在生产环境时启用
    replaceAssets: isProd ? 'https://cdn.example.com' : false // [!code ++]
  })
})
```

### 资源管理

**你应该将资源存放在 [.vuepress/public](https://v2.vuepress.vuejs.org/zh/guide/assets.html#public-%E6%96%87%E4%BB%B6) 目录下**:

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

::: tip 为什么需要存放在这个目录下？
当站点完成编译准备部署前，我们可以很方便地直接将这个目录下的文件上传到 CDN 。
:::

在 markdown 中，直接使用本地资源地址：

```md
![foo](/images/foo.jpg)

<img src="/images/foo.jpg">
```

在 `javascript` 中：

```js
const foo = '/images/foo.jpg'

const img = document.createElement('img')
img.src = '/images/foo.jpg'
```

以及在 样式文件 中：

```css
.foo {
  background: url('/images/foo.jpg');
}
```

插件会正确识别这些资源，并在编译后的内容中进行替换。

:::warning 插件不支持识别 `'/images/' + 'foo.jpg'` 拼接的路径。
:::

## 配置说明

```ts
/**
 * 资源链接替换配置
 */
type ReplaceAssetsPluginOptions
  = | Replacement
    | ReplacementRule
    | ReplacementRule[]
    | ReplaceAssetsOptions

/**
 * - `string`：拼接在原始资源链接的前面
 * - `function`：返回替换后的资源链接
 */
type Replacement = string | ((url: string) => string)

interface ReplacementRule {
  /**
   * 匹配资源链接
   */
  find: RegExp | string
  /**
   * 资源链接替换
   */
  replacement: Replacement
}

interface ReplaceAssetsOptions {
  /**
   * 自定义资源替换规则
   */
  rules?: ReplacementRule | ReplacementRule[]
  /**
   * 内置的资源匹配规则替换
   */
  all?: Replacement
  /**
   * 内置的图片资源匹配规则替换
   */
  image?: Replacement
  /**
   * 内置的媒体资源匹配规则替换
   */
  media?: Replacement
}
```

## 内置的资源匹配规则

为便于使用，主题插件内部提供了内置的资源匹配规则，你可以直接使用它们。

* `image`: 查找图片资源，包括 `['apng','bmp','png','jpeg','jpg','jfif','pjpeg','pjp','gif','svg','ico','webp','avif','cur','jxl']` 格式的本地图片资源链接
* `media`: 查找媒体资源，包括 `['mp4','webm','ogg','mp3','wav','flac','aac','opus','mov','m4a','vtt','pdf']` 格式的本地媒体资源链接
* `all`: 查找 图片 和 媒体资源，即 `image` 和 `media` 的合集

直接传入 **资源链接前缀** 或 **资源链接替换函数** 时，主题使用 `all` 规则替换资源链接。

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

也可以针对不同的内置规则，应用不同的资源链接前缀或资源链接替换函数:

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

## 自定义资源匹配规则

你也可以自定义资源匹配规则：

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

还可以自定义多个匹配规则：

```ts title=".vuepress/config.ts"
import process from 'node:process'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    replaceAssets: [ // [!code ++:12]
      // 查找图片资源
      {
        find: /^\/images\/.*\.(jpg|jpeg|png|gif|svg|webp|avif)$/,
        replacement: 'https://image.cdn.com'
      },
      // 查找媒体资源
      {
        find: /^\/medias\/.*\.(mp4|webm|ogg|mp3|wav|flac|aac|m3u8|m3u|flv|pdf)$/,
        replacement: url => `https://media.cdn.com${url}`
      },
    ]
  })
})
```

**`find` 字段说明**

`find` 字段用于匹配资源链接，可以是一个 **正则表达式** 或 **字符串**。

当传入的是一个 `字符串` 时，如果是以 `^` 开头或者以 `$` 结尾的字符串，则会自动转换为一个 **正则表达式**。
否则则会检查资源链接是否 以 `find` 结尾 或者 以 `find` 开头。

```txt
'^/images/foo.jpg' -> /^\/images\/foo.jpg/
'/images/foo.jpg$' -> /^\/images\/foo.jpg$/
```

::: important 所有匹配的资源地址都是以 `/` 开头。
:::
