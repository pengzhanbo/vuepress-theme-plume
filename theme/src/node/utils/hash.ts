import { createHash } from 'node:crypto'
import { customAlphabet } from 'nanoid'

/**
 * Generate MD5 hash of content
 *
 * 生成内容的 MD5 哈希值
 *
 * @param content - Content to hash / 要哈希的内容
 * @returns MD5 hash string / MD5 哈希字符串
 */
export const hash = (content: string): string => createHash('md5').update(content).digest('hex')

/**
 * Generate random ID (nanoid)
 * Uses alphanumeric characters for URL-safe IDs
 *
 * 生成随机 ID (nanoid)
 * 使用字母数字字符生成 URL 安全的 ID
 *
 * @param size - Length of the generated ID, defaults to 8 / 生成 ID 的长度，默认为 8
 * @returns Random alphanumeric string / 随机字母数字字符串
 */
export const nanoid: (size?: number) => string = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)
