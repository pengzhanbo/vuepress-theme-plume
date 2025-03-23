---
title: 折叠面板
icon: carbon:collapse-categories
createTime: 2025/03/22 22:27:22
permalink: /guide/markdown/collapse/
badge:
  type: tip
  text: 1.0.0-rc.137 +
---

## 概述

在 markdown 中，使用 `::: collapse` 容器，包含 markdown 无序列表语法，实现 ==折叠面板== 。

- 支持通过 `accordion` 设置为 ==手风琴== 模式

## 启用

该功能默认不启用，你需要在 `theme` 配置中启用。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      collapse: true, // [!code ++]
    }
  })
})
```

## 使用

在 markdown 中，使用 `::: collapse` 容器，包含 markdown 无序列表语法，每一项为一个单独的可折叠区域。

```md title="collapse.md"
::: collapse
- 标题 1        <!-- 标题，点击控制 展开/折叠 -->
                <!-- 标题与内容必须空一行 -->
  内容          <!-- 内容，被折叠的区域-->

- 标题 2

  内容
:::
```

对于列表的每一个项：

- 从 __首行开始__ 到 __首个空行__，均为 __标题__

- __首个空行之后__: 正文内容

:::important 请注意添加正确的缩进
:::

__一个简单的例子：__

__输入：__

```md
::: collapse
- 标题 1

  正文内容

- 标题 2

  正文内容
:::
```

__输出：__

::: collapse

- 标题 1

  正文内容

- 标题 2

  正文内容
:::

## 配置

在 `::: collapse` 容器语法之后，跟随配置项：

- `accordion` ：折叠面板设置为 ==手风琴== 模式，在手风琴模式下，只允许展开一个面板，点击其他面板会关闭之前的面板。
- `expand` ：默认展开面板，在手风琴模式下无效。

在列表项，标题之前，可通过特殊标记 `:+` / `:-` 来设置当前项是否 __展开 / 折叠__。

## 示例

### 基本用法

__输入：__

```md
::: collapse
- 标题 1

  正文内容

- 标题 2

  正文内容
:::
```

__输出：__

::: collapse

- 标题 1

  正文内容

- 标题 2

  正文内容
:::

### 默认全部展开

添加 `expand` 选项，默认展开所有面板

__输入：__

```md /expand/
::: collapse expand
- 标题 1

  正文内容

- 标题 2

  正文内容
:::
```

__输出：__

::: collapse expand

- 标题 1

  正文内容

- 标题 2

  正文内容
:::

### 手风琴模式

添加 `accordion` 选项，设置为手风琴模式，只允许展开一个面板，点击其他面板会关闭之前的面板

```md /accordion/
::: collapse accordion
- 标题 1

  正文内容

- 标题 2

  正文内容

- 标题 3

  正文内容
:::
```

__输出：__

::: collapse accordion

- 标题 1

  正文内容

- 标题 2

  正文内容

- 标题 3

  正文内容
:::

### `:+` 标记项为展开

折叠面板默认全部关闭，可以使用 `:+` 标记项初始状态为展开。

__输入：__

```md /:+/
::: collapse
- 标题 1

  正文内容

- :+ 标题 2

  正文内容

- :+ 标题 3

  正文内容
:::
```

__输出：__

::: collapse

- 标题 1

  正文内容

- :+ 标题 2

  正文内容

- :+ 标题 3

  正文内容
:::

### `:-` 标记项为折叠

折叠面板配置 `expand` 时默认全部展开，可以使用 `:-` 标记项初始状态为折叠。

__输入：__

```md /:-/
::: collapse expand
- 标题 1

  正文内容

- :- 标题 2

  正文内容

- 标题 3

  正文内容
:::
```

__输出：__

::: collapse expand

- 标题 1

  正文内容

- :- 标题 2

  正文内容

- 标题 3

  正文内容
:::
