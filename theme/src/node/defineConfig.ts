import type {
  NotesDataOptions,
  NotesItem,
} from '@vuepress-plume/plugin-notes-data'

export function definePlumeNotesConfig(notes: NotesDataOptions): NotesDataOptions {
  return notes
}

export const definePlumeNotesItemConfig = (item: NotesItem): NotesItem => item

export type { NotesDataOptions, NotesItem }
