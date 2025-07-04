import type { SocialLink, ThemeColor } from '../common/index.js'
import type { ThemeNormalFrontmatter } from './normal.js'

/**
 * 友链
 */
export interface FriendsItem {
  /**
   * 友链名称
   */
  name: string
  /**
   * 友链链接
   */
  link: string
  /**
   * 头像
   */
  avatar?: string
  /**
   * 友链描述
   */
  desc?: string
  /**
   * 所在地
   */
  location?: string
  /**
   * 所属组织
   */
  organization?: string
  /**
   * 社交链接
   */
  socials?: SocialLink[]
  /**
   * 背景色
   */
  backgroundColor?: ThemeColor
  /**
   * 文本颜色
   */
  color?: ThemeColor
  /**
   * 名称颜色
   */
  nameColor?: ThemeColor
}

/**
 * 友链分组
 */
export interface FriendGroup {
  /**
   * 友链分组标题
   */
  title?: string
  /**
   * 友链分组描述
   */
  desc?: string
  /**
   * 友链列表
   */
  list?: FriendsItem[]
}

/**
 * 友情链接
 */
export interface ThemeFriendsFrontmatter extends ThemeNormalFrontmatter {
  /**
   * 是否启用友链布局
   * @deprecated
   */
  friends: boolean
  /**
   * 标题
   */
  title?: string
  /**
   * 描述
   */
  description?: string
  /**
   * markdown 内容位置
   */
  contentPosition?: 'before' | 'after'
  /**
   * 友链列表
   */
  list?: FriendsItem[]
  /**
   * 友链分组
   */
  groups?: FriendGroup[]
}
