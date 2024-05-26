import { compareSync, genSaltSync } from 'bcrypt-ts/browser'
import { type Ref, computed } from 'vue'
import { hasOwn, useSessionStorage } from '@vueuse/core'
import { useRoute } from 'vuepress/client'
import { useData } from './data.js'

declare const __PLUME_ENCRYPT_GLOBAL__: boolean
declare const __PLUME_ENCRYPT_SEPARATOR__: string
declare const __PLUME_ENCRYPT_ADMIN__: string
declare const __PLUME_ENCRYPT_KEYS__: string[]
declare const __PLUME_ENCRYPT_RULES__: Record<string, string>

const global = __PLUME_ENCRYPT_GLOBAL__
const separator = __PLUME_ENCRYPT_SEPARATOR__
const admin = __PLUME_ENCRYPT_ADMIN__
const matches = __PLUME_ENCRYPT_KEYS__
const rules = __PLUME_ENCRYPT_RULES__

const admins = admin.split(separator)

const ruleList = Object.keys(rules).map(key => ({
  key,
  match: matches[key] as string,
  rules: rules[key].split(separator),
}))

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

const cache = new Map<string, boolean>()
function compare(content: string, hash: string) {
  const key = [content, hash].join(separator)
  if (cache.has(key))
    return cache.get(key)

  const result = compareSync(content, hash)
  cache.set(key, result)
  return result
}

export function useGlobalEncrypt(): {
  isGlobalDecrypted: Ref<boolean>
  compareGlobal: (password: string) => boolean
} {
  const isGlobalDecrypted = computed(() => {
    if (!global)
      return true

    const hash = splitHash(storage.value.g)

    return !!hash && admins.includes(hash)
  })

  function compareGlobal(password: string) {
    if (!password)
      return false

    for (const admin of admins) {
      if (compare(password, admin)) {
        storage.value.g = mergeHash(admin)
        return true
      }
    }

    return false
  }

  return {
    isGlobalDecrypted,
    compareGlobal,
  }
}

export function usePageEncrypt() {
  const { page } = useData()
  const route = useRoute()

  const hasPageEncrypt = computed(() => ruleList.length ? matches.some(toMatch) : false)

  const hashList = computed(() => ruleList.length
    ? ruleList
      .filter(item => toMatch(item.match))
    : [])

  const isPageDecrypted = computed(() => {
    if (!hasPageEncrypt.value)
      return true

    const hash = splitHash(storage.value.p.__GLOBAL__ || '')
    if (hash && admins.includes(hash))
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

  function toMatch(match: string) {
    const relativePath = page.value.filePathRelative || ''
    if (match[0] === '^') {
      const regex = new RegExp(match)
      return regex.test(route.path) || (relativePath && regex.test(relativePath))
    }
    if (match.endsWith('.md'))
      return relativePath && relativePath.endsWith(match)

    return route.path.startsWith(match) || relativePath.startsWith(match)
  }

  function comparePage(password: string) {
    if (!password)
      return false

    let decrypted = false

    // check global
    for (const admin of admins) {
      if (compare(password, admin)) {
        decrypted = true
        storage.value.p = {
          ...storage.value.p,
          __GLOBAL__: mergeHash(admin),
        }
        break
      }
    }
    // check page
    if (!decrypted) {
      for (const { match, key, rules } of hashList.value) {
        if (toMatch(match)) {
          for (const rule of rules) {
            if (compare(password, rule)) {
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
    }

    return decrypted
  }

  return {
    isPageDecrypted,
    comparePage,
  }
}
