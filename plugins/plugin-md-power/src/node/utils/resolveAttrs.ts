import { camelCase } from '@pengzhanbo/utils'

const RE_ATTR_VALUE = /(?:^|\s+)(?<attr>[\w-]+)(?:=\s*(?<quote>['"])(?<value>.+?)\k<quote>)?(?:\s+|$)/

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
    const { attr, value = true } = matched.groups!
    let v = typeof value === 'string' ? value.trim() : value
    if (v === 'true')
      v = true
    else if (v === 'false')
      v = false
    attrs[camelCase(attr)] = v

    info = info.slice(matched[0].length)
  }

  return { attrs: attrs as T, rawAttrs }
}
