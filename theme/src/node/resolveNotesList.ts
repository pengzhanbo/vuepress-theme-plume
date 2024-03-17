import type { NotesDataOptions, NotesSidebar } from '@vuepress-plume/plugin-notes-data'
import type { PlumeThemeLocaleOptions } from '../shared/index.js'
import { resolveLocaleOptions } from './resolveLocaleOptions.js'
import { normalizePath, pathJoin } from './utils.js'

export function resolveNotesList(options: PlumeThemeLocaleOptions) {
  const locales = options.locales || {}
  const notesList: NotesDataOptions[] = []

  for (const locale of Object.keys(locales)) {
    const notes = resolveLocaleOptions(options, 'notes', locale, false)
    if (notes) {
      const dir = normalizePath(`/${notes.dir}`)
      if (!dir.startsWith(locale))
        notes.dir = pathJoin(locale, notes.dir).replace(/^\//, '')

      notesList.push(notes)
    }
  }

  return notesList
}

export function resolveLinkBySidebar(
  sidebar: NotesSidebar,
  prefix: string,
) {
  const res: Record<string, string> = {}

  for (const item of sidebar) {
    if (typeof item !== 'string') {
      const { dir = '', link = '/', items, text = '' } = item
      SidebarLink(items, link, text, pathJoin(prefix, dir), res)
    }
  }
  return res
}

function SidebarLink(items: NotesSidebar | undefined, link: string, text: string, dir = '', res: Record<string, string> = {}) {
  if (!items) {
    res[pathJoin(dir, `${text}.md`)] = link
    return
  }

  for (const item of items) {
    if (typeof item === 'string') {
      if (!link)
        continue
      if (item) {
        res[pathJoin(dir, `${item}.md`)] = link
      }
      else {
        res[pathJoin(dir, 'README.md')] = link
        res[pathJoin(dir, 'index.md')] = link
        res[pathJoin(dir, 'readme.md')] = link
      }
    }
    else {
      const { dir: subDir = '', link: subLink = '/', items: subItems, text: subText = '' } = item
      SidebarLink(subItems, pathJoin(link, subLink), subText, pathJoin(dir, subDir), res)
    }
  }
}
