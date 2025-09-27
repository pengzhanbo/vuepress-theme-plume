---
title: 缩写词
icon: mdi:tooltip-question-outline
createTime: 2025/02/23 10:48:15
permalink: /guide/markdown/abbreviation/
---

## 概述

**缩写词** 是指在 Markdown 中使用的简称，例如 一些专业名词如 W3C 、 ECMA 等。

在 鼠标移动到缩写词上时，显示该名词的完整名称，还可以包括缩写词的定义、解释等。

## 配置

该功能默认不启用，你需要在 `theme` 配置中启用。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      abbr: true, // [!code ++]
    }
  })
})
```

## 语法

在 Markdown 中，在单独的一行中使用 `*[缩写词]: 描述` 来定义缩写词，描述可以包括缩写词的定义、解释等。

在 `[]` 中填写缩写词，在 `:` 后面填写描述，在描述中可以使用 Markdown 内联语法。

Markdown 普通文本中如果包含了定义的缩写词，则鼠标移动到该缩写词时自动显示缩写词的解释。

**输入：**

```md
The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
```

**输出：**

The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
*[ECMA]: European Computer Manufacturers Association

::: warning 缩写词应该是独立的单词或词组。对于中文的缩写词，应该在词的左右加空格以区分。
:::
