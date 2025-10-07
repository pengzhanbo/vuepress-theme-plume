---
title: chart.js
createTime: 2024/03/16 19:33:49
icon: solar:chart-bold
permalink: /guide/chart/chartjs/
---

[chart.js]: https://www.chartjs.org/docs/latest/

## 概述

主题支持在 文章中 嵌入由 [chart.js] 图表。

该功能由 [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/) 提供支持。

## 配置

主题默认不启用该功能。

你需要在你的项目中安装 [chart.js] 库。

::: npm-to

```sh
npm install chart.js
```

:::

然后在 `.vuepress/config.ts` 配置文件中，启用该功能：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      chartjs: true, // [!code ++]
    },
  })
})
```

## 语法

````md
::: chartjs 标题
```json
{
  // 此处为图表配置
}
```
:::
````

图标配置请查看 [chart.js] 文档 。

## 示例

::: note
示例 Fork 自 [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/chartjs.html),
遵循 [MIT](https://github.com/vuepress/ecosystem/blob/main/LICENSE) 许可证。
:::

### 块状图

**输入：**

<!-- @include: ../../snippet/chart-1.snippet.md -->

**输出：**

<!-- @include: ../../snippet/chart-1.snippet.md{2-41} -->

### 气泡图

**输入：**

<!-- @include: ../../snippet/chart-2.snippet.md -->

**输出：**

<!-- @include: ../../snippet/chart-2.snippet.md{2-20} -->

### 折线图

**输入：**

<!-- @include: ../../snippet/chart-3.snippet.md -->

**输出：**

<!-- @include: ../../snippet/chart-3.snippet.md{2-20} -->

### 玫瑰图

**输入：**

<!-- @include: ../../snippet/chart-4.snippet.md -->

**输出：**

<!-- @include: ../../snippet/chart-4.snippet.md{2-24} -->

### 雷达图

**输入：**

<!-- @include: ../../snippet/chart-5.snippet.md -->

**输出：**

<!-- @include: ../../snippet/chart-5.snippet.md{2-42} -->

### 散点图

**输入：**

<!-- @include: ../../snippet/chart-6.snippet.md -->

**输出：**

<!-- @include: ../../snippet/chart-6.snippet.md{2-30} -->
