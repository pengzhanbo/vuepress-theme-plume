import type { Ref } from 'vue'
import { icons } from '@internal/iconify'
import { ref } from 'vue'

interface IconsRawData {
  co: string[]
  bg: Record<number, string[]>
  mask: Record<number, string[]>
}

interface IconsData {
  bg: string[]
  mask: string[]
}

type IconsDataRef = Ref<IconsData>

const iconsData: IconsDataRef = ref(resolveIconsData(icons))

export const useIconsData = (): IconsDataRef => iconsData

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateIcons = (data: IconsRawData) => {
    iconsData.value = resolveIconsData(data)
  }
}

// 旧版本内置图标别名，映射回 simple-icons 集合中的名称
export const socialFallbacks: Record<string, string> = {
  twitter: 'x',
  weibo: 'sinaweibo',
}

export function resolveIconsData({ co, bg, mask }: IconsRawData): IconsData {
  return {
    bg: processIcons(co, bg),
    mask: processIcons(co, mask),
  }
}

export function normalizeIconClassname(icon: string): string {
  const [collect, name] = icon.split(':')
  const iconName = `vpi-${collect}-${name}`
  if (iconsData.value.bg.includes(icon))
    return `${iconName} bg`
  if (iconsData.value.mask.includes(icon))
    return iconName
  return ''
}

function processIcons(collects: string[], raw: Record<number, string[]>): string[] {
  const data: string[] = []
  for (const [key, list] of Object.entries(raw)) {
    const collect = collects[Number(key)]
    if (collect)
      data.push(...list.map(icon => `${collect}:${icon}`))
  }
  return data
}
