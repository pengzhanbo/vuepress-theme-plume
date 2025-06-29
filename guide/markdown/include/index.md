---
url: /guide/markdown/include/index.md
---
## 概述

主题支持在 Markdown 文件中导入文件切片。

导入文件 默认启用，你还可以通过配置来自定义行为。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      include: { // [!code ++:3]
        // ... options
      },
    }
  })
})
```

## 语法

使用 `<!-- @include: filename -->` 导入文件。

如果要部分导入文件，你可以指定导入的行数:

* `<!-- @include: filename{start-end} -->`
* `<!-- @include: filename{start-} -->`
* `<!-- @include: filename{-end} -->`

同时你也可以导入文件区域:

* `<!-- @include: filename#region -->`

::::tip 文件区域
文件区域是 vscode 中的一个概念，区域内容被 `#region` 和 `#endregion` 注释包围。

::::

## 配置

你还可以设置一个对象来自定义包含文件路径和包含行为。

```ts
interface IncludeOptions {
  /**
   * 处理 include 文件路径
   *
   * @default (path) => path
   */
  resolvePath?: (path: string, cwd: string | null) => string
  /**
   * 是否深度导入包含的 Markdown 文件
   *
   * @default false
   */
  deep?: boolean
  /**
   * 是否使用 `<!-- @include: xxx -->` 代替 `@include: xxx` 导入文件
   *
   * @default true
   */
  useComment?: boolean
  /**
   * 是否解析包含的 Markdown 文件的里的相对图像路径
   *
   * @default true
   */
  resolveImagePath?: boolean
  /**
   * 是否解析包含的 Markdown 文件的里的文件相对路径
   *
   * @default true
   */
  resolveLinkPath?: boolean
}
```

例如: 你可以使用 `@src` 作为源文件夹的别名。

```ts{5-11} title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      include: {
        resolvePath: (file) => {
          if (file.startsWith('@src'))
            return file.replace('@src', path.resolve(__dirname, '..'))

          return file
        },
      },
    }
  })
})
```

此外，如果你想将 Markdown 文件直接放在实际文件旁边，但不希望它们呈现为页面，
你可以在 VuePress 配置中设置 `pagePatterns` 选项。
有关详细信息，请参阅 [pagePatterns](https://vuejs.press/zh/reference/config.html#pagepatterns)。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  // 现在任何带有 `.snippet.md` 扩展名的文件都不会呈现为页面
  pagePatterns: ['**/*.md', '!**/*.snippet.md', '!.vuepress', '!node_modules'], // [!code ++]
  theme: plumeTheme({
    markdown: {
      include: true
    }
  })
})
```

## 示例

在项目中有一个 `foo.snippet.md` 文件：
:::: code-tabs
@tab foo.snippet.md

```md
### 三级标题

这是 foo.snippet.md 文件中的内容。

::: info
提示容器包括的内容
:::

<!-- region snippet -->
这里是被 `<!-- region snippet -->` 包裹的内容。

通过 `<!-- @include: ./foo.snippet.md#snippet -->` 来引入。
<!-- endregion snippet -->
```

::::

使用 `<!-- @include: ./foo.snippet.md -->` 导入文件：

:::: demo-wrapper title="Include by file"

::::

使用 `<!-- @include: ./foo.snippet.md{5-7} -->` 导入文件内的 5 到 7 行：

:::: demo-wrapper title="Include by lines"

::::

使用 `<!-- @include: ./foo.snippet.md#snippet -->` 导入 `snippet` 区域

:::: demo-wrapper title="Include by file region"

::::
