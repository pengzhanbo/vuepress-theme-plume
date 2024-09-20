import type { Ref } from 'vue'
import type {
  NavItem,
  ResolvedNavItem,
  ResolvedNavItemWithLink,
} from '../../shared/index.js'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vuepress/client'

import { normalizeLink, resolveNavLink } from '../utils/index.js'
import { useData } from './data.js'

export function useNavbarData(): Ref<ResolvedNavItem[]> {
  const { theme } = useData()

  return computed(() => resolveNavbar(theme.value.navbar || []))
}

function resolveNavbar(navbar: NavItem[], _prefix = ''): ResolvedNavItem[] {
  const resolved: ResolvedNavItem[] = []
  navbar.forEach((item) => {
    if (typeof item === 'string') {
      resolved.push(resolveNavLink(normalizeLink(_prefix, item)))
    }
    else {
      const { items, prefix, ...args } = item
      const res = { ...args } as ResolvedNavItem
      if ('link' in res) {
        res.link = normalizeLink(_prefix, res.link)
      }
      if (items?.length) {
        res.items = resolveNavbar(
          items,
          normalizeLink(_prefix, prefix),
        ) as ResolvedNavItemWithLink[]
      }
      resolved.push(res)
    }
  })
  return resolved
}

export interface UseNavReturn {
  isScreenOpen: Ref<boolean>
  openScreen: () => void
  closeScreen: () => void
  toggleScreen: () => void
}

export function useNav(): UseNavReturn {
  const isScreenOpen = ref(false)

  function openScreen(): void {
    isScreenOpen.value = true
    window.addEventListener('resize', closeScreenOnTabletWindow)
  }

  function closeScreen(): void {
    isScreenOpen.value = false
    window.removeEventListener('resize', closeScreenOnTabletWindow)
  }

  function toggleScreen(): void {
    if (isScreenOpen.value) {
      closeScreen()
    }
    else {
      openScreen()
    }
  }

  /**
   * Close screen when the user resizes the window wider than tablet size.
   */
  function closeScreenOnTabletWindow(): void {
    if (window.outerWidth >= 768) {
      closeScreen()
    }
  }

  const route = useRoute()
  watch(() => route.path, closeScreen)

  return {
    isScreenOpen,
    openScreen,
    closeScreen,
    toggleScreen,
  }
}
