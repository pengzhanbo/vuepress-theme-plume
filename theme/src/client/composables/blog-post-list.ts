import type { PlumeThemeBlogPostItem } from '../../shared/index.js'
import { useMediaQuery } from '@vueuse/core'
import { computed, type Ref } from 'vue'
import { useLocalePostList } from './blog-data.js'
import { useData } from './data.js'
import { useRouteQuery } from './route-query.js'

const DEFAULT_PER_PAGE = 15

export function usePostListControl(homePage: Ref<boolean>) {
  const { blog } = useData()

  const list = useLocalePostList()
  const is960 = useMediaQuery('(max-width: 960px)')

  const postList = computed(() => {
    const stickyList = list.value.filter(item =>
      item.sticky === true || typeof item.sticky === 'number',
    )
    const otherList = list.value.filter(
      item => item.sticky === undefined || item.sticky === false,
    )

    return [
      ...stickyList.sort((prev, next) => {
        if (next.sticky === true && prev.sticky === true)
          return 0
        return next.sticky! > prev.sticky! ? 1 : -1
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

  const perPage = computed(() => {
    if (blog.value.pagination === false)
      return 0
    if (typeof blog.value.pagination === 'number')
      return blog.value.pagination
    return blog.value.pagination?.perPage || DEFAULT_PER_PAGE
  })

  const totalPage = computed(() => {
    if (blog.value.pagination === false)
      return 0
    return Math.ceil(postList.value.length / perPage.value)
  })
  const isLastPage = computed(() => page.value >= totalPage.value)
  const isFirstPage = computed(() => page.value <= 1)
  const isPaginationEnabled = computed(() => blog.value.pagination !== false && totalPage.value > 1)

  const finalList = computed(() => {
    if (blog.value.pagination === false)
      return postList.value

    if (postList.value.length <= perPage.value)
      return postList.value

    return postList.value.slice(
      (page.value - 1) * perPage.value,
      page.value * perPage.value,
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
    setTimeout(() => {
      let top = 0
      if (homePage.value) {
        top = document.querySelector('.vp-blog')?.getBoundingClientRect().top || 0
        top += window.scrollY - 64
      }

      window.scrollTo({ top, behavior: 'instant' })
    }, 0)
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
