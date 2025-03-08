/**
 * 社交链接
 */
export interface SocialLink {
  icon: SocialLinkIcon
  link: string
  ariaLabel?: string
}

/**
 * 社交链接图标
 */
export type SocialLinkIcon = SocialLinkIconUnion | { svg: string, name?: string }

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
