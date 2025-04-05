import { removeEndingSlash, removeLeadingSlash } from '@vuepress/helper'

export function createAssetPattern(prefix: string) {
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

const htmlLangRE = /\.(?:html|htm)$/

export const isHTMLRequest = (request: string) => htmlLangRE.test(request)

const nonJsRe = /\.json(?:$|\?)/

export function isNonJsRequest(request: string): boolean {
  return nonJsRe.test(request)
}

export function normalizeUrl(url: string, base?: string): string {
  if (!url)
    return ''

  if (base) {
    url = `${removeEndingSlash(base)}/${removeLeadingSlash(url)}`
  }
  return url
}
