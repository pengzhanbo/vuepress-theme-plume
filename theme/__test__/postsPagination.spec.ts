import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

/**
 * `usePostListControl` composes several client modules that rely on the virtual
 * `@internal/*` modules and the router. They are all replaced with plain objects here,
 * so the pagination logic can be exercised without a Vue app or a real route.
 *
 * `usePostListControl` 依赖多个客户端模块（虚拟模块、路由等），这里全部替换为普通对象，
 * 从而无需 Vue 应用或真实路由即可测试分页逻辑。
 */
const hoisted = vi.hoisted(() => ({
  collection: { value: undefined as any },
  is960: { value: false },
  list: { value: [] as Array<{ title: string }> },
  /** 被 mock 的 route query ref，`changePage` 的写入可以直接观察。 */
  routePage: { value: 1 },
  /** 由 `usePostListControl` 传给 `useRouteQuery` 的 transform，单独取出以测试边界输入。 */
  transform: undefined as undefined | ((val: unknown) => number),
  rawQuery: 1 as unknown,
}))

vi.mock('../src/client/composables/data.js', () => ({
  useData: () => ({ collection: hoisted.collection }),
}))

vi.mock('../src/client/composables/layout.js', () => ({
  useLayout: () => ({ is960: hoisted.is960 }),
}))

vi.mock('../src/client/composables/posts-data.js', () => ({
  useLocalePostList: () => hoisted.list,
}))

vi.mock('../src/client/composables/route-query.js', () => ({
  useRouteQuery: (_name: string, _defaultValue: unknown, options: any) => {
    const transform = options?.transform ?? ((val: unknown) => val)
    hoisted.transform = transform
    hoisted.routePage.value = transform(hoisted.rawQuery)
    return hoisted.routePage
  },
}))

const { usePostListControl } = await import('../src/client/composables/posts-post-list.js')

interface SetupOptions {
  pagination?: unknown
  posts?: number
  /** 原始 `?p=` 值，经过 transform 后写入 route query。 */
  raw?: unknown
  is960?: boolean
}

function setup(options: SetupOptions = {}) {
  hoisted.collection.value = { type: 'post', pagination: options.pagination }
  hoisted.list.value = Array.from({ length: options.posts ?? 0 }, (_, index) => ({ title: `post-${index}` }))
  hoisted.rawQuery = options.raw ?? 1
  hoisted.is960.value = options.is960 ?? false

  return usePostListControl(ref(false))
}

beforeEach(() => {
  vi.useFakeTimers()
  // `changePage` 会调度一个回到列表顶部的定时器；假定时器下不会执行，
  // 但提前准备好 `window` 可以避免真实执行时抛错。
  vi.stubGlobal('window', { scrollY: 0, scrollTo: vi.fn() })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('route page transform', () => {
  it('should only accept positive integers', () => {
    setup()
    const transform = hoisted.transform!

    expect(transform('3')).toBe(3)
    expect(transform('1e9')).toBe(1_000_000_000)

    // 非数字、空串、0、负数、小数、Infinity 全部回退到第 1 页。
    expect(transform('abc')).toBe(1)
    expect(transform('')).toBe(1)
    expect(transform('0')).toBe(1)
    expect(transform('-1')).toBe(1)
    expect(transform('1.5')).toBe(1)
    expect(transform('Infinity')).toBe(1)
    expect(transform(undefined)).toBe(1)
  })
})

describe('usePostListControl pagination', () => {
  it('should fall back to the default page size for invalid values', () => {
    const cases: unknown[] = [undefined, 0, -5, Number.NaN, Number.POSITIVE_INFINITY, { perPage: 0 }, { perPage: -1 }]

    for (const pagination of cases) {
      const { totalPage } = setup({ pagination, posts: 40 })
      // 默认每页 15 条，40 条文章 → 3 页；无效值不能让 `totalPage` 变成 Infinity。
      expect({ pagination, totalPage: totalPage.value }).toEqual({ pagination, totalPage: 3 })
    }
  })

  it('should page the list with a numeric page size', () => {
    const { totalPage, postList, page } = setup({ pagination: 2, posts: 40, raw: '1' })

    expect(totalPage.value).toBe(20)
    expect(page.value).toBe(1)
    expect(postList.value.map(post => post.title)).toEqual(['post-0', 'post-1'])
  })

  it('should disable pagination when `pagination: false`', () => {
    const { totalPage, postList, isPaginationEnabled, page } = setup({ pagination: false, posts: 40 })

    expect(totalPage.value).toBe(0)
    expect(isPaginationEnabled.value).toBe(false)
    expect(page.value).toBe(1)
    // 关闭分页后返回完整列表。
    expect(postList.value).toHaveLength(40)
  })

  it('should return the full list when it fits in a single page', () => {
    const { totalPage, postList, isPaginationEnabled, isFirstPage, isLastPage } = setup({ posts: 3 })

    expect(totalPage.value).toBe(1)
    expect(isPaginationEnabled.value).toBe(false)
    expect(isFirstPage.value).toBe(true)
    expect(isLastPage.value).toBe(true)
    expect(postList.value).toHaveLength(3)
  })

  it('should clamp an out-of-range page into `[1, totalPage]`', () => {
    const oversized = setup({ pagination: 15, posts: 20, raw: '9999' })

    expect(oversized.totalPage.value).toBe(2)
    expect(oversized.page.value).toBe(2)
    // 越界页码被钳制到最后一页，而不是渲染空列表。
    expect(oversized.postList.value.map(post => post.title)).toEqual([
      'post-15',
      'post-16',
      'post-17',
      'post-18',
      'post-19',
    ])

    const huge = setup({ pagination: 15, posts: 20, raw: '1e9' })
    expect(huge.page.value).toBe(2)

    // 空列表时 `totalPage` 为 0，页码仍必须收敛到 1。
    const empty = setup({ pagination: 15, posts: 0, raw: '5' })
    expect(empty.totalPage.value).toBe(0)
    expect(empty.page.value).toBe(1)
  })

  it('should slice the list for the requested page', () => {
    const second = setup({ pagination: 2, posts: 5, raw: '2' })
    expect(second.postList.value.map(post => post.title)).toEqual(['post-2', 'post-3'])

    const last = setup({ pagination: 2, posts: 5, raw: '3' })
    expect(last.page.value).toBe(3)
    expect(last.postList.value.map(post => post.title)).toEqual(['post-4'])
  })

  it('should expose the first / last page state', () => {
    const first = setup({ pagination: 15, posts: 20, raw: '1' })
    expect(first.isFirstPage.value).toBe(true)
    expect(first.isLastPage.value).toBe(false)

    const last = setup({ pagination: 15, posts: 20, raw: '2' })
    expect(last.isFirstPage.value).toBe(false)
    expect(last.isLastPage.value).toBe(true)
  })

  it('should list every page number when there are at most 10 pages', () => {
    const { pageRange } = setup({ pagination: 2, posts: 20 })

    expect(pageRange.value).toEqual(
      Array.from({ length: 10 }, (_, index) => ({ value: index + 1 })),
    )
  })

  it('should collapse the middle pages with a `more` marker on wide screens', () => {
    const wide = setup({ posts: 20, pagination: 1, raw: '1' })

    // 20 页、宽屏（per = 5）：首尾各 5 页 + 中间省略标记。
    expect(wide.pageRange.value).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6, more: true },
      { value: 19 },
      { value: 20 },
    ])
  })

  it('should use a narrower page window on small screens', () => {
    const narrow = setup({ posts: 20, pagination: 1, raw: '1', is960: true })

    // 窄屏（per = 4）。
    expect(narrow.pageRange.value).toEqual([
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5, more: true },
      { value: 19 },
      { value: 20 },
    ])
  })

  it('should update the route query when changing page', () => {
    const { changePage } = setup({ pagination: 15, posts: 40, raw: '1' })

    changePage(2)
    expect(hoisted.routePage.value).toBe(2)

    // 重复写入同一页码是空操作。
    changePage(2)
    expect(hoisted.routePage.value).toBe(2)
  })
})
