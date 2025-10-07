---
title: Import files
createTime: 2025/03/25 09:15:18
icon: fluent:table-simple-include-16-regular
permalink: /en/guide/markdown/include/
outline: 2
---

## Overview

The theme supports importing file slices in Markdown files.

Importing files is enabled by default, and you can also customize the behavior through configuration.

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

Use `<!-- @include: filename -->` to import a file.

If you want to import a portion of the file, you can specify the line numbers:

- `<!-- @include: filename{start-end} -->`
- `<!-- @include: filename{start-} -->`
- `<!-- @include: filename{-end} -->`

You can also import file regions:

- `<!-- @include: filename#region -->`

::::tip File Regions
File regions are a concept in VSCode, where the content is enclosed by `#region` and `#endregion` comments.

<!-- @include: ../../snippet/include-1.snippet.md -->
::::

## Configuration

You can also set an object to customize the file path and inclusion behavior.

```ts
interface IncludeOptions {
  /**
   * Process the include file path
   *
   * @default (path) => path
   */
  resolvePath?: (path: string, cwd: string | null) => string
  /**
   * Whether to deeply import included Markdown files
   *
   * @default false
   */
  deep?: boolean
  /**
   * Whether to use `<!-- @include: xxx -->` instead of `@include: xxx` to import files
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

For example: You can use `@src` as an alias for the source folder.

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

Additionally, if you want to place Markdown files next to the actual files but do not want them to be rendered as pages, you can set the `pagePatterns` option in the VuePress configuration. For more details, see [pagePatterns](https://vuejs.press/zh/reference/config.html#pagepatterns ).

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  // Now any file with the `.snippet.md` extension will not be rendered as a page
  pagePatterns: ['**/*.md', '!**/*.snippet.md', '!.vuepress', '!node_modules'], // [!code ++]
  theme: plumeTheme({
    markdown: {
      include: true
    }
  })
})
```

## Examples

There is a `foo.snippet.md` file in the project:
:::: code-tabs
@tab foo.snippet.md

```md
### Level 3 Heading

This is the content of the `foo.snippet.md` file.

::: info
Content of the info container
:::

<!-- region snippet -->
This is the content wrapped by `<!-- region snippet -->`.

It can be imported via `<!-- @include: ./foo.snippet.md#snippet -->`.
<!-- endregion snippet -->
```

::::

Import the file using `<!-- @include: ./foo.snippet.md -->`：

:::: demo-wrapper title="Include by file"
<!-- @include: ../../snippet/include-2.snippet.md -->
::::

Import lines 5 to 7 of the file using `<!-- @include: ./foo.snippet.md{5-7} -->`:

:::: demo-wrapper title="Include by lines"
<!-- @include: ../../snippet/include-2.snippet.md{5-7} -->
::::

Import the `snippet` region using `<!-- @include: ./foo.snippet.md#snippet -->`:

:::: demo-wrapper title="Include by file region"
<!-- @include: ../../snippet/include-2.snippet.md#snippet -->
::::
