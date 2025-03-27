---
title: Installation/Usage
icon: grommet-icons:install
createTime: 2025/03/02 13:28:45
permalink: /en/guide/usage/
tags:
  - Guide
  - Quick Start
---

<script setup>
const vuepressVersion = __VUEPRESS_VERSION__
</script>

## Dependency Environment

- [Node.js v20.6.0+](https://nodejs.org/)
- [npm 8+](https://www.npmjs.com/) or [pnpm 8+](https://pnpm.io/zh/) or [Yarn 2+](https://yarnpkg.com/)

:::: details How to install the dependency environment?
::: steps

1. **Please go to the [Node.js Official Website](https://nodejs.org/zh-cn) to download the latest stable version**

   Follow the instructions to complete the installation. Generally, you only need to keep the default settings and choose Next during the installation process.

2. **Install PNPM**

   After you have installed node.js, please open the terminal and run the following command:

   ```sh
   corepack enable
   ```

   The theme recommends using pnpm as the project manager.

3. **Done**

:::
::::

## Command Line Installation

The theme provides a command line tool to help you build a basic project. You can run the following command to start the installation wizard.

::: npm-to

```sh
npm create vuepress-theme-plume@latest
```

:::

After starting the wizard, you only need to answer a few simple questions:

<!-- @include: ../snippet/create.snippet.md ---->

::: details How to use the command line tool?

Taking the Windows system as an example, you can use the following methods to start the CMD command line tool:

1. Press the `Win + R` keys to open the "Run" dialog.
2. Enter `cmd` and press the Enter key. (You can also enter `powershell` to open PowerShell)

Note that `cmd` may not be in the directory you expect. You can use the following command to switch to the correct directory:

```sh
D: # This command switches to the D: drive, enter other drives according to the actual situation
cd open-source # Enter the open-source directory under D:
```

Now, you can create a basic project by entering `pnpm create vuepress-theme-plume@latest` here.

The created project will be located in the `D:\open-source\my-project` directory.
:::

## Manual Installation

::: info Note

- When using [pnpm](https://pnpm.io/zh/), you need to install `vue` as a peer-dependency.
- When using [Yarn 2+](https://yarnpkg.com/), you need to set `nodeLinker: 'node-modules'` in the `.yarnrc.yml` file.
  :::

To use this theme, you need to first create a new project and install `vuepress@next` and this theme.

:::: steps

- ### Create a new folder and enter the directory

  ``` sh :no-line-numbers
  mkdir my-blog
  cd my-blog
  ```

- ### Initialize the project

  ::: npm-to

  ``` sh
  git init
  npm init
  ```

  :::

- ### Install related dependencies

  Install `vuepress@next` and `vuepress-theme-plume` as local dependencies.

  ::: npm-to

  ```sh
  # Install vuepress
  npm i -D vuepress@next vue
  # Install theme and bundler
  npm i -D vuepress-theme-plume @vuepress/bundler-vite@next
  ```

  :::

  :::warning
  The current version of the theme has been adapted to <code>vuepress@{{ vuepressVersion }}</code>. You should install this version of VuePress. Versions higher or lower than this may have potential compatibility issues.
  :::

- ### Add `script` in `package.json`

  ::: code-tabs
  @tab package.json

  ``` json :no-line-numbers
  {
    "scripts": {
      "docs:dev": "vuepress dev docs",
      "docs:build": "vuepress build docs"
    }
  }
  ```

  :::

  `vuepress` defaults to placing the documentation source code in the `docs` directory.

- ### Add the default temporary and cache directories to the `.gitignore` file

  ::: code-tabs
  @tab .gitignore

  ``` txt :no-line-numbers
  node_modules
  .temp
  .cache
  ```

  @tab sh

  ``` sh :no-line-numbers
  echo 'node_modules' >> .gitignore
  echo '.temp' >> .gitignore
  echo '.cache' >> .gitignore
  ```

  :::

- ### Configure the theme in `docs/.vuepress/config.{js,ts}`

  ::: code-tabs
  @tab docs/.vuepress/config.ts

  ``` ts :no-line-numbers
  import { viteBundler } from '@vuepress/bundler-vite'
  import { defineUserConfig } from 'vuepress'
  import { plumeTheme } from 'vuepress-theme-plume'

  export default defineUserConfig({
    // Don't forget to set the default language
    lang: 'zh-CN',
    theme: plumeTheme({
      // more...
    }),
    bundler: viteBundler(),
  })
  ```

  :::

  :::warning
  Whether or not you need to use **multiple languages**, you should configure the correct value for the `lang` option in VuePress. The theme needs to determine the language environment text based on the `lang` option.
  :::

- ### Create a new `README.md` file in the `docs` directory

  Declare the home page configuration.
  ::: code-tabs
  @tab README.md

  ``` md :no-line-numbers
  ---
  home: true
  ---
  ```

  :::

- ### Start your documentation site on the local server

  ::: npm-to

  ``` sh
  npm run docs:dev
  ```

  :::

  Vuepress will start a hot-reload development server at [http://localhost:8080](http://localhost:8080). When you modify your Markdown files, the content in the browser will also update automatically.

- ### Done

::::

## Update the Theme

You can run the following command directly in your project to check for available updates:

::: npm-to

``` sh
npx vp-update
```

:::
