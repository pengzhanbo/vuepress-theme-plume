import type {
  NotesData,
  NotesSidebarItem,
} from '@vuepress-plume/vuepress-plugin-notes-data'
import { useNotesData } from '@vuepress-plume/vuepress-plugin-notes-data/client'
import type { PageData } from '@vuepress/client'
import { usePageData, usePageFrontmatter, withBase } from '@vuepress/client'
import { useMediaQuery } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { PlumeThemePageData } from '../../shared/index.js'
import { isActive } from '../utils/index.js'
import { useThemeLocaleData } from './themeData.js'

export function getSidebarList(path: string, notesData: NotesData) {
  const link = Object.keys(notesData).find((link) =>
    path.startsWith(withBase(link))
  )
  return link ? notesData[link] : []
}

export function useSidebar() {
  const route = useRoute()
  const notesData = useNotesData()
  const theme = useThemeLocaleData()
  const frontmatter = usePageFrontmatter()
  const page = usePageData<PlumeThemePageData>()

  const is960 = useMediaQuery('(min-width: 960px)')

  const isOpen = ref(false)

  const sidebar = computed(() => {
    return theme.value.notes ? getSidebarList(route.path, notesData.value) : []
  })
  const hasSidebar = computed(() => {
    return (
      !frontmatter.value.home &&
      !page.value.isBlogPost &&
      sidebar.value.length > 0
    )
  })

  const hasAside = computed(() => {
    return !frontmatter.value.home && frontmatter.value.aside !== false
  })

  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value)

  const sidebarGroups = computed(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : []
  })

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value ? close() : open()
  }

  return {
    isOpen,
    sidebar,
    hasSidebar,
    hasAside,
    isSidebarEnabled,
    sidebarGroups,
    open,
    close,
    toggle,
  }
}

export function useCloseSidebarOnEscape(
  isOpen: Ref<boolean>,
  close: () => void
) {
  let triggerElement: HTMLButtonElement | undefined

  watchEffect(() => {
    triggerElement = isOpen.value
      ? (document.activeElement as HTMLButtonElement)
      : undefined
  })

  onMounted(() => {
    window.addEventListener('keyup', onEscape)
  })

  onUnmounted(() => {
    window.removeEventListener('keyup', onEscape)
  })

  function onEscape(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen.value) {
      close()
      triggerElement?.focus()
    }
  }
}

export function useSidebarControl(item: ComputedRef<NotesSidebarItem>) {
  const page = usePageData<PageData>()

  const collapsed = ref(false)

  const collapsible = computed(() => {
    return item.value.collapsed != null
  })

  const isLink = computed(() => {
    return !!item.value.link
  })

  const isActiveLink = computed(() => {
    console.log('pl:', page.value.path, '  il:', item.value.link)
    return isActive(page.value.path, item.value.link)
  })

  const hasActiveLink = computed(() => {
    if (isActiveLink.value) {
      return true
    }

    return item.value.items
      ? containsActiveLink(
          page.value.path,
          item.value.items as NotesSidebarItem[]
        )
      : false
  })

  const hasChildren = computed(() => {
    return !!(item.value.items && item.value.items.length)
  })

  watchEffect(() => {
    collapsed.value = !!(collapsible.value && item.value.collapsed)
  })

  watchEffect(() => {
    ;(isActiveLink.value || hasActiveLink.value) && (collapsed.value = false)
  })

  function toggle() {
    if (collapsible.value) {
      collapsed.value = !collapsed.value
    }
  }

  return {
    collapsed,
    collapsible,
    isLink,
    isActiveLink,
    hasActiveLink,
    hasChildren,
    toggle,
  }
}

export function containsActiveLink(
  path: string,
  items: NotesSidebarItem | NotesSidebarItem[]
): boolean {
  if (Array.isArray(items)) {
    return items.some((item) => containsActiveLink(path, item))
  }

  return isActive(path, items.link)
    ? true
    : items.items
    ? containsActiveLink(path, items.items as NotesSidebarItem[])
    : false
}

/**
 * Get or generate sidebar group from the given sidebar items.
 */
export function getSidebarGroups(
  sidebar: NotesSidebarItem[]
): NotesSidebarItem[] {
  const groups: NotesSidebarItem[] = []

  let lastGroupIndex = 0

  for (const index in sidebar) {
    const item = sidebar[index]

    if (item.items) {
      lastGroupIndex = groups.push(item)
      continue
    }

    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] })
    }

    groups[lastGroupIndex]!.items!.push(item)
  }

  return groups
}
