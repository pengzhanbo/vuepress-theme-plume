import { isBoolean, isNull, isNumber, isString, isUndefined, kebabCase } from '@pengzhanbo/utils'

/**
 * Stringify attributes object to HTML attribute string
 *
 * 将属性对象字符串化为 HTML 属性字符串
 *
 * @param attrs - Attributes object / 属性对象
 * @param withUndefinedOrNull - Whether to include undefined/null values / 是否包含 undefined/null 值
 * @param forceStringify - Keys to force stringify / 强制字符串化的键
 * @returns HTML attribute string / HTML 属性字符串
 * @typeParam T - Attribute type / 属性类型
 */
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
