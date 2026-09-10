---
url: /en/guide/markdown/npm-to/index.md
---
## Overview

The npmTo container converts npm command-line code blocks into `pnpm / yarn / deno / bun` command-line
code blocks, presenting them as a group of code blocks on the page.

Within the `::: npm-to` container, you only need to write the npm command code block once.

::: details Why do we need the npmTo container?
When I write documentation, I often need to provide commands for different environments like `pnpm / yarn / npm`.
This requires multiple code blocks wrapped in the `::: code-tabs` container,
which is time-consuming and takes up a lot of space in the Markdown content,
leading to a poor experience. That's why I created the `::: npm-to` container to solve this problem.
:::

## Usage

````md{1,5}
::: npm-to
``` sh
npm install -D vuepress vuepress-theme-plume
```
:::
````

Just wrap the code block containing the `npm` command-line in the `::: npm-to` container.

::: warning The npm-to container only supports a single code block and cannot contain other content
:::

The code above will be converted internally to:

````md
::: code-tabs
@tab pnpm
``` sh
pnpm add -D vuepress vuepress-theme-plume
```
@tab yarn
``` sh
yarn add -D vuepress vuepress-theme-plume
```
@tab npm
``` sh
npm install -D vuepress vuepress-theme-plume
```
:::
````

The final output on the page will be:

::: npm-to

```sh
npm install -D vuepress vuepress-theme-plume
```

:::

You can also control the display order of the code blocks in the group, as shown below:

**Input:**

````md {1,5}
::: npm-to tabs="npm,yarn,pnpm,bun,deno"
``` sh
npm install -D vuepress vuepress-theme-plume
```
:::
````

**Output:**

::: npm-to tabs="npm,yarn,pnpm,bun,deno"

```sh
npm install -D vuepress vuepress-theme-plume
```

:::

## Configuration

This feature is not enabled by default. You need to enable it in the `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      // npmTo: true, // Enable with default configuration
      npmTo: {
        tabs: ['npm', 'yarn', 'pnpm'], // Default display order of code blocks
      }
    },
  })
})
```

`npm-to` supports converting `npm` command lines to `pnpm / yarn / deno / bun` command lines.
You can configure the `tabs` according to your needs.

## Supported Command Lines

`npmTo` does not support all `npm` command lines. Here is the list of supported commands:

* `npm install` / `npm i`
* `npm run` / `npm run-script`
* `npm init`
* `npm create`
* `npm uninstall` / `npm rm` / `npm remove` / `npm un` / `npm unlink`
* `npm ci`
* `npx`

::: info
For unsupported command lines, `npmTo` will not process them and will only copy them to the other code blocks.
:::

## Examples

**Input:**

````md
::: npm-to
```sh
npm install && npm run docs:dev
```
:::
````

**Output:**

::: npm-to

```sh
npm install && npm run docs:dev
```

:::

**Input:**

````md
::: npm-to
```sh
npm i -D vue
npm i --save-peer vuepress
npm i typescript
```
:::
````

**Output:**
::: npm-to

```sh
npm i -D vue
npm i --save-peer vuepress
npm i typescript
```

:::

**Input:**

````md
::: npm-to
```sh
npm run docs:dev -- --clean-cache
```
:::
````

**Output:**

::: npm-to

```sh
npm run docs:dev -- --clean-cache
```

:::

**Input:**

````md
::: npm-to tabs="pnpm,yarn,npm,bun,deno"
```sh
npm ci
```
:::
````

**Output:**

::: npm-to tabs="pnpm,yarn,npm,bun,deno"

```sh
npm ci
```

:::
