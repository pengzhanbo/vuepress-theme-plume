import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { removeEndingSlash, removeLeadingSlash } from 'vuepress/shared'
import { normalizeLink } from '../utils/resolveNavLink.js'
import { useData } from './data.js'
import { useThemeData } from './theme-data.js'

export interface InternalLink {
  text: string
  link: string
}

export function useInternalLink(): {
  home: ComputedRef<InternalLink>
  posts: ComputedRef<InternalLink | undefined>
  tags: ComputedRef<InternalLink | undefined>
  archive: ComputedRef<InternalLink | undefined>
  categories: ComputedRef<InternalLink | undefined>
} {
  const { collection, theme } = useData<'page', 'post'>()
  const themeData = useThemeData()
  const routeLocale = useRouteLocale()

  const postCollection = computed(() => collection.value?.type === 'post' ? collection.value : undefined)

  const home = computed(() => ({
    link: normalizeLink(routeLocale.value),
    text: theme.value.homeText || themeData.value.homeText || 'Home',
  }))

  const postsLink = computed(() => normalizeLink(
    routeLocale.value,
    removeLeadingSlash(postCollection.value?.link || postCollection.value?.dir || 'posts/'),
  ))

  const posts = computed(() => postCollection.value?.postList !== false
    ? {
        text: postCollection.value?.title
          || removeEndingSlash(postCollection.value?.dir || '').split('/').pop()
          || theme.value.postsText!,
        link: postsLink.value,
      }
    : undefined)

  const tags = computed(() => postCollection.value?.tags !== false
    ? {
        text: postCollection.value?.tagsText || theme.value.tagText || themeData.value.tagText || 'Tags',
        link: postCollection.value?.tagsLink ? normalizeLink(routeLocale.value, postCollection.value?.tagsLink) : normalizeLink(postsLink.value, 'tags/'),
      }
    : undefined)

  const archive = computed(() => postCollection.value?.archives !== false
    ? {
        text: postCollection.value?.archivesText || theme.value.archiveText || themeData.value.archiveText || 'Archives',
        link: postCollection.value?.archivesLink ? normalizeLink(routeLocale.value, postCollection.value?.archivesLink) : normalizeLink(postsLink.value, 'archives/'),
      }
    : undefined)
  const categories = computed(() => postCollection.value?.categories !== false
    ? {
        text: postCollection.value?.categoriesText || theme.value.categoryText || themeData.value.categoryText || 'Categories',
        link: postCollection.value?.categoriesLink ? normalizeLink(routeLocale.value, postCollection.value?.categoriesLink) : normalizeLink(postsLink.value, 'categories/'),
      }
    : undefined)

  return {
    home,
    posts,
    tags,
    archive,
    categories,
  }
}
