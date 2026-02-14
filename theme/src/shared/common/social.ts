import type { LiteralUnion } from '../utils.js'
/**
 * Social link
 *
 * 社交链接
 */
export interface SocialLink {
  icon: SocialLinkIcon
  link: string
  ariaLabel?: string
}

/**
 * Social link icon
 *
 * 社交链接图标
 */
export type SocialLinkIcon = LiteralUnion<SocialLinkIconUnion> | { svg: string, name?: string }

/**
 * Social link icon type
 *
 * 社交链接图标类型
 */
export type SocialLinkIconUnion
  = | 'discord'
    | 'telegram'
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
    | 'tiktok'
    | 'kuaishou'
    | 'bytedance'
    | 'xiaohongshu'
    | 'bluesky'
    | 'gmail'
