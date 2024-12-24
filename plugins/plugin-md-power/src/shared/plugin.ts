import type { CanIUseOptions } from './caniuse.js'
import type { CodeTabsOptions } from './codeTabs.js'
import type { FileTreeOptions } from './fileTree.js'
import type { IconsOptions } from './icons.js'
import type { NpmToOptions } from './npmTo.js'
import type { PDFOptions } from './pdf.js'
import type { PlotOptions } from './plot.js'
import type { ReplOptions } from './repl.js'

export interface MarkdownPowerPluginOptions {
  /**
   * 配置代码块分组
   */
  codeTabs?: CodeTabsOptions

  /**
   * 是否启用 npm-to 容器
   */
  npmTo?: boolean | NpmToOptions

  /**
   * 是否启用 PDF 嵌入语法
   *
   * `@[pdf](pdf_url)`
   *
   * @default false
   */
  pdf?: boolean | PDFOptions

  // new syntax
  /**
   * 是否启用 iconify 图标嵌入语法
   *
   * `:[collect:icon_name]:`
   *
   * @default false
   */
  icons?: boolean | IconsOptions
  /**
   * 是否启用 隐秘文本 语法
   *
   * `!!plot_content!!`
   *
   * @default false
   */
  plot?: boolean | PlotOptions

  // video embed
  /**
   * 是否启用 bilibili 视频嵌入
   *
   * `@[bilibili](bid)`
   *
   * @default false
   */
  bilibili?: boolean
  /**
   * 是否启用 youtube 视频嵌入
   *
   * `@[youtube](video_id)`
   *
   * @default false
   */
  youtube?: boolean

  /**
   * 是否启用 artPlayer 视频嵌入
   *
   * `@[artPlayer](url)`
   */
  artPlayer?: boolean

  /**
   * 是否启用 audioReader 音频嵌入
   *
   * `@[audioReader](url)`
   */
  audioReader?: boolean

  // code embed
  /**
   * 是否启用 codepen 嵌入
   *
   * `@[codepen](pen_id)`
   *
   * @default false
   */
  codepen?: boolean
  /**
   * @deprecated
   */
  replit?: boolean
  /**
   * 是否启用 codeSandbox 嵌入
   *
   * `@[codesandbox](codesandbox_id)`
   *
   * @default false
   */
  codeSandbox?: boolean
  /**
   * 是否启用 jsfiddle 嵌入
   *
   * `@[jsfiddle](jsfiddle_id)`
   *
   * @default false
   */
  jsfiddle?: boolean

  // container
  /**
   * 是否启用 REPL 容器语法
   *
   * @default false
   */
  repl?: false | ReplOptions
  /**
   * 是否启用 文件树 容器语法
   *
   * @default false
   */
  fileTree?: boolean | FileTreeOptions

  /**
   * 是否启用 caniuse 嵌入语法
   *
   * `@[caniuse](feature_name)`
   *
   * @default false
   */
  caniuse?: boolean | CanIUseOptions

  // enhance
  /**
   * 是否启用 自动填充 图片宽高属性
   *
   * __请注意，无论是否启用，该功能仅在构建生产包时生效__
   *
   * - 如果为 `true` ，等同于 `'local'`
   * - 如果为 `local`，则仅对本地图片 添加 width 和 height
   * - 如果为 `all`，则对所有图片(即包括 本地 和 远程) 添加 width 和 height
   *
   * 图片在加载过程中如果比较慢，从加载到完成的过程会导致页面布局不稳定，导致内容闪烁等。
   * 此功能通过给图片添加 `width` 和 `height` 属性来解决该问题。
   *
   * 请谨慎使用 `all` 选项，该选项会在构建阶段发起网络请求，尝试加载远程图片以获取图片尺寸信息，
   * 这可能会导致 构建时间变得更长（幸运的是获取尺寸信息只需要加载图片 几 KB 的数据包，因此耗时不会过长）
   *
   * @default false
   */
  imageSize?: boolean | 'local' | 'all'
}
