import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

/**
 * `usePostListControl` composes data / layout / route-query / post-list composables.
 * All of them are stubbed with plain ref-like objects so the pagination logic can be
 * exercised without a router or a DOM.
 *
 * `usePostListControl` 组合了数据 / 布局 / 路由查询 / 文章列表等 composable。
 * 这里以简单的 ref 形态桩替换它们，从而在没有路由与 DOM 的情况下测试分页逻辑。
 */
const hoisted = vi.hoisted(() => ({
  collection: { value: undefined as any },
  list: { value: [] as any[] },
  is960: false,
  routePage: { value: 1 },
}))

vi.mock('../src/client/composables/data.js', () => ({
  useData: () => ({ collection: hoisted.collection }),
}))
vi.mock('../src/client/composables/posts-data.js', () => ({
  useLocalePostList: () => hoisted.list,
}))
vi.mock('../src/client/composables/layout.js', () => ({
  useLayout: () => ({ is960: { value: hoisted.is960 } }),
}))
vi.mock('../src/client/composables/route-query.js', () => ({
  useRouteQuery: () => hoisted.routePage,
}))

const { usePostListControl } = await import('../src/client/composables/posts-post-list.js')

/** Create `count` posts, the first `sticky` of which are sticky. */
function createPosts(count: number, sticky = 0) {
  return Array.from({ length: count }, (_, index) => ({
    title: `post-${index}`,
    sticky: index < sticky ? true : undefined,
  }))
}

function setup(overrides: { collection?: any, list?: any[], is960?: boolean, page?: number } = {}) {
  hoisted.collection = { value: overrides.collection }
  hoisted.list = { value: overrides.list ?? [] }
  hoisted.is960 = overrides.is960 ?? false
  hoisted.routePage = { value: overrides.page ?? 1 }
}

const postCollection = (pagination?: any) => ({ type: 'post', pagination })

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('usePostListControl: pagination', () => {
  it('slices the list into pages', () => {
    setup({ collection: postCollection(2), list: createPosts(5) })
    const control = usePostListControl(ref(false))

    expect(control.totalPage.value).toBe(3)
    expect(control.page.value).toBe(1)
    expect(control.postList.value.map(post => post.title)).toEqual(['post-0', 'post-1'])
    expect(control.isPaginationEnabled.value).toBe(true)
    expect(control.isFirstPage.value).toBe(true)
    expect(control.isLastPage.value).toBe(false)
  })

  it('clamps an out-of-range page into the valid range', () => {
    setup({ collection: postCollection(2), list: createPosts(5), page: 99 })
    const control = usePostListControl(ref(false))

    expect(control.page.value).toBe(3)
    expect(control.postList.value.map(post => post.title)).toEqual(['post-4'])
    expect(control.isLastPage.value).toBe(true)
    expect(control.isFirstPage.value).toBe(false)
  })

  it('clamps a non-positive page to the first page', () => {
    setup({ collection: postCollection(2), list: createPosts(5), page: 0 })
    const control = usePostListControl(ref(false))

    expect(control.page.value).toBe(1)
  })

  it('returns the whole list when pagination is disabled', () => {
    setup({ collection: postCollection(false), list: createPosts(5) })
    const control = usePostListControl(ref(false))

    expect(control.totalPage.value).toBe(0)
    expect(control.postList.value).toHaveLength(5)
    expect(control.isPaginationEnabled.value).toBe(false)
    // 说明：`perPage` 中 `pagination === false → 0` 的分支无法触达，
    // `totalPage` 与 `finalList` 都会先短路返回，不会读取 `perPage`。
  })

  it('supports a per-page object and falls back for invalid values', () => {
    setup({ collection: postCollection({ perPage: 3 }), list: createPosts(6) })
    expect(usePostListControl(ref(false)).totalPage.value).toBe(2)

    // 非正数每页条数回退到默认值 15。
    setup({ collection: postCollection(0), list: createPosts(6) })
    expect(usePostListControl(ref(false)).totalPage.value).toBe(1)
  })

  it('uses the default page size when the collection is not a post collection', () => {
    setup({ list: createPosts(20) })
    const control = usePostListControl(ref(false))

    expect(control.totalPage.value).toBe(2)
    expect(control.postList.value).toHaveLength(15)
  })

  it('pins sticky posts to the first page', () => {
    setup({ collection: postCollection(2), list: createPosts(5, 2) })
    const control = usePostListControl(ref(false))

    expect(control.postList.value.map(post => post.title)).toEqual(['post-0', 'post-1'])
  })
})

describe('usePostListControl: page range', () => {
  it('lists every page when there are at most 10', () => {
    setup({ collection: postCollection(1), list: createPosts(3) })

    expect(usePostListControl(ref(false)).pageRange.value).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ])
  })

  it('collapses the middle pages into a `more` marker', () => {
    setup({ collection: postCollection(1), list: createPosts(11) })
    const range = usePostListControl(ref(false)).pageRange.value

    expect(range.slice(0, 5)).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ])
    expect(range).toContainEqual({ value: 6, more: true })
    expect(range.slice(-2)).toEqual([{ value: 10 }, { value: 11 }])
  })

  it('shows a window of pages around a middle page', () => {
    setup({ collection: postCollection(1), list: createPosts(20), page: 10 })
    const range = usePostListControl(ref(false)).pageRange.value

    // 首尾页始终可见，当前页附近的连续页码也会展开。
    expect(range[0]).toEqual({ value: 1 })
    expect(range).toContainEqual({ value: 9 })
    expect(range).toContainEqual({ value: 10 })
    expect(range).toContainEqual({ value: 11 })
    expect(range.at(-1)).toEqual({ value: 20 })
    expect(range.some(item => item.more)).toBe(true)
  })

  it('returns an empty range without pages', () => {
    setup({ collection: postCollection(false), list: createPosts(3) })

    expect(usePostListControl(ref(false)).pageRange.value).toEqual([])
  })

  it('shows fewer pages on narrow screens', () => {
    setup({ collection: postCollection(1), list: createPosts(11), is960: true })
    const range = usePostListControl(ref(false)).pageRange.value

    // is960 时 per = 4，前面的连续页码更少。
    expect(range).toContainEqual({ value: 5, more: true })
  })
})

describe('usePostListControl: changePage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('window', { scrollY: 0, scrollTo: vi.fn() })
    vi.stubGlobal('document', { querySelector: () => null })
  })

  it('updates the route query and scrolls to the list top', () => {
    setup({ collection: postCollection(2), list: createPosts(5) })
    const control = usePostListControl(ref(true))

    control.changePage(2)
    vi.advanceTimersByTime(1)

    expect(hoisted.routePage.value).toBe(2)
    // homePage 为 true 且找不到列表容器时，滚动到 0。
    expect((globalThis as any).window.scrollTo).toHaveBeenCalledWith({ top: -64, behavior: 'instant' })
  })

  it('does not scroll when the page does not change', () => {
    setup({ collection: postCollection(2), list: createPosts(5), page: 2 })
    const control = usePostListControl(ref(false))

    control.changePage(2)
    vi.advanceTimersByTime(1)

    expect((globalThis as any).window.scrollTo).not.toHaveBeenCalled()
  })
})
