import type { InjectionKey, Ref } from 'vue'
import { hasOwn, useSessionStorage } from '@vueuse/core'
import { compare, genSaltSync } from 'bcrypt-ts/browser'
import { computed, inject, provide } from 'vue'
import { useRoute } from 'vuepress/client'
import { useData } from './data.js'
import { type EncryptDataRule, useEncryptData } from './encrypt-data.js'

export interface Encrypt {
  hasPageEncrypt: Ref<boolean>
  isGlobalDecrypted: Ref<boolean>
  isPageDecrypted: Ref<boolean>
  hashList: Ref<EncryptDataRule[]>
}

export const EncryptSymbol: InjectionKey<Encrypt> = Symbol(
  __VUEPRESS_DEV__ ? 'Encrypt' : '',
)

const storage = useSessionStorage('2a0a3d6afb2fdf1f', () => ({
  s: [genSaltSync(10), genSaltSync(10)] as const,
  g: '' as string,
  p: {} as Record<string, string>,
}))

function mergeHash(hash: string) {
  const [left, right] = storage.value.s
  return left + hash + right
}

function splitHash(hash: string) {
  const [left, right] = storage.value.s
  if (!hash.startsWith(left) || !hash.endsWith(right))
    return ''

  return hash.slice(left.length, hash.length - right.length)
}

const compareCache = new Map<string, boolean>()
async function compareDecrypt(content: string, hash: string, separator = ':'): Promise<boolean> {
  const key = [content, hash].join(separator)
  if (compareCache.has(key))
    return compareCache.get(key)!

  try {
    const result = await compare(content, hash)
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
    return regex.test(pagePath) || (relativePath && regex.test(relativePath))
  }
  if (match.endsWith('.md'))
    return relativePath && relativePath.endsWith(match)

  return pagePath.startsWith(match) || relativePath.startsWith(match)
}

export function setupEncrypt() {
  const { page } = useData()
  const route = useRoute()
  const encrypt = useEncryptData()

  const hasPageEncrypt = computed(() => {
    const pagePath = route.path
    const filePathRelative = page.value.filePathRelative
    return encrypt.value.ruleList.length
      ? encrypt.value.matches.some(match => toMatch(match, pagePath, filePathRelative))
      : false
  })

  const isGlobalDecrypted = computed(() => {
    if (!encrypt.value.global)
      return true

    const hash = splitHash(storage.value.g)

    return !!hash && encrypt.value.admins.includes(hash)
  })

  const hashList = computed(() => {
    const pagePath = route.path
    const filePathRelative = page.value.filePathRelative
    return encrypt.value.ruleList.length
      ? encrypt.value.ruleList
          .filter(item => toMatch(item.match, pagePath, filePathRelative))
      : []
  })

  const isPageDecrypted = computed(() => {
    if (!hasPageEncrypt.value)
      return true

    const hash = splitHash(storage.value.p.__GLOBAL__ || '')
    if (hash && encrypt.value.admins.includes(hash))
      return true

    for (const { key, rules } of hashList.value) {
      if (hasOwn(storage.value.p, key)) {
        const hash = splitHash(storage.value.p[key])
        if (hash && rules.includes(hash))
          return true
      }
    }

    return false
  })

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

export function useEncryptCompare() {
  const encrypt = useEncryptData()
  const { page } = useData()
  const route = useRoute()
  const { hashList } = useEncrypt()

  async function compareGlobal(password: string) {
    if (!password)
      return false

    for (const admin of encrypt.value.admins) {
      if (await compareDecrypt(password, admin, encrypt.value.separator)) {
        storage.value.g = mergeHash(admin)
        return true
      }
    }

    return false
  }

  async function comparePage(password: string) {
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
            storage.value.p = {
              ...storage.value.p,
              [key]: mergeHash(rule),
            }
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
