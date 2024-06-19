import { useRouteLocale } from 'vuepress/client'
import { computed } from 'vue'
import type { PresetLocale } from '../../shared/index.js'
import { useLocalePostList } from './blog-post-list.js'
import { useTags } from './blog-tags.js'
import { useData } from './data.js'
import { useLocaleLink } from './locale.js'

declare const __PLUME_PRESET_LOCALE__: Record<string, PresetLocale>

const presetLocales = __PLUME_PRESET_LOCALE__

export function useBlogExtract() {
  const { theme } = useData()
  const locale = useRouteLocale()
  const postList = useLocalePostList()
  const { tags: tagsList } = useTags()
  const blog = computed(() => theme.value.blog || {})

  const hasBlogExtract = computed(() => blog.value.archives !== false || blog.value.tags !== false)
  const tagsLink = useLocaleLink(blog.value.tagsLink || 'blog/tags/')
  const archiveLink = useLocaleLink(blog.value.archivesLink || 'blog/archives/')

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

  return {
    hasBlogExtract,
    tags,
    archives,
  }
}
