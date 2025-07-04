/**
 * @[caniuse embed{-2,4}](feature_name)
 * @[caniuse image](feature_name)
 */
import type { PluginWithOptions } from 'markdown-it'
import type MarkdownIt from 'markdown-it'
import type { CanIUseMode, CanIUseOptions, CanIUseTokenMeta } from '../../shared/index.js'
import { createContainerPlugin } from '../container/createContainer.js'
import { nanoid } from '../utils/nanoid.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createEmbedRuleBlock } from './createEmbedRuleBlock.js'

const UNDERLINE_RE = /_+/g
/**
 * @example
 * ```md
 * @[caniuse](feature_name)
 * ```
 */
export const caniusePlugin: PluginWithOptions<CanIUseOptions> = (
  md,
  { mode: defaultMode = 'embed' }: CanIUseOptions = {},
): void => {
  createEmbedRuleBlock<CanIUseTokenMeta>(md, {
    type: 'caniuse',
    syntaxPattern: /^@\[caniuse\s*(embed|image)?(?:\{([0-9,\-]*)\})?\]\(([^)]*)\)/,
    meta: ([, mode, versions = '', feature]) => ({
      feature,
      mode: (mode as CanIUseMode) || defaultMode,
      versions,
    }),
    content: meta => resolveCanIUse(meta),
  })
}

/**
 * @deprecated use caniuse plugin
 *
 * 兼容旧语法
 * @example
 * ```md
 * :::caniuse <feature_name>
 * :::
 * ```
 */
export function legacyCaniuse(
  md: MarkdownIt,
  { mode = 'embed' }: CanIUseOptions = {},
): void {
  const modeMap: CanIUseMode[] = ['image', 'embed']
  const isMode = (mode: CanIUseMode): boolean => modeMap.includes(mode)

  mode = isMode(mode) ? mode : modeMap[0]
  createContainerPlugin(md, 'caniuse', {
    before: (info) => {
      const feature = info.split(/\s+/)[0]
      const versions = info.match(/\{(.*)\}/)?.[1] || ''
      return feature ? resolveCanIUse({ feature, mode, versions }) : ''
    },
    after: () => '',
  })
}

function resolveCanIUse({ feature, mode, versions }: CanIUseTokenMeta): string {
  if (!feature)
    return ''

  if (mode === 'image') {
    const link = 'https://caniuse.bitsofco.de/image/'
    const alt = `Data on support for the ${feature} feature across the major browsers from caniuse.com`
    return `<ClientOnly><p><picture>
      <source type="image/webp" srcset="${link}${feature}.webp">
      <source type="image/png" srcset="${link}${feature}.png">
      <img src="${link}${feature}.jpg" alt="${alt}" width="100%">
    </picture></p></ClientOnly>`
  }

  feature = feature.replace(UNDERLINE_RE, '_')
  const { past, future } = resolveVersions(versions)
  const meta = nanoid()

  return `<CanIUseViewer${stringifyAttrs({ feature, meta, past, future })} />`
}

function resolveVersions(versions: string): { past: number, future: number } {
  if (!versions)
    return { past: 2, future: 1 }

  const list = versions
    .split(',')
    .map(v => Number(v.trim()))
    .filter(v => !Number.isNaN(v) && v >= -5 && v <= 3)

  list.push(0)

  const uniq = [...new Set(list)].sort((a, b) => b - a)
  return {
    future: uniq[0],
    past: Math.abs(uniq[uniq.length - 1]),
  }
}
