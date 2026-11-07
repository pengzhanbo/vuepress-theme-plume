---
url: /en/config/intro/index.md
---
## Overview

\==vuepress-theme-plume== is a theme developed based on [VuePress](https://v2.vuepress.vuejs.org/),
and its configuration fully adheres to VuePress's configuration specifications.

**VuePress provides three configuration types:**

* **Site Configuration**: The object directly exported from the configuration file (e.g., `.vuepress/config.ts`)
* **Theme Configuration**: The parameter object passed to the `plumeTheme()` function
* **Page Configuration**: Defined in the page Frontmatter using YAML syntax

## VuePress Configuration File

The base configuration file for VuePress is typically `.vuepress/config.js`,
while TypeScript configuration files are also supported.
Using `.vuepress/config.ts` provides more comprehensive type hints.

VuePress resolves configuration files in the following priority order:

**In the current working directory (cwd):**

* `vuepress.config.ts`
* `vuepress.config.js`
* `vuepress.config.mjs`

**In the source directory (sourceDir):**

* `.vuepress/config.ts`&#x20;
* `.vuepress/config.js`
* `.vuepress/config.mjs`

**Basic Configuration Example:**

```ts title=".vuepress/config.ts" twoslash
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  // [!code hl:5]
  // VuePress Base Configuration
  lang: 'zh-CN',
  title: 'Hello, VuePress!',
  description: 'This is my first VuePress site',
  // ...

  // Use Vite as the bundler
  bundler: viteBundler(),

  // Enable the Plume theme
  theme: plumeTheme({ // [!code ++:4]
    // Theme configuration options
    // ...
  }),
})
```

## Theme Configuration File

Typically, we configure the theme in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // Theme configuration
  }),
  // ...
})
```

However, modifying this file causes the VuePress service to restart and perform a full refresh.
For small sites, this process is quick; but for sites with substantial content, each restart requires considerable time.

Frequent configuration file modifications can also easily lead to VuePress ==service crashes=={.caution}
::twemoji:angry-face::, requiring manual service restarts and severely impacting content writing efficiency.

**Solution: Theme Hot-Reload Configuration:**

The theme provides a `plume.config.ts` configuration file. ==Modifications to this file support hot-reload
and do not require restarting the service=={.tip} ::twemoji:confetti-ball::.

You can configure hot-reload supported fields within it, such as `navbar`, `profile`, etc.

::: tip
These fields can still be configured within the `theme` section of the VuePress configuration file,
but the settings from the theme configuration file will ultimately be merged into the main configuration.

To avoid data duplication, please do not configure the same field in both locations.
:::

::: details What is Hot-Reload?

**Hot-Reload** is a development technique that, in the context of VuePress, manifests as:

* Configuration changes take effect immediately without restarting the service; the browser does not refresh the page
* Page modifications take effect immediately; the browser updates content without a full refresh

:::

### Configuration Method

Create the `plume.config.ts` file in the same directory as the VuePress configuration file:

::: file-tree

* docs
  * .vuepress
    * config.ts
    * **plume.config.ts**
      :::

```ts title="plume.config.ts" twoslash
// @filename: ./navbar.ts
export default []
// ---cut---
import { defineThemeConfig } from 'vuepress-theme-plume'
import navbar from './navbar'

export default defineThemeConfig({
  // Theme configuration
  profile: {
    name: 'Your name',
  },
  navbar,
})
```

The `defineThemeConfig(config)` function provides full type hints. Except for `plugins`, most configurations can be defined in this file.

::: warning Notes

* The theme configuration file only supports hot-reload for specific fields.
* Avoid reconfiguring fields in the VuePress configuration file that have already been set in the theme configuration file.
  :::

### Custom Configuration File Path

If a non-default path is required, it can be specified in the VuePress configuration:

```ts title=".vuepress/config.ts" twoslash
import path from 'node:path'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // Custom configuration file path
    configFile: path.join(__dirname, 'custom/config.ts'), // [!code ++]
  }),
})
```

::: warning Not recommended for beginners; custom paths might cause unexpected issues.
:::

## Page Configuration

Using the YAML Frontmatter at the top of the page, the theme can be configured individually for each page:

```md {1,5} title="article.md"
---
title: Article Title
createTime: 2024/09/08 22:53:34
permalink: /article/xxx/
---
```

The section wrapped by the `---` delimiters at the top of a Markdown file is the Frontmatter, which uses YAML syntax for configuration.

:::tip For an introduction to basic YAML syntax, please refer to [this blog post](/article/ecxnxxd0/)
:::
