---
title: 客户端
author: pengzhanbo
icon: nimbus:browser
createTime: 2024/03/07 21:58:48
permalink: /guide/api/client/
---

## 使用

```ts
import { Layout } from 'vuepress-theme-plume/client'
```

## 布局组件

- `<Layout />`： 页面布局组件
- `<NotFound />` ： 404 页面布局组件

```ts
import { Layout, NotFound } from 'vuepress-theme-plume/client'
```

## 通用组件

- `<VPLink />` ： 链接组件
- `<VPButton />`: 按钮组件
- `<VPIcon />`: 图标组件
- `<VPBadge />`: 徽标组件
- `<VPImage />`: 图片组件
- `<VPHomeBox />`: 首页布局组件

更多其他组件请查看 [源代码](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/theme/src/client/components)

```ts
import VPButton from 'vuepress-theme-plume/components/VPButton.vue'
import VPLink from 'vuepress-theme-plume/components/VPLink.vue'
```

## 组合式 API

### `useDarkMode()`

- 类型： `() => Ref<boolean>`
- 详情：

  获取 是否是深色模式的响应式数据。

```ts
import { useDarkMode } from 'vuepress-theme-plume/composables'

const isDark = useDarkMode()

// 切换为深色模式
isDark.value = true
// 切换为浅色模式
isDark.value = false
```

### `useData()`

- 类型： `() => Data`
- 详情：

  获取 主题 的各项响应式数据。

```ts
interface Data {
  // 主题配置
  theme: ThemeLocaleDataRef<PlumeThemeLocaleData>
  // 当前页面数据
  page: PageDataRef<PlumeThemePageData>
  // 当前 页面 frontmatter
  frontmatter: PageFrontmatterRef<Frontmatter<T>>
  // 当前语言
  lang: Ref<string>
  // 站点数据
  site: SiteLocaleDataRef
  // 是否是深色模式
  isDark: Ref<boolean>
}
```

```ts
import { useData } from 'vuepress-theme-plume/composables'

const { site, page, frontmatter, isDark, lang } = useData()

// 当前页面标题
console.log(frontmatter.value.title)
```

### `useLocalePostList()`

- 类型： `() => Ref<PostItem[]>`
- 详情：

  获取 文章列表的响应式数据。

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

### 更多

其它 组合式 API 请查看 [源代码](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/theme/src/client/composables) 。
