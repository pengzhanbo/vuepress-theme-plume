export type ThemeImage =
  | string
  | { src: string, alt?: string }
  | { dark: string, light: string, alt?: string }

export type ThemeIcon = string | { svg: string }

export type ThemeColor = string | { light: string, dark: string }

export type ThemeOutline = false | number | [number, number] | 'deep'

export interface SocialLink {
  icon: SocialLinkIcon
  link: string
  ariaLabel?: string
}

export type SocialLinkIconUnion =
  | 'discord'
  | 'facebook'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'mastodon'
  | 'npm'
  | 'slack'
  | 'twitter'
  | 'x'
  | 'youtube'
  | 'qq'
  | 'weibo'
  | 'bilibili'
  | 'gitlab'
  | 'docker'
  | 'juejin'
  | 'zhihu'
  | 'douban'
  | 'steam'
  | 'stackoverflow'
  | 'xbox'

export type SocialLinkIcon = SocialLinkIconUnion | { svg: string, name?: string }

export interface PresetLocale {
  home: string
  blog: string
  tag: string
  archive: string
  category: string
  archiveTotal: string
}

export interface ThemeTransition {
  /**
   * 是否启用 页面间跳转过渡动画
   * @default true
   */
  page?: boolean
  /**
   * 是否启用 博客文章列表过渡动画
   * @default true
   */
  postList?: boolean
  /**
   * 是否启用 深色/浅色 模式切换过渡动画
   * @default true
   */
  appearance?: boolean
}
