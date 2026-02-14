import type { ComputedRef, Ref } from 'vue'
import type { ThemePostsItem } from '../../shared/index.js'
import { computed } from 'vue'
import { useData } from './data.js'
import { useLayout } from './layout.js'
import { useLocalePostList } from './posts-data.js'
import { useRouteQuery } from './route-query.js'

const DEFAULT_PER_PAGE = 15

/**
 * Use post list control result
 *
 * 文章列表控制结果类型，包含分页相关的数据和方法
 */
interface UsePostListControlResult {
  postList: ComputedRef<ThemePostsItem[]>
  page: Ref<number>
  totalPage: ComputedRef<number>
  pageRange: ComputedRef<{
    value: number | string
    more?: true
  }[]>
  isLastPage: ComputedRef<boolean>
  isFirstPage: ComputedRef<boolean>
  isPaginationEnabled: ComputedRef<boolean>
  changePage: (page: number) => void
}

/**
 * Use post list control
 *
 * 文章列表控制，管理分页逻辑和文章列表数据
 */
export function usePostListControl(homePage: Ref<boolean>): UsePostListControlResult {
  const { collection } = useData<'page', 'post'>()

  const list = useLocalePostList()
  const { is960 } = useLayout()

  const postCollection = computed(() => {
    if (collection.value?.type === 'post')
      return collection.value
    return undefined
  })

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
    ] as ThemePostsItem[]
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
    if (postCollection.value?.pagination === false)
      return 0
    if (typeof postCollection.value?.pagination === 'number')
      return postCollection.value.pagination
    return postCollection.value?.pagination?.perPage || DEFAULT_PER_PAGE
  })

  const totalPage = computed(() => {
    if (postCollection.value?.pagination === false)
      return 0
    return Math.ceil(postList.value.length / perPage.value)
  })
  const isLastPage = computed(() => page.value >= totalPage.value)
  const isFirstPage = computed(() => page.value <= 1)
  const isPaginationEnabled = computed(() => postCollection.value?.pagination !== false && totalPage.value > 1)

  const finalList = computed(() => {
    if (postCollection.value?.pagination === false)
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

  const changePage = (current: number): void => {
    if (page.value === current)
      return
    page.value = current
    setTimeout(() => {
      let top = 0
      if (homePage.value) {
        top = document.querySelector('.vp-posts')?.getBoundingClientRect().top || 0
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
