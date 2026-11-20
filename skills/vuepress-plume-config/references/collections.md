# Collections Reference

`collections` is the content model of the theme (since `1.0.0-rc.165`). One collection = one folder under
`sourceDir`. Two types: `post` (blog / column, loosely related articles) and `doc` (structured docs / notes).

```ts
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

export const blog = defineCollection({ type: 'post', dir: 'blog', title: '博客' })
export default defineCollections([blog])
```

## Common fields (`ThemeBaseCollection`)

| Field | Type | Default |
| --- | --- | --- |
| `type` | `'post' \| 'doc'` | required |
| `dir` | `string` | required (relative to `sourceDir`) |
| `title` | `string` | required (breadcrumb / list heading) |
| `linkPrefix` | `string` | `/${dir}/` — permalink prefix used by `autoFrontmatter` |
| `tagsTheme` | `'colored' \| 'gray' \| 'brand'` | `'colored'` |
| `autoFrontmatter` | `AutoFrontmatterOptions \| false` | inherits theme `autoFrontmatter` |
| `meta` | `{ tags?, readingTime?, wordCount?, createTime? }` | all `true`, `createTime: 'short'` |
| `relatedPosts` | `boolean \| RelatedPostsOptions` | inherits theme |
| `feed` | `boolean \| FeedCollectionOptions` | `post`: included, `doc`: excluded |
| ~~`readAid`~~ | deprecated → `readerPreferences.readAid` | — |

`meta.createTime` accepts `'short'` (`2022-01-01`) / `'long'` (`2022-01-01 00:00:00`) / `boolean`.

## Post collection (`ThemePostCollection`)

| Field | Type | Default |
| --- | --- | --- |
| `include` | `string[]` (glob) | `['**/*.md']` |
| `exclude` | `string[]` (glob) | `[]` |
| `pagination` | `false \| number \| { perPage }` | `{ perPage: 15 }` |
| `link` | `string` | `/${dir}/` (list page) |
| `postList` | `boolean` | `true` |
| `tags` / `tagsLink` / `tagsText` | `boolean` / `string` / `string` | `true` / `${linkPrefix}tags/` |
| `archives` / `archivesLink` / `archivesText` | `boolean` / `string` / `string` | `true` / `/${link}/archives/` |
| `categories` / `categoriesLink` / `categoriesText` | `boolean` / `string` / `string` | `true` / `/${link}/categories/` |
| `categoriesExpand` | `number \| 'deep'` | `'deep'` |
| `categoriesTransform` | `(categories: PostsCategoryItem[]) => PostsCategoryItem[]` | — |
| `postCover` | `PostsCoverLayout \| PostsCoverStyle` | `'right'` |
| `profile` | `ProfileOptions \| false` | inherits theme |
| `social` | `SocialLink[] \| false` | inherits theme |

```ts
type PostsCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

interface PostsCoverStyle {
  layout?: PostsCoverLayout
  ratio?: number | `${number}:${number}` | `${number}/${number}` // default '4:3'
  width?: number // default 240, only for left/right
  compact?: boolean // default false
}

interface PostsCategoryItem { id: string, sort: number, name: string }
```

## Doc collection (`ThemeDocCollection`)

| Field | Type | Default |
| --- | --- | --- |
| `sidebar` | `'auto' \| (string \| ThemeSidebarItem)[]` | — |
| `sidebarScrollbar` | `boolean` | `true` |
| `sidebarCollapsed` | `boolean` | `false` (only with `sidebar: 'auto'`) |

## Collection-level feed (`FeedCollectionOptions`)

| Field | Type | Default |
| --- | --- | --- |
| `include` | `boolean` | `true` |
| `channel` | `boolean` | `true` (dedicated channel) |
| `link` | `string` | collection `link` |
| `title` | `string` | collection `title` |
| `description` | `string` | theme-level description |
| `limit` | `number` | theme-level `limit` |
| `content` | `'excerpt' \| 'full'` | theme-level |
| `formats` | `FeedFormat[]` | theme-level |

`feed: true` ≡ `feed: {}` (opt-in), `feed: false` excludes the collection entirely. Explicit `feed` does not
need `feed.perCollection` / `feed.includeDocCollections`.

## Shared types

```ts
interface ProfileOptions {
  avatar?: string
  name?: string
  description?: string
  circle?: boolean
  location?: string
  organization?: string
  layout?: 'left' | 'right' // default 'right'
}

interface SocialLink {
  icon: string | { svg: string, name?: string } // built-in: github, twitter, weibo, bilibili, zhihu, juejin, x, bluesky, npm, ...
  link: string
  ariaLabel?: string
}

interface ThemeBadge {
  text?: string
  type?: string // preset style
  color?: string
  bgColor?: string
  borderColor?: string
}

type ThemeIcon = string | { svg: string } // iconify name / svg url / inline svg
```

## Examples

Blog + column + docs in one site:

```ts
plumeTheme({
  collections: [
    { type: 'post', dir: 'blog', title: '博客', linkPrefix: '/article/', postCover: 'top' },
    { type: 'post', dir: 'interview', title: '面试专栏', pagination: { perPage: 10 } },
    { type: 'doc', dir: 'guide', title: '指南', sidebar: 'auto', sidebarCollapsed: false },
    {
      type: 'doc',
      dir: 'api',
      title: 'API',
      sidebar: [
        { text: '基础', link: 'basic' },
        { text: '模块', items: ['asyncio', 'pathlib'] },
      ],
    },
  ],
})
```

Multi-language: put `collections` inside each `locales` entry, with `dir` relative to that language's source dir.

Draft pages (`frontmatter.draft: true`) are removed from lists, sidebar, navbar, search, sitemap and llms.txt in
production builds — sidebar/navbar entries pointing to them are auto-pruned.
