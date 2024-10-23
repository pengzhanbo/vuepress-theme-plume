import type { App, Page } from 'vuepress'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePageData,
  ResolvedSidebarItem,
  Sidebar,
  SidebarItem,
  ThemeIcon,
} from '../../shared/index.js'
import {
  entries,
  isArray,
  isPlainObject,
  removeLeadingSlash,
} from '@vuepress/helper'
import { logger, normalizeLink, resolveContent, writeTemp } from '../utils/index.js'

export async function prepareSidebar(app: App, localeOptions: PlumeThemeLocaleOptions) {
  const start = performance.now()
  const sidebar = getAllSidebar(localeOptions)

  const { resolved, autoHome } = getSidebarData(app, sidebar)
  sidebar.__auto__ = resolved
  sidebar.__home__ = autoHome as any
  await writeTemp(app, 'internal/sidebar.js', resolveContent(app, { name: 'sidebar', content: sidebar }))

  if (app.env.isDebug) {
    logger.info(`Generate sidebar: ${(performance.now() - start).toFixed(2)}ms`)
  }
}

function getSidebarData(
  app: App,
  locales: Record<string, Sidebar>,
): { resolved: Sidebar, autoHome: Record<string, string> } {
  const autoDirList: string[] = []
  const resolved: Sidebar = {}

  entries(locales).forEach(([localePath, sidebar]) => {
    if (!sidebar)
      return

    if (isArray(sidebar)) {
      autoDirList.push(...findAutoDirList(sidebar))
    }
    else if (isPlainObject(sidebar)) {
      entries(sidebar).forEach(([dirname, config]) => {
        const prefix = normalizeLink(localePath, dirname)
        if (config === 'auto') {
          autoDirList.push(prefix)
        }
        else if (isArray(config)) {
          autoDirList.push(...findAutoDirList(config, prefix))
        }
        else if (config.items === 'auto') {
          autoDirList.push(normalizeLink(prefix, config.prefix))
        }
        else {
          autoDirList.push(
            ...findAutoDirList(
              config.items || [],
              normalizeLink(prefix, config.prefix),
            ),
          )
        }
      })
    }
    else if (sidebar === 'auto') {
      autoDirList.push(localePath)
    }
  })

  const autoHome: Record<string, string> = {}
  autoDirList.forEach((localePath) => {
    const { link, sidebar } = getAutoDirSidebar(app, localePath)
    resolved[localePath] = sidebar
    if (link) {
      autoHome[localePath] = link
    }
  })

  return { resolved, autoHome }
}

const MD_RE = /\.md$/
const NUMBER_RE = /^\d+\./
function resolveTitle(dirname: string) {
  return dirname
    .replace(MD_RE, '')
    .replace(NUMBER_RE, '')
}

function getAutoDirSidebar(
  app: App,
  localePath: string,
): { link: string, sidebar: SidebarItem[] } {
  const locale = removeLeadingSlash(localePath)
  let pages = (app.pages as Page<PlumeThemePageData>[])
    .filter(page => page.data.filePathRelative?.startsWith(locale))
    .map((page) => {
      return { ...page, splitPath: page.data.filePathRelative?.split('/') || [] }
    })

  const maxIndex = Math.max(...pages.map(page => page.splitPath.length))
  let nowIndex = 0

  while (nowIndex < maxIndex) {
    pages = pages.sort((prev, next) => {
      const pi = prev.splitPath?.[nowIndex]?.match(/(?:(\d+)\.)?(?=[^/]+$)/)?.[1]
      const ni = next.splitPath?.[nowIndex]?.match(/(?:(\d+)\.)?(?=[^/]+$)/)?.[1]
      if (!pi || !ni)
        return 0
      return Number.parseFloat(pi) < Number.parseFloat(ni) ? -1 : 1
    })

    nowIndex++
  }

  const RE_INDEX = ['index.md', 'README.md', 'readme.md']

  const sidebar: ResolvedSidebarItem[] = []
  let rootLink = ''
  for (const page of pages) {
    const { data, title, path, frontmatter } = page
    const paths = (data.filePathRelative || '')
      .slice(localePath.replace(/^\/|\/$/g, '').length + 1)
      .split('/')

    let index = 0
    let dir: string
    let items = sidebar
    let parent: ResolvedSidebarItem | undefined
    // eslint-disable-next-line no-cond-assign
    while ((dir = paths[index])) {
      const text = resolveTitle(dir)
      const isHome = RE_INDEX.includes(dir)
      let current = items.find(item => item.text === text)
      if (!current) {
        current = { text, link: undefined, items: [] } as ResolvedSidebarItem
        if (!isHome) {
          items.push(current)
        }
      }
      if (dir.endsWith('.md')) {
        if (isHome) {
          if (parent) {
            parent.link = path
          }
          else {
            rootLink = path
          }
        }
        else {
          current.link = path
          current.text = title
        }
      }
      if (frontmatter.icon) {
        current.icon = frontmatter.icon as ThemeIcon
      }
      if (parent?.items?.length) {
        parent.collapsed = false
      }
      parent = current
      items = current.items as ResolvedSidebarItem[]
      index++
    }
  }
  return { link: rootLink, sidebar }
}

function findAutoDirList(sidebar: (string | SidebarItem)[], prefix = ''): string[] {
  const list: string[] = []
  if (!sidebar.length)
    return list

  sidebar.forEach((item) => {
    if (isPlainObject(item)) {
      const nextPrefix = normalizeLink(prefix, item.prefix || item.dir)
      if (item.items === 'auto') {
        list.push(nextPrefix)
      }
      else if (item.items?.length) {
        list.push(...findAutoDirList(item.items, nextPrefix))
      }
    }
  })

  return list
}

function getAllSidebar(localeOptions: PlumeThemeLocaleOptions): Record<string, Sidebar> {
  const locales: Record<string, Sidebar> = {}

  for (const [locale, opt] of entries(localeOptions.locales || {})) {
    const notes = locale === '/' ? (opt.notes || localeOptions.notes) : opt.notes
    const sidebar = locale === '/' ? (opt.sidebar || localeOptions.sidebar) : opt.sidebar
    locales[locale] = {}
    for (const [key, value] of entries(sidebar || {})) {
      locales[locale][normalizeLink(key)] = value
    }

    if (notes && notes.notes?.length) {
      const prefix = notes.link || ''
      for (const note of notes.notes) {
        if (note.sidebar) {
          locales[locale][normalizeLink(prefix, note.link || '/')] = {
            items: note.sidebar,
            prefix: normalizeLink(notes.dir, note.dir),
          }
        }
      }
    }
  }

  return locales
}
