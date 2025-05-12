import type { ComputedRef } from 'vue'
import type { PresetLocale } from '../../shared/index.js'
import { computed } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { useData } from './data.js'
import { useThemeData } from './theme-data.js'

export interface InternalLink {
  text: string
  link: string
}

export function useInternalLink(): {
  home: ComputedRef<InternalLink>
  blog: ComputedRef<InternalLink>
  tags: ComputedRef<InternalLink | undefined>
  archive: ComputedRef<InternalLink | undefined>
  categories: ComputedRef<InternalLink | undefined>
} {
  const { blog, theme } = useData()
  const themeData = useThemeData()
  const routeLocale = useRouteLocale()

  function resolveLink(name: keyof PresetLocale, link: string): InternalLink {
    return {
      link: (routeLocale.value + link).replace(/\/+/g, '/'),
      text: theme.value[`${name}Text`] || themeData.value[`${name}Text`],
    }
  }

  const home = computed(() => resolveLink('home', '/'))
  const blogLink = computed(() => blog.value.postList !== false
    ? resolveLink('blog', blog.value.link || 'blog/')
    : home.value)
  const tags = computed(() => blog.value.tags !== false
    ? resolveLink('tag', blog.value.tagsLink || 'blog/tags/')
    : undefined)
  const archive = computed(() => blog.value.archives !== false
    ? resolveLink('archive', blog.value.archivesLink || 'blog/archives/')
    : undefined)
  const categories = computed(() => blog.value.categories !== false
    ? resolveLink('category', blog.value.categoriesLink || 'blog/categories/')
    : undefined)

  return {
    home,
    blog: blogLink,
    tags,
    archive,
    categories,
  }
}
