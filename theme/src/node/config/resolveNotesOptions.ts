import type { ThemeNoteListOptions, ThemeOptions } from '../../shared/index.js'
import { uniq } from '@pengzhanbo/utils'
import { entries, removeLeadingSlash } from '@vuepress/helper'
import { normalizePath, withBase } from '../utils/index.js'

export function resolveNotesLinkList(options: ThemeOptions): string[] {
  const locales = options.locales || {}
  const notesLinks: string[] = []
  for (const [locale, opt] of entries(locales)) {
    const config = locale === '/' ? (opt.notes || options.notes) : opt.notes
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

export function resolveNotesOptions(options: ThemeOptions): ThemeNoteListOptions[] {
  const locales = options.locales || {}
  const notesOptionsList: ThemeNoteListOptions[] = []
  for (const [locale, opt] of entries(locales)) {
    const current = locale === '/' ? (opt.notes || options.notes) : opt.notes
    if (current) {
      current.dir = withBase(current.dir, locale)
      notesOptionsList.push(current)
    }
  }

  return notesOptionsList
}

export function resolveNotesDirs(options: ThemeOptions): string[] {
  const notesList = resolveNotesOptions(options)
  return uniq(notesList
    .flatMap(({ notes, dir }) =>
      notes.map(note => removeLeadingSlash(normalizePath(`${dir}/${note.dir || ''}/`))),
    ))
}
