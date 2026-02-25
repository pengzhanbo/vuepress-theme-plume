---
url: /guide/components/github-repo-card/index.md
---
## 概述

Repo 卡片组件 用于显示 GitHub / Gitee 仓库信息。

## 使用

使用该组件需要你手动导入 `RepoCard` 组件：

```md :no-line-numbers
<!-- 在 markdown 中导入 -->
<script setup>
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
</script>

<!-- 导入后，即可在 markdown 中使用 -->
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

注册为全局组件：

```ts title=".vuepress/client.ts"
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app }) {
    app.component('RepoCard', RepoCard)
  },
})
```

全局组件可在 其他任意 markdown 文件中使用

```md
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

### Props

:::: field-group

::: field name="repo" type="string" required
仓库地址，格式为 `owner/repo`
:::

::: field name="provider" type="github | gitee" optional default="'github'"
仓库所属平台，当前仅支持 `github / gitee` 。
:::

::: field name="fullname" type="boolean" optional
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
