---
url: /en/guide/features/content-search/index.md
---
The theme provides two approaches for content search:

* Local Content Search
* Algolia DocSearch

Note: Do not configure both approaches simultaneously. When both are configured, only Local Content Search will take effect.

## Local Content Search

Local Content Search is powered by the
[@vuepress-plume/plugin-search](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-search) plugin.

This plugin uses [minisearch](https://github.com/lucaong/minisearch) for content searching.

### Enabling

The theme enables Local Content Search by default. You can also customize its configuration.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    search: { // [!code ++:4]
      provider: 'local',
      // more options
    }
  })
})
```

This plugin generates search indexes locally based on your pages, then loads the search index files when users visit your site.
In other words, this is a lightweight built-in search capability that doesn't make any external requests.

However, when your site contains a large number of pages, the search index file can become very large and may slow down your page loading speed.
In such cases, we recommend using a more robust solution - [Algolia DocSearch](#algolia-docsearch).

## Algolia DocSearch

Site content search powered by [Algolia DocSearch](https://docsearch.algolia.com/).

### Enabling

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    search: { // [!code ++:4]
      provider: 'algolia',
      // more options
    }
  })
})
```

### Obtaining Search Index

You need to [submit your website URL](https://docsearch.algolia.com/apply/) to join the DocSearch program.
When your index is successfully created, the DocSearch team will send `apiKey` and `indexName` to your email.
You can then configure the plugin to enable DocSearch in VuePress.

Alternatively, you can [run your own crawler](https://docsearch.algolia.com/docs/run-your-own/) to create the index,
then use your own `appId`, `apiKey`, and `indexName` to configure the plugin.

Here's a crawler configuration example used by this theme. You can visit [Algolia Crawler](https://crawler.algolia.com/admin/crawlers/)
and modify it according to your needs:

```ts
new Crawler({
  appId: 'YOUR_APP_ID', // [!code highlight]
  apiKey: 'YOUR_API_KEY', // [!code highlight]
  rateLimit: 8,
  startUrls: [
    // These are the initial URLs where Algolia starts crawling your site
    // If your site is divided into several independent sections, you may need to set multiple entry links here
    'https://YOUR_WEBSITE_URL/', // [!code highlight]
  ],
  renderJavaScript: false,
  sitemaps: [
    // The theme generates sitemap by default; replace with your domain link here
    'https://YOUR_WEBSITE_URL/sitemap.xml', // [!code highlight]
  ],
  ignoreCanonicalTo: true,
  discoveryPatterns: [
    // This defines the scope of URLs that Algolia will crawl
    'https://YOUR_WEBSITE_URL/**', // [!code highlight]
  ],
  // Crawler execution schedule; set according to your documentation update frequency
  schedule: 'at 02:00 every 1 day',
  actions: [
    // You can have multiple actions, especially when deploying multiple documentations under one domain
    {
      // Name your index appropriately
      indexName: 'YOUR_INDEX_NAME', // [!code highlight]
      // Paths where the index takes effect
      pathsToMatch: ['https://YOUR_WEBSITE_URL/**'], // [!code highlight]
      recordExtractor: ({ helpers }) => {
        // Options for vuepress-theme-plume
        return helpers.docsearch({
          recordProps: { // [!code highlight]
            lvl1: '.plume-content h1', // [!code highlight]
            content: '.plume-content p, .plume-content li', // [!code highlight]
            lvl0: { // [!code highlight]
              selectors: [ // [!code highlight]
                '.sidebar-item.is-active p', // [!code highlight]
                '.content-container .page-title', // [!code highlight]
              ], // [!code highlight]
              defaultValue: 'Documentation', // [!code highlight]
            }, // [!code highlight]
            lvl2: '.plume-content h2', // [!code highlight]
            lvl3: '.plume-content h3', // [!code highlight]
            lvl4: '.plume-content h4', // [!code highlight]
            lvl5: '.plume-content h5', // [!code highlight]
          }, // [!code highlight]
          indexHeadings: true, // [!code highlight]
          aggregateContent: true, // [!code highlight]
          recordVersion: 'v3', // [!code highlight]
        })
      },
    },
  ],
  initialIndexSettings: {
    // Controls how the index is initialized; only effective when the index hasn't been generated yet
    // You may need to manually delete and regenerate the index after modifications
    YOUR_INDEX_NAME: { // [!code highlight]
      attributesForFaceting: ['type', 'lang'], // [!code highlight]
      attributesToRetrieve: [
        'hierarchy',
        'content',
        'anchor',
        'url',
        'url_without_anchor',
        'type',
      ],
      attributesToHighlight: ['hierarchy', 'hierarchy_camel', 'content'],
      attributesToSnippet: ['content:10'],
      camelCaseAttributes: ['hierarchy', 'hierarchy_radio', 'content'],
      searchableAttributes: [
        'unordered(hierarchy_radio_camel.lvl0)',
        'unordered(hierarchy_radio.lvl0)',
        'unordered(hierarchy_radio_camel.lvl1)',
        'unordered(hierarchy_radio.lvl1)',
        'unordered(hierarchy_radio_camel.lvl2)',
        'unordered(hierarchy_radio.lvl2)',
        'unordered(hierarchy_radio_camel.lvl3)',
        'unordered(hierarchy_radio.lvl3)',
        'unordered(hierarchy_radio_camel.lvl4)',
        'unordered(hierarchy_radio.lvl4)',
        'unordered(hierarchy_radio_camel.lvl5)',
        'unordered(hierarchy_radio.lvl5)',
        'unordered(hierarchy_radio_camel.lvl6)',
        'unordered(hierarchy_radio.lvl6)',
        'unordered(hierarchy_camel.lvl0)',
        'unordered(hierarchy.lvl0)',
        'unordered(hierarchy_camel.lvl1)',
        'unordered(hierarchy.lvl1)',
        'unordered(hierarchy_camel.lvl2)',
        'unordered(hierarchy.lvl2)',
        'unordered(hierarchy_camel.lvl3)',
        'unordered(hierarchy.lvl3)',
        'unordered(hierarchy_camel.lvl4)',
        'unordered(hierarchy.lvl4)',
        'unordered(hierarchy_camel.lvl5)',
        'unordered(hierarchy.lvl5)',
        'unordered(hierarchy_camel.lvl6)',
        'unordered(hierarchy.lvl6)',
        'content',
      ],
      distinct: true,
      attributeForDistinct: 'url',
      customRanking: [
        'desc(weight.pageRank)',
        'desc(weight.level)',
        'asc(weight.position)',
      ],
      ranking: [
        'words',
        'filters',
        'typo',
        'attribute',
        'proximity',
        'exact',
        'custom',
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
      highlightPostTag: '</span>',
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: 'allOptional',
    },
  },
})
```

The `recordProps` section contains configuration options used by this theme for index crawling.

### Configuration Options

For complete configuration, please refer to the [documentation](https://ecosystem.vuejs.press/en/plugins/search/docsearch.html).

### Configuration Example

Here's the configuration used by this theme:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    search: { // [!code ++:6]
      provider: 'algolia',
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
    }
  })
})
```
