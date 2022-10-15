import { sidebarIndex as sidebarIndexRaw } from '@internal/sidebarIndex'
import { usePageFrontmatter } from '@vuepress/client'
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { SidebarOptions } from '../../shared/index.js'
import { useThemeLocaleData } from './themeData.js'

export type SidebarIndexRef = Ref<Record<string, SidebarOptions>>

export type SidebarRef = ComputedRef<SidebarOptions>

export const sidebarIndex: SidebarIndexRef = ref(sidebarIndexRaw)

interface UseSidebarIndex {
  sidebarList: SidebarRef
  hasSidebar: ComputedRef<boolean>
}

export const useSidebarIndex = (): UseSidebarIndex => {
  // const sidebarList: SidebarRef = ref([])
  const themeLocale = useThemeLocaleData()
  const route = useRoute()
  const frontmatter = usePageFrontmatter()
  const sidebarList = computed(() => {
    const notes = themeLocale.value.notes
    if (!notes) return []
    const prefix = notes.link?.replace(/^\/|\/$/g, '')
    if (route.path.startsWith(`/${prefix}`)) {
      const key = Object.keys(sidebarIndex.value).find((key) =>
        route.path.startsWith(key)
      )
      if (key) return sidebarIndex.value[key]
    }
    return []
  })
  const hasSidebar = computed(() => {
    return !frontmatter.value.home && sidebarList.value.length > 0
  })
  return { sidebarList, hasSidebar }
}

if (import.meta.hot) {
  __VUE_HMR_RUNTIME__.updateSidebarIndex = (
    data: Record<string, SidebarOptions>
  ) => {
    sidebarIndex.value = data
  }
}
