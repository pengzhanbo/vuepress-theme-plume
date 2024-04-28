---
title: Code Pen
author: pengzhanbo
icon: mingcute:codepen-line
createTime: 2024/04/04 10:41:58
permalink: /guide/code/code-pen/
---

主题支持在 Markdown 文件中嵌入 [CodePen](https://codepen.io/)。

## 配置

此功能默认不启用，你可以在配置文件中启用它。

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        codepen: true, // [!code highlight]
      },
    }
  })
})
```

:::

## 语法

简单语法：

```md
@[codepen](user/slash)
```

更多选项支持：

```md
@[codepen preview editable tab="css,result" theme="dark" height="500px" width="100%"](user/slash)
```

- `preview`: 是否渲染为预览模式
- `editable`: 是否可编辑
- `tab`: 默认显示的标签， 默认为 `result`，多个使用 `,` 分隔
- `theme`: 主题， 可选值 `dark` 和 `light`
- `height`: 容器高度， 默认为 `400px`
- `width`: 容器宽度， 默认为 `100%`
- `user`: CodePen 用户名
- `slash`: CodePen 代码文件名

## 示例

输入：

```md
@[codepen](leimapapa/RwOZQOW)
```

输出：

@[codepen](leimapapa/RwOZQOW)

**预览模式：**

输入：

```md
@[codepen preview](leimapapa/RwOZQOW)
```

输出：

@[codepen preview](leimapapa/RwOZQOW)

**编辑模式：**

输入：

```md
@[codepen editable tab="html,result"](leimapapa/RwOZQOW)
```

输出：

@[codepen editable tab="html,result"](leimapapa/RwOZQOW)
