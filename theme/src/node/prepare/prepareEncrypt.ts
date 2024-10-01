import type { App } from 'vuepress'
import type { Page } from 'vuepress/core'
import type { PlumeThemeEncrypt, PlumeThemePageData } from '../../shared/index.js'
import { isNumber, isString, random, toArray } from '@pengzhanbo/utils'
import { genSaltSync, hashSync } from 'bcrypt-ts'
import { hash, logger, resolveContent, writeTemp } from '../utils/index.js'

export type EncryptConfig = readonly [
  boolean, // global
  string, // separator
  string, // admin
  string[], // keys
  Record<string, string>, // rules
]

const isStringLike = (value: unknown): boolean => isString(value) || isNumber(value)
const separator = ':'
let contentHash = ''

export async function prepareEncrypt(app: App, encrypt?: PlumeThemeEncrypt) {
  const start = performance.now()
  const currentHash = encrypt ? hash(JSON.stringify(encrypt)) : ''

  if (!contentHash || contentHash !== currentHash) {
    contentHash = currentHash
    const content = resolveContent(app, {
      name: 'encrypt',
      content: resolveEncrypt(encrypt),
    })
    await writeTemp(app, 'internal/encrypt.js', content)
  }
  if (app.env.isDebug) {
    logger.info(`Generate encrypt: ${(performance.now() - start).toFixed(2)}ms`)
  }
}

const salt = () => genSaltSync(random(8, 16))

function resolveEncrypt(encrypt?: PlumeThemeEncrypt): EncryptConfig {
  const admin = encrypt?.admin
    ? toArray(encrypt.admin)
      .filter(isStringLike)
      .map(item => hashSync(String(item), salt()))
      .join(separator)
    : ''

  const rules: Record<string, string> = {}
  const keys = Object.keys(encrypt?.rules ?? {})

  if (encrypt?.rules) {
    Object.keys(encrypt.rules).forEach((key) => {
      const index = keys.indexOf(key)

      rules[String(index)] = toArray(encrypt.rules![key])
        .filter(isStringLike)
        .map(item => hashSync(String(item), salt()))
        .join(separator)
    })
  }

  return [encrypt?.global ?? false, separator, admin, keys, rules]
}

export function isEncryptPage(page: Page<PlumeThemePageData>, encrypt?: PlumeThemeEncrypt) {
  if (!encrypt)
    return false

  const rules = encrypt.rules ?? {}

  return Object.keys(rules).some((match) => {
    const relativePath = page.data.filePathRelative || ''
    if (match[0] === '^') {
      const regex = new RegExp(match)
      return regex.test(page.path) || (relativePath && regex.test(relativePath))
    }
    if (match.endsWith('.md'))
      return relativePath && relativePath.endsWith(match)

    return page.path.startsWith(match) || relativePath.startsWith(match)
  })
}
