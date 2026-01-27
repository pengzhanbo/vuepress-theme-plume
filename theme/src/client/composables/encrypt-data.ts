import type { Ref } from 'vue'
import { encrypt as rawEncrypt } from '@internal/encrypt'
import { decodeData } from '@vuepress/helper/client'
import { ref } from 'vue'

export type EncryptConfig = readonly [
  keys: string, // keys
  rules: string, // rules
  global: number, // global
  admin: string, // admin
]

export interface EncryptDataRule {
  key: string
  match: string
  rules: string[]
}

export interface EncryptData {
  global: boolean
  admins: string[]
  matches: string[]
  ruleList: EncryptDataRule[]
}

export type EncryptRef = Ref<EncryptData>

export const encrypt: EncryptRef = ref(resolveEncryptData(rawEncrypt))

export function useEncryptData(): EncryptRef {
  return encrypt as EncryptRef
}

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

function unwrapData<T>(raw: string): T {
  return JSON.parse(decodeData(raw)) as T
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateEncrypt = (data: EncryptConfig) => {
    encrypt.value = resolveEncryptData(data)
  }
}
