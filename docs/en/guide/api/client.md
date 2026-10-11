---
title: Client
icon: nimbus:browser
createTime: 2025/10/08 21:58:48
permalink: /en/guide/api/client/
---

## Usage

```ts
import { Layout } from 'vuepress-theme-plume/client'
```

## Layout Components

- `<Layout />`: Page layout component
- `<NotFound />`: 404 page layout component

```ts
import { Layout, NotFound } from 'vuepress-theme-plume/client'
```

## Common Components

- `<VPLink />`: Link component
- `<VPButton />`: Button component
- `<VPIcon />`: Icon component
- `<VPImage />`: Image component
- `<VPHomeBox />`: Home page layout component

For more components, please check the [source code](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/theme/src/client/components).

```ts
import VPButton from 'vuepress-theme-plume/components/VPButton.vue'
import VPLink from 'vuepress-theme-plume/components/VPLink.vue'
```

## Composable APIs

All composable APIs are imported from `vuepress-theme-plume/composables`.

::: tip Types are imported from source
Types in this document are pulled in with `import type` from the package entry rather than hand-written declarations. When source types change, twoslash reports the drift at build time instead of letting it go silently.

```ts
import type { ThemePosts } from 'vuepress-theme-plume'
```

:::

### `useData()`

- Type: `<T extends 'home' | 'post' | 'friends' | 'page', C extends 'post' | 'doc'>() => Data<T, C>`
- Details:

  Returns the theme's reactive data. This is by far the most frequently used composable.

The generic parameter `T` determines the `frontmatter` type (`home` / `post` / `friends` / `page`,
default `page`), and `C` determines the collection type of `collection` (default `doc`).

```ts
import { useData } from 'vuepress-theme-plume/composables'

// On a post page, frontmatter is inferred as the post type
const { page, frontmatter, collection, isDark, lang } = useData<'post', 'doc'>()

console.log(frontmatter.value.title)

// With collection type 'post', collection.value is ThemePostCollection | undefined
const postView = useData<'post', 'post'>()
```

Returned properties:

| Property | Type | Description |
| --- | --- | --- |
| `theme` | `Ref<ThemeLocaleData>` | Theme data for the current locale |
| `page` | `Ref<ThemePageData>` | Current page data |
| `frontmatter` | `Ref<Frontmatter<T>>` | Current page frontmatter |
| `lang` | `Ref<string>` | Current page language |
| `site` | `Ref<SiteLocaleData>` | Site data |
| `isDark` | `Ref<boolean>` | Whether dark mode is enabled |
| `collection` | `Ref<ThemeCollectionItem \| undefined>` | The [collection](../quick-start/collection.md) the current page belongs to; `undefined` when none matches |

### `useDarkMode()`

- Type: `() => Ref<boolean>`
- Details:

  Returns a reactive reference indicating whether dark mode is enabled.

```ts
import { useDarkMode } from 'vuepress-theme-plume/composables'

const isDark = useDarkMode()

// Switch to dark mode
isDark.value = true
// Switch to light mode
isDark.value = false
```

### `useCollection()`

- Type: `<T extends ThemeBaseCollection = ThemeDocCollection>() => Ref<T | undefined>`
- Details:

  Returns the collection the current page belongs to. The value is a reactive reference to the
  [collection configuration](../../config/collections.md), through which you can read collection-level
  options such as `sidebar`, `profile` and `social`.

```ts
import { useCollection } from 'vuepress-theme-plume/composables'

const collection = useCollection()

console.log(collection.value?.title)
```

::: tip `useData().collection` is the same thing
The latter is just a shorthand for the former; they are functionally identical.
:::

### `useCollections()`

- Type: `() => Ref<Record<string, ThemeCollectionItem[]>>`
- Details:

  Returns the collection data for **all locales**. Keys are locale paths (e.g. `/`, `/en/`) and values
  are the arrays of collections for that locale.

```ts
import { useCollections } from 'vuepress-theme-plume/composables'

const collections = useCollections()

console.log(collections.value['/']?.length)
```

### `useLocalePostList()`

- Type: `() => ComputedRef<ThemePosts>`
- Details:

  Returns the article list of the **current collection** as a `ComputedRef` whose value is `ThemePosts`
  (i.e. `ThemePostsItem[]`).

```ts
import { useLocalePostList } from 'vuepress-theme-plume/composables'

const postList = useLocalePostList()

console.log(postList.value.length)
console.log(postList.value[0]?.title)
```

For the full field list, see the [`ThemePostsItem`](https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/theme/src/shared/features/posts.ts) type definition.

### `usePostsData()`

- Type: `() => Ref<Record<string, ThemePosts>>`
- Details:

  Returns all article data, indexed by locale and collection directory.

```ts
import { usePostsData } from 'vuepress-theme-plume/composables'

const postsData = usePostsData()

console.log(postsData.value['/blog/'])
```

### `useSidebar()`

- Type: `() => { sidebar: Ref<ResolvedSidebarItem[]>, sidebarKey: ComputedRef<string>, sidebarGroups: ComputedRef<ResolvedSidebarItem[]> }`
- Details:

  Returns the sidebar data for the current page.

| Property | Type | Description |
| --- | --- | --- |
| `sidebar` | `Ref<ResolvedSidebarItem[]>` | Resolved sidebar items |
| `sidebarKey` | `ComputedRef<string>` | The sidebar path key currently matched |
| `sidebarGroups` | `ComputedRef<ResolvedSidebarItem[]>` | Sidebar grouped by `children` |

```ts
import { useSidebar } from 'vuepress-theme-plume/composables'

const { sidebar, sidebarGroups } = useSidebar()

console.log(sidebar.value.length)
```

### `useSidebarData()`

- Type: `() => Ref<ResolvedSidebarItem[]>`
- Details:

  Returns the raw sidebar data for the current locale and path, before grouping.

```ts
import { useSidebarData } from 'vuepress-theme-plume/composables'

const sidebar = useSidebarData()
```

### `useNavbarData()`

- Type: `() => Ref<ResolvedNavItem[]>`
- Details:

  Returns the resolved navbar data.

```ts
import { useNavbarData } from 'vuepress-theme-plume/composables'

const navbar = useNavbarData()

console.log(navbar.value.length)
```

### More

The theme provides **46** `use*` composable APIs in total (plus utility functions such as `forceUpdateCollection` and `hasActiveLink`). For the rest, see the
[source code](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/theme/src/client/composables).

Some frequently used ones, grouped by purpose:

| Group | APIs |
| --- | --- |
| Post lists | `usePostsExtract`, `usePostsPageData`, `usePostListControl`, `usePostsCategory`, `useTags`, `useArchives` |
| Post meta | `useCopyright`, `useContributors`, `useLastUpdated`, `useEditLink`, `usePrevNext` |
| Navigation & layout | `useLayout`, `useHeaders`, `useActiveAnchor`, `useCloseSidebarOnEscape`, `useFlyout` |
| Theme & styles | `useThemeData`, `useThemeLocaleData`, `useCssVar`, `useReducedMotion`, `useScrollPromise` |
| Others | `useBulletin`, `useBulletinControl`, `useIconsData`, `useRouteQuery`, `useTagColors`, `useInternalLink`, `useLink` |
