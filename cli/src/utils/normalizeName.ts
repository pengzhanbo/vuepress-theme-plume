import { kebabCase } from '@pengzhanbo/utils'

export function normalizeName(filepath: string): string {
  const tmp = filepath.split('/').filter(Boolean)
  const dirname = tmp[tmp.length - 1]

  return kebabCase(dirname)
}
