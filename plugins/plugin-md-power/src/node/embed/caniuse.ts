/**
 * @[caniuse embed{-2,4}](feature_name)
 * @[caniuse baseline](feature_name)
 * @[caniuse image](feature_name)  // 弃用
 */
import type { PluginWithOptions } from 'markdown-it'
import type MarkdownIt from 'markdown-it'
import type { MarkdownEnv } from 'vuepress/markdown'
import type { CanIUseMode, CanIUseOptions, CanIUseTokenMeta } from '../../shared/index.js'
import { colors } from 'vuepress/utils'
import { createContainerPlugin } from '../container/createContainer.js'
import { logger } from '../utils/logger.js'
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
    syntaxPattern: /^@\[caniuse\s*(embed|image|baseline)?(?:\{([0-9,\-]*)\})?\]\(([^)]*)\)/,
    meta: ([, mode, versions = '', feature]) => ({
      feature,
      mode: (mode as CanIUseMode) || defaultMode,
      versions,
    }),
    content: (meta, _c, env) => resolveCanIUse(meta, env),
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
  const modeMap: CanIUseMode[] = ['image', 'embed', 'baseline']
  const isMode = (mode: CanIUseMode): boolean => modeMap.includes(mode)

  mode = isMode(mode) ? mode : modeMap[0]
  createContainerPlugin(md, 'caniuse', {
    before: (info, _t, _i, _o, env) => {
      const feature = info.split(/\s+/)[0]
      const versions = info.match(/\{(.*)\}/)?.[1] || ''
      return feature ? resolveCanIUse({ feature, mode, versions }, env) : ''
    },
    after: () => '',
  })
}

function resolveCanIUse({ feature, mode, versions }: CanIUseTokenMeta, env: MarkdownEnv): string {
  if (!feature)
    return ''

  if (mode === 'image') {
    logger.warn(`[caniuse] image mode is deprecated, use ${
      colors.cyan(`@[caniuse](${feature})`)
    } instead. (${colors.gray(env.filePathRelative || '')})`)
    const link = 'https://caniuse.bitsofco.de/image/'
    const alt = `Data on support for the ${feature} feature across the major browsers from caniuse.com`
    return `<p><picture>
      <source type="image/webp" srcset="${link}${feature}.webp">
      <source type="image/png" srcset="${link}${feature}.png">
      <img src="${link}${feature}.jpg" alt="${alt}" width="100%">
    </picture></p>`
  }

  feature = feature.replace(UNDERLINE_RE, '_')
  const { past, future } = resolveVersions(versions)
  const meta = nanoid()

  return `<CanIUseViewer${stringifyAttrs({ feature, meta, past, future, baseline: mode === 'baseline' })} />`
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
