---
url: /en/guide/custom-style/index.md
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

Below are some predefined variables. For the complete list, please refer to [vars.css](https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/theme/src/client/styles/vars.css).

```scss
:root {
  /** Theme Colors */
  --vp-c-brand-1: #5086a1;
  --vp-c-brand-2: #6aa1b7;
  --vp-c-brand-3: #8cccd5;
  --vp-c-brand-soft: rgba(131, 208, 218, 0.314);

  /** Background Colors */
  --vp-c-bg: #ffffff;
  --vp-c-bg-alt: #f6f6f7;
  --vp-c-bg-elv: #ffffff;
  --vp-c-bg-soft: #f6f6f7;

  /** Text Colors */
  --vp-c-text-1: rgba(60, 60, 67);
  --vp-c-text-2: rgba(60, 60, 67, 0.78);
  --vp-c-text-3: rgba(60, 60, 67, 0.56);
}

[data-theme="dark"] {
  --vp-c-brand-1: #8cccd5;
  --vp-c-brand-2: #6aa1b7;
  --vp-c-brand-3: #5086a1;
  --vp-c-brand-soft: rgba(131, 208, 218, 0.314);

  --vp-c-bg: #1b1b1f;
  --vp-c-bg-alt: #161618;
  --vp-c-bg-elv: #202127;
  --vp-c-bg-soft: #202127;

  --vp-c-text-1: rgba(255, 255, 245, 0.86);
  --vp-c-text-2: rgba(235, 235, 245, 0.6);
  --vp-c-text-3: rgba(235, 235, 245, 0.38);
}
```

::: tip
The theme provides a [Theme Color Tool](../../../tools/custom-theme.md) that you can use to create custom colors.
:::
