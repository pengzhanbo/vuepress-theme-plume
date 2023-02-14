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
  if (!note.sidebar) return []
  if (note.sidebar === 'auto') return initSidebarByAuto(note, pages)
  return initSidebarByConfig(note, pages)
}

function initSidebarByAuto(
  note: NotesItem,
  pages: NotePage[]
): NotesSidebarItem[] {
  pages = pages.sort((prev, next) => {
    const pi = prev.relativePath.match(/\//g)?.length || 0
    const ni = next.relativePath.match(/\//g)?.length || 0
    return pi < ni ? -1 : 1
  })
  const RE_INDEX = ['index.md', 'README.md', 'readme.md']
  const result: NotesSidebarItem[] = []
  for (const page of pages) {
    const { relativePath, title, link } = page
    const paths = relativePath
      .slice(note.dir.replace(/^\/|\/$/g, '').length + 1)
      .split('/')
    let index = 0
    let dir: string
    let items = result
    while ((dir = paths[index])) {
      const text = dir.replace(/\.md$/, '')
      let current = items.find((item) => item.text === text)
      if (!current) {
        current = { text, link: undefined, items: [] }
        !RE_INDEX.includes(dir) ? items.push(current) : items.unshift(current)
      }
      if (dir.endsWith('.md')) {
        current.link = link
        current.text = title
      }
      items = current.items as NotesSidebarItem[]
      index++
    }
  }
  return result
}

function initSidebarByConfig(
  { text, dir, sidebar }: NotesItem,
  pages: NotePage[]
): NotesSidebarItem[] {
  return (sidebar as NotesSidebar).map((item) => {
    if (typeof item === 'string') {
      const current = findNotePage(item, dir, pages)
      return {
        text: current?.title || text,
        link: current?.link,
        items: [],
      }
    } else {
      const current = findNotePage(item.link || '', dir, pages)
      return {
        text: item.text || item.dir || current?.title,
        collapsed: item.collapsed,
        link: item.link,
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
