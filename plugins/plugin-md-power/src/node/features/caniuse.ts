/**
 * @[caniuse embed{1,2,3,4}](feature_name)
 * @[caniuse image](feature_name)
 */
import type { PluginWithOptions, Token } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.js'
import type { Markdown } from 'vuepress/markdown'
import container from 'markdown-it-container'
import type { CanIUseMode, CanIUseOptions, CanIUseTokenMeta } from '../../shared/index.js'

// @[caniuse]()
const minLength = 12

// char codes of '@[caniuse'
const START_CODES = [64, 91, 99, 97, 110, 105, 117, 115, 101]

// regexp to match the import syntax
const SYNTAX_RE = /^@\[caniuse(?:\s*?(embed|image)?(?:{([0-9,\-]*?)})?)\]\(([^)]*)\)/

function createCanIUseRuleBlock(defaultMode: CanIUseMode): RuleBlock {
  return (state, startLine, endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    // return false if the length is shorter than min length
    if (pos + minLength > max)
      return false

    // check if it's matched the start
    for (let i = 0; i < START_CODES.length; i += 1) {
      if (state.src.charCodeAt(pos + i) !== START_CODES[i])
        return false
    }

    // check if it's matched the syntax
    const match = state.src.slice(pos, max).match(SYNTAX_RE)
    if (!match)
      return false

    // return true as we have matched the syntax
    if (silent)
      return true

    const [, mode, versions = '', feature] = match

    const meta: CanIUseTokenMeta = {
      feature,
      mode: (mode as CanIUseMode) || defaultMode,
      versions,
    }

    const token = state.push('caniuse', '', 0)

    token.meta = meta
    token.map = [startLine, startLine + 1]
    token.info = mode || defaultMode

    state.line = startLine + 1

    return true
  }
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

  const periods = resolveVersions(versions)
  const accessible = 'false'
  const image = 'none'
  const url = 'https://caniuse.bitsofco.de/embed/index.html'
  const src = `${url}?feat=${feature}&periods=${periods}&accessible-colours=${accessible}&image-base=${image}`

  return `<ClientOnly><div class="ciu_embed" style="margin:16px 0" data-feature="${feature}"><iframe src="${src}" frameborder="0" width="100%" height="400px" title="Can I use ${feature}"></iframe></div></ClientOnly>`
}

function resolveVersions(versions: string): string {
  if (!versions)
    return 'future_1,current,past_1,past_2'

  const list = versions
    .split(',')
    .map(v => Number(v.trim()))
    .filter(v => !Number.isNaN(v) && v >= -5 && v <= 3)

  list.push(0)

  const uniq = [...new Set(list)].sort((a, b) => b - a)
  const result: string[] = []
  uniq.forEach((v) => {
    if (v < 0)
      result.push(`past_${Math.abs(v)}`)
    if (v === 0)
      result.push('current')
    if (v > 0)
      result.push(`future_${v}`)
  })
  return result.join(',')
}

/**
 * @example
 * ```md
 * @[caniuse](feature_name)
 * ```
 */
export const caniusePlugin: PluginWithOptions<CanIUseOptions> = (
  md,
  { mode = 'embed' }: CanIUseOptions = {},
): void => {
  md.block.ruler.before(
    'import_code',
    'caniuse',
    createCanIUseRuleBlock(mode),
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    },
  )

  md.renderer.rules.caniuse = (tokens, index) => {
    const token = tokens[index]

    const content = resolveCanIUse(token.meta)
    token.content = content

    return content
  }
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
  md: Markdown,
  { mode = 'embed' }: CanIUseOptions = {},
): void {
  const modeMap: CanIUseMode[] = ['image', 'embed']
  const isMode = (mode: CanIUseMode): boolean => modeMap.includes(mode)

  mode = isMode(mode) ? mode : modeMap[0]
  const type = 'caniuse'
  const validateReg = new RegExp(`^${type}\\s+(.*)$`)

  const validate = (info: string): boolean => {
    return validateReg.test(info.trim())
  }

  const render = (tokens: Token[], index: number): string => {
    const token = tokens[index]
    if (token.nesting === 1) {
      const info = token.info.trim().slice(type.length).trim() || ''
      const feature = info.split(/\s+/)[0]
      const versions = info.match(/\{(.*)\}/)?.[1] || ''
      return feature ? resolveCanIUse({ feature, mode, versions }) : ''
    }
    else {
      return ''
    }
  }

  md.use(container, type, { validate, render })
}
