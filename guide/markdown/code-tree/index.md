---
url: /guide/markdown/code-tree/index.md
---
## 概述

在 markdown 中，使用 `::: code-tree` 容器，或者使用 `@[code-tree](dir_path)`，
可以显示一个带有文件树的代码块区域。

相比于 代码块分组，代码树 可以更加清晰地展示代码文件的组织结构，以及文件的依赖关系。

## 启用

该功能默认不启用，你需要在 `theme` 配置中启用。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTree: true, // [!code ++]
    }
  })
})
```

## 使用

主题提供了 两种使用方式：

### code-tree 容器

````md
::: code-tree title="Project Name" height="400px" entry="filepath" showSidebar
```lang title="filepath" :active
<!-- code content-->
```

```lang title="filepath"
<!-- code content-->
```
<!-- 更多代码块 -->
:::
````

使用 `::: code-tree` 容器包裹多个代码块。

* 在 `::: code-tree` 后使用 `title="Project Name"` 声明代码树的标题
* 在 `::: code-tree` 后使用 `height="400px"` 声明代码树的高度，
  支持传入数字，如 `height="400"`，将自动添加 `px` 单位
* 在 `::: code-tree` 后使用 `entry="filepath"` 声明默认展开的文件路径
* 在 `::: code-tree` 后使用 `showSidebar` 声明默认显示文件树侧边栏，默认不显示
* 在代码块 \`\`\` lang 后使用 `title="filepath"` 声明当前代码块的文件路径
* 如果在 `::: code-tree` 未声明 `entry="filepath"`，
  可以在代码块 \`\`\` lang 后使用 `:active` 声明当前代码块为展开状态
* 如果未指定展开的文件路径，默认展开第一个文件

::: details 代码块上为什么是 `title="filepath"` 而不是 `filepath="filepath"` ?
因为主题已经在 [代码块上提供了标题语法的支持](../code/features.md#代码块标题) ，沿用已有的语法支持
可以减少学习成本。
:::

**输入：**

````md :collapsed-lines
::: code-tree title="Vue App" height="400px" entry="src/main.ts"
```vue title="src/components/HelloWorld.vue"
<template>
  <div class="hello">
    <h1>Hello World</h1>
  </div>
</template>
```

```vue title="src/App.vue"
<template>
  <div id="app">
    <h3>vuepress-theme-plume</h3>
    <HelloWorld />
  </div>
</template>
```

```ts title="src/main.ts"
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

```json title="package.json"
{
  "name": "Vue App",
  "scripts": {
    "dev": "vite"
  }
}
```
:::
````

**输出：**

::: code-tree title="Vue App" height="400px" entry="src/main.ts"

```vue title="src/components/HelloWorld.vue"
<template>
  <div class="hello">
    <h1>Hello World</h1>
  </div>
</template>
```

```vue title="src/App.vue"
<template>
  <div id="app">
    <h3>vuepress-theme-plume</h3>
    <HelloWorld />
  </div>
</template>
```

```ts title="src/main.ts"
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

```json title="package.json"
{
  "name": "Vue App",
  "scripts": {
    "dev": "vite"
  }
}
```

:::

### 从目录导入 code-tree

主题支持通过以下语法从目录导入 `code-tree`:

```md
<!-- 简单导入 -->
@[code-tree](dir_path)

<!-- 添加的配置 -->
@[code-tree title="Project Name" height="400px" entry="filepath" showSidebar](dir_path)
```

* **dir\_path**:
  当传入绝对路径，即以 `/` 开头时，从文档站点的 源目录 开始查找。
  当传入相对路径时，即以 `.` 开头时，表示相对于当前 markdown 文件。

* **title**: 代码树标题，可选，默认为空

* **height**: 代码树高度，可选，默认为空，支持传入数字，将自动添加 `px` 单位

* **entry**: 默认展开的文件路径，可选，默认为第一个文件

* **showSidebar**: 默认显示文件树侧边栏，可选，默认为 `false`

**输入：**

```md
<!-- 此目录为主题仓库 `docs/.vuepress/collections/` -->
@[code-tree title="Collections 配置" height="400px" entry="index.ts"](/.vuepress/collections)
```

**输出：**

@[code-tree title="Collections 配置" height="400px" entry="index.ts"](/.vuepress/collections)

#### 文件加载器

从目录导入 `code-tree` 时，主题会根据文件类型，使用内置的文件加载器自动处理文件内容：

| 文件类型 | 渲染方式 |
| --- | --- |
| 图片文件（`jpg`、`png`、`svg`、`webp`） | 渲染为 `<img>` 标签，位于 `public` 目录时用绝对路径，否则用相对路径 |
| `.editorconfig` | 以 TOML 代码块渲染 |
| 点文件（`.git*`、`.env*`、`.*ignore`、`.npmrc`） | 以纯文本代码块渲染 |
| `.XXXrc` 配置文件（如 `.eslintrc`） | 以 JSON 代码块渲染 |
| 其他被 Shiki 支持语法高亮的文件 | 以代码块渲染 |
| 其他不支持的文件 | 不渲染文件内容，仅在文件树中显示文件名 |

#### 自定义文件加载器

你可以在 `markdown.codeTree` 中通过 `loaders` 配置自定义文件加载器，
自定义加载器 的优先级高于内置加载器。

```ts title=".vuepress/config.ts"
import { readFileSync } from 'node:fs'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTree: {
        loaders: [
          {
            // 支持 glob 模式、glob 模式数组，或接收 CodeTreeFile 的断言函数
            filter: ['**/*.md'],
            load: file => `\`\`\`md title="${file.path}"\n${readFileSync(file.absolutePath, 'utf-8')}\n\`\`\``,
          },
        ],
      },
    }
  })
})
```

* **filter**: 决定该加载器处理哪些文件，支持 glob 模式、glob 模式数组、或接收 `CodeTreeFile` 的断言函数
* **load**: 接收 `CodeTreeFile` 和 `App` 实例，返回 渲染为 markdown 的内容（如围栏代码块）

`CodeTreeFile` 包含以下字段：

```ts
interface CodeTreeFile {
  /** 相对于嵌入目录的路径 */
  path: string
  /** 文件系统上的绝对路径 */
  absolutePath: string
  /** 相对于当前 markdown 文件的路径 */
  relativePath: string
  /** 文件扩展名（不含前导点） */
  extname: string
  /** 包含扩展名的文件名 */
  basename: string
}
```

#### 忽略文件

你可以在 `markdown.codeTree` 中通过 `ignores` 配置忽略的文件，使用 glob 模式：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTree: {
        ignores: ['**/dist/**', '**/*.map'],
      },
    }
  })
})
```

#### 无效的目录

当 `dir_path` 指向的目录不存在时，会渲染错误提示，并在构建时输出警告日志。

## 配置

你可以在 `markdown.codeTree` 中配置 code-tree 的全局选项：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTree: {
        // 文件图标类型，可选：'simple' | 'colored'，默认为 'colored'
        icon: 'colored',
        // 代码树默认高度，可选，默认为空
        height: 400,
        // 从目录导入时忽略的文件 glob 模式
        ignores: ['**/dist/**'],
        // 自定义文件加载器，优先级高于内置加载器
        loaders: [],
      },
    }
  })
})
```

* **icon**: 文件图标类型，可选 `simple` | `colored`，默认为 `colored`
* **height**: 代码树默认高度，可选，默认为空，支持传入数字，将自动添加 `px` 单位
* **ignores**: 从目录导入 code-tree 时忽略的文件，使用 glob 模式
* **loaders**: 自定义文件加载器，优先级高于内置加载器
