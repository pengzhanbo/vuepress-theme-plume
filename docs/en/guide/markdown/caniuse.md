---
title: Can I Use
createTime: 2025/03/24 22:10:32
icon: streamline:desktop-help
permalink: /en/guide/markdown/caniuse/
---

## Overview

When writing articles, you can embed the support status of [can-i-use](https://caniuse.com/) WEB features across platforms.

This makes it easier to describe the support level of a particular WEB feature.

## Configuration

This feature is not enabled by default. You can enable it in the configuration file.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdownP: {
      caniuse: true, // [!code ++]
    },
  })
})
```

In your Markdown file, use the following format:

```md
@[caniuse](feature)
```

For convenience, the theme provides a tool: [caniuse feature search](../../../../../notes/tools/caniuse.md), which can help generate the Markdown code.

## Syntax

```md
@[caniuse](feature)
@[caniuse{browser_versions}](feature)
@[caniuse embed_type](feature)
@[caniuse embed_type{browser_versions}](feature)
```

- `feature`

  Required. For correct values, refer to [caniuse-embed.vercel.app](https://caniuse-embed.vercel.app/zh-CN)

- `{browser_versions}`

  Optional. The support status of the feature across multiple browser versions.

  Default value: `{-2,1}`

  Format: `{past,future}` with values ranging from `-5 ~ 3`

  - Less than `0` indicates support below the current browser version
  - `0` indicates support at the current browser version
  - Greater than `0` indicates support above the current browser version

- `embed_type`

  Optional. The type of resource embedding.

  Type: `'embed' | 'image'`

  Default value: `'embed'`

:::caution
The use of image type is no longer recommended. Instead, use the embed type, as the theme has changed the embed implementation, offering faster loading, smaller size, and better interaction.
:::

## Examples

**Get the browser support status for the CSS pseudo-class selector `:dir()`:**

```md
@[caniuse](css-matches-pseudo)
```

Effect:

@[caniuse](css-matches-pseudo)

**Get the browser support status for the CSS pseudo-class selector `:dir()` as an image:**

```md
@[caniuse image](css-matches-pseudo)
```

Effect:

@[caniuse image](css-matches-pseudo)

**Get the browser support status for the CSS pseudo-class selector `:dir()` for specific browser versions:**

```md
@[caniuse{-2,3}](css-matches-pseudo)
```

Effect:

@[caniuse{-2,3}](css-matches-pseudo)
