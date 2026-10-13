---
title: Custom Styles
icon: icon-park-outline:theme
createTime: 2025/10/08 20:18:52
permalink: /en/guide/custom-style/
---

## Theme Customization

Custom styles are supported.

Although the theme uses [SASS](https://sass-lang.com/) as the CSS preprocessor,
all colors are defined using `CSS Variables`. Therefore, you can create a CSS file or SCSS file to override them.

First, create a `styles/index.css` file in the `.vuepress` directory. Then, import this file in the [client configuration file](https://v2.vuepress.vuejs.org/guide/configuration.html#client-config-file).

:::code-tabs

@tab .vuepress/client.ts

```ts
import { defineClientConfig } from 'vuepress/client'

import './styles/index.css' // [!code ++]

export default defineClientConfig({
  // ...
})
```

@tab .vuepress/styles/index.css

```css
:root {
  --vp-c-brand-1: #5086a1;
}
```

:::

## Style File

Create a file such as `custom.css` in the `.vuepress` directory.

Add additional styles or override default styles here:

```scss
:root {
  scroll-behavior: smooth;
}
```

You can also use it to override the predefined CSS variables of the default theme.

::: warning The following are only examples of variable names and formatting styles

These values may change with each theme version. **For the actual values, please refer to [vars.css](https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/theme/src/client/styles/vars.css)**.
The brand colors are derived from the `--vp-c-turquoise-*` variables, and their values differ between light and dark modes.
:::

```scss
:root {
  /** Theme Colors (derived from --vp-c-turquoise-*) */
  --vp-c-brand-1: var(--vp-c-turquoise-1);
  --vp-c-brand-2: var(--vp-c-turquoise-2);
  --vp-c-brand-3: var(--vp-c-turquoise-3);
  --vp-c-brand-soft: var(--vp-c-turquoise-soft);

  /** Background Colors */
  --vp-c-bg: #ffffff;
  --vp-c-bg-alt: #f6f6f7;
  --vp-c-bg-elv: #ffffff;
  --vp-c-bg-soft: #f6f6f7;

  /** Text Colors */
  --vp-c-text-1: rgb(60 60 67);
  --vp-c-text-2: rgb(60 60 67 / 0.78);
  --vp-c-text-3: rgb(60 60 67 / 0.72);
}

[data-theme="dark"] {
  --vp-c-brand-1: var(--vp-c-turquoise-1);
  --vp-c-brand-2: var(--vp-c-turquoise-2);
  --vp-c-brand-3: var(--vp-c-turquoise-3);
  --vp-c-brand-soft: var(--vp-c-turquoise-soft);

  --vp-c-bg: #1b1b1f;
  --vp-c-bg-alt: #161618;
  --vp-c-bg-elv: #202127;
  --vp-c-bg-soft: #202127;

  --vp-c-text-1: rgb(255 255 245 / 0.86);
  --vp-c-text-2: rgb(235 235 245 / 0.6);
  --vp-c-text-3: rgb(235 235 245 / 0.55);
}
```

::: tip
The theme provides a [Theme Color Tool](../../tools/custom-theme.md) that you can use to create custom colors.
:::
