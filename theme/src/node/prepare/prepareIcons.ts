import type { App } from 'vuepress'
import type { IconifyProvider } from 'vuepress-plugin-md-power'
import type { ThemeOptions } from '../../shared/index.js'
import type { FsCache } from '../utils/index.js'
import { getIconContentCSS, getIconData } from '@iconify/utils'
import { isArray, isPlainObject, objectEntries, uniq } from '@pengzhanbo/utils'
import { isPackageExists } from 'local-pkg'
import { fs } from 'vuepress/utils'
import { getIconsWithPage, getIconWithThemeConfig } from '../features/icons.js'
import { getThemeOptions } from '../options.js'
import { createFsCache, genTempCode, interopDefault, logger, perf, writeTemp } from '../utils/index.js'

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

const JS_FILENAME = 'internal/iconify.js'
const CSS_FILENAME = 'internal/iconify.css'

const isInstalled = isPackageExists('@iconify/json')
let locate!: ((name: string) => any)

let fsCache: FsCache<IconDataMap> | null = null
// { iconName: { className, content } }
let cache: IconDataMap = {}

/**
 * Prepare icon data for theme
 *
 * 准备主题图标数据，收集页面中使用的图标并生成对应的 CSS 和 JS 文件
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeOptions()` / 主题配置，默认从 `getThemeOptions()` 读取
 */
export async function prepareIcons(app: App, options: ThemeOptions = getThemeOptions()): Promise<void> {
  perf.mark('prepare:icons:total')
  const icons: UsageIcons = { co: [], bg: {}, mask: {} }
  if (!isInstalled) {
    await writeTemp(app, JS_FILENAME, genTempCode(app, { name: 'icons', content: icons }))
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
    for (const [collect, names] of objectEntries(rest)) {
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
    objectEntries(collectMap).map(([collect, names]) => resolveCollect(collect, names)),
  )).flat()

  if (unknownList.length) {
    logger.warn(`[iconify] Unknown icons: ${unknownList.join(', ')}`)
  }

  perf.log('prepare:icons:imports')

  let cssCode = ''
  for (const [, { className, content, background, collect, name }] of objectEntries(cache)) {
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
    writeTemp(app, JS_FILENAME, genTempCode(app, {
      name: 'icons',
      content: icons,
      before: `import './iconify.css'`,
    })),
  ])

  fsCache?.write(cache, app.env.isBuild)

  cache = {}

  perf.log('prepare:icons:total')
}

const URL_CONTENT_REGEXP = /(url\([\s\S]+\))/

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
