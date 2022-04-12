import type { App, Page } from '@vuepress/core'
import { path } from '@vuepress/utils'
import * as chokidar from 'chokidar'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemeNotesItem,
  PlumeThemeNotesOptions,
  PlumeThemePageData,
  PlumeThemeSidebarConfigOptions,
  SidebarItem,
  SidebarOptions,
} from '../../shared'

const HMR_CODE = `
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSidebarIndex) {
    __VUE_HMR_RUNTIME__.updatePostIndex(sidebarIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ sidebarIndex }) => {
    __VUE_HMR_RUNTIME__.updateSidebarIndex(sidebarIndex)
  })
}
`

interface NotePage {
  relativePath: string[]
  title: string
  link: string
}

export const preparedSidebarIndex = (
  app: App,
  { notes }: PlumeThemeLocaleOptions
): void => {
  const pages = app.pages as Page<PlumeThemePageData>[]
  if (notes === false) return
  const {
    notes: noteList,
    dir: rootDir,
    link: rootLink,
  } = notes as PlumeThemeNotesOptions
  const notePageList: NotePage[] = pages
    .filter((page) => page.filePathRelative?.startsWith(rootDir as string))
    .map((page) => {
      return {
        relativePath: page.filePathRelative?.split('/').slice(1) || [],
        title: page.title,
        link: page.path,
      }
    })

  const sidebarMap: Record<string, SidebarOptions> = {}
  noteList.forEach((note) => {
    sidebarMap[path.join('/', rootLink, note.link)] = noteSidebar(
      note,
      notePageList.filter(
        (page) =>
          page.relativePath?.[0] === note.dir.trim().replace(/^\/|\/$/g, '')
      )
    )
  })

  let content = `
export const sidebarIndex = ${JSON.stringify(sidebarMap, null, 2)}
`
  if (app.env.isDev) {
    content += HMR_CODE
  }

  app.writeTemp('internal/sidebarIndex.js', content)
}

function noteSidebar(
  note: PlumeThemeNotesItem,
  notePageList: NotePage[]
): SidebarOptions {
  if (note.sidebar === undefined) return []
  if (note.sidebar === 'auto') {
    return autoSidebar(note, notePageList)
  }
  return sidebarByConfig(
    note.text,
    note.link,
    note.dir,
    note.sidebar,
    notePageList
  )
}

function autoSidebar(
  note: PlumeThemeNotesItem,
  notePageList: NotePage[]
): SidebarOptions {
  return []
}

function sidebarByConfig(
  text: string,
  link: string | undefined,
  dir: string,
  sidebarConfig: PlumeThemeSidebarConfigOptions,
  notePageList: NotePage[]
): SidebarOptions {
  return sidebarConfig.map((sidebar) => {
    if (typeof sidebar === 'string') {
      const current = findNotePage(sidebar, dir, notePageList)
      return {
        text: current ? current.title : text,
        link: current ? current.link : '',
        children: [],
      } as SidebarItem
    } else {
      link = path.join(link || '', sidebar.link || '')
      const current = sidebar.link
        ? findNotePage(sidebar.link, dir, notePageList)
        : undefined
      return {
        text: sidebar.text || sidebar.dir || '',
        link: current?.link,
        children: sidebarByConfig(
          sidebar.text,
          sidebar.link,
          path.join(dir, sidebar.dir || ''),
          sidebar.children,
          notePageList
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
      const relative = page.relativePath.join('/')
      return (
        relative === path.join(dir, 'README.md') ||
        relative === path.join(dir, 'index.md')
      )
    })
  } else {
    return notePageList.find((page) => {
      const relative = page.relativePath.join('/')
      return (
        relative === path.join(dir, sidebar) ||
        relative === path.join(dir, sidebar + '.md') ||
        page.link === sidebar
      )
    })
  }
}

export const watchSidebarIndex = (
  app: App,
  watchers: any[],
  localeOption: PlumeThemeLocaleOptions
): void => {
  if (!localeOption.notes || !localeOption.notes.dir) return
  const dir = path.join('pages', localeOption.notes.dir, '**/*')
  const watcher = chokidar.watch(dir, {
    cwd: app.dir.temp(),
    ignoreInitial: true,
  })

  watcher.on('add', () => preparedSidebarIndex(app, localeOption))
  watcher.on('change', () => preparedSidebarIndex(app, localeOption))
  watcher.on('unlink', () => preparedSidebarIndex(app, localeOption))
  watchers.push(watcher)
}
