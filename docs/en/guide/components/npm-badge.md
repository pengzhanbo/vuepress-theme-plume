---
title: Npm Badge
icon: akar-icons:npm-fill
createTime: 2025/10/08 22:07:23
permalink: /en/guide/components/npm-badge/
---

<script setup>
import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
</script>

## Overview

The Npm Badge component is used to display npm package information and provide relevant links.

The badges are powered by <https://shields.io>.

## Usage

To use this component, you need to manually import the `NpmBadge` or `NpmBadgeGroup` components:

```md :no-line-numbers
<!-- Import in markdown -->
<script setup>
import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
</script>

<!-- After importing, you can use them in markdown -->
<NpmBadge name="vuepress-theme-plume" type="dm" />

<!-- Display multiple npm badges side by side -->
<NpmBadgeGroup name="vuepress-theme-plume" items="version,dm" />
```

<NpmBadge name="vuepress-theme-plume" type="dm" />

<NpmBadgeGroup name="vuepress-theme-plume" items="version,dm" />

## `<NpmBadge />`

Single npm badge

### Props

:::: field-group

::: field name="name" type="string" optional
npm package name. If empty, it will be obtained from `repo`
:::

::: field name="repo" type="string"
Package GitHub repository address in `owner/repo` format. Required when `name` is empty
:::

::: field name="type" type="NpmBadgeType"
Badge type
:::

::: field name="theme" type="NpmBadgeTheme" optional default="'flat'"
Badge theme
:::

::: field name="label" type="string" optional
Badge label
:::

::: field name="color" type="string" optional default="'#32A9C3'"
Badge color
:::

::: field name="labelColor" type="string" optional default="'#1B3C4A'"
Badge label color
:::

::: field name="branch" type="string" optional default="'main'"
Repository branch
:::

::: field name="dir" type="string" optional
Package directory in repository. Suitable for monorepo projects
:::

::::

### Types

```ts
type NpmBadgeType
  // github
  = | 'source' // github source
    | 'stars' // github stars
    | 'forks' // github forks
    | 'license' // github license
  // npm
    | 'version' // npm version
    | 'dt' // alias d18m
    | 'd18m' // npm downloads last 18 months
    | 'dw' // npm downloads weekly
    | 'dm' // npm downloads monthly
    | 'dy' // npm downloads yearly

type NpmBadgeTheme = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'
```

### Examples

- `<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="source" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="source" />
- `<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="stars" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="stars" />
- `<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="forks" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="forks" />
- `<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="license" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="license" />
- `<NpmBadge name="vuepress-theme-plume" type="version" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="version" />
- `<NpmBadge name="vuepress-theme-plume" type="dt" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="dt" />
- `<NpmBadge name="vuepress-theme-plume" type="d18m" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="d18m" />
- `<NpmBadge name="vuepress-theme-plume" type="dy" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="dy" />
- `<NpmBadge name="vuepress-theme-plume" type="dm" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="dm" />
- `<NpmBadge name="vuepress-theme-plume" type="dw" />` - <NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="dw" />

## `<NpmBadgeGroup />`

Combines multiple npm badges

### Props

:::: field-group

::: field name="name" type="string" optional
npm package name. If empty, it will be obtained from `repo`
:::

::: field name="repo" type="string"
Package GitHub repository address in `owner/repo` format. Required when `name` is empty
:::

::: field name="items" type="string | NpmBadgeType[]" optional default="[]"
List of badge types. When passing a `string`, separate with `','` and it will be automatically converted to `NpmBadgeType[]`
:::

::: field name="theme" type="NpmBadgeTheme" optional
Badge theme
:::

::: field name="color" type="string" optional
Badge color
:::

::: field name="labelColor" type="string" optional
Badge label color
:::

::: field name="branch" type="string" optional
Repository branch
:::

::: field name="dir" type="string" optional
Package directory in repository. Suitable for monorepo projects
:::

::::

### Slots

`<NpmBadgeGroup />` supports passing multiple `<NpmBadge />` components.

The `Props` declared in `<NpmBadgeGroup />` will be injected into the `<NpmBadge />` components.
This approach is used to implement and simplify badge combinations.

### Examples

**Input:**

```md :no-line-numbers
<NpmBadgeGroup
  repo="pengzhanbo/vuepress-theme-plume"
  items="stars,version,dm,source"
/>
```

**Output:**

<NpmBadgeGroup repo="pengzhanbo/vuepress-theme-plume" items="stars,version,dm,source" />

Use `<slot />` to flexibly define badge combinations:

**Input:**

```md :no-line-numbers
<NpmBadgeGroup repo="pengzhanbo/vuepress-theme-plume">
  <NpmBadge type="stars" />
  <NpmBadge type="version" label="npm" />
  <NpmBadge type="dm" />
  <NpmBadge type="source" />
</NpmBadgeGroup>
```

**Output:**

<NpmBadgeGroup repo="pengzhanbo/vuepress-theme-plume">
  <NpmBadge type="stars" />
  <NpmBadge type="version" label="npm" />
  <NpmBadge type="dm" />
  <NpmBadge type="source" />
</NpmBadgeGroup>
