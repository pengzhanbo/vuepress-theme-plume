export type ThemeImage =
  | string
  | { src: string, alt?: string }
  | { dark: string, light: string, alt?: string }

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

export type SocialLinkIcon = SocialLinkIconUnion | { svg: string }
