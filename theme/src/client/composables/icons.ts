import type { Ref } from 'vue'
import { icons } from '@internal/iconify'
import { ref } from 'vue'

type IconsData = Record<string, string>
type IconsDataRef = Ref<IconsData>

const iconsData: IconsDataRef = ref(icons)

export const useIconsData = (): IconsDataRef => iconsData

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateIcons = (data: IconsData) => {
    iconsData.value = data
  }
}
