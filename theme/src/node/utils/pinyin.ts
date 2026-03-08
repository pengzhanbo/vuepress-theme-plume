import { isPackageExists } from 'local-pkg'
import { interopDefault } from './interopDefault'

let _pinyin: typeof import('pinyin-pro').pinyin | null = null

/**
 * Check if pinyin-pro package is installed.
 * Used for Chinese character to pinyin conversion.
 *
 * 检查是否安装了 pinyin-pro 包。
 * 用于中文字符转拼音功能。
 */
export const hasPinyin = isPackageExists('pinyin-pro')
const hasPinyinData = isPackageExists('@pinyin-pro/data')

/**
 * Get the pinyin conversion function.
 * Dynamically imports pinyin-pro and its data if available.
 * Caches the result for subsequent calls.
 *
 * 获取拼音转换函数。
 * 动态导入 pinyin-pro 及其数据（如果可用）。
 * 缓存结果以供后续调用使用。
 *
 * @returns Pinyin function or null if not installed / 拼音函数，如果未安装则返回 null
 * @example
 * const pinyin = await getPinyin()
 * if (pinyin) {
 *   const result = pinyin('中文') // 'zhōng wén'
 * }
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
