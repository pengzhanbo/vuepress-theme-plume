import { isPackageExists } from 'local-pkg'
import { interopDefault } from './interopDefault'

let _pinyin: typeof import('pinyin-pro').pinyin | null = null

/**
 * Check if pinyin-pro package is installed
 *
 * 检查是否安装了 pinyin-pro 包
 */
export const hasPinyin = isPackageExists('pinyin-pro')
const hasPinyinData = isPackageExists('@pinyin-pro/data')

/**
 * Get pinyin function
 *
 * 获取拼音函数
 */
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
