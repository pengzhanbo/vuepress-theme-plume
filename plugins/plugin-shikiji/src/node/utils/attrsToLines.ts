import type { TransformerCompactLineOption } from '@shikijs/transformers'

/**
 * 2 steps:
 *
 * 1. convert attrs into line numbers:
 *    {4,7-13,16,23-27,40} -> [4,7,8,9,10,11,12,13,16,23,24,25,26,27,40]
 * 2. convert line numbers into line options:
 *    [{ line: number, classes: string[] }]
 */
export function attrsToLines(attrs: string): TransformerCompactLineOption[] {
  // eslint-disable-next-line regexp/optimal-quantifier-concatenation, regexp/no-super-linear-backtracking
  attrs = attrs.replace(/^(?:\[.*?\])?.*?([\d,-]+).*/, '$1').trim()

  const result: number[] = []

  if (!attrs)
    return []

  attrs
    .split(',')
    .map(v => v.split('-').map(v => Number.parseInt(v, 10)))
    .forEach(([start, end]) => {
      if (start && end) {
        result.push(
          ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
        )
      }
      else {
        result.push(start)
      }
    })

  return result.map(line => ({
    line,
    classes: ['highlighted'],
  }))
}
