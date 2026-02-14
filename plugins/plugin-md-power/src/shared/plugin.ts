import type { LocaleConfig } from 'vuepress'
import type { CanIUseOptions } from './caniuse.js'
import type { CodeTabsOptions } from './codeTabs.js'
import type { CodeTreeOptions } from './codeTree.js'
import type { EncryptSnippetOptions } from './encrypt.js'
import type { MarkdownEnvPreset } from './env.js'
import type { FileTreeOptions } from './fileTree.js'
import type { IconOptions } from './icon.js'
import type { MDPowerLocaleData } from './locale.js'
import type { MarkOptions } from './mark.js'
import type { NpmToOptions } from './npmTo.js'
import type { PDFOptions } from './pdf.js'
import type { PlotOptions } from './plot.js'
import type { ReplOptions } from './repl.js'
import type { TableContainerOptions } from './table.js'

/**
 * Markdown Power Plugin Options
 *
 * Markdown Power 插件配置选项
 */
export interface MarkdownPowerPluginOptions {

  /**
   * Whether to preset markdown env, such as preset link references, abbreviations, content annotations, etc.
   *
   * 是否预设 markdown env，如 预设链接引用、缩写词、内容注释等
   *
   * Presets can be used in any markdown file
   *
   * 预设可以在任何 markdown 文件中使用
   *
   * @example
   * ```ts
   * env: {
   *   references: {
   *     vue: 'https://vuejs.org',
   *   },
   *   abbreviations: {
   *     vue: 'Vue.js',
   *   },
   *   annotations: {
   *     vue: 'Vue.js',
   *   },
   * }
   * ```
   * use `*.md`
   * ```markdown
   * [vue link][vue]
   * vue is a framework, [+vue] is modern framework
   * ```
   */
  env?: MarkdownEnvPreset
  /**
   * Whether to enable annotation, or preset content annotations
   *
   * 是否启用注释， 或者预设内容注释
   * @default false
   */
  annotation?: boolean | MarkdownEnvPreset['annotations']

  /**
   * Whether to enable abbr syntax, or preset abbreviations
   *
   * 是否启用 abbr 语法， 或者预设缩写词
   * @default false
   */
  abbr?: boolean | MarkdownEnvPreset['abbreviations']
  /**
   * Mark pen animation mode
   *
   * 马克笔动画模式
   * @default 'eager'
   */
  mark?: MarkOptions

  /**
   * Whether to enable content snippet encryption container
   *
   * 是否启用 内容片段加密容器
   *
   * @default false
   */
  encrypt?: boolean | EncryptSnippetOptions
  /**
   * Configure code block grouping
   *
   * 配置代码块分组
   */
  codeTabs?: CodeTabsOptions

  /**
   * Whether to enable npm-to container
   *
   * 是否启用 npm-to 容器
   */
  npmTo?: boolean | NpmToOptions

  /**
   * Whether to enable PDF embed syntax
   *
   * `@[pdf](pdf_url)`
   *
   * 是否启用 PDF 嵌入语法
   *
   * @default false
   */
  pdf?: boolean | PDFOptions

  // new syntax
  /**
   * Whether to enable icon support
   * - iconify - `::collect:icon_name::` => `<VPIcon name="collect:icon_name" />`
   * - iconfont - `::name::` => `<i class="iconfont icon-name"></i>`
   * - fontawesome - `::fas:name::` => `<i class="fa-solid fa-name"></i>`
   *
   * 是否启用 图标支持
   *
   * @default false
   */
  icon?: IconOptions

  /**
   * Whether to enable iconify icon embed syntax
   *
   * `::collect:icon_name::`
   *
   * 是否启用 iconify 图标嵌入语法
   *
   * @default false
   * @deprecated use `icon` instead / 该配置已弃用，请使用 `icon` 代替
   */
  icons?: boolean | IconOptions
  /**
   * Whether to enable hidden text syntax
   *
   * `!!plot_content!!`
   *
   * 是否启用 隐秘文本 语法
   *
   * @default false
   */
  plot?: boolean | PlotOptions

  /**
   * Whether to enable timeline syntax
   *
   * ```md
   * ::: timeline
   * - title
   *   time="Q1" icon="ri:clockwise-line" line="dashed" type="warning" color="red"
   *
   *   xxx
   * :::
   * ```
   *
   * 是否启用 timeline 语法
   *
   * @default false
   */
  timeline?: boolean

  /**
   * Whether to enable collapse folding panel syntax
   *
   * ```md
   * ::: collapse accordion
   * - + title
   *
   *   content
   *
   * - - title
   *
   *   content
   * :::
   * ```
   *
   * 是否启用 collapse 折叠面板 语法
   *
   * @default false
   */
  collapse?: boolean

  /**
   * Whether to enable chat container syntax
   *
   * ```md
   * ::: chat
   * {:date}
   *
   * {user}
   * message
   *
   * {.}
   * message
   * :::
   * ```
   *
   * 是否启用 chat 容器 语法
   *
   * @default false
   */
  chat?: boolean

  /**
   * Whether to enable field / field-group container
   *
   * 是否启用 field / field-group 容器
   *
   * @default false
   */
  field?: boolean
  // video embed
  /**
   * Whether to enable acfun video embed
   *
   * `@[acfun](acid)`
   *
   * 是否启用 acfun 视频嵌入
   *
   * @default false
   */
  acfun?: boolean
  /**
   * Whether to enable bilibili video embed
   *
   * `@[bilibili](bid)`
   *
   * 是否启用 bilibili 视频嵌入
   *
   * @default false
   */
  bilibili?: boolean
  /**
   * Whether to enable youtube video embed
   *
   * `@[youtube](video_id)`
   *
   * 是否启用 youtube 视频嵌入
   *
   * @default false
   */
  youtube?: boolean

  /**
   * Whether to enable artPlayer video embed
   *
   * `@[artPlayer](url)`
   *
   * 是否启用 artPlayer 视频嵌入
   */
  artPlayer?: boolean

  /**
   * Whether to enable audioReader audio embed
   *
   * `@[audioReader](url)`
   *
   * 是否启用 audioReader 音频嵌入
   */
  audioReader?: boolean

  // code embed
  /**
   * Whether to enable codepen embed
   *
   * `@[codepen](pen_id)`
   *
   * 是否启用 codepen 嵌入
   *
   * @default false
   */
  codepen?: boolean
  /**
   * @deprecated
   */
  replit?: boolean
  /**
   * Whether to enable codeSandbox embed
   *
   * `@[codesandbox](codesandbox_id)`
   *
   * 是否启用 codeSandbox 嵌入
   *
   * @default false
   */
  codeSandbox?: boolean
  /**
   * Whether to enable jsfiddle embed
   *
   * `@[jsfiddle](jsfiddle_id)`
   *
   * 是否启用 jsfiddle 嵌入
   *
   * @default false
   */
  jsfiddle?: boolean

  // container
  /**
   * Whether to enable REPL container syntax
   *
   * 是否启用 REPL 容器语法
   *
   * @default false
   */
  repl?: false | ReplOptions
  /**
   * Whether to enable file tree container syntax
   *
   * 是否启用 文件树 容器语法
   *
   * @default false
   */
  fileTree?: boolean | FileTreeOptions

  /**
   * Whether to enable code tree container syntax and embed syntax
   *
   * ```md
   * ::: code-tree
   * :::
   * ```
   *
   * `@[code-tree](file_path)`
   *
   *
   * 是否启用 代码树 容器语法 和 嵌入语法
   *
   * @default false
   */
  codeTree?: boolean | CodeTreeOptions

  /**
   * Whether to enable demo syntax
   *
   * 是否启用 demo 语法
   */
  demo?: boolean

  /**
   * Whether to enable caniuse embed syntax
   *
   * `@[caniuse](feature_name)`
   *
   * 是否启用 caniuse 嵌入语法
   *
   * @default false
   */
  caniuse?: boolean | CanIUseOptions

  /**
   * Whether to enable table container syntax, providing enhanced functionality for tables
   *
   * - `copy`: Whether to enable copy functionality, supports copying as html format and markdown format
   *
   * 是否启用 table 容器语法，为表格提供增强功能
   *
   * - `copy`: 是否启用复制功能，支持复制为 html 格式 和 markdown 格式
   *
   * @default false
   */
  table?: boolean | TableContainerOptions

  /**
   * Whether to enable QR code embed syntax
   *
   * 是否启用 二维码 嵌入语法
   *
   * @default false
   */
  qrcode?: boolean

  // enhance
  /**
   * Whether to enable automatic filling of image width and height attributes
   *
   * __Please note that regardless of whether it is enabled, this feature only takes effect when building production packages__
   *
   * - If `true`, equivalent to `'local'`
   * - If `local`, only add width and height for local images
   * - If `all`, add width and height for all images (including local and remote)
   *
   * If images load slowly, the process from loading to completion can cause unstable page layout and content flickering.
   * This feature solves this problem by adding `width` and `height` attributes to images.
   *
   * Please use the `all` option with caution. This option will initiate network requests during the build phase,
   * attempting to load remote images to obtain image size information,
   * which may cause build times to become longer (fortunately, obtaining size information only requires loading a few KB of image data packets, so the time consumption will not be too long)
   *
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

  locales?: LocaleConfig<MDPowerLocaleData>
}
