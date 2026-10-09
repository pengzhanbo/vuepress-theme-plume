import type { ThemeBadge, ThemeIcon } from '../common/index.js'
import type { ThemeSidebar } from '../features/sidebar.js'

/**
 * Payload of the `@internal/sidebar` virtual module.
 *
 * Written at build time by `prepareSidebar` and consumed by the client sidebar
 * composable. Kept as the single source of truth so the node writer and the
 * client shim cannot silently drift apart when the structure changes.
 *
 * `@internal/sidebar` 虚拟模块的数据结构。
 * 构建期由 `prepareSidebar` 写入、客户端侧边栏 composable 消费。
 * 作为唯一类型来源，避免 node 侧与客户端 shim 在结构变更时静默失配。
 *
 * @internal
 */
export interface ThemeSidebarData {
  /**
   * Per-locale sidebar configurations, keyed by locale path (`/`, `/en/`, …).
   *
   * 各语言环境的侧边栏配置，以 locale 路径（`/`、`/en/` 等）为键。
   */
  locales: Record<string, ThemeSidebar>
  /**
   * Auto-generated directory sidebars, keyed by locale path or directory prefix.
   *
   * 自动生成的目录侧边栏，以 locale 路径或目录前缀为键。
   */
  auto: Record<string, ResolvedSidebarItem[]>
  /**
   * Auto-generated directory home links, keyed by directory prefix.
   *
   * 自动生成的目录首页链接，以目录前缀为键。
   */
  home: Record<string, string>
}

/**
 * Resolved sidebar for internal theme use
 * Processed sidebar configuration ready for rendering
 *
 * 已解析的侧边栏
 * 已处理的侧边栏配置，准备用于渲染
 * @internal
 */
export type ResolvedSidebar = ResolvedSidebarItem[] | ResolvedSidebarMulti

/**
 * Resolved multiple sidebars for internal theme use
 * Maps paths to resolved sidebar items
 *
 * 已解析的多个侧边栏
 * 将路径映射到已解析的侧边栏项目
 * @internal
 */
export type ResolvedSidebarMulti = Record<
  string,
  ResolvedSidebarItem[] | { items: ResolvedSidebarItem[] }
>

/**
 * Resolved sidebar item for internal theme use
 * Processed sidebar item ready for rendering
 *
 * 已解析的侧边栏子项
 * 已处理的侧边栏项目，准备用于渲染
 * @internal
 */
export interface ResolvedSidebarItem {
  /**
   * Sidebar item text
   * 侧边栏文本
   */
  text?: string

  /**
   * Sidebar item link
   * 侧边栏链接
   */
  link?: string

  /**
   * Sidebar item icon
   * 侧边栏图标
   */
  icon?: ThemeIcon

  /**
   * Sidebar item badge
   * 侧边栏徽章
   */
  badge?: string | ThemeBadge

  /**
   * Child sidebar items
   * 次级侧边栏分组
   */
  items?: ResolvedSidebarItem[]

  /**
   * Whether the group is collapsible
   * - If not specified, group is not collapsible
   * - If `true`, group is collapsible and collapsed by default
   * - If `false`, group is collapsible but expanded by default
   *
   * 如果未指定，组不可折叠
   * 如果为`true`，组可折叠，并默认折叠
   * 如果为`false`，组可折叠，但默认展开
   */
  collapsed?: boolean

  /**
   * Link prefix for current group
   * 当前分组的链接前缀
   */
  prefix?: string

  /**
   * @deprecated Use `prefix` instead / 使用 `prefix` 替代
   */
  dir?: string

  /**
   * Link relationship attribute
   * 链接关系属性
   */
  rel?: string

  /**
   * Link target attribute
   * 链接目标属性
   */
  target?: string
}
