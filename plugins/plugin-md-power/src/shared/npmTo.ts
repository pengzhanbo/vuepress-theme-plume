/**
 * Supported package managers
 *
 * 支持的包管理器
 */
export type NpmToPackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'deno'

/**
 * npm-to options
 *
 * npm-to 配置选项
 */
export type NpmToOptions = NpmToPackageManager[] | {
  /**
   * Tabs to display
   *
   * 要显示的选项卡
   */
  tabs?: NpmToPackageManager[]
}
