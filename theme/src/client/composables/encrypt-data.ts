import type { Ref } from 'vue'
import { encrypt as rawEncrypt } from '@internal/encrypt'
import { ref } from 'vue'

export type EncryptConfig = readonly [
  boolean, // global
  string, // separator
  string, // admin
  string[], // keys
  Record<string, string>, // rules
]

export interface EncryptDataRule {
  key: string
  match: string
  rules: string[]
}

export interface EncryptData {
  global: boolean
  separator: string
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
  [global, separator, admin, matches, rules]: EncryptConfig,
): EncryptData {
  return {
    global,
    separator,
    matches,
    admins: admin.split(separator),
    ruleList: Object.keys(rules).map(key => ({
      key,
      match: matches[key] as string,
      rules: rules[key].split(separator),
    })),
  }
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateEncrypt = (data: EncryptConfig) => {
    encrypt.value = resolveEncryptData(data)
  }
}
