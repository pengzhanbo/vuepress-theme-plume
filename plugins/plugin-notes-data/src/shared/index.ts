export interface NotesDataOptions {
  /**
   * 保存所有笔记的目录
   * @default '/notes'
   */
  dir: string
  /**
   * 所有笔记的默认链接前缀
   * @default '/'
   */
  link: string
  /**
   * global include，只加载需要加载到笔记中的文件
   */
  include?: string | string[]
  /**
   * global exclude，排除不需要加载到笔记中的文件
   */
  exclude?: string | string[]
  /**
   * 笔记配置
   */
  notes: NotesItemOptions[]
}

export type NotesItemOptions = (Omit<NotesItem, 'text'> & { text?: string })

export interface NotesItem {
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
  text: string
  /**
   * 当前笔记的侧边栏配置
   */
  sidebar?: NotesSidebar | 'auto'
}

export type NotesSidebar = (NotesSidebarItem | string)[]

export interface NotesSidebarItem {
  /**
   * 侧边栏文本，如果为空，则使用 `dir`
   */
  text?: string
  /**
   * 侧边栏链接
   */
  link?: string
  /**
   * 次级侧边栏所在目录
   */
  dir?: string
  /**
   * 是否折叠, 未定义时不可折叠
   * @default undefined
   */
  collapsed?: boolean
  /**
   * 次级侧边栏
   */
  items?: NotesSidebar
  /**
   * 侧边栏图标
   */
  icon?: string | { svg: string }
}

export type NotesData = Record<string, NotesSidebarItem[]>
