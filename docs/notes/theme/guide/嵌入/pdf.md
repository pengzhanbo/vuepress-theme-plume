---
title: PDF 阅读
icon: teenyicons:pdf-outline
createTime: 2024/03/28 13:30:53
permalink: /guide/embed/pdf/
---

## 概述

主题支持在 markdown 中嵌入 PDF 文件，它能够在页面中直接阅读 PDF 。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdownPower.md) 提供支持。

## 配置

该功能默认不启用。你需要在主题配置中开启。

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        pdf: true,
      },
    }
  })
})
```

:::

## 语法

最简单的语法如下：

```md
@[pdf](url)
```

当需要打开特定页面时，在 `pdf` 后面跟随一个 页数。

```md
@[pdf 2](url)
```

还可以添加更多的 选项到 `@[pdf ]` 中，更灵活的控制行为。

```md
@[pdf 2 no-toolbar width="100%" height="400px" ratio="16:9" zoom="100"](url)
```

- `no-toolbar` - 不显示工具栏
- `width` - 宽度，默认为 100%
- `height` - 高度，默认为 `auto`
- `ratio` - 宽高比, 默认为 `16:9`, 仅当未指定高度时生效
- `zoom` - 缩放比例, 百分比。

## 示例

### 默认

输入：

```md
@[pdf](https://plume.pengzhanbo.cn/files/sample.pdf)
```

输出：

@[pdf](/files/sample.pdf)

### 设置页码为 2

输入：

```md
@[pdf 2](https://plume.pengzhanbo.cn/files/sample.pdf)
```

输出：

@[pdf 2 zoom="95"](/files/sample.pdf)

### 不显示工具栏

输入：

```md
@[pdf no-toolbar](https://plume.pengzhanbo.cn/files/sample.pdf)
```

输出：

@[pdf no-toolbar](/files/sample.pdf)

### 缩放比 90%

输入：

```md
@[pdf zoom="90"](https://plume.pengzhanbo.cn/files/sample.pdf)
```

输出：

@[pdf zoom="90"](/files/sample.pdf)

### 宽高比 21:29

输入：

```md
@[pdf zoom="95" ratio="21:29"](https://plume.pengzhanbo.cn/files/sample.pdf)
```

输出：

@[pdf zoom="95" ratio="21:29"](/files/sample.pdf)
