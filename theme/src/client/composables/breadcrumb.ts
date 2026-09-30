import type { ResolvedSidebarItem, ThemePostCollection } from '../../shared/index.js'
import { computed, type ComputedRef } from 'vue'
import { resolveRoute, resolveRouteFullPath, useRouteLocale } from 'vuepress/client'
import { removeEndingSlash } from 'vuepress/shared'
import { normalizePrefix } from '../utils/index.js'
import { useData } from './data.js'
import { useInternalLink } from './internal-link.js'
import { usePostsPageData } from './page.js'
import { useSidebarData } from './sidebar-data.js'

interface Breadcrumb {
  text: string
  link?: string
  current?: boolean
}

export function useBreadcrumb(): {
  hasBreadcrumb: ComputedRef<boolean>
  breadcrumbList: ComputedRef<Breadcrumb[]>
} {
  const { page, collection } = useData<'post'>()
  const { isPosts } = usePostsPageData()
  const { home, posts, categories } = useInternalLink()
  const sidebar = useSidebarData()
  const routeLocale = useRouteLocale()

  function resolveSidebar(
    sidebar: ResolvedSidebarItem[],
    result: Breadcrumb[] = [],
  ): Breadcrumb[] | null {
    for (const item of sidebar) {
      const link = item.link ? resolveRouteFullPath(item.link) : undefined
      if (link === page.value.path) {
        return result
      }
      else if (item.items) {
        const res = resolveSidebar(
          item.items,
          [...result, { text: item.text!, link: item.link }],
        )
        if (res)
          return res
      }
    }
    return null
  }

  const hasBreadcrumb = computed(() => {
    if (isPosts.value && page.value.categoryList)
      return page.value.categoryList.length > 0
    return sidebar.value.length > 0
  })

  const breadcrumbList = computed<Breadcrumb[]>(() => {
    if (!hasBreadcrumb.value)
      return []
    // 面包屑导航列表，以首页作为起始点
    const list: Breadcrumb[] = [{ text: home.value.text, link: home.value.link }]

    if (isPosts.value) {
      // 对于 post 类型的 collection，添加 post 列表链接
      if (((collection.value as ThemePostCollection | undefined)?.postList ?? true) && posts.value)
        list.push({ text: posts.value.text, link: posts.value.link })

      const categoryList = page.value.categoryList ?? []
      // 对于 post 类型的 collection，添加分类链接
      for (const category of categoryList) {
        list.push({
          text: category.name,
          link: categories.value ? `${categories.value.link}?id=${category.id}` : undefined,
        })
      }
    }
    else {
      // 对于 doc 类型的 collection，添加 collection 名称链接
      if (collection.value) {
        const link = normalizePrefix(routeLocale.value, collection.value.linkPrefix || collection.value.dir)
        const { notFound, meta, path } = resolveRoute<{ title?: string }>(link)
        path !== page.value.path && list.push({
          link: !notFound ? path : undefined,
          text: meta.title || collection.value.title || removeEndingSlash(collection.value.dir).split('/').pop() || '',
        })
      }
      // 继续添加该页面在 sidebar 中的组别层级结构
      if (sidebar.value.length > 0) {
        list.push(...(resolveSidebar(sidebar.value) || []))
      }
    }
    // 添加当前页面的面包屑导航项
    list.push({
      text: page.value.frontmatter.title || page.value.title,
      link: page.value.path,
      current: true,
    })

    // 移除可能存在的重复项
    return list.reduce<Breadcrumb[]>((acc, item, index) => {
      const prev = acc[index - 1]
      if (prev && (prev.link === item.link || prev.text === item.text))
        return acc
      return [...acc, item]
    }, [])
  })

  return { hasBreadcrumb, breadcrumbList }
}
