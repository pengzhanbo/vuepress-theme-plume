---
url: /en/guide/usage/index.md
---
## Environment Requirements

* [Node.js](https://nodejs.org/): **^20.19.0 or >= 22.0.0** \[+node-versions]
* Package Manager: [npm 8+](https://www.npmjs.com/), [pnpm 8+](https://pnpm.io/), or [Yarn 2+](https://yarnpkg.com/)

\[+node-versions]: **^20.19.0:** Versions `20.19.0` and above but below `21.0.0`
\[+node-versions]: **>= 22.0.0:** Versions `22.0.0` and above

:::: details How to Install Environment Dependencies?
::: steps

1. **Download Node.js**

   Visit the [Node.js official website](https://nodejs.org/) to download the latest stable version.
   Follow the installation wizard to complete the installation (typically keeping the default settings is sufficient).

2. **Enable PNPM**

   After installation, open the terminal and execute the following command:

   ```sh
   corepack enable
   ```

   We recommend using pnpm as the package manager.

3. **Environment Ready**
   :::
   ::::

## Command Line Installation&#x20;

We provide a command-line tool for quickly setting up a basic project structure. Execute the following command to start the installation wizard:

::: npm-to

```sh
npm create vuepress-theme-plume@latest
```

:::

After launching, simply answer a few simple questions to complete the configuration:

::: details Command Line Tool Usage Guide

Using Windows as an example:

1. Press `Win + R` to open the "Run" dialog
2. Enter `cmd` or `powershell` and press Enter

If the current directory is incorrect, use the following commands to switch:

```sh
D:                    # Switch to D drive (adjust according to your situation)
cd open-source        # Enter the target directory
```

You can then execute `pnpm create vuepress-theme-plume@latest` to create the project.
The project will be located in the `D:\open-source\my-project` directory.
:::

## Manual Installation

::: info Important Notes

* When using [pnpm](https://pnpm.io/), `vue` must be additionally installed as peer-dependencies
* When using [Yarn 2+](https://yarnpkg.com/), set `nodeLinker: 'node-modules'` in `.yarnrc.yml`
  :::

If manual installation is required, follow these steps:

:::: steps

* ### Create Project Directory

  ```sh
  mkdir my-blog
  cd my-blog
  ```

* ### Initialize Project

  ::: npm-to

  ```sh
  git init
  npm init
  ```

  :::

* ### Install Core Dependencies

  Install `vuepress@next` and the theme package:

  ::: npm-to

  ```sh
  # Install VuePress
  npm i -D vuepress@next vue
  # Install theme and build tool
  npm i -D vuepress-theme-plume @vuepress/bundler-vite@next
  ```

  :::

  ::: warning Version Compatibility
  The current theme is adapted to vuepress@{{ vuepressVersion }}. Using other versions may cause compatibility issues.
  :::

* ### Configure Build Scripts

  Add the following to `package.json`:

  ```json title="package.json"
  {
    "scripts": {
      "docs:dev": "vuepress dev docs",
      "docs:build": "vuepress build docs"
    }
  }
  ```

  VuePress uses the `docs` directory as the documentation root by default.

* ### Configure Git Ignore Rules

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

* ### Configure Theme

  ```ts title="docs/.vuepress/config.ts" twoslash
  import { viteBundler } from '@vuepress/bundler-vite'
  import { defineUserConfig } from 'vuepress'
  import { plumeTheme } from 'vuepress-theme-plume'

  export default defineUserConfig({
    // Default language must be set
    lang: 'zh-CN',
    theme: plumeTheme({
      // Theme configuration...
    }),
    bundler: viteBundler(),
  })
  ```

  ::: warning Language Configuration Required
  Regardless of whether multiple languages are used, the `lang` option must be correctly configured.
  The theme relies on this setting to determine the text language environment.
  :::

* ### Create Homepage Document

  ```md title="README.md"
  ---
  home: true
  ---
  ```

* ### Start Development Server

  ::: npm-to

  ```sh
  npm run docs:dev
  ```

  :::

  VuePress will start a development server at <http://localhost:8080> with hot-reload support for Markdown files.

* ### Installation Complete

::::

## Theme Update

Use the following command to check and update the theme:

::: npm-to

```sh
npx vp-update
```

:::
