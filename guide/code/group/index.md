---
url: /guide/code/group/index.md
---
## 概述

代码组（Code Tabs）是 主题 中用于并排展示多个相关代码片段的强大功能。
通过标签页形式组织代码，您可以清晰对比不同技术栈、配置方案或语言版本的实现差异。

## 基础语法

### 多代码块分组

使用代码组语法将多个代码块组织在同一标签容器中：

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

### 设置默认激活标签

通过 `@tab:active` 语法指定默认显示的代码标签：

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

## 标签图标支持&#x20;

主题为代码组标签提供智能图标显示功能，基于标签标题自动匹配相关技术图标。

### 自动图标识别

主题内置了主流技术和语言的图标映射：

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

### 支持的图标类别

主题默认适配以下技术栈的图标：

* **运行环境**：Node.js、Deno、Bun
* **包管理器**：pnpm、yarn、npm
* **前端框架**：Vue、React、Angular、Svelte、Solid、Next.js、Nuxt
* **编程语言**：TypeScript、JavaScript、C、C++、Java、Python、Rust、Kotlin、Swift、Go

::: info 图标支持反馈
如果您使用的技术栈未能正确显示图标，欢迎提交 [issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues/new) 告知我们，我们将尽快添加相关图标支持。
:::

## 图标配置选项

通过 `markdown.codeTabs` 配置项精确控制图标显示行为：

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTabs: {
        icon: true, // 启用图标功能
      }
    },
  })
})
```

配置接口定义：

```ts
export interface CodeTabsOptions {
  icon?: boolean | {
    named?: false | string[]
    extensions?: false | string[]
  }
}
```

### 配置示例

**禁用所有图标**：

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTabs: {
        icon: false
      }
    }
  })
})
```

**仅显示指定技术栈图标**：

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTabs: {
        icon: {
          named: ['pnpm', 'yarn', 'npm'], // 仅匹配这些技术名称
          extensions: false // 禁用文件扩展名匹配
        }
      }
    }
  })
})
```

**配置说明**：

* `named`：精确匹配技术名称（如 `pnpm`、`vue`、`react`）
* `extensions`：匹配文件扩展名（如 `.ts`、`.js`、`.py`）
* 设置为 `false` 禁用对应匹配方式
* 空数组使用默认匹配规则
* 字符串匹配区分大小写

## 性能优化说明

::: tip 图标体积优化
您无需担心图标资源对构建体积的影响。代码组图标基于 Iconify 体系实现，配合本地安装的 `@iconify/json` 包，主题会自动：

* 解析并提取实际使用的图标数据
* 生成优化的本地图标资源
* 确保相同图标仅打包一次

每个彩色图标的平均体积仅为 1-2KB，即使大量使用不同图标，对最终构建体积的影响也微乎其微。
:::

通过合理的配置和使用，代码组功能能够显著提升技术文档的可读性和用户体验，帮助读者更高效地理解不同技术方案间的差异。
