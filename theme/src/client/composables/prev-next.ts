import type { Ref } from 'vue'
import type { NavItemWithLink, PlumeThemeBlogPostItem, SidebarItem } from '../../shared/index.js'
import { computed } from 'vue'
import { resolveRouteFullPath, usePageLang, useRoute } from 'vuepress/client'
import { isPlainObject, isString } from 'vuepress/shared'
import { resolveNavLink } from '../utils/index.js'
import { usePostList } from './blog-data.js'
import { useData } from './data.js'
import { useBlogPageData } from './page.js'
import { useSidebar } from './sidebar.js'

export function usePrevNext() {
  const route = useRoute()
  const { frontmatter, theme } = useData()
  const { sidebar } = useSidebar()
  const postList = usePostList() as unknown as Ref<PlumeThemeBlogPostItem[]>
  const locale = usePageLang()
  const { isBlogPost } = useBlogPageData()

  const prevNavList = computed(() => {
    if (theme.value.prevPage === false)
      return null

    const prevConfig = resolveFromFrontmatterConfig(frontmatter.value.prev)
    if (prevConfig !== false)
      return prevConfig

    if (isBlogPost.value) {
      return resolveFromBlogPostData(
        postList.value.filter(item => item.lang === locale.value),
        route.path,
        -1,
      )
    }
    else {
      return resolveFromSidebarItems(flatSidebar(sidebar.value), route.path, -1)
    }
  })

  const nextNavList = computed(() => {
    if (theme.value.nextPage === false)
      return null

    const nextConfig = resolveFromFrontmatterConfig(frontmatter.value.next)
    if (nextConfig !== false)
      return nextConfig

    if (isBlogPost.value) {
      return resolveFromBlogPostData(
        postList.value.filter(item => item.lang === locale.value),
        route.path,
        1,
      )
    }
    else {
      return resolveFromSidebarItems(flatSidebar(sidebar.value), route.path, 1)
    }
  })

  return {
    prev: prevNavList,
    next: nextNavList,
  }
}

/**
 * Resolve `prev` or `next` config from frontmatter
 */
function resolveFromFrontmatterConfig(conf: unknown): null | false | NavItemWithLink {
  if (conf === false)
    return null

  if (isString(conf))
    return resolveNavLink(conf)

  if (isPlainObject<NavItemWithLink>(conf))
    return conf

  return false
}

function flatSidebar(sidebar: SidebarItem[], res: NavItemWithLink[] = []): NavItemWithLink[] {
  for (const item of sidebar) {
    if (item.link)
      res.push({ link: item.link, text: item.text || item.dir || '' })

    if (Array.isArray(item.items) && item.items.length)
      flatSidebar(item.items as SidebarItem[], res)
  }

  return res
}

/**
 * Resolve `prev` or `next` config from sidebar items
 */
function resolveFromSidebarItems(sidebarItems: NavItemWithLink[], currentPath: string, offset: number): null | NavItemWithLink {
  const index = sidebarItems.findIndex(item => resolveRouteFullPath(item.link) === currentPath)
  if (index !== -1) {
    const targetItem = sidebarItems[index + offset]
    if (targetItem?.link) {
      return {
        link: targetItem.link,
        text: targetItem.text,
      }
    }
  }

  return null
}

function resolveFromBlogPostData(postList: PlumeThemeBlogPostItem[], currentPath: string, offset: number): null | NavItemWithLink {
  const index = postList.findIndex(item => item.path === currentPath)
  if (index !== -1) {
    const targetItem = postList[index + offset]
    if (!targetItem?.path)
      return null

    return {
      link: targetItem.path,
      text: targetItem.title,
    }
  }
  return null
}
