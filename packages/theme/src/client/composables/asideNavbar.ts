import type { Ref } from 'vue'
import { ref } from 'vue'

const asideNavbarShow = ref<boolean>(false)

const triggerAsideNavbar = (show?: boolean): void => {
  if (typeof show === 'boolean') {
    asideNavbarShow.value = show
  } else {
    asideNavbarShow.value = !asideNavbarShow.value
  }
}

interface UseAsideNavbar {
  asideNavbarShow: Ref<boolean>
  triggerAsideNavbar: (show?: boolean) => void
}
export const useAsideNavbar = (): UseAsideNavbar => {
  return {
    asideNavbarShow,
    triggerAsideNavbar,
  }
}
