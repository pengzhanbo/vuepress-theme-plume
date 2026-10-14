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
      abbr: true, // Enable abbreviations, making env.abbreviations effective
      annotation: true, // Enable annotations, making env.annotations effective
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

::: important Abbreviations and Annotations require additional enabling
`env.references` is always effective. However, `env.abbreviations` and `env.annotations` require the `abbr` and `annotation` options to be enabled respectively before they take effect.
:::

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

## Preset Examples

### Preset Reference Links

Reference links support two definition formats: string format and object format. The object format allows setting an additional `title` property.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      env: {
        references: {
          // String format: directly specify the link URL
          vue: 'https://vuejs.org/',
          // Object format: can specify both the link URL and title
          vuepress: {
            href: 'https://v2.vuepress.vuejs.org/',
            title: 'VuePress Official Website'
          }
        }
      }
    }
  })
})
```

Use in any markdown file:

```md
[Vue][vue] is a progressive framework.

[VuePress][vuepress] is a static site generator.
```

### Preset Abbreviations

Abbreviation presets allow you to uniformly define full names for technical terms in your project, displaying complete explanations on mouse hover.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      abbr: true,
      env: {
        abbreviations: {
          HTML: 'HyperText Markup Language',
          CSS: 'Cascading Style Sheets',
          W3C: 'World Wide Web Consortium',
          API: 'Application Programming Interface'
        }
      }
    }
  })
})
```

Use abbreviations directly in any markdown file without additional declaration:

```md
HTML and CSS are fundamental web technologies, with standards maintained by W3C.
APIs provide access to the capabilities offered by these technologies.
```

### Preset Annotations

Annotations support both string format and string array format. When using the array format, the same tag corresponds to multiple annotations, rendered as a list.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      annotation: true,
      env: {
        annotations: {
          // String format: single annotation
          vuepress: 'VuePress is a [Static Site Generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG).It is specifically designed for building fast, content-centric sites.',
          // Array format: multiple annotations, rendered as a list
          classics: [
            '**"Romance of the Three Kingdoms":**\nSet against the backdrop of the Three Kingdoms period, depicting the political and military struggles among Wei, Shu, and Wu.',
            '**"Journey to the West":**\nTells the story of Tang Monk and his disciples journeying to the West to obtain Buddhist scriptures, filled with mythological elements and fantastical adventures.'
          ]
        }
      }
    }
  })
})
```

Use the `[+label]` syntax in any markdown file to reference annotations:

```md
The site is powered by VuePress [+vuepress].

The Four Great Classical Novels of China [+classics] are well-known.
```

## Loading Mechanism and Priority

### Loading Method

Environment presets are configured through the `markdown.env` option in `.vuepress/config.ts`. When the theme initializes the Markdown renderer, it injects the preset values into the rendering environment of each Markdown file, making them globally available across all Markdown files.

* **Reference links** (`references`): Injected into the rendering environment during Markdown rendering, always effective.
* **Abbreviations** (`abbreviations`): Passed as global abbreviations to the abbreviation plugin, requires the `abbr` option to be enabled.
* **Annotations** (`annotations`): Passed as global annotations to the annotation plugin, requires the `annotation` option to be enabled.

### Priority

When the same tag is defined in both preset configuration and Markdown files, the following priority rules apply (from high to low):

* **Reference links**: Definition in Markdown file > `env.references` preset
* **Abbreviations**: Definition in Markdown file > `markdown.abbr` configuration > `env.abbreviations` preset
* **Annotations**: Definition in Markdown file > `markdown.annotation` configuration > `env.annotations` preset

This means that a tag with the same name defined in an individual Markdown file will override the global preset, making it convenient to customize specific pages.

### Effect After Modifying Presets

Environment presets are part of the VuePress configuration. After modifying the `markdown.env` configuration in `.vuepress/config.ts`, VuePress will automatically restart the development server for the changes to take effect. Modifying definitions in Markdown files does not require a restart and will be hot-reloaded immediately.

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
