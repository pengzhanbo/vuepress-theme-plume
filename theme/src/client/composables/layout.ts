import { computed, shallowRef, watch } from 'vue'
import { useRoute } from 'vuepress/client'
import { inBrowser } from '../utils/index.js'
import { useData } from './data.js'
import { useEncrypt } from './encrypt.js'
import { useHeaders } from './outline.js'
import { useSidebarData } from './sidebar-data.js'
import { useCloseSidebarOnEscape, useSidebarControl } from './sidebar.js'

const is960 = shallowRef(false)
const is1280 = shallowRef(false)

/**
 * Use layout
 *
 * 获取当前页面布局相关信息，包括是否首页、是否有侧边栏、是否显示目录等
 */
export function useLayout() {
  const { frontmatter, theme } = useData()
  const { isPageDecrypted } = useEncrypt()

  const sidebar = useSidebarData()
  const headers = useHeaders()

  const isHome = computed(() => frontmatter.value.home ?? frontmatter.value.pageLayout === 'home')

  const hasSidebar = computed(() => {
    return (
      frontmatter.value.sidebar !== false
      && sidebar.value.length > 0
      && frontmatter.value.pageLayout !== 'home'
    )
  })

  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value)

  const hasAside = computed(() => {
    if (frontmatter.value.pageLayout === 'home' || frontmatter.value.home)
      return false

    if (frontmatter.value.pageLayout === 'friends' || frontmatter.value.friends)
      return false

    if (!isPageDecrypted.value)
      return false

    if (frontmatter.value.aside != null)
      return !!frontmatter.value.aside
    return theme.value.aside !== false
  })

  const leftAside = computed(() => {
    if (hasAside.value) {
      return frontmatter.value.aside == null
        ? theme.value.aside === 'left'
        : frontmatter.value.aside === 'left'
    }
    return false
  })

  const hasLocalNav = computed(() => headers.value.length > 0)

  const isAsideEnabled = computed(() => {
    if (!is1280.value && !is960.value)
      return false

    return hasSidebar.value ? is1280.value : is960.value
  })

  return {
    isHome,
    hasAside,
    hasSidebar,
    leftAside,
    hasLocalNav,
    isSidebarEnabled,
    isAsideEnabled,
    is960,
    is1280,
  }
}

export function registerWatchers() {
  if (inBrowser) {
    is960.value = window.innerWidth >= 960
    is1280.value = window.innerWidth >= 1280
    window.addEventListener('resize', () => {
      is960.value = window.innerWidth >= 960
      is1280.value = window.innerWidth >= 1280
    }, { passive: true })
  }

  const route = useRoute()
  const { disableSidebar, toggleSidebarCollapse } = useSidebarControl()
  watch(() => route.path, () => {
    disableSidebar()
    toggleSidebarCollapse(false)
  })

  useCloseSidebarOnEscape()
}
