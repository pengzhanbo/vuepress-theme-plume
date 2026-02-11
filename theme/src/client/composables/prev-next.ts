import type { ComputedRef } from 'vue'
import type { NavItemWithLink, ThemePostsItem, ThemeSidebarItem } from '../../shared/index.js'
import { computed } from 'vue'
import { resolveRouteFullPath, usePageLang, useRoute } from 'vuepress/client'
import { isPlainObject, isString } from 'vuepress/shared'
import { resolveNavLink } from '../utils/index.js'
import { useData } from './data.js'
import { usePostsPageData } from './page.js'
import { useLocalePostList } from './posts-data.js'
import { useSidebar } from './sidebar.js'

interface UsePrevNextResult {
  prev: ComputedRef<NavItemWithLink | null>
  next: ComputedRef<NavItemWithLink | null>
}

const SEPARATOR_RE = /^-{3,}$/

export function usePrevNext(): UsePrevNextResult {
  const route = useRoute()
  const { frontmatter, theme } = useData()
  const { sidebar } = useSidebar()
  const postList = useLocalePostList()
  const locale = usePageLang()
  const { isPosts } = usePostsPageData()

  const prevNavLink = computed(() => {
    if (theme.value.prevPage === false)
      return null

    const prevConfig = resolveFromFrontmatterConfig(frontmatter.value.prev)
    if (prevConfig !== false)
      return prevConfig

    if (isPosts.value) {
      return resolveFromPostsData(
        postList.value.filter(item => item.lang === locale.value),
        route.path,
        -1,
      )
    }
    else {
      return resolveFromSidebarItems(flatSidebar(sidebar.value), route.path, -1)
    }
  })

  const nextNavLink = computed(() => {
    if (theme.value.nextPage === false)
      return null

    const nextConfig = resolveFromFrontmatterConfig(frontmatter.value.next)
    if (nextConfig !== false)
      return nextConfig

    if (isPosts.value) {
      return resolveFromPostsData(
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
    prev: prevNavLink,
    next: nextNavLink,
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

function flatSidebar(sidebar: ThemeSidebarItem[], res: NavItemWithLink[] = []): NavItemWithLink[] {
  for (const item of sidebar) {
    if (item.link)
      res.push({ link: item.link, text: item.text || '', icon: item.icon })

    if (Array.isArray(item.items) && item.items.length)
      flatSidebar(item.items as ThemeSidebarItem[], res)
  }

  return res
}

/**
 * Resolve `prev` or `next` config from sidebar items
 */
function resolveFromSidebarItems(sidebarItems: NavItemWithLink[], currentPath: string, offset: number): null | NavItemWithLink {
  let index = sidebarItems.findIndex(item => resolveRouteFullPath(item.link) === currentPath)
  if (index === -1)
    return null
  // eslint-disable-next-line no-cond-assign
  while ((index += offset) >= 0) {
    const targetItem = sidebarItems[index]
    if (targetItem?.link && !SEPARATOR_RE.test(targetItem.link)) {
      return targetItem
    }
  }

  return null
}

function resolveFromPostsData(postList: ThemePostsItem[], currentPath: string, offset: number): null | NavItemWithLink {
  const index = postList.findIndex(item => item.path === currentPath)
  if (index !== -1) {
    const targetItem = postList[index + offset]
    if (!targetItem?.path)
      return null

    return { link: targetItem.path, text: targetItem.title }
  }
  return null
}
