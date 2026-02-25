---
url: /en/guide/project-structure/index.md
---
This guide provides a detailed explanation of the file structure for projects
created using VuePress and the Plume theme, helping you better organize and manage project files.

For projects created via the [command-line tool](./usage.md#command-line-installation), the typical file structure is as follows:

::: file-tree

* .git/
* **docs** # Documentation source directory
  * .vuepress  # VuePress configuration directory
    * public/ # Static assets
    * client.ts # Client configuration (optional)
    * collections.ts # Collections configuration (optional)
    * config.ts # VuePress main configuration
    * navbar.ts # Navbar configuration (optional)
    * plume.config.ts # Theme configuration file (optional)
  * demo # `doc` type collection
    * foo.md
    * bar.md
  * blog # `post` type collection
    * preview # Blog category
      * markdown.md # Category article
    * article.md # Blog article
  * README.md # Site homepage
  * …
* package.json
* pnpm-lock.yaml
* .gitignore
* README.md
  :::

::: tip Manually created projects can also be organized using this structure as a reference
:::

## Documentation Source Directory

The **Documentation Source Directory** contains all the Markdown source files for your site.
This directory must be specified when starting VuePress via the command line:

```sh
# [!code word:docs]
vuepress dev docs
#            ↑ Documentation source directory
```

Corresponding package.json script configuration:

```json title="package.json"
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

VuePress only processes files within the documentation source directory; other directories are ignored.

## `.vuepress` Configuration Directory

`.vuepress/` is the core configuration directory for VuePress, where you can configure your project, create custom components, and styles.

### `client.ts` - Client Configuration

Used to extend VuePress client functionality, such as registering global components:

```ts title=".vuepress/client.ts"
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // app: Vue application instance
    // router: Vue Router instance
    // siteData: Site metadata

    // Register global components
    app.component('MyComponent', MyComponent)
  },
  setup() {
    // setup method of the Vue root component
  }
})
```

### `config.ts` - Main Configuration File

The core configuration file for VuePress, used to set up the theme, plugins, and build tool:

```ts title=".vuepress/config.ts" twoslash
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  theme: plumeTheme({
    // Theme configuration...
  }),
  bundler: viteBundler(),
})
```

### `plume.config.ts` - Theme Configuration

A dedicated configuration file for the theme that supports hot-reload; service restart is not required after modifications:

::: code-tabs
@tab .vuepress/plume.config.ts

```ts twoslash
// @filename: ./navbar.ts
export default []

// @filename: ./collections.ts
export default []
// ---cut---
import { defineThemeConfig } from 'vuepress-theme-plume'
import collections from './collections'
import navbar from './navbar'

export default defineThemeConfig({
  logo: '/logo.svg',
  profile: {
    name: 'Theme Plume',
  },
  navbar,
  collections,
  // More configuration...
})
```

@tab .vuepress/navbar.ts

```ts twoslash
import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  // Navbar item configuration...
])
```

@tab .vuepress/collections.ts

```ts twoslash
import { defineCollections } from 'vuepress-theme-plume'

export default defineCollections([
  {
    type: 'post',
    dir: 'blog',
    title: 'Blog',
    link: '/blog/'
  },
  {
    type: 'doc',
    dir: 'demo',
    linkPrefix: '/demo/',
    title: 'Documentation Examples',
    sidebar: 'auto'
  },
])
```

:::
