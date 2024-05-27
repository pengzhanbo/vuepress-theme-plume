import type { NotesDataOptions } from '@vuepress-plume/plugin-notes-data'
import { entries } from '@vuepress/helper'
import { uniq } from '@pengzhanbo/utils'
import type { PlumeThemeLocaleOptions } from '../..//shared/index.js'
import { withBase } from '../utils.js'

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

export function resolveNotesOptions(localeOptions: PlumeThemeLocaleOptions): NotesDataOptions[] {
  const locales = localeOptions.locales || {}
  const notesOptionsList: NotesDataOptions[] = []
  for (const [locale, opt] of entries(locales)) {
    const options = locale === '/' ? (opt.notes || localeOptions.notes) : opt.notes
    if (options) {
      options.dir = withBase(options.dir, locale)
      notesOptionsList.push(options)
    }
  }

  return notesOptionsList
}
