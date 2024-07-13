import { useRouteLocale } from 'vuepress/client'
import { computed } from 'vue'
import type { PresetLocale } from '../../shared/index.js'
import { useLocalePostList } from './blog-data.js'
import { useTags } from './blog-tags.js'
import { type BlogCategory, useBlogCategory } from './blog-category.js'
import { useData } from './data.js'
import { useLocaleLink } from './locale.js'

declare const __PLUME_PRESET_LOCALE__: Record<string, PresetLocale>

const presetLocales = __PLUME_PRESET_LOCALE__

export function useBlogNavTitle(name: keyof PresetLocale) {
  const locale = useRouteLocale()

  return computed(() => presetLocales[locale.value]?.[name] || presetLocales['/'][name])
}

export function useBlogExtract() {
  const { theme } = useData()
  const locale = useRouteLocale()
  const postList = useLocalePostList()
  const { tags: tagsList } = useTags()
  const { categories: categoryList } = useBlogCategory()
  const blog = computed(() => theme.value.blog || {})

  const hasBlogExtract = computed(() =>
    blog.value.archives !== false
    || blog.value.tags !== false
    || blog.value.categories !== false,
  )

  const tagsLink = useLocaleLink(blog.value.tagsLink || 'blog/tags/')
  const archiveLink = useLocaleLink(blog.value.archivesLink || 'blog/archives/')
  const categoriesLink = useLocaleLink(blog.value.categoriesLink || 'blog/categories/')

  const tags = computed(() => ({
    link: tagsLink.value,
    text: presetLocales[locale.value]?.tag || presetLocales['/'].tag,
    total: tagsList.value.length,
  }))

  const archives = computed(() => ({
    link: archiveLink.value,
    text: presetLocales[locale.value]?.archive || presetLocales['/'].archive,
    total: postList.value.length,
  }))

  const categories = computed(() => ({
    link: categoriesLink.value,
    text: presetLocales[locale.value]?.category || presetLocales['/'].category,
    total: getCategoriesTotal(categoryList.value),
  }))

  return {
    hasBlogExtract,
    tags,
    archives,
    categories,
  }
}

function getCategoriesTotal(categories: BlogCategory): number {
  let total = 0
  for (const category of categories) {
    if (category.type === 'category') {
      total += 1
      if (category.items.length) {
        total += getCategoriesTotal(category.items)
      }
    }
  }
  return total
}
