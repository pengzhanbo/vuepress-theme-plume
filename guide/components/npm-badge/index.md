---
url: /guide/components/npm-badge/index.md
---
## 概述

Npm 徽章组件 用于显示 npm 包信息，并提供相关的链接。

徽章由 <https://shields.io> 提供支持。

## 使用

使用该组件需要你手动导入 `NpmBadge` 或 `NpmBadgeGroup` 组件：

```md :no-line-numbers
<!-- 在 markdown 中导入 -->
<script setup>
import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
</script>

<!-- 导入后，即可在 markdown 中使用 -->
<NpmBadge name="vuepress-theme-plume" type="dm" />

<!-- 并排显示多个 npm badge -->
<NpmBadgeGroup name="vuepress-theme-plume" items="version,dm" />
```

## `<NpmBadge />`

单个 npm badge

### Props

:::: field-group

::: field name="name" type="string" optional
npm 包名，为空则从 `repo` 中获取
:::

::: field name="repo" type="string"
包 github 仓库地址，格式为 `owner/repo`，当 `name` 为空时必填
:::

::: field name="type" type="NpmBadgeType"
徽章类型
:::

::: field name="theme" type="NpmBadgeTheme" optional default="'flat'"
徽章主题
:::

::: field name="label" type="string" optional
徽章标签
:::

::: field name="color" type="string" optional default="'#32A9C3'"
徽章颜色
:::

::: field name="labelColor" type="string" optional default="'#1B3C4A'"
徽章标签颜色
:::

::: field name="branch" type="string" optional default="'main'"
仓库分支
:::

::: field name="dir" type="string" optional
包所在仓库目录，适用于 monorepo 项目
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

### 示例

* `<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="source" />` -&#x20;
* `<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="stars" />` -&#x20;
* `<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="forks" />` -&#x20;
* `<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="license" />` -&#x20;
* `<NpmBadge name="vuepress-theme-plume" type="version" />` -&#x20;
* `<NpmBadge name="vuepress-theme-plume" type="dt" />` -&#x20;
* `<NpmBadge name="vuepress-theme-plume" type="d18m" />` -&#x20;
* `<NpmBadge name="vuepress-theme-plume" type="dy" />` -&#x20;
* `<NpmBadge name="vuepress-theme-plume" type="dm" />` -&#x20;
* `<NpmBadge name="vuepress-theme-plume" type="dw" />` -&#x20;

## `<NpmBadgeGroup />`

组合多个 npm badge

### Props

:::: field-group

::: field name="name" type="string" optional
npm 包名，为空则从 `repo` 中获取
:::

::: field name="repo" type="string"
包 github 仓库地址，格式为 `owner/repo`，当 `name` 为空时必填
:::

::: field name="items" type="string | NpmBadgeType\[]" optional default="\[]"
徽章类型列表, 传入 `string` 时用 `','`分隔，会自动转换为 `NpmBadgeType[]`
:::

::: field name="theme" type="NpmBadgeTheme" optional
徽章主题
:::

::: field name="color" type="string" optional
徽章颜色
:::

::: field name="labelColor" type="string" optional
徽章标签颜色
:::

::: field name="branch" type="string" optional
仓库分支
:::

::: field name="dir" type="string" optional
包所在仓库目录，适用于 monorepo 项目
:::

::::

### Slots

`<NpmBadgeGroup />` 支持传入 多个 `<NpmBadge />` 组件。

`<NpmBadgeGroup />` 声明的 `Props` 将被注入到 `<NpmBadge />` 组件中。通过这种方式来实现和简化徽章组合。

### 示例

**输入：**

```md :no-line-numbers
<NpmBadgeGroup
  repo="pengzhanbo/vuepress-theme-plume"
  items="stars,version,dm,source"
/>
```

**输出：**

使用 `<slot />` 灵活定义徽章组合：

**输入：**

```md :no-line-numbers
<NpmBadgeGroup repo="pengzhanbo/vuepress-theme-plume">
  <NpmBadge type="stars" />
  <NpmBadge type="version" label="npm" />
  <NpmBadge type="dm" />
  <NpmBadge type="source" />
</NpmBadgeGroup>
```

**输出：**
