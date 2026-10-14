---
url: /en/config/markdown/index.md
---
## Overview

Markdown configuration is used to control the behavior of Markdown.
This configuration aggregates various feature configurations provided by the theme for Markdown enhancements.

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // [!code ++:3]
    markdown: {
      // Configure markdown here
    },
  }),
})
```

::: warning
Do not confuse this with VuePress's [markdown](https://v2.vuepress.vuejs.org/reference/config.html#markdown) configuration.

These two are independent. Do not configure the theme's markdown settings
within [VuePress > markdown](https://v2.vuepress.vuejs.org/reference/config.html#markdown), and vice versa.
:::

**Default Configuration:**

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // [!code focus:11]
    markdown: {
      hint: true,
      alert: true,
      fileTree: true,
      plot: true,
      icon: { provider: 'iconify' },
      math: { type: 'katex' },
      include: {
        // ...option
      },
    },
  }),
})
```

## Configuration Options

As long as `plugins.markdownPower: false` is not explicitly set, the theme injects three features by
default: `plot`, `fileTree`, and icon support. Therefore, hidden text, file trees, and the `::name::`
icon syntax are **enabled by default** and require no extra configuration.

All other features are disabled by default and must be enabled as needed.

The following fields are grouped by the plugin that implements them.

### Implemented by `@vuepress/plugin-markdown-hint`

#### hint

* **Type:** `boolean`
* **Default:** `true`
* **Details:** Whether to enable hint containers.

#### alert

* **Type:** `boolean`
* **Default:** `true`
* **Details:** Whether to enable GitHub-style alert syntax.
  The theme enables [obsidian compatibility](#obsidian) by default, and this syntax is rendered by the obsidian callout.
  Only when `markdown.obsidian` is explicitly set to `false` is it rendered by markdown-hint instead.

### Implemented by `@vuepress/plugin-markdown-image`

#### image

* **Type:** `false | MarkdownImagePluginOptions`
* **Default:** `false`
* **Details:** Whether to enable image enhancement syntax.

### Implemented by `@vuepress/plugin-markdown-math`

#### math

* **Type:** `false | MarkdownMathPluginOptions`
* **Default:** `{ type: 'katex' }`
* **Details:** Whether to enable math support.

### Implemented by `@vuepress/plugin-markdown-include`

#### include

* **Type:** `false | MarkdownIncludePluginOptions`
* **Default:** `true`
* **Details:** Whether to enable Markdown file inclusion.

### Implemented by `vuepress-plugin-md-power`

See the [markdown-power plugin](./plugins/markdown-power.md) for the complete description of the fields in this group.

#### env

* **Type:** `MarkdownEnvPreset`
* **Default:** `undefined`
* **Details:** Presets the markdown environment, such as preset link references, abbreviations, and content annotations. Presets can be used directly in any markdown file.

#### annotation

* **Type:** `boolean | MarkdownEnvPreset['annotations']`
* **Default:** `false`
* **Details:** Whether to enable content annotations, or directly preset content annotations.

#### abbr

* **Type:** `boolean | MarkdownEnvPreset['abbreviations']`
* **Default:** `false`
* **Details:** Whether to enable abbreviation syntax, or directly preset abbreviations.

#### mark

* **Type:** `MarkOptions`
* **Default:** `'eager'`
* **Details:** Sets the animation playback mode for `==mark==`.

#### encrypt

* **Type:** `boolean | EncryptSnippetOptions`
* **Default:** `false`
* **Details:** Whether to enable the content snippet encryption container.

#### codeTabs

* **Type:** `CodeTabsOptions` (`{ icon?: boolean }`)
* **Default:** `{ icon: true }`
* **Details:** Icon configuration for the code block grouping container. The `::: code-tabs` container is **enabled by default**; this option only controls whether language icons are shown.

> The `::: tabs` container is also **available by default** and has no config field at all, so there is nothing to set.

#### codeTree

* **Type:** `boolean | CodeTreeOptions`
* **Default:** `false`
* **Details:** Whether to enable code tree container syntax and embed syntax.

#### npmTo

* **Type:** `boolean | NpmToOptions`
* **Default:** `false`
* **Details:** Whether to enable the `npm-to` container.

#### icon

* **Type:** `IconOptions`
* **Default:** `{ provider: 'iconify' }`
* **Details:** Icon rendering configuration (provider, prefix, size, color, assets, etc.). The `::name::` icon syntax is **available by default**; this option customizes the rendering behavior.

  [View **icon** usage instructions](../guide/features/icon.md){.read-more}

#### plot

* **Type:** `boolean | PlotOptions`
* **Default:** `true`
* **Details:** Whether to enable hidden text syntax.

#### fileTree

* **Type:** `boolean | FileTreeOptions`
* **Default:** `true`
* **Details:** Whether to enable file tree container syntax.

#### field

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable field containers, i.e. [`field-group`](../guide/markdown/v-field.md) and the `field` container.

#### table

* **Type:** `boolean | TableContainerOptions`
* **Default:** `false`
* **Details:** Whether to enable enhanced table containers.

#### timeline

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable timeline container syntax.

#### collapse

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable collapsible panel container syntax.

#### chat

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable chat record containers.

#### demo

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Demo containers.

#### pdf

* **Type:** `boolean | PDFOptions`
* **Default:** `false`
* **Details:** Whether to enable PDF embedding syntax.

#### acfun

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable AcFun video embedding syntax.

#### bilibili

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Bilibili video embedding syntax.

#### youtube

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable YouTube video embedding syntax.

#### artPlayer

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable ArtPlayer video embedding syntax.

#### audioReader

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Audio Reader audio embedding syntax.

#### codepen

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable CodePen embedding syntax.

#### codeSandbox

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable CodeSandbox embedding syntax.

#### jsfiddle

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable JS Fiddle embedding syntax.

#### replit&#x20;

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Repl.it embedding syntax. Use `repl` instead.

#### repl

* **Type:** `false | ReplOptions`
* **Default:** `false`
* **Details:** Whether to enable Repl container syntax.

#### caniuse

* **Type:** `boolean | CanIUseOptions`
* **Default:** `false`
* **Details:** Whether to enable Can I Use embedding syntax.

#### qrcode

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable QR code embedding syntax.

#### obsidian

* **Type:** `boolean | ObsidianOptions`
* **Default:** Enabled by default in the theme (enabled unless explicitly set to `false`)
* **Details:** Whether to enable compatibility support for obsidian's official markdown extension syntax, including wiki links, embeds, callouts, and comments.

#### locales

* **Type:** `LocaleConfig<MDPowerLocaleData>`
* **Default:** `undefined`
* **Details:** Multi-language text configuration for the markdown-power plugin.

#### imageSize

* **Type:** `boolean | 'local' | 'all'`
* **Default:** `false`
* **Details:** Whether to enable automatic filling of image width and height attributes. This feature only takes effect when building the production bundle.

### Implemented by `@vuepress/plugin-markdown-chart`

#### chartjs

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Chart.js chart embedding syntax.

#### echarts

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable ECharts chart embedding syntax.

#### mermaid

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Mermaid diagram embedding syntax.

#### markmap

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Markmap diagram embedding syntax.

#### plantuml

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable PlantUML diagram embedding syntax.

#### flowchart

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Flowchart diagram embedding syntax.

#### DANGEROUS_ALLOW_SCRIPT_EXECUTION

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to allow chart scripts to execute. When enabled, scripts in chart content will run,
  which may introduce XSS or remote code execution risks. Only enable it when the content source is fully trusted.

#### DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST

* **Type:** `string[] | '*'`
* **Default:** `undefined`
* **Details:** Allowlist of source files permitted to run chart scripts. Only effective when
  `DANGEROUS_ALLOW_SCRIPT_EXECUTION` is `true`; pass `'*'` to allow all source files.
