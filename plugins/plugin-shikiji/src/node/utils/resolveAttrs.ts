const RE_ATTR_VALUE = /(?:^|\s+)(?<attr>[\w-]+)(?:=\s*(?<quote>['"])(?<value>.+?)\k<quote>)?(?:\s+|$)/
const RE_CODE_BLOCKS = /^[\w\-]*(\s*:[\w\-]*)?(\s*\{[\w\-,\s]+\})?\s*/

export function resolveAttrs(info: string): {
  attrs: Record<string, string | boolean>
  rawAttrs: string
} {
  if (!info)
    return { rawAttrs: '', attrs: {} }
  info = info.replace(RE_CODE_BLOCKS, '').trim()
  if (!info)
    return { rawAttrs: '', attrs: {} }

  const attrs: Record<string, string | boolean> = {}
  const rawAttrs = info

  let matched: RegExpMatchArray | null

  // eslint-disable-next-line no-cond-assign
  while (matched = info.match(RE_ATTR_VALUE)) {
    const { attr, value } = matched.groups || {}
    attrs[attr] = value ?? true
    info = info.slice(matched[0].length)
  }

  Object.keys(attrs).forEach((key) => {
    let value = attrs[key]
    value = typeof value === 'string' ? value.trim() : value
    if (value === 'true')
      value = true
    else if (value === 'false')
      value = false

    attrs[key] = value

    if (key.includes('-')) {
      const _key = key.replace(/-(\w)/g, (_, c) => c.toUpperCase())
      attrs[_key] = value
    }
  })

  return { attrs, rawAttrs }
}
