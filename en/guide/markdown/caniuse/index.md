---
url: /en/guide/markdown/caniuse/index.md
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

```md
@[caniuse](feature)
```

For ease of use, the theme provides tool support: [caniuse Feature Search](../../../tools/caniuse.md).
You can use this tool directly to help generate the markdown code.

## Syntax

```md
@[caniuse](feature)
@[caniuse{browser_versions}](feature)
@[caniuse embed_type](feature)
@[caniuse embed_type{browser_versions}](feature)
```

:::info Using the caniuse tool provided by the theme: [caniuse feature search](../../../../tools/caniuse.md) to help generate markdown code.
:::

* `feature`

  Required. For correct values, please refer to [caniuse-embed.vercel.app](https://caniuse-embed.vercel.app/zh-CN).

* `{browser_period}`

  Optional. The support status of the current feature across multiple version cycles.

  Default value: `{-2,1}`

  Format: `{past,future}` with a value range of `-5 ~ 3`

  * Values less than `0` indicate support status in past browser version cycles.
  * `0` indicates support status in the current browser version.
  * Values greater than `0` indicate support status in future browser version cycles.

* `embed_type`

  Optional. The type of resource embedding.

  Type: `'embed' | 'baseline'`

  Default value: `'embed'`

  * `embed` means embedding as version compatibility data tables similar to `caniuse.com`
  * `baseline` means embedding as the baseline support status of a feature.
    * `Wildly available` indicates broad support across all major browsers
    * `Newly available` indicates support only in the latest major browsers
    * `limit available` indicates that major browsers may offer partial support, but it is limited, or not supported
    * `deprecated` indicates that major browsers have marked it as **deprecated** and do not recommend its use

## Examples

**Get the browser support for the CSS pseudo-class selector `:dir()`:**

```md
@[caniuse](css-matches-pseudo)
```

Result:

@[caniuse](css-matches-pseudo)

**Display baseline support for the CSS pseudo-class selector `:dir()`:**

```md
@[caniuse baseline](css-matches-pseudo)
```

Result:

@[caniuse baseline](css-matches-pseudo)
