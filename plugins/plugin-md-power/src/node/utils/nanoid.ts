import { customAlphabet } from 'nanoid'

/**
 * Generate a nanoid with custom alphabet
 *
 * 使用自定义字符集生成 nanoid
 *
 * @param size - ID length / ID 长度
 * @returns Nanoid string / Nanoid 字符串
 */
export const nanoid: (size?: number) => string = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5)
