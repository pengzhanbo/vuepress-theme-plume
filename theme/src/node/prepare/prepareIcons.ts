import type { App, Page } from 'vuepress'
import type { IconifyProvider, IconOptions } from 'vuepress-plugin-md-power'
import type { FriendGroup, FriendsItem, SocialLink, ThemeHomeConfig, ThemeNavItem, ThemeOptions, ThemeSidebar } from '../../shared/index.js'
import type { FsCache } from '../utils/index.js'
import { getIconContentCSS, getIconData } from '@iconify/utils'
import { isArray, uniq } from '@pengzhanbo/utils'
import { entries, isLinkAbsolute, isLinkHttp, isPlainObject } from '@vuepress/helper'
import { isPackageExists } from 'local-pkg'
import { fs } from 'vuepress/utils'
import { getThemeConfig } from '../loadConfig/index.js'
import { createFsCache, interopDefault, logger, perf, resolveContent, writeTemp } from '../utils/index.js'

interface IconData {
  className: string
  background?: boolean
  content: string
  collect: string
  name: string
}

interface UsageIcons {
  co: string[]
  bg: Record<number, string[]>
  mask: Record<number, string[]>
}

type CollectMap = Record<string, string[]>
type IconDataMap = Record<string, IconData>

const ICON_REGEXP = /<(?:VP)?(Icon|Card|LinkCard|Button)([^>]*)>/g
const ICON_NAME_REGEXP = /(?:name|icon|suffix-icon)="([^"]+)"/
const URL_CONTENT_REGEXP = /(url\([\s\S]+\))/
const ICONIFY_NAME = /^[\w-]+:[\w-]+$/

const JS_FILENAME = 'internal/iconify.js'
const CSS_FILENAME = 'internal/iconify.css'

const isInstalled = isPackageExists('@iconify/json')
let locate!: ((name: string) => any)

let fsCache: FsCache<IconDataMap> | null = null
// { iconName: { className, content } }
const cache: IconDataMap = {}

// 旧版本内置图标别名，映射回 simple-icons 集合中的名称
const socialFallbacks: Record<string, string> = {
  twitter: 'x',
  weibo: 'sinaweibo',
}

export async function prepareIcons(app: App): Promise<void> {
  perf.mark('prepare:icons:total')
  const options = getThemeConfig()
  const icons: UsageIcons = { co: [], bg: {}, mask: {} }
  if (!isInstalled) {
    await writeTemp(app, JS_FILENAME, resolveContent(app, { name: 'icons', content: icons }))
    return
  }
  if (!fsCache && app.env.isDev) {
    fsCache = createFsCache(app, 'iconify')
    await fsCache.read()
  }

  perf.mark('prepare:pages:icons')

  const iconOptions = (options.markdown?.icon || {}) as IconifyProvider
  const iconList: string[] = []

  // 预加载的图标
  const preload = iconOptions.preload
  if (isArray(preload)) {
    iconList.push(...preload)
  }
  else if (isPlainObject(preload)) {
    const { preflight = [], ...rest } = preload
    iconList.push(...preflight)
    for (const [collect, names] of entries(rest)) {
      iconList.push(...names.map(name => `${collect}:${name}`))
    }
  }

  app.pages.forEach(page => iconList.push(...getIconsWithPage(page, iconOptions)))
  iconList.push(...getIconWithThemeConfig(options, iconOptions))

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

  perf.log('prepare:pages:icons')

  perf.mark('prepare:icons:imports')

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

  perf.log('prepare:icons:imports')

  let cssCode = ''
  for (const [, { className, content, background, collect, name }] of entries(cache)) {
    if (!icons.co.includes(collect))
      icons.co.push(collect)
    const index = icons.co.indexOf(collect)
    const key = background ? 'bg' : 'mask'
    icons[key][index] ??= []
    icons[key][index].push(name)

    cssCode += `.${className} {\n  --icon: ${content};\n}\n`
  }

  await Promise.all([
    writeTemp(app, CSS_FILENAME, cssCode),
    writeTemp(app, JS_FILENAME, resolveContent(app, {
      name: 'icons',
      content: icons,
      before: `import './iconify.css'`,
    })),
  ])

  fsCache?.write(cache)

  perf.log('prepare:icons:total')
}

function isIconify(icon: unknown): icon is string {
  if (!icon || typeof icon !== 'string' || isLinkAbsolute(icon) || isLinkHttp(icon))
    return false
  const ic = icon.trim()
  return ic[0] !== '{' && ICONIFY_NAME.test(ic)
}

function withPrefix(icon: string, prefix?: string): string {
  if (!prefix)
    return icon
  return icon.includes(':') ? icon : `${prefix}:${icon}`
}

function getIconsWithPage(page: Page, { provider = 'iconify', prefix }: IconOptions): string[] {
  const list: string[] = []
  const matches = page.contentRendered.match(ICON_REGEXP) || []
  for (const matched of matches) {
    if (provider === 'iconify' || matched.includes('provider="iconify"')) {
      const icon = matched.match(ICON_NAME_REGEXP)?.[1]
      if (isIconify(icon))
        list.push(withPrefix(icon, prefix))
    }
  }

  const addIcon = (icon: unknown): void => {
    if (icon && isIconify(icon) && (provider === 'iconify' || icon.startsWith('iconify'))) {
      list.push(withPrefix(icon.replace(/^iconify /, ''), prefix))
    }
  }

  const fm = page.frontmatter
  addIcon(fm.icon)

  if ((fm.home || fm.pageLayout === 'home') && (fm.config as ThemeHomeConfig[])?.length) {
    for (const config of (fm.config as ThemeHomeConfig[])) {
      if (config.type === 'features' && config.features.length) {
        for (const feature of config.features) {
          addIcon(feature.icon)
        }
      }
      if (config.type === 'hero' && config.hero?.actions?.length) {
        for (const action of config.hero.actions) {
          addIcon(action.icon)
          addIcon(action.suffixIcon)
        }
      }
    }
  }
  if (fm.pageLayout === 'friends') {
    const socialList: SocialLink[] = []
    if ((fm.list as FriendsItem[])?.length) {
      for (const { socials } of fm.list as FriendsItem[]) {
        socialList.push(...(socials || []))
      }
    }
    if ((fm.groups as FriendGroup[])?.length) {
      for (const { list } of fm.groups as FriendGroup[]) {
        if (!list?.length)
          continue
        for (const { socials } of list as FriendsItem[]) {
          socialList.push(...(socials || []))
        }
      }
    }
    socialList.forEach(social => addIcon(getIconWithSocial(social)))
  }

  return list
}

function getIconWithThemeConfig(options: ThemeOptions, { provider = 'iconify', prefix }: IconOptions): string[] {
  const list: string[] = []
  // navbar /  doc collection sidebar / social
  const locales = options.locales || {}
  entries(locales).forEach(([, { navbar, sidebar, collections, social }]) => {
    // navbar icon
    if (navbar) {
      list.push(...getIconWithNavbar(navbar))
    }
    // social
    const socialList: SocialLink[] = social ? [...social] : []
    // sidebar icon
    const sidebarList: ThemeSidebar[] = Object.values(sidebar || {}) as ThemeSidebar[]

    if (collections?.length) {
      collections.forEach((collection) => {
        if (collection.type === 'doc' && collection.sidebar)
          sidebarList.push(collection.sidebar)

        if (collection.type === 'post' && collection.social)
          socialList.push(...collection.social)
      })
    }
    sidebarList.forEach(sidebar => list.push(...getIconWithSidebar(sidebar)))
    // social
    socialList.forEach(social => list.push(getIconWithSocial(social)))
  })

  const addIcon = (icon: unknown): string | void => {
    if (icon && isIconify(icon) && (provider === 'iconify' || icon.startsWith('iconify'))) {
      return withPrefix(icon.replace(/^iconify /, ''), prefix)
    }
  }

  return list.map(addIcon).filter(Boolean) as string[]
}

function getIconWithNavbar(navbar: ThemeNavItem[]): string[] {
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

function getIconWithSidebar(sidebar: ThemeSidebar): string[] {
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

function getIconWithSocial({ icon }: SocialLink): string {
  if (!icon || typeof icon !== 'string')
    return ''
  const name = socialFallbacks[icon] || icon
  if (name.includes(':'))
    return name
  return `simple-icons:${name}`
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
        className: normalizeClassname(icon),
        background,
        content: matched,
        collect,
        name,
      }
    }
  }
  return unknownList
}

function normalizeClassname(icon: string): string {
  const [collect, name] = icon.split(':')
  return `vpi-${collect}-${name}`
}

async function readJSON(filepath: string) {
  try {
    return await fs.readJSON(filepath, 'utf-8')
  }
  catch {
    return null
  }
}
