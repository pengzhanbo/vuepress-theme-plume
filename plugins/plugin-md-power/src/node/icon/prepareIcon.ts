import type { IconOptions } from '../../shared/index.js'
import { notNullish, toArray, uniqWith } from '@pengzhanbo/utils'
import { isLinkAbsolute } from '@vuepress/helper'
import { isLinkHttp } from 'vuepress/shared'
import { logger } from '../utils/logger.js'

interface AssetInfo {
  type: 'style' | 'script'
  link: string
  provide?: string
}

function getFontAwesomeCDNLink(type: string): string {
  return `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/js/${type}.min.js`
}

export function prepareIcon(
  imports: Set<string>,
  options: IconOptions = {},
): string {
  const setupContent: string[] = []
  const assets: AssetInfo[] = []

  if (options.provider === 'iconfont') {
    assets.push(
      ...toArray(options.assets)
        .map(asset => normalizeAsset(asset))
        .filter(notNullish),
    )
  }
  else if (options.provider === 'fontawesome') {
    assets.push(...toArray(options.assets || 'fontawesome').map((asset) => {
      if (asset === 'fontawesome') {
        return ['solid', 'regular', 'fontawesome']
          .map(getFontAwesomeCDNLink)
          .map(asset => normalizeAsset(asset, 'fontawesome'))
      }
      if (asset === 'fontawesome-with-brands') {
        return normalizeAsset(getFontAwesomeCDNLink('brands'), 'fontawesome')
      }
      return normalizeAsset(asset, 'fontawesome')
    }).flat().filter(notNullish))
  }
  let hasStyle = false
  let hasScript = false

  for (const asset of uniqWith(assets, (a, b) => a.link === b.link)) {
    if (asset.type === 'style') {
      hasStyle = true
      setupContent.push(`useStyleTag('@import url("${asset.link}");')`)
    }
    else if (asset.type === 'script') {
      hasScript = true
      setupContent.push(asset.provide === 'fontawesome'
        ? `useScriptTag("${asset.link}", () => {}, { attrs: { "data-auto-replace-svg": "nest" } })`
        : `useScriptTag("${asset.link}")`,
      )
    }
  }
  if (hasScript || hasStyle) {
    const exports: string[] = []
    if (hasScript)
      exports.push('useScriptTag')
    if (hasStyle)
      exports.push('useStyleTag')
    imports.add(`import { ${exports.join(', ')} } from '@vueuse/core'`)
  }

  return setupContent.join('\n    ')
}

function normalizeAsset(asset: string, provide?: string): AssetInfo | null {
  const link = normalizeLink(asset)
  if (asset.endsWith('.js')) {
    return { type: 'script', link, provide }
  }
  if (asset.endsWith('.css')) {
    return { type: 'style', link, provide }
  }
  logger.error('icon', `Can not recognize icon link: "${asset}"`)
  return null
}

function normalizeLink(link: string): string {
  if (isLinkHttp(link) || isLinkAbsolute(link))
    return link

  return `//${link}`
}
