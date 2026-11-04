import type { Page } from 'vuepress'
import type { IconOptions } from 'vuepress-plugin-md-power'
import type {
  FriendGroup,
  FriendsItem,
  SocialLink,
  ThemeHomeConfig,
  ThemeNavItem,
  ThemeOptions,
  ThemeSidebar,
} from '../../shared/index.js'
import { isArray, isPlainObject, isString, objectEntries } from '@pengzhanbo/utils'
import { isLinkAbsolute, isLinkHttp } from '@vuepress/helper'

const ICON_REGEXP = /<(?:VP)?(Icon|Card|LinkCard|Button)([^>]*)>/g
const ICON_NAME_REGEXP = /(?:name|icon|suffix-icon)="([^"]+)"/
const ICONIFY_NAME = /^(?:iconify\s+)?[\w-]+:[\w-]+$/

// 旧版本内置图标别名，映射回 simple-icons 集合中的名称
const socialFallbacks: Record<string, string> = {
  twitter: 'x',
  weibo: 'sinaweibo',
}

function isIconify(icon: unknown): icon is string {
  if (!icon || !isString(icon) || isLinkAbsolute(icon) || isLinkHttp(icon))
    return false
  const ic = icon.trim()
  return ic[0] !== '{' && ICONIFY_NAME.test(ic)
}

function withPrefix(icon: string, prefix?: string): string {
  icon = icon.replace(/^iconify /, '')
  if (!prefix)
    return icon
  return icon.includes(':') ? icon : `${prefix}:${icon}`
}

export function getIconsWithPage(page: Page, { provider = 'iconify', prefix }: IconOptions): string[] {
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
      list.push(withPrefix(icon, prefix))
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
      if ((config.type === 'hero' || config.type === 'doc-hero') && config.hero?.actions?.length) {
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

export function getIconWithThemeConfig(options: ThemeOptions, { provider = 'iconify', prefix }: IconOptions): string[] {
  const list: string[] = []
  // navbar /  doc collection sidebar / social
  const locales = options.locales || {}
  objectEntries(locales).forEach(([, { navbar, sidebar, collections, social }]) => {
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
      return withPrefix(icon, prefix)
    }
  }

  return list.map(addIcon).filter(Boolean) as string[]
}

function getIconWithNavbar(navbar: ThemeNavItem[]): string[] {
  const list: string[] = []
  navbar.forEach((item) => {
    if (!isString(item)) {
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
      if (!isString(item)) {
        if (isIconify(item.icon))
          list.push(item.icon)
        if (item.items?.length)
          list.push(...getIconWithSidebar(item.items))
      }
    })
  }
  else if (isPlainObject(sidebar)) {
    objectEntries(sidebar).forEach(([, item]) => {
      if (!isString(item)) {
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
