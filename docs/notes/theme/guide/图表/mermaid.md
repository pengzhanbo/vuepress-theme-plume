---
title: mermaid
author: pengzhanbo
createTime: 2024/03/16 19:34:16
icon: file-icons:mermaid
permalink: /guide/chart/mermaid/
---

## 概述

主题支持在 文章中 嵌入由 [Mermaid](https://mermaid.js.org/) 。

该功能由 [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/) 提供支持。

## 配置

主题默认不启用该功能。

你需要在你的项目中安装 [mermaid](https://mermaid.js.org/) 库。

::: code-tabs
@tab pnpm

```sh
pnpm add mermaid
```

@tab npm

```sh
npm install mermaid
```

@tab yarn

```sh
yarn add mermaid
```

:::

然后在 `.vuepress/config.ts` 配置文件中，启用该功能：

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownEnhance: {
        mermaid: true,
      },
    }
  })
})
```

:::

::: note
以下文档 Fork 自 [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/guide/markdown/chart/mermaid.html),
遵循 [MIT](https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/LICENSE) 许可证。
:::

## 语法

````md
```mermaid

<!-- 在此处放置 mermaid 代码 -->

```
````

除了使用 mermaid 代码块，你也可以直接使用以下代码块：

- class: `classDiagram`
- c4c: `C4Context`
- er: `erDiagram`
- gantt: `gantt`
- git-graph: `gitGraph`
- journey: `journey`
- mindmap: `mindmap`
- pie: `pie`
- quadrant: `quadrantChart`
- requirement: `requirementDiagram`
- sankey: `sankey-beta`
- sequence: `sequenceDiagram`
- state: `stateDiagram-v2`
- timeline: `timeline`
- xy: `xychart-beta`

你不需要再声明图表类型，也不需要缩进图表代码。

当图表支持设置标题时，你可以直接在代码块信息后添加标题:

````md
```sequence 代码标题
<!-- 顺序图代码内容
... -->
```
````

配置文档详见 [Mermaid 文档](https://mermaid.js.org/)

## 高级

你可以在 [客户端配置文件](https://vuejs.press/zh/guide/configuration.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
中导入并使用 `defineMermaidConfig` 来自定义 Mermaid 配置:

```ts
import { defineMermaidConfig } from 'vuepress-theme-plume/client'
import { defineClientConfig } from 'vuepress/client'

defineMermaidConfig({
  // 在此设置 mermaid 选项
})

export default defineClientConfig({
  // ...
})
```

## 示例

### 流程图

**输入：**

<!-- @include: ../../snippet/mermaid-1.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-1.snippet.md{2-20} -->

### 循序图

**输入：**

<!-- @include: ../../snippet/mermaid-2.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-2.snippet.md{2-11} -->

### 类图

**输入：**

<!-- @include: ../../snippet/mermaid-3.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-3.snippet.md{2-25} -->

### 状态图

**输入：**

<!-- @include: ../../snippet/mermaid-4.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-4.snippet.md{2-9} -->

### 关系图

**输入：**

<!-- @include: ../../snippet/mermaid-5.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-5.snippet.md{2-15} -->

### 用户日记图

**输入：**

<!-- @include: ../../snippet/mermaid-6.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-6.snippet.md{2-11} -->

### 甘特图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/mermaid-7.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/mermaid-7.snippet.md{2-31} -->

### 饼图

**输入：**

````md
```pie
title What Voldemort doesn't have?
  "FRIENDS" : 2
  "FAMILY" : 3
  "NOSE" : 45
```
````

**输出：**

```pie
title What Voldemort doesn't have?
  "FRIENDS" : 2
  "FAMILY" : 3
  "NOSE" : 45
```

### Git 图表

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/mermaid-8.snippet.md-->
::::

**输出：**

<!-- @include: ../../snippet/mermaid-8.snippet.md{2-44} -->

### C4C 图表

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/mermaid-9.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/mermaid-9.snippet.md{2-34} -->

### 思维导图

**输入：**

<!-- @include: ../../snippet/mermaid-10.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-10.snippet.md{2-19} -->

### 时序图

**输入：**

<!-- @include: ../../snippet/mermaid-11.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-11.snippet.md{2-11} -->

### 桑基图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/mermaid-12.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/mermaid-12.snippet.md{2-71} -->

### 依赖图

**输入：**

<!-- @include: ../../snippet/mermaid-13.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-13.snippet.md{2-15} -->

### 象限图

**输入：**

<!-- @include: ../../snippet/mermaid-14.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-14.snippet.md{2-16} -->

### XY图

**输入：**

<!-- @include: ../../snippet/mermaid-15.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-15.snippet.md{2-8} -->

### 块图

**输入：**

<!-- @include: ../../snippet/mermaid-16.snippet.md -->

**输出：**

<!-- @include: ../../snippet/mermaid-16.snippet.md{2-12} -->

### 复杂例子

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/mermaid-17.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/mermaid-17.snippet.md{2-24} -->
