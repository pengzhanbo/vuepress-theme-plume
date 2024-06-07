import { usePageLang } from 'vuepress/client'
import { useBlogPostData } from '@vuepress-plume/plugin-blog-data/client'
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import type { PlumeThemeBlogPostItem } from '../../shared/index.js'
import { useData, useLocaleLink, useRouteQuery } from '../composables/index.js'
import { toArray } from '../utils/index.js'
import { useTagColors } from './tag-colors.js'

const DEFAULT_PER_PAGE = 10

export function useLocalePostList() {
  const locale = usePageLang()
  const list = useBlogPostData()
  return computed(() => list.value.filter(item => item.lang === locale.value))
}

export function usePostListControl() {
  const { theme } = useData()

  const list = useLocalePostList()
  const blog = computed(() => theme.value.blog || {})
  const is960 = useMediaQuery('(max-width: 960px)')

  const postList = computed(() => {
    const stickyList = list.value.filter(item =>
      typeof item.sticky === 'boolean' ? item.sticky : item.sticky >= 0,
    )
    const otherList = list.value.filter(
      item => item.sticky === undefined || item.sticky === false,
    )

    return [
      ...stickyList.sort((prev, next) => {
        if (next.sticky === true && prev.sticky === true)
          return 0
        return next.sticky > prev.sticky ? 1 : -1
      }),
      ...otherList,
    ] as PlumeThemeBlogPostItem[]
  })

  const page = useRouteQuery('p', 1, {
    mode: 'push',
    transform(val) {
      const page = Number(val)
      if (!Number.isNaN(page) && page > 0)
        return page
      return 1
    },
  })

  const totalPage = computed(() => {
    if (blog.value.pagination === false)
      return 0
    const perPage = blog.value.pagination?.perPage || DEFAULT_PER_PAGE
    return Math.ceil(postList.value.length / perPage)
  })
  const isLastPage = computed(() => page.value >= totalPage.value)
  const isFirstPage = computed(() => page.value <= 1)
  const isPaginationEnabled = computed(() => blog.value.pagination !== false && totalPage.value > 1)

  const finalList = computed(() => {
    if (blog.value.pagination === false)
      return postList.value

    const perPage = blog.value.pagination?.perPage || DEFAULT_PER_PAGE
    if (postList.value.length <= perPage)
      return postList.value

    return postList.value.slice(
      (page.value - 1) * perPage,
      page.value * perPage,
    )
  })

  const pageRange = computed(() => {
    let range: { value: number | string, more?: true }[] = []
    const total = totalPage.value
    const _page = page.value
    const per = is960.value ? 4 : 5

    if (total <= 0)
      return range
    if (total <= 10) {
      range = Array.from({ length: total }, (_, i) => ({ value: i + 1 }))
    }
    else {
      let i = 1
      let hasMore = false
      while (i <= total) {
        if ((_page <= per && i <= per) || (_page >= total - (per - 1) && i >= total - (per - 1))) {
          hasMore = false
          range.push({ value: i })
        }
        else if (i <= 2 || i >= total - 1) {
          hasMore = false
          range.push({ value: i })
        }
        else if (
          (_page > per + 1 || _page < total - (per + 1))
          && _page - i < per - 2
          && i - _page < per - 2
        ) {
          hasMore = false
          range.push({ value: i })
        }
        else if (!hasMore) {
          hasMore = true
          range.push({ value: i, more: true })
        }
        i++
      }
    }
    return range
  })

  const changePage = (current: number) => {
    if (page.value === current)
      return
    page.value = current
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  return {
    postList: finalList,
    page,
    totalPage,
    pageRange,
    isLastPage,
    isFirstPage,
    isPaginationEnabled,
    changePage,
  }
}

const extractLocales: Record<string, { tags: string, archives: string }> = {
  'zh-CN': { tags: '标签', archives: '归档' },
  'en': { tags: 'Tags', archives: 'Archives' },
  'zh-TW': { tags: '標籤', archives: '歸檔' },
}

export function useBlogExtract() {
  const { theme } = useData()
  const locale = usePageLang()
  const postList = useLocalePostList()
  const { tags: tagsList } = useTags()
  const blog = computed(() => theme.value.blog || {})

  const hasBlogExtract = computed(() => blog.value.archives !== false || blog.value.tags !== false)
  const tagsLink = useLocaleLink(blog.value.tagsLink || 'blog/tags/')
  const archiveLink = useLocaleLink(blog.value.archivesLink || 'blog/archives/')

  const tags = computed(() => ({
    link: tagsLink.value,
    text: extractLocales[locale.value]?.tags || extractLocales.en.tags,
    total: tagsList.value.length,
  }))

  const archives = computed(() => ({
    link: archiveLink.value,
    text: extractLocales[locale.value]?.archives || extractLocales.en.archives,
    total: postList.value.length,
  }))

  return {
    hasBlogExtract,
    tags,
    archives,
  }
}

export type ShortPostItem = Pick<PlumeThemeBlogPostItem, 'title' | 'path' | 'createTime'>

export function useTags() {
  const list = useLocalePostList()

  const colors = useTagColors()

  const tags = computed(() => {
    const tagMap: Record<string, number> = {}
    list.value.forEach((item) => {
      if (item.tags) {
        toArray(item.tags).forEach((tag) => {
          if (tagMap[tag])
            tagMap[tag] += 1
          else
            tagMap[tag] = 1
        })
      }
    })
    return Object.keys(tagMap).map(tag => ({
      name: tag,
      count: tagMap[tag] > 99 ? '99+' : tagMap[tag],
      className: `vp-tag-${colors.value[tag]}`,
    }))
  })

  const currentTag = useRouteQuery<string>('tag')

  const postList = computed<ShortPostItem[]>(() => {
    if (!currentTag.value)
      return []

    return list.value.filter((item) => {
      if (item.tags)
        return toArray(item.tags).includes(currentTag.value)

      return false
    }).map(item => ({
      title: item.title,
      path: item.path,
      createTime: item.createTime.split(' ')[0].replace(/\//g, '-'),
    }))
  })

  const handleTagClick = (tag: string) => {
    currentTag.value = tag
  }

  return {
    tags,
    currentTag,
    postList,
    handleTagClick,
  }
}

export function useArchives() {
  const list = useLocalePostList()
  const archives = computed(() => {
    const archives: { label: string, list: ShortPostItem[] }[] = []

    list.value.forEach((item) => {
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
        createTime: createTime.slice(year.length + 1).replace(/\//g, '-'),
      })
    })

    return archives
  })

  return { archives }
}
