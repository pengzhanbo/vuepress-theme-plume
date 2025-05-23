---
title: 文章贡献者
icon: simple-icons:contributorcovenant
createTime: 2024/11/07 16:26:54
permalink: /guide/features/contributors/
---

## 概述

主题支持为文章添加贡献者信息，以便更好的了解您的文章贡献者。

文章贡献者通过 git 提交记录获取。

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
    // 默认启用，仅当 plugins.git 为 true 时生效
    // 此配置在 plume.config.ts 中无效
    contributors: true,

    plugins: {
      // 如果您在此处直接声明为 true，则表示开发环境和生产环境都启用该功能
      git: process.env.NODE_ENV === 'production'
    }
  })
})
```

## 配置

### mode

- 类型：`'inline' | 'block'`
- 默认值：`'inline'`
- 描述：

  - `inline`：在文章页底部，与 最后更新时间，并列显示贡献者信息，该模式下仅显示 贡献者名称。

    ![contributors inline](/images/contributors-inline.png)

  - `block`：在文章内容末尾插入贡献者信息，该模式下包含 贡献者名称、贡献者链接、贡献者头像。
    (如当前页面内容结尾所示)

    在 `block` 模式下，贡献者默认均会显示头像，即使您未填写头像地址。插件会从 `https://gravatar.com/`
    根据 邮箱地址或用户名 生成头像地址。

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
    },
  })
})
```

### info

- 类型：`ContributorInfo[]`

  ```ts
  interface ContributorInfo {
    /**
     * 贡献者在 Git 托管服务中的用户名
     */
    username: string
    /**
     * 贡献者显示在页面上的名字， 默认为 `username`
     */
    name?: string
    /**
     * 贡献者别名， 由于贡献者可能在本地 git 配置中保存的 用户名与 托管服务 用户名不一致，
     * 这时候可以通过别名映射到真实的用户名
     */
    alias?: string[] | string
    /**
     * 贡献者头像地址
     * 如果 git 托管服务为 `github`，则可以忽略不填，由插件自动填充
     */
    avatar?: string
    /**
     * 贡献者访问地址
     * 如果 git 托管服务为 `github`，则可以忽略不填，由插件自动填充
     */
    url?: string
  }
  ```

- 描述：

  贡献者信息列表。

  用户在本地 git 服务中配置的 用户名和邮箱 可能与 git 托管服务（如 github、gitlab、gitee）的用户信息不一致。
  可以在此预先配置贡献者信息。

  (对于非 github 的其他 git 托管服务，诸如 gitlab、gitee，由于不能通过用户名直接获取头像和用户地址，请在此
  补充完善用户信息。)

::: code-tabs

@tab Github

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // github username
          alias: ['peng_zhan_bo'], // 别名，本地 git 配置中的用户名
        }
      ]
    },
  })
})
```

@tab Gitlab

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // gitlab username
          alias: ['peng_zhan_bo'], // 别名，本地 git 配置中的用户名
          url: 'https://gitlab.com/pengzhanbo',
          avatar: 'https://gitlab.com/uploads/-/system/user/avatar/1/avatar.png',
        }
      ]
    },
  })
})
```

@tab Gitee

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // gitee username
          alias: ['peng_zhan_bo'], // 别名，本地 git 配置中的用户名
          url: 'https://gitee.com/pengzhanbo',
          avatar: 'https://foruda.gitee.com/avatar/1234455/avatar.png',
        }
      ]
    },
  })
})
```

@tab Bitbucket

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // bitbucket username
          alias: ['peng_zhan_bo'], // 别名，本地 git 配置中的用户名
          url: 'https://bitbucket.org/pengzhanbo',
          avatar: 'https://bitbucket.org/pengzhanbo/avatar/1234455/avatar.png',
        }
      ]
    },
  })
})
```

@tab 其它

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // username
          alias: ['peng_zhan_bo'], // 别名，本地 git 配置中的用户名
          url: 'https://your-git.com/pengzhanbo',
          avatar: 'https://your-git.com/avatar.png',
        }
      ]
    },
  })
})
```

:::

### avatar

- 类型：`boolean`
- 默认值：`true`
- 描述：是否显示贡献者头像

### avatarPattern

- 类型：`string`
- 默认值：`'https://github.com/:username.png'`
- 描述：贡献者头像地址模式

    `:username` 会被替换为贡献者的 用户名

### transform(contributors)

- 类型：`(contributors: GitContributor[]) => GitContributor[]`

  ```ts
  interface GitContributor {
    name: string // 显示的名字
    username: string // git 托管服务 username
    email: string
    commits: number // 贡献者提交次数
    avatar?: string
  }
  ```

- 描述：

  贡献者转换函数。该函数需要返回新的 贡献者列表。
  你可以在此处补充转换逻辑，比如进行排序、去重、或者补全信息等。

## frontmatter

### contributors

- 类型：`boolean | string[]`

- 描述:

  是否显示贡献者信息。

   如果您的文章来源于第三方， git 提交不能完整列出所有的作者，您可以在此处补充贡献者。

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
