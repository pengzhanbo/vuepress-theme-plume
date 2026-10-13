---
title: Markdown Power
createTime: 2024/04/04 06:56:33
permalink: /config/plugins/markdown-power/
---

## 概述

为主题提供 Markdown 增强功能。

关联插件: [vuepress-plugin-md-power](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-md-power)

## 配置

默认配置：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      fileTree: true, // :::file-tree  文件树容器
      plot: true, // !!plot!! 隐秘文本
      icon: {}, // ::collect:name::   内联图标
      // 以下功能默认不启用，需要手动开启
      // npmTo: true, // :::npm-to
      // demo: true, // :::demo
      // pdf: true, // @[pdf](url)  嵌入 PDF 文件
      // bilibili: true, // @[bilibili](bvid)  嵌入 bilibili 视频
      // acfun: true, // @[acfun](id)  嵌入 AcFun 视频
      // youtube: true, // @[youtube](id)  嵌入 youtube 视频
      // codepen: true, // @[codepen](user/slash)  嵌入 codepen
      // codeSandbox: true, // @[codesandbox](id)  嵌入 CodeSandbox
      // jsfiddle: true, // @[jsfiddle](id)  嵌入 jsfiddle
      // caniuse: true, // @[caniuse](feature)  嵌入 caniuse
      // repl: true, // :::go-repl   :::kotlin-repl  :::rust-repl  :::python-repl
      // imageSize: true, // 在构建阶段为 图片添加 width/height 属性
      // replit: true, // 已弃用，请使用 repl
    },
  }),
})
```

关于配置入口的优先级说明，请参考 [插件配置入口](./README.md#配置入口优先级)。

## 功能

### 嵌入 PDF

插件默认不启用该功能，你需要手动设置 `pdf` 为 `true`

__语法:__

```md
@[pdf](url)
```

请查看 [完整使用文档](../../guide/embed/v-pdf.md)

### iconify 图标

主题默认启用图标支持（等价于 `icon: {}`），无需额外配置。

得益于 [iconify](https://iconify.design/), 你可以在 Markdown 中使用 iconify __200k+__ 的图标

__语法:__

```md
::collect:name::
```

请查看 [完整使用文档](../../guide/markdown/v-icons.md)

`icon` 的类型为 `IconOptions`（对象），**不接受 `boolean`**。`icon: true` 不会被识别，
请使用 `icon: {}` 或 `icon: { provider: 'iconify' }`。
原 `icons` 字段已弃用，其行为等价于 `icon: {}`。

也可以传入对象进行更详细的配置：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      icon: {
        // 图标提供商，默认 'iconify'
        provider: 'iconify', // 'iconify' | 'iconfont' | 'fontawesome'
        // 图标大小，默认 '1em'
        size: '1em',
        // 图标颜色，默认 'currentColor'
        color: 'currentColor',
        // 图标前缀
        // iconify: 默认 ''，支持如 'mdi'、'ri' 等集合名
        // iconfont: 默认 'iconfont icon-'
        // fontawesome: 默认 'fas'
        prefix: '',
        // 仅 iconify: 预加载图标，用于组件中直接使用 <VPIcon> 时预设本地资源
        preload: ['mdi:home', 'ri:github-fill'],
        // 仅 iconfont/fontawesome: 图标资源链接
        // assets: '//at.alicdn.com/t/font_xxx.css',
      },
    },
  }),
})
```

### bilibili 视频

插件默认不启用该功能，你需要手动设置 `bilibili` 为 `true`

__语法:__

```md
@[bilibili](bvid)
```

请查看 [完整使用文档](../../guide/embed/bilibili.md)

### AcFun 视频

插件默认不启用该功能，你需要手动设置 `acfun` 为 `true`

__语法:__

```md
@[acfun](id)
```

请查看 [完整使用文档](../../guide/embed/acfun.md)

### youtube 视频

插件默认不启用该功能，你需要手动设置 `youtube` 为 `true`

__语法:__

```md
@[youtube](id)
```

请查看 [完整使用文档](../../guide/embed/youtube.md)

### codepen 代码演示

插件默认不启用该功能，你需要手动设置 `codepen` 为 `true`

__语法:__

```md
@[codepen](user/slash)
```

请查看 [完整使用文档](../../guide/repl/v-codepen.md)

### codeSandbox 代码演示

插件默认不启用该功能，你需要手动设置 `codeSandbox` 为 `true`

__语法:__

```md
@[codesandbox](id)
```

请查看 [完整使用文档](../../guide/repl/v-code-sandbox.md)

### jsfiddle 代码演示

插件默认不启用该功能，你需要手动设置 `jsfiddle` 为 `true`

__语法:__

```md
@[jsfiddle](id)
```

请查看 [完整使用文档](../../guide/repl/v-js-fiddle.md)

### caniuse 浏览器支持

插件默认不启用该功能，你需要手动设置 `caniuse` 为 `true`

__语法:__

```md
@[caniuse](feature)
```

请查看 [完整使用文档](../../guide/markdown/v-caniuse.md)

### Repl 代码演示容器

插件默认不启用该功能，你需要手动设置 `repl` 为 `true`

支持在线运行 Rust、Golang、Kotlin、Python 代码，还支持在线编辑。

也可以只开启部分语言，此时使用顶层 `markdown` 入口（推荐）：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      repl: {
        rust: true,
        go: true,
        kotlin: true,
        python: true,
      },
    },
  }),
})
```

__语法:__

````md
::: rust-repl
```rust
// rust code
```
:::

::: go-repl
```go
// go code
```
:::

::: kotlin-repl
```kotlin
// kotlin code
```
:::

::: python-repl
```python
# python code
```
:::
````

请查看完整使用文档:

- [代码演示 > Rust](../../guide/repl/rust.md)
- [代码演示 > Golang](../../guide/repl/golang.md)
- [代码演示 > Kotlin](../../guide/repl/kotlin.md)
- [代码演示 > Python](../../guide/repl/python.md)

### Plot 隐秘文本

主题默认启用该功能，设置为 `false` 可关闭。

__语法:__

```md
!!content!!
```

请查看 [完整使用文档](../../guide/markdown/v-plot.md)

### 文件树

主题默认启用该功能，设置为 `false` 可关闭。

__语法:__

```md
::: file-tree

- folder1
  - file1.md
  - file2.ts
  - folder2
    - file3.md
- folder3

:::
```

请查看 [完整使用文档](../../guide/markdown/v-file-tree.md)

### 图片尺寸

该功能会为 markdown 文件中的图片引用添加当前图片的 `width` 和 `height` 属性。
通过读取图片的原始尺寸大小，为图片设置默认的图片尺寸和 比例。
从而解决页面在图片加载未完成到完成时，布局闪烁的问题。

插件默认不启用该功能，你需要手动设置 `imageSize`：

- 如果 `imageSize` 为 `true`，则插件仅处理本地图片，等同于 `local` 选项；
- 如果 `imageSize` 为 `'local'`，则插件仅处理本地图片；
- 如果 `imageSize` 为 `'all'`，则插件同时处理本地图片和远程图片。

::: important
__此功能仅在构建生产包时生效。__

请谨慎使用 `'all'` 选项，由于该选项会在构建生产包时，请求远程图片资源，这会使得构建时间变长。
虽然主题做了优化仅会加载图片 __几 KB__ 的数据包用于分析尺寸，但还是会实际影响构建时间。
:::
