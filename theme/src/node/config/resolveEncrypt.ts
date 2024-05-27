import { genSaltSync, hashSync } from 'bcrypt-ts'
import { isNumber, isString, random, toArray } from '@pengzhanbo/utils'
import type { Page } from 'vuepress/core'
import type { PlumeThemeEncrypt, PlumeThemePageData } from '../../shared/index.js'

const isStringLike = (value: unknown): boolean => isString(value) || isNumber(value)
const separator = ':'

export function resolveEncrypt(encrypt?: PlumeThemeEncrypt) {
  const salt = () => genSaltSync(random(8, 16))

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

  return {
    __PLUME_ENCRYPT_GLOBAL__: encrypt?.global ?? false,
    __PLUME_ENCRYPT_SEPARATOR__: separator,
    __PLUME_ENCRYPT_ADMIN__: admin,
    __PLUME_ENCRYPT_KEYS__: keys,
    __PLUME_ENCRYPT_RULES__: rules,
  }
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
