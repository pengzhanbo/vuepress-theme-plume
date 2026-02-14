/**
 * File tree icon mode
 *
 * 文件树图标模式
 */
export type FileTreeIconMode = 'simple' | 'colored'

/**
 * File tree options
 *
 * 文件树配置选项
 */
export interface FileTreeOptions {
  /**
   * Icon mode for file tree
   *
   * 文件树的图标模式
   *
   * - `simple`: Simple icons / 简单图标
   * - `colored`: Colored icons / 彩色图标
   */
  icon?: FileTreeIconMode
}
