import type { App, Page } from 'vuepress'
import type { NavItem, PlumeThemeHomeConfig, PlumeThemeLocaleOptions, Sidebar } from '../../shared/index.js'
import { getIconContentCSS, getIconData } from '@iconify/utils'
import { isArray, uniq } from '@pengzhanbo/utils'
import { entries, isLinkAbsolute, isLinkHttp, isPlainObject } from '@vuepress/helper'
import { isPackageExists } from 'local-pkg'
import { fs } from 'vuepress/utils'
import { createFsCache, type FsCache, interopDefault, logger, nanoid, perfLog, perfMark, resolveContent, writeTemp } from '../utils/index.js'

interface IconData {
  className: string
  background?: boolean
  content: string
}

type CollectMap = Record<string, string[]>
type IconDataMap = Record<string, IconData>

const ICON_REGEXP = /<(?:VP)?(Icon|Card|LinkCard)([^>]*)>/g
const ICON_NAME_REGEXP = /(?:name|icon)="([^"]+)"/
const URL_CONTENT_REGEXP = /(url\([\s\S]+\))/
const ICONIFY_NAME = /^[\w-]+:[\w-]+$/
const JS_FILENAME = 'internal/iconify.js'
const CSS_FILENAME = 'internal/iconify.css'

const isInstalled = isPackageExists('@iconify/json')
let locate!: ((name: string) => any)

let fsCache: FsCache<IconDataMap> | null = null
// { iconName: { className, content } }
const cache: IconDataMap = {}

function isIconify(icon: any): icon is string {
  if (!icon || typeof icon !== 'string' || isLinkAbsolute(icon) || isLinkHttp(icon))
    return false
  return icon[0] !== '{' && ICONIFY_NAME.test(icon)
}

export async function prepareIcons(app: App, localeOptions: PlumeThemeLocaleOptions) {
  perfMark('prepare:icons:total')
  if (!isInstalled) {
    await writeTemp(app, JS_FILENAME, resolveContent(app, { name: 'icons', content: '{}' }))
    return
  }
  if (!fsCache && app.env.isDev) {
    fsCache = createFsCache(app, 'iconify')
    await fsCache.read()
  }

  perfMark('prepare:pages:icons')
  const iconList: string[] = []
  app.pages.forEach(page => iconList.push(...getIconsWithPage(page)))
  iconList.push(...getIconWithThemeConfig(localeOptions))

  const collectMap: CollectMap = {}
  uniq(iconList).filter((icon) => {
    if (fsCache?.data?.[icon] && !cache[icon])
      cache[icon] = fsCache.data[icon]
    return !cache[icon]
  }).forEach((iconName) => {
    const [collect, name] = iconName.split(':')
    if (!collectMap[collect])
      collectMap[collect] = []

    collectMap[collect].push(name)
  })

  perfLog('prepare:pages:icons', app.env.isDebug)

  perfMark('prepare:icons:imports')

  if (!locate) {
    const mod = await interopDefault(import('@iconify/json'))
    locate = mod.locate
  }

  const unknownList = (await Promise.all(
    entries(collectMap).map(([collect, names]) => resolveCollect(collect, names)),
  )).flat()

  if (unknownList.length) {
    logger.warn(`[iconify] Unknown icons: ${unknownList.join(', ')}`)
  }

  perfLog('prepare:icons:imports', app.env.isDebug)

  let cssCode = ''
  const map: Record<string, string> = {}
  for (const [iconName, { className, content, background }] of entries(cache)) {
    map[iconName] = `${className}${background ? ' bg' : ''}`
    cssCode += `.${className} {\n  --icon: ${content};\n}\n`
  }

  await Promise.all([
    writeTemp(app, CSS_FILENAME, cssCode),
    writeTemp(app, JS_FILENAME, resolveContent(app, {
      name: 'icons',
      content: map,
      before: `import './iconify.css'`,
    })),
  ])

  fsCache?.write(cache)

  perfLog('prepare:icons:total', app.env.isDebug)
}

function getIconsWithPage(page: Page): string[] {
  const list = page.contentRendered
    .match(ICON_REGEXP)
    ?.map(match => match.match(ICON_NAME_REGEXP)?.[1])
    .filter(isIconify) as string[] || []

  const fm = page.frontmatter
  if (fm.icon && isIconify(fm.icon)) {
    list.push(fm.icon)
  }

  if ((fm.home || fm.pageLayout === 'home') && (fm.config as PlumeThemeHomeConfig[])?.length) {
    for (const config of (fm.config as PlumeThemeHomeConfig[])) {
      if (config.type === 'features' && config.features.length) {
        for (const feature of config.features) {
          if (feature.icon && isIconify(feature.icon))
            list.push(feature.icon)
        }
      }
    }
  }

  return list
}

function getIconWithThemeConfig(localeOptions: PlumeThemeLocaleOptions): string[] {
  const list: string[] = []
  // navbar notes sidebar
  const locales = localeOptions.locales || {}
  entries(locales).forEach(([, { navbar, sidebar, notes }]) => {
    if (navbar) {
      list.push(...getIconWithNavbar(navbar))
    }
    const sidebarList: Sidebar[] = Object.values(sidebar || {}) as Sidebar[]
    if (notes) {
      notes.notes.forEach((note) => {
        if (note.sidebar)
          sidebarList.push(note.sidebar)
      })
    }
    sidebarList.forEach(sidebar => list.push(...getIconWithSidebar(sidebar)))
  })

  return list.filter(isIconify)
}

function getIconWithNavbar(navbar: NavItem[]): string[] {
  const list: string[] = []
  navbar.forEach((item) => {
    if (typeof item !== 'string') {
      if (isIconify(item.icon))
        list.push(item.icon)
      if (item.items?.length)
        list.push(...getIconWithNavbar(item.items))
    }
  })
  return list
}

function getIconWithSidebar(sidebar: Sidebar): string[] {
  const list: string[] = []
  if (isArray(sidebar)) {
    sidebar.forEach((item) => {
      if (typeof item !== 'string') {
        if (isIconify(item.icon))
          list.push(item.icon)
        if (item.items?.length)
          list.push(...getIconWithSidebar(item.items))
      }
    })
  }
  else if (isPlainObject(sidebar)) {
    entries(sidebar).forEach(([, item]) => {
      if (typeof item !== 'string') {
        if (isArray(item)) {
          list.push(...getIconWithSidebar(item))
        }
        else if (item.items?.length) {
          list.push(...getIconWithSidebar(item.items))
        }
      }
    })
  }
  return list
}

async function resolveCollect(collect: string, names: string[]) {
  const filepath = locate(collect)
  const config = await readJSON(filepath)

  if (!config) {
    logger.warn(`[iconify] Can not find icon collect: ${collect}!`)
    return []
  }

  const unknownList: string[] = []

  for (const name of names) {
    const data = getIconData(config, name)
    const icon = `${collect}:${name}`
    if (!data) {
      unknownList.push(icon)
    }
    else if (!cache[icon]) {
      const content = getIconContentCSS(data, {
        height: data.height || 24,
      })
      const matched = content.match(URL_CONTENT_REGEXP)?.[1] ?? ''
      /**
       * @see - https://iconify.design/docs/libraries/utils/get-icon-css.html#options
       */
      const background = !data.body.includes('currentColor')
      cache[icon] = {
        className: `vpi-${nanoid()}`,
        background,
        content: matched,
      }
    }
  }
  return unknownList
}

async function readJSON(filepath: string) {
  try {
    return await fs.readJSON(filepath, 'utf-8')
  }
  catch {
    return null
  }
}
