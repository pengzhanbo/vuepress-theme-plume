/**
 * 个人资料
 */
export interface ProfileOptions {
  /**
   * @deprecated 弃用，使用 `avatar` 代替
   * 头像链接
   */
  url?: string

  /**
   * 头像链接地址
   */
  avatar?: string
  /**
   * 名称
   */
  name?: string
  /**
   * 描述
   */
  description?: string
  /**
   * 是否显示为圆形头像
   */
  circle?: boolean

  /**
   * 地理位置
   */
  location?: string

  /**
   * 组织，公司
   */
  organization?: string

  /**
   * 布局位置，左侧或者右侧
   * @default 'right'
   */
  layout?: 'left' | 'right'
}
