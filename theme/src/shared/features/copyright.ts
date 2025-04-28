import type { LiteralUnion } from '../utils.js'

/**
 * 内置支持的版权协议
 */
export type KnownCopyrightLicense =
  | 'CC-BY-4.0'
  | 'CC-BY-SA-4.0'
  | 'CC-BY-NC-4.0'
  | 'CC-BY-NC-SA-4.0'
  | 'CC-BY-ND-4.0'
  | 'CC-BY-NC-ND-4.0'
  | 'CC0'

/**
 * 文章版权协议
 *
 * @see https://creativecommons.org/licenses/
 */
export type CopyrightLicense = LiteralUnion<KnownCopyrightLicense>

/**
 * 版权配置
 */
export interface CopyrightOptions {
  /**
   * 版权信息
   * @see https://creativecommons.org/share-your-work/cclicenses/
   * @default 'CC-BY-4.0'
   */
  license?: CopyrightLicense | { name: string, url: string }
  /**
   * 版权所有者
   */
  author?: string | { name: string, url?: string }
  /**
   * 作品的创作方式
   */
  creation?: 'original' | 'translate' | 'reprint'
}
