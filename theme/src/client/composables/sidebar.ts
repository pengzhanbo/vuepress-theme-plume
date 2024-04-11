import type { PageData } from 'vuepress/client'
import { usePageData, usePageFrontmatter, useRoute, withBase } from 'vuepress/client'
import type {
  NotesData,
  NotesSidebarItem,
} from '@vuepress-plume/plugin-notes-data'
import { useNotesData } from '@vuepress-plume/plugin-notes-data/client'
import { useMediaQuery } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import type { PlumeThemePageData } from '../../shared/index.js'
import { isActive } from '../utils/index.js'
import { useThemeLocaleData } from './themeData.js'
import { hashRef } from './hash.js'

export { useNotesData }

export function normalizePath(path: string) {
  return path.replace(/\/\\+/g, '/').replace(/\/+/g, '/')
}

export function getSidebarList(path: string, notesData: NotesData) {
  const link = Object.keys(notesData).find(link =>
    path.startsWith(normalizePath(withBase(link))),
  )
  return link ? notesData[link] : []
}

export function getSidebarFirstLink(sidebar: NotesSidebarItem[]) {
  for (const item of sidebar) {
    if (item.link)
      return item.link
    if (item.items)
      return getSidebarFirstLink(item.items as NotesSidebarItem[])
  }
  return ''
}

export function useSidebar() {
  const route = useRoute()
  const notesData = useNotesData()
  const theme = useThemeLocaleData()
  const frontmatter = usePageFrontmatter()
  const page = usePageData<PlumeThemePageData>()

  const is960 = useMediaQuery('(min-width: 960px)')

  const isOpen = ref(false)

  const sidebarKey = computed(() => {
    const link = Object.keys(notesData.value).find(link =>
      route.path.startsWith(normalizePath(withBase(link))),
    )
    return link
  })

  const sidebar = computed(() => {
    return theme.value.notes ? getSidebarList(route.path, notesData.value) : []
  })
  const hasSidebar = computed(() => {
    return (
      !frontmatter.value.home
      && !page.value.isBlogPost
      && sidebar.value.length > 0
      && frontmatter.value.sidebar !== false
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
    sidebarKey,
    open,
    close,
    toggle,
  }
}

export function useCloseSidebarOnEscape(
  isOpen: Ref<boolean>,
  close: () => void,
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

  const collapsed = ref(item.value.collapsed ?? false)

  const collapsible = computed(() => {
    return item.value.collapsed !== null && item.value.collapsed !== undefined
  })

  const isLink = computed(() => {
    return !!item.value.link
  })

  const isActiveLink = ref(false)
  const updateIsActiveLink = () => {
    isActiveLink.value = isActive(page.value.path, item.value.link)
  }

  watch([page, item, hashRef], updateIsActiveLink)
  onMounted(updateIsActiveLink)

  const hasActiveLink = computed(() => {
    if (isActiveLink.value)
      return true

    return item.value.items
      ? containsActiveLink(
        page.value.path,
        item.value.items as NotesSidebarItem[],
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
    if (collapsible.value)
      collapsed.value = !collapsed.value
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
  items: NotesSidebarItem | NotesSidebarItem[],
): boolean {
  if (Array.isArray(items))
    return items.some(item => containsActiveLink(path, item))

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
  sidebar: NotesSidebarItem[],
): NotesSidebarItem[] {
  const groups: NotesSidebarItem[] = []

  let lastGroupIndex = 0

  for (const index in sidebar) {
    const item = sidebar[index]

    if (item.items) {
      lastGroupIndex = groups.push(item)
      continue
    }

    if (!groups[lastGroupIndex])
      groups.push({ items: [] })

    groups[lastGroupIndex]!.items!.push(item)
  }

  return groups
}
