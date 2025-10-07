---
title: Icons
createTime: 2025/03/23 14:24:45
icon: grommet-icons:emoji
permalink: /en/guide/markdown/iconify/
badge:
  text: Change
  type: warning
---

::: warning The icon syntax underwent a breaking change in version `1.0.0-rc.144`.

The `:[collect:name size/color]:` syntax has been deprecated. Please use `::collect:name =size /color::` instead.

The theme plans to support icons from libraries such as `iconfont`, `fontawesome`, and `lucide` in future versions.
The original syntax was insufficient to accommodate these new extensions, making this breaking change necessary.

The old syntax will remain supported in recent versions but is no longer recommended and will be removed in the future.

The theme will detect if the old syntax is used. If so, a warning message and modification suggestions will be displayed in the console.
Please adjust accordingly based on these suggestions.

:::

## Overview

Use [iconify](https://iconify.design/) icons in Markdown files.

The theme provides an [`<Icon />`](../components/icon.md) component for using icons in Markdown
and a simplified Markdown syntax for easier icon usage.

To enhance this feature, the theme recommends installing the `@iconify/json` dependency.
It automatically parses icon data from `@iconify/json`, packs used icons as local resources for better access.

::: npm-to

```sh
npm install @iconify/json
```

:::

## Syntax

```md
::collect:name::
```

To set icon size and color:

```md
::collect:name =size::
::collect:name /color::
::collect:name =size /color::
```

Iconify has numerous icons grouped into different `collect` categories. Each `collect` has its own set of icons.

You can find `collect` and `name` at <https://icon-sets.iconify.design/>.

## Examples

Input:

```md
::ion:logo-markdown::
```

Output:

::ion:logo-markdown::

This is an inline syntax, allowing use with other Markdown elements in the same line.

Input:

```md
github: ::tdesign:logo-github-filled::
Change color: ::tdesign:logo-github-filled /#f00::
Change size: ::tdesign:logo-github-filled =36px::
Change size and color: ::tdesign:logo-github-filled =36px /#f00::

Colored icon: ::skill-icons:vscode-dark =36px::
```

Output:

github: ::tdesign:logo-github-filled::
Change color: ::tdesign:logo-github-filled /#f00::
Change size: ::tdesign:logo-github-filled =36px::
Change size and color: ::tdesign:logo-github-filled =36px /#f00::

Colored icon: ::skill-icons:vscode-dark =36px::
