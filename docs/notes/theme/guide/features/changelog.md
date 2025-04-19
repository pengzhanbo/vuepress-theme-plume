---
title: 文章变更历史
icon: radix-icons:activity-log
createTime: 2024/11/07 18:16:25
permalink: /guide/features/changelog/
---

## 概述

主题支持为文章添加 文章变更历史，以便更好的了解您的文章修改历史。

文章变更历史 通过 git 提交记录获取。

该功能由 [@vuepress/plugin-git](https://ecosystem.vuejs.press/zh/plugins/development/git.html) 提供支持。

::: warning 注意
该功能由于需要通过 `git log` 命令获取每个 md 文件的提交记录，是一个相对比较耗时的操作，特别是对于大型项目，提交记录数量较多的情况。因此该功能在开发环境中不会启用，仅在生产环境中启用。

但你仍然可以通过设置 `theme.plugins.git` 为 `true` 来启用该功能，以便在开发环境中测试。

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: { git: true }
  })
})
```

:::

## 使用

主题已内置 [@vuepress/plugin-git](https://ecosystem.vuejs.press/zh/plugins/development/git.html) 插件，你无需重新安装即可使用。

在主题配置文件中启用该功能:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 默认 不启用，仅当 plugins.git 为 true 时生效
    // 此配置在 plume.config.ts 中无效
    changelog: true,

    plugins: {
      // 如果您在此处直接声明为 true，则表示开发环境和生产环境都启用该功能
      git: process.env.NODE_ENV === 'production'
    }
  })
})
```

## 配置

```ts
interface ChangelogOptions {
  /**
   * 最大变更记录条数, 默认获取所有记录
   */
  maxCount?: number
  /**
   * git 仓库的访问地址，例如：https://github.com/vuepress/ecosystem
   */
  repoUrl?: string
  /**
   * 提交记录访问地址模式
   *
   * - `:repo` - git 仓库的访问地址
   * - `:hash` - 提交记录的 hash
   *
   * @default ':repo/commit/:hash'
   */
  commitUrlPattern?: string
  /**
   * issue 访问地址模式
   *
   * - `:repo` - git 仓库的访问地址
   * - `:issue` - issue 的 id
   *
   * @default ':repo/issues/:issue'
   */
  issueUrlPattern?: string
  /**
   * tag 访问地址模式,
   * 默认值：':repo/releases/tag/:tag'
   *
   * - `:repo` - git 仓库的访问地址
   * - `:tag` - tag 的名称
   *
   * @default ':repo/releases/tag/:tag'
   */
  tagUrlPattern?: string
}
```

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    changelog: {
      maxCount: 10,
      repoUrl: 'https://github.com/vuepress/vuepress',
      commitUrlPattern: ':repo/commit/:hash',
      issueUrlPattern: ':repo/issues/:issue',
      tagUrlPattern: ':repo/releases/tag/:tag'
    },

  })
})
```

::: warning 注意
请确保 `changelog.repoUrl` 配置正确， 默认值为 [docsRepo](../../config/theme.md#docsrepo)。

主题默认适配了 `github/gitlab/gitee/bitbucket`  git 托管服务的相关访问地址模式。
如果您使用的是内建的托管服务或者其他，请自行配置 `commitUrlPattern`、`issueUrlPattern`、`tagUrlPattern`。
:::

## 注意

该功能要求你的项目在 [Git 仓库](https://git-scm.com/book/en/Git-Basics-Getting-a-Git-Repository) 下，这样它才能从提交历史记录中收集信息。

**在构建站点时，你应该确保所有的提交记录是可以获取到的。**

举例来说， CI 工作流通常会在克隆你的仓库时添加 `--depth 1` 参数来避免拉取全部的提交记录，因此你需要禁用这个功能，以便该插件在 CI 可以中正常使用。

类似于 `github actions` 、`Netlify` 、 `Vercel` 等服务，默认是不会拉取全部的提交记录的。

在 `github actions` 中，可以通过添加 `--depth 0` 参数来使得 `github actions` 可以正确获取到所有的提交记录。

``` yaml title=".github/workflows/deploy.yml"
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4 # [!code focus:3]
        with: # [!code ++:2]
          fetch-depth: 0
```

在 `Netlify` 、 `Vercel` 等服务中，处理方法则会相对复杂一些。这时候您可以先在 `github actions` 完成构建后
输出将产物输出到另一个单独的分支，然后在 `Netlify` 或者 `Vercel` 中直接使用该分支进行部署。

::: info
通过主题的 `cli` 工具创建的项目，在选择部署方式为 `github action` 时，构建产物会输出到 `gh_pages` 分支中，
你可以在此基础上完成 `Netlify` 或者 `Vercel` 的部署。
:::
