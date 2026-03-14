---
url: /en/guide/markdown/env/index.md
---
## Overview

Environment presets (`markdown.env`) can be used to configure preset values for the Markdown rendering environment,

such as reference links, content annotations, abbreviations, etc., thereby avoiding repetitive definitions in each Markdown file.

**Environment presets can take effect in any Markdown file.**

## Configuration

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      env: {
        // reference
        references: {
          vuepress: 'https://v2.vuepress.vuejs.org/'
        },
        // abbreviation
        abbreviations: {
          HTML: 'Hypertext Markup Language'
        },
        // annotation
        annotations: {
          vuepress: 'VuePress is a [Static Site Generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG).It is specifically designed for building fast, content-centric sites.'
        }
      }
    }
  })
})
```

The above configuration is equivalent to including the following in any markdown file:

```md
[vuepress]: https://v2.vuepress.vuejs.org/

*[HTML]: Hypertext Markup Language

[+vuepress]: VuePress is a [Static Site Generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG).It is specifically designed for building fast, content-centric sites.
```

Therefore, these environment presets can be used in any markdown file:

```md
Link reference: [vuepress][vuepress]

Abbreviation: HTML

Content note: vuepress [+vuepress]
```

Link reference: [vuepress][vuepress]

Abbreviation: HTML

Content note: vuepress \[+vuepress]

[vuepress]: https://v2.vuepress.vuejs.org/

\*\[HTML]: Hypertext Markup Language

\[+vuepress]:
VuePress is a [Static Site Generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG).
It is specifically designed for building fast, content-centric sites.

## Interface

```ts
interface MarkdownEnvPreset {
  /**
   * Reference links
   */
  references?: {
    [label: string]: string | { title?: string, href: string }
  }
  /**
   * Abbreviation
   */
  abbreviations?: {
    [label: string]: string
  }
  /**
   * Annotation
   */
  annotations?: {
    [label: string]: string | string[]
  }
}
```
