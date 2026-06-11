---
url: /en/config/plugins/llmstxt/index.md
---
## Overview

Add [llms.txt](https://llmstxt.org/) to your site to provide LLM-friendly content.

**Related Plugin**: [@vuepress/plugin-llms](https://ecosystem.vuejs.press/plugins/ai/llms.html)

## Why llms.txt?

Large Language Models increasingly rely on website information but face a key limitation:
their context window is too small to fully process most websites.
Converting complex HTML pages containing navigation, ads, and JavaScript into LLM-friendly plain text is both difficult and imprecise.

While websites serve both human readers and LLMs, the latter benefit from more concise,
expert-level information collected in one accessible location.
This is particularly important for use cases like development environments where LLMs need quick access to programming documentation and APIs.

Add a `/llms.txt` Markdown file to your website to provide LLM-friendly content.
This file provides brief background information, guidelines, and links to detailed Markdown files.

## Features

The plugin retrieves all Markdown files from your documentation source directory and converts them into LLM-friendly plain text files.

::: file-tree

* .vuepress/dist
  * llms.txt
  * llms-full.txt
  * markdown-examples.html
  * markdown-examples.md
  * …
    :::

Click the links below to view the llms.txt files for this documentation site:

* [llms.txt](/llms.txt){.no-icon}
* [llms-full.txt](/llms-full.txt){.no-icon}

::: tip
The plugin only generates `llms.txt` files and other LLM-friendly documentation files during
production builds, i.e., when executing the `vuepress build` command, and outputs them to the `.vuepress/dist` directory.

:::

[View the complete feature description in the **Plugin Official Documentation**](https://ecosystem.vuejs.press/plugins/ai/llms.html#%E6%8F%92%E4%BB%B6%E5%8A%9F%E8%83%BD){.read-more}

## Configuration

This feature is not enabled by default in the theme. You can enable it through the `llmstxt` configuration option:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // Use the theme's built-in default configuration
    // llmstxt: true,

    // Use custom configuration
    llmstxt: {
      locale: '/',
      // ...other configurations
    },

    // Can also configure via `plugins.llmstxt`, but not recommended
    plugins: {
      llmstxt: true
    }
  }),
})
```

[View the complete configuration options in the **Plugin Official Documentation**](https://ecosystem.vuejs.press/plugins/ai/llms.html#options){.read-more}

## Components

To further enhance interaction between your documentation site and LLMs,
you can add the `<PageContextMenu />` component to your documentation site.

This component is not built-in but is implemented as an additional feature of the theme.
Therefore, you need to manually import it and place it in an appropriate location through [component slots](../../guide/custom/slots.md):

```ts title=".vuepress/client.ts"
import { defineAsyncComponent, h } from 'vue'
import { Layout } from 'vuepress-theme-plume/client'
import PageContextMenu from 'vuepress-theme-plume/features/PageContextMenu.vue' // [!code ++]
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  layouts: {
    Layout: h(Layout, null, {
      // Add PageContextMenu to the doc-title-after slot, i.e., to the right of the article title
      'doc-title-after': () => h(PageContextMenu), // [!code ++]
    }),
  },
})
```

You can experience this component's functionality to the right of the current page's title.

::: important
This component relies entirely on the `@vuepress/plugin-llms` plugin and can only be used when you have enabled this plugin's functionality.

Therefore, the functionality provided by this component **is only available in the built production package**.
:::
