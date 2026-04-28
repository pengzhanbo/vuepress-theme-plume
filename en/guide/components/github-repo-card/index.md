---
url: /en/guide/components/github-repo-card/index.md
---
## Overview

The Repo Card component is used to display GitHub/Gitee repository information.

## Usage

To use this component, you need to manually import the `RepoCard` component:

```md :no-line-numbers
<!-- Import in markdown -->
<script setup>
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
</script>

<!-- After importing, you can use it in markdown -->
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

Register as a global component:

```ts title=".vuepress/client.ts"
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app }) {
    app.component('RepoCard', RepoCard)
  },
})
```

Global components can be used in any other markdown file:

```md
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

### Props

:::: field-group

::: field name="repo" type="string" required
Repository address in `owner/repo` format
:::

::: field name="provider" type="github | gitee" optional default="'github'"
Repository platform. Currently only `github`/`gitee` are supported.
:::

::: field name="fullname" type="boolean" optional
Whether to display the full repository name.

The full repository name is `owner/repo`.

* If the owner is an individual, the full repository name is not displayed by default, only `repo` is shown.
* If the owner is an organization, the full repository name is displayed by default.
  :::

::::

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
