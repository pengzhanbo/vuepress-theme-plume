/**
 * A literal type that supports custom further strings but preserves autocompletion in IDEs.
 *
 * @see [copied from issue](https://github.com/microsoft/TypeScript/issues/29729#issuecomment-471566609)
 */
export type LiteralUnion<Union extends Base, Base = string> =
  | Union
  | (Base & { zz_IGNORE_ME?: never })

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

export interface PresetLocale extends Record<CopyrightLicense, string> {}

export type KnownCopyrightLicense =
  | 'CC-BY-4.0'
  | 'CC-BY-SA-4.0'
  | 'CC-BY-NC-4.0'
  | 'CC-BY-NC-SA-4.0'
  | 'CC-BY-ND-4.0'
  | 'CC-BY-NC-ND-4.0'
  | 'CC0'

export type CopyrightLicense = LiteralUnion<KnownCopyrightLicense>

export type BlogPostCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

export interface BlogPostCover {
  /**
   * 封面图链接地址，只能使用 绝对路径 以及 远程图片地址
   */
  url: string
  /**
   * 博客文章封面图的位置
   */
  layout?: BlogPostCoverLayout
  /**
   * 博客文章封面图的比例
   *
   * @default '4:3'
   */
  ratio?: number | `${number}:${number}` | `${number}/${number}`

  /**
   * 封面图的宽度, 仅在 layout 为 'left' 或 'right' 时生效
   *
   * @default 240
   */
  width?: number
  /**
   * 是否使用紧凑模式，紧凑模式下，封面图紧贴容器边缘
   * @default false
   */
  compact?: boolean
}
