---
url: /en/guide/components/github-repo-card/index.md
---
## Overview

The Repo Card component is used to display GitHub/Gitee repository information.

## Usage

Components do not need to be registered; the theme will automatically import the `RepoCard` component on demand.

Simply use it directly in the markdown file:

```md :no-line-numbers
<!-- use it in markdown -->
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

### Props

:::: field-group

::: field repo
@type `string`
@required

Repository address in `owner/repo` format
:::

::: field provider
@type `'github' | 'gitee'`
@default `'github'`
Repository platform. Currently only `github`/`gitee` are supported.
:::

::: field fullname
@type `boolean`

Whether to display the full repository name (`owner/repo`).

* `undefined` (default): when the owner is an individual, only `repo` is shown; when the owner is an organization, `owner/repo` is shown
* `true`: always show `owner/repo`
* `false`: always show only `repo` (even when the owner is an organization, the full name is not shown)
  :::

::::

## Slots

**This component provides no slots.** Repository information is fetched internally through the
GitHub / Gitee API and rendered for you; the content is fully determined by `repo` and `provider`.

To display custom content alongside repositories, build it with [`Card`](./v-card.md).

## Examples

### Single Card

**Input:**

```md
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

**Output:**

### Multiple Cards

If you want to display multiple cards side by side in a compact way, you can use the `CardGrid` component.

**Input:**

```md
<CardGrid>
  <RepoCard repo="vuepress/core" />
  <RepoCard repo="vuepress/ecosystem" />
</CardGrid>
```

**Output:**

**Input:**

```md
<CardGrid>
  <RepoCard repo="pengzb/vuepress-theme-plume" provider="gitee" />
  <RepoCard repo="pengzb/vite-plugin-mock-dev-server" provider="gitee" />
</CardGrid>
```

**Output:**
