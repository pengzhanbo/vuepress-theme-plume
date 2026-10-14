---
url: /guide/api/client/index.md
---
## 使用

```ts
import { Layout } from 'vuepress-theme-plume/client'
```

## 布局组件

* `<Layout />`： 页面布局组件
* `<NotFound />` ： 404 页面布局组件

```ts
import { Layout, NotFound } from 'vuepress-theme-plume/client'
```

## 通用组件

* `<VPLink />` ： 链接组件
* `<VPButton />`: 按钮组件
* `<VPIcon />`: 图标组件
* `<VPImage />`: 图片组件
* `<VPHomeBox />`: 首页布局组件

更多其他组件请查看 [源代码](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/theme/src/client/components)

```ts
import VPButton from 'vuepress-theme-plume/components/VPButton.vue'
import VPLink from 'vuepress-theme-plume/components/VPLink.vue'
```

## 组合式 API

所有组合式 API 均从 `vuepress-theme-plume/composables` 导入。

::: tip 类型直接引用源码
文档中的类型均通过 `import type` 从包入口导入，而非手写声明。这样源码类型变更时，twoslash 会在构建阶段报出类型漂移，而不会静默失效。

```ts
import type { ThemePosts } from 'vuepress-theme-plume'
```

:::

### `useData()`

* 类型： `<T extends 'home' | 'post' | 'friends' | 'page', C extends 'post' | 'doc'>() => Data<T, C>`
* 详情：

  获取主题的各项响应式数据。这是使用频率最高的组合式 API。

泛型参数 `T` 决定 `frontmatter` 的类型（`home` / `post` / `friends` / `page`，默认 `page`），`C` 决定 `collection` 的集合类型（默认 `doc`）。

```ts
import { useData } from 'vuepress-theme-plume/composables'

// 在文章页面中获取，frontmatter 自动推断为文章类型
const { page, frontmatter, collection, isDark, lang } = useData<'post', 'doc'>()

console.log(frontmatter.value.title)

// 集合类型为 post 时，collection.value 的类型为 ThemePostCollection | undefined
const postView = useData<'post', 'post'>()
```

返回值结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `theme` | `Ref<ThemeLocaleData>` | 当前语言下的主题数据 |
| `page` | `Ref<ThemePageData>` | 当前页面数据 |
| `frontmatter` | `Ref<Frontmatter<T>>` | 当前页面 frontmatter |
| `lang` | `Ref<string>` | 当前页面语言 |
| `site` | `Ref<SiteLocaleData>` | 站点数据 |
| `isDark` | `Ref<boolean>` | 是否为深色模式 |
| `collection` | `Ref<ThemeCollectionItem \| undefined>` | 当前页面所属的[集合](../quick-start/collection.md)，未匹配到时为 `undefined` |

### `useDarkMode()`

* 类型： `() => Ref<boolean>`
* 详情：

  获取是否为深色模式的响应式数据。

```ts
import { useDarkMode } from 'vuepress-theme-plume/composables'

const isDark = useDarkMode()

// 切换为深色模式
isDark.value = true
// 切换为浅色模式
isDark.value = false
```

### `useCollection()`

* 类型： `<T extends ThemeBaseCollection = ThemeDocCollection>() => Ref<T | undefined>`
* 详情：

  获取当前页面所属的集合。返回的是[集合配置](../../config/collections.md)的响应式引用，可用于读取 `sidebar`、`profile`、`social` 等集合级配置。

```ts
import { useCollection } from 'vuepress-theme-plume/composables'

const collection = useCollection()

// 集合标题
console.log(collection.value?.title)
```

::: tip `useData().collection` 与 `useCollection()` 是一回事
后者只是前者的简写形式，功能完全相同。
:::

### `useCollections()`

* 类型： `() => Ref<Record<string, ThemeCollectionItem[]>>`
* 详情：

  获取**所有语言**下的集合数据。键为语言路径（如 `/`、`/en/`），值为该语言下的集合数组。

```ts
import { useCollections } from 'vuepress-theme-plume/composables'

const collections = useCollections()

// 根语言下的集合数量
console.log(collections.value['/']?.length)
```

### `useLocalePostList()`

* 类型： `() => ComputedRef<ThemePosts>`
* 详情：

  获取**当前集合**的文章列表。返回一个 `ComputedRef`，其值为 `ThemePosts`（即 `ThemePostsItem[]`）。

```ts
import { useLocalePostList } from 'vuepress-theme-plume/composables'

const postList = useLocalePostList()

console.log(postList.value.length)
console.log(postList.value[0]?.title)
```

列表项的完整字段请直接查看 [`ThemePostsItem`](https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/theme/src/shared/features/posts.ts) 类型定义。

### `usePostsData()`

* 类型： `() => Ref<Record<string, ThemePosts>>`
* 详情：

  获取**按语言 + 集合目录**索引的全部文章数据。

```ts
import { usePostsData } from 'vuepress-theme-plume/composables'

const postsData = usePostsData()

// 根语言下 blog 目录的文章
console.log(postsData.value['/blog/'])
```

### `useSidebar()`

* 类型： `() => { sidebar: Ref<ResolvedSidebarItem[]>, sidebarKey: ComputedRef<string>, sidebarGroups: ComputedRef<ResolvedSidebarItem[]> }`
* 详情：

  获取当前页面的侧边栏数据。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `sidebar` | `Ref<ResolvedSidebarItem[]>` | 解析后的侧边栏项 |
| `sidebarKey` | `ComputedRef<string>` | 当前匹配的侧边栏路径键 |
| `sidebarGroups` | `ComputedRef<ResolvedSidebarItem[]>` | 分组后的侧边栏（按 `children` 分组） |

```ts
import { useSidebar } from 'vuepress-theme-plume/composables'

const { sidebar, sidebarGroups } = useSidebar()

console.log(sidebar.value.length)
```

### `useSidebarData()`

* 类型： `() => Ref<ResolvedSidebarItem[]>`
* 详情：

  获取当前语言与路径下的原始侧边栏数据（未经分组处理）。

```ts
import { useSidebarData } from 'vuepress-theme-plume/composables'

const sidebar = useSidebarData()
```

### `useNavbarData()`

* 类型： `() => Ref<ResolvedNavItem[]>`
* 详情：

  获取解析后的导航栏数据。

```ts
import { useNavbarData } from 'vuepress-theme-plume/composables'

const navbar = useNavbarData()

console.log(navbar.value.length)
```

### 更多

主题共提供 **46 个** `use*` 组合式 API。其余请查看 [源代码](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/theme/src/client/composables)。

按功能分组的部分常用项：

| 分组 | API |
| --- | --- |
| 文章列表 | `usePostsExtract`、`usePostsPageData`、`usePostListControl`、`usePostsCategory`、`useTags`、`useArchives` |
| 文章元信息 | `useCopyright`、`useContributors`、`useLastUpdated`、`useEditLink`、`usePrevNext` |
| 导航与布局 | `useLayout`、`useHeaders`、`useActiveAnchor`、`useCloseSidebarOnEscape`、`useFlyout` |
| 主题与样式 | `useThemeData`、`useThemeLocaleData`、`useCssVar`、`useReducedMotion`、`useScrollPromise` |
| 其他 | `useBulletin`、`useBulletinControl`、`useIconsData`、`useRouteQuery`、`useTagColors`、`useInternalLink`、`useLink` |
