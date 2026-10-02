---
url: /en/guide/seo/index.md
---
## Usage

The theme provides out-of-the-box configuration to enable SEO optimization features for your site.
To enable it, configure the following:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'http://your_site_url',
  })
})
```

For custom SEO optimization, you can configure it through `plugins.seo`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      seo: {
        // ... SEO configuration
      }
    }
  })
})
```

For complete configuration options, please refer to the [documentation](https://ecosystem.vuejs.press/en/plugins/seo/seo/config.html).

::: note
This example is forked from [@vuepress/plugin-seo](https://ecosystem.vuejs.press/en/plugins/seo/seo/),
licensed under [MIT](https://github.com/vuepress/ecosystem/blob/main/LICENSE).
:::

## Guide

The theme enhances your site's search engine optimization by injecting tags into the website's `<head>` section,
making it fully compliant with the [Open Graph Protocol (OGP)](https://ogp.me/)
and [JSON-LD 1.1](https://www.w3.org/TR/json-ld-api/).

By default, the plugin reads site configuration, theme configuration, and page frontmatter to automatically generate
metadata. Elements such as site name, page title, page type, writing date, last update date, and article tags are automatically generated.

## Default OGP Generation Logic

| Property Name | Value |
| :------------ | :---- |
| `og:url` | `options.hostname` + `path` |
| `og:site_name` | `siteConfig.title` |
| `og:title` | `page.title` |
| `og:description` | `page.frontmatter.description` || auto-generated (when `autoDescription` is `true` in plugin options) |
| `og:type` | `"article"` |
| `og:image` | `options.hostname` + `page.frontmatter.image` || first image in page || `fallbackImage` from plugin options |
| `og:updated_time` | `page.git.updatedTime` |
| `og:locale` | `page.lang` |
| `og:locale:alternate` | Other languages included in `siteData.locales` |
| `twitter:card` | `"summary_large_image"` (only when image is found) |
| `twitter:image:alt` | `page.title` (only when image is found) |
| `article:author` | `page.frontmatter.author` || `options.author` |
| `article:tag` | `page.frontmatter.tags` || `page.frontmatter.tag` |
| `article:published_time` | `page.frontmatter.date` || `page.git.createdTime` |
| `article:modified_time` | `page.git.updatedTime` |

## Default JSON-LD Generation Logic

| Property Name | Value |
| :------------ | :---- |
| `@context` | `"https://schema.org"` |
| `@type` | `"NewsArticle"` |
| `headline` | `page.title` |
| `image` | Images in page || `options.hostname` + `page.frontmatter.image` |
| `datePublished` | `page.frontmatter.date` || `page.git.createdTime` |
| `dateModified` | `page.git.updatedTime` |
| `author` | `page.frontmatter.author` || `options.author` |

## SEO Introduction

Search Engine Optimization (SEO) is a method of adjusting websites by understanding search engine operation rules
to improve a target website's ranking in search engines. Since many studies have found that search engine users
often only pay attention to the top few entries in search results, many websites hope to influence search engine
rankings through various methods to achieve excellent search rankings for their sites.

The so-called "optimization for search engines" refers to making websites more easily accepted by search engines.
Search engines compare the content between websites for relevance, and then browsers present this content to searchers
in the fastest and most complete way possible. Search engine optimization follows search engine rules to create better
user experiences, with the ultimate goal of providing excellent user experience.

## Related Documentation

* [Open Graph Protocol (OGP)](https://ogp.me/)

  This plugin fully supports this protocol and automatically generates compliant `<meta>` tags.

* [JSON-LD 1.1](https://www.w3.org/TR/json-ld-api/)

  This plugin generates NewsArticle type tags for article pages.

* [RDFa 1.1](https://www.w3.org/TR/rdfa-primer/)

  RDFa primarily marks up HTML structure.

* [Schema.Org](https://schema.org/)

  Schema definitions for structured markup sites.
