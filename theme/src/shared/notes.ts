import type { SidebarItem } from './sidebar.js'

export interface NotesOptions {
  /**
   * 保存所有笔记的目录
   * @default '/notes/'
   */
  dir: string
  /**
   * 所有笔记的默认链接前缀
   * @default '/'
   */
  link: string
  /**
   * 笔记配置
   */
  notes: NoteItem[]
}

export interface NoteItem {
  /**
   * 保存笔记的目录
   */
  dir: string
  /**
   * 当前笔记的链接前缀，将会与 `notes.link` 合并
   */
  link: string
  /**
   * 当前笔记名称
   */
  text?: string
  /**
   * 当前笔记的侧边栏配置
   */
  sidebar?: 'auto' | (string | SidebarItem)[]
}
