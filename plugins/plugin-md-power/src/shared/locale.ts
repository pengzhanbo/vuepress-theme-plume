import type { LocaleData } from 'vuepress'
import type { EncryptSnippetLocale } from './encrypt'

export interface MDPowerLocaleData extends LocaleData {
  encrypt?: EncryptSnippetLocale
}
