import { constants, promises as fsp } from 'node:fs'
import type { App } from 'vuepress/core'
import { getIconContentCSS, getIconData } from '@iconify/utils'
import { fs, logger } from 'vuepress/utils'
import { isPackageExists } from 'local-pkg'
import { customAlphabet } from 'nanoid'
import type { IconsOptions } from '../../../shared/icons.js'
import { interopDefault } from '../../utils/package.js'
import { parseRect } from '../../utils/parseRect.js'

export interface IconCacheItem {
  className: string
  content: string
}

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
const iconDataCache = new Map<string, any>()
const URL_CONTENT_RE = /(url\([^]+?\))/
const CSS_PATH = 'internal/md-power/icons.css'

function resolveOption(opt?: boolean | IconsOptions): Required<IconsOptions> {
  const options = typeof opt === 'object' ? opt : {}
  options.prefix ??= 'vp-mdi'
  options.color = options.color === 'currentColor' || !options.color ? 'currentcolor' : options.color
  options.size = options.size ? parseRect(`${options.size}`) : '1em'
  return options as Required<IconsOptions>
}

export function createIconCSSWriter(app: App, opt?: boolean | IconsOptions) {
  const cache = new Map<string, IconCacheItem>()
  const isInstalled = isPackageExists('@iconify/json')
  const currentPath = app.dir.temp(CSS_PATH)

  const write = async (content: string) => {
    if (!content && app.env.isDev) {
      if (existsSync(currentPath) && (await fsp.stat(currentPath)).isFile()) {
        return
      }
    }
    await app.writeTemp(CSS_PATH, content)
  }
  let timer: NodeJS.Timeout | null = null

  const options = resolveOption(opt)
  const prefix = options.prefix
  const defaultContent = getDefaultContent(options)

  async function writeCss() {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(async () => {
      let css = defaultContent

      if (cache.size > 0) {
        for (const [, { content, className }] of cache)
          css += `.${className} {\n  --svg: ${content};\n}\n`

        await write(css)
      }
    }, 100)
  }

  function addIcon(iconName: string) {
    if (!isInstalled)
      return

    if (cache.has(iconName))
      return cache.get(iconName)!.className

    const item: IconCacheItem = {
      className: `${prefix}-${nanoid()}`,
      content: '',
    }
    cache.set(iconName, item)
    genIconContent(iconName, (content) => {
      item.content = content
      writeCss()
    })
    return item.className
  }

  async function initIcon() {
    if (!opt)
      return await write('')

    if (!isInstalled) {
      logger.error('[plugin-md-power]: `@iconify/json` not found! Please install `@iconify/json` first.')
      return
    }

    return await writeCss()
  }

  return { addIcon, writeCss, initIcon }
}

function getDefaultContent(options: Required<IconsOptions>) {
  const { prefix, size, color } = options
  return `[class^="${prefix}-"],
[class*=" ${prefix}-"] {
  display: inline-block;
  width: ${size};
  height: ${size};
  vertical-align: middle;
  color: inherit;
  background-color: ${color};
  -webkit-mask: var(--svg) no-repeat;
  mask: var(--svg) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
`
}

let locate: ((name: string) => any) | undefined

async function genIconContent(iconName: string, cb: (content: string) => void) {
  if (!locate) {
    const mod = await interopDefault(import('@iconify/json'))
    locate = mod.locate
  }

  const [collect, name] = iconName.split(':')
  let iconJson: any = iconDataCache.get(collect)
  if (!iconJson) {
    const filename = locate(collect)

    try {
      iconJson = JSON.parse(await fs.readFile(filename, 'utf-8'))
      iconDataCache.set(collect, iconJson)
    }
    catch {
      logger.warn(`[plugin-md-power] Can not find icon, ${collect} is missing!`)
    }
  }
  const data = getIconData(iconJson, name)
  if (!data)
    return logger.error(`[plugin-md-power] Can not read icon in ${collect}, ${name} is missing!`)

  const content = getIconContentCSS(data, {
    height: data.height || 24,
  })
  const match = content.match(URL_CONTENT_RE)
  return cb(match ? match[1] : '')
}

function existsSync(fp: string) {
  try {
    fs.accessSync(fp, constants.R_OK)
    return true
  }
  catch {
    return false
  }
}
