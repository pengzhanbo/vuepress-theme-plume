---
url: /guide/usage/index.md
---
## 环境要求

* [Node.js](https://nodejs.org/)：**^20.19.0 或 >= 22.0.0** \[+node-versions]
* 包管理器：[npm 8+](https://www.npmjs.com/)、[pnpm 8+](https://pnpm.io/zh/) 或 [Yarn 2+](https://yarnpkg.com/)

\[+node-versions]: **^20.19.0：** `20.19.0` 及以上但低于 `21.0.0` 的版本
\[+node-versions]: **>= 22.0.0：** `22.0.0` 及以上的版本

:::: details 如何安装环境依赖？
::: steps

1. **下载 Node.js**

   访问 [Node.js 官网](https://nodejs.org/zh-cn) 下载最新稳定版，按照安装向导完成安装（通常保持默认设置即可）。

2. **启用 PNPM**

   安装完成后打开终端，执行以下命令：

   ```sh
   corepack enable
   ```

   我们推荐使用 pnpm 作为包管理器。

3. **环境就绪**
   :::
   ::::

## 命令行安装&#x20;

我们提供了命令行工具，可快速搭建基础项目结构。执行以下命令启动安装向导：

::: npm-to

```sh
npm create vuepress-theme-plume@latest
```

:::

启动后只需回答几个简单问题即可完成配置：

```ansi :no-line-numbers :collapsed-lines
[0;90m┌[0m  [0;36;1mWelcome to VuePress and vuepress-theme-plume ![0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  Select a language to display / 选择显示语言[0m
[0;90m│[0m[0m  [0;2m简体中文[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  您想在哪里初始化 VuePress？[0m
[0;90m│[0m[0m  [0;2m./my-project[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  站点名称：[0m
[0;90m│[0m[0m  [0;2mMy Vuepress Site[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  站点描述信息：[0m
[0;90m│[0m[0m  [0;2mMy Vuepress Site Description[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  是否使用多语言？[0m
[0;90m│[0m[0m  [0;2mNo[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  请选择站点默认语言[0m
[0;90m│[0m[0m  [0;2m简体中文[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  是否使用 TypeScript？[0m
[0;90m│[0m[0m  [0;2mYes[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  请选择打包工具[0m
[0;90m│[0m[0m  [0;2mVite[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  部署方式：[0m
[0;90m│[0m[0m  [0;2mCustom[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  是否初始化 git 仓库？[0m
[0;90m│[0m[0m  [0;2mYes[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m  是否安装依赖？[0m
[0;90m│[0m[0m  [0;2mYes[0m[0m
[0;90m│[0m[0m
[0;32m◇[0m   🎉 创建成功![0m
[0;90m│[0m[0m
[0;90m└[0m[0m  🔨 执行以下命令即可启动：[0m
      [0;32mcd ./my-project[0m
      [0;32mpnpm run docs:dev[0m
```

::: details 命令行工具使用指南

以 Windows 系统为例：

1. 按下 `Win + R` 打开"运行"对话框
2. 输入 `cmd` 或 `powershell` 后按 Enter

如果当前目录不正确，可使用以下命令切换：

```sh
D:                    # 切换到 D 盘（根据实际情况调整）
cd open-source        # 进入目标目录
```

此时执行 `pnpm create vuepress-theme-plume@latest` 即可创建项目，项目将位于 `D:\open-source\my-project` 目录。
:::

## 手动安装

::: info 注意事项

* 使用 [pnpm](https://pnpm.io/zh/) 时需额外安装 `vue` 作为 peer-dependencies
* 使用 [Yarn 2+](https://yarnpkg.com/) 时需在 `.yarnrc.yml` 中设置 `nodeLinker: 'node-modules'`
  :::

如需手动安装，请按以下步骤操作：

:::: steps

* ### 创建项目目录

  ```sh
  mkdir my-blog
  cd my-blog
  ```

* ### 初始化项目

  ::: npm-to

  ```sh
  git init
  npm init
  ```

  :::

* ### 安装核心依赖

  安装 `vuepress@next` 和主题包：

  ::: npm-to

  ```sh
  # 安装 VuePress
  npm i -D vuepress@next vue
  # 安装主题和构建工具
  npm i -D vuepress-theme-plume @vuepress/bundler-vite@next
  ```

  :::

  ::: warning 版本兼容性
  当前主题已适配至 vuepress@{{ vuepressVersion }}，使用其他版本可能存在兼容性问题。
  :::

* ### 配置构建脚本

  在 `package.json` 中添加：

  ```json title="package.json"
  {
    "scripts": {
      "docs:dev": "vuepress dev docs",
      "docs:build": "vuepress build docs"
    }
  }
  ```

  VuePress 默认使用 `docs` 目录作为文档根目录。

* ### 配置 Git 忽略规则

  ::: code-tabs
  @tab .gitignore

  ```txt
  node_modules
  .temp
  .cache
  ```

  @tab sh

  ```sh
  echo 'node_modules' >> .gitignore
  echo '.temp' >> .gitignore
  echo '.cache' >> .gitignore
  ```

  :::

* ### 配置主题

  ```ts title="docs/.vuepress/config.ts" twoslash
  import { viteBundler } from '@vuepress/bundler-vite'
  import { defineUserConfig } from 'vuepress'
  import { plumeTheme } from 'vuepress-theme-plume'

  export default defineUserConfig({
    // 必须设置默认语言
    lang: 'zh-CN',
    theme: plumeTheme({
      // 主题配置...
    }),
    bundler: viteBundler(),
  })
  ```

  ::: warning 语言配置必填
  无论是否使用多语言，都必须正确配置 `lang` 选项，主题依赖此设置确定文本语言环境。
  :::

* ### 创建首页文档

  ```md title="README.md"
  ---
  home: true
  ---
  ```

* ### 启动开发服务器

  ::: npm-to

  ```sh
  npm run docs:dev
  ```

  :::

  VuePress 将在 <http://localhost:8080> 启动开发服务器，支持 Markdown 文件的热重载。

* ### 安装完成

::::

## 主题更新

使用以下命令检查并更新主题：

::: npm-to

```sh
npx vp-update
```

:::
