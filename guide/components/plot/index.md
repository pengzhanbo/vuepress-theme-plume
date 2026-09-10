---
url: /guide/components/plot/index.md
---
## 概述

使用 `<VPPlot>` 组件显示 ["隐秘"文本](../markdown/v-plot.md)，能够更灵活地控制行为。

该组件默认不启用，你需要在 theme 配置中启用。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      plot: true,
    },
  })
})
```

## Props

:::: field-group

::: field trigger
@type `'hover' | 'click'`
@default `'hover'`
@optional

鼠标悬停触发，或者点击触发
:::

::: field effect
@type `'blur' | 'mask'`
@default `'mask'`
@optional

遮罩层效果，或者文本模糊效果
:::

::::

## 示例

**输入：**

```md :no-line-numbers
- 鼠标悬停 - <VPPlot>悬停时可见</VPPlot>
- 点击 - <VPPlot trigger="click">点击时可见</VPPlot>
```

**输出：**

* 鼠标悬停 - 悬停时可见
* 点击 - 点击时可见
