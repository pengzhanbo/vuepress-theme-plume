import type { NotesDataOptions } from '@vuepress-plume/plugin-notes-data'
import type { PlumeThemeLocaleOptions } from '../shared/index.js'
import { resolveLocaleOptions } from './resolveLocaleOptions.js'

export function resolveNotesList(options: PlumeThemeLocaleOptions) {
  const locales = options.locales || {}
  const notesList: NotesDataOptions[] = []

  for (const locale of Object.keys(locales)) {
    const notes = resolveLocaleOptions(options, 'notes', locale, false)
    notes && notesList.push(notes)
  }

  return notesList
}
