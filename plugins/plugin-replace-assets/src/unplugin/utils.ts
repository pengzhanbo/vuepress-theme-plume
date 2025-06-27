import { removeEndingSlash, removeLeadingSlash } from '@vuepress/helper'

export function createAssetPattern(prefix: string): RegExp {
  const s = `(${prefix}.*?)`
  return new RegExp(
    [
      `(?:"${s}")`, // "prefix"
      `(?:'${s}')`, // 'prefix'
      `(?:\\(${s}\\))`, // (prefix)
      `(?:\\('${s}'\\))`, // ('prefix')
      `(?:\\("${s}"\\))`, // ("prefix")
      `(?:\\\\"${s}\\\\")`, // \"prefix\"
    ].join('|'),
    'gu',
  )
}

export function normalizeUrl(url: string, base?: string): string {
  if (!url)
    return ''

  if (base) {
    url = `${removeEndingSlash(base)}/${removeLeadingSlash(url)}`
  }
  return url
}
