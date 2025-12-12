import type { Ref } from 'vue'
import { icons } from '@internal/iconify'
import { ref } from 'vue'

type NeedBackgroundIcons = string[]
type IconsDataRef = Ref<NeedBackgroundIcons>

const iconsData: IconsDataRef = ref(icons)

export const useIconsData = (): IconsDataRef => iconsData

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateIcons = (data: NeedBackgroundIcons) => {
    iconsData.value = data
  }
}

// 旧版本内置图标别名，映射回 simple-icons 集合中的名称
export const socialFallbacks: Record<string, string> = {
  twitter: 'x',
  weibo: 'sinaweibo',
}

export function normalizeIconClassname(icon: string): string {
  const [collect, name] = icon.split(':')
  return `vpi-${collect}-${name}${iconsData.value.includes(icon) ? ' bg' : ''}`
}
