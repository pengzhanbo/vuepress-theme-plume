import type { ReplacementRule } from '../options.js'
import MagicString from 'magic-string'
import { normalizeUrl } from './utils.js'

const cache = new Map<string, string>()

export function transformAssets(code: string, pattern: RegExp, rules: ReplacementRule[]): string {
  const s = new MagicString(code)
  let matched: RegExpExecArray | null
  let hasMatched = false
  // eslint-disable-next-line no-cond-assign
  while ((matched = pattern.exec(code))) {
    const assetUrl = matched[6] || matched[5] || matched[4] || matched[3] || matched[2] || matched[1]
    const [left, right] = matched[0].startsWith('(')
      ? ['("', '")']
      : matched[0].startsWith('\\"')
        ? ['\\"', '\\"']
        : ['"', '"']

    const start = matched.index
    const end = start + matched[0].length
    const resolved = replacementAssetWithRules(rules, assetUrl)
    if (resolved) {
      hasMatched = true
      s.update(start, end, `${left}${resolved}${right}`)
    }
  }

  if (!hasMatched)
    return code

  return s.toString()
}

export function replacementAssetWithRules(rules: ReplacementRule[], url: string): string | void {
  if (cache.has(url))
    return cache.get(url)

  for (const { find, replacement } of rules) {
    if (find && isMatchUrl(find, url)) {
      let replaced = ''
      if (typeof replacement === 'function') {
        replaced = normalizeUrl(replacement(url))
      }
      else {
        replaced = normalizeUrl(url, replacement)
      }
      /* istanbul ignore if -- @preserve */
      if (replaced) {
        cache.set(url, replaced)
        return replaced
      }
    }
  }
  return undefined
}

export function isMatchUrl(find: string | RegExp, url: string): boolean {
  if (typeof find === 'string') {
    if (find[0] === '^' || find[find.length - 1] === '$') {
      return new RegExp(find).test(url)
    }
    else {
      return url.endsWith(find) || url.startsWith(find)
    }
  }

  return find.test(url)
}
