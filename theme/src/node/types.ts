import type { LocaleConfig } from 'vuepress/shared'
import type { AutoFrontmatterOptions, EncryptOptions, PlumeThemeLocaleData } from '../shared/index.js'

export type ThemeConfig = PlumeThemeLocaleData & {

  locales?: LocaleConfig<PlumeThemeLocaleData>

  /**
   * 自动插入 frontmatter
   */
  autoFrontmatter?: false | Omit<AutoFrontmatterOptions, 'frontmatter'>

  /**
   * 站点加密配置
   */
  encrypt?: EncryptOptions
}
