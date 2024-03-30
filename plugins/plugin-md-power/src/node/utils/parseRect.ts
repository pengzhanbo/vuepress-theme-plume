export function parseRect(str: string, unit = 'px'): string {
  if (Number.parseFloat(str) === Number(str))
    return `${str}${unit}`

  return str
}
