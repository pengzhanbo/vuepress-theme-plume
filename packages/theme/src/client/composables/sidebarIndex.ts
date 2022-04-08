import { sidebarIndex as sidebarIndexRaw } from '@internal/sidebarIndex.js'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { SidebarOptions } from '../../shared'
import { useThemeLocaleData } from './themeData'

export type SidebarIndexRef = Ref<Record<string, SidebarOptions>>

export type SidebarRef = Ref<SidebarOptions>

export const sidebarIndex: SidebarIndexRef = ref(sidebarIndexRaw)

interface UseSidebarIndex {
  sidebarList: SidebarRef
  initSidebarList: (path: string) => void
}

export const useSidebarIndex = (): UseSidebarIndex => {
  const sidebarList: SidebarRef = ref([])
  const themeLocale = useThemeLocaleData()
  const notes = themeLocale.value.notes
  function initSidebarList(path = ''): void {
    if (!notes) return
    const prefix = notes.link?.replace(/^\/|\/$/g, '')
    if (path.startsWith(`/${prefix}`)) {
      Object.keys(sidebarIndex.value).forEach((key) => {
        if (path.startsWith(key)) {
          sidebarList.value = sidebarIndex.value[key]
        }
      })
    }
  }
  return { sidebarList, initSidebarList }
}

if (import.meta.hot) {
  __VUE_HMR_RUNTIME__.updateSidebarIndex = (
    data: Record<string, SidebarOptions>
  ) => {
    sidebarIndex.value = data
  }
}
