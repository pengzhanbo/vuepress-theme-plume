import type { App, Page } from 'vuepress'
import type {
  ResolvedSidebarItem,
  ThemeDocCollection,
  ThemeIcon,
  ThemeOptions,
  ThemePageData,
  ThemeSidebar,
  ThemeSidebarData,
  ThemeSidebarItem,
} from '../../shared/index.js'
import { deleteKey, isArray, isPlainObject, objectEntries } from '@pengzhanbo/utils'
import { ensureLeadingSlash, removeLeadingSlash } from '@vuepress/helper'
import { findCollection } from '../collections/index.js'
import { getThemeConfig } from '../loadConfig/index.js'
import { normalizeLink, perf, resolveContent, writeTemp } from '../utils/index.js'

/**
 * Prepare sidebar data
 *
 * 准备侧边栏数据，处理所有语言环境的侧边栏配置并生成临时文件
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeConfig()` / 主题配置，默认从 `getThemeConfig()` 读取
 */
export async function prepareSidebar(app: App, options: ThemeOptions = getThemeConfig()): Promise<void> {
  perf.mark('prepare:sidebar')
  const locales = getAllSidebar(options)

  const { auto, home } = getSidebarData(app, locales, options)
  const data: ThemeSidebarData = { locales, auto, home }
  await writeTemp(app, 'internal/sidebar.js', resolveContent(app, { name: 'sidebar', content: data }))

  perf.log('prepare:sidebar')
}

function getSidebarData(
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
  return { link: rootLink, sidebar: cleanSidebar(sidebar) }
}

function cleanSidebar(sidebar: ResolvedSidebarItem[]): ResolvedSidebarItem[] {
  for (const item of sidebar) {
    if (isPlainObject(item)) {
      if (isArray(item.items)) {
        if (item.items.length === 0) {
          deleteKey(item, ['items', 'collapsed'])
        }
        else {
          cleanSidebar(item.items)
        }
      }
      else if (!('items' in item)) {
        deleteKey(item, 'collapsed')
      }
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

function getAllSidebar(options: ThemeOptions): Record<string, ThemeSidebar> {
  const locales: Record<string, ThemeSidebar> = {}

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
