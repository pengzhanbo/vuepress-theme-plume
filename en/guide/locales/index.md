---
url: /en/guide/locales/index.md
---
This guide will help you quickly configure multi-language support for your VuePress theme.
With simple directory structure and configuration adjustments, you can achieve a professional internationalized site.

## Directory Structure Planning

First, create a directory structure that meets multi-language requirements.
The following example shows a project layout supporting Chinese, English, and French:

::: file-tree

* docs
  * **en**        # English documentation directory
    * foo.md
    * README.md   # English homepage
  * **fr**        # French documentation directory
    * foo.md
    * README.md   # French homepage
  * foo.md
  * README.md     # Chinese homepage
    :::

**Directory Structure Explanation**:

* `docs/en/` - Stores English version documents
* `docs/fr/` - Stores French version documents
* `docs/` - Stores default language (Chinese) documents

::: Important Maintain File Structure Consistency
Maintain identical file names and directory structures across different language directories.
This ensures the theme can correctly navigate to the corresponding language version of documents during language switching.
:::

## VuePress Basic Configuration

### Setting Default Language

Declare the default language in the configuration file `.vuepress/config.ts`:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  // Set default language code
  lang: 'zh-CN', // [!code ++]
  // Configure multi-language support
  locales: {
    '/': { lang: 'zh-CN', title: 'Blog' }, // Simplified Chinese as default language
  }
})
```

### Adding Other Language Support

Extend the `locales` configuration to support more languages:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  locales: {
    '/': { lang: 'zh-CN', title: 'Blog' }, // Simplified Chinese
    '/en/': { lang: 'en-US', title: 'Blog' }, // American English // [!code ++]
    '/fr/': { lang: 'fr-FR', title: 'Le blog' }, // French // [!code ++]
  }
})
```

**Configuration Key Points**:

* The keys in `locales` (such as `/en/`) correspond to language folder names in the documentation directory
* These keys also serve as access path prefixes for each language's pages
* Each language must have the correct `lang` attribute set, even if only using a single language

::: Tip Language Code Standards

* **Path Keys**: Follow [ISO 639](https://en.wikipedia.org/wiki/ISO_639-1) standard (e.g., use `/en/` for English)
* **Language Codes**: Use [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) standard format (e.g., use `en-US` for English)
  :::

## Theme Multi-language Configuration

Customize interface elements for each language through the `locales` field in theme configuration:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN', // [!code focus:6]
  locales: {
    '/': { lang: 'zh-CN', title: 'Blog' },
    '/en/': { lang: 'en-US', title: 'Blog' },
    '/fr/': { lang: 'fr-FR', title: 'Le blog' },
  },
  theme: plumeTheme({
    // Theme-level multi-language configuration
    locales: { // [!code focus:20]
      // Simplified Chinese configuration
      '/': {
        selectLanguageName: '简体中文',
        navbar: [
          { text: '首页', link: '/' },
          { text: '博客', link: '/blog/' },
        ]
      },
      // English configuration
      '/en/': {
        selectLanguageName: 'English',
        navbar: [
          { text: 'Home', link: '/en/' },
          { text: 'Blog', link: '/en/blog/' },
        ]
      },
      // French configuration
      '/fr/': { // [!code focus:7]
        selectLanguageName: 'Français',
        navbar: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Le Blog', link: '/fr/blog/' },
        ]
      }
    }
  })
})
```

**Key Configuration Items**:

* `selectLanguageName`: Language name displayed in the language selector
* `navbar`: Navigation bar configuration unique to each language
* All theme configuration items support overriding by language in `locales`

## Configuration Consistency Requirements

Ensure path keys in VuePress configuration exactly match those in theme configuration:

```ts
export default {
// VuePress configuration
  locales: {
    '/': { /* Chinese configuration */ },
    '/en/': { /* English configuration */ },
  },

  // Theme configuration
  theme: plumeTheme({
    locales: {
      '/': { /* Chinese theme configuration */ },
      '/en/': { /* English theme configuration */ }
    }
  })
}
```

## Further Reading

* [Theme Locales Configuration](../../config/theme.md#locale-configuration) - Learn about language-specific theme behavior configurations
* [Multi-language Text Configuration](../../config/locales.md) - Master internationalization customization methods for interface text

With the above configurations, your documentation site will have complete multi-language support capabilities,
providing users with a more friendly internationalized access experience.
