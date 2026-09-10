---
url: /en/guide/api/client/index.md
---
## Usage

```ts
import { Layout } from 'vuepress-theme-plume/client'
```

## Layout Components

* `<Layout />`: Page layout component
* `<NotFound />`: 404 page layout component

```ts
import { Layout, NotFound } from 'vuepress-theme-plume/client'
```

## Common Components

* `<VPLink />`: Link component
* `<VPButton />`: Button component
* `<VPIcon />`: Icon component
* `<VPBadge />`: Badge component
* `<VPImage />`: Image component
* `<VPHomeBox />`: Home page layout component

For more components, please check the [source code](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/theme/src/client/components).

```ts
import VPButton from 'vuepress-theme-plume/components/VPButton.vue'
import VPLink from 'vuepress-theme-plume/components/VPLink.vue'
```

## Composable APIs

### `useDarkMode()`

* Type: `() => Ref<boolean>`
* Details:

  Returns a reactive reference indicating whether dark mode is enabled.

```ts
import { useDarkMode } from 'vuepress-theme-plume/composables'

const isDark = useDarkMode()

// Switch to dark mode
isDark.value = true
// Switch to light mode
isDark.value = false
```

### `useData()`

* Type: `() => Data`
* Details:

  Returns reactive data for various theme properties.

```ts
interface Data {
  // Theme configuration
  theme: ThemeLocaleDataRef<PlumeThemeLocaleData>
  // Current page data
  page: PageDataRef<PlumeThemePageData>
  // Current page frontmatter
  frontmatter: PageFrontmatterRef<Frontmatter<T>>
  // Current language
  lang: Ref<string>
  // Site data
  site: SiteLocaleDataRef
  // Whether dark mode is enabled
  isDark: Ref<boolean>
}
```

```ts
import { useData } from 'vuepress-theme-plume/composables'

const { site, page, frontmatter, isDark, lang } = useData()

// Current page title
console.log(frontmatter.value.title)
```

### `useLocalePostList()`

* Type: `() => Ref<PostItem[]>`
* Details:

  Returns a reactive reference to the post list data.

```ts
interface PostItem {
  path: string
  title: string
  excerpt: string
  tags: string[]
  sticky: boolean
  categoryList: CategoryItem[]
  createTime: string
  lang: string
  encrypt?: boolean
}

interface CategoryItem {
  type: string | number
  name: string
}
```

```ts
import { useLocalePostList } from 'vuepress-theme-plume/composables'

const postList = useLocalePostList()
```

### More

For other composable APIs, please check the [source code](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/theme/src/client/composables).
