import { path } from 'vuepress/utils'
import type { App } from 'vuepress/core'
import * as chokidar from 'chokidar'
import { createFilter } from 'create-filter'
import type {
  NotesData,
  NotesDataOptions,
  NotesItemOptions,
  NotesSidebar,
  NotesSidebarItem,
} from '../shared/index.js'
import { ensureArray, normalizePath } from './utils.js'

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

function resolvedNotesData(app: App, options: NotesDataOptions, result: NotesData) {
  const { include, exclude, notes, dir: _dir, link } = options
  if (!notes || notes.length === 0)
    return
  const dir = normalizePath(_dir)
  const filter = createFilter(ensureArray(include), ensureArray(exclude), {
    resolve: false,
  })
  const DIR_PATTERN = new RegExp(`^${normalizePath(path.join(dir, '/'))}`)
  const notesPageList: NotePage[] = app.pages
    .filter(
      page =>
        page.filePathRelative
        && page.filePathRelative.startsWith(dir)
        && filter(page.filePathRelative),
    )
    .map(page => ({
      relativePath: page.filePathRelative?.replace(DIR_PATTERN, '') || '',
      title: page.title,
      link: page.path,
    }))
  notes.forEach((note) => {
    result[normalizePath(path.join('/', link, note.link))] = initSidebar(
      note,
      notesPageList.filter(page =>
        page.relativePath.startsWith(note.dir.trim().replace(/^\/|\/$/g, '')),
      ),
    )
  })
}

export async function prepareNotesData(app: App, options: NotesDataOptions | NotesDataOptions[]) {
  const notesData: NotesData = {}
  const allOptions = ensureArray<NotesDataOptions>(options)

  allOptions.forEach(option => resolvedNotesData(app, option, notesData))

  let content = `
export const notesData = ${JSON.stringify(notesData, null, 2)}
`
  if (app.env.isDev)
    content += HMR_CODE

  await app.writeTemp('internal/notesData.js', content)
}

export function watchNotesData(app: App, watchers: any[], options: NotesDataOptions | NotesDataOptions[]): void {
  const allOptions = ensureArray<NotesDataOptions>(options)
  if (!allOptions.length)
    return

  const [firstLink, ...links] = allOptions.map(option => option.link).filter(Boolean)

  if (!firstLink)
    return

  const dir = path.join('pages', firstLink, '**/*')
  const watcher = chokidar.watch(dir, {
    cwd: app.dir.temp(),
    ignoreInitial: true,
  })

  links.length && watcher.add(links.map(link => path.join('pages', link, '**/*')))

  watcher.on('add', () => prepareNotesData(app, options))
  watcher.on('change', () => prepareNotesData(app, options))
  watcher.on('unlink', () => prepareNotesData(app, options))
  watchers.push(watcher)
}

function initSidebar(note: NotesItemOptions, pages: NotePage[]): NotesSidebarItem[] {
  if (!note.sidebar)
    return []
  if (note.sidebar === 'auto')
    return initSidebarByAuto(note, pages)
  return initSidebarByConfig(note, pages)
}

function initSidebarByAuto(
  note: NotesItemOptions,
  pages: NotePage[],
): NotesSidebarItem[] {
  let tempPages = pages.map((page) => {
    return { ...page, splitPath: page.relativePath.split('/') }
  })

  const maxIndex = Math.max(...tempPages.map(page => page.splitPath.length))
  let nowIndex = 0

  while (nowIndex < maxIndex) {
    tempPages = tempPages.sort((prev, next) => {
      const pi = prev.splitPath?.[nowIndex]?.match(/(\d+)\.(?=[^/]+$)/)?.[1]
      const ni = next.splitPath?.[nowIndex]?.match(/(\d+)\.(?=[^/]+$)/)?.[1]
      if (!pi || !ni)
        return 0
      return Number.parseFloat(pi) < Number.parseFloat(ni) ? -1 : 1
    })

    nowIndex++
  }

  pages = tempPages.map((page) => {
    delete (page as any).splitPath
    return page
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
    // eslint-disable-next-line no-cond-assign
    while ((dir = paths[index])) {
      const text = dir.replace(/\.md$/, '')
      let current = items.find(item => item.text === text)
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
  { text, dir, sidebar }: NotesItemOptions,
  pages: NotePage[],
): NotesSidebarItem[] {
  return (sidebar as NotesSidebar).map((item) => {
    if (typeof item === 'string') {
      const current = findNotePage(item, dir, pages)
      return {
        text: current?.title || text,
        link: current?.link,
        items: [],
      }
    }
    else {
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
            dir: normalizePath(path.join(dir, item.dir || '')),
          },
          pages,
        ),
      }
    }
  })
}

function findNotePage(
  sidebar: string,
  dir: string,
  notePageList: NotePage[],
): NotePage | undefined {
  if (sidebar === '' || sidebar === 'README.md' || sidebar === 'index.md') {
    return notePageList.find((page) => {
      const relative = page.relativePath
      return (
        relative === normalizePath(path.join(dir, 'README.md'))
        || relative === normalizePath(path.join(dir, 'index.md'))
      )
    })
  }
  else {
    return notePageList.find((page) => {
      const relative = page.relativePath
      return (
        relative === normalizePath(path.join(dir, sidebar))
        || relative === normalizePath(path.join(dir, `${sidebar}.md`))
        || page.link === sidebar
      )
    })
  }
}
