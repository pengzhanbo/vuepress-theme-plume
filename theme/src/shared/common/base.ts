/**
 * Image configuration type
 * Supports simple string path or detailed configuration object
 * Also supports dark/light mode variants
 *
 * 图片配置类型
 * 支持简单的字符串路径或详细的配置对象
 * 同时支持深色/浅色模式变体
 */
export type ThemeImage
  = | string
    | { src: string, alt?: string, width?: string | number, height?: string | number }
    | { dark: string, light: string, alt?: string, width?: string | number, height?: string | number }

/**
 * Icon configuration type
 * Supports string name or inline SVG
 *
 * 图标配置类型
 * 支持字符串名称或内联 SVG
 */
export type ThemeIcon = string | { svg: string }

/**
 * Color configuration type
 * Supports single color or dark/light mode variants
 *
 * 颜色配置类型
 * 支持单一颜色或深色/浅色模式变体
 */
export type ThemeColor = string | { light: string, dark: string }

/**
 * Page outline navigation configuration
 * Controls the display of heading navigation in the sidebar
 *
 * 页面目录导航配置
 * 控制侧边栏中标题导航的显示
 *
 * - `false`: Disable outline / 禁用目录
 * - `number`: Display headings up to this level / 显示到此级别的标题
 * - `[number, number]`: Display headings within level range / 显示级别范围内的标题
 * - `'deep'`: Display all headings including deeply nested ones / 显示所有标题，包括深层嵌套的
 */
export type ThemeOutline = false | number | [number, number] | 'deep'

/**
 * Badge configuration interface
 * Defines the appearance of a badge element
 *
 * 徽章配置接口
 * 定义徽章元素的外观
 */
export interface ThemeBadge {
  /** Badge text content / 徽章文本内容 */
  text?: string
  /** Badge type for preset styles / 徽章类型，用于预设样式 */
  type?: string
  /** Badge text color / 徽章文本颜色 */
  color?: string
  /** Badge background color / 徽章背景颜色 */
  bgColor?: string
  /** Badge border color / 徽章边框颜色 */
  borderColor?: string
}

/**
 * Light/Dark mode value type
 * Supports single value or mode-specific values
 *
 * 浅色/深色模式值类型
 * 支持单一值或模式特定的值
 *
 * @template T - The value type / 值类型
 */
export type ThemeLightDark<T> = T | { light?: T, dark?: T }
