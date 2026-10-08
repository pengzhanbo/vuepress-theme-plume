---
url: /guide/embed/pdf/index.md
---
## 概述

主题支持在 markdown 中嵌入 PDF 文件，它能够在页面中直接阅读 PDF 。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdown-power.md) 提供支持。

## 配置

该功能默认不启用。你需要在主题配置中开启。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      pdf: true, // [!code ++]
    },
  })
})
```

## 语法

最简单的语法如下：

```md
@[pdf](url)
```

当需要打开特定页面时，使用 `page` 选项指定页码。为了兼容旧用法，也支持在 `pdf` 后直接跟随页码的简写形式 `@[pdf 2](url)`。

```md
@[pdf page="2"](url)
```

还可以添加更多的 选项到 `@[pdf ]` 中，更灵活的控制行为。

```md
@[pdf page="2" width="100%" ratio="16:9"](url)
```

* `page` - 页码，默认为 `1`
* `width` - 宽度，默认为 `100%`
* `height` - 高度，默认为 `auto`
* `ratio` - 宽高比，默认为 `1:0.9`，仅当未指定 `height` 时生效

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
