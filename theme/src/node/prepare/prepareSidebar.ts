import type { App, Page } from 'vuepress'
import {
  entries,
  isArray,
  isPlainObject,
  removeLeadingSlash,
} from '@vuepress/helper'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePageData,
  Sidebar,
  SidebarItem,
  ThemeIcon,
} from '../../shared/index.js'
import { normalizeLink, resolveContent, writeTemp } from '../utils/index.js'
import type { ResolvedSidebarItem } from '../../shared/resolved/sidebar.js'

export async function prepareSidebar(app: App, localeOptions: PlumeThemeLocaleOptions) {
  const sidebar = getAllSidebar(localeOptions)
  sidebar.__auto__ = getSidebarData(app, sidebar)
  await writeTemp(app, 'internal/sidebar.js', resolveContent(app, { name: 'sidebar', content: sidebar }))
}

function getSidebarData(
  app: App,
  locales: Record<string, Sidebar>,
): Sidebar {
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
        config === 'auto'
          ? autoDirList.push(prefix)
          : isArray(config)
            ? autoDirList.push(...findAutoDirList(config, prefix))
            : config.items === 'auto'
              ? autoDirList.push(normalizeLink(prefix, config.prefix))
              : autoDirList.push(
                ...findAutoDirList(
                  config.items || [],
                  normalizeLink(prefix, config.prefix),
                ),
              )
      })
    }
    else if (sidebar === 'auto') {
      autoDirList.push(localePath)
    }
  })

  autoDirList.forEach((localePath) => {
    resolved[localePath] = getAutoDirSidebar(app, localePath)
  })

  return resolved
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
): SidebarItem[] {
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
      const pi = prev.splitPath?.[nowIndex]?.match(/(\d+)\.(?=[^/]+$)/)?.[1]
      const ni = next.splitPath?.[nowIndex]?.match(/(\d+)\.(?=[^/]+$)/)?.[1]
      if (!pi || !ni)
        return 0
      return Number.parseFloat(pi) < Number.parseFloat(ni) ? -1 : 1
    })

    nowIndex++
  }

  const RE_INDEX = ['index.md', 'README.md', 'readme.md']

  const result: ResolvedSidebarItem[] = []
  for (const page of pages) {
    const { data, title, path, frontmatter } = page
    const paths = (data.filePathRelative || '')
      .slice(localePath.replace(/^\/|\/$/g, '').length + 1)
      .split('/')

    let index = 0
    let dir: string
    let items = result
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
        else {
          !parent && items.unshift(current)
        }
      }
      if (dir.endsWith('.md')) {
        if (isHome && parent) {
          parent.link = path
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
        parent.collapsed = true
      }
      parent = current
      items = current.items as ResolvedSidebarItem[]
      index++
    }
  }
  return result
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
      else {
        item.items?.length
        && list.push(...findAutoDirList(item.items, nextPrefix))
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
    locales[locale] = { ...sidebar }

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
