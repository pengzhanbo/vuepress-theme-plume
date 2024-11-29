---
title: ECharts
author: pengzhanbo
createTime: 2024/03/16 19:34:03
icon: raphael:piechart
permalink: /guide/chart/echarts/
---

## 概述

主题支持在文章中嵌入 [ECharts](https://echarts.apache.org/zh/index.html) 图表。

该功能由 [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/) 提供支持。

## 配置

主题默认不启用该功能。

你需要在你的项目中安装 [ECharts](https://echarts.apache.org/zh/index.html) 库。

::: code-tabs
@tab pnpm

```sh
pnpm add echarts
```

@tab npm

```sh
npm install echarts
```

@tab yarn

```sh
yarn add echarts
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
        echarts: true,
      },
    }
  })
})
```

:::

::: note
以下文档 Fork 自 [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/guide/markdown/chart/echarts.html),
遵循 [MIT](https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/LICENSE) 许可证。
:::

## 语法

### JSON 配置

如果你可以很轻松的生成数据，你可以直接通过一个 JSON 代码块来提供 Echarts 配置:

````md
::: echarts 标题

```json
{
  // 此处为 ECharts 图表配置
}
```

:::
````

### JavaScript 配置

如果你需要通过脚本来获取数据，你可以使用 js 和 javascript 的代码块。

我们将通过 `myChart` 变量暴露 Echarts 实例，并且你应该将 Echart 配置赋值给 `option` 变量。
同时，你也可以赋值 `width` 和 `height` 来设置图表大小。

````md
::: echarts Title
```js
const option = {
  // 此处为 ECharts 图表配置
}
```
:::
````

:::tip
你可以使用顶级 `await` 和 `fetch` 来从网络请求中获取数据。
:::

相关配置，详见 [ECharts 文档](https://echarts.apache.org/handbook/zh/get-started/)

## 高级

你可以在 [客户端配置文件](https://vuejs.press/zh/guide/configuration.html##使用脚本) 中导入并使用 `defineEchartsConfig` 来自定义 Echarts:

```ts
import { defineEchartsConfig } from 'vuepress-theme-plume/client'
import { defineClientConfig } from 'vuepress/client'

defineEchartsConfig({
  options: {
    // 全局 Echarts 配置
  },
  setup: async () => {
    // Echarts 设置
    // 例如: await import("echarts-wordcloud")
  },
})

export default defineClientConfig({
  // ...
})
```

## 示例

### 线图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-1.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-1.snippet.md{2-100} -->

### 柱状图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-2.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-2.snippet.md{2-75} -->

### 饼图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-3.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-3.snippet.md{2-74} -->

### 散点图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-4.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-4.snippet.md{2-39} -->

### 极坐标图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-5.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-5.snippet.md{2-40} -->

### 烛台图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-6.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-6.snippet.md{2-308} -->

### 雷达图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-7.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-7.snippet.md{2-36} -->

### 热力图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-8.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-8.snippet.md{2-179} -->

### 树图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-9.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-9.snippet.md{2-33} -->

### 多图

**输入：**

:::: details 查看代码
<!-- @include: ../../snippet/echarts-10.snippet.md -->
::::

**输出：**

<!-- @include: ../../snippet/echarts-10.snippet.md{2-69} -->
