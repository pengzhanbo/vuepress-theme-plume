import type { Ref } from 'vue'
import { icons } from '@internal/iconify'
import { ref } from 'vue'

/**
 * Raw icons data structure from internal data.
 *
 * 来自内部数据的原始图标数据结构。
 */
interface IconsRawData {
  /** Collection names / 集合名称 */
  co: string[]
  /** Background icons by collection index / 按集合索引的背景图标 */
  bg: Record<number, string[]>
  /** Mask icons by collection index / 按集合索引的遮罩图标 */
  mask: Record<number, string[]>
}

/**
 * Processed icons data structure.
 *
 * 处理后的图标数据结构。
 */
interface IconsData {
  /** List of background icons / 背景图标列表 */
  bg: string[]
  /** List of mask icons / 遮罩图标列表 */
  mask: string[]
}

type IconsDataRef = Ref<IconsData>

const iconsData: IconsDataRef = ref(resolveIconsData(icons))

/**
 * Use icons data.
 * Returns the processed icons data reference.
 *
 * 获取图标数据。
 * 返回处理后的图标数据引用。
 *
 * @returns Icons data reference / 图标数据引用
 */
export const useIconsData = (): IconsDataRef => iconsData

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateIcons = (data: IconsRawData) => {
    iconsData.value = resolveIconsData(data)
  }
}

/**
 * Fallback mappings for old icon aliases.
 * Maps legacy icon names to their current equivalents.
 *
 * 旧版本内置图标别名的后备映射。
 * 将旧图标名称映射到当前等效名称。
 */
export const socialFallbacks: Record<string, string> = {
  twitter: 'x',
  weibo: 'sinaweibo',
}

/**
 * Resolve raw icons data to processed format.
 * Converts indexed data to flat icon lists.
 *
 * 将原始图标数据解析为处理后的格式。
 * 将索引数据转换为平面图标列表。
 *
 * @param data - Raw icons data / 原始图标数据
 * @param data.co - Collection names / 集合名称
 * @param data.bg - Background icons by collection index / 按集合索引的背景图标
 * @param data.mask - Mask icons by collection index / 按集合索引的遮罩图标
 * @returns Processed icons data / 处理后的图标数据
 */
export function resolveIconsData({ co, bg, mask }: IconsRawData): IconsData {
  return {
    bg: processIcons(co, bg),
    mask: processIcons(co, mask),
  }
}

/**
 * Normalize icon to CSS class name.
 * Returns the appropriate class name based on icon type.
 *
 * 将图标规范化为 CSS 类名。
 * 根据图标类型返回适当的类名。
 *
 * @param icon - Icon name in format "collection:name" / 格式为 "collection:name" 的图标名称
 * @returns CSS class name or empty string if not found / CSS 类名，如果未找到则返回空字符串
 */
export function normalizeIconClassname(icon: string): string {
  const [collect, name] = icon.split(':')
  const iconName = `vpi-${collect}-${name}`
  if (iconsData.value.bg.includes(icon))
    return `${iconName} bg`
  if (iconsData.value.mask.includes(icon))
    return iconName
  return ''
}

/**
 * Process indexed icons into flat list.
 * Converts collection-indexed data to "collection:icon" format.
 *
 * 将索引图标处理为平面列表。
 * 将集合索引数据转换为 "collection:icon" 格式。
 *
 * @param collects - Array of collection names / 集合名称数组
 * @param raw - Indexed icon data / 索引图标数据
 * @returns Flat array of icon identifiers / 图标标识符的平面数组
 */
function processIcons(collects: string[], raw: Record<number, string[]>): string[] {
  const data: string[] = []
  for (const [key, list] of Object.entries(raw)) {
    const collect = collects[Number(key)]
    if (collect)
      data.push(...list.map(icon => `${collect}:${icon}`))
  }
  return data
}
