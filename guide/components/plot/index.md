---
url: /guide/components/plot/index.md
---
## 概述

使用 `<VPPlot>` 组件显示 ["隐秘"文本](../markdown/v-plot.md)，能够更灵活地控制行为。

该组件**默认可用**。

如果需要修改全站默认行为，可以通过 `markdown.plot` 传入对象配置：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      plot: {
        trigger: 'click',
      },
    },
  })
})
```

## Props

:::: field-group

::: field trigger
@type `'hover' | 'click'`
@default `'hover'`
鼠标悬停触发，或者点击触发
:::

::: field effect
@type `'blur' | 'mask'`
@default `'mask'`
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
