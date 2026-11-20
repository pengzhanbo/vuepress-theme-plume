---
url: /en/guide/features/series/index.md
---
## Overview

A series groups posts into an ordered collection. No table of contents to maintain by hand: add two
lines to the frontmatter of each post, and the theme shows "This post is part of … · 3 of 12" above
the content, a "Next: …" link at the end, and generates a contents page listing every chapter in order.

Blog posts, docs and pages from different folders can share one series, and the URLs of those pages
never change.

The feature is disabled by default, one switch is enough to turn it on.

::::: tip This site uses it

* [Theme features](/series/features/): how to use each feature
* [Version updates](/series/version-update/): release notes and breaking changes
* [All series](/series/): the overview page

Open any chapter to see the hint above the content and the "Next" link at the end.
(The sample content is in Chinese, the layout is the same.)

:::::

## Getting started

:::::: steps

1. **Turn it on**

   ```ts title=".vuepress/config.ts"
   import { defineUserConfig } from 'vuepress'
   import { plumeTheme } from 'vuepress-theme-plume'

   export default defineUserConfig({
     theme: plumeTheme({
       series: true, // [!code hl]
     }),
   })
   ```

   `true` means "use the defaults", see [theme config · series](../../config/theme.md#series) for every option.

2. **Mark the posts**

   Add `series` and `seriesOrder` to every post of the same series:

   ```yaml title="blog/vue3-reactivity.md"
   ---
   title: Reactivity
   series: vue3 # [!code hl]
   seriesOrder: 1 # [!code hl]
   ---
   ```

   `series` is the id of the series — pick anything, just keep it identical across the posts.
   `seriesOrder` is the position of this post in the series.

3. **Run and check**

   Restart the dev server and open one of the posts: the hint shows up above the content, "Next"
   at the end, and "Completed" on the last chapter. A contents page is generated at `/series/vue3/`,
   with the numbering computed for you.

::::::

::::: warning Chapter rules

Encrypted pages, pages with `article: false` and drafts in a production build are skipped.
A series with at least one public post always gets a contents page and the in-page hints, a single
post series included.

:::::

## Navbar entry

The contents page of a series lives at `/series/<id>/`, the overview at `/series/`. Add one of them
to the navbar so readers can find their way in:

::::: code-tabs#configs

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    series: true,
    navbar: [
      {
        text: 'Series',
        link: '/series/', // [!code hl]
        icon: 'lucide:library-big',
        activeMatch: '^/series/', // [!code hl]
      },
    ],
  }),
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  navbar: [
    {
      text: 'Series',
      link: '/series/',
      icon: 'lucide:library-big',
      activeMatch: '^/series/',
    },
  ],
})
```

:::::

A few common variants:

| Goal | How |
| --- | --- |
| One entry for every series | `link: '/series/'`, with `index` enabled |
| A single series | `link: '/series/features/'` |
| Inside a dropdown | use `items: [{ text, link }]` instead of `link` |

`activeMatch` keeps the navbar entry highlighted while reading a post of any series, use the path
prefix as the value, e.g. `^/series/`.

::::: tip The overview page is opt-in

`series: true` only creates the contents page of each series. For a page listing all of them, add
`index: true`:

```ts title=".vuepress/plume.config.ts"
export default defineThemeConfig({
  series: {
    index: true, // [!code hl]
  },
})
```

:::::

## Series info

`series` is only an id, the name readers see is set in the config:

```ts title=".vuepress/plume.config.ts"
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  series: {
    items: {
      vue3: {
        title: 'Vue 3 in depth',
        description: 'Reactivity, components and the compiler in 12 posts.',
        cover: '/images/vue3.png',
      },
    },
  },
})
```

| Field | Description |
| --- | --- |
| `title` | Series title, used as the heading of the contents page |
| `description` | One sentence, shown on the contents page and the overview |
| `cover` | Optional image at the top of the contents page, a path inside `public` |

This site keeps its own config in `docs/.vuepress/series.ts`, feel free to copy it:

```ts title="docs/.vuepress/series.ts"
export const enSeries: SeriesOptions = {
  page: true,
  autoCreate: true,
  index: true,
  items: {
    'features': {
      title: 'Theme Features',
      description: 'List of theme features, with detailed explanations of how to enable and configure them.',
    },
    'version-update': {
      title: 'Version Update',
      description: 'Version update log, including new features, bug fixes, and changes.',
    },
  },
}
```

A series that is not declared in `items` still works: the id is used as the title, and the terminal
reminds you that you can add a proper one.

## Contents page and overview

| Page | Path | Content |
| --- | --- | --- |
| Contents page | `/series/<id>/` | Title, description, cover, chapter count and total time, the chapter list |
| Overview | `/series/` | Every series of the current locale, with a preview of the first 3 chapters (needs `index: true`) |

Both are generated at build time as plain static pages: readable without JavaScript, indexable by
search engines, and absent from the post list, the search index and the RSS feed. In a multilingual
site each language gets its own pair, they never mix.

## Subscribe a series

Series can be subscribed to as well. Once feeds are enabled and series channels are generated, the
landing page shows a subscribe button right below the title:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'https://example.com', // [!code hl]
    feed: {
      perSeries: true, // [!code hl]
    },
    series: true,
  }),
})
```

Output:

| Subscription | URL |
| --- | --- |
| Series `features` | `/series/features/feed.xml` |
| Series `features` (English site) | `/en/series/features/feed.xml` |

Entries are ordered by chapter instead of published date and are not truncated by default, so a
subscriber receives the complete table of contents. A single chapter series still owns a channel; its
landing page and the channel home are the same canonical path `/series/<id>/`.

Override or disable the subscription of one series:

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  series: {
    items: {
      vue3: { feed: { title: 'Vue 3 series', limit: 50 } },
      archive: { feed: false },
    },
  },
})
```

A series that disabled its landing page (`page: false`) and declared no `link` has no home to point at,
so no channel is generated; add a `feed.link` to restore it.

::: warning `hostname` is required

Feed links must be absolute. Without `hostname` no subscription file is generated and the button never
appears. Files are only produced by a production build (`vuepress build`).

:::

See [Feed subscription](./feed.md#series-channels) for every detail.

## Configuration

### Ordering

If **every** post of a series declares `seriesOrder`, the series is sorted by it. If **any** post is
missing it, the whole series falls back to the publish time, so the order never breaks. You can also
force a strategy:

| Value | Result |
| --- | --- |
| `'auto'` (default) | by `seriesOrder` when every post has one, otherwise by publish time |
| `'order'` | always by `seriesOrder`, posts without one go last |
| `'time'` | always by publish time |

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  series: {
    order: 'order', // global default
    items: {
      vue3: { order: 'time' }, // per series override
    },
  }
})
```

### Turn off the in-page links

| Scope | How |
| --- | --- |
| One post | frontmatter `seriesNav: false` |
| Whole site | `series: { nav: false }` |

Only the hints above and below the content disappear, the contents page is still generated and the
doc pager is not affected.

### Custom paths

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  series: {
    linkPrefix: '/collections/', // path prefix, '/series/' by default
    items: {
      vue3: { link: '/vue3/' }, // custom path for one series
      notes: { page: false, link: '/notes/' }, // no contents page, point at your own page
    },
  }
})
```

When the path of a contents page is already used by another page, the theme skips it and reports the
conflict in the terminal, it never overwrites a page you wrote.

### Per language

Each language has its own series; `/series/` and `/en/series/` never mix. This site configures them
under `locales`:

```ts title=".vuepress/plume.config.ts"
export default defineThemeConfig({
  locales: {
    '/': { series: zhSeries },
    '/en/': { series: enSeries },
  },
})
```

### All options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `boolean` | `true` | Generate the contents page |
| `index` | `boolean` | `false` | Generate the overview page at `/series/` |
| `linkPrefix` | `string` | `'/series/'` | Path prefix of contents pages |
| `order` | `'auto' \| 'order' \| 'time'` | `'auto'` | How chapters are sorted |
| `nav` | `boolean` | `true` | Show the in-page hints |
| `autoCreate` | `boolean` | `true` | Create a series automatically when it is not declared |
| `items` | `Record<string, SeriesItemOptions>` | `{}` | Title, description, cover… of each series |

Frontmatter fields:

| Field | Type | Description |
| --- | --- | --- |
| `series` | `string` | Id of the series |
| `seriesOrder` | `number` | Position in the series, used for ordering |
| `seriesNav` | `boolean` | Show the hints on this page, `true` by default |

See [theme config · series](../../config/theme.md#series) for the complete reference.

## Related posts

Once [related posts](./related-posts.md) are enabled, the series relation becomes an extra
signal of the recommendation:

* the next chapter is already shown by its own block, so it is not recommended again;
* the other chapters are controlled by `relatedPosts.seriesBoost`: `1` keeps the score,
  `0` never recommends them, values above `1` prefer them.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    series: true,
    relatedPosts: { seriesBoost: 1.2 },
  }),
})
```

See [Related Posts - Series integration](./related-posts.md#series-integration) for details.
