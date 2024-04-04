---
title: Code Sandbox
author: pengzhanbo
icon: lucide:codesandbox
createTime: 2024/04/04 03:42:13
permalink: /guide/code/code-sandbox/
---

主题支持在 Markdown 文件中嵌入 [Code Sandbox](https://codesandbox.io)。

## 配置

此功能默认不启用，你可以在配置文件中启用它。

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        codesandbox: true, // [!code highlight]
      },
    }
  })
})
```

:::

## 语法

### 简单语法

将 Code Sandbox 嵌入到页面中

```md
@[codesandbox](id)
```

使用 Code Sandbox 跳转按钮

```md
@[codesandbox button](workspace/id)
```

### 更多选项

```md
@[codesanbox title="xxx" layout="Editor+Preview" height="500px" navbar="false" console](id#filepath)
```

- `id`: Code Sandbox ID
- `title`: Code Sandbox 标题
- `layout`: 代码预览布局 可选值： `Preview`， `Editor`， `Editor+Preview`
- `height`: 代码预览高度
- `navbar`: 是否显示导航栏，默认为 true
- `console`: 是否显示控制台，默认为 false
- `filepath`: 文件路径

## 示例

codeSandbox 跳转按钮：

```md
@[codesandbox button](reaction/5wyzu)
```

输出：

@[codesandbox button](reaction/5wyzu)

codeSandbox 内嵌到页面中：

```md
@[codesandbox](5wyzu)
```

输出：

@[codesandbox](5wyzu)
