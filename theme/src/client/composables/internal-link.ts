import { computed } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import type { PresetLocale } from '../../shared/index.js'
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
  const blog = computed(() => resolveLink('blog', blogData.value.link || 'blog/'))
  const tags = computed(() => resolveLink('tag', blogData.value.tagsLink || 'blog/tags/'))
  const archive = computed(() => resolveLink('archive', blogData.value.archivesLink || 'blog/archives/'))
  const categories = computed(() => resolveLink('category', blogData.value.categoriesLink || 'blog/categories/'))

  return {
    home,
    blog,
    tags,
    archive,
    categories,
  }
}
