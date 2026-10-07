import type { LocaleData } from 'vuepress'

/**
 * Encrypt Snippet Locale
 *
 * 加密片段本地化
 */
export interface EncryptSnippetLocale extends LocaleData {
  /**
   * Hint message
   *
   * 提示信息
   * @default 'The content is encrypted, please unlock to view.'
   */
  hint?: string
  /**
   * Password placeholder
   *
   * 密码占位符
   * @default 'Enter password'
   */
  placeholder?: string
  /**
   * Unlock button accessible name
   *
   * 解锁按钮的无障碍名称
   * @default 'Unlock'
   */
  unlock?: string
  /**
   * Incorrect password message
   *
   * 密码错误消息
   * @default 'Incorrect password'
   */
  incPwd?: string
  /**
   * No content message
   *
   * 无内容消息
   * @default 'Unlocked, but content failed to load, please try again later.'
   */
  noContent?: string

  /**
   * Security warning title
   *
   * 安全警告标题
   * @default '🚨 Security Warning:'
   */
  warningTitle?: string
  /**
   * Security warning text
   *
   * 安全警告文本
   * @default 'Your connection is not encrypted with HTTPS, posing a risk of content leakage and preventing access to encrypted content.'
   */
  warningText?: string
}

/**
 * Encrypt Snippet Options
 *
 * 加密片段选项
 */
export interface EncryptSnippetOptions {
  /**
   * Default password
   *
   * 默认密码
   */
  password?: string
}
