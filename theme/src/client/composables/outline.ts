import type { Ref } from 'vue'
import type { Router } from 'vuepress/client'
import type { ThemeOutline } from '../../shared/index.js'
import { useThrottleFn, watchDebounced } from '@vueuse/core'
import { onMounted, onUnmounted, onUpdated, ref } from 'vue'
import { onContentUpdated, useRouter } from 'vuepress/client'
import { useData } from './data.js'
import { useLayout } from './layout.js'

/**
 * Header interface representing a page heading
 *
 * Header 接口表示页面标题
 */
export interface Header {
  /**
   * The level of the header
   * `1` to `6` for `<h1>` to `<h6>`
   *
   * 标题级别
   * `1` 到 `6` 对应 `<h1>` 到 `<h6>`
   */
  level: number
  /**
   * The title of the header
   *
   * 标题文本
   */
  title: string
  /**
   * The slug of the header
   * Typically the `id` attr of the header anchor
   *
   * 标题的 slug
   * 通常是标题锚点的 `id` 属性
   */
  slug: string
  /**
   * Link of the header
   * Typically using `#${slug}` as the anchor hash
   *
   * 标题链接
   * 通常使用 `#${slug}` 作为锚点哈希
   */
  link: string
  /**
   * The children of the header
   *
   * 子标题
   */
  children: Header[]
}

// cached list of anchor elements from resolveHeaders
// 从 resolveHeaders 缓存的锚点元素列表
const resolvedHeaders: { element: HTMLHeadElement, link: string }[] = []

/**
 * Menu item type for outline navigation
 * Extends Header with element reference and additional properties
 *
 * 目录导航的菜单项类型
 * 扩展 Header 并添加元素引用和额外属性
 */
export type MenuItem = Omit<Header, 'slug' | 'children'> & {
  /** Reference to the DOM element / DOM 元素引用 */
  element: HTMLHeadElement
  /** Child menu items / 子菜单项 */
  children?: MenuItem[]
  /** Lowest level for outline display / 目录显示的最低级别 */
  lowLevel?: number
}

const headers = ref<MenuItem[]>([])

/**
 * Setup headers for the current page
 * Initializes header extraction based on frontmatter and theme configuration
 *
 * 为当前页面设置标题
 * 根据 frontmatter 和主题配置初始化标题提取
 *
 * @returns Reference to the headers array / 标题数组的引用
 */
export function setupHeaders(): Ref<MenuItem[]> {
  const { frontmatter, theme } = useData()

  onContentUpdated(() => {
    headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline)
  })

  return headers
}

/**
 * Use headers
 * Returns the reactive headers reference for the current page
 *
 * 获取当前页面的标题列表
 *
 * @returns Reactive reference to menu items / 菜单项的响应式引用
 */
export function useHeaders(): Ref<MenuItem[]> {
  return headers
}

/**
 * Get headers from the page content
 * Extracts and filters headings based on the outline configuration
 *
 * 从页面内容获取标题
 * 根据目录配置提取和过滤标题
 *
 * @param range - Outline configuration for header levels / 标题级别的目录配置
 * @returns Array of menu items representing headers / 表示标题的菜单项数组
 */
export function getHeaders(range?: ThemeOutline): MenuItem[] {
  const heading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  const ignores = Array.from(document.querySelectorAll(
    heading.map(h => `.vp-demo-wrapper ${h}`).join(','),
  ))
  const headers = Array.from(
    document.querySelectorAll(heading.map(h => `.vp-doc ${h}`).join(',')),
  )
    .filter(el => !ignores.includes(el) && el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1])
      return {
        element: el as HTMLHeadElement,
        title: serializeHeader(el),
        link: `#${el.id}`,
        level,
        lowLevel: getLowLevel(el as HTMLHeadElement, level),
      }
    })
  if (range === false)
    return []

  const [high, low] = getRange(range)
  return resolveSubRangeHeader(resolveHeaders(headers, high), low)
}

/**
 * Get the header level range from outline configuration
 *
 * 从目录配置获取标题级别范围
 *
 * @param range - Outline configuration / 目录配置
 * @returns Tuple of [high, low] levels / [高, 低] 级别元组
 */
function getRange(range?: Exclude<ThemeOutline, boolean>): readonly [number, number] {
  const levelsRange = range || 2
  // [high, low]
  return typeof levelsRange === 'number'
    ? [levelsRange, levelsRange]
    : levelsRange === 'deep'
      ? [2, 6]
      : levelsRange
}

/**
 * Get the lowest outline level for a specific header
 * Checks for data-outline or outline attributes
 *
 * 获取特定标题的最低目录级别
 * 检查 data-outline 或 outline 属性
 *
 * @param el - Header element / 标题元素
 * @param level - Current header level / 当前标题级别
 * @returns Lowest level or undefined / 最低级别或未定义
 */
function getLowLevel(el: HTMLHeadElement, level: number): number | undefined {
  if (!el.hasAttribute('data-outline') && !el.hasAttribute('outline'))
    return

  // only support
  // data-outline="3"      -> star, end -> [level, 3]
  const str = (el.getAttribute('data-outline') || el.getAttribute('outline'))?.trim()
  if (!str)
    return

  const num = Number(str)
  if (!Number.isNaN(num) && num >= level)
    return num

  return undefined
}

/**
 * Serialize a header element to text
 * Extracts text content while ignoring badges and ignored elements
 *
 * 将标题元素序列化为文本
 * 提取文本内容，同时忽略徽章和被忽略的元素
 *
 * @param h - Header element / 标题元素
 * @returns Serialized header text / 序列化的标题文本
 */
function serializeHeader(h: Element): string {
  // <hx><a href="#"><span>title</span></a></hx>
  const anchor = h.firstChild
  const el = anchor?.firstChild
  let ret = ''
  for (const node of Array.from(el?.childNodes ?? [])) {
    if (node.nodeType === 1) {
      if (
        (node as Element).classList.contains('vp-badge')
        || (node as Element).classList.contains('ignore-header')
      ) {
        continue
      }
      const clone = node.cloneNode(true)
      clearHeaderNodeList(Array.from(clone.childNodes))
      ret += clone.textContent
    }
    else if (node.nodeType === 3) {
      ret += node.textContent
    }
  }
  // maybe `<hx><a href="#"></a><a href="xxx"></a></hx>` or more
  let next = anchor?.nextSibling
  while (next) {
    if (next.nodeType === 1 || next.nodeType === 3)
      ret += next.textContent

    next = next.nextSibling
  }
  return ret.trim()
}

/**
 * Clear ignored nodes from a list of child nodes
 * Recursively removes elements with 'ignore-header' class
 *
 * 从子节点列表中清除被忽略的节点
 * 递归移除带有 'ignore-header' 类的元素
 *
 * @param list - Array of child nodes / 子节点数组
 */
function clearHeaderNodeList(list?: ChildNode[]) {
  if (list?.length) {
    for (const node of list) {
      if (node.nodeType === 1) {
        if ((node as Element).classList.contains('ignore-header')) {
          node.remove()
        }
        else {
          clearHeaderNodeList(Array.from(node.childNodes))
        }
      }
    }
  }
}

/**
 * Resolve headers into a hierarchical structure
 * Organizes flat headers into nested menu items based on levels
 *
 * 将标题解析为层次结构
 * 根据级别将平面标题组织为嵌套菜单项
 *
 * @param headers - Flat array of menu items / 平面菜单项数组
 * @param high - Minimum header level to include / 要包含的最小标题级别
 * @returns Hierarchical array of menu items / 层次化的菜单项数组
 */
export function resolveHeaders(headers: MenuItem[], high: number): MenuItem[] {
  headers = headers.filter(h => h.level >= high)
  // clear previous caches
  resolvedHeaders.length = 0
  // update global header list for active link rendering
  for (const { element, link } of headers)
    resolvedHeaders.push({ element, link })

  const ret: MenuItem[] = []
  // eslint-disable-next-line no-labels
  outer: for (let i = 0; i < headers.length; i++) {
    const cur = headers[i]
    if (i === 0) {
      ret.push(cur)
      continue
    }
    else {
      for (let j = i - 1; j >= 0; j--) {
        const prev = headers[j]
        if (prev.level < cur.level) {
          ;(prev.children || (prev.children = [])).push(cur)
          // eslint-disable-next-line no-labels
          continue outer
        }
      }
      ret.push(cur)
    }
  }

  return ret
}

/**
 * Resolve sub range header
 * Filters children headers based on the lowest level
 *
 * 解析子范围标题
 * 根据最低级别过滤子标题
 *
 * @param headers - Array of menu items / 菜单项数组
 * @param low - Lowest level to include / 要包含的最低级别
 * @returns Filtered menu items / 过滤后的菜单项
 */
function resolveSubRangeHeader(headers: MenuItem[], low: number): MenuItem[] {
  return headers.map((header) => {
    if (header.children?.length) {
      const current = header.lowLevel ? Math.max(header.lowLevel, low) : low
      const children = header.children.filter(({ level }) => level <= current)
      header.children = resolveSubRangeHeader(children, header.lowLevel || low)
    }
    return header
  })
}

/**
 * Use active anchor
 * Tracks scroll position and updates the active outline item
 *
 * 活跃锚点处理，监听滚动并更新目录中高亮的锚点
 *
 * @param container - Reference to the outline container / 目录容器的引用
 * @param marker - Reference to the active marker element / 活动标记元素的引用
 */
export function useActiveAnchor(container: Ref<HTMLElement | null>, marker: Ref<HTMLElement | null>): void {
  const { isAsideEnabled } = useLayout()
  const router = useRouter()
  const routeHash = ref<string>(router.currentRoute.value.hash)

  let prevActiveLink: HTMLAnchorElement | null = null

  /**
   * Set the active link based on scroll position
   * Determines which header is currently in view
   */
  const setActiveLink = (): void => {
    if (!isAsideEnabled.value)
      return

    const scrollY = Math.round(window.scrollY)
    const innerHeight = window.innerHeight
    const offsetHeight = document.body.offsetHeight
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1

    // resolvedHeaders may be repositioned, hidden or fix positioned
    const headers = resolvedHeaders
      .map(({ element, link }) => ({
        link,
        top: getAbsoluteTop(element),
      }))
      .filter(({ top }) => !Number.isNaN(top))
      .sort((a, b) => a.top - b.top)

    // no headers available for active link
    if (!headers.length) {
      activateLink(null)
      return
    }

    // page top
    if (scrollY < 1) {
      activateLink(null)
      return
    }

    // page bottom - highlight last link
    if (isBottom) {
      activateLink(headers[headers.length - 1].link)
      return
    }

    // find the last header above the top of viewport
    let activeLink: string | null = null
    for (const { link, top } of headers) {
      if (top > scrollY + 80)
        break

      activeLink = link
    }
    activateLink(activeLink)
  }

  /**
   * Activate a specific link in the outline
   * Updates visual indicators and marker position
   *
   * @param hash - Hash of the link to activate / 要激活的链接哈希
   */
  function activateLink(hash: string | null): void {
    routeHash.value = hash || ''
    if (prevActiveLink)
      prevActiveLink.classList.remove('active')

    if (hash == null) {
      prevActiveLink = null
    }
    else {
      prevActiveLink = container.value?.querySelector(
        `a[href="${decodeURIComponent(hash)}"]`,
      ) ?? null
    }

    const activeLink = prevActiveLink

    if (activeLink) {
      activeLink.classList.add('active')
      if (marker.value) {
        marker.value.style.top = `${activeLink.offsetTop + 39}px`
        marker.value.style.opacity = '1'
      }
    }
    else {
      if (marker.value) {
        marker.value.style.top = '33px'
        marker.value.style.opacity = '0'
      }
    }
  }

  const onScroll = useThrottleFn(setActiveLink, 100)

  watchDebounced(routeHash, () => {
    updateHash(router, routeHash.value)
  }, { debounce: 500 })

  onMounted(() => {
    setTimeout(() => {
      setActiveLink()
      window.addEventListener('scroll', onScroll)
    }, 1000)
  })

  onUpdated(() => {
    // sidebar update means a route change
    activateLink(location.hash)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
}

/**
 * Get the absolute top position of an element
 * Accounts for fixed positioned ancestors
 *
 * 获取元素的绝对顶部位置
 * 考虑固定定位的祖先元素
 *
 * @param element - Element to measure / 要测量的元素
 * @returns Absolute top position or NaN / 绝对顶部位置或 NaN
 */
function getAbsoluteTop(element: HTMLElement): number {
  let offsetTop = 0
  while (element && element !== document.body) {
    if (window.getComputedStyle(element).position === 'fixed') {
      return element.offsetTop
    }
    offsetTop += element.offsetTop
    element = element.offsetParent as HTMLElement
  }
  return element ? offsetTop : Number.NaN
}

/**
 * Update current hash without triggering scrollBehavior
 * Temporarily disables scroll behavior during hash update
 *
 * 更新当前哈希而不触发 scrollBehavior
 * 在哈希更新期间临时禁用滚动行为
 *
 * @param router - Vue Router instance / Vue Router 实例
 * @param hash - New hash value / 新的哈希值
 */
async function updateHash(router: Router, hash: string): Promise<void> {
  const { path, query } = router.currentRoute.value
  const { scrollBehavior } = router.options

  // temporarily disable `scrollBehavior`
  router.options.scrollBehavior = undefined
  await router.replace({ path, query, hash })
  // restore it after navigation
  router.options.scrollBehavior = scrollBehavior
}
