---
title: Can I Use
createTime: 2025/10/08 14:50:55
icon: streamline:desktop-help
permalink: /en/guide/markdown/caniuse/
---

## Overview

When writing articles, this feature provides the functionality to embed platform support information for WEB features from [can-i-use](https://caniuse.com/).

This allows for a more intuitive representation of a feature's support level when describing a specific WEB feature.

## Configuration

This feature is disabled by default. You can enable it in the configuration file.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdownP: {
      caniuse: true, // [!code ++]
    },
  })
})
```

In your article's markdown file, use the following format:

``` md
@[caniuse](feature)
```

For ease of use, the theme provides tool support: [caniuse Feature Search](../../../tools/caniuse.md).
You can use this tool directly to help generate the markdown code.

## Syntax

``` md
@[caniuse](feature)
@[caniuse{browser_versions}](feature)
@[caniuse embed_type](feature)
@[caniuse embed_type{browser_versions}](feature)
```

- `feature`

   Required. For correct values, please refer to [caniuse-embed.vercel.app](https://caniuse-embed.vercel.app/zh-CN).

- `{browser_versions}`

  Optional. Specifies the support status of the current feature across multiple browser versions.

  Default value: `{-2,1}`

  Format: `{past,future}` Value range: `-5 ~ 3`

  - Values less than `0` indicate support status for browser versions lower than the current one.
  - `0` indicates the support status for the current browser version.
  - Values greater than `0` indicate support status for browser versions higher than the current one.

- `embed_type`

  Optional. The type of resource embedding.

  Type: `'embed' | 'image'`

  Default value: `'embed'`

:::caution
The `image` type is no longer recommended. It is advised to use the `embed` type.
The theme has changed the implementation technology for the embed component.
The current `embed` type now offers significant advantages over the `image` type,
including faster loading speed, smaller size, and better interactive experience.
:::

## Examples

**Get the browser support for the CSS pseudo-class selector `:dir()`:**

```md
@[caniuse](css-matches-pseudo)
```

Result:

@[caniuse](css-matches-pseudo)

**Get the browser support for the CSS pseudo-class selector `:dir()` as an image:**

```md
@[caniuse image](css-matches-pseudo)
```

Result:

@[caniuse image](css-matches-pseudo)

**Get the browser support for the CSS pseudo-class selector `:dir()` for a specific range of browser versions:**

```md
@[caniuse{-2,3}](css-matches-pseudo)
```

Result:

@[caniuse{-2,3}](css-matches-pseudo)
