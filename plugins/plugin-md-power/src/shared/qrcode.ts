export interface QRCodeMeta extends QRCodeProps {
  /**
   * mode: 'card' 的别名
   */
  card?: boolean
}

export interface QRCodeProps {
  /**
   * 二维码标题
   * 作为 HTML 标签的 `title` 属性、`alt` 属性
   */
  title?: string

  /**
   * 二维码内容
   */
  text?: string
  /**
   * 二维码宽度
   */
  width?: number | string

  /**
   * 显示模式
   * - img: 以图片的形式显示二维码
   * - card: 以卡片的形式显示，卡片以左右布局，左侧二维码，右侧 标题 + 内容
   * @default 'img'
   */
  mode?: 'img' | 'card'

  /**
   * 在 card 模式下是否翻转布局
   */
  reverse?: boolean

  /**
   * 二维码的对齐方式
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right'

  /**
   * 是否渲染为 SVG 格式的二维码
   * 默认输出为 PNG 格式的 dataURL
   * @default false
   */
  svg?: boolean
  /**
   * 纠错等级。
   * 可能的取值为低、中、四分位、高，分别对应 L、M、Q、H。
   * @default 'M'
   */
  level?: 'L' | 'M' | 'Q' | 'H' | 'l' | 'm' | 'q' | 'h'
  /**
   * 二维码版本。若未指定，将自动计算更合适的值。
   * 取值范围 1-40
   */
  version?: number
  /**
   * 用于遮蔽符号的掩码模式。
   * 可能的取值为0、1、2、3、4、5、6、7。
   * 若未指定，系统将自动计算更合适的值。
   */
  mask?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  /**
   * 定义静区应有多宽。
   * @default 4
   */
  margin?: number
  /**
   * 缩放因子。值为1表示每个模块（黑点）对应1像素。
   */
  scale?: number

  /**
   * 暗色模块的颜色。值必须为十六进制格式（RGBA）。
   * 注意：暗色应始终比浅色模块的颜色更深。
   * @default '#000000ff'
   */
  light?: string

  /**
   * 亮色模块的颜色。值必须为十六进制格式（RGBA）。
   * 注意：亮色应始终比暗色模块的颜色更浅。
   * @default '#ffffffff'
   */
  dark?: string
}
