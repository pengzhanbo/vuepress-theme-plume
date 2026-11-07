import type { App, Page } from 'vuepress'
import type {
  ResolvedSidebarItem,
  ThemeDocCollection,
  ThemeIcon,
  ThemeOptions,
  ThemePageData,
  ThemeSidebar,
  ThemeSidebarItem,
} from '../../shared/index.js'
import { deleteKey, isArray, isPlainObject, objectEntries } from '@pengzhanbo/utils'
import { ensureLeadingSlash, removeLeadingSlash } from '@vuepress/helper'
import { normalizeLink } from '../utils/index.js'
import { findCollection } from './collections/index.js'

export function getSidebarData(
  app: App,
  locales: Record<string, ThemeSidebar>,
  options: ThemeOptions,
): { auto: Record<string, ResolvedSidebarItem[]>, home: Record<string, string> } {
  const autoDirList: string[] = []
  const auto: Record<string, ResolvedSidebarItem[]> = {}

  objectEntries(locales).forEach(([localePath, sidebar]) => {
    if (!sidebar)
      return

    if (isArray(sidebar)) {
      autoDirList.push(...findAutoDirList(sidebar))
    }
    else if (isPlainObject(sidebar)) {
      objectEntries(sidebar).forEach(([dirname, config]) => {
        const prefix = normalizeLink(localePath, removeLeadingSlash(dirname))
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

  const home: Record<string, string> = {}
  autoDirList.forEach((localePath) => {
    const { link, sidebar } = getAutoDirSidebar(app, localePath, options)
    auto[localePath] = sidebar
    if (link) {
      home[localePath] = link
    }
  })

  return { auto, home }
}

const MD_RE = /\.md$/
const NUMBER_RE = /^\d+\./
function resolveTitle(dirname: string) {
  return dirname
    .replace(MD_RE, '')
    .replace(NUMBER_RE, '')
}

const RE_FILE_SORTING = /(?:(\d+)\.)?(?=[^/]+$)/
function fileSorting(filepath?: string): number | false {
  if (!filepath)
    return false
  const matched = filepath.match(RE_FILE_SORTING)
  const sorted = matched ? Number(matched[1]) : 0
  if (Number.isNaN(sorted))
    return Number.MAX_SAFE_INTEGER
  return sorted
}

function getAutoDirSidebar(
  app: App,
  prefix: string,
  options: ThemeOptions,
): { link: string, sidebar: ResolvedSidebarItem[] } {
  const rootPath = removeLeadingSlash(prefix)
  let pages = (app.pages as Page<ThemePageData>[])
    .filter(page => page.data.filePathRelative?.startsWith(rootPath))
    .map((page) => {
      return { ...page, splitPath: page.data.filePathRelative?.split('/') || [] }
    })
  const maxIndex = Math.max(...pages.map(page => page.splitPath.length))
  let nowIndex = maxIndex - 1
  while (nowIndex >= 0) {
    pages = pages.sort((prev, next) => {
      const pi = fileSorting(prev.splitPath?.[nowIndex])
      const ni = fileSorting(next.splitPath?.[nowIndex])
      if (pi === false || ni === false)
        return 0
      if (pi === ni)
        return 0
      return pi < ni ? -1 : 1
    })

    nowIndex--
  }

  const RE_INDEX = ['index.md', 'README.md', 'readme.md']

  const sidebar: ResolvedSidebarItem[] = []
  let rootLink = ''
  const root = rootPath.replace(/^\/|\/$/g, '')

  for (const page of pages) {
    const { data, title, path, frontmatter } = page
    const paths = (data.filePathRelative || '')
      .slice(root ? root.length + 1 : 0)
      .split('/')
    const collection = findCollection(page, options) as ThemeDocCollection | undefined
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
        current = { text, link: undefined, items: [], collapsed: collection?.sidebarCollapsed } as ResolvedSidebarItem
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
      if (frontmatter.icon && dir.endsWith('.md')) {
        current.icon = frontmatter.icon as ThemeIcon
      }
      if (parent?.items?.length) {
        parent.collapsed ??= false
      }
      parent = current
      items = current.items as ResolvedSidebarItem[]
      index++
    }
  }
  return { link: rootLink, sidebar: cleanSidebarItems(sidebar) }
}

/**
 * The minimal shape of a sidebar item that needs cleaning
 *
 * 需要清理的侧边栏项的最小结构
 */
interface CleanableSidebarItem {
  items?: unknown
  collapsed?: boolean
}

/**
 * Clean up the sidebar items: remove the empty `items` and the redundant `collapsed`
 *
 * 清理侧边栏项：移除空的 `items` 与多余的 `collapsed`
 */
export function cleanSidebarItems<T>(sidebar: T[]): T[] {
  for (const item of sidebar) {
    if (!isPlainObject(item))
      continue

    const node = item as CleanableSidebarItem
    if (isArray(node.items)) {
      if (node.items.length === 0) {
        deleteKey(node, ['items', 'collapsed'])
      }
      else {
        cleanSidebarItems(node.items)
      }
    }
    else if (!('items' in node)) {
      deleteKey(node, 'collapsed')
    }
  }
  return sidebar
}

function findAutoDirList(sidebar: (string | ThemeSidebarItem)[], prefix = ''): string[] {
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

/**
 * The normalized sidebar config of a locale
 *
 * 归一化后的侧边栏配置
 */
export interface ResolvedSidebarConfig {
  items: 'auto' | (string | ThemeSidebarItem)[]
  prefix: string
}

/**
 * The normalized sidebar config of all locales
 *
 * 所有语言环境的归一化侧边栏配置
 */
export type ThemeSidebarLocales = Record<string, Record<string, ResolvedSidebarConfig>>

export function getAllSidebar(options: ThemeOptions): ThemeSidebarLocales {
  const locales: ThemeSidebarLocales = {}

  for (const [locale, opt] of objectEntries(options.locales || {})) {
    const rawCollections = locale === '/' ? (opt.collections || options.collections) : opt.collections
    const sidebar = locale === '/' ? (opt.sidebar || options.sidebar) : opt.sidebar
    locales[locale] = {}
    for (const [key, value] of objectEntries(sidebar || {})) {
      locales[locale][ensureLeadingSlash(key)] = isPlainObject(value) && 'items' in value
        ? { ...value, prefix: value.prefix?.startsWith('/') ? value.prefix : normalizeLink(locale, removeLeadingSlash(key)) }
        : {
            items: value,
            prefix: normalizeLink(locale, removeLeadingSlash(key)),
          }
    }
    const collections = rawCollections?.filter(item => item.type === 'doc')
    if (collections?.length) {
      for (const collection of collections) {
        if (collection.sidebar) {
          locales[locale][normalizeLink(collection.linkPrefix || collection.dir)] = {
            items: collection.sidebar,
            prefix: normalizeLink(locale, removeLeadingSlash(collection.dir)),
          }
        }
      }
    }
  }

  return locales
}
