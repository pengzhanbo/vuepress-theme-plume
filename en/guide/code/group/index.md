---
url: /en/guide/code/group/index.md
---
## Overview

Code Tabs are a powerful feature in the theme for displaying multiple related code snippets side by side.
By organizing code in tabbed interfaces, you can clearly compare implementation differences across
various tech stacks, configuration approaches, or language versions.

## Basic Syntax

### Multiple Code Block Grouping

Use code tab syntax to organize multiple code blocks within the same tab container:

**Input:**

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

**Output:**

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

### Setting Default Active Tab

Specify the default displayed code tab using the `@tab:active` syntax:

**Input:**

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

**Output:**

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

## Tab Icon Support&#x20;

The theme provides intelligent icon display functionality for code tab labels,
automatically matching relevant technology icons based on tab titles.

### Automatic Icon Recognition

The theme includes built-in icon mappings for mainstream technologies and languages:

**Input:**

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

**Output:**

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

### Supported Icon Categories

The theme automatically adapts icons for the following tech stacks:

* **Runtime Environments**: Node.js, Deno, Bun
* **Package Managers**: pnpm, yarn, npm
* **Frontend Frameworks**: Vue, React, Angular, Svelte, Solid, Next.js, Nuxt
* **Programming Languages**: TypeScript, JavaScript, C, C++, Java, Python, Rust, Kotlin, Swift, Go

::: info Icon Support Feedback
If the technology stack you're using doesn't display icons correctly, please submit an
[issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues/new) to let us know, and we'll add the relevant icon support as soon as possible.
:::

## Icon Configuration Options

Precisely control icon display behavior through the `markdown.codeTabs` configuration option:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTabs: {
        icon: true, // Enable icon functionality
      }
    },
  })
})
```

Configuration interface definition:

```ts
export interface CodeTabsOptions {
  icon?: boolean | {
    named?: false | string[]
    extensions?: false | string[]
  }
}
```

### Configuration Examples

**Disable All Icons**:

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

**Display Only Specified Technology Stack Icons**:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTabs: {
        icon: {
          named: ['pnpm', 'yarn', 'npm'], // Only match these technology names
          extensions: false // Disable file extension matching
        }
      }
    }
  })
})
```

**Configuration Notes**:

* `named`: Exact match for technology names (e.g., `pnpm`, `vue`, `react`)
* `extensions`: Match file extensions (e.g., `.ts`, `.js`, `.py`)
* Set to `false` to disable the corresponding matching method
* Empty arrays use default matching rules
* String matching is case-sensitive

## Performance Optimization Notes

::: tip Icon Volume Optimization
You don't need to worry about the impact of icon resources on build size.
Code tab icons are implemented based on the Iconify system, and with the locally installed `@iconify/json` package, the theme automatically:

* Parses and extracts actually used icon data
* Generates optimized local icon resources
* Ensures the same icon is bundled only once

The average size of each colored icon is only 1-2KB. Even with extensive use of different icons, the impact on the final build size is minimal.
:::

Through reasonable configuration and usage, the code tabs feature can significantly improve the readability
of technical documentation and user experience, helping readers more efficiently understand differences between various technical solutions.
