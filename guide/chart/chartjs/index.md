---
url: /guide/chart/chartjs/index.md
---
[chart.js]: https://www.chartjs.org/docs/latest/

## 概述

主题支持在 文章中 嵌入由 [chart.js] 图表。

该功能由 [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/) 提供支持。

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
示例 Fork 自 [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/guide/markdown/chart/chartjs.html#%E6%A1%88%E4%BE%8B),
遵循 [MIT](https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/LICENSE) 许可证。
:::

### 块状图

**输入：**

**输出：**

### 气泡图

**输入：**

**输出：**

### 折线图

**输入：**

**输出：**

### 玫瑰图

**输入：**

**输出：**

### 雷达图

**输入：**

**输出：**

### 散点图

**输入：**

**输出：**
