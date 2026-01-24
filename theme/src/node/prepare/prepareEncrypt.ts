import type { App } from 'vuepress'
import type { Page } from 'vuepress/core'
import type { EncryptOptions, ThemePageData } from '../../shared/index.js'
import type { FsCache } from '../utils/index.js'
import { isEmptyObject, isNumber, isString, toArray } from '@pengzhanbo/utils'
import { encodeData, removeLeadingSlash } from '@vuepress/helper'
import pMap from 'p-map'
import { getThemeConfig } from '../loadConfig/index.js'
import { createFsCache, genEncrypt, hash, perf, resolveContent, writeTemp } from '../utils/index.js'

export type EncryptConfig = readonly [
  keys: string, // keys
  rules: string, // rules
  global: number, // global
  admin: string, // admin
]

const isStringLike = (value: unknown): boolean => isString(value) || isNumber(value)

const separator = ':'
let contentHash = ''
let fsCache: FsCache<[string, EncryptConfig]> | null = null

export async function prepareEncrypt(app: App): Promise<void> {
  perf.mark('prepare:encrypt')
  const { encrypt } = getThemeConfig()
  if (!fsCache && app.env.isDev) {
    fsCache = createFsCache(app, 'encrypt')
    await fsCache.read()
  }
  contentHash = fsCache?.data?.[0] ?? ''
  let resolvedEncrypt = fsCache?.data?.[1]
  const currentHash = encrypt ? hash(JSON.stringify(encrypt)) : ''

  if (!contentHash || contentHash !== currentHash || !resolvedEncrypt) {
    contentHash = currentHash
    resolvedEncrypt = await resolveEncrypt(encrypt)
  }
  await writeTemp(app, 'internal/encrypt.js', resolveContent(app, {
    name: 'encrypt',
    content: resolvedEncrypt,
  }))

  fsCache?.write([currentHash, resolvedEncrypt])

  perf.log('prepare:encrypt')
}

async function resolveEncrypt(encrypt?: EncryptOptions): Promise<EncryptConfig> {
  const admin = encrypt?.admin
    ? (await pMap(
        toArray(encrypt.admin).filter(isStringLike),
        item => genEncrypt(item),
      )).join(separator)
    : ''

  const encryptRules = Object.keys(encrypt?.rules ?? {}).reduce((acc, key) => {
    acc[encodeData(key)] = encrypt!.rules![key]
    return acc
  }, {} as Record<string, string | string[]>)

  const rules: Record<string, string> = {}
  const keys = Object.keys(encryptRules)

  if (!isEmptyObject(encryptRules)) {
    for (const key of keys) {
      const index = keys.indexOf(key)
      rules[String(index)] = (await pMap(
        toArray(encryptRules[key]).filter(isStringLike),
        item => genEncrypt(item),
      )).join(separator)
    }
  }

  return [
    encodeData(JSON.stringify(keys)), // keys
    encodeData(JSON.stringify(rules)), // rules
    encrypt?.global ? 1 : 0, // global
    admin, // admin
  ]
}

export function isEncryptPage(page: Page<ThemePageData>, encrypt?: EncryptOptions): boolean {
  if (!encrypt)
    return false

  if (page.data._e)
    return true

  const rules = encrypt.rules ?? {}

  return Object.keys(rules).some((match) => {
    const relativePath = page.data.filePathRelative || ''
    if (match[0] === '^') {
      const regex = new RegExp(match)
      return regex.test(page.path) || regex.test(relativePath)
    }
    if (match.endsWith('.md'))
      return relativePath.endsWith(match)

    return page.path.startsWith(match) || relativePath.startsWith(removeLeadingSlash(match))
  })
}
