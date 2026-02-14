import type { InjectionKey, Ref } from 'vue'
import type { EncryptDataRule } from './encrypt-data.js'
import { computedAsync, useSessionStorage } from '@vueuse/core'
import { bcryptVerify, md5 } from 'hash-wasm'
import { computed, inject, provide } from 'vue'
import { useRoute } from 'vuepress/client'
import { removeLeadingSlash } from 'vuepress/shared'
import { useData } from './data.js'
import { useEncryptData } from './encrypt-data.js'

/**
 * Encrypt interface
 * Provides encryption-related reactive states and properties
 *
 * 加密接口
 * 提供加密相关的响应式状态和属性
 */
export interface Encrypt {
  /**  Whether the current page has encryption / 当前页面是否有加密 */
  hasPageEncrypt: Ref<boolean>
  /** Whether global encryption is decrypted / 全局加密是否已解密 */
  isGlobalDecrypted: Ref<boolean>
  /** Whether page encryption is decrypted / 页面加密是否已解密 */
  isPageDecrypted: Ref<boolean>
  /** List of encryption rules for the current page / 当前页面的加密规则列表 */
  hashList: Ref<EncryptDataRule[]>
}

/**
 * Injection key for encrypt functionality
 *
 * 加密功能的注入键
 */
export const EncryptSymbol: InjectionKey<Encrypt> = Symbol(
  __VUEPRESS_DEV__ ? 'Encrypt' : '',
)

/**
 * Session storage for encryption state
 * Stores global and page decryption states
 *
 * 加密状态的会话存储
 * 存储全局和页面解密状态
 */
const storage = useSessionStorage('2a0a3d6afb2fdf1f', () => {
  if (__VUEPRESS_SSR__) {
    return { g: '', p: [] as string[] }
  }
  return {
    g: '',
    p: [] as string[],
  }
})

/**
 * Cache for password comparison results
 * Improves performance by caching bcrypt verification results
 *
 * 密码比较结果的缓存
 * 通过缓存 bcrypt 验证结果提高性能
 */
const compareCache = new Map<string, boolean>()
const separator = ':'

/**
 * Compare password with hash using bcrypt
 * Caches results to avoid repeated computations
 *
 * 使用 bcrypt 比较密码和哈希
 * 缓存结果以避免重复计算
 *
 * @param content - Password to verify / 要验证的密码
 * @param hash - Bcrypt hash to compare against / 要比较的 bcrypt 哈希
 * @returns Whether the password matches / 密码是否匹配
 */
async function compareDecrypt(content: string, hash: string): Promise<boolean> {
  const key = [content, hash].join(separator)
  if (compareCache.has(key))
    return compareCache.get(key)!

  try {
    const result = await bcryptVerify({ password: content, hash })
    compareCache.set(key, result)
    return result
  }
  catch {
    compareCache.set(key, false)
    return false
  }
}

/**
 * Cache for regex patterns
 * Improves performance by caching compiled regexes
 *
 * 正则表达式模式的缓存
 * 通过缓存编译后的正则表达式提高性能
 */
const matchCache = new Map<string, RegExp>()

/**
 * Create or retrieve cached regex pattern
 *
 * 创建或获取缓存的正则表达式模式
 *
 * @param match - Pattern string / 模式字符串
 * @returns Compiled regex / 编译后的正则表达式
 */
function createMatchRegex(match: string) {
  if (matchCache.has(match))
    return matchCache.get(match)!

  const regex = new RegExp(match)
  matchCache.set(match, regex)
  return regex
}

/**
 * Check if a match pattern applies to the current page
 * Supports regex patterns (starting with ^) and path patterns
 *
 * 检查匹配模式是否适用于当前页面
 * 支持正则表达式模式（以 ^ 开头）和路径模式
 *
 * @param match - Match pattern / 匹配模式
 * @param pagePath - Current page path / 当前页面路径
 * @param filePathRelative - Relative file path / 相对文件路径
 * @returns Whether the pattern matches / 模式是否匹配
 */
function toMatch(match: string, pagePath: string, filePathRelative?: string | null) {
  const relativePath = filePathRelative || ''
  if (match[0] === '^') {
    const regex = createMatchRegex(match)
    return regex.test(pagePath) || regex.test(relativePath)
  }
  if (match.endsWith('.md'))
    return relativePath && relativePath.endsWith(match)

  return pagePath.startsWith(match) || relativePath.startsWith(removeLeadingSlash(match))
}

/**
 * Setup encrypt functionality for the application
 * Initializes encryption state and provides it to child components
 *
 * 为应用程序设置加密功能
 * 初始化加密状态并提供给子组件
 */
export function setupEncrypt(): void {
  const { page } = useData()
  const route = useRoute()
  const encrypt = useEncryptData()

  /**
   * Whether the current page has encryption enabled
   * Checks page-specific encryption and rule-based encryption
   */
  const hasPageEncrypt = computed(() => {
    const pagePath = route.path
    const filePathRelative = page.value.filePathRelative
    if (page.value._e)
      return true

    return encrypt.value.ruleList.length
      ? encrypt.value.matches.some(match => toMatch(match, pagePath, filePathRelative))
      : false
  })

  /**
   * Whether global encryption is decrypted
   * Checks if any admin password hash matches the stored hash
   */
  const isGlobalDecrypted = computedAsync(async () => {
    const hash = storage.value.g
    if (!encrypt.value.global)
      return true

    for (const admin of encrypt.value.admins) {
      if (hash && hash === await md5(admin))
        return true
    }
    return false
  }, !encrypt.value.global)

  /**
   * List of encryption rules applicable to the current page
   * Includes page-specific rules and matching pattern rules
   */
  const hashList = computed(() => {
    const pagePath = route.path
    const filePathRelative = page.value.filePathRelative
    const passwords = typeof page.value._e === 'string' ? page.value._e.split(':') : []
    const pageRule: EncryptDataRule | undefined = passwords.length
      ? { key: pagePath.replace(/\//g, '').replace(/\.html$/, ''), match: pagePath, rules: passwords }
      : undefined
    const rules = encrypt.value.ruleList.length
      ? encrypt.value.ruleList
          .filter(item => toMatch(item.match, pagePath, filePathRelative))
      : []

    return [pageRule, ...rules].filter(Boolean) as EncryptDataRule[]
  })

  /**
   * Whether the current page is decrypted
   * Checks admin passwords and page-specific passwords
   */
  const isPageDecrypted = computedAsync(async () => {
    if (!hasPageEncrypt.value)
      return true

    const hash = storage.value.g

    for (const admin of encrypt.value.admins) {
      if (hash && hash === await md5(admin))
        return true
    }

    for (const { key, rules } of hashList.value) {
      const hash = storage.value.p[key]
      for (const rule of rules) {
        if (hash && hash === await md5(rule))
          return true
      }
    }

    return false
  }, !hasPageEncrypt.value)

  provide(EncryptSymbol, {
    hasPageEncrypt,
    isGlobalDecrypted,
    isPageDecrypted,
    hashList,
  })
}

/**
 * Use encrypt
 * Returns the encryption state and properties
 *
 * 获取加密功能的状态和方法，包括全局解密、页面解密、密码验证等
 *
 * @returns Encrypt state and properties / 加密状态和属性
 * @throws Error if called without setup / 如果没有设置则抛出错误
 */
export function useEncrypt(): Encrypt {
  const result = inject(EncryptSymbol)

  if (!result)
    throw new Error('useEncrypt() is called without setup')

  return result
}

/**
 * Use encrypt compare
 * Provides password verification functions for global and page encryption
 *
 * 密码比较功能，提供全局密码和页面密码的验证方法
 *
 * @returns Object with compareGlobal and comparePage functions / 包含 compareGlobal 和 comparePage 函数的对象
 */
export function useEncryptCompare(): {
  compareGlobal: (password: string) => Promise<boolean>
  comparePage: (password: string) => Promise<boolean>
} {
  const encrypt = useEncryptData()
  const { page } = useData()
  const route = useRoute()
  const { hashList } = useEncrypt()

  /**
   * Compare global password
   * Verifies against admin passwords
   *
   * @param password - Password to verify / 要验证的密码
   * @returns Whether the password is valid / 密码是否有效
   */
  async function compareGlobal(password: string): Promise<boolean> {
    if (!password)
      return false

    for (const admin of encrypt.value.admins) {
      if (await compareDecrypt(password, admin)) {
        storage.value.g = await md5(admin)
        return true
      }
    }

    return false
  }

  /**
   * Compare page password
   * Verifies against page-specific rules and falls back to global password
   *
   * @param password - Password to verify / 要验证的密码
   * @returns Whether the password is valid / 密码是否有效
   */
  async function comparePage(password: string): Promise<boolean> {
    if (!password)
      return false

    const pagePath = route.path
    const filePathRelative = page.value.filePathRelative

    let decrypted = false

    for (const { match, key, rules } of hashList.value) {
      if (toMatch(match, pagePath, filePathRelative)) {
        for (const rule of rules) {
          if (await compareDecrypt(password, rule)) {
            decrypted = true
            storage.value.p[key] = await md5(rule)
            break
          }
        }
        if (decrypted)
          break
      }
    }

    if (!decrypted) {
      decrypted = await compareGlobal(password)
    }

    return decrypted
  }

  return { compareGlobal, comparePage }
}
