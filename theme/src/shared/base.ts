export type PlumeThemeImage =
  | string
  | { src: string, alt?: string }
  | { dark: string, light: string, alt?: string }

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

export type SocialLinkIcon = SocialLinkIconUnion | { svg: string }
