import type {
  PlumeThemeNotesItem,
  PlumeThemeNotesOptions,
} from '../shared/index.js'

export const definePlumeNotesConfig = (
  notes: PlumeThemeNotesOptions
): PlumeThemeNotesOptions => notes

export const definePlumeNotesItemConfig = (
  item: PlumeThemeNotesItem
): PlumeThemeNotesItem => item
