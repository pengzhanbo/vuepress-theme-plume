# Navbar / Sidebar Reference

## Navbar

```ts
type ThemeNavItem = string | NavItemWithLink | NavItemWithChildren

interface NavItemWithLink {
  text: string
  link: string
  icon?: ThemeIcon
  badge?: string | ThemeBadge
  activeMatch?: string // regex string, e.g. '^/blog/'
  rel?: string
  target?: string
  noIcon?: boolean
}

interface NavItemChildren {
  text?: string
  prefix?: string
  icon?: ThemeIcon
  badge?: string | ThemeBadge
  items: (string | NavItemWithLink)[] // depth limited
}

interface NavItemWithChildren {
  text?: string
  prefix?: string
  icon?: ThemeIcon
  badge?: string | ThemeBadge
  items: (string | NavItemChildren | NavItemWithLink)[]
  activeMatch?: string
}
```

- A `string` item is a page file path (`/bar`) or a route (`/guide/`); `.md` may be omitted.
- Groups nest at most 2 levels; `prefix` is prepended to child links.
- `navbar: []` is **not** an empty navbar: the theme injects 首页 / 博客（首个 post 集合）/ 标签 / 归档. Pass an
  explicit array (even one item) to fully control it.
- Split the config to keep `config.ts` small:

```ts
// .vuepress/navbar.ts
import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  {
    text: '文档',
    prefix: '/guide/',
    icon: 'mdi:book-open-outline',
    items: [
      { text: '快速开始', link: 'intro' },
      { text: '配置', items: [{ text: '主题', link: 'theme' }] },
    ],
  },
  { text: 'GitHub', link: 'https://github.com/name', icon: 'mdi:github' },
])
```

### Icons in navbar / sidebar

- `icon` accepts an iconify name (`mdi:home`), an SVG URL, or `{ svg: '<svg/>' }`.
- Icons follow `markdown.icon.provider` (`iconify` by default). With another provider (`iconfont`, `fontawesome`),
  force iconify with the prefix: `icon: 'iconify carbon:home'`.
- `badge` renders a `<Badge>` next to the text: string or `{ text, type, color, bgColor, borderColor }`.

## Sidebar

Prefer `collections[].sidebar` (doc collections). Global `sidebar` remains available:

```ts
type SidebarMulti = Record<
  string, // route prefix
  | 'auto'
  | (string | ThemeSidebarItem)[]
  | { items: 'auto' | (string | ThemeSidebarItem)[]; prefix?: string }
>

interface ThemeSidebarItem {
  text?: string
  link?: string
  icon?: ThemeIcon
  badge?: string | ThemeBadge
  items?: 'auto' | (string | ThemeSidebarItem)[]
  collapsed?: boolean // true = collapsible & collapsed, false = collapsible & expanded, undefined = not collapsible
  prefix?: string
  rel?: string
  target?: string
}
```

```ts
// collection level
{ type: 'doc', dir: 'demo', title: 'Demo', sidebar: [{ text: 'One', link: 'one' }] }

// global level
sidebar: { '/config/': [{ text: '主题配置', link: 'theme' }] }
```

- `sidebar: 'auto'` derives the tree from the folder structure; ordering follows the folder/file naming
  convention (`1.guide/`, `2.start.md`, `-hidden.md`, etc. — see the "文件夹命名约定" docs page).
- `collapsed` on a group, `sidebarCollapsed` on the collection, and per-page frontmatter all interact: the
  collection value only seeds `'auto'` sidebars.
- Entries pointing to `draft: true` pages are removed from production builds (a group keeps its children).
- `sidebarScrollbar: false` hides the scrollbar only, scrolling behaviour is unchanged.

## Page-level overrides (frontmatter)

`sidebar: false | '<prefix>'`, `aside: boolean | 'left'`, `outline`, `navbar: boolean`, `pageClass`,
`icon` (sidebar/navbar icon source of truth).
