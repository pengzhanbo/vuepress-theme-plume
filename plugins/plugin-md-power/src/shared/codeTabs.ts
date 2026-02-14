/**
 * Code tabs options
 *
 * 代码选项卡配置选项
 */
export interface CodeTabsOptions {
  /**
   * Icon configuration for code tabs
   *
   * 代码选项卡的图标配置
   *
   * - `boolean`: Whether to enable icons / 是否启用图标
   * - `object`: Detailed icon configuration / 详细的图标配置
   *   - `named`: Named icons to use / 要使用的命名图标
   *   - `extensions`: File extensions to show icons for / 要显示图标的文件扩展名
   */
  icon?: boolean | { named?: false | string[], extensions?: false | string[] }
}
