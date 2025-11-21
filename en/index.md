---
url: /en/index.md
---
::: center
![GitHub Repo stars](https://img.shields.io/github/stars/pengzhanbo/vuepress-theme-plume)
![npm version](https://img.shields.io/npm/v/vuepress-theme-plume?color=32A9C3\&labelColor=1B3C4A\&label=npm)
![npm downloads](https://img.shields.io/npm/dm/vuepress-theme-plume?color=32A9C3\&labelColor=1B3C4A\&label=downloads)
![npm downloads](https://img.shields.io/npm/dt/vuepress-theme-plume?color=32A9C3\&labelColor=1B3C4A\&label=downloads)
![github license](https://img.shields.io/github/license/pengzhanbo/vuepress-theme-plume?color=32A9C3\&labelColor=1B3C4A)

![peer dependency](https://img.shields.io/npm/dependency-version/vuepress-theme-plume/peer/vuepress?color=32A9C3\&labelColor=1B3C4A)
![codecov](https://codecov.io/gh/pengzhanbo/vuepress-theme-plume/graph/badge.svg?token=W6KYBX7WO5)
:::

### Installation

:::code-tabs
@tab pnpm

```sh
pnpm add vuepress@next vuepress-theme-plume vue
```

@tab npm

```sh
npm install vuepress@next vuepress-theme-plume
```

@tab yarn

```sh
yarn add vuepress@next vuepress-theme-plume
```

:::

### Configuration

::: code-tabs
@tab .vuepress/config.ts

```ts :no-line-numbers
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  // vuepress config...
  theme: plumeTheme({
    // theme config...
  })
})
```

:::

### Update Log

[Changelog](../changelog)

### Contributors
