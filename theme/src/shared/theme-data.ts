import type { LocaleConfig } from 'vuepress/shared'
import type { AutoFrontmatter } from './auto-frontmatter.js'
import type { PlumeThemeEncrypt } from './options/encrypt.js'
import type { PlumeThemeLocaleData } from './options/locale.js'

export type ThemeConfig = PlumeThemeLocaleData & {

  locales?: LocaleConfig<Omit<PlumeThemeLocaleData, 'blog'>>

  /**
   * 自动插入 frontmatter
   */
  autoFrontmatter?: false | Omit<AutoFrontmatter, 'frontmatter'>

  /**
   * 站点加密配置
   */
  encrypt?: PlumeThemeEncrypt
}
