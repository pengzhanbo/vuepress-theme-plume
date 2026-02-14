import { camelCase } from '@pengzhanbo/utils'

/**
 * Regular expression for matching attribute values
 *
 * 匹配属性值的正则表达式
 */
const RE_ATTR_VALUE = /(?:^|\s+)(?<attr>[\w-]+)(?:=(?<quote>['"])(?<valueWithQuote>.+?)\k<quote>|=(?<valueWithoutQuote>\S+))?(?:\s+|$)/

/**
 * Resolve attribute string to object
 *
 * 将属性字符串解析为对象
 *
 * @param info - Attribute string / 属性字符串
 * @returns Object with attrs and rawAttrs / 包含 attrs 和 rawAttrs 的对象
 * @typeParam T - Attribute type / 属性类型
 */
export function resolveAttrs<T extends Record<string, any> = Record<string, any>>(info: string): {
  attrs: T
  rawAttrs: string
} {
  info = info.trim()

  if (!info)
    return { rawAttrs: '', attrs: {} as T }

  const attrs: Record<string, string | boolean> = {}
  const rawAttrs = info

  let matched: RegExpMatchArray | null

  // eslint-disable-next-line no-cond-assign
  while (matched = info.match(RE_ATTR_VALUE)) {
    const { attr, valueWithQuote, valueWithoutQuote } = matched.groups!
    const value = valueWithQuote || valueWithoutQuote || true
    let v = typeof value === 'string' ? value.trim() : value
    if (v === 'true')
      v = true
    else if (v === 'false')
      v = false
    else if (v === '""' || v === '\'\'')
      v = ''
    attrs[camelCase(attr)] = v

    info = info.slice(matched[0].length)
  }

  return { attrs: attrs as T, rawAttrs }
}

/**
 * Resolve single attribute value from info string
 *
 * 从信息字符串中解析单个属性值
 *
 * @param info - Info string / 信息字符串
 * @param key - Attribute key / 属性键
 * @returns Attribute value or undefined / 属性值或 undefined
 */
export function resolveAttr(info: string, key: string): string | undefined {
  const pattern = new RegExp(`(?:^|\\s+)${key}(?:=(?<quote>['"])(?<valueWithQuote>.+?)\\k<quote>|=(?<valueWithoutQuote>\\S+))?(?:\\s+|$)`)
  const groups = info.match(pattern)?.groups
  return groups?.valueWithQuote || groups?.valueWithoutQuote
}
