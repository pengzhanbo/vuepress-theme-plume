import type { InjectionKey, Ref } from 'vue'
import type { EncryptDataRule } from './encrypt-data.js'
import { computedAsync, useSessionStorage } from '@vueuse/core'
import { bcryptVerify, md5 } from 'hash-wasm'
import { computed, inject, provide } from 'vue'
import { useRoute } from 'vuepress/client'
import { removeLeadingSlash } from 'vuepress/shared'
import { useData } from './data.js'
import { useEncryptData } from './encrypt-data.js'

export interface Encrypt {
  hasPageEncrypt: Ref<boolean>
  isGlobalDecrypted: Ref<boolean>
  isPageDecrypted: Ref<boolean>
  hashList: Ref<EncryptDataRule[]>
}

export const EncryptSymbol: InjectionKey<Encrypt> = Symbol(
  __VUEPRESS_DEV__ ? 'Encrypt' : '',
)

const storage = useSessionStorage('2a0a3d6afb2fdf1f', () => {
  if (__VUEPRESS_SSR__) {
    return { g: '', p: [] as string[] }
  }
  return {
    g: '',
    p: [] as string[],
  }
})

const compareCache = new Map<string, boolean>()
async function compareDecrypt(content: string, hash: string, separator = ':'): Promise<boolean> {
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

const matchCache = new Map<string, RegExp>()
function createMatchRegex(match: string) {
  if (matchCache.has(match))
    return matchCache.get(match)!

  const regex = new RegExp(match)
  matchCache.set(match, regex)
  return regex
}

function toMatch(match: string, pagePath: string, filePathRelative: string | null) {
  const relativePath = filePathRelative || ''
  if (match[0] === '^') {
    const regex = createMatchRegex(match)
    return regex.test(pagePath) || regex.test(relativePath)
  }
  if (match.endsWith('.md'))
    return relativePath && relativePath.endsWith(match)

  return pagePath.startsWith(match) || relativePath.startsWith(removeLeadingSlash(match))
}

export function setupEncrypt(): void {
  const { page } = useData()
  const route = useRoute()
  const encrypt = useEncryptData()

  const hasPageEncrypt = computed(() => {
    const pagePath = route.path
    const filePathRelative = page.value.filePathRelative
    if (page.value._e)
      return true

    return encrypt.value.ruleList.length
      ? encrypt.value.matches.some(match => toMatch(match, pagePath, filePathRelative))
      : false
  })

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

export function useEncrypt(): Encrypt {
  const result = inject(EncryptSymbol)

  if (!result)
    throw new Error('useEncrypt() is called without setup')

  return result
}

export function useEncryptCompare(): {
  compareGlobal: (password: string) => Promise<boolean>
  comparePage: (password: string) => Promise<boolean>
} {
  const encrypt = useEncryptData()
  const { page } = useData()
  const route = useRoute()
  const { hashList } = useEncrypt()

  async function compareGlobal(password: string): Promise<boolean> {
    if (!password)
      return false

    for (const admin of encrypt.value.admins) {
      if (await compareDecrypt(password, admin, encrypt.value.separator)) {
        storage.value.g = await md5(admin)
        return true
      }
    }

    return false
  }

  async function comparePage(password: string): Promise<boolean> {
    if (!password)
      return false

    const pagePath = route.path
    const filePathRelative = page.value.filePathRelative

    let decrypted = false

    for (const { match, key, rules } of hashList.value) {
      if (toMatch(match, pagePath, filePathRelative)) {
        for (const rule of rules) {
          if (await compareDecrypt(password, rule, encrypt.value.separator)) {
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
