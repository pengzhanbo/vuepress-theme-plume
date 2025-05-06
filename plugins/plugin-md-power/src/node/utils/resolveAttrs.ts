import { camelCase } from '@pengzhanbo/utils'

const RE_ATTR_VALUE = /(?:^|\s+)(?<attr>[\w-]+)(?:=(?<quote>['"])(?<valueWithQuote>.+?)\k<quote>|=(?<valueWithoutQuote>\S+))?(?:\s+|$)/

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

export function resolveAttr(info: string, key: string): string | undefined {
  const pattern = new RegExp(`(?:^|\\s+)${key}(?:=(?<quote>['"])(?<valueWithQuote>.+?)\\k<quote>|=(?<valueWithoutQuote>\\S+))?(?:\\s+|$)`)
  const groups = info.match(pattern)?.groups
  return groups?.valueWithQuote || groups?.valueWithoutQuote
}
