---
title: Node
icon: fa6-brands:node
createTime: 2025/10/08 21:59:13
permalink: /en/guide/api/node/
---

## Usage

```ts
import { plumeTheme } from 'vuepress-theme-plume'
```

## `plumeTheme(options)`

__options__ : `PlumeThemeOptions`

Theme configuration function.

See [Theme Configuration](../config/theme.md) for more information.

## `defineThemeConfig(options)`

Theme configuration helper function for use in separate `plume.config.ts` files.

See [Theme Configuration File](../config/intro.md#theme-configuration-file) for more information.

## `defineNavbarConfig(options)`

Theme navbar configuration type helper function.

See [Theme Configuration](../config/navbar.md) for more information.

## `defineCollections(options)`

__options:__ `(ThemePostCollection | ThemeDocCollection)[]`

Theme collections configuration type helper function.

See [Theme Configuration](../config/collection.md) for more information.

## `defineCollection(options)`

__options:__ `ThemePostCollection | ThemeDocCollection`

Theme single collection configuration type helper function.

See [Theme Configuration](../config/collection.md) for more information.
