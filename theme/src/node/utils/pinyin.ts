import { isPackageExists } from 'local-pkg'
import { interopDefault } from './interopDefault'

let _pinyin: typeof import('pinyin-pro').pinyin | null = null

export const hasPinyin = isPackageExists('pinyin-pro')
const hasPinyinData = isPackageExists('@pinyin-pro/data')

export async function getPinyin() {
  if (hasPinyin && !_pinyin) {
    const { pinyin, addDict } = (await import('pinyin-pro'))
    _pinyin = pinyin
    if (hasPinyinData) {
      addDict(await interopDefault(import('@pinyin-pro/data/complete')))
    }
  }
  return _pinyin
}
