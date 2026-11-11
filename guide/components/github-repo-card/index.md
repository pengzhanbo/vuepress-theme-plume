---
url: /guide/components/github-repo-card/index.md
---
## 概述

Repo 卡片组件用于显示 GitHub / Gitee 仓库信息。

## 使用

组件无需注册，主题会自动按需导入 `RepoCard` 组件。

在 markdown 文件中直接使用即可：

```md :no-line-numbers
<!-- 在 markdown 中使用 -->
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

### Props

:::: field-group

::: field repo
@type `string`
@required

仓库地址，格式为 `owner/repo`
:::

::: field provider
@type `'github' | 'gitee'`
@default `'github'`

仓库所属平台，当前仅支持 `github / gitee` 。
:::

::: field fullname
@type `boolean`

是否显示完整的仓库名称（`owner/repo`）。

* `undefined`（默认）：owner 为个人时仅显示 `repo`；owner 为组织时显示 `owner/repo`
* `true`：始终显示 `owner/repo`
* `false`：始终仅显示 `repo`（即使 owner 为组织也不显示完整名称）
  :::

::::

## Slots

**该组件不提供插槽。** 仓库信息在组件内部通过 GitHub / Gitee API 拉取后渲染，内容完全由 `repo` 与 `provider` 决定。

若需要展示仓库之外的自定义内容，请使用 [`Card`](./v-card.md) 自行构建。

## 示例

### 单卡片

**输入：**

```md
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

**输出：**

### 多卡片

如果希望以紧凑的方式并排展示多个卡片，可以使用 `CardGrid` 组件。

**输入：**

```md
<CardGrid>
  <RepoCard repo="vuepress/core" />
  <RepoCard repo="vuepress/ecosystem" />
</CardGrid>
```

**输出：**

**输入：**

```md
<CardGrid>
  <RepoCard repo="pengzb/vuepress-theme-plume" provider="gitee" />
  <RepoCard repo="pengzb/vite-plugin-mock-dev-server" provider="gitee" />
</CardGrid>
```

**输出：**
