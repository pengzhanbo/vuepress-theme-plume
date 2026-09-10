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
@optional
@default `'github'`

仓库所属平台，当前仅支持 `github / gitee` 。
:::

::: field fullname
@type `boolean`
@optional
@default `false`

是否显示完整的仓库名称。

完整的仓库名称为 `owner/repo`。

* 如果 owner 为个人，则默认不显示完整的仓库名称，仅显示 `repo`。
* 如果 owner 为组织，则默认显示完整的仓库名称。
  :::

::::

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
