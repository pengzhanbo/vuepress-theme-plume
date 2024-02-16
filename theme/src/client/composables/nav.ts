import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vuepress/client'

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
    isScreenOpen.value ? closeScreen() : openScreen()
  }

  /**
   * Close screen when the user resizes the window wider than tablet size.
   */
  function closeScreenOnTabletWindow(): void {
    window.outerWidth >= 768 && closeScreen()
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
