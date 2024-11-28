import type { CopyrightLicense } from '../base.js'

export interface CopyrightOptions {
  /**
   * 版权信息
   * @see https://creativecommons.org/share-your-work/cclicenses/
   * @default 'CC-BY-4.0'
   */
  license?: CopyrightLicense | { name: string, url: string }
}
