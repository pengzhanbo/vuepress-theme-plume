---
title: Markdown Power
createTime: 2024/04/04 06:56:33
permalink: /config/plugins/markdown-power/
---

## 概述

为 主题 提供 Markdown 增强功能。

关联插件: [@vuepress-plume/plugin-md-power](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-md-power)

## 配置

默认配置：

::: code-tabs
@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        fileTree: true, // :::file-tree  文件树容器
        plot: true, // !!plot!! 隐秘文本
        icons: true, // :[collect:name]:   内联 iconify 图标

        // 默认不启用以下功能，你需要手动开启它们
        // pdf: true, // @[pdf](url)  嵌入 PDF 文件
        // bilibili: true, // @[bilibili](bvid)  嵌入 bilibili 视频
        // youtube: true, // @[youtube](id)  嵌入 youtube 视频
        // codepen: true, // @[codepen](user/slash)  嵌入 codepen
        // replit: true, // @[replit](user/repl-name)  嵌入 Replit
        // codeSandbox: true, // @[codesandbox](id)  嵌入 CodeSandbox
        // jsfiddle: true, // @[jsfiddle](id)  嵌入 jsfiddle
        // caniuse: true, // @[caniuse](feature)  嵌入 caniuse
        // repl: true, // :::go-repl   :::kotlin-repl  :::rust-repl

        // imageSize: true, // 在构建阶段为 图片添加 width/height 属性
      }
    }
  }),
})
```

:::

## 功能

### 嵌入 PDF

插件默认不启用该功能，你需要手动设置 `pdf` 为 `true`

__语法:__

```md
@[pdf](url)
```

请查看 [完整使用文档](../../guide/嵌入/pdf.md)

### iconify 图标

插件默认不启用该功能，你需要手动设置 `icons` 为 `true`

得益于 [iconify](https://iconify.design/), 你可以在 Markdown 中使用 iconify __200k+__ 的图标

__语法:__

```md
:[collect:name]:
```

请查看 [完整使用文档](../../guide/markdown/图标.md)

### bilibili 视频

插件默认不启用该功能，你需要手动设置 `bilibili` 为 `true`

__语法:__

```md
@[bilibili](bvid)
```

请查看 [完整使用文档](../../guide/嵌入/bilibili.md)

### youtube 视频

插件默认不启用该功能，你需要手动设置 `youtube` 为 `true`

__语法:__

```md
@[youtube](id)
```

请查看 [完整使用文档](../../guide/嵌入/youtube.md)

### codePen 代码演示

插件默认不启用该功能，你需要手动设置 `codepen` 为 `true`

__语法:__

```md
@[codepen](user/slash)
```

请查看 [完整使用文档](../../guide/代码演示/codepen.md)

### codeSandbox 代码演示

插件默认不启用该功能，你需要手动设置 `codeSandbox` 为 `true`

__语法:__

```md
@[codesandbox](id)
```

请查看 [完整使用文档](../../guide/代码演示/codeSandbox.md)

### jsfiddle 代码演示

插件默认不启用该功能，你需要手动设置 `jsfiddle` 为 `true`

__语法:__

```md
@[jsfiddle](id)
```

请查看 [完整使用文档](../../guide/代码演示/jsFiddle.md)

### caniuse 浏览器支持

插件默认不启用该功能，你需要手动设置 `caniuse` 为 `true`

__语法:__

```md
@[caniuse](feature)
```

请查看 [完整使用文档](../../guide/markdown/caniuse.md)

### Repl 代码演示容器

插件默认不启用该功能，你需要手动设置 `repl` 为 `true`

支持在线运行 Rust、Golang、Kotlin 代码，还支持在线编辑。

或者开启部分功能，如下所示

``` ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        repl: {
          rust: true,
          go: true,
          kotlin: true,
        },
      },
    }
  })
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
````

请查看完整使用文档:

- [代码演示 > Rust](../../guide/代码演示/rust.md)
- [代码演示 > Golang](../../guide/代码演示/golang.md)
- [代码演示 > Kotlin](../../guide/代码演示/kotlin.md)

### Plot 隐秘文本

插件默认不启用该功能，你需要手动设置 `plot` 为 `true`

__语法:__

```md
!!content!!
```

请查看 [完整使用文档](../../guide/markdown/隐秘文本.md)

### 文件树

插件默认不启用该功能，你需要手动设置 `fileTree` 为 `true`

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

请查看 [完整使用文档](../../guide/markdown/文件树.md)

### 图片尺寸

该功能会为 markdown 文件中的 图片引用 添加当前图片的 `width` 和 `height` 属性。
通过读取 图片的原始尺寸大小，为 图片设置默认的 图片尺寸 和 比例。
从而解决页面在图片加载未完成到完成时，布局闪烁的问题。

插件默认不启用该功能，你需要手动设置 `imageSize`：

- 如果 `imageSize` 为 `true`，则插件仅处理本地图片，等同于 `local` 选项；
- 如果 `imageSize` 为 `'local'`，则插件仅处理本地图片；
- 如果 `imageSize` 为 `'all'`，则插件同时处理本地图片和远程图片。

::: important
__此功能仅在构建生产包时生效。__

请谨慎 使用 `'all'` 选项，由于该选项会在 构建生产包时，请求远程图片资源，这会使得构建时间变长。
虽然主题做了优化仅会加载图片 __几 KB__ 的数据包 用于分析尺寸，但还是会实际影响构建时间。
:::
