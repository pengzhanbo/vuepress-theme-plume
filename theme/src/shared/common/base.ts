/**
 * 图片
 */
export type ThemeImage =
  | string
  | { src: string, alt?: string, width?: string | number, height?: string | number }
  | { dark: string, light: string, alt?: string, width?: string | number, height?: string | number }

/**
 * 图标
 */
export type ThemeIcon = string | { svg: string }

/**
 * 颜色
 */
export type ThemeColor = string | { light: string, dark: string }

/**
 * 页内 heading 导航栏
 */
export type ThemeOutline = false | number | [number, number] | 'deep'

/**
 * 徽章
 */
export interface ThemeBadge {
  text?: string
  type?: string
  color?: string
  bgColor?: string
  borderColor?: string
}
