import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `outline.ts` 的滚动热路径依赖缓存后的标题位置。这里替换掉它的浏览器/应用依赖，
 * 只验证测量缓存的行为：页面高度不变时不应重复测量。
 *
 * The scroll hot path of `outline.ts` relies on cached header positions. Its
 * browser / app dependencies are replaced here so the measurement cache can be
 * verified in isolation: the tops must not be re-measured while the page height
 * is unchanged.
 */
const hoisted = vi.hoisted(() => ({
  getAbsoluteTop: vi.fn((element: { __top?: number }) => element.__top ?? Number.NaN),
}))

vi.mock('vuepress/client', () => ({
  onContentUpdated: vi.fn(),
  useRouter: () => ({
    currentRoute: { value: { path: '/', query: {}, hash: '' } },
    options: {},
    replace: vi.fn(),
  }),
}))

vi.mock('../src/client/composables/data.js', () => ({
  useData: () => ({ frontmatter: { value: {} }, theme: { value: {} } }),
}))

vi.mock('../src/client/composables/layout.js', () => ({
  useLayout: () => ({ isAsideEnabled: { value: true } }),
}))

vi.mock('../src/client/utils/index.js', () => ({
  getAbsoluteTop: hoisted.getAbsoluteTop,
}))

const { getHeaderTops, invalidateHeaderTops, measureHeaderTops, resolveHeaders } = await import(
  '../src/client/composables/outline.js',
)

/** 构造一个伪标题元素，`__top` 会被 mock 的 `getAbsoluteTop` 直接读取。 */
function createHeader(link: string, top: number) {
  return { link, element: { __top: top } }
}

/** 构造 `resolveHeaders` 需要的菜单项。 */
function createItem(link: string, top: number) {
  return { ...createHeader(link, top), title: link, level: 2, lowLevel: undefined } as any
}

let body: { offsetHeight: number }

beforeEach(() => {
  body = { offsetHeight: 1000 }
  vi.stubGlobal('document', { body })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
  invalidateHeaderTops()
})

describe('header tops cache', () => {
  it('measures the tops and sorts them by position', () => {
    resolveHeaders([createItem('#b', 300), createItem('#a', 100)], 2)

    expect(getHeaderTops().map(item => item.link)).toEqual(['#a', '#b'])
  })

  it('does not re-measure while the page height stays the same', () => {
    resolveHeaders([createItem('#a', 100)], 2)

    getHeaderTops()
    const callsAfterFirstMeasure = hoisted.getAbsoluteTop.mock.calls.length

    // 多次滚动读取不应触发新的测量。
    // Repeated scroll reads must not trigger new measurements.
    getHeaderTops(body.offsetHeight)
    getHeaderTops(body.offsetHeight)
    getHeaderTops(body.offsetHeight)

    expect(hoisted.getAbsoluteTop.mock.calls.length).toBe(callsAfterFirstMeasure)
  })

  it('re-measures when the page height changes', () => {
    resolveHeaders([createItem('#a', 100)], 2)

    getHeaderTops()
    const callsAfterFirstMeasure = hoisted.getAbsoluteTop.mock.calls.length

    // 图片/字体加载导致页面高度变化后应重新测量。
    // A page-height change (e.g. images / fonts loaded) must re-measure.
    getHeaderTops(body.offsetHeight + 1)

    expect(hoisted.getAbsoluteTop.mock.calls.length).toBeGreaterThan(callsAfterFirstMeasure)
  })

  it('re-measures after the cache is invalidated', () => {
    resolveHeaders([createItem('#a', 100)], 2)

    measureHeaderTops()
    const callsAfterFirstMeasure = hoisted.getAbsoluteTop.mock.calls.length

    invalidateHeaderTops()
    getHeaderTops(body.offsetHeight)

    expect(hoisted.getAbsoluteTop.mock.calls.length).toBeGreaterThan(callsAfterFirstMeasure)
  })

  it('drops headers whose position cannot be resolved', () => {
    // 测量结果为 `NaN` 的标题会被过滤掉。
    // Headers whose measurement is `NaN` are filtered out.
    const broken = { link: '#broken', element: {} }

    resolveHeaders([createItem('#a', 100), { ...broken, title: 'broken', level: 2 } as any], 2)

    expect(getHeaderTops().map(item => item.link)).toEqual(['#a'])
  })
})
