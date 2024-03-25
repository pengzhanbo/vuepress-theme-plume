import { usePageData, usePageFrontmatter, usePageLang, useRoute } from 'vuepress/client'
import { isPlainObject, isString } from 'vuepress/shared'
import { useBlogPostData } from '@vuepress-plume/plugin-blog-data/client'
import type { NotesSidebarItem } from '@vuepress-plume/plugin-notes-data'
import { computed, onMounted, ref, watchEffect } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  NavItemWithLink,
  PlumeThemeBlogPostItem,
  PlumeThemePageData,
  PlumeThemePageFrontmatter,
} from '../../shared/index.js'
import { useNavLink, useSidebar, useThemeLocaleData } from '../composables/index.js'
import { resolveEditLink } from '../utils/index.js'

export function useEditNavLink(): ComputedRef<null | NavItemWithLink> {
  const themeLocale = useThemeLocaleData()
  const page = usePageData<PlumeThemePageData>()
  const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()

  return computed(() => {
    const showEditLink
      = frontmatter.value.editLink ?? themeLocale.value.editLink ?? true
    if (!showEditLink)
      return null

    const {
      repo,
      docsRepo = repo,
      docsBranch = 'main',
      docsDir = '',
      editLinkText,
    } = themeLocale.value

    if (!docsRepo)
      return null

    const editLink = resolveEditLink({
      docsRepo,
      docsBranch,
      docsDir,
      filePathRelative: page.value.filePathRelative,
      editLinkPattern:
        frontmatter.value.editLinkPattern ?? themeLocale.value.editLinkPattern,
    })

    if (!editLink)
      return null

    return {
      text: editLinkText ?? 'Edit this page',
      link: editLink,
    }
  })
}

export function useLastUpdated() {
  const theme = useThemeLocaleData()
  const page = usePageData<PlumeThemePageData>()
  const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()
  const lang = usePageLang()

  const date = computed(() => new Date(page.value.git?.updatedTime ?? ''))
  const isoDatetime = computed(() => date.value.toISOString())

  const datetime = ref('')

  const lastUpdatedText = computed(() => {
    if (theme.value.lastUpdated === false)
      return
    return theme.value.lastUpdated?.text || theme.value.lastUpdatedText || 'Last updated'
  })

  onMounted(() => {
    watchEffect(() => {
      if (frontmatter.value.lastUpdated === false || theme.value.lastUpdated === false)
        return

      datetime.value = new Intl.DateTimeFormat(
        theme.value.lastUpdated?.formatOptions?.forceLocale ? lang.value : undefined,
        theme.value.lastUpdated?.formatOptions ?? {
          dateStyle: 'short',
          timeStyle: 'short',
        },
      ).format(date.value)
    })
  })

  return {
    datetime,
    isoDatetime,
    lastUpdatedText,
  }
}

export function useContributors(): ComputedRef<
  null | Required<PlumeThemePageData['git']>['contributors']
> {
  const themeLocale = useThemeLocaleData()
  const page = usePageData<PlumeThemePageData>()
  const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()

  return computed(() => {
    const showContributors
      = frontmatter.value.contributors ?? themeLocale.value.contributors ?? true

    if (!showContributors)
      return null

    return page.value.git?.contributors ?? null
  })
}

/**
 * Resolve `prev` or `next` config from frontmatter
 */
function resolveFromFrontmatterConfig(conf: unknown): null | false | NavItemWithLink {
  if (conf === false)
    return null

  if (isString(conf))
    return useNavLink(conf)

  if (isPlainObject<NavItemWithLink>(conf))
    return conf

  return false
}

function flatSidebar(sidebar: NotesSidebarItem[], res: NavItemWithLink[] = []): NavItemWithLink[] {
  for (const item of sidebar) {
    if (item.link)
      res.push({ link: item.link, text: item.text || item.dir || '' })

    if (Array.isArray(item.items) && item.items.length)
      flatSidebar(item.items as NotesSidebarItem[], res)
  }

  return res
}

/**
 * Resolve `prev` or `next` config from sidebar items
 */
function resolveFromSidebarItems(sidebarItems: NavItemWithLink[], currentPath: string, offset: number): null | NavItemWithLink {
  const index = sidebarItems.findIndex(item => item.link === currentPath)
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

export function usePageNav() {
  const route = useRoute()
  const page = usePageData<PlumeThemePageData>()
  const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()
  const { sidebar } = useSidebar()
  const postList = useBlogPostData() as unknown as Ref<PlumeThemeBlogPostItem[]>
  const locale = usePageLang()

  const prevNavList = computed(() => {
    const prevConfig = resolveFromFrontmatterConfig(frontmatter.value.prev)
    if (prevConfig !== false)
      return prevConfig

    if (page.value.isBlogPost) {
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
    const nextConfig = resolveFromFrontmatterConfig(frontmatter.value.next)
    if (nextConfig !== false)
      return nextConfig

    if (page.value.isBlogPost) {
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
