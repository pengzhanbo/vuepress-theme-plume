/**
 * QR code metadata
 *
 * 二维码元数据
 */
export interface QRCodeMeta extends QRCodeProps {
  /**
   * Alias for mode: 'card'
   *
   * mode: 'card' 的别名
   */
  card?: boolean
}

/**
 * QR code props
 *
 * 二维码属性
 */
export interface QRCodeProps {
  /**
   * QR code title
   * Used as HTML `title` and `alt` attributes
   *
   * 二维码标题
   * 作为 HTML 标签的 `title` 属性、`alt` 属性
   */
  title?: string

  /**
   * QR code content
   *
   * 二维码内容
   */
  text?: string
  /**
   * QR code width
   *
   * 二维码宽度
   */
  width?: number | string

  /**
   * Display mode
   * - img: Display QR code as image
   * - card: Display as card with left-right layout, QR code on left, title + content on right
   * @default 'img'
   *
   * 显示模式
   * - img: 以图片的形式显示二维码
   * - card: 以卡片的形式显示，卡片以左右布局，左侧二维码，右侧 标题 + 内容
   * @default 'img'
   */
  mode?: 'img' | 'card'

  /**
   * Whether to reverse layout in card mode
   *
   * 在 card 模式下是否翻转布局
   */
  reverse?: boolean

  /**
   * QR code alignment
   * @default 'left'
   *
   * 二维码的对齐方式
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right'

  /**
   * Whether to render as SVG format
   * Default output is PNG format dataURL
   * @default false
   *
   * 是否渲染为 SVG 格式的二维码
   * 默认输出为 PNG 格式的 dataURL
   * @default false
   */
  svg?: boolean
  /**
   * Error correction level.
   * Possible values: Low, Medium, Quartile, High, corresponding to L, M, Q, H.
   * @default 'M'
   *
   * 纠错等级。
   * 可能的取值为低、中、四分位、高，分别对应 L、M、Q、H。
   * @default 'M'
   */
  level?: 'L' | 'M' | 'Q' | 'H' | 'l' | 'm' | 'q' | 'h'
  /**
   * QR code version. If not specified, will automatically calculate more suitable value.
   * Range: 1-40
   *
   * 二维码版本。若未指定，将自动计算更合适的值。
   * 取值范围 1-40
   */
  version?: number
  /**
   * Mask pattern used to mask symbols.
   * Possible values: 0, 1, 2, 3, 4, 5, 6, 7.
   * If not specified, system will automatically calculate more suitable value.
   *
   * 用于遮蔽符号的掩码模式。
   * 可能的取值为0、1、2、3、4、5、6、7。
   * 若未指定，系统将自动计算更合适的值。
   */
  mask?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  /**
   * Define how wide the quiet zone should be.
   * @default 4
   *
   * 定义静区应有多宽。
   * @default 4
   */
  margin?: number
  /**
   * Scale factor. Value of 1 means 1 pixel per module (black dot).
   *
   * 缩放因子。值为1表示每个模块（黑点）对应1像素。
   */
  scale?: number

  /**
   * Color of dark modules. Value must be in hexadecimal format (RGBA).
   * Note: Dark should always be darker than light module color.
   * @default '#000000ff'
   *
   * 暗色模块的颜色。值必须为十六进制格式（RGBA）。
   * 注意：暗色应始终比浅色模块的颜色更深。
   * @default '#000000ff'
   */
  light?: string

  /**
   * Color of light modules. Value must be in hexadecimal format (RGBA).
   * Note: Light should always be lighter than dark module color.
   * @default '#ffffffff'
   *
   * 亮色模块的颜色。值必须为十六进制格式（RGBA）。
   * 注意：亮色应始终比暗色模块的颜色更浅。
   * @default '#ffffffff'
   */
  dark?: string
}
