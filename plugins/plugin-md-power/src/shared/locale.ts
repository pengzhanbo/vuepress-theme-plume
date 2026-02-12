import type { LocaleData } from 'vuepress'
import type { EncryptSnippetLocale } from './encrypt'

export interface MDPowerLocaleData extends LocaleData {
  common?: CommonLocaleData
  encrypt?: EncryptSnippetLocale
}

export interface CommonLocaleData extends LocaleData {
  copy?: string
  copied?: string
}
