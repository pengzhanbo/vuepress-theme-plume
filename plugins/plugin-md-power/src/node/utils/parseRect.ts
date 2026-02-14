/**
 * Parse rect size string, add unit if it's a number
 *
 * 解析矩形尺寸字符串，如果是数字则添加单位
 *
 * @param str - Size string / 尺寸字符串
 * @param unit - Unit to append (default: 'px') / 要添加的单位（默认：'px'）
 * @returns Size string with unit / 带单位的尺寸字符串
 */
export function parseRect(str: string, unit = 'px'): string {
  if (Number.parseFloat(str) === Number(str))
    return `${str}${unit}`

  return str
}
