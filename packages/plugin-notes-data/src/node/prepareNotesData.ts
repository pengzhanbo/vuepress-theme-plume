import path from 'node:path'
import type { App } from '@vuepress/core'
import * as chokidar from 'chokidar'
import { createFilter } from 'create-filter'
import type {
  NotesData,
  NotesDataOptions,
  NotesItem,
  NotesSidebar,
  NotesSidebarItem,
} from '../shared/index.js'
import { ensureArray } from './utils.js'

const HMR_CODE = `
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateNotesData) {
    __VUE_HMR_RUNTIME__.updateNotesData(notesData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ notesData }) => {
    __VUE_HMR_RUNTIME__.updateNotesData(notesData)
  })
}
`

interface NotePage {
  relativePath: string
  title: string
  link: string
}

export const prepareNotesData = async (
  app: App,
  { include, exclude, notes, dir, link }: NotesDataOptions
) => {
  if (!notes || notes.length === 0) return
  const filter = createFilter(ensureArray(include), ensureArray(exclude), {
    resolve: false,
  })
  const DIR_PATTERN = new RegExp(`^${path.join(dir, '/')}`)
  const notesPageList: NotePage[] = app.pages
    .filter(
      (page) =>
        page.filePathRelative &&
        page.filePathRelative.startsWith(dir) &&
        filter(page.filePathRelative)
    )
    .map((page) => {
      return {
        relativePath: page.filePathRelative?.replace(DIR_PATTERN, '') || '',
        title: page.title,
        link: page.path,
      }
    })

  const notesData: NotesData = {}
  notes.forEach((note) => {
    notesData[path.join('/', link, note.link)] = initSidebar(
      note,
      notesPageList.filter((page) =>
        page.relativePath.startsWith(note.dir.trim().replace(/^\/|\/$/g, ''))
      )
    )
  })
  let content = `
export const notesData = ${JSON.stringify(notesData, null, 2)}
`
  if (app.env.isDev) {
    content += HMR_CODE
  }

  await app.writeTemp('internal/notesData.js', content)
}

export const watchNotesData = (
  app: App,
  watchers: any[],
  options: NotesDataOptions
): void => {
  if (!options.notes || options.notes.length === 0 || !options.dir) return
  const dir = path.join('pages', options.dir, '**/*')
  const watcher = chokidar.watch(dir, {
    cwd: app.dir.temp(),
    ignoreInitial: true,
  })

  watcher.on('add', () => prepareNotesData(app, options))
  watcher.on('change', () => prepareNotesData(app, options))
  watcher.on('unlink', () => prepareNotesData(app, options))
  watchers.push(watcher)
}

function initSidebar(note: NotesItem, pages: NotePage[]): NotesSidebarItem[] {
  console.log('pages:', pages)
  if (!note.sidebar) return []
  if (note.sidebar === 'auto') return []
  return initSidebarByConfig(note, pages)
}

function initSidebarByConfig(
  { text, link, dir, sidebar }: NotesItem,
  pages: NotePage[]
): NotesSidebarItem[] {
  return (sidebar as NotesSidebar).map((item) => {
    console.log('text: ', text, 's-item: ', item, 'dir: ', dir)
    if (typeof item === 'string') {
      const current = findNotePage(item, dir, pages)
      return {
        text: current?.title || text,
        link: current?.link,
        items: [],
      }
    } else {
      // link = path.join(link || '', item.link || '')
      const current = findNotePage(item.link || '', dir, pages)
      return {
        text: item.text || item.dir || current?.title,
        link: current?.link,
        items: initSidebarByConfig(
          {
            link: item.link || '',
            text: item.text || '',
            sidebar: item.items,
            dir: path.join(dir, item.dir || ''),
          },
          pages
        ),
      }
    }
  })
}

function findNotePage(
  sidebar: string,
  dir: string,
  notePageList: NotePage[]
): NotePage | undefined {
  if (sidebar === '' || sidebar === 'README.md' || sidebar === 'index.md') {
    return notePageList.find((page) => {
      const relative = page.relativePath
      return (
        relative === path.join(dir, 'README.md') ||
        relative === path.join(dir, 'index.md')
      )
    })
  } else {
    return notePageList.find((page) => {
      const relative = page.relativePath
      return (
        relative === path.join(dir, sidebar) ||
        relative === path.join(dir, sidebar + '.md') ||
        page.link === sidebar
      )
    })
  }
}
