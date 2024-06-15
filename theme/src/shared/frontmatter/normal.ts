import type { PageFrontmatter } from 'vuepress'

export interface PlumeNormalFrontmatter extends PageFrontmatter {

  /**
   * @deprecated
   *
   * 使用 pageLayout = 'home' 代替
   */
  home?: boolean

  /**
   * @deprecated
   *
   * 使用 pageLayout = 'friends' 代替
   */
  friends?: boolean

  /**
   * page layout
   */
  pageLayout?: false | 'home' | 'doc' | 'custom' | 'page' | 'friends'

  /**
   * 自定义页面 class
   */
  pageClass?: string

  /**
   * 是否显示返回顶部按钮
   */
  backToTop?: boolean

  /**
   * 当前页面是否显示 外部链接图标
   */
  externalLinkIcon?: boolean

  /**
   * @deprecated 使用 `externalLinkIcon` 代替
   */
  externalLink?: boolean
}
