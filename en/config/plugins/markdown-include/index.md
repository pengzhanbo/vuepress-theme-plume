---
url: /en/config/plugins/markdown-include/index.md
---
## Overview

Import content from other markdown files within Markdown files.

Related plugin: [@vuepress/plugin-markdown-include](https://ecosystem.vuejs.press/plugins/markdown/markdown-include.html)

## Configuration

The theme enables `markdownInclude` by default. You can further customize its behavior through configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      include: {
        // ... options
      }
    },
    // Can also be configured in `plugins.markdownInclude`, but not recommended
    plugins: {
      markdownInclude: {},
    }
  })
})
```

### resolvePath

* Type: `(path: string, cwd: string | null) => string`
* Default: `(path) => path`
* Details: Processes the include file path.

### deep

* Type: `boolean`
* Details: Whether to enable deep include support.

### useComment

* Type: `boolean`
* Default: `true`
* Details: Whether to use `<!-- @include: xxx -->` instead of `@include: xxx` for file inclusion.

### resolveImagePath

* Type: `boolean`
* Default: `true`
* Details: Whether to resolve relative image paths within the included Markdown files.

### resolveLinkPath

* Type: `boolean`
* Default: `true`
* Details: Whether to resolve relative file paths within the included Markdown files.
