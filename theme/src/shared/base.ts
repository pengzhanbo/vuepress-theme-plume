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

export interface PresetLocale extends Record<CopyrightLicense, string> {
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
   * @default 'fade'
   */
  appearance?: boolean | 'fade' | 'circle-clip' | 'horizontal-clip' | 'vertical-clip' | 'skew-clip'
}

export type KnownCopyrightLicense =
  | 'CC-BY-4.0'
  | 'CC-BY-SA-4.0'
  | 'CC-BY-NC-4.0'
  | 'CC-BY-NC-SA-4.0'
  | 'CC-BY-ND-4.0'
  | 'CC-BY-NC-ND-4.0'
  | 'CC0'

export type CopyrightLicense = LiteralUnion<KnownCopyrightLicense>

export interface CopyrightOptions {
  /**
   * 版权信息
   * @see https://creativecommons.org/share-your-work/cclicenses/
   * @default 'CC-BY-4.0'
   */
  license?: CopyrightLicense | { name: string, url: string }
}

export interface CopyrightFrontmatter extends CopyrightOptions {
  /**
   * 作品的作者
   *
   * 如果是 原创，则默认为 contributors 中的第一个，否则需要手动指定
   * @default ''
   */
  author?: string | { name: string, url?: string }

  /**
   * 作品的创作方式
   * @default 'original'
   */
  creation?: 'original' | 'translate' | 'reprint'

  /**
   * 原文地址，非 原创 作品时需要声明原文地址
   * @default ''
   */
  source?: string
}
