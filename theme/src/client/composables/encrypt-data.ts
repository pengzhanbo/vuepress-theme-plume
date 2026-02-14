import type { Ref } from 'vue'
import { encrypt as rawEncrypt } from '@internal/encrypt'
import { decodeData } from '@vuepress/helper/client'
import { ref } from 'vue'

/**
 * Encrypt configuration tuple type
 * Contains keys, rules, global flag, and admin passwords
 *
 * 加密配置元组类型
 * 包含密钥、规则、全局标志和管理员密码
 */
export type EncryptConfig = readonly [
  keys: string, // keys / 密钥
  rules: string, // rules / 规则
  global: number, // global / 全局标志
  admin: string, // admin / 管理员密码
]

/**
 * Encrypt data rule interface
 * Defines a single encryption rule with matching pattern and passwords
 *
 * 加密数据规则接口
 * 定义单个加密规则，包含匹配模式和密码
 */
export interface EncryptDataRule {
  /** Unique key for the rule / 规则的唯一键 */
  key: string
  /** Match pattern for the rule / 规则的匹配模式 */
  match: string
  /** Array of valid passwords / 有效密码数组 */
  rules: string[]
}

/**
 * Encrypt data interface
 * Contains all encryption configuration and rules
 *
 * 加密数据接口
 * 包含所有加密配置和规则
 */
export interface EncryptData {
  /** Whether global encryption is enabled / 是否启用全局加密 */
  global: boolean
  /** Array of admin password hashes / 管理员密码哈希数组 */
  admins: string[]
  /** Array of match patterns / 匹配模式数组 */
  matches: string[]
  /** Array of encryption rules / 加密规则数组 */
  ruleList: EncryptDataRule[]
}

/**
 * Encrypt data reference type
 *
 * 加密数据引用类型
 */
export type EncryptRef = Ref<EncryptData>

/**
 * Global encrypt data reference
 *
 * 全局加密数据引用
 */
export const encrypt: EncryptRef = ref(resolveEncryptData(rawEncrypt))

/**
 * Use encrypt data
 * Returns the global encrypt data reference
 *
 * 获取加密数据
 * 返回全局加密数据引用
 *
 * @returns Encrypt data reference / 加密数据引用
 */
export function useEncryptData(): EncryptRef {
  return encrypt as EncryptRef
}

/**
 * Resolve encrypt data from raw configuration
 * Decodes and parses the raw encrypt configuration
 *
 * 从原始配置解析加密数据
 * 解码并解析原始加密配置
 * @param data - Raw encrypt configuration / 原始加密配置
 * @param data."0" rawKeys - Encoded keys string / 编码的密钥字符串
 * @param data."1" rawRules - Encoded rules string / 编码的规则字符串
 * @param data."2" global - Global encryption flag / 全局加密标志
 * @param data."3" admin - Admin passwords string / 管理员密码字符串
 * @returns Parsed encrypt data / 解析后的加密数据
 */
function resolveEncryptData(
  [rawKeys, rawRules, global, admin]: EncryptConfig,
): EncryptData {
  const keys = unwrapData<string[]>(rawKeys).map(key => decodeData(key))
  const rules = unwrapData<Record<string, string>>(rawRules)
  const separator = ':'
  return {
    global: !!global,
    matches: keys,
    admins: admin.split(separator),
    ruleList: Object.keys(rules).map(key => ({
      key,
      match: keys[key],
      rules: rules[key].split(separator),
    })),
  }
}

/**
 * Unwrap and decode data from raw string
 *
 * 从原始字符串解包和解码数据
 *
 * @param raw - Raw encoded string / 原始编码字符串
 * @returns Parsed data / 解析后的数据
 */
function unwrapData<T>(raw: string): T {
  return JSON.parse(decodeData(raw)) as T
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateEncrypt = (data: EncryptConfig) => {
    encrypt.value = resolveEncryptData(data)
  }
}
