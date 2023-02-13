export interface PlumeThemeNotesOptions {
  /**
   * notes 链接前缀
   *
   * 默认： /note/
   */
  link?: string
  /**
   * notes 笔记所在目录
   *
   * 此处配置的为所有笔记的存放目录，
   *
   * 该目录应该在 sourceDir 目录的子目录
   *
   * 目录中的所有文章默认不会出现在 article文章列表之中
   *
   * 默认值： _notes
   */
  dir?: string

  /**
   * 是否可折叠
   *
   * 默认不折叠， 仅对一级有效
   */
  collapsible?: boolean
  /**
   * 笔记集合配置
   *
   * 允许存在多个 note，统一以文件夹形式放在 dir 子级
   */
  notes: PlumeThemeNotesItem[]
}

export interface PlumeThemeNotesItem {
  text: string
  link: string
  dir: string
  sidebar?: PlumeThemeSidebarConfigOptions | 'auto'
}

export type PlumeThemeSidebarConfigOptions = (
  | PlumeThemeNotesConfigItem
  | string
)[]
export interface PlumeThemeNotesConfigItem {
  text: string
  link?: string
  dir?: string
  children: PlumeThemeSidebarConfigOptions
}
