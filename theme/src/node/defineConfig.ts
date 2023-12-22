import type {
  NotesDataOptions,
  NotesItem,
} from '@vuepress-plume/plugin-notes-data'

export const definePlumeNotesConfig = (
  notes: NotesDataOptions
): NotesDataOptions => notes

export const definePlumeNotesItemConfig = (item: NotesItem): NotesItem => item

export type { NotesDataOptions, NotesItem }
