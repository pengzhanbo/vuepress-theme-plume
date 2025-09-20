import { isBoolean, isNull, isNumber, isString, isUndefined, kebabCase } from '@pengzhanbo/utils'

export function stringifyAttrs<T extends object = object>(
  attrs: T,
  withUndefinedOrNull = false,
  forceStringify: (keyof T)[] = [],
): string {
  const result = Object.entries(attrs)
    .map(([key, value]) => {
      const k = kebabCase(key)
      if (isUndefined(value) || value === 'undefined')
        return withUndefinedOrNull ? `:${k}="undefined"` : ''

      if (isNull(value) || value === 'null')
        return withUndefinedOrNull ? `:${k}="null"` : ''

      if (value === 'true')
        value = true
      if (value === 'false')
        value = false

      if (isBoolean(value))
        return value ? `${k}` : ''

      if (isNumber(value))
        return `:${k}="${value}"`

      // like object or array
      if (isString(value) && (value[0] === '{' || value[0] === '[')) {
        const v = value.replaceAll('\"', '\'')
        if (forceStringify.includes(key as keyof T))
          return `${k}="${v}"`
        return `:${k}="${v}"`
      }

      const hasDynamic = key[0] === ':'
      return `${hasDynamic ? ':' : ''}${k}="${String(value)}"`
    })
    .filter(Boolean)
    .join(' ')

  return result ? ` ${result}` : ''
}
