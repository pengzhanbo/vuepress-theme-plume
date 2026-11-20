---
url: /guide/code/code-sandbox/index.md
---
主题支持在 Markdown 文件中嵌入 [Code Sandbox](https://codesandbox.io)。

## 配置

此功能默认不启用，你可以在配置文件中启用它。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeSandbox: true, // [!code highlight]
    },
  }),
})
```

::: warning 注意区分大小写

嵌入**语法**是全小写的 `@[codesandbox](id)`，而**配置字段**是驼峰 `codeSandbox`。

写成 `codesandbox` 会被主题的字段白名单静默丢弃，功能不会生效，也不会有任何报错。
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
@[codesandbox title="xxx" layout="Editor+Preview" height="500px" navbar="false" console](id#filepath)
```

* `id`: Code Sandbox ID
* `title`: Code Sandbox 标题
* `layout`: 代码预览布局。可选值： `Preview`， `Editor`， `Editor+Preview`
* `height`: 代码预览高度
* `navbar`: 是否显示导航栏，默认为 true
* `console`: 是否显示控制台，默认为 false
* `filepath`: 文件路径

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
