---
url: /guide/embed/pdf/index.md
---
## 概述

主题支持在 markdown 中嵌入 PDF 文件，它能够在页面中直接阅读 PDF 。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdown-power.md) 提供支持。

## 配置

该功能默认不启用。你需要在主题配置中开启。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      pdf: true, // [!code ++]
    },
  }),
})
```

## 语法

最简单的语法如下：

```md
@[pdf](url)
```

### 指定页码

当需要打开特定页面时，使用 `page` 选项指定页码。为了兼容旧用法，也支持在 `pdf` 后直接跟随页码的简写形式 `@[pdf 2](url)`。

```md
@[pdf page="2"](url)  <!-- 推荐写法 -->
@[pdf 2](url)
```

### 更多选项

可以添加更多的选项到 `@[pdf]` 中，更灵活的控制行为：

```md
@[pdf page="2" no-toolbar width="100%" height="600px" zoom="75" ratio="16:9"](url)
```

:::: field-group
::: field page
@type `number`
@default `1`
页码。
:::
::: field no-toolbar
@type `boolean`
@default `false`
隐藏 PDF.js 的工具栏
:::
::: field zoom
@type `number`
@default `50`
缩放级别（百分比数字）
:::
::: field width
@type `string`
@default `100%`
宽度
:::
::: field height
@type `string`
@default undefined
高度。未指定时按自动高度处理
:::
::: field ratio
@type `string`
@default `16/9`
宽高比。仅当未指定 `height` 时生效
:::
::::

::::  details 浏览器不支持内置 PDF 阅读器？
主题使用 `<embed>` 标签渲染 PDF 文件，但部分浏览器不支持内置 PDF 阅读器（通常在移动端浏览器中受限）。

对于不支持的浏览器，主题使用 [PDF.js](https://mozilla.github.io/pdf.js/) 作为降级兼容方案，默认从
`https://static.pengzhanbo.cn/pdfjs/` 加载。

离线构建、内网部署或对第三方资源有合规要求时，可以通过 `markdown.pdf.pdfjsUrl` 指向自托管地址：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      pdf: { pdfjsUrl: '/pdfjs/' },
    },
  }),
})
```

::::

## 示例

### 默认

输入：

```md
@[pdf](https://plume.pengzhanbo.cn/files/sample-1.pdf)
```

输出：

@[pdf](/files/sample-1.pdf)

### 设置页码为 2

输入：

```md
@[pdf page="2"](https://plume.pengzhanbo.cn/files/sample-1.pdf)
```

输出：

@[pdf page="2"](/files/sample-1.pdf)

### 指定高度

输入：

```md
@[pdf height="400px"](https://plume.pengzhanbo.cn/files/sample-1.pdf)
```

输出：

@[pdf height="400px"](/files/sample-1.pdf)

### 宽高比 21:29

输入：

```md
@[pdf ratio="21:29"](https://plume.pengzhanbo.cn/files/sample-1.pdf)
```

输出：

@[pdf ratio="21:29"](/files/sample-1.pdf)
