import { usePageLang } from '@vuepress/client'
import { useBlogPostData } from '@vuepress-plume/plugin-blog-data/client'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { PlumeThemeBlogPostItem } from '../../shared/index.js'
import { useLocaleLink, useThemeLocaleData } from '../composables/index.js'
import { toArray } from '../utils/index.js'

export const usePostListControl = () => {
  const locale = usePageLang()
  const themeData = useThemeLocaleData()

  const list = useBlogPostData() as unknown as Ref<PlumeThemeBlogPostItem[]>
  const blog = computed(() => themeData.value.blog || {})
  const pagination = computed(() => blog.value.pagination || {})

  const postList = computed(() => {
    const stickyList = list.value.filter((item) =>
      typeof item.sticky === 'boolean' ? item.sticky : item.sticky >= 0
    )
    const otherList = list.value.filter(
      (item) => item.sticky === undefined || item.sticky === false
    )

    return [
      ...stickyList.sort((prev, next) => {
        if (next.sticky === true && prev.sticky === true) return 0
        return next.sticky > prev.sticky ? 1 : -1
      }),
      ...otherList,
    ].filter((item) => item.lang === locale.value)
  })

  const page = ref(1)

  const totalPage = computed(() => {
    if (blog.value.pagination === false) return 0
    const perPage = blog.value.pagination?.perPage || 20
    return Math.ceil(postList.value.length / perPage)
  })
  const isLastPage = computed(() => page.value >= totalPage.value)
  const isFirstPage = computed(() => page.value <= 1)
  const isPaginationEnabled = computed(() => blog.value.pagination !== false && totalPage.value > 1)

  const finalList = computed(() => {
    if (blog.value.pagination === false) return postList.value

    const perPage = blog.value.pagination?.perPage || 20
    if (postList.value.length <= perPage) return postList.value

    return postList.value.slice(
      (page.value - 1) * perPage,
      page.value * perPage
    )
  })

  const changePage = (offset: number) => {
    page.value += offset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  return {
    pagination,
    postList: finalList,
    page,
    totalPage,
    isLastPage,
    isFirstPage,
    isPaginationEnabled,
    changePage,
  }
}

const extractLocales: Record<string, { tags: string; archives: string }> = {
  'zh-CN': { tags: '标签', archives: '归档' },
  en: { tags: 'Tags', archives: 'Archives' },
  'zh-TW': { tags: '標籤', archives: '歸檔' },
}

export const useBlogExtract = () => {
  const theme = useThemeLocaleData()
  const locale = usePageLang()

  const hasBlogExtract = computed(() => theme.value.blog?.archives !== false || theme.value.blog?.tags !== false)
  const tagsLink = useLocaleLink('blog/tags/')
  const archiveLink = useLocaleLink('blog/archives/')

  const tags = computed(() => ({
      link: tagsLink.value,
      text: extractLocales[locale.value]?.tags || extractLocales.en.tags,
  }))

  const archives = computed(() => ({
    link: archiveLink.value,
    text: extractLocales[locale.value]?.archives || extractLocales.en.archives,
  }))

  return {
    hasBlogExtract,
    tags,
    archives,
  }
}

export type ShortPostItem = Pick<PlumeThemeBlogPostItem, 'title' | 'path' | 'createTime'>

export const useTags = () => {
  const locale = usePageLang()
  const list = useBlogPostData() as unknown as Ref<PlumeThemeBlogPostItem[]>
  const filteredList = computed(() =>
    list.value.filter((item) => item.lang === locale.value)
  )

  const tags = computed(() => {
    const tagMap: Record<string, number> = {}
    filteredList.value.forEach((item) => {
      if (item.tags) {
        toArray(item.tags).forEach((tag) => {
          if (tagMap[tag]) {
            tagMap[tag] += 1
          } else {
            tagMap[tag] = 1
          }
        })
      }
    })
    return Object.keys(tagMap).map((tag) => ({
      name: tag,
      count: tagMap[tag],
    }))
  })

  const postList = ref<ShortPostItem[]>([])
  const currentTag = ref<string>()

  const handleTagClick = (tag: string) => {
    currentTag.value = tag
    postList.value = filteredList.value.filter((item) => {
      if (item.tags) {
        return toArray(item.tags).includes(tag)
      }
      return false
    }).map((item) => ({
      title: item.title,
      path: item.path,
      createTime: item.createTime.split(' ')[0],
    }))
  }

  return {
    tags,
    currentTag,
    postList,
    handleTagClick
  }
}


export const useArchives = () => {
  const locale = usePageLang()
  const list = useBlogPostData() as unknown as Ref<PlumeThemeBlogPostItem[]>
  const filteredList = computed(() =>
    list.value.filter((item) => item.lang === locale.value)
  )
  const archives = computed(() => {
    const archives: { label: string, list: ShortPostItem[] }[] = []

    filteredList.value.forEach(item => {
      const createTime = item.createTime.split(' ')[0]
      const year = createTime.split('/')[0]
      let current = archives.find(archive => archive.label === year)
      if (!current) {
        current = { label: year, list: [] }
        archives.push(current)
      }
      current.list.push({
        title: item.title,
        path: item.path,
        createTime: createTime.slice(year.length + 1),
      })
    })

    return archives
  })

  return {
    archives
  }
}
