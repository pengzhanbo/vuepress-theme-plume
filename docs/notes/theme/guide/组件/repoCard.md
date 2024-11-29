---
title: Repo 卡片
author: pengzhanbo
icon: octicon:repo-16
createTime: 2024/07/26 21:11:56
permalink: /guide/components/github-repo-card/
---

<script setup>
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
</script>

## 概述

Repo 卡片组件 用于显示 GitHub 仓库信息。

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

::: code-tabs
@tab .vuepress/client.ts

```ts
import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app }) {
    app.component('RepoCard', RepoCard)
  },
})
```

:::

全局组件可在 其他任意 markdown 文件中使用

```md
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

### Props

`RepoCard` 组件的 接收一个 `repo` 参数，传入的是仓库的地址，格式为 `owner/repo`。

## 示例

### 单卡片

**输入：**

```md
<RepoCard repo="pengzhanbo/vuepress-theme-plume" />
```

**输出：**

<RepoCard repo="pengzhanbo/vuepress-theme-plume" />

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

<CardGrid>
  <RepoCard repo="vuepress/core" />
  <RepoCard repo="vuepress/ecosystem" />
</CardGrid>
