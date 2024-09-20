import type { PresetLocale } from '../../shared/index.js'
import { computed } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { useData } from './data.js'
import { getPresetLocaleData } from './preset-locales.js'

export interface InternalLink {
  text: string
  link: string
}

export function useInternalLink() {
  const { theme } = useData()
  const routeLocale = useRouteLocale()

  function resolveLink(name: keyof PresetLocale, link: string): InternalLink {
    return {
      link: (routeLocale.value + link).replace(/\/+/g, '/'),
      text: getPresetLocaleData(routeLocale.value, name),
    }
  }

  const blogData = computed(() => theme.value.blog || {})

  const home = computed(() => resolveLink('home', '/'))
  const blog = computed(() => blogData.value.postList !== false
    ? resolveLink('blog', blogData.value.link || 'blog/')
    : home.value)
  const tags = computed(() => blogData.value.tags !== false
    ? resolveLink('tag', blogData.value.tagsLink || 'blog/tags/')
    : undefined)
  const archive = computed(() => blogData.value.archives !== false
    ? resolveLink('archive', blogData.value.archivesLink || 'blog/archives/')
    : undefined)
  const categories = computed(() => blogData.value.categories !== false
    ? resolveLink('category', blogData.value.categoriesLink || 'blog/categories/')
    : undefined)

  return {
    home,
    blog,
    tags,
    archive,
    categories,
  }
}
