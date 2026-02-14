/**
 * Stringify a property value for use in Vue templates
 *
 * 将属性值字符串化为可在 Vue 模板中使用的格式
 *
 * @param data - Data to stringify / 要字符串化的数据
 * @returns Stringified data with single quotes escaped / 字符串化后的数据，单引号已转义
 */
export function stringifyProp(data: unknown): string {
  // Single quote will break @vue/compiler-sfc
  // 单引号会破坏 @vue/compiler-sfc
  return JSON.stringify(data).replace(/'/g, '&#39')
}
