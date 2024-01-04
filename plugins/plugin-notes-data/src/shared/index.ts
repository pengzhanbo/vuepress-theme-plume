export interface NotesDataOptions {
  dir: string
  link: string
  include?: string | string[]
  exclude?: string | string[]
  notes: NotesItemOptions[]
}

export type NotesItemOptions = (Omit<NotesItem, 'text'> & { text?: string })

export interface NotesItem {
  dir: string
  link: string
  text: string
  sidebar?: NotesSidebar | 'auto'
}

export type NotesSidebar = (NotesSidebarItem | string)[]

export interface NotesSidebarItem {
  text?: string
  link?: string
  dir?: string
  collapsed?: boolean
  items?: NotesSidebar
  icon?: string
}

export type NotesData = Record<string, NotesSidebarItem[]>
