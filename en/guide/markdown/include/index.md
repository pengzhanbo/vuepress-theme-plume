---
url: /en/guide/markdown/include/index.md
---
## Overview

The theme supports including file snippets in Markdown files.

File inclusion is enabled by default, and you can customize its behavior through configuration.

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

## Syntax

Use `<!-- @include: filename -->` to include a file.

To include specific parts of a file, you can specify line ranges:

* `<!-- @include: filename{start-end} -->`
* `<!-- @include: filename{start-} -->`
* `<!-- @include: filename{-end} -->`

You can also include file regions:

* `<!-- @include: filename#region -->`

::::tip File Regions
File regions are a concept from VSCode, where region content is surrounded by `#region` and `#endregion` comments.

::::

## Configuration

You can also configure an object to customize the file path resolution and inclusion behavior.

```ts
interface IncludeOptions {
  /**
   * Handler for resolving include file paths
   *
   * @default (path) => path
   */
  resolvePath?: (path: string, cwd: string | null) => string
  /**
   * Whether to deeply include nested Markdown files
   *
   * @default false
   */
  deep?: boolean
  /**
   * Whether to use `<!-- @include: xxx -->` instead of `@include: xxx` for file inclusion
   *
   * @default true
   */
  useComment?: boolean
  /**
   * Whether to resolve relative image paths in included Markdown files
   *
   * @default true
   */
  resolveImagePath?: boolean
  /**
   * Whether to resolve relative file paths in included Markdown files
   *
   * @default true
   */
  resolveLinkPath?: boolean
}
```

For example: You can use `@src` as an alias for your source directory.

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

Additionally, if you want to place Markdown files directly alongside your actual files but don't
want them rendered as pages, you can set the `pagePatterns` option in your VuePress configuration.
For more details, refer to [pagePatterns](https://vuejs.press/zh/reference/config.html#pagepatterns).

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  // Now any file with `.snippet.md` extension will not be rendered as a page
  pagePatterns: ['**/*.md', '!**/*.snippet.md', '!.vuepress', '!node_modules'], // [!code ++]
  theme: plumeTheme({
    markdown: {
      include: true
    }
  })
})
```

## Examples

Given a `foo.snippet.md` file in your project:
:::: code-tabs
@tab foo.snippet.md

```md
### Level 3 Heading

This is content from the foo.snippet.md file.

::: info
Content included in an info container.
:::

<!-- region snippet -->
This is content wrapped by `<!-- region snippet -->`.

Included via `<!-- @include: ./foo.snippet.md#snippet -->`.
<!-- endregion snippet -->
```

::::

Using `<!-- @include: ./foo.snippet.md -->` to include the entire file:

:::: demo-wrapper title="Include by file"

::::

Using `<!-- @include: ./foo.snippet.md{5-7} -->` to include lines 5-7 of the file:

:::: demo-wrapper title="Include by lines"

::::

Using `<!-- @include: ./foo.snippet.md#snippet -->` to include the `snippet` region:

:::: demo-wrapper title="Include by file region"

::::
