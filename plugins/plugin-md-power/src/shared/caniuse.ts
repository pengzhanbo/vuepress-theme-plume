export type CanIUseMode = 'embed' | 'image'

export interface CanIUseTokenMeta {
  feature: string
  mode: CanIUseMode
  versions: string
}

export interface CanIUseOptions {
  /**
   * 嵌入模式
   *
   * embed 通过iframe嵌入，提供可交互视图
   *
   * image 通过图片嵌入，静态
   *
   * @default 'embed'
   */
  mode?: CanIUseMode
}
