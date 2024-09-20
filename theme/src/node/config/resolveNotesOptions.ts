import type { NotesOptions, PlumeThemeLocaleOptions } from '../../shared/index.js'
import { uniq } from '@pengzhanbo/utils'
import { entries, removeLeadingSlash } from '@vuepress/helper'
import { normalizePath, withBase } from '../utils/index.js'

export function resolveNotesLinkList(localeOptions: PlumeThemeLocaleOptions) {
  const locales = localeOptions.locales || {}
  const notesLinks: string[] = []
  for (const [locale, opt] of entries(locales)) {
    const config = locale === '/' ? (opt.notes || localeOptions.notes) : opt.notes
    if (config && config.notes?.length) {
      const prefix = config.link || ''
      notesLinks.push(
        ...config.notes.map(
          note => withBase(`${prefix}/${note.link || ''}`, locale),
        ),
      )
    }
  }

  return uniq(notesLinks)
}

export function resolveNotesOptions(localeOptions: PlumeThemeLocaleOptions): NotesOptions[] {
  const locales = localeOptions.locales || {}
  const notesOptionsList: NotesOptions[] = []
  for (const [locale, opt] of entries(locales)) {
    const options = locale === '/' ? (opt.notes || localeOptions.notes) : opt.notes
    if (options) {
      options.dir = withBase(options.dir, locale)
      notesOptionsList.push(options)
    }
  }

  return notesOptionsList
}

export function resolveNotesDirs(localeOptions: PlumeThemeLocaleOptions): string[] {
  const notesList = resolveNotesOptions(localeOptions)
  return uniq(notesList
    .flatMap(({ notes, dir }) =>
      notes.map(note => removeLeadingSlash(normalizePath(`${dir}/${note.dir || ''}/`))),
    ))
}
