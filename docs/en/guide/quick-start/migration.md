---
title: Migration Guide
icon: material-symbols:rocket-launch-outline
createTime: 2026/10/10 10:00:00
permalink: /en/guide/migration/
---

## Overview

This page explains how to upgrade **configurations from versions before 1.0.0-rc.165** to the current version's `collections` architecture.

At build time, the theme **automatically migrates** the old `blog` / `notes` configuration, so you can keep running without manually rewriting it.
However, automatic migration follows a priority rule of "`collections` takes precedence," and in some scenarios the migration result does not match expectations — these cases require you to handle them yourself.

::: tip Just want to quickly confirm that nothing has been migrated?
Jump straight to the [Which cases will not be automatically migrated](#which-cases-will-not-be-automatically-migrated) section in this article.
:::

## What is collections

The theme now uses `collections` to uniformly describe "which part of the content, in what form, generates which pages":

| Collection type | Purpose | Generated content |
| --- | --- | --- |
| `post` | Blog-like content | List page, tag page, archive page, category page |
| `doc` | Documentation-like content | Sidebar navigation |

The old version's `blog` corresponds to the `post` collection, and the old `notes` corresponds to a group of `doc` collections.

## How the old configuration gets migrated

The theme is compatible with the old `blog/notes` configuration by default and performs the conversion at build time. The rules are as follows:

1. If **`collections` is not configured**, the root-level `blog` is converted into a `post` collection, and `notes` is converted into several `doc` collections.
2. The directories configured in `notes` are automatically appended to the `exclude` of the `blog` collection, to prevent these articles from being included in the blog list.
3. **If `collections` is configured, the root-level `blog` / `notes` will be ignored.**
4. In multilingual scenarios, when a certain locale **declares its own `collections`**, its own `blog` / `notes` will be ignored; when it does not declare them, it falls back to using the root-level `blog` / `notes`.

::: warning
`blog` and `notes` have been marked `@deprecated`. They are only for transition and **will be removed directly in the next major version**.
:::

## Which cases will not be automatically migrated

The following scenarios require you to adjust manually.

### 1. `collections` and `blog` / `notes` are configured at the same time

This is the case most prone to pitfalls: **when `collections` exists, `blog` / `notes` are directly ignored**.

If you want to keep your existing `collections` while also continuing to use the old `blog`, manually merge the contents of `blog` into `collections`.

### 2. A certain locale needs separate configuration, but the root level does not have any

The old `blog` / `notes` are global configurations, shared by all languages. If you need to use different collections in a certain locale, declare `collections` **inside that locale** rather than relying on root-level fallback.

### 3. Multiple directories in `notes` correspond to different sidebars

The old `notes.notes` is an array, and each item has its own `dir` / `link` / `sidebar`. Migration generates an independent `doc` collection for each item, so the structure can usually correspond; but if you relied on `notes.sidebarScrollbar` (an old field), note that it has been migrated onto each `doc` collection.

## Manual migration steps

Take a typical 1.x configuration:

```ts
export default defineThemeConfig({
  blog: {
    dir: 'blog',
    categories: true,
    tags: true,
    archives: true,
    pagination: {
      perPage: 10,
    },
  },
  notes: {
    dir: 'notes',
    link: '/notes/',
    notes: [
      { dir: 'guide', link: '/guide/' },
      { dir: 'api', link: '/api/' },
    ],
  },
})
```

Migrate it to:

```ts twoslash
import { defineCollections } from 'vuepress-theme-plume'

// After migration
export default defineCollections([
  {
    type: 'post',
    dir: 'blog',
    title: 'Blog',
    categories: true,
    tags: true,
    archives: true,
    pagination: {
      perPage: 10,
    },
  },
  {
    type: 'doc',
    dir: 'notes/guide',
    title: 'Guide',
    linkPrefix: '/notes/guide/',
  },
  {
    type: 'doc',
    dir: 'notes/api',
    title: 'API',
    linkPrefix: '/notes/api/',
  },
])
```

::: warning
Two differences to note:

- `title` is a **required field** (`ThemeBaseCollection.title`). If your legacy config did not declare a collection title explicitly, you must supply one after migrating.
- `linkPrefix` determines the URL of articles in the collection. If `notes` had no explicit `link`, migration falls back to the directory name, so **URLs may differ from before**.
:::

::: tip
If the legacy config used a hand-written sidebar array (`notes.notes[].sidebar`), it is migrated as-is into the `doc` collection's `sidebar` field, which accepts `'auto'` or `(string | ThemeSidebarItem)[]`.
:::

## How `dir` matching works for nested collections

When directories are **nested**, a file belongs to the collection with the **longest matching** `dir`:

- When both `dir: 'docs'` (`type: 'doc'`) and `dir: 'docs/blog'` (`type: 'post'`) are declared
- `docs/blog/a.md` belongs to the **`post`** collection (`docs/blog` is longer than `docs`, so the longer match wins)
- `docs/guide/b.md` belongs to the `doc` collection

This is resolved automatically — no manual ordering is needed. The logic lives in `theme/src/node/collections/findCollection.ts`: it sorts collections by `dir` length in **descending** order and picks the first whose directory prefix matches, so a **longer (more specific) directory always takes priority**.

## Verify the result

After migrating, check each of the following:

1. **Blog list pages** render correctly, with pagination and article counts matching the pre-migration state
2. **Tag, archive and category pages** are reachable
3. **Doc sidebars** match the pre-migration state, especially deep structures such as `sidebar: 'auto'`
4. **URLs have not changed** — a wrong `linkPrefix` changes paths and breaks old links
5. Articles in the original `notes` directory are correctly excluded from the blog list

## Related documentation

- [Collection](./collection.md) — full `collections` configuration reference
- [Configuration > Theme](../../config/theme.md) — every config field, its type and default
- [Configuration > Collections](../../config/collections.md) — collections configuration reference
