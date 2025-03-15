---
title: 代码组
icon: fluent:group-list-20-filled
createTime: 2024/04/04 10:36:59
permalink: /guide/code/group/
---

## 语法

可以像这样对多个代码块进行分组：

**输入：**

````md
::: code-tabs
@tab config.js
```js
/**
 * @type {import('vuepress').UserConfig}
 */
const config = {
  // ..
}

export default config
```

@tab config.ts
```ts
import type { UserConfig } from 'vuepress'

const config: UserConfig = {
  // ..
}

export default config
```
:::
````

**输出：**

::: code-tabs
@tab config.js

```js
/**
 * @type {import('vuepress').UserConfig}
 */
const config = {
  // ..
}

export default config
```

@tab config.ts

```ts
import type { UserConfig } from 'vuepress'

const config: UserConfig = {
  // ..
}

export default config
```

:::

你还可以通过 `@tab:active` 选择其中一个代码块作为默认显示的代码块。

**输入：**

````md
::: code-tabs
@tab config.js
```js
/**
 * @type {import('vuepress').UserConfig}
 */
const config = {
  // ..
}

export default config
```

@tab:active config.ts <!-- [!code hl] -->
```ts
import type { UserConfig } from 'vuepress'

const config: UserConfig = {
  // ..
}

export default config
```
:::
````

**输出：**

::: code-tabs
@tab config.js

```js
/**
 * @type {import('vuepress').UserConfig}
 */
const config = {
  // ..
}

export default config
```

@tab:active config.ts

```ts
import type { UserConfig } from 'vuepress'

const config: UserConfig = {
  // ..
}

export default config
```

:::

## 分组标题图标 <Badge type="tip" text="v1.0.0-rc.103 +" />

主题支持在 代码块分组的组标题上显示图标。 图标根据 标题，即 `@tab 标题` 进行解析适配不同的图标

默认解析规则与 [文件树](../markdown/file-tree.md) 一致。

如， `pnpm / yarn / npm` 分组图标：

**输入：**

````md
::: code-tabs
@tab pnpm

```sh
pnpm i
```

@tab yarn

```sh
yarn
```

@tab npm

```sh
npm install
```

:::
````

**输出：**

::: code-tabs
@tab pnpm

```sh
pnpm i
```

@tab yarn

```sh
yarn
```

@tab npm

```sh
npm install
```

:::

主题默认适配了 前端主流的一些技术：

- 运行环境，如： `NodeJs / Deno / Bun`
- 包管理器，如： `pnpm / yarn / npm`
- 库、框架，如： `vue / react / angular / svelte / solid / Next / Nuxt` 等

还包括一些主流的语言，如： `TypeScript / JavaScript / C / C++ / Java / Python / Rust / Kotlin / Swift / Go` 等

::: info
如果您发现您所使用的 库、框架、语言等未能正确显示图标，可以提出 [issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues/new) 告诉我，我会尽量添加相关图标。
:::

### 配置

您可以通过 `markdown.codeTabs` 控制分组图标的行为：

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTabs: {
        icon: true, // CodeTabsOptions
      }
    },
  })
})
```

```ts
export interface CodeTabsOptions {
  icon?: boolean | { named?: false | string[], extensions?: false | string[] }
}
```

- `true`: 使用默认解析规则显示图标
- `false`: 不显示图标
- `{ named?: false | string[], extensions?: false | string[] }`:
  - `named`: 表示 库/框架/语言 名称，严格匹配 `@tab 标题` 中的 `标题` 字段，如 `pnpm`、`yarn`、`npm` 等，如果设置为 `false` 则不显示图标，如果为 空数组，则使用默认匹配规则
  - `extensions`: 表示 文件扩展名，匹配 `@tab 标题` 中的 `标题` 字段是否包含扩展名，如 `.ts`、`.js` 等，如果设置为 `false` 则不显示图标，如果为 空数组，则使用默认匹配规则

  请注意， `named` 和 `extensions` 数组中的元素必须是 `string` 类型，且严格区分大小写。

举一个例子，如果您是一个前端开发，且仅想在 `pnpm/yarn/npm` 分组时显示图标，其它分组时不显示图标，
那么可以进行如下配置：

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        codeTabs: {
          icon: {
            named: ['pnpm', 'yarn', 'npm'], // [!code ++:2]
            extensions: false,
          }
        }
      },
    }
  })
})
```

你可以灵活地配置图标显示规则。

::: tip 担心图标会影响构建包体积？
您无需担心，代码块分组的图标 也是从 `iconify` 解析获取，推荐您在本地安装 `@iconify/json` 项目，
主题会自动将 `@iconify/json` 中的图标数据解析为本地图标资源，即使您在不同的页面
多次使用，这包括了 导航栏、侧边栏、图标组件等，相同图标仅会存在一份资源！

每个彩色图标的大小约在 `1kb ~ 2kb` 之间，即使您的文件树非常夸张的使用了 100+ 不同的图标，对最终的构建包体积影响
也不会很大。
:::
