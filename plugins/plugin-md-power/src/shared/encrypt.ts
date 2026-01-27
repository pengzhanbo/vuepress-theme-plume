import type { LocaleData } from 'vuepress'

export interface EncryptSnippetLocale extends LocaleData {
  /**
   * @default 'The content is encrypted, please unlock to view.''
   */
  hint?: string
  /**
   * @default 'Enter password'
   */
  placeholder?: string
  /**
   * @default 'Incorrect password'
   */
  incPwd?: string
  /**
   * @default 'Unlocked, but content failed to load, please try again later.'
   */
  noContent?: string

  /**
   * @default '🚨 Security Warning:'
   */
  warningTitle?: string
  /**
   * @default 'Your connection is not encrypted with HTTPS, posing a risk of content leakage and preventing access to encrypted content.'
   */
  warningText?: string
}

export interface EncryptSnippetOptions {
  /**
   * default password
   */
  password?: string
}
