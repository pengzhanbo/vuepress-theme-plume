import { getIconContentCSS, getIconData } from '@iconify/utils'
import { isArray, isString, uniq } from '@pengzhanbo/utils'
import { entries, isLinkAbsolute, isLinkHttp, isPlainObject } from '@vuepress/helper'
import { isPackageExists } from 'local-pkg'
import { fs } from 'vuepress/utils'
import type { App, Page } from 'vuepress'
import { interopDefault, logger, nanoid, resolveContent, writeTemp } from '../utils/index.js'
import type { NavItem, PlumeThemeLocaleOptions, Sidebar } from '../../shared/index.js'

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
const JS_FILENAME = 'internal/iconify.js'
const CSS_FILENAME = 'internal/iconify.css'

const isInstalled = isPackageExists('@iconify/json')
let locate!: ((name: string) => any)

// { iconName: { className, content } }
const cache: IconDataMap = {}

export async function prepareIcons(app: App, localeOptions: PlumeThemeLocaleOptions) {
  if (!isInstalled) {
    await writeTemp(app, JS_FILENAME, resolveContent(app, { name: 'icons', content: '{}' }))
    return
  }

  const iconList: string[] = []
  app.pages.forEach(page => iconList.push(...getIconsWithPage(page)))
  iconList.push(...getIconWithThemeConfig(localeOptions))

  const collectMap: CollectMap = {}
  uniq(iconList).filter(icon => !cache[icon]).forEach((iconName) => {
    const [collect, name] = iconName.split(':')
    if (!collectMap[collect])
      collectMap[collect] = []

    collectMap[collect].push(name)
  })

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
}

function getIconsWithPage(page: Page): string[] {
  const list = page.contentRendered
    .match(ICON_REGEXP)
    ?.map(match => match.match(ICON_NAME_REGEXP)?.[1])
    .filter(Boolean) as string[] || []

  if (page.frontmatter.icon && isString(page.frontmatter.icon)) {
    list.push(page.frontmatter.icon)
  }

  return list.filter(icon => !isLinkHttp(icon) && !isLinkAbsolute(icon) && icon[0] !== '{')
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

  return list
}

function getIconWithNavbar(navbar: NavItem[]): string[] {
  const list: string[] = []
  navbar.forEach((item) => {
    if (typeof item !== 'string') {
      if (typeof item.icon === 'string' && !isLinkHttp(item.icon) && !isLinkAbsolute(item.icon))
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
        if (typeof item.icon === 'string' && !isLinkHttp(item.icon) && !isLinkAbsolute(item.icon))
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
